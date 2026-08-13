import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { google, youtube_v3 } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvFile(): void {
  try {
    const envPath = join(__dirname, "..", "..", ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      value = value.replace(/^["']|["']$/g, "");
      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env file not found or unreadable
  }
}

loadEnvFile();

const youtube: youtube_v3.Youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY as string | undefined,
});

interface ChannelVideo {
  youtubeId: string;
  title: string;
  publishedAt: Date;
}

function safeParseDate(dateString: string | undefined): Date | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
}

export async function getAllChannelVideos(
  channelId: string,
): Promise<ChannelVideo[]> {
  const channelsResponse = await youtube.channels.list({
    part: ["contentDetails"],
    id: [channelId],
  });

  if (channelsResponse.data.error) {
    throw new Error(
      `YouTube API error: ${channelsResponse.data.error.message}`,
    );
  }

  const items = channelsResponse.data.items;
  if (!items || items.length === 0) {
    throw new Error(
      `Channel with id "${channelId}" not found (API returned 0 items)`,
    );
  }

  const uploadsPlaylistId = items[0].contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    throw new Error(
      `Channel "${channelId}" does not have an uploads playlist`,
    );
  }

  const allVideos: ChannelVideo[] = [];
  const seenIds = new Set<string>();

  let nextPageToken: string | undefined = undefined;

  while (true) {
    const playlistItemsResponse = await youtube.playlistItems.list({
      part: ["snippet"],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken: nextPageToken,
    });

    if (playlistItemsResponse.data.error) {
      throw new Error(
        `YouTube API error: ${playlistItemsResponse.data.error.message}`,
      );
    }

    const playlistItems = playlistItemsResponse.data.items;
    if (playlistItems) {
      for (const item of playlistItems) {
        const youtubeId = item.snippet?.resourceId?.videoId;
        if (!youtubeId) continue;
        if (seenIds.has(youtubeId)) continue;

        seenIds.add(youtubeId);

        const publishedAt = safeParseDate(
          item.snippet?.publishedAt ??
            item.contentDetails?.videoPublishedAt,
        );
        if (!publishedAt) continue;

        const title = item.snippet?.title ?? "";

        allVideos.push({
          youtubeId,
          title,
          publishedAt,
        });
      }
    }

    nextPageToken = playlistItemsResponse.data.nextPageToken ?? undefined;
    if (!nextPageToken) break;
  }

  return allVideos;
}
