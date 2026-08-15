import prisma from "../lib/prisma";

const DEMONYMS: Record<string, string> = {
  en: "English",
  ru: "Russian",
};

export function extractCanonicalTitle(
  title: string,
  language: string,
): string | null {
  if (language === "en") {
    return title.split("|")[0].trim();
  }

  const segments = title.split("|").map((s) => s.trim());
  if (segments.length < 2) return null;

  const demonym = DEMONYMS[language];
  if (!demonym) return null;

  const candidate = segments[1];
  const suffix = ` in ${demonym}`;
  if (candidate.toLowerCase().endsWith(suffix.toLowerCase())) {
    return candidate.slice(0, -suffix.length).trim();
  }

  return null;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function linkVideo(video: {
  id: string;
  title: string;
  cleanTitle: string;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  channel: { language: string };
}): Promise<void> {
  const canonical = extractCanonicalTitle(video.title, video.channel.language);
  if (!canonical) return;

  const slug = slugify(canonical);

  try {
    const fairyTale = await prisma.fairyTale.upsert({
      where: { slug },
      create: {
        slug,
        canonicalTitle: canonical,
        thumbnailUrl: video.thumbnailUrl ?? "",
      },
      update: {},
    });

    await prisma.translation.upsert({
      where: {
        fairyTaleId_language: {
          fairyTaleId: fairyTale.id,
          language: video.channel.language,
        },
      },
      create: {
        fairyTaleId: fairyTale.id,
        language: video.channel.language,
        title: video.cleanTitle,
      },
      update: { title: video.cleanTitle },
    });

    await prisma.video.update({
      where: { id: video.id },
      data: { fairyTaleId: fairyTale.id },
    });

    const siblings = await prisma.video.findMany({
      where: { fairyTaleId: fairyTale.id },
      select: { durationSeconds: true },
    });

    const durations = siblings
      .map((s) => s.durationSeconds)
      .filter((d): d is number => d !== null);

    if (durations.length > 1) {
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      if (max - min > 9) {
        console.warn(`Duration outlier in ${slug}: ${min}s vs ${max}s`);
      }
    }
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === "P2002") {
      console.warn(
        `Slug collision for "${canonical}" (${slug}), skipping video ${video.id}`,
      );
      return;
    }
    throw error;
  }
}

export async function linkAllVideos(): Promise<void> {
  const videos = await prisma.video.findMany({
    include: { channel: true },
  });

  for (const video of videos) {
    try {
      await linkVideo(video);
    } catch (error) {
      console.error(`Failed to link video ${video.id}:`, error);
    }
  }
}
