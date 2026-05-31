import { create } from 'zustand';
import type {
  WaitingJobStatus,
  WaitingProgress,
  ShortVideo,
  WaitingJobCompletedPayload,
  WaitingJobFailedPayload,
} from '@kmate/shared-types';

interface WaitingState {
  // Job state
  jobId: string | null;
  videoId: string | null;
  videoTitle: string | null;
  videoThumbnail: string | null;

  // Progress state
  stage: string | null;
  progress: number;
  estimatedSeconds: number;
  queuePosition: number | null;

  // Connection state
  socketConnected: boolean;

  // Terminal states
  isCompleted: boolean;
  isFailed: boolean;
  errorMessage: string | null;

  // Short video feed
  shortsFeed: ShortVideo[];
  activeShortIndex: number;
  viewedShortIds: Set<string>;
  feedLoading: boolean;

  // UI state
  showPlayer: boolean;
  redirectUrl: string | null;

  // Completion data
  completedData: WaitingJobCompletedPayload | null;
}

interface WaitingActions {
  // Job actions
  setJob: (jobId: string, videoId: string, title: string, thumbnail?: string) => void;
  updateFromProgress: (progress: Partial<WaitingProgress>) => void;
  updateFromStatus: (status: WaitingJobStatus) => void;
  setQueuePosition: (position: number) => void;
  setEta: (seconds: number) => void;
  setSocketConnected: (connected: boolean) => void;

  // Terminal actions
  markCompleted: (data: WaitingJobCompletedPayload) => void;
  markFailed: (data: WaitingJobFailedPayload) => void;

  // Short video feed actions
  setShortsFeed: (feed: ShortVideo[]) => void;
  addToShortsFeed: (shorts: ShortVideo[]) => void;
  setActiveShort: (index: number) => void;
  markShortViewed: (shortId: string) => void;
  setFeedLoading: (loading: boolean) => void;
  setNextCursor: (cursor: string | null) => void;

  // UI actions
  openPlayer: (url: string) => void;
  reset: () => void;
}

const initialState: WaitingState = {
  jobId: null,
  videoId: null,
  videoTitle: null,
  videoThumbnail: null,
  stage: null,
  progress: 0,
  estimatedSeconds: 0,
  queuePosition: null,
  socketConnected: false,
  isCompleted: false,
  isFailed: false,
  errorMessage: null,
  shortsFeed: [],
  activeShortIndex: 0,
  viewedShortIds: new Set(),
  feedLoading: false,
  showPlayer: false,
  redirectUrl: null,
  completedData: null,
};

export const useWaitingStore = create<WaitingState & WaitingActions>()((set, get) => ({
  ...initialState,

  setJob: (jobId, videoId, title, thumbnail) =>
    set({
      jobId,
      videoId,
      videoTitle: title,
      videoThumbnail: thumbnail ?? null,
    }),

  updateFromProgress: (progress) =>
    set((state) => ({
      stage: progress.stage ?? state.stage,
      progress: progress.progress ?? state.progress,
      estimatedSeconds: progress.estimatedSeconds ?? state.estimatedSeconds,
      isCompleted: progress.isCompleted ?? state.isCompleted,
      isFailed: progress.isFailed ?? state.isFailed,
    })),

  updateFromStatus: (status) =>
    set({
      stage: status.stage,
      progress: status.progress,
      estimatedSeconds: status.estimatedSeconds,
      queuePosition: status.queuePosition,
      isCompleted: status.isCompleted,
      isFailed: status.isFailed,
      errorMessage: status.errorMessage,
    }),

  setQueuePosition: (position) => set({ queuePosition: position }),

  setEta: (seconds) => set({ estimatedSeconds: seconds }),

  setSocketConnected: (connected) => set({ socketConnected: connected }),

  markCompleted: (data) =>
    set({
      isCompleted: true,
      isFailed: false,
      progress: 100,
      stage: 'COMPLETED',
      completedData: data,
    }),

  markFailed: (data) =>
    set({
      isFailed: true,
      isCompleted: false,
      errorMessage: data.error,
    }),

  setShortsFeed: (feed) => set({ shortsFeed: feed }),

  addToShortsFeed: (shorts) =>
    set((state) => ({ shortsFeed: [...state.shortsFeed, ...shorts] })),

  setActiveShort: (index) => set({ activeShortIndex: index }),

  markShortViewed: (shortId) =>
    set((state) => {
      const newViewed = new Set(state.viewedShortIds);
      newViewed.add(shortId);
      return { viewedShortIds: newViewed };
    }),

  setFeedLoading: (loading) => set({ feedLoading: loading }),

  setNextCursor: () => {
    // Cursor management handled by the hook
  },

  openPlayer: (url) => set({ showPlayer: true, redirectUrl: url }),

  reset: () => set(initialState),
}));

// Selectors
export const selectProgressPercent = (state: WaitingState) => state.progress;
export const selectStageLabel = (state: WaitingState) => state.stage ?? 'Initializing...';
export const selectIsWaiting = (state: WaitingState) =>
  !state.isCompleted && !state.isFailed && state.jobId !== null;
export const selectShortsCount = (state: WaitingState) => state.shortsFeed.length;
