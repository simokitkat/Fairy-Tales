import { useEffect } from "react";
import { Outlet, useParams } from "@tanstack/react-router";
import i18n from "@/i18n";

export function LocaleLayout() {
  const { locale } = useParams({ from: "/$locale" });
  useEffect(() => {
    if (locale === "en" || locale === "ru") i18n.changeLanguage(locale);
  }, [locale]);
  return (
    <div>
      <p className="text-sm text-gray-500">Locale: {locale}</p>
      <Outlet />
    </div>
  );
}
