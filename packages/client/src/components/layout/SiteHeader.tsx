import { useI18n } from "@/i18n";
import { useCurrentLocale } from "@/lib/locale";
import LocaleSwitcher from "./LocaleSwitcher";

export default function SiteHeader() {
  const { t } = useI18n();
  const locale = useCurrentLocale();

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href={`/${locale}`} className="font-display text-xl font-semibold text-atlas">
          {t("home.title")}
        </a>
        <nav className="flex items-center gap-4" aria-label={t("accessibility.mainNavigation")}>
          <a
            href={`/${locale}/stories`}
            className="text-sm font-medium text-ink/80 hover:text-atlas transition-colors"
          >
            {t("navigation.stories")}
          </a>
          <a
            href={`/${locale}/videos`}
            className="text-sm font-medium text-ink/80 hover:text-atlas transition-colors"
          >
            {t("navigation.videos")}
          </a>
          <a
            href={`/${locale}/channels`}
            className="text-sm font-medium text-ink/80 hover:text-atlas transition-colors"
          >
            {t("navigation.channels")}
          </a>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
