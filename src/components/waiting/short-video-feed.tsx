'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Typography, Spin, Button } from 'antd';
import { ReloadOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { ShortVideoCard } from './short-video-card';
import { useShortVideoFeed } from '@/hooks/use-short-videos';
import { useWaitingStore } from '@/store/waiting.store';
import type { ShortVideo } from '@kmate/shared-types';

const { Text, Title } = Typography;

interface ShortVideoFeedProps {
  category?: string;
  limit?: number;
}

export function ShortVideoFeed({ category, limit = 10 }: ShortVideoFeedProps) {
  const { setShortsFeed, addToShortsFeed, shortsFeed, setFeedLoading, feedLoading } =
    useWaitingStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useShortVideoFeed({ limit, category });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sync React Query data to Zustand store
  useEffect(() => {
    if (data?.pages) {
      const allShorts = data.pages.flatMap((page) => page.shorts) as ShortVideo[];
      if (shortsFeed.length === 0) {
        setShortsFeed(allShorts);
      }
    }
  }, [data, shortsFeed.length, setShortsFeed]);

  // Intersection Observer for infinite scroll
  const lastShortElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  // Flatten pages to shorts array
  const displayShorts = data?.pages.flatMap((page) => page.shorts) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spin size="large" />
        <Text className="text-gray-400 mt-4">Loading shorts for you...</Text>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Text className="text-red-400 mb-4">Failed to load short videos</Text>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
          className="bg-dark-300 text-white border-dark-200 hover:bg-dark-400"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (displayShorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <PlayCircleOutlined className="text-4xl text-gray-500 mb-3" />
        <Title level={5} className="text-gray-300">
          No short videos available
        </Title>
        <Text className="text-gray-500 text-sm">
          Check back soon for curated content while you wait.
        </Text>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-sky-500 rounded-full" />
          <Title level={5} className="text-white m-0">
            While you wait
          </Title>
        </div>
        <Text className="text-gray-500 text-xs">
          {displayShorts.length} videos
        </Text>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {displayShorts.map((short, index) => (
            <div
              key={short.id}
              ref={index === displayShorts.length - 1 ? lastShortElementRef : undefined}
            >
              <ShortVideoCard short={short} index={index} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Spin size="small" />
          <Text className="text-gray-500 text-sm ml-2">Loading more...</Text>
        </div>
      )}

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-4" />
    </div>
  );
}
