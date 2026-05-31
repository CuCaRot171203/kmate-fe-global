'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useWatchHistoryStore, WatchProgress } from '@/store/watch-history.store';
import { usePlayerStore } from '@/store/player.store';
import { useSubtitleStore } from '@/store/subtitle.store';
import { api } from '@/lib/api';

interface WatchEvent {
  type: 'play' | 'pause' | 'seek' | 'segment_complete' | 'watch_complete' | 'progress_update';
  videoId: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

interface UseTrackingOptions {
  videoId?: string;
  saveInterval?: number;
  autoStart?: boolean;
}

export function useTracking(options: UseTrackingOptions = {}) {
  const {
    videoId,
    saveInterval = 5000, // Save every 5 seconds
    autoStart = true,
  } = options;

  const {
    updateProgress,
    markSegmentWatched,
    markCompleted,
    startSession,
    endSession,
    getProgress,
    getResumeTime,
    getVideoStats,
  } = useWatchHistoryStore();

  const { video, currentTime, duration, isPlaying, seek } = usePlayerStore();
  const { currentSegment, currentSegmentIndex, segments } = useSubtitleStore();

  const [events, setEvents] = useState<WatchEvent[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getVideoStats> | null>(null);

  const lastSaveRef = useRef<number>(0);
  const sessionStartedRef = useRef<boolean>(false);
  const lastSegmentRef = useRef<string | null>(null);
  const eventQueueRef = useRef<WatchEvent[]>([]);
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track watch event
  const trackEvent = useCallback((type: WatchEvent['type'], data?: Record<string, unknown>) => {
    if (!videoId) return;

    const event: WatchEvent = {
      type,
      videoId,
      timestamp: Date.now(),
      data,
    };

    eventQueueRef.current.push(event);
    setEvents(prev => [...prev.slice(-99), event]); // Keep last 100 events

    // Debounced flush to API
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }
    flushTimeoutRef.current = setTimeout(() => {
      flushEvents();
    }, 2000);
  }, [videoId]);

  // Flush events to API
  const flushEvents = useCallback(async () => {
    if (!eventQueueRef.current.length) return;

    const eventsToSend = [...eventQueueRef.current];
    eventQueueRef.current = [];

    try {
      // In production, this would send to analytics API
      // await api.post('/analytics/watch/events', { events: eventsToSend });
      console.debug('[Tracking] Flushed events:', eventsToSend.length);
    } catch (error) {
      // Re-queue on failure
      eventQueueRef.current = [...eventsToSend, ...eventQueueRef.current];
      console.error('[Tracking] Failed to flush events:', error);
    }
  }, []);

  // Save progress to API (with debounce)
  const saveProgress = useCallback(async () => {
    if (!videoId || !duration) return;

    const now = Date.now();
    if (now - lastSaveRef.current < saveInterval) return;

    lastSaveRef.current = now;

    try {
      // Optimistic update to local storage is already done via Zustand
      // Now sync to server
      const progressData = getProgress(videoId);
      if (progressData) {
        // await api.post(`/videos/${videoId}/progress`, {
        //   currentTime,
        //   duration,
        //   progress: (currentTime / duration) * 100,
        //   completedSegments: progressData.completedSegments,
        // });
        console.debug('[Tracking] Progress saved:', {
          videoId,
          currentTime: currentTime.toFixed(1),
          progress: ((currentTime / duration) * 100).toFixed(1),
        });
      }
    } catch (error) {
      console.error('[Tracking] Failed to save progress:', error);
    }
  }, [videoId, duration, currentTime, saveInterval, getProgress]);

  // Start watch session
  const startWatching = useCallback(() => {
    if (!videoId || sessionStartedRef.current) return;

    sessionStartedRef.current = true;
    startSession(videoId);
    trackEvent('play', { startTime: currentTime });
  }, [videoId, startSession, trackEvent, currentTime]);

  // End watch session
  const endWatching = useCallback(() => {
    if (!videoId || !sessionStartedRef.current) return;

    sessionStartedRef.current = false;
    endSession(videoId);
    trackEvent('pause', { endTime: currentTime, totalDuration: duration });
    
    // Save final progress
    updateProgress(videoId, currentTime, duration);
    saveProgress();
  }, [videoId, endSession, trackEvent, currentTime, duration, updateProgress, saveProgress]);

  // Resume from last position
  const resumeFromLastPosition = useCallback(() => {
    if (!videoId) return 0;

    const resumeTime = getResumeTime(videoId);
    if (resumeTime > 0) {
      seek(resumeTime);
      trackEvent('seek', { from: 0, to: resumeTime, type: 'resume' });
    }
    return resumeTime;
  }, [videoId, getResumeTime, seek, trackEvent]);

  // Track segment completion
  const trackSegmentComplete = useCallback((segmentId: string) => {
    if (!videoId || !segmentId) return;
    if (segmentId === lastSegmentRef.current) return;

    lastSegmentRef.current = segmentId;
    markSegmentWatched(videoId, segmentId);
    trackEvent('segment_complete', { segmentId, index: currentSegmentIndex });
  }, [videoId, markSegmentWatched, trackEvent, currentSegmentIndex]);

  // Track watch completion
  const trackWatchComplete = useCallback(() => {
    if (!videoId) return;

    markCompleted(videoId);
    trackEvent('watch_complete', { totalSegments: segments.length });
  }, [videoId, markCompleted, trackEvent, segments.length]);

  // Auto-start session when playing
  useEffect(() => {
    if (autoStart && isPlaying && !sessionStartedRef.current && videoId) {
      startWatching();
    }
  }, [isPlaying, autoStart, videoId, startWatching]);

  // Auto-end session on unmount or close
  useEffect(() => {
    return () => {
      if (sessionStartedRef.current) {
        endWatching();
      }
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
    };
  }, [endWatching]);

  // Periodic progress save while playing
  useEffect(() => {
    if (!isPlaying || !videoId) return;

    const interval = setInterval(() => {
      if (currentTime > 0 && duration > 0) {
        updateProgress(videoId, currentTime, duration);
        saveProgress();
      }
    }, saveInterval);

    return () => clearInterval(interval);
  }, [isPlaying, videoId, currentTime, duration, saveInterval, updateProgress, saveProgress]);

  // Track segment completion
  useEffect(() => {
    if (currentSegment && videoId) {
      trackSegmentComplete(currentSegment.id);
    }
  }, [currentSegment, videoId, trackSegmentComplete]);

  // Track watch completion (90%+ progress)
  useEffect(() => {
    if (duration > 0 && currentTime >= duration * 0.9 && videoId) {
      trackWatchComplete();
    }
  }, [currentTime, duration, videoId, trackWatchComplete]);

  // Update stats
  useEffect(() => {
    if (videoId) {
      setStats(getVideoStats(videoId));
    }
  }, [videoId, getVideoStats, currentTime]);

  return {
    // State
    events,
    stats,
    currentProgress: videoId ? getProgress(videoId) : null,
    
    // Actions
    trackEvent,
    startWatching,
    endWatching,
    resumeFromLastPosition,
    trackSegmentComplete,
    trackWatchComplete,
    saveProgress,
    flushEvents,
  };
}
