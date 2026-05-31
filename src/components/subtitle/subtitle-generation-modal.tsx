'use client';

import { useEffect, useCallback } from 'react';
import { Modal, Progress, Button, Result, Spin, Space, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useSubtitleSocket } from '@/hooks/use-subtitle-socket';
import { useRequestSubtitle, useSubtitleJobStatus } from '@/hooks/use-subtitle';
import { useSubtitle } from '@/hooks/use-subtitle';
import { SUBTITLE_STAGE_LABELS } from '@kmate/shared-types';

const { Text } = Typography;

interface SubtitleGenerationModalProps {
  open: boolean;
  videoId: string;
  youtubeUrl?: string;
  videoTitle?: string;
  videoThumbnail?: string;
  userId?: string;
  onClose: () => void;
  onSubtitleReady?: (subtitleUrl: string, segmentCount: number) => void;
  onSubtitleError?: (error: string) => void;
}

/**
 * Modal UI for requesting AI subtitle generation.
 * Shows real-time progress via WebSocket and polls job status as fallback.
 */
export function SubtitleGenerationModal({
  open,
  videoId,
  youtubeUrl,
  videoTitle,
  videoThumbnail,
  onClose,
  onSubtitleReady,
  onSubtitleError,
}: SubtitleGenerationModalProps) {
  const { progressPercent, stageLabel, error, completed, ready, failed, reset, isConnected } =
    useSubtitleSocket({ videoId, enabled: open });

  const requestMutation = useRequestSubtitle();
  const { data: jobStatus } = useSubtitleJobStatus(
    requestMutation.data?.jobId ?? null,
  );
  const { data: existingSubtitle } = useSubtitle(videoId);

  // Determine current status
  const status = useCallback((): 'idle' | 'requesting' | 'processing' | 'completed' | 'failed' | 'cached' => {
    if (requestMutation.isPending) return 'requesting';
    if (failed) return 'failed';
    if (completed || ready) return 'completed';
    if (requestMutation.data?.status === 'CACHED' || requestMutation.data?.status === 'EXISTS') return 'cached';
    if (requestMutation.data?.status === 'IN_PROGRESS') return 'processing';
    if (progressPercent > 0) return 'processing';
    return 'idle';
  }, [requestMutation.isPending, requestMutation.data?.status, failed, completed, ready, progressPercent]);

  // Trigger subtitle ready callback
  useEffect(() => {
    if (ready && onSubtitleReady) {
      onSubtitleReady(ready.url, ready.segmentCount);
    }
  }, [ready, onSubtitleReady]);

  // Trigger error callback
  useEffect(() => {
    if (failed && onSubtitleError) {
      onSubtitleError(failed.error);
    }
  }, [failed, onSubtitleError]);

  const handleRequest = async () => {
    reset();
    try {
      await requestMutation.mutateAsync({ videoId, youtubeUrl });
    } catch {
      // Error handled by mutation state
    }
  };

  // Auto-request on open if no subtitle exists
  useEffect(() => {
    if (open && !existingSubtitle && !requestMutation.isPending && !requestMutation.data) {
      handleRequest();
    }
  }, [open, existingSubtitle, requestMutation.isPending, requestMutation.data]);

  const renderContent = () => {
    const s = status();

    if (s === 'requesting') {
      return (
        <div className="text-center py-8">
          <Spin size="large" />
          <Text className="block mt-4">Processing request...</Text>
        </div>
      );
    }

    if (s === 'cached' || s === 'completed') {
      const url = ready?.url ?? requestMutation.data?.url ?? '';
      const segmentCount = ready?.segmentCount ?? 0;

      return (
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-green-500" />}
          title="Subtitles ready!"
          subTitle={
            segmentCount > 0
              ? `${segmentCount} segments generated`
              : 'Subtitles have been loaded'
          }
          extra={
            <Space direction="vertical" className="w-full">
              <Button type="primary" size="large" onClick={onClose}>
                Watch Now
              </Button>
              {url && (
                <Button variant="text" size="small" onClick={() => window.open(url, '_blank')}>
                  Download subtitles
                </Button>
              )}
            </Space>
          }
        />
      );
    }

    if (s === 'failed') {
      return (
        <Result
          status="error"
          icon={<CloseCircleOutlined className="text-red-500" />}
          title="Subtitle generation failed"
          subTitle={
            failed?.retryable
              ? `${failed.error} — will retry automatically`
              : failed?.error ?? 'An unexpected error occurred'
          }
          extra={
            failed?.retryable ? (
              <Text type="secondary">Please wait while we retry...</Text>
            ) : (
              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={handleRequest}
                  loading={requestMutation.isPending}
                >
                  Try Again
                </Button>
                <Button variant="text" onClick={onClose}>
                  Cancel
                </Button>
              </Space>
            )
          }
        />
      );
    }

    // Processing
    const displayPercent = progressPercent ?? jobStatus?.progress ?? 0;
    const displayStage = jobStatus?.stage ?? stageLabel ?? 'Processing...';
    const stageText = SUBTITLE_STAGE_LABELS[displayStage] ?? displayStage;

    return (
      <div className="text-center py-4">
        <Progress
          type="circle"
          percent={Math.round(displayPercent)}
          size={120}
          strokeColor={{
            '0%': '#6366f1',
            '100%': '#8b5cf6',
          }}
        />
        <div className="mt-6">
          <Text strong className="text-lg">{stageText}</Text>
          <Text className="block text-gray-500 mt-1 text-sm">
            {jobStatus
              ? `${jobStatus.progress.toFixed(0)}% complete — ${jobStatus.retryCount > 0 ? `retry ${jobStatus.retryCount}/3` : ''}`
              : `${displayPercent.toFixed(0)}% complete`}
          </Text>
          {!isConnected && (
            <Text type="warning" className="block mt-2 text-xs">
              Real-time updates unavailable — reconnecting...
            </Text>
          )}
          {/* Watch while processing CTA */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <Button
              type="link"
              icon={<PlayCircleOutlined />}
              onClick={() => {
                const jobId = requestMutation.data?.jobId;
                if (jobId) {
                  const params = new URLSearchParams({
                    jobId,
                    videoId,
                    title: videoTitle ?? videoId,
                    thumbnail: videoThumbnail ?? '',
                  });
                  window.location.href = `/waiting?${params.toString()}`;
                }
              }}
              disabled={!requestMutation.data?.jobId}
              className="text-sky-400 hover:text-sky-300 text-sm"
            >
              Watch short videos while processing
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="AI Subtitle Generation"
      width={420}
      centered
      maskClosable={status() !== 'processing'}
    >
      <div className="py-2">{renderContent()}</div>
    </Modal>
  );
}
