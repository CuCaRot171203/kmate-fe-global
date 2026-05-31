'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSubtitleSocketOptions {
  videoId?: string;
  enabled?: boolean;
}

export interface SubtitleJobProgress {
  jobId: string;
  stage: string;
  progress: number;
  message: string;
  timestamp: number;
}

export interface SubtitleJobCompleted {
  jobId: string;
  videoId: string;
  subtitleId: string;
  url: string;
  language: string;
  segmentCount: number;
  duration: number;
  timestamp: number;
}

export interface SubtitleJobFailed {
  jobId: string;
  videoId: string;
  error: string;
  retryable: boolean;
  attempt: number;
  timestamp: number;
}

export interface SubtitleReady {
  videoId: string;
  subtitleId: string;
  language: string;
  url: string;
  segmentCount: number;
  duration: number;
  timestamp: number;
}

export interface SubtitleSocketState {
  progress: SubtitleJobProgress | null;
  completed: SubtitleJobCompleted | null;
  failed: SubtitleJobFailed | null;
  ready: SubtitleReady | null;
  error: string | null;
  isConnected: boolean;
}

/**
 * Hook to subscribe to real-time subtitle processing events.
 * Manages socket lifecycle, event listeners, and room joining.
 */
export function useSubtitleSocket(options: UseSubtitleSocketOptions = {}) {
  const { videoId, enabled = true } = options;

  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<SubtitleSocketState>({
    progress: null,
    completed: null,
    failed: null,
    ready: null,
    error: null,
    isConnected: false,
  });

  // Stable state setters to avoid re-registration of listeners
  const setProgress = useCallback((data: SubtitleJobProgress) => {
    setState((prev) => ({
      ...prev,
      progress: { ...data, timestamp: data.timestamp || Date.now() },
      error: null,
    }));
  }, []);

  const setCompleted = useCallback((data: SubtitleJobCompleted) => {
    setState((prev) => ({
      ...prev,
      completed: { ...data, timestamp: data.timestamp || Date.now() },
      progress: null,
      error: null,
    }));
  }, []);

  const setFailed = useCallback((data: SubtitleJobFailed) => {
    setState((prev) => ({
      ...prev,
      failed: { ...data, timestamp: data.timestamp || Date.now() },
      progress: null,
      error: data.error,
    }));
  }, []);

  const setReady = useCallback((data: SubtitleReady) => {
    setState((prev) => ({
      ...prev,
      ready: { ...data, timestamp: data.timestamp || Date.now() },
    }));
  }, []);

  const setError = useCallback((message: string) => {
    setState((prev) => ({ ...prev, error: message }));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

    const socket = io(`${socketUrl}/private`, {
      auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '',
      },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setState((prev) => ({ ...prev, isConnected: true }));
    });

    socket.on('disconnect', () => {
      setState((prev) => ({ ...prev, isConnected: false }));
    });

    socket.on('connect_error', () => {
      setState((prev) => ({ ...prev, isConnected: false }));
    });

    // Subtitle processing events
    socket.on('subtitle:job-progress', setProgress);
    socket.on('subtitle:job-completed', setCompleted);
    socket.on('subtitle:job-failed', setFailed);
    socket.on('subtitle:ready', setReady);
    socket.on('subtitle:error', (data: { message: string }) => {
      setError(data.message);
    });

    return () => {
      socket.off('subtitle:job-progress', setProgress);
      socket.off('subtitle:job-completed', setCompleted);
      socket.off('subtitle:job-failed', setFailed);
      socket.off('subtitle:ready', setReady);
      socket.off('subtitle:error');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, setProgress, setCompleted, setFailed, setReady, setError]);

  /**
   * Reset the state to initial values.
   */
  const reset = useCallback(() => {
    setState({
      progress: null,
      completed: null,
      failed: null,
      ready: null,
      error: null,
      isConnected: state.isConnected,
    });
  }, [state.isConnected]);

  /**
   * Get the current progress percentage (0-100).
   */
  const progressPercent = state.progress?.progress ?? (state.completed ? 100 : 0);

  /**
   * Get the current stage label.
   */
  const stageLabel = state.progress?.message ?? (state.completed ? 'Subtitles ready!' : '');

  return {
    socket: socketRef.current,
    ...state,
    progressPercent,
    stageLabel,
    reset,
  };
}
