import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WatchProgress {
  videoId: string;
  youtubeId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  duration: number;
  currentTime: number;
  progress: number;
  lastWatched: number;
  completedSegments: string[];
  totalSegments: number;
  isCompleted: boolean;
  watchCount: number;
  totalWatchTime: number;
  sessionStartTime?: number;
}

export interface WatchSession {
  videoId: string;
  startTime: number;
  lastActiveTime: number;
  totalDuration: number;
}

interface WatchHistoryState {
  progress: Record<string, WatchProgress>;
  sessions: Record<string, WatchSession>;
  recentlyWatched: string[];
  continueWatching: WatchProgress[];
}

interface WatchHistoryActions {
  // Progress actions
  updateProgress: (videoId: string, currentTime: number, duration: number, metadata?: Partial<WatchProgress>) => void;
  markSegmentWatched: (videoId: string, segmentId: string) => void;
  markCompleted: (videoId: string) => void;
  
  // Session actions
  startSession: (videoId: string) => void;
  endSession: (videoId: string) => void;
  updateSessionActivity: (videoId: string) => void;
  
  // Query actions
  getProgress: (videoId: string) => WatchProgress | null;
  getResumeTime: (videoId: string) => number;
  getRecentlyWatched: (limit?: number) => WatchProgress[];
  getContinueWatching: (limit?: number) => WatchProgress[];
  getTotalWatchTime: (videoId: string) => number;
  
  // Bulk actions
  loadProgress: (progressList: WatchProgress[]) => void;
  clearProgress: (videoId: string) => void;
  clearAllProgress: () => void;
  
  // Helpers
  getVideoStats: (videoId: string) => {
    watchCount: number;
    totalWatchTime: number;
    completionRate: number;
    lastWatched: number | null;
  };
}

