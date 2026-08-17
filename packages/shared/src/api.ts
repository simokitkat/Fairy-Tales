import { z } from "zod";
import type {
  ApiError,
  Channel,
  FairyTale,
  TaleDetail,
  TaleListResponse,
  Translation,
  Video,
  VideoDetail,
  VideoListResponse,
} from "./types";
import {
  ApiErrorSchema,
  TaleDetailSchema,
  TaleListResponseSchema,
  VideoDetailSchema,
  VideoListResponseSchema,
} from "./types";

export const ChannelListSchema = z.array(
  z.object({
    id: z.string(),
    handle: z.string().nullable(),
    title: z.string(),
    language: z.string(),
  }),
);

export type ChannelList = z.infer<typeof ChannelListSchema>;

export function assertChannelList(data: unknown): ChannelList {
  return ChannelListSchema.parse(data);
}

export function assertTaleListResponse(data: unknown): TaleListResponse {
  return TaleListResponseSchema.parse(data);
}

export function assertTaleDetail(data: unknown): TaleDetail {
  return TaleDetailSchema.parse(data);
}

export function assertVideoListResponse(data: unknown): VideoListResponse {
  return VideoListResponseSchema.parse(data);
}

export function assertVideoDetail(data: unknown): VideoDetail {
  return VideoDetailSchema.parse(data);
}

export function assertApiError(data: unknown): ApiError {
  return ApiErrorSchema.parse(data);
}
