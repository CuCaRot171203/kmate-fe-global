'use client';

import { Card, Typography, Space } from 'antd';
import { EyeOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useLikeShort, useRecordShortView } from '@/hooks/use-short-videos';
import { useWaitingStore } from '@/store/waiting.store';
import type { ShortVideo } from '@kmate/shared-types';

const { Text, Title } = Typography;

interface ShortVideoCardProps {
  short: ShortVideo;
  index: number;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `0:${seconds.toString().padStart(2, '0')}`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViewCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export function ShortVideoCard({ short, index }: ShortVideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { markShortViewed, markShortViewed: _markViewed } = useWaitingStore();

  const recordView = useRecordShortView();
  const likeShort = useLikeShort();

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      likeShort.mutate(short.id);
    },
    [likeShort, short.id],
  );

  const handleClick = useCallback(() => {
    markShortViewed(short.id);
    recordView.mutate(short.id);
    // Open in new tab (could also be inline player)
    window.open(`https://www.youtube.com/watch?v=${short.youtubeId}`, '_blank');
  }, [markShortViewed, recordView, short.id, short.youtubeId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="bg-dark-300 border-dark-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 group"
        bodyStyle={{ padding: 0 }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-dark-400 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={short.thumbnail}
            alt={short.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : ''
            }`}
            loading="lazy"
          />

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-white text-xs font-mono">
            {formatDuration(short.duration)}
          </div>

          {/* Category badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-sky-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {short.category}
          </div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-3">
          <Title level={5} className="text-white text-sm font-medium mb-1 line-clamp-2 leading-snug">
            {short.title}
          </Title>
          <Text className="text-gray-400 text-xs block mb-2">{short.channelName}</Text>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <Space size="small" className="text-gray-500 text-xs">
              <span className="flex items-center gap-1">
                <EyeOutlined />
                {formatViewCount(short.viewCount)}
              </span>
            </Space>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${
                short.isLiked ? 'text-sky-400' : 'text-gray-500 hover:text-sky-400'
              }`}
            >
              {short.isLiked ? <LikeFilled /> : <LikeOutlined />}
              {formatViewCount(short.likeCount)}
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
