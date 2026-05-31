'use client';

import { useMemo } from 'react';
import type { SubtitleSegment } from '@kmate/shared-types';

export type SubtitleDisplayMode = 'original' | 'translation' | 'bilingual';

interface SubtitleOverlayProps {
  segments: SubtitleSegment[];
  currentTime: number;
  displayMode?: SubtitleDisplayMode;
  className?: string;
}

interface DisplayedLine {
  original?: string;
  translation?: string;
}

/**
 * Subtitle overlay that renders subtitles at the correct timestamps.
 * Works with any video player that exposes currentTime.
 */
export function SubtitleOverlay({
  segments,
  currentTime,
  displayMode = 'bilingual',
  className = '',
}: SubtitleOverlayProps) {
  const displayed = useMemo<DisplayedLine | null>(() => {
    if (!segments?.length) return null;

    const segment = segments.find(
      (s) => currentTime >= s.start && currentTime <= s.end,
    );

    if (!segment) return null;

    if (displayMode === 'original') {
      return { original: segment.text };
    }
    if (displayMode === 'translation') {
      return { translation: segment.translation ?? segment.text };
    }
    // Bilingual mode
    return {
      original: segment.text,
      translation: segment.translation,
    };
  }, [segments, currentTime, displayMode]);

  if (!displayed) return null;

  const showBilingual = displayMode === 'bilingual' && displayed.original && displayed.translation;

  return (
    <div
      className={`absolute bottom-14 left-0 right-0 flex justify-center pointer-events-none z-50 ${className}`}
    >
      <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-xl text-center max-w-3xl w-full shadow-2xl">
        {showBilingual ? (
          <div className="flex flex-col gap-1">
            <span className="text-white text-xl leading-relaxed font-medium">
              {displayed.original}
            </span>
            <span className="text-yellow-300 text-base leading-relaxed opacity-90">
              {displayed.translation}
            </span>
          </div>
        ) : displayed.original ? (
          <span className="text-white text-xl leading-relaxed font-medium">
            {displayed.original}
          </span>
        ) : displayed.translation ? (
          <span className="text-yellow-300 text-xl leading-relaxed">
            {displayed.translation}
          </span>
        ) : null}
      </div>
    </div>
  );
}
