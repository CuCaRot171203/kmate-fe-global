'use client';

import { useState } from 'react';
import { Card, Progress, Button } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  CloseCircleOutlined,
  ExpandOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export function AppPlayer() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  // Hidden by default, show when video is playing
  const isVisible = true; // This would be controlled by a store

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 w-96 bg-dark-400 border-t border-l border-dark-200 shadow-xl rounded-tl-xl">
      {/* Progress bar */}
      <Progress 
        percent={progress} 
        showInfo={false}
        className="!mb-0 [&_.ant-progress-bg]:!bg-primary-500 [&_.ant-progress-bar]:!rounded-none"
        size="small"
      />

      <div className="p-4 flex items-center gap-4">
        {/* Thumbnail */}
        <div className="w-16 h-10 bg-dark-200 rounded flex items-center justify-center">
          <PlayCircleOutlined className="text-2xl text-gray-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">Video Title</p>
          <p className="text-gray-400 text-xs truncate">Channel Name</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button 
            type="text" 
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            className="!text-white"
            onClick={() => setIsPlaying(!isPlaying)}
          />
          <Button 
            type="text" 
            icon={<ExpandOutlined />}
            className="!text-white"
            onClick={() => router.push('/player/video-id')}
          />
          <Button 
            type="text" 
            icon={<CloseCircleOutlined />}
            className="!text-white"
            onClick={() => setProgress(0)}
          />
        </div>
      </div>
    </div>
  );
}
