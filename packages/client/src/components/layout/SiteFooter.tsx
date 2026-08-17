import { useI18n } from "@/i18n";

export default function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border py-6 text-center text-sm text-ink/60">
      {t("home.title")}
    </footer>
  );
}
