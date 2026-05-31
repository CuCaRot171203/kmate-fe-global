import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SubtitleSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  translation: string;
  words?: WordInfo[];
}

export interface WordInfo {
  word: string;
  startChar: number;
  endChar: number;
  reading?: string;
}

interface SubtitleState {
  // Subtitle data
  segments: SubtitleSegment[];
  videoId: string | null;
  language: string;
  
  // Current segment tracking
  currentSegment: SubtitleSegment | null;
  currentSegmentIndex: number;
  
  // Loading state
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
}

interface SubtitleActions {
  // Data actions
  setSegments: (segments: SubtitleSegment[], videoId: string, language: string) => void;
  clearSegments: () => void;
  
  // Segment tracking
  updateCurrentSegment: (time: number) => SubtitleSegment | null;
  
  // State actions
  setIsLoading: (loading: boolean) => void;
  setHasError: (error: boolean, message?: string) => void;
  
  // Helpers
  getSegmentAtTime: (time: number) => SubtitleSegment | null;
  getSegmentIndex: (time: number) => number;
  getUpcomingSegments: (count: number) => SubtitleSegment[];
  getPreviousSegments: (count: number) => SubtitleSegment[];
}

const initialState: SubtitleState = {
  segments: [],
  videoId: null,
  language: 'vi',
  currentSegment: null,
  currentSegmentIndex: -1,
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

export const useSubtitleStore = create<SubtitleState & SubtitleActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSegments: (segments, videoId, language) => {
        set({
          segments,
          videoId,
          language,
          currentSegment: null,
          currentSegmentIndex: -1,
          isLoading: false,
          hasError: false,
        });
      },

      clearSegments: () => set({
        segments: [],
        videoId: null,
        currentSegment: null,
        currentSegmentIndex: -1,
      }),

      updateCurrentSegment: (time) => {
        const { segments } = get();
        if (!segments.length) return null;

        // Binary search for efficiency - O(log n)
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

        if (result !== get().currentSegment || resultIndex !== get().currentSegmentIndex) {
          set({ currentSegment: result, currentSegmentIndex: resultIndex });
        }

        return result;
      },

      setIsLoading: (isLoading) => set({ isLoading }),
      setHasError: (hasError, message = '') => set({ hasError, errorMessage: message }),

      getSegmentAtTime: (time) => {
        const { segments } = get();
        return segments.find(
          (s) => time >= s.startTime && time <= s.endTime
        ) || null;
      },

      getSegmentIndex: (time) => {
        const { segments } = get();
        const index = segments.findIndex(
          (s) => time >= s.startTime && time <= s.endTime
        );
        return index;
      },

      getUpcomingSegments: (count) => {
        const { segments, currentSegmentIndex } = get();
        const start = currentSegmentIndex + 1;
        return segments.slice(start, start + count);
      },

      getPreviousSegments: (count) => {
        const { segments, currentSegmentIndex } = get();
        const end = currentSegmentIndex;
        const start = Math.max(0, end - count);
        return segments.slice(start, end);
      },
    }),
    {
      name: 'kmate-subtitle-prefs',
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
);
