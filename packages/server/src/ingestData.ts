import { CHANNELS } from "./config/channels";
import { ingestChannel } from "./services/ingestionService";

async function main(): Promise<void> {
  for (const c of CHANNELS) {
    const summary = await ingestChannel(c.handle, c.language, 50);
    console.log(summary);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
