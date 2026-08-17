import { useI18n } from "@/i18n";
import { useCurrentLocale } from "@/lib/locale";
import { useChannels } from "@/api/queries";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useMemo } from "react";

export default function ChannelsPage() {
  const { t } = useI18n();
  const locale = useCurrentLocale();
  const channelsQuery = useChannels();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof channelsQuery.data>();
    for (const channel of channelsQuery.data ?? []) {
      const lang = channel.language;
      if (!map.has(lang)) map.set(lang, []);
      map.get(lang)!.push(channel);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [channelsQuery.data]);

  if (channelsQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-white p-4">
            <Skeleton variant="text" className="h-5 w-3/4" />
            <Skeleton variant="text" className="h-4 w-1/2 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (channelsQuery.isError) {
    return (
      <ErrorState
        title={t("errors.genericTitle")}
        message={t("errors.networkMessage")}
        onRetry={() => channelsQuery.refetch()}
        retryLabel={t("common.tryAgain")}
      />
    );
  }

  if (grouped.length === 0) {
    return <EmptyState title={t("channels.empty")} description={""} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          {t("channels.title")}
        </h1>
        <p className="mt-1 text-ink/70">{t("channels.description")}</p>
      </div>

      {grouped.map(([lang, langs]) => {
        if (!langs) return null;
        return (
          <section key={lang} className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-ink">
              {lang.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {langs.map((channel) => (
                <div
                  key={channel.id}
                  className="rounded-lg border border-border bg-white p-4 flex flex-col gap-2"
                >
                  <h3 className="font-medium text-ink">{channel.title}</h3>
                  {channel.handle ? (
                    <a
                      href={`https://www.youtube.com/${channel.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-cloud transition-colors"
                    >
                      {t("channels.visitChannel")}
                    </a>
                  ) : (
                    <span className="text-xs text-ink/60">
                      {t("channels.noHandle")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
