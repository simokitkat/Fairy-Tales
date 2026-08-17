import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { ChannelList, TaleDetail, TaleListResponse, VideoDetail, VideoListResponse } from "@fairy-tales/shared";
import { ApiClientError } from "./client";
import { getChannels, getTales, getTale, getVideos, getVideo } from "./endpoints";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: (failureCount: number, error: Error) =>
        error instanceof ApiClientError &&
        error.status !== 404 &&
        error.status !== 0 &&
        failureCount < 2,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function channelsQueryKey() {
  return ["channels"] as const;
}

export function talesQueryKey(params: {
  language: string;
  availableIn?: string[];
  page?: number;
  pageSize?: number;
}) {
  return ["tales", params.language, params.availableIn, params.page, params.pageSize] as const;
}

export function taleQueryKey(slug: string, locale: string) {
  return ["tale", slug, locale] as const;
}

export function videosQueryKey(params: {
  language: string;
  page?: number;
  pageSize?: number;
}) {
  return ["videos", params.language, params.page, params.pageSize] as const;
}

export function videoQueryKey(youtubeId: string) {
  return ["video", youtubeId] as const;
}

export function useChannels(options?: Omit<UseQueryOptions<ChannelList, Error>, "queryKey" | "queryFn">): UseQueryResult<ChannelList, Error> {
  return useQuery({
    queryKey: channelsQueryKey(),
    queryFn: () => getChannels(),
    ...options,
  } as UseQueryOptions<ChannelList, Error>);
}

export function useTales(
  params: { language: string; availableIn?: string[]; page?: number; pageSize?: number },
  options?: Omit<UseQueryOptions<TaleListResponse, Error>, "queryKey" | "queryFn">
): UseQueryResult<TaleListResponse, Error> {
  return useQuery({
    queryKey: talesQueryKey(params),
    queryFn: () => {
      const offset = params.page ? (params.page - 1) * (params.pageSize ?? 20) : undefined;
      return getTales({
        language: params.language,
        availableIn: params.availableIn,
        limit: params.pageSize,
        offset,
      });
    },
    ...options,
  } as UseQueryOptions<TaleListResponse, Error>);
}

export function useTale(
  slug: string,
  locale: string,
  options?: Omit<UseQueryOptions<TaleDetail, Error>, "queryKey" | "queryFn">
): UseQueryResult<TaleDetail, Error> {
  return useQuery({
    queryKey: taleQueryKey(slug, locale),
    queryFn: () => getTale(slug),
    ...options,
  } as UseQueryOptions<TaleDetail, Error>);
}

export function useVideos(
  params: { language: string; page?: number; pageSize?: number },
  options?: Omit<UseQueryOptions<VideoListResponse, Error>, "queryKey" | "queryFn">
): UseQueryResult<VideoListResponse, Error> {
  return useQuery({
    queryKey: videosQueryKey(params),
    queryFn: () => {
      const offset = params.page ? (params.page - 1) * (params.pageSize ?? 20) : undefined;
      return getVideos({
        language: params.language,
        limit: params.pageSize,
        offset,
      });
    },
    ...options,
  } as UseQueryOptions<VideoListResponse, Error>);
}

export function useVideo(
  youtubeId: string,
  options?: Omit<UseQueryOptions<VideoDetail, Error>, "queryKey" | "queryFn">
): UseQueryResult<VideoDetail, Error> {
  return useQuery({
    queryKey: videoQueryKey(youtubeId),
    queryFn: () => getVideo(youtubeId),
    ...options,
  } as UseQueryOptions<VideoDetail, Error>);
}
