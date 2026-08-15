import { youtube_v3 } from "googleapis";
import prisma from "../lib/prisma";
import { CHANNELS } from "../config/channels";
import { linkAllVideos } from "./matchingService";

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

let isSyncing = false;

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

export async function backfillChannel(
  handle: string,
  language: string,
): Promise<{ handle: string; inserted: number }> {
  const { resolveChannel, getFullVideoDetails, fetchUploadsPlaylistPage } =
    await import("./youtubeService");

  let channelId: string;
  let uploadsPlaylistId: string;

  const existing = await prisma.channel.findFirst({ where: { handle } });
  if (existing?.uploadsPlaylistId) {
    channelId = existing.id;
    uploadsPlaylistId = existing.uploadsPlaylistId;
  } else {
    const resolved = await resolveChannel(handle);
    channelId = resolved.channelId;
    uploadsPlaylistId = resolved.uploadsPlaylistId;
    await prisma.channel.upsert({
      where: { id: resolved.channelId },
      update: {
        handle,
        title: resolved.title,
        language,
        uploadsPlaylistId: resolved.uploadsPlaylistId,
      },
      create: {
        id: resolved.channelId,
        handle,
        title: resolved.title,
        language,
        uploadsPlaylistId: resolved.uploadsPlaylistId,
      },
    });
  }

  let inserted = 0;
  let nextPageToken: string | undefined;

  while (true) {
    const page = await fetchUploadsPlaylistPage(uploadsPlaylistId, nextPageToken);
    const pageIds = page.videoIds;

    const existingVideos = await prisma.video.findMany({
      where: { youtubeId: { in: pageIds } },
      select: { youtubeId: true },
    });
    const existingIds = new Set(existingVideos.map((v) => v.youtubeId));
    const newIds = pageIds.filter((id) => !existingIds.has(id));

    if (newIds.length > 0) {
      const fullVideos = await getFullVideoDetails(newIds);
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

        inserted++;
      }
    }

    nextPageToken = page.nextPageToken;
    if (!nextPageToken) break;
  }

  await prisma.channel.update({
    where: { id: channelId },
    data: { lastSyncedAt: new Date() },
  });

  return { handle, inserted };
}

export async function syncChannel(
  handle: string,
  language: string,
): Promise<{ handle: string; inserted: number }> {
  const { resolveChannel, getFullVideoDetails, fetchUploadsPlaylistPage } =
    await import("./youtubeService");

  let channelId: string;
  let uploadsPlaylistId: string;

  const existing = await prisma.channel.findFirst({ where: { handle } });
  if (existing?.uploadsPlaylistId) {
    channelId = existing.id;
    uploadsPlaylistId = existing.uploadsPlaylistId;
  } else {
    const resolved = await resolveChannel(handle);
    channelId = resolved.channelId;
    uploadsPlaylistId = resolved.uploadsPlaylistId;
    await prisma.channel.upsert({
      where: { id: resolved.channelId },
      update: {
        handle,
        title: resolved.title,
        language,
        uploadsPlaylistId: resolved.uploadsPlaylistId,
      },
      create: {
        id: resolved.channelId,
        handle,
        title: resolved.title,
        language,
        uploadsPlaylistId: resolved.uploadsPlaylistId,
      },
    });
  }

  let inserted = 0;
  let nextPageToken: string | undefined;

  while (true) {
    const page = await fetchUploadsPlaylistPage(uploadsPlaylistId, nextPageToken);
    const pageIds = page.videoIds;

    const existingVideos = await prisma.video.findMany({
      where: { youtubeId: { in: pageIds } },
      select: { youtubeId: true },
    });
    const existingIds = new Set(existingVideos.map((v) => v.youtubeId));
    const newIds = pageIds.filter((id) => !existingIds.has(id));

    if (newIds.length === 0) break;

    const fullVideos = await getFullVideoDetails(newIds);
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

      inserted++;
    }

    if (newIds.length < pageIds.length) break;

    nextPageToken = page.nextPageToken;
    if (!nextPageToken) break;
  }

  await prisma.channel.update({
    where: { id: channelId },
    data: { lastSyncedAt: new Date() },
  });

  return { handle, inserted };
}

export async function syncStaleChannels(
  thresholdMs = 43_200_000,
): Promise<void> {
  if (isSyncing) {
    console.log("sync already in progress");
    return;
  }

  isSyncing = true;
  try {
    const handles = CHANNELS.map((c) => c.handle);
    const rows = await prisma.channel.findMany({
      where: { handle: { in: handles } },
      select: { handle: true, lastSyncedAt: true },
    });
    const syncedAt = new Map(rows.map((r) => [r.handle, r.lastSyncedAt]));
    const now = Date.now();

    for (const c of CHANNELS) {
      const last = syncedAt.get(c.handle);
      let stale: boolean;
      if (last === undefined || last === null) {
        stale = true;
      } else {
        stale = now - last.getTime() > thresholdMs;
      }

      if (!stale) {
        console.log(`Skipping ${c.handle}: recently synced`);
        continue;
      }

      try {
        const summary = await syncChannel(c.handle, c.language);
        console.log(
          `Synced (stale) ${summary.handle}: inserted ${summary.inserted}`,
        );
      } catch (error) {
        console.error(`Failed to sync ${c.handle}:`, error);
      }
    }
  } finally {
    isSyncing = false;
  }

  await linkAllVideos().catch((error) => {
    console.error("Link after sync failed:", error);
  });
}

export async function syncAllChannels(): Promise<void> {
  if (isSyncing) {
    console.log("sync already in progress");
    return;
  }

  isSyncing = true;
  try {
    for (const c of CHANNELS) {
      try {
        const summary = await syncChannel(c.handle, c.language);
        console.log(`Synced ${summary.handle}: inserted ${summary.inserted}`);
      } catch (error) {
        console.error(`Failed to sync ${c.handle}:`, error);
      }
    }
  } finally {
    isSyncing = false;
  }
}
