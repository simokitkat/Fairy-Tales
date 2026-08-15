import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="flex items-center justify-between border-b p-4">
      <h1 className="text-2xl font-semibold">{t("appTitle")}</h1>
      <LanguageSwitcher />
    </header>
  );
}
