import { useI18n } from "@/i18n";
import { getSupportedLocales, getLocaleMetadata, validateLocale } from "@/i18n";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "@/i18n/constants";
import { useCurrentLocale, switchLocale } from "@/lib/locale";
import { Button } from "@/components/ui/Button";
import { useMemo } from "react";

export default function LocaleSwitcher() {
  const { t } = useI18n();
  const currentLocale = useCurrentLocale();
  const locales = useMemo(() => getSupportedLocales(), []);

  const handleSwitch = (locale: string) => {
    if (locale === currentLocale) return;
    const newPath = switchLocale(locale, window.location.pathname);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore storage errors
    }
    window.location.href = newPath;
  };

  return (
    <div className="flex gap-1" role="group" aria-label={t("accessibility.languageSwitcher")}>
      {locales.map((locale) => {
        const metadata = getLocaleMetadata(locale);
        const label = metadata?.nativeName ?? locale.toUpperCase();
        const isActive = locale === currentLocale;
        return (
          <Button
            key={locale}
            variant={isActive ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleSwitch(locale)}
            aria-pressed={isActive}
            aria-label={`${t("navigation.selectLanguage")}: ${label}`}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
