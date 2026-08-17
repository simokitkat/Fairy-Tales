import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "./constants";

type LocaleResource = Record<string, unknown>;
type LocaleLoader = () => Promise<LocaleResource>;

const localeModules = import.meta.glob("./locales/*.json", {
  import: "default",
}) as Record<string, LocaleLoader>;

const localeFiles = Object.keys(localeModules)
  .map((path) => {
    const fileName = path.split("/").pop() ?? path;
    const code = fileName.replace(/\.json$/, "");
    return { code, path, load: localeModules[path] };
  })
  .sort((a, b) => a.code.localeCompare(b.code));

const supportedLocales = localeFiles.map(({ code }) => code);

const defaultLocale = supportedLocales.includes(DEFAULT_LOCALE)
  ? DEFAULT_LOCALE
  : localeFiles[0]?.code ?? DEFAULT_LOCALE;

const localeMetadata: Record<string, { nativeName: string; direction: "ltr" | "rtl" }> = {};

async function loadResources(): Promise<Record<string, { translation: LocaleResource }>> {
  const resources: Record<string, { translation: LocaleResource }> = {};
  for (const { code, load } of localeFiles) {
    try {
      const data = await load();
      resources[code] = { translation: data };
      const meta = data?.meta as Record<string, string> | undefined;
      if (meta?.nativeName && meta?.direction) {
        localeMetadata[code] = { nativeName: meta.nativeName, direction: meta.direction as "ltr" | "rtl" };
      }
    } catch {
      continue;
    }
  }
  return resources;
}

function getStoredLocale(): string | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && supportedLocales.includes(stored)) return stored;
  } catch {
    // ignore storage errors
  }
  return null;
}

function getUrlLocale(): string | null {
  try {
    const pathLocale = window.location.pathname.split("/").filter(Boolean)[0];
    if (pathLocale && supportedLocales.includes(pathLocale)) return pathLocale;

    const params = new URLSearchParams(window.location.search);
    const lng = params.get("lang");
    if (lng && supportedLocales.includes(lng)) return lng;
  } catch {
    // ignore
  }
  return null;
}

const initialLng = getUrlLocale() ?? getStoredLocale() ?? defaultLocale;

async function initializeI18n() {
  const resources = await loadResources();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLng,
      fallbackLng: defaultLocale,
      supportedLngs: supportedLocales,
      react: { useSuspense: false },
    });

  setDocumentDirection(initialLng, localeMetadata[initialLng]);
}

export const i18nReady = initializeI18n().catch(async () => {
  await i18n
    .use(initReactI18next)
    .init({
      lng: defaultLocale,
      fallbackLng: defaultLocale,
      supportedLngs: supportedLocales,
      react: { useSuspense: false },
    });
  setDocumentDirection(defaultLocale, localeMetadata[defaultLocale]);
});

export { i18n };

export function useI18n() {
  return useTranslation();
}

export function getSupportedLocales(): string[] {
  return [...supportedLocales];
}

export function getLocaleMetadata(code: string): { nativeName: string; direction: "ltr" | "rtl" } | undefined {
  return localeMetadata[code];
}

export function getDefaultLocale(): string {
  return defaultLocale;
}

export function validateLocale(code: string): boolean {
  return supportedLocales.includes(code);
}

export function setDocumentDirection(locale: string, metadata?: { nativeName: string; direction: "ltr" | "rtl" }): void {
  if (!metadata) {
    metadata = localeMetadata[locale];
  }
  const root = document.documentElement;
  root.lang = locale;
  root.dir = metadata?.direction ?? "ltr";
}
