'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Typography, Button, message, Spin } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useWaitingStore } from '@/store/waiting.store';
import { useWaitingSocket } from '@/hooks/use-waiting-socket';
import { useWaitingJob } from '@/hooks/use-waiting-job';
import {
  WaitingProgressCard,
  ShortVideoFeed,
  RedirectOverlay,
  WaitingHeader,
} from '@/components/waiting';

const { Text, Title } = Typography;

const TIMEOUT_WARNING_THRESHOLD = 15 * 60; // 15 minutes
const TIMEOUT_THRESHOLD = 30 * 60; // 30 minutes

function WaitingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobId = searchParams.get('jobId');
  const videoId = searchParams.get('videoId');
  const title = searchParams.get('title');
  const thumbnail = searchParams.get('thumbnail');

  const [isFeedMinimized, setIsFeedMinimized] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  const {
    setJob,
    isCompleted,
    isFailed,
    errorMessage,
    progress,
    stage,
    estimatedSeconds,
    reset,
  } = useWaitingStore();

  // Initialize job in store from URL params
  useEffect(() => {
    if (jobId && videoId) {
      setJob(jobId, videoId, title ?? 'Processing video', thumbnail ?? undefined);
    }
  }, [jobId, videoId, title, thumbnail, setJob]);

  // WebSocket connection for real-time updates
  const { isConnected } = useWaitingSocket({
    jobId,
    enabled: !!jobId,
  });

  // HTTP polling fallback
  const { cancelJob } = useWaitingJob({
    jobId,
    videoId,
  });

  // Track elapsed time for timeout warning
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    if (!jobId || isCompleted || isFailed) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);

      if (elapsed >= TIMEOUT_THRESHOLD) {
        setShowTimeoutWarning(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, isCompleted, isFailed]);

  const handleCancel = useCallback(async () => {
    try {
      await cancelJob();
      message.success('Job cancelled');
      router.back();
    } catch {
      message.error('Failed to cancel job');
    }
  }, [cancelJob, router]);

  const handleGoBack = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  const handleRetry = useCallback(() => {
    reset();
    if (videoId) {
      router.push(`/dashboard?videoId=${videoId}`);
    } else {
      router.push('/dashboard');
    }
  }, [reset, router, videoId]);

  const toggleFeed = useCallback(() => {
    setIsFeedMinimized((prev) => !prev);
  }, []);

  // Redirect immediately if job already completed
  useEffect(() => {
    if (isCompleted) {
      const targetUrl = `/learn/${videoId}`;
      const timer = setTimeout(() => {
        window.location.href = targetUrl;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, videoId]);

  // Validate required params
  if (!jobId || !videoId) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <Title level={4} className="text-white mb-4">
            Missing job information
          </Title>
          <Text className="text-gray-400 block mb-6">
            Unable to load waiting page. Please try again from the video page.
          </Text>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/dashboard')}
            className="bg-sky-500 hover:bg-sky-600 border-sky-500"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-500 flex flex-col">
      {/* Header */}
      <WaitingHeader onMinimizeFeed={toggleFeed} isFeedMinimized={isFeedMinimized} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top section: Progress + Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Progress card */}
            <div className="lg:col-span-1">
              <WaitingProgressCard
                videoTitle={title ?? undefined}
                videoThumbnail={thumbnail ?? undefined}
              />
            </div>

            {/* Status details + controls */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="space-y-6"
              >
                {/* Status message */}
                <div className="bg-dark-300 rounded-2xl p-6 border border-dark-200">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${
                      isCompleted ? 'bg-green-400' : isFailed ? 'bg-red-400' : 'bg-sky-400 animate-pulse'
                    }`} />
                    <div className="flex-1">
                      <Title level={4} className="text-white mt-0 mb-2">
                        {isCompleted
                          ? 'Processing Complete!'
                          : isFailed
                          ? 'Processing Failed'
                          : 'AI is working on your subtitles'}
                      </Title>
                      <Text className="text-gray-400 text-sm block mb-4">
                        {isCompleted
                          ? 'Your subtitles are ready. Redirecting you to the learning player...'
                          : isFailed
                          ? errorMessage ?? 'Something went wrong during processing.'
                          : stage
                          ? `Current stage: ${stage} (${Math.round(progress)}% complete)`
                          : 'Initializing processing pipeline...'}
                      </Text>

                      {estimatedSeconds > 0 && !isCompleted && !isFailed && (
                        <Text className="text-gray-500 text-xs">
                          Estimated time remaining: ~{Math.ceil(estimatedSeconds / 60)} minute(s)
                        </Text>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeout warning */}
                <AnimatePresence>
                  {showTimeoutWarning && !isCompleted && !isFailed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4"
                    >
                      <Text className="text-yellow-400 text-sm">
                        This is taking longer than expected. Our AI is still working on it.
                        Please be patient or cancel and try again later.
                      </Text>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  {!isCompleted && !isFailed && (
                    <>
                      <Button
                        danger
                        onClick={handleCancel}
                        className="border-red-500/50 text-red-400 hover:text-red-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleGoBack}
                        icon={<ArrowLeftOutlined />}
                        className="bg-dark-300 text-gray-300 border-dark-200 hover:bg-dark-400"
                      >
                        Go Back
                      </Button>
                    </>
                  )}

                  {isCompleted && (
                    <Button
                      type="primary"
                      onClick={() => window.location.href = `/learn/${videoId}`}
                      className="bg-sky-500 hover:bg-sky-600 border-sky-500"
                    >
                      Watch Now
                    </Button>
                  )}

                  {isFailed && (
                    <>
                      <Button
                        type="primary"
                        onClick={handleRetry}
                        icon={<ReloadOutlined />}
                        className="bg-sky-500 hover:bg-sky-600 border-sky-500"
                      >
                        Try Again
                      </Button>
                      <Button
                        onClick={handleGoBack}
                        icon={<ArrowLeftOutlined />}
                        className="bg-dark-300 text-gray-300 border-dark-200 hover:bg-dark-400"
                      >
                        Go Back
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Short video feed section */}
          <AnimatePresence>
            {!isFeedMinimized && !isCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ShortVideoFeed category={undefined} limit={10} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimized feed indicator */}
          <AnimatePresence>
            {isFeedMinimized && !isCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <Button
                  onClick={toggleFeed}
                  className="bg-dark-300 text-gray-400 border-dark-200 hover:bg-dark-400 text-xs"
                >
                  Show short videos
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Redirect overlay (shown when completed) */}
      <RedirectOverlay redirectUrl={`/learn/${videoId}`} />
    </div>
  );
}

export default function WaitingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <Spin size="large" />
      </div>
    }>
      <WaitingPageContent />
    </Suspense>
  );
}
