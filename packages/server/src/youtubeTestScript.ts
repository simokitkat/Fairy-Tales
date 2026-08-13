import { getAllChannelVideos } from "./services/youtubeService";

async function main(): Promise<void> {
  const channelId = "UCXuqSBlHAE6Xw-yeJA0Tunw";

  const videos = await getAllChannelVideos(channelId);

  console.log(`Total videos for channel ${channelId}: ${videos.length}`);
  console.log("---");
  console.log("First 5 videos:");
  for (const video of videos.slice(0, 5)) {
    console.log(
      `  - youtubeId: ${video.youtubeId}, title: "${video.title}", publishedAt: ${video.publishedAt.toISOString()}`,
    );
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
