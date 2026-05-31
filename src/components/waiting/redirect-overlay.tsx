'use client';

import { useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useWaitingStore } from '@/store/waiting.store';

const { Text, Title } = Typography;

const REDIRECT_COUNTDOWN = 5; // seconds

interface RedirectOverlayProps {
  redirectUrl?: string;
}

export function RedirectOverlay({ redirectUrl }: RedirectOverlayProps) {
  const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN);
  const { isCompleted, completedData, videoId, showPlayer } = useWaitingStore();

  const targetUrl = redirectUrl ?? completedData?.url ?? `/learn/${videoId}`;

  useEffect(() => {
    if (!isCompleted) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, targetUrl]);

  const handleGoNow = () => {
    window.location.href = targetUrl;
  };

  return (
    <AnimatePresence>
      {isCompleted && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-500/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center p-8 max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
          >
            {/* Animated checkmark */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
              >
                <CheckCircleOutlined className="text-5xl text-green-400" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <Title level={3} className="text-white mb-2">
              Subtitles Ready!
            </Title>
            <Text className="text-gray-400 text-base block mb-6">
              Your video is ready with AI-generated subtitles. Redirecting in {countdown} seconds...
            </Text>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-sky-500"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: countdown > i * (REDIRECT_COUNTDOWN / 5) ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            {/* CTA */}
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleGoNow}
              className="bg-sky-500 hover:bg-sky-600 border-sky-500 hover:border-sky-600 h-12 px-8 text-base font-medium"
            >
              Go to video now
            </Button>

            <Text className="text-gray-600 text-xs block mt-4">
              or wait for automatic redirect
            </Text>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
