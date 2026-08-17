import { useI18n } from "@/i18n";
import { useCurrentLocale } from "@/lib/locale";
import { useChannels, useTales } from "@/api/queries";
import StoryGrid from "@/components/stories/StoryGrid";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  const { t } = useI18n();
  const locale = useCurrentLocale();

  const talesQuery = useTales({ language: locale, pageSize: 6 });
  const channelsQuery = useChannels();

  const tales = talesQuery.data?.data ?? [];
  const channels = channelsQuery.data ?? [];

  return (
    <div className="space-y-12">
      <section className="rounded-xl bg-atlas/5 p-8 md:p-12">
        <h1 className="font-display text-3xl font-semibold text-atlas md:text-4xl">
          {t("home.heroTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/80">
          {t("home.heroDescription")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`/${locale}/stories`}
            className="inline-flex items-center rounded-lg bg-periwinkle px-5 py-2.5 font-medium text-white hover:bg-atlas transition-colors"
          >
            {t("home.browseStories")}
          </a>
          <a
            href={`/${locale}/videos`}
            className="inline-flex items-center rounded-lg border border-border bg-white px-5 py-2.5 font-medium text-ink hover:bg-cloud transition-colors"
          >
            {t("home.watchVideos")}
          </a>
          <a
            href={`/${locale}/channels`}
            className="inline-flex items-center rounded-lg border border-border bg-white px-5 py-2.5 font-medium text-ink hover:bg-cloud transition-colors"
          >
            {t("home.exploreChannels")}
          </a>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">
            {t("home.latestStories")}
          </h2>
          <a
            href={`/${locale}/stories`}
            className="text-sm font-medium text-periwinkle hover:text-atlas transition-colors"
          >
            {t("home.browseStories")}
          </a>
        </div>
        <div className="mt-6">
          {talesQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-border bg-white">
                  <Skeleton variant="rectangular" className="aspect-video w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton variant="text" className="h-5 w-3/4" />
                    <Skeleton variant="text" className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <StoryGrid tales={tales} locale={locale} />
          )}
        </div>
      </section>

      {channels.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">
            {t("channels.title")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {channels.slice(0, 8).map((channel) => (
              <span
                key={channel.id}
                className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-sm"
              >
                {channel.title}
                {channel.handle && (
                  <a
                    href={`https://www.youtube.com/@${channel.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-periwinkle hover:text-atlas"
                  >
                    YouTube
                  </a>
                )}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
