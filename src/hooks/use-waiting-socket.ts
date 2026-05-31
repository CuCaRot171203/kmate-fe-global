'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWaitingStore } from '@/store/waiting.store';
import type {
  WaitingJobProgressPayload,
  WaitingJobCompletedPayload,
  WaitingJobFailedPayload,
  WaitingEtaUpdatePayload,
  WaitingQueueUpdatePayload,
} from '@kmate/shared-types';

interface UseWaitingSocketOptions {
  jobId?: string | null;
  enabled?: boolean;
}

const RECONNECT_CONFIG = {
  attempts: 5,
  delayMs: 1000,
};

/**
 * Hook to manage Socket.IO connection for Smart Waiting events.
 * Subscribes to the waiting room for a specific job and updates the Zustand store.
 */
export function useWaitingSocket(options: UseWaitingSocketOptions = {}) {
  const { jobId, enabled = true } = options;
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const subscribedRef = useRef(false);

  const {
    updateFromProgress,
    markCompleted,
    markFailed,
    setQueuePosition,
    setEta,
    setSocketConnected,
    setJob,
  } = useWaitingStore();

  const [lastEvent, setLastEvent] = useState<string | null>(null);

  const handleProgress = useCallback(
    (data: WaitingJobProgressPayload) => {
      updateFromProgress({
        stage: data.stage,
        progress: data.progress,
        estimatedSeconds: data.estimatedSeconds,
        isCompleted: false,
        isFailed: false,
      });
      if (data.queuePosition !== null) {
        setQueuePosition(data.queuePosition);
      }
      setLastEvent('progress');
    },
    [updateFromProgress, setQueuePosition],
  );

  const handleCompleted = useCallback(
    (data: WaitingJobCompletedPayload) => {
      markCompleted(data);
      setLastEvent('completed');
    },
    [markCompleted],
  );

  const handleFailed = useCallback(
    (data: WaitingJobFailedPayload) => {
      markFailed(data);
      setLastEvent('failed');
    },
    [markFailed],
  );

  const handleEtaUpdate = useCallback(
    (data: WaitingEtaUpdatePayload) => {
      setEta(data.estimatedSeconds);
      setLastEvent('eta-update');
    },
    [setEta],
  );

  const handleQueueUpdate = useCallback(
    (data: WaitingQueueUpdatePayload) => {
      setQueuePosition(data.queuePosition);
      setLastEvent('queue-update');
    },
    [setQueuePosition],
  );

  useEffect(() => {
    if (!enabled || !jobId) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

    const socket = io(`${socketUrl}/private`, {
      auth: {
        token:
          typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '',
      },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: RECONNECT_CONFIG.attempts,
      reconnectionDelay: RECONNECT_CONFIG.delayMs,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;
    reconnectAttemptsRef.current = 0;

    socket.on('connect', () => {
      setSocketConnected(true);
      reconnectAttemptsRef.current = 0;

      // Subscribe to the waiting room for this job
      if (jobId && !subscribedRef.current) {
        socket.emit('subscribe:waiting', jobId);
        subscribedRef.current = true;
      }
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('connect_error', () => {
      setSocketConnected(false);
      reconnectAttemptsRef.current += 1;
    });

    // Waiting event listeners
    socket.on('waiting:job-progress', handleProgress);
    socket.on('waiting:job-completed', handleCompleted);
    socket.on('waiting:job-failed', handleFailed);
    socket.on('waiting:eta-update', handleEtaUpdate);
    socket.on('waiting:queue-update', handleQueueUpdate);

    // If already connected, subscribe immediately
    if (socket.connected && !subscribedRef.current) {
      socket.emit('subscribe:waiting', jobId);
      subscribedRef.current = true;
    }

    return () => {
      // Unsubscribe from the waiting room
      if (subscribedRef.current && jobId) {
        socket.emit('unsubscribe:waiting', jobId);
        subscribedRef.current = false;
      }

      socket.off('waiting:job-progress', handleProgress);
      socket.off('waiting:job-completed', handleCompleted);
      socket.off('waiting:job-failed', handleFailed);
      socket.off('waiting:eta-update', handleEtaUpdate);
      socket.off('waiting:queue-update', handleQueueUpdate);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    enabled,
    jobId,
    handleProgress,
    handleCompleted,
    handleFailed,
    handleEtaUpdate,
    handleQueueUpdate,
    setSocketConnected,
  ]);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  const isConnected = useWaitingStore((s) => s.socketConnected);

  return {
    socket: socketRef.current,
    isConnected,
    lastEvent,
    reconnect,
  };
}
