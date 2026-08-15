import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const language =
      typeof req.query.language === "string" ? req.query.language : undefined;
    const availableIn =
      typeof req.query.availableIn === "string"
        ? req.query.availableIn
        : undefined;

    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;

    const where = availableIn
      ? { translations: { some: { language: availableIn } } }
      : {};

    const [tales, total] = await Promise.all([
      prisma.fairyTale.findMany({
        where,
        include: {
          translations: {
            select: { language: true, title: true },
          },
        },
        orderBy: { canonicalTitle: "asc" },
        skip: offset,
        take: limit,
      }),
      prisma.fairyTale.count({ where }),
    ]);

    const data = tales.map((tale) => {
      const translation =
        language !== undefined
          ? tale.translations.find((t) => t.language === language)
          : undefined;

      const title = translation ? translation.title : tale.canonicalTitle;
      const availableLanguages = tale.translations.map((t) => t.language);

      return {
        slug: tale.slug,
        thumbnailUrl: tale.thumbnailUrl,
        title,
        availableLanguages,
      };
    });

    res.json({ data, total });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const tale = await prisma.fairyTale.findUnique({
      where: { slug: req.params.slug },
      include: {
        translations: true,
        videos: {
          include: { channel: true },
          orderBy: { publishedAt: "desc" },
        },
      },
    });

    if (!tale) {
      return res.status(404).json({ error: "Fairy tale not found" });
    }

    res.json(tale);
  } catch (error) {
    next(error);
  }
});

export default router;
