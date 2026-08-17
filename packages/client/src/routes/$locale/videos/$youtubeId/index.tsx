import { useI18n } from "@/i18n";
import { useCurrentLocale } from "@/lib/locale";
import { useVideo } from "@/api/queries";
import {
  sanitizeVideoDetailForClient,
  formatDuration,
  formatPublishedDate,
  getYouTubeWatchUrl,
} from "@/api/adapters";
import SourceVideoPlayers, {
  YouTubePlayer,
} from "@/components/videos/SourceVideoPlayers";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";

export default function VideoDetailPage() {
  const { t } = useI18n();
  const locale = useCurrentLocale();

  // Extract youtubeId from URL
  const youtubeId = useYoutubeId();
  const videoQuery = useVideo(youtubeId);

  if (videoQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rectangular" className="aspect-video w-full" />
        <Skeleton variant="text" className="h-8 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
    );
  }

  if (videoQuery.isError || !videoQuery.data) {
    return (
      <ErrorState
        title={t("videos.notFound")}
        message={t("errors.notFoundMessage")}
      />
    );
  }

  const video = sanitizeVideoDetailForClient(videoQuery.data);

  return (
    <div className="space-y-6">
      <a
        href={`/${locale}/videos`}
        className="inline-flex items-center text-sm text-periwinkle hover:text-atlas"
      >
        {t("videos.backToVideos")}
      </a>

      <Card className="overflow-hidden">
        <YouTubePlayer video={video} locale={locale} />
        <div className="p-6 space-y-4">
          <h1 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            {video.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-ink/70">
            <span>{video.channel.title}</span>
            <span>{formatPublishedDate(video.publishedAt, locale)}</span>
            <span>{formatDuration(video.durationSeconds)}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={getYouTubeWatchUrl(video.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-periwinkle px-5 py-2.5 font-medium text-white hover:bg-atlas transition-colors"
            >
              {t("videos.watchOnYouTube")}
            </a>
          </div>

          {video.fairyTale && (
            <SourceVideoPlayers
              title={t("videos.sameStoryVideos")}
              locale={locale}
              videos={video.fairyTale.videos.filter(
                (relatedVideo) => relatedVideo.youtubeId !== video.youtubeId,
              )}
            />
          )}

          {!video.fairyTale && (
            <p className="text-sm text-ink/70">{t("videos.unlinkedVideo")}</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function useYoutubeId(): string {
  if (typeof window === "undefined") return "";
  const match = window.location.pathname.match(/\/videos\/([^/]+)/);
  return match ? match[1] : "";
}
