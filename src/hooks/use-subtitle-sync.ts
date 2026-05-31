'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useSubtitleStore, SubtitleSegment } from '@/store/subtitle.store';
import { usePlayerStore } from '@/store/player.store';

interface UseSubtitleSyncOptions {
  preloadCount?: number;
  smoothingWindow?: number;
}

export function useSubtitleSync(options: UseSubtitleSyncOptions = {}) {
  const { preloadCount = 2 } = options;

  const {
    segments,
    currentSegment,
    currentSegmentIndex,
    updateCurrentSegment,
    getSegmentAtTime,
    getSegmentIndex,
    getUpcomingSegments,
    getPreviousSegments,
    setSegments,
    clearSegments,
    isLoading,
    hasError,
  } = useSubtitleStore();

  const { currentTime, settings } = usePlayerStore();
  
  const lastUpdateRef = useRef<number>(0);
  const segmentCacheRef = useRef<Map<number, SubtitleSegment>>(new Map());

  // Binary search for O(log n) segment lookup
  const binarySearchSegment = useCallback((time: number): { segment: SubtitleSegment | null; index: number } => {
    if (!segments.length) {
      return { segment: null, index: -1 };
    }

    // Check cache first
    const cached = segmentCacheRef.current.get(Math.floor(time));
    if (cached) {
      const index = segments.findIndex(s => s.id === cached.id);
      if (index !== -1) {
        return { segment: cached, index };
      }
    }

    let left = 0;
    let right = segments.length - 1;
    let result: SubtitleSegment | null = null;
    let resultIndex = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const segment = segments[mid];

      if (time >= segment.startTime && time <= segment.endTime) {
        result = segment;
        resultIndex = mid;
        break;
      } else if (time < segment.startTime) {
        right = mid - 1;
      } else {
        result = segment;
        resultIndex = mid;
        left = mid + 1;
      }
    }

    if (result) {
      segmentCacheRef.current.set(Math.floor(time), result);
      // Keep cache size manageable
      if (segmentCacheRef.current.size > 100) {
        const firstKey = segmentCacheRef.current.keys().next().value;
        if (firstKey !== undefined) {
          segmentCacheRef.current.delete(firstKey);
        }
      }
    }

    return { segment: result, index: resultIndex };
  }, [segments]);

  // Update current segment based on playback time (debounced to avoid excessive updates)
  useEffect(() => {
    const now = Date.now();
    
    // Only update if enough time has passed (reduces CPU usage)
    if (now - lastUpdateRef.current < 50) {
      return;
    }
    
    lastUpdateRef.current = now;
    
    const { segment, index } = binarySearchSegment(currentTime);
    
    if (segment !== currentSegment || index !== currentSegmentIndex) {
      updateCurrentSegment(currentTime);
    }
  }, [currentTime, binarySearchSegment, updateCurrentSegment, currentSegment, currentSegmentIndex]);

  // Preload surrounding segments for smooth transitions
  const preloadSegments = useCallback(() => {
    if (currentSegmentIndex < 0) return;

    const toPreload: SubtitleSegment[] = [];
    
    // Preload next segments
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = currentSegmentIndex + i;
      if (nextIndex < segments.length) {
        toPreload.push(segments[nextIndex]);
      }
    }

    // Preload previous segments
    for (let i = 1; i <= preloadCount; i++) {
      const prevIndex = currentSegmentIndex - i;
      if (prevIndex >= 0) {
        toPreload.push(segments[prevIndex]);
      }
    }

    // In a real app, this could preload audio/images associated with segments
    return toPreload;
  }, [currentSegmentIndex, segments, preloadCount]);

  // Get display text based on current settings
  const displayContent = useMemo(() => {
    if (!currentSegment) {
      return null;
    }

    const { displayMode } = settings;
    const { text, translation } = currentSegment;

    switch (displayMode) {
      case 'ko':
        return { primary: text, secondary: null };
      case 'vi':
        return { primary: translation, secondary: null };
      case 'bilingual':
      default:
        return { primary: text, secondary: translation };
    }
  }, [currentSegment, settings.displayMode]);

  // Jump to specific segment
  const jumpToSegment = useCallback((index: number) => {
    if (index >= 0 && index < segments.length) {
      const segment = segments[index];
      const { seek } = usePlayerStore.getState();
      seek(segment.startTime);
    }
  }, [segments]);

  // Jump to next segment
  const jumpToNextSegment = useCallback(() => {
    if (currentSegmentIndex < segments.length - 1) {
      jumpToSegment(currentSegmentIndex + 1);
    }
  }, [currentSegmentIndex, segments.length, jumpToSegment]);

  // Jump to previous segment
  const jumpToPreviousSegment = useCallback(() => {
    // If we're more than 2 seconds into current segment, restart it
    if (currentSegment && currentTime - currentSegment.startTime > 2) {
      jumpToSegment(currentSegmentIndex);
    } else if (currentSegmentIndex > 0) {
      jumpToSegment(currentSegmentIndex - 1);
    }
  }, [currentSegment, currentTime, currentSegmentIndex, jumpToSegment]);

  // Get segment at specific time
  const getSegmentAt = useCallback((time: number) => {
    return getSegmentAtTime(time);
  }, [getSegmentAtTime]);

  // Format time helper
  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    segments,
    currentSegment,
    currentSegmentIndex,
    displayContent,
    isLoading,
    hasError,
    
    // Settings
    displayMode: settings.displayMode,
    subtitleVisible: settings.subtitleVisible,
    subtitleOpacity: settings.subtitleOpacity,
    subtitleSize: settings.subtitleSize,
    subtitlePosition: settings.subtitlePosition,
    
    // Navigation
    jumpToSegment,
    jumpToNextSegment,
    jumpToPreviousSegment,
    
    // Queries
    getSegmentAt,
    getUpcomingSegments,
    getPreviousSegments,
    
    // Data management
    setSegments,
    clearSegments,
    preloadSegments,
    
    // Utilities
    formatTime,
    totalSegments: segments.length,
  };
}
