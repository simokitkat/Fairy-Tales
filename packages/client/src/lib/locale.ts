import { getLocaleMetadata, validateLocale as isLocaleValid } from "@/i18n";
import type { LocaleMetadata } from "@/i18n/types";

export function getLocaleDisplayName(code: string, currentLocale: string): string {
  try {
    const displayNames = new Intl.DisplayNames([currentLocale], { type: "language" });
    const resolved = displayNames.of(code);
    if (resolved) return resolved;
  } catch {
    // ignore
  }
  const metadata = getLocaleMetadata(code);
  return metadata?.nativeName ?? code.toUpperCase();
}

export function getDirection(locale: string): "ltr" | "rtl" {
  const metadata = getLocaleMetadata(locale);
  return metadata?.direction ?? "ltr";
}

export function setPageDirection(locale: string): void {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = getDirection(locale);
}

export function useCurrentLocale(): string {
  if (typeof window === "undefined") return "en";

  const pathLocale = window.location.pathname.split("/").filter(Boolean)[0];
  if (pathLocale && isLocaleValid(pathLocale)) return pathLocale;

  try {
    const stored = localStorage.getItem("fairy-tales:locale");
    if (stored && isLocaleValid(stored)) return stored;
  } catch {
    // ignore
  }
  return "en";
}

export function switchLocale(locale: string, currentPath: string): string {
  if (!isLocaleValid(locale)) return currentPath;
  const segments = currentPath.split("/").filter(Boolean);
  if (segments.length === 0) return `/${locale}`;
  segments[0] = locale;
  return `/${segments.join("/")}`;
}
