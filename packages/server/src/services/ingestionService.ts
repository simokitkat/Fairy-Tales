import { PrismaClient } from "@prisma/client";
import { youtube_v3 } from "googleapis";

const prisma = new PrismaClient();

interface VideoInput {
  youtubeId: string;
  channelId: string;
  title: string;
  cleanTitle: string;
  publishedAt: Date;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  rawPayload: unknown;
}

export async function ingestChannel(
  handle: string,
  language: string,
  limit = 50,
): Promise<{ channel: string; upserted: number }> {
  const { resolveChannel, getLatestUploads, getFullVideoDetails } = await import(
    "./youtubeService"
  );

  const { channelId, title, uploadsPlaylistId } = await resolveChannel(handle);

  await prisma.channel.upsert({
    where: { id: channelId },
    update: {
      handle,
      title,
      language,
      uploadsPlaylistId,
    },
    create: {
      id: channelId,
      handle,
      title,
      language,
      uploadsPlaylistId,
    },
  });

  const videoIds = await getLatestUploads(channelId, limit);
  const fullVideos = await getFullVideoDetails(videoIds);

  let upserted = 0;

  for (const v of fullVideos) {
    const rawTitle = v.snippet?.title ?? "";
    const cleanTitle = rawTitle.split("|")[0].trim();
    const durationSeconds = parseDuration(v.contentDetails?.duration ?? null);
    const thumbnailUrl = extractThumbnail(v.snippet?.thumbnails);

    const video: VideoInput = {
      youtubeId: v.id!,
      channelId,
      title: rawTitle,
      cleanTitle,
      publishedAt: new Date(v.snippet?.publishedAt ?? new Date()),
      durationSeconds,
      thumbnailUrl,
      rawPayload: v,
    };

    await prisma.video.upsert({
      where: { youtubeId: video.youtubeId },
      update: {
        title: video.title,
        cleanTitle: video.cleanTitle,
        publishedAt: video.publishedAt,
        durationSeconds: video.durationSeconds,
        thumbnailUrl: video.thumbnailUrl,
        rawPayload: video.rawPayload as never,
      },
      create: {
        ...video,
      },
    });

    upserted++;
  }

  return { channel: handle, upserted };
}

function parseDuration(duration: string | null): number | null {
  if (!duration || !duration.startsWith("PT")) return null;

  const hours = (duration.match(/(\d+)H/) ?? [])[1];
  const minutes = (duration.match(/(\d+)M/) ?? [])[1];
  const seconds = (duration.match(/(\d+)S/) ?? [])[1];

  let totalSeconds = 0;
  if (hours) totalSeconds += parseInt(hours, 10) * 3600;
  if (minutes) totalSeconds += parseInt(minutes, 10) * 60;
  if (seconds) totalSeconds += parseInt(seconds, 10);

  return totalSeconds > 0 ? totalSeconds : null;
}

function extractThumbnail(
  thumbnails: youtube_v3.Schema$ThumbnailDetails | undefined,
): string | null {
  if (!thumbnails) return null;
  return (
    thumbnails.maxres?.url ??
    thumbnails.high?.url ??
    thumbnails.medium?.url ??
    null
  );
}
