import { apiFetch } from "./client";
import type {
  ChannelList,
  TaleDetail,
  TaleListResponse,
  VideoDetail,
  VideoListResponse,
} from "@fairy-tales/shared";

export async function getChannels(signal?: AbortSignal): Promise<ChannelList> {
  return apiFetch<ChannelList>("/channels", { method: "GET" }, signal);
}

export async function getTales(
  params: {
    language: string;
    availableIn?: string[];
    limit?: number;
    offset?: number;
  },
  signal?: AbortSignal,
): Promise<TaleListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("language", params.language);
  if (params.availableIn) {
    for (const lang of params.availableIn) {
      searchParams.append("availableIn", lang);
    }
  }
  if (params.limit) {
    searchParams.set("limit", String(Math.min(params.limit, 100)));
  }
  if (params.offset) {
    searchParams.set("offset", String(params.offset));
  }

  return apiFetch<TaleListResponse>(
    `/fairy-tales?${searchParams.toString()}`,
    { method: "GET" },
    signal,
  );
}

export async function getTale(
  slug: string,
  signal?: AbortSignal,
): Promise<TaleDetail> {
  return apiFetch<TaleDetail>(
    `/fairy-tales/${encodeURIComponent(slug)}`,
    { method: "GET" },
    signal,
  );
}

export async function getVideos(
  params: {
    language: string;
    limit?: number;
    offset?: number;
  },
  signal?: AbortSignal,
): Promise<VideoListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("language", params.language);
  if (params.limit) {
    searchParams.set("limit", String(Math.min(params.limit, 100)));
  }
  if (params.offset) {
    searchParams.set("offset", String(params.offset));
  }

  return apiFetch<VideoListResponse>(
    `/videos?${searchParams.toString()}`,
    { method: "GET" },
    signal,
  );
}

export async function getVideo(
  youtubeId: string,
  signal?: AbortSignal,
): Promise<VideoDetail> {
  return apiFetch<VideoDetail>(
    `/videos/${encodeURIComponent(youtubeId)}`,
    { method: "GET" },
    signal,
  );
}
