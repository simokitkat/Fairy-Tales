import express from "express";
import cors from "cors";
import channelRoutes from "./routes/channelRoutes";
import videoRoutes from "./routes/videoRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);

app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  },
);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
