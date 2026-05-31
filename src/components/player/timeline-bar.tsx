'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Slider, Tooltip } from 'antd';
import { usePlayerStore } from '@/store/player.store';
import { useSubtitleSync } from '@/hooks/use-subtitle-sync';

export function TimelineBar() {
  const {
    currentTime,
    duration,
    buffered,
    video,
    seek,
    isPlaying,
  } = usePlayerStore();

  const { formatTime, jumpToSegment, segments, currentSegmentIndex } = useSubtitleSync();

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedWidth = duration > 0 ? (buffered / 100) * 100 : 0;

  // Handle mouse move on timeline
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || duration === 0) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const time = percentage * duration;

    setHoverTime(time);
    setHoverPosition(x);
  }, [duration]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      setHoverTime(null);
    }
  }, [isDragging]);

  // Handle click to seek
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || duration === 0) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(x / rect.width, 1));
    const time = percentage * duration;

    seek(time);
  }, [duration, seek]);

  // Handle drag
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleClick(e);
  }, [handleClick]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!trackRef.current || duration === 0) return;

      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const time = percentage * duration;

      seek(time);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, seek]);

  // Get chapter markers
  const chapterMarkers = video?.chapters?.map((chapter) => ({
    ...chapter,
    position: duration > 0 ? (chapter.startTime / duration) * 100 : 0,
  })) || [];

  return (
    <div className="relative py-2 group/timeline">
      {/* Hover time tooltip */}
      {hoverTime !== null && !isDragging && (
        <div
          className="absolute bottom-full mb-2 px-2 py-1 bg-dark-300 text-white text-xs rounded shadow-lg transform -translate-x-1/2 pointer-events-none z-50 whitespace-nowrap"
          style={{ left: `${hoverPosition}px` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Hover preview thumbnail (simulated) */}
      {hoverTime !== null && (
        <div
          className="absolute top-full mt-2 w-40 h-24 bg-dark-300 rounded-lg shadow-xl transform -translate-x-1/2 overflow-hidden pointer-events-none z-50 opacity-0 group-hover/timeline:opacity-100 transition-opacity"
          style={{ left: `${hoverPosition}px` }}
        >
          {video?.thumbnail && (
            <img
              src={video.thumbnail.replace('maxresdefault', 'mqdefault')}
              alt=""
              className="w-full h-full object-cover opacity-80"
            />
          )}
        </div>
      )}

      {/* Timeline track */}
      <div
        ref={trackRef}
        className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group-hover/timeline:h-2 transition-all duration-150"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {/* Buffered */}
        <div
          className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
          style={{ width: `${bufferedWidth}%` }}
        />

        {/* Progress */}
        <div
          className="absolute inset-y-0 left-0 bg-primary-500 rounded-full"
          style={{ width: `${progress}%` }}
        >
          {/* Progress knob */}
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full shadow-lg transform transition-transform ${
              isDragging || isPlaying ? 'scale-100' : 'scale-0 group-hover/timeline:scale-100'
            }`}
          />
        </div>

        {/* Chapter markers */}
        {chapterMarkers.map((marker, index) => (
          <Tooltip key={index} title={marker.title}>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/40 rounded-full"
              style={{ left: `${marker.position}%` }}
            />
          </Tooltip>
        ))}

        {/* Segment markers (subtle dots) */}
        {segments.map((segment, index) => (
          <div
            key={segment.id}
            className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-colors ${
              index === currentSegmentIndex
                ? 'bg-primary-400'
                : 'bg-white/20 hover:bg-white/40'
            }`}
            style={{
              left: `${duration > 0 ? (segment.startTime / duration) * 100 : 0}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              jumpToSegment(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
