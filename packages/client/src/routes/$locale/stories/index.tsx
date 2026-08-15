import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { getTales } from "@/lib/api";
import type { TaleCard } from "@/lib/types";
import { LanguageFilter } from "@/components/LanguageFilter";
import { TaleGrid } from "@/components/TaleGrid";
import { Pagination } from "@/components/Pagination";

const LIMIT = 20;
const ALL_LANGUAGES = ["en", "ru"];

export function StoriesPage() {
  const { locale } = useParams({ from: "/$locale/stories" });
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.searchStr ?? "");
  const page = Number(urlParams.get("page") ?? "1");
  const urlLang = urlParams.get("languages");
  const languages = useMemo(() => {
    const p = new URLSearchParams(location.searchStr ?? "");
    const ul = p.get("languages");
    return ul && ul.length > 0 ? ul.split(",") : [locale];
  }, [locale, location.searchStr]);

  const [tales, setTales] = useState<TaleCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTales = async () => {
      setLoading(true);
      try {
        const res = await getTales({
          language: locale,
          availableIn: languages,
          limit: LIMIT,
          offset: (page - 1) * LIMIT,
        });
        setTales(res.data);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    };
    fetchTales();
  }, [locale, languages, page]);

  const goToPage = (newPage: number) => {
    const p = new URLSearchParams(location.searchStr ?? "");
    p.set("page", String(newPage));
    navigate({ to: `/${locale}/stories?${p.toString()}` });
  };

  const applyLanguages = (newLangs: string[]) => {
    const p = new URLSearchParams();
    p.set("languages", newLangs.join(","));
    p.set("page", "1");
    navigate({ to: `/${locale}/stories?${p.toString()}` });
  };

  return (
    <div className="flex gap-6">
      <aside className="w-64 flex-shrink-0">
        <LanguageFilter
          languages={ALL_LANGUAGES}
          selected={languages}
          onChange={applyLanguages}
        />
      </aside>
      <main className="flex-1">
        <TaleGrid tales={tales} loading={loading} locale={locale} />
        <Pagination
          page={page}
          total={total}
          limit={LIMIT}
          onPageChange={goToPage}
        />
      </main>
    </div>
  );
}
