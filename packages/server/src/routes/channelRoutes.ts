import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const channels = await prisma.channel.findMany({
      select: {
        id: true,
        handle: true,
        title: true,
        language: true,
      },
    });
    res.json(channels);
  } catch (error) {
    next(error);
  }
});

export default router;