export const useWatchHistoryStore = create<WatchHistoryState & WatchHistoryActions>()(
  persist(
    (set, get) => ({
      progress: {},
      sessions: {},
      recentlyWatched: [],
      continueWatching: [],

      updateProgress: (videoId, currentTime, duration, metadata = {}) => {
        set((state) => {
          const existing = state.progress[videoId] || {
            videoId,
            youtubeId: metadata.youtubeId || '',
            title: metadata.title || 'Unknown Video',
            thumbnail: metadata.thumbnail || '',
            channelName: metadata.channelName || '',
            duration,
            currentTime: 0,
            progress: 0,
            lastWatched: Date.now(),
            completedSegments: [],
            totalSegments: 0,
            isCompleted: false,
            watchCount: 0,
            totalWatchTime: 0,
          };

          const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
          const isCompleted = progressPercent >= 90;
          const now = Date.now();

          const updated: WatchProgress = {
            ...existing,
            ...metadata,
            videoId,
            currentTime,
            duration,
            progress: progressPercent,
            lastWatched: now,
            isCompleted: existing.isCompleted || isCompleted,
          };

          // Update session if active
          let sessions = state.sessions;
          if (sessions[videoId]) {
            const session = sessions[videoId];
            sessions = {
              ...sessions,
              [videoId]: {
                ...session,
                lastActiveTime: now,
                totalDuration: now - session.startTime,
              },
            };
          }

          // Update recently watched
          let recentlyWatched = state.recentlyWatched.filter(id => id !== videoId);
          recentlyWatched = [videoId, ...recentlyWatched].slice(0, 20);

          // Update continue watching (in progress, not completed)
          let continueWatching = Object.values({ ...state.progress, [videoId]: updated })
            .filter(p => !p.isCompleted && p.progress > 0)
            .sort((a, b) => b.lastWatched - a.lastWatched)
            .slice(0, 10);

          return {
            progress: {
              ...state.progress,
              [videoId]: updated,
            },
            sessions,
            recentlyWatched,
            continueWatching,
          };
        });
      },

      markSegmentWatched: (videoId, segmentId) => {
        set((state) => {
          const existing = state.progress[videoId];
          if (!existing) return state;

          if (existing.completedSegments.includes(segmentId)) return state;

          return {
            progress: {
              ...state.progress,
              [videoId]: {
                ...existing,
                completedSegments: [...existing.completedSegments, segmentId],
              },
            },
          };
        });
      },

      markCompleted: (videoId) => {
        set((state) => {
          const existing = state.progress[videoId];
          if (!existing) return state;

          return {
            progress: {
              ...state.progress,
              [videoId]: {
                ...existing,
                isCompleted: true,
                progress: 100,
              },
            },
            continueWatching: state.continueWatching.filter(p => p.videoId !== videoId),
          };
        });
      },

      startSession: (videoId) => {
        const now = Date.now();
        set((state) => ({
          sessions: {
            ...state.sessions,
            [videoId]: {
              videoId,
              startTime: now,
              lastActiveTime: now,
              totalDuration: 0,
            },
          },
          progress: {
            ...state.progress,
            [videoId]: {
              ...(state.progress[videoId] || {
                videoId,
                youtubeId: '',
                title: 'Unknown Video',
                thumbnail: '',
                channelName: '',
                duration: 0,
                currentTime: 0,
                progress: 0,
                completedSegments: [],
                totalSegments: 0,
                isCompleted: false,
                watchCount: 0,
                totalWatchTime: 0,
              }),
              watchCount: (state.progress[videoId]?.watchCount || 0) + 1,
              lastWatched: now,
            },
          },
        }));
      },

      endSession: (videoId) => {
        set((state) => {
          const session = state.sessions[videoId];
          const progress = state.progress[videoId];

          if (!session || !progress) return state;

          const sessionDuration = session.lastActiveTime - session.startTime;

          return {
            sessions: Object.fromEntries(
              Object.entries(state.sessions).filter(([id]) => id !== videoId)
            ),
            progress: {
              ...state.progress,
              [videoId]: {
                ...progress,
                totalWatchTime: progress.totalWatchTime + sessionDuration,
              },
            },
          };
        });
      },

      updateSessionActivity: (videoId) => {
        set((state) => {
          const session = state.sessions[videoId];
          if (!session) return state;

          return {
            sessions: {
              ...state.sessions,
              [videoId]: {
                ...session,
                lastActiveTime: Date.now(),
              },
            },
          };
        });
      },

      getProgress: (videoId) => {
        return get().progress[videoId] || null;
      },

      getResumeTime: (videoId) => {
        const progress = get().progress[videoId];
        if (!progress) return 0;
        // Resume a few seconds before where they left off for context
        return Math.max(0, progress.currentTime - 3);
      },

      getRecentlyWatched: (limit = 10) => {
        const { progress, recentlyWatched } = get();
        return recentlyWatched
          .map(id => progress[id])
          .filter(Boolean)
          .slice(0, limit);
      },

      getContinueWatching: (limit = 10) => {
        const { continueWatching } = get();
        return continueWatching.slice(0, limit);
      },

      getTotalWatchTime: (videoId) => {
        const progress = get().progress[videoId];
        return progress?.totalWatchTime || 0;
      },

      loadProgress: (progressList) => {
        const progress: Record<string, WatchProgress> = {};
        const recentlyWatched: string[] = [];

        for (const item of progressList) {
          progress[item.videoId] = item;
          recentlyWatched.push(item.videoId);
        }

        const continueWatching = progressList
          .filter(p => !p.isCompleted && p.progress > 0)
          .sort((a, b) => b.lastWatched - a.lastWatched)
          .slice(0, 10);

        set({
          progress,
          recentlyWatched,
          continueWatching,
        });
      },

      clearProgress: (videoId) => {
        set((state) => {
          const newProgress = { ...state.progress };
          delete newProgress[videoId];

          return {
            progress: newProgress,
            recentlyWatched: state.recentlyWatched.filter(id => id !== videoId),
            continueWatching: state.continueWatching.filter(p => p.videoId !== videoId),
          };
        });
      },

      clearAllProgress: () => {
        set({
          progress: {},
          sessions: {},
          recentlyWatched: [],
          continueWatching: [],
        });
      },

      getVideoStats: (videoId) => {
        const progress = get().progress[videoId];
        if (!progress) {
          return {
            watchCount: 0,
            totalWatchTime: 0,
            completionRate: 0,
            lastWatched: null,
          };
        }

        return {
          watchCount: progress.watchCount,
          totalWatchTime: progress.totalWatchTime,
          completionRate: progress.totalSegments > 0
            ? (progress.completedSegments.length / progress.totalSegments) * 100
            : progress.progress,
          lastWatched: progress.lastWatched,
        };
      },
    }),
    {
      name: 'kmate-watch-history',
    }
  )
);
