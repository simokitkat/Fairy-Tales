import { useI18n } from "@/i18n";
import { getLocaleDisplayName } from "@/lib/locale";
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from "@/api/adapters";

export interface VideoPlayerData {
  id?: string;
  youtubeId: string;
  title: string;
  thumbnailUrl: string | null;
  embeddable: boolean | null;
  channel: {
    language: string;
    title: string;
  };
}

interface YouTubePlayerProps {
  video: VideoPlayerData;
  locale: string;
}

interface SourceVideoPlayersProps {
  videos: VideoPlayerData[];
  locale: string;
  title?: string;
}

export function YouTubePlayer({ video, locale }: YouTubePlayerProps) {
  const { t } = useI18n();
  const language = getLocaleDisplayName(video.channel.language, locale);

  if (video.embeddable === false) {
    const thumbnailUrl =
      video.thumbnailUrl ??
      `https://i.ytimg.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg`;

    return (
      <div className="relative aspect-video bg-ink">
        <img
          src={thumbnailUrl}
          alt={t("accessibility.videoThumbnail", { title: video.title })}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/75 p-4 text-center text-white">
          <p className="text-sm">{t("videos.embedUnavailable")}</p>
          <a
            href={getYouTubeWatchUrl(video.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-periwinkle px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-atlas"
          >
            {t("videos.watchOnYouTube")}
          </a>
        </div>
        <span className="sr-only">{language}</span>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-ink">
      <iframe
        src={getYouTubeEmbedUrl(video.youtubeId)}
        title={t("videos.playerTitle", { title: video.title })}
        className="h-full w-full border-0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export default function SourceVideoPlayers({
  videos,
  locale,
  title,
}: SourceVideoPlayersProps) {
  const { t } = useI18n();

  if (videos.length === 0) return null;

  return (
    <section className="pt-4">
      <h2 className="font-display text-xl font-semibold text-ink">
        {title ?? t("tale.videos")}
      </h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {videos.map((video) => {
          const language = getLocaleDisplayName(video.channel.language, locale);

          return (
            <article
              key={video.id ?? video.youtubeId}
              className="overflow-hidden rounded-lg border border-border bg-white"
            >
              <YouTubePlayer video={video} locale={locale} />
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className="rounded-md bg-cloud px-2 py-0.5 text-xs font-medium text-ink"
                    aria-label={t("tale.videoLanguage", { language })}
                  >
                    {language}
                  </span>
                  <span className="text-xs text-ink/60">
                    {video.channel.title}
                  </span>
                </div>
                <h3 className="font-medium text-ink">{video.title}</h3>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
