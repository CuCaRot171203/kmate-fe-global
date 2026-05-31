'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/store/player.store';
import { useSubtitleSync } from '@/hooks/use-subtitle-sync';

export function SubtitleOverlay() {
  const {
    settings,
    isPlaying,
  } = usePlayerStore();

  const {
    currentSegment,
    displayContent,
    subtitleVisible,
    subtitleOpacity,
    subtitleSize,
    subtitlePosition,
  } = useSubtitleSync();

  const isVisible = useMemo(() => {
    return subtitleVisible && currentSegment && isPlaying;
  }, [subtitleVisible, currentSegment, isPlaying]);

  const positionClasses = useMemo(() => {
    return subtitlePosition === 'top'
      ? 'top-8 bottom-auto'
      : 'bottom-20 top-auto';
  }, [subtitlePosition]);

  return (
    <AnimatePresence>
      {isVisible && displayContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`absolute left-0 right-0 flex justify-center px-4 z-30 pointer-events-none ${positionClasses}`}
        >
          <div
            className="max-w-4xl w-full text-center"
            style={{ opacity: subtitleOpacity }}
          >
            {settings.displayMode === 'bilingual' ? (
              // Bilingual display - Korean above, Vietnamese below
              <div className="space-y-1">
                <p
                  className="text-white font-medium drop-shadow-lg leading-relaxed"
                  style={{
                    fontSize: `${subtitleSize}px`,
                    fontFamily: 'Noto Sans KR, sans-serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  {displayContent.primary}
                </p>
                <p
                  className="text-yellow-300 drop-shadow-lg leading-relaxed"
                  style={{
                    fontSize: `${Math.max(14, subtitleSize - 4)}px`,
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  {displayContent.secondary}
                </p>
              </div>
            ) : settings.displayMode === 'ko' ? (
              // Korean only
              <p
                className="text-white font-medium drop-shadow-lg leading-relaxed"
                style={{
                  fontSize: `${subtitleSize}px`,
                  fontFamily: 'Noto Sans KR, sans-serif',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {displayContent.primary}
              </p>
            ) : (
              // Vietnamese only
              <p
                className="text-yellow-300 drop-shadow-lg leading-relaxed"
                style={{
                  fontSize: `${subtitleSize}px`,
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {displayContent.primary}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
