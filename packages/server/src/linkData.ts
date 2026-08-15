import { linkAllVideos } from "./services/matchingService";
import { loadEnvFile } from "./lib/loadEnv";

loadEnvFile();

async function main(): Promise<void> {
  await linkAllVideos();
  console.log("Linking complete");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});