'use client';

import { useCallback } from 'react';
import { Card, Progress, Typography, Button } from 'antd';
import { PlayCircleOutlined, RightOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWatchHistoryStore, WatchProgress } from '@/store/watch-history.store';

const { Text, Title } = Typography;

interface ContinueWatchingCardProps {
  item: WatchProgress;
  onResume?: () => void;
  onRemove?: () => void;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatWatchTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function ContinueWatchingCard({ item, onResume, onRemove }: ContinueWatchingCardProps) {
  const handleResume = useCallback(() => {
    onResume?.();
  }, [onResume]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.();
  }, [onRemove]);

  const resumeTime = Math.max(0, item.currentTime - 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/learn/${item.videoId}?t=${resumeTime}`}>
        <Card
          className="bg-dark-300 border-dark-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 group"
          bodyStyle={{ padding: 0 }}
          hoverable
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-dark-400 overflow-hidden">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-white text-xs font-mono">
              {formatDuration(item.duration)}
            </div>

            {/* Resume overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <PlayCircleOutlined className="text-4xl text-white" />
              </div>
            </div>

            {/* Progress bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-primary-500 transition-all"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Title
                  level={5}
                  className="text-white text-sm font-medium mb-1 line-clamp-2 leading-snug !mt-0"
                >
                  {item.title}
                </Title>
                <Text className="text-gray-500 text-xs block">{item.channelName}</Text>
                <Text className="text-gray-600 text-xs block mt-1">
                  {formatWatchTime(item.lastWatched)}
                </Text>
              </div>

              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleRemove}
                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              />
            </div>

            {/* Progress info */}
            <div className="flex items-center gap-2 mt-2">
              <Progress
                percent={Math.round(item.progress)}
                size="small"
                showInfo={false}
                strokeColor="#0ea5e9"
                trailColor="rgba(255,255,255,0.1)"
                className="!mb-0 flex-1 [&_.ant-progress-inner]:!bg-dark-100"
              />
              <Text className="text-gray-400 text-xs font-mono whitespace-nowrap">
                {formatDuration(item.currentTime)} / {formatDuration(item.duration)}
              </Text>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// Main Continue Watching section component
interface ContinueWatchingProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export function ContinueWatching({
  limit = 6,
  showTitle = true,
  className = '',
}: ContinueWatchingProps) {
  const { getContinueWatching, clearProgress } = useWatchHistoryStore();
  
  const items = getContinueWatching(limit);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary-500 rounded-full" />
            <Title level={4} className="text-white !mb-0">
              Continue Watching
            </Title>
          </div>
          <Link href="/library">
            <Button type="link" className="text-primary-400 hover:text-primary-300">
              View all <RightOutlined />
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <ContinueWatchingCard
            key={item.videoId}
            item={item}
            onResume={() => {
              // Navigate handled by Link
            }}
            onRemove={() => clearProgress(item.videoId)}
          />
        ))}
      </div>
    </div>
  );
}

// Recently Watched section
interface RecentlyWatchedProps {
  limit?: number;
  className?: string;
}

export function RecentlyWatched({ limit = 8, className = '' }: RecentlyWatchedProps) {
  const { getRecentlyWatched } = useWatchHistoryStore();
  
  const items = getRecentlyWatched(limit);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-accent-500 rounded-full" />
          <Title level={4} className="text-white !mb-0">
            Recently Watched
          </Title>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {items.map((item) => (
          <Link key={item.videoId} href={`/learn/${item.videoId}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-dark-400">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  loading="lazy"
                />
                {item.isCompleted && (
                  <div className="absolute top-1 right-1">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                  <div
                    className="h-full bg-primary-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-1 truncate group-hover:text-white transition-colors">
                {item.title}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
