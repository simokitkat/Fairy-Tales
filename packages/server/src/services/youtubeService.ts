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

export async function resolveChannel(
  handle: string,
): Promise<{ channelId: string; title: string; uploadsPlaylistId: string }> {
  const channelsResponse = await youtube.channels.list({
    part: ["snippet", "contentDetails"],
    forHandle: handle,
  });

  if (channelsResponse.data.error) {
    throw new Error(
      `YouTube API error: ${channelsResponse.data.error.message}`,
    );
  }

  const items = channelsResponse.data.items;
  if (!items || items.length === 0) {
    throw new Error(`Channel with handle "${handle}" not found`);
  }

  const channel = items[0];
  const channelId = channel.id!;
  const title = channel.snippet?.title ?? "";
  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error(`Channel "${channelId}" does not have an uploads playlist`);
  }

  return { channelId, title, uploadsPlaylistId };
}

export async function getFullVideoDetails(
  videoIds: string[],
): Promise<youtube_v3.Schema$Video[]> {
  const videosResponse = await youtube.videos.list({
    part: ["snippet", "contentDetails", "statistics"],
    id: videoIds,
  });

  if (videosResponse.data.error) {
    throw new Error(
      `YouTube API error: ${videosResponse.data.error.message}`,
    );
  }

  return videosResponse.data.items ?? [];
}

export async function fetchUploadsPlaylistPage(
  uploadsPlaylistId: string,
  pageToken?: string,
): Promise<{ videoIds: string[]; nextPageToken?: string }> {
  const playlistItemsResponse = await youtube.playlistItems.list({
    part: ["snippet"],
    playlistId: uploadsPlaylistId,
    maxResults: 50,
    pageToken,
  });

  if (playlistItemsResponse.data.error) {
    throw new Error(
      `YouTube API error: ${playlistItemsResponse.data.error.message}`,
    );
  }

  const items = playlistItemsResponse.data.items ?? [];
  const videoIds = items
    .map((item) => item.snippet?.resourceId?.videoId)
    .filter((id): id is string => Boolean(id));

  return {
    videoIds,
    nextPageToken: playlistItemsResponse.data.nextPageToken ?? undefined,
  };
}
