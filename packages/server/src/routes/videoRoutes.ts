import express from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const language = req.query.language;
    if (typeof language !== "string" || !language) {
      return res.status(400).json({ error: "language query parameter is required" });
    }

    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;

    const where: Prisma.VideoWhereInput = {
      channel: {
        language,
      },
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: { channel: true },
        orderBy: { publishedAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.video.count({ where }),
    ]);

    res.json({ data: videos, total });
  } catch (error) {
    next(error);
  }
});

router.get("/:youtubeId", async (req, res, next) => {
  try {
    const video = await prisma.video.findUnique({
      where: { youtubeId: req.params.youtubeId },
      include: { channel: true },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    next(error);
  }
});

export default router;
