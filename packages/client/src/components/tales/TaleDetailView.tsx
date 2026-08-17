import { useI18n } from "@/i18n";
import { useCurrentLocale } from "@/lib/locale";
import { useTale } from "@/api/queries";
import { sanitizeTaleForClient, selectTaleTranslations } from "@/api/adapters";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { LanguageChip } from "@/components/ui/LanguageChip";
import SourceVideoPlayers from "@/components/videos/SourceVideoPlayers";

export default function TaleDetailView() {
  const { t } = useI18n();
  const locale = useCurrentLocale();

  const params = useTaleParams();
  const slug = params?.slug ?? "";
  const taleQuery = useTale(slug, locale);

  if (taleQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" className="h-8 w-3/4" />
        <Skeleton variant="rectangular" className="aspect-video w-full" />
        <div className="space-y-2">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (taleQuery.isError || !taleQuery.data) {
    return (
      <ErrorState
        title={t("tale.notFound")}
        message={t("errors.notFoundMessage")}
      />
    );
  }

  const tale = sanitizeTaleForClient(taleQuery.data, locale);
  const translations = selectTaleTranslations(taleQuery.data);

  return (
    <article className="space-y-6">
      <a
        href={`/${locale}/stories`}
        className="inline-flex items-center text-sm text-periwinkle hover:text-atlas"
      >
        {t("tale.backToStories")}
      </a>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="aspect-video w-full bg-cloud">
          <img
            src={tale.thumbnailUrl || "https://via.placeholder.com/480x360?text=No+Image"}
            alt={tale.title}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
        <div className="p-6 md:p-8 space-y-4">
          <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">
            {tale.title}
          </h1>
          {tale.title !== tale.canonicalTitle && (
            <p className="text-sm text-ink/70 italic">
              {t("tale.sourceTitle")}: {tale.canonicalTitle}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {translations.map((tr) => (
              <LanguageChip
                key={tr.language}
                language={tr.language}
                isActive={tr.language === locale}
                label={tr.title}
              />
            ))}
          </div>

          <SourceVideoPlayers videos={tale.videos ?? []} locale={locale} />
        </div>
      </div>
    </article>
  );
}

function useTaleParams() {
  // TanStack Router v1.170 params hook
  // This is a simplified version - actual implementation depends on router version
  try {
    // @ts-ignore - dynamic import for router internals
    const { useParams } = require("@tanstack/react-router");
    return useParams();
  } catch {
    // Fallback: parse from URL
    if (typeof window !== "undefined") {
      const match = window.location.pathname.match(/\/tales\/([^/]+)/);
      return match ? { slug: match[1] } : {};
    }
    return {};
  }
}
