import express from "express";
import cors from "cors";
import channelRoutes from "./routes/channelRoutes";
import videoRoutes from "./routes/videoRoutes";
import fairyTaleRoutes from "./routes/fairyTaleRoutes";
import { syncStaleChannels } from "./services/ingestionService";
import { linkAllVideos } from "./services/matchingService";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/fairy-tales", fairyTaleRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  },
);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Startup hook: sync channels that haven't been synced recently.
syncStaleChannels().catch((error) => {
  console.error("Initial channel sync failed:", error);
});

// Startup hook: link existing videos to fairy tales.
linkAllVideos().catch((error) => {
  console.error("Initial link failed:", error);
});

// Cron job: periodically sync stale channels.
const SYNC_INTERVAL_MS = Number(process.env.SYNC_INTERVAL_MS ?? 86_400_000);
setInterval(() => {
  syncStaleChannels().catch((error) => {
    console.error("Scheduled channel sync failed:", error);
  });
}, SYNC_INTERVAL_MS);

// Cron job: periodically re-link videos.
const MATCH_INTERVAL_MS = Number(process.env.MATCH_INTERVAL_MS ?? 7_200_000);
setInterval(() => {
  linkAllVideos().catch((error) => {
    console.error("Scheduled link failed:", error);
  });
}, MATCH_INTERVAL_MS);
