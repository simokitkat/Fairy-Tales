import { CHANNELS } from "./config/channels";
import { backfillChannel } from "./services/ingestionService";

async function main(): Promise<void> {
  for (const c of CHANNELS) {
    const summary = await backfillChannel(c.handle, c.language);
    console.log(`Backfilled ${summary.handle}: inserted ${summary.inserted}`);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
