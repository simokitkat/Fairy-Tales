import { resolveChannel, getLatestUploads, getFullVideoDetails } from "./services/youtubeService";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const channels = ["@EnglishFairyTales", "@RussianFairyTales"];
const tmpDir = join(__dirname, "..", "tmp");

mkdirSync(tmpDir, { recursive: true });

function stripAt(handle: string): string {
  return handle.startsWith("@") ? handle.slice(1) : handle;
}

function isPresentAndNonEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === "") {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
}

async function explore(): Promise<void> {
  for (const handle of channels) {
    console.log(`\n=== Exploring ${handle} ===`);

    const channel = await resolveChannel(handle);
    console.log(`Channel: ${channel.title} (${channel.channelId})`);

    const videoIds = await getLatestUploads(channel.channelId, 50);
    console.log(`Fetched ${videoIds.length} video IDs`);

    const videos = await getFullVideoDetails(videoIds);

    const outputPath = join(tmpDir, `exploration-${stripAt(handle)}.json`);
    writeFileSync(outputPath, JSON.stringify(videos, null, 2));
    console.log(`Wrote raw JSON to ${outputPath}`);

    console.log("\nField-population report:");
    const fields = [
      "tags",
      "description",
      "defaultAudioLanguage",
      "defaultLanguage",
      "categoryId",
      "statistics.viewCount",
    ];

    for (const field of fields) {
      let count = 0;
      for (const v of videos) {
        let value: unknown;
        if (field === "tags") {
          value = v.snippet?.tags;
        } else if (field === "statistics.viewCount") {
          value = v.statistics?.viewCount;
        } else {
          value = (v.snippet as Record<string, unknown> | undefined)?.[field];
        }

        if (isPresentAndNonEmpty(value)) {
          count++;
        }
      }
      const pct = ((count / videos.length) * 100).toFixed(1);
      console.log(`  ${field}: ${pct}% (${count}/${videos.length})`);
    }
  }
}

explore().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
