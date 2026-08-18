import type {
  TaleDetail,
  TaleListItem,
  Translation,
  VideoDetail,
  VideoListItem,
} from "@fairy-tales/shared";

export type { TaleListItem } from "@fairy-tales/shared";

export interface SanitizedTale {
  slug: string;
  canonicalTitle: string;
  thumbnailUrl: string;
  title: string;
  translations: Translation[];
  videos: NonNullable<TaleDetail["videos"]>;
  availableLanguages: string[];
}

export function selectTaleTitle(tale: TaleDetail, locale: string): string {
  const translation = tale.translations?.find((t) => t.language === locale);
  return translation?.title ?? tale.canonicalTitle;
}

export function selectTaleTranslations(tale: TaleDetail): Translation[] {
  return [...tale.translations].sort((a, b) =>
    a.language.localeCompare(b.language),
  );
}

export function sanitizeTaleForClient(
  tale: TaleDetail,
  locale: string,
): SanitizedTale {
  const videos = (tale.videos ?? []) as NonNullable<TaleDetail["videos"]>;
  return {
    slug: tale.slug,
    canonicalTitle: tale.canonicalTitle,
    thumbnailUrl: tale.thumbnailUrl,
    title: selectTaleTitle(tale, locale),
    translations: selectTaleTranslations(tale),
    videos,
    availableLanguages: tale.translations.map((t) => t.language),
  };
}

export function sanitizeVideoForClient(video: VideoListItem): {
  youtubeId: string;
  title: string;
  cleanTitle: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  publishedAt: string;
  channel: { language: string; title: string; handle: string | null };
} {
  return {
    youtubeId: video.youtubeId,
    title: video.title,
    cleanTitle: video.cleanTitle,
    thumbnailUrl: video.thumbnailUrl,
    durationSeconds: video.durationSeconds,
    publishedAt: video.publishedAt,
    channel: {
      language: video.channel.language,
      title: video.channel.title,
      handle: video.channel.handle,
    },
  };
}

export function sanitizeVideoDetailForClient(video: VideoDetail): {
  youtubeId: string;
  title: string;
  cleanTitle: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  publishedAt: string;
  channel: { language: string; title: string; handle: string | null };
  fairyTale?: {
    slug: string;
    canonicalTitle: string;
    title: string;
    videos: NonNullable<TaleDetail["videos"]>;
  };
} {
  const base = sanitizeVideoForClient(video);
  return {
    ...base,
    fairyTale: video.fairyTale
      ? {
          slug: video.fairyTale.slug,
          canonicalTitle: video.fairyTale.canonicalTitle,
          title: video.fairyTale.canonicalTitle,
          videos: video.fairyTale.videos ?? [],
        }
      : undefined,
  };
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "Unknown duration";
  const minutes = Math.round(seconds / 60);
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    minutes,
  );
}

export function formatPublishedDate(
  dateString: string,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function getYouTubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function getYouTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?rel=0`;
}

export function getChannelUrl(handle: string | null): string | null {
  if (!handle) return null;
  return `https://www.youtube.com/@${handle}`;
}
