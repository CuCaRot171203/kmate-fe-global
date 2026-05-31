'use client';

import { Card, Typography, Space, Badge, Tooltip } from 'antd';
import {
  ClockCircleOutlined,
  SyncOutlined,
  DownloadOutlined,
  AudioOutlined,
  CustomerServiceOutlined,
  GlobalOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useWaitingStore } from '@/store/waiting.store';
import { WAITING_STAGE_LABELS } from '@kmate/shared-types';

const { Text, Title } = Typography;

const STAGE_ICONS: Record<string, React.ReactNode> = {
  PENDING: <SettingOutlined />,
  QUEUED: <ClockCircleOutlined />,
  DOWNLOADING: <DownloadOutlined />,
  EXTRACTING_AUDIO: <AudioOutlined />,
  TRANSCRIBING: <CustomerServiceOutlined />,
  TRANSLATING: <GlobalOutlined />,
  SYNCING: <SyncOutlined />,
  UPLOADING: <CloudUploadOutlined />,
  COMPLETED: <CheckCircleOutlined />,
  FAILED: <CloseCircleOutlined />,
  DEAD_LETTER: <CloseCircleOutlined />,
};

interface WaitingProgressCardProps {
  videoThumbnail?: string | null;
  videoTitle?: string | null;
  compact?: boolean;
}

export function WaitingProgressCard({
  videoThumbnail,
  videoTitle,
  compact = false,
}: WaitingProgressCardProps) {
  const { stage, progress, estimatedSeconds, queuePosition, isCompleted, isFailed, errorMessage } =
    useWaitingStore();

  const stageInfo = stage ? WAITING_STAGE_LABELS[stage] : null;

  const formatEta = (seconds: number): string => {
    if (seconds <= 0) return '';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="3"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
          </div>
        </div>
        <div>
          <Text className="text-white text-sm font-medium block">
            {stageInfo?.label ?? 'Loading...'}
          </Text>
          <Text className="text-gray-400 text-xs">{stageInfo?.description ?? ''}</Text>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="bg-dark-300 border-dark-200 rounded-2xl overflow-hidden"
        bodyStyle={{ padding: '1.5rem' }}
      >
        {/* Video info header */}
        <div className="flex items-center gap-4 mb-6">
          {videoThumbnail && (
            <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-dark-400">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={videoThumbnail}
                alt={videoTitle ?? 'Video'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Text className="text-gray-400 text-xs uppercase tracking-wider">Processing</Text>
            <Title level={5} className="text-white mt-0 mb-0 truncate">
              {videoTitle ?? 'Loading...'}
            </Title>
          </div>
        </div>

        {/* Circular progress */}
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1e293b"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#card-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0, 283' }}
                animate={{ strokeDasharray: `${(progress / 100) * 283}, 283` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="card-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl mb-1 text-sky-400">
                {STAGE_ICONS[stage ?? ''] ?? <ClockCircleOutlined spin />}
              </div>
              <Text className="text-gray-400 text-xs">{Math.round(progress)}%</Text>
            </div>

            {/* Pulsing ring for active stages */}
            {!isCompleted && !isFailed && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-sky-400/30"
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        </div>

        {/* Stage info */}
        <div className="text-center mb-4">
          <Badge
            status={isCompleted ? 'success' : isFailed ? 'error' : 'processing'}
            text={
              <Text className="text-white text-lg font-semibold">
                {stageInfo?.label ?? 'Initializing...'}
              </Text>
            }
          />
          <Text className="text-gray-400 text-sm block mt-1">
            {stageInfo?.description ?? 'Getting ready...'}
          </Text>
        </div>

        {/* ETA and queue */}
        <Space size="large" className="w-full justify-center">
          {estimatedSeconds > 0 && !isCompleted && !isFailed && (
            <Tooltip title="Estimated time remaining">
              <div className="text-center">
                <Text className="text-gray-400 text-xs block">ETA</Text>
                <Text className="text-sky-400 font-mono text-sm">
                  {formatEta(estimatedSeconds)}
                </Text>
              </div>
            </Tooltip>
          )}

          {queuePosition !== null && queuePosition > 0 && !isCompleted && !isFailed && (
            <Tooltip title="Your position in the queue">
              <div className="text-center">
                <Text className="text-gray-400 text-xs block">Queue</Text>
                <Text className="text-purple-400 font-mono text-sm">#{queuePosition}</Text>
              </div>
            </Tooltip>
          )}

          {isCompleted && (
            <div className="text-center">
              <Text className="text-green-400 text-sm font-medium">
                Subtitles are ready!
              </Text>
            </div>
          )}
        </Space>

        {/* Error message */}
        {isFailed && errorMessage && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <Text className="text-red-400 text-sm">{errorMessage}</Text>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
