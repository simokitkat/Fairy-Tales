import { useMemo } from "react";
import { useI18n } from "@/i18n";
import { useCurrentLocale } from "@/lib/locale";
import { useTales, useChannels } from "@/api/queries";
import StoryGrid from "@/components/stories/StoryGrid";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function StoriesPage() {
  const { t } = useI18n();
  const locale = useCurrentLocale();

  const search = useMemo(() => new URLSearchParams(window.location.search), []);
  const page = Math.max(1, Number(search.get("page") || 1));
  const availableIn = search.getAll("availableIn").filter(Boolean);

  const talesQuery = useTales({
    language: locale,
    availableIn,
    page,
    pageSize: 20,
  });
  const channelsQuery = useChannels();

  const tales = talesQuery.data?.data ?? [];
  const total = talesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));
  const channelLanguages = useMemo(() => {
    const langs = new Set(channelsQuery.data?.map((c) => c.language) ?? []);
    return Array.from(langs).sort();
  }, [channelsQuery.data]);

  if (talesQuery.isError) {
    return (
      <ErrorState
        title={t("errors.genericTitle")}
        message={t("errors.networkMessage")}
        onRetry={() => talesQuery.refetch()}
        retryLabel={t("common.tryAgain")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            {t("stories.title")}
          </h1>
          <p className="mt-1 text-ink/70">{t("stories.description")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full lg:w-64 shrink-0">
          <fieldset className="space-y-3 rounded-lg border border-border bg-white p-4">
            <legend className="text-sm font-medium text-ink">
              {t("stories.filterByLanguage")}
            </legend>
            <button
              type="button"
              onClick={() => {
                const url = new URL(window.location.href);
                url.search = "";
                window.location.href = url.toString();
              }}
              className="text-xs text-periwinkle hover:text-atlas"
            >
              {t("stories.clearFilters")}
            </button>
            <div className="space-y-2">
              {channelLanguages.map((lang) => {
                const checked = availableIn.includes(lang);
                return (
                  <label key={lang} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const url = new URL(window.location.href);
                        const current = url.searchParams
                          .getAll("availableIn")
                          .filter(Boolean);
                        if (checked) {
                          url.searchParams.delete("availableIn");
                          current
                            .filter((l) => l !== lang)
                            .forEach((l) =>
                              url.searchParams.append("availableIn", l),
                            );
                        } else {
                          url.searchParams.append("availableIn", lang);
                        }
                        url.searchParams.set("page", "1");
                        window.location.href = url.toString();
                      }}
                      className="h-4 w-4 rounded border-border text-periwinkle focus:ring-periwinkle"
                    />
                    {lang.toUpperCase()}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </aside>

        <div className="flex-1 space-y-4">
          {talesQuery.isLoading ? (
            <StoryGrid tales={[]} locale={locale} loading />
          ) : talesQuery.isError ? (
            <ErrorState
              title={t("errors.genericTitle")}
              message={t("errors.networkMessage")}
              onRetry={() => (talesQuery as any).refetch?.()}
              retryLabel={t("common.tryAgain")}
            />
          ) : tales.length === 0 ? (
            <EmptyState
              title={t("stories.empty")}
              description={t("stories.emptyTryAdjusting")}
            />
          ) : (
            <>
              <p className="text-sm text-ink/70">
                {t("stories.showingResults", {
                  start: (page - 1) * 20 + 1,
                  end: Math.min(page * 20, total),
                  total,
                })}
              </p>
              <StoryGrid tales={tales} locale={locale} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("page", String(newPage));
                  window.location.href = url.toString();
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
