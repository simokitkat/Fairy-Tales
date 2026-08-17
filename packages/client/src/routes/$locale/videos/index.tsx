import { useI18n } from "@/i18n";
import { useCurrentLocale } from "@/lib/locale";
import { useVideos } from "@/api/queries";
import { sanitizeVideoForClient, formatDuration, formatPublishedDate, getYouTubeWatchUrl, getChannelUrl } from "@/api/adapters";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useMemo } from "react";

export default function VideosPage() {
  const { t } = useI18n();
  const locale = useCurrentLocale();

  const search = useMemo(() => new URLSearchParams(window.location.search), []);
  const page = Math.max(1, Number(search.get("page") || 1));

  const videosQuery = useVideos({ language: locale, page, pageSize: 20 });
  const videos = useMemo(
    () => videosQuery.data?.data?.map((v) => sanitizeVideoForClient(v)) ?? [],
    [videosQuery.data]
  );
  const total = videosQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  if (videosQuery.isLoading) {
    return (
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
    );
  }

  if (videosQuery.isError) {
    return (
      <ErrorState
        title={t("errors.genericTitle")}
        message={t("errors.networkMessage")}
        onRetry={() => videosQuery.refetch()}
        retryLabel={t("common.tryAgain")}
      />
    );
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        title={t("videos.empty")}
        description={t("videos.emptyTryAdjusting")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          {t("videos.title")}
        </h1>
        <p className="mt-1 text-ink/70">{t("videos.description")}</p>
      </div>

      <p className="text-sm text-ink/70">
        {t("videos.showingResults", {
          start: (page - 1) * 20 + 1,
          end: Math.min(page * 20, total),
          total,
        })}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.youtubeId} className="overflow-hidden" hoverable>
            <a href={`/${locale}/videos/${video.youtubeId}`} className="block">
              <div className="aspect-video bg-cloud relative">
                <img
                  src={video.thumbnailUrl || "https://via.placeholder.com/480x360?text=No+Image"}
                  alt={t("accessibility.videoThumbnail", { title: video.title })}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {video.durationSeconds != null && (
                  <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-2 py-0.5 text-xs text-white">
                    {formatDuration(video.durationSeconds)}
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-ink line-clamp-2">{video.title}</h3>
                <p className="text-sm text-ink/70">{video.channel.title}</p>
                <p className="text-xs text-ink/60">
                  {formatPublishedDate(video.publishedAt, locale)}
                </p>
              </div>
            </a>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          const url = new URL(window.location.href);
          url.searchParams.set("page", String(newPage));
          window.location.href = url.toString();
        }}
      />
    </div>
  );
}
