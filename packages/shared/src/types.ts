import { z } from "zod";

export const ChannelSchema = z.object({
  id: z.string(),
  title: z.string(),
  language: z.string(),
  uploadsPlaylistId: z.string(),
});

export const FairyTaleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  canonicalTitle: z.string(),
  thumbnailUrl: z.string(),
});

export const TranslationSchema = z.object({
  id: z.string(),
  fairyTaleId: z.string(),
  language: z.string(),
  title: z.string(),
});

export const VideoSchema = z.object({
  id: z.string(),
  youtubeId: z.string(),
  channelId: z.string(),
  fairyTaleId: z.string(),
  title: z.string(),
  publishedAt: z.string(),
});

export type Channel = z.infer<typeof ChannelSchema>;
export type FairyTale = z.infer<typeof FairyTaleSchema>;
export type Translation = z.infer<typeof TranslationSchema>;
export type Video = z.infer<typeof VideoSchema>;
