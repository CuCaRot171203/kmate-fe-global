'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/query-core';
import { api } from '@/lib/api';
import type {
  ShortVideo,
  ShortVideoFeedResponse,
  ShortVideoViewResponse,
  ShortVideoLikeResponse,
} from '@kmate/shared-types';

const SHORT_FEED_QUERY_KEY = 'short-video-feed';

/**
 * Get the short video feed for the waiting screen.
 * Uses infinite query for cursor-based pagination.
 */
export function useShortVideoFeed(options: { limit?: number; category?: string } = {}) {
  const { limit = 10, category } = options;

  return useInfiniteQuery({
    queryKey: [SHORT_FEED_QUERY_KEY, category],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (pageParam) params.set('cursor', pageParam);
      if (category) params.set('category', category);

      const { data } = await api.get<ShortVideoFeedResponse>(
        `/shorts/feed?${params.toString()}`,
      );
      return data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Record a view event for a short video.
 */
export function useRecordShortView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shortId: string) => {
      const { data } = await api.post<ShortVideoViewResponse>(
        `/shorts/${shortId}/view`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHORT_FEED_QUERY_KEY] });
    },
  });
}

/**
 * Toggle like on a short video.
 */
export function useLikeShort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shortId: string) => {
      const { data } = await api.post<ShortVideoLikeResponse>(
        `/shorts/${shortId}/like`,
      );
      return data;
    },
    onMutate: async (shortId) => {
      // Optimistic update - snapshot all matching feed queries
      await queryClient.cancelQueries({ queryKey: [SHORT_FEED_QUERY_KEY] });

      const previousData = queryClient.getQueriesData<InfiniteData<ShortVideoFeedResponse>>({
        queryKey: [SHORT_FEED_QUERY_KEY],
      });

      queryClient.setQueriesData<InfiniteData<ShortVideoFeedResponse>>(
        { queryKey: [SHORT_FEED_QUERY_KEY] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              shorts: page.shorts.map((short) =>
                short.id === shortId
                  ? {
                      ...short,
                      isLiked: !short.isLiked,
                      likeCount: short.isLiked
                        ? short.likeCount - 1
                        : short.likeCount + 1,
                    }
                  : short,
              ),
            })),
          };
        },
      );

      return { previousData };
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousData) {
        for (const [key, data] of context.previousData) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SHORT_FEED_QUERY_KEY] });
    },
  });
}

/**
 * Get a single short video by ID.
 */
export function useShortVideo(shortId: string | null) {
  return useQuery({
    queryKey: ['short-video', shortId],
    queryFn: async () => {
      if (!shortId) return null;
      const { data } = await api.get<ShortVideo>(`/shorts/${shortId}`);
      return data;
    },
    enabled: !!shortId,
  });
}
