'use client';

import { Typography, Button, Tooltip } from 'antd';
import { WifiOutlined, CloseCircleOutlined, MinusOutlined } from '@ant-design/icons';
import { useWaitingStore } from '@/store/waiting.store';

const { Text } = Typography;

interface WaitingHeaderProps {
  onMinimizeFeed?: () => void;
  isFeedMinimized?: boolean;
}

export function WaitingHeader({ onMinimizeFeed, isFeedMinimized }: WaitingHeaderProps) {
  const { socketConnected, videoTitle } = useWaitingStore();

  return (
    <header className="bg-dark-300 border-b border-dark-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo + title */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇰🇷</span>
            <span className="text-white font-bold text-lg">K-MATE</span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-dark-200" />

          {/* Current processing info */}
          <div>
            <Text className="text-gray-500 text-xs block">Processing video</Text>
            <Text className="text-white text-sm font-medium truncate max-w-xs">
              {videoTitle ?? 'Loading...'}
            </Text>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <Tooltip
            title={
              socketConnected
                ? 'Connected - receiving live updates'
                : 'Disconnected - retrying...'
            }
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  socketConnected ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
                }`}
              />
              <Text className="text-gray-400 text-xs hidden sm:inline">
                {socketConnected ? 'Live' : 'Reconnecting'}
              </Text>
            </div>
          </Tooltip>

          {/* Minimize feed button */}
          {onMinimizeFeed && (
            <Button
              type="text"
              icon={isFeedMinimized ? <WifiOutlined /> : <MinusOutlined />}
              onClick={onMinimizeFeed}
              className="text-gray-400 hover:text-white"
            />
          )}
        </div>
      </div>
    </header>
  );
}
