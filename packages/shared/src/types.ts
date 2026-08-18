import { z } from "zod";

export const ChannelSchema = z.object({
  id: z.string(),
  title: z.string(),
  language: z.string(),
  handle: z.string().nullable(),
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
  fairyTaleId: z.string().nullable(),
  title: z.string(),
  cleanTitle: z.string(),
  publishedAt: z.string(),
  durationSeconds: z.number().nullable(),
  thumbnailUrl: z.string().nullable(),
  embeddable: z.boolean().nullable(),
});

export type Channel = z.infer<typeof ChannelSchema>;
export type FairyTale = z.infer<typeof FairyTaleSchema>;
export type Translation = z.infer<typeof TranslationSchema>;
export type Video = z.infer<typeof VideoSchema>;

export const ApiErrorSchema = z.object({
  error: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const TaleListItemSchema = z.object({
  slug: z.string(),
  thumbnailUrl: z.string(),
  title: z.string(),
  availableLanguages: z.array(z.string()),
});

export type TaleListItem = z.infer<typeof TaleListItemSchema>;

export const TaleListResponseSchema = z.object({
  data: z.array(TaleListItemSchema),
  total: z.number(),
});

export type TaleListResponse = z.infer<typeof TaleListResponseSchema>;

export const TaleDetailSchema = FairyTaleSchema.extend({
  translations: z.array(TranslationSchema),
  videos: z
    .array(
      VideoSchema.extend({
        channel: ChannelSchema,
      }),
    )
    .optional(),
});

export type TaleDetail = z.infer<typeof TaleDetailSchema>;

export const VideoListItemSchema = VideoSchema.extend({
  channel: ChannelSchema,
});

export type VideoListItem = z.infer<typeof VideoListItemSchema>;

export const VideoListResponseSchema = z.object({
  data: z.array(VideoListItemSchema),
  total: z.number(),
});

export type VideoListResponse = z.infer<typeof VideoListResponseSchema>;

export const VideoDetailSchema = VideoSchema.extend({
  channel: ChannelSchema,
  fairyTale: TaleDetailSchema.nullable(),
});

export type VideoDetail = z.infer<typeof VideoDetailSchema>;
