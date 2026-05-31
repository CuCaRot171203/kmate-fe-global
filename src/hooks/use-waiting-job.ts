'use client';

import { useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useWaitingStore } from '@/store/waiting.store';
import type { WaitingJobStatus, WaitingProgress } from '@kmate/shared-types';

const POLL_INTERVAL = 3000; // 3 seconds

interface UseWaitingJobOptions {
  jobId: string | null;
  videoId: string | null;
}

/**
 * Hook to manage polling for job status as a fallback when WebSocket is unavailable.
 * Also handles the initial status fetch and syncs to Zustand store.
 */
export function useWaitingJob(options: UseWaitingJobOptions) {
  const { jobId, videoId } = options;

  const { updateFromStatus, updateFromProgress } = useWaitingStore();

  // Initial detailed status fetch
  const {
    data: statusData,
    error: statusError,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ['waiting-job', jobId],
    queryFn: async (): Promise<WaitingJobStatus | null> => {
      if (!jobId) return null;
      const { data } = await api.get<WaitingJobStatus>(`/waiting/jobs/${jobId}`);
      return data;
    },
    enabled: !!jobId,
    staleTime: 0,
  });

  // Lightweight progress polling for active jobs
  const { data: progressData, isFetching } = useQuery({
    queryKey: ['waiting-progress', jobId],
    queryFn: async (): Promise<WaitingProgress | null> => {
      if (!jobId) return null;
      const { data } = await api.get<WaitingProgress>(
        `/waiting/jobs/${jobId}/progress`,
      );
      return data;
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling when terminal state reached
      if (status && ['COMPLETED', 'FAILED', 'DEAD_LETTER'].includes(status)) {
        return false;
      }
      return POLL_INTERVAL;
    },
    staleTime: 0,
  });

  // Sync status data to store via effect
  useEffect(() => {
    if (statusData && jobId) {
      updateFromStatus(statusData);
    }
  }, [statusData, jobId, updateFromStatus]);

  // Sync progress data to store via effect
  useEffect(() => {
    if (progressData && jobId) {
      updateFromProgress(progressData);
    }
  }, [progressData, jobId, updateFromProgress]);

  // Cancel job mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!jobId) throw new Error('No job ID');
      const { data } = await api.post(`/waiting/jobs/${jobId}/cancel`);
      return data;
    },
  });

  const cancelJob = useCallback(async () => {
    return cancelMutation.mutateAsync();
  }, [cancelMutation]);

  return {
    status: statusData,
    progress: progressData,
    error: statusError,
    cancelJob,
    isPolling: !!jobId && isFetching,
    refetch: refetchStatus,
  };
}
