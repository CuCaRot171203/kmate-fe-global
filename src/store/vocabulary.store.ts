import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VocabularyItem {
  id: string;
  word: string;
  reading?: string;
  meaning: string;
  videoId: string;
  videoTitle: string;
  segmentId: string;
  timestamp: number;
  context: string;
  contextTranslation: string;
  savedAt: number;
  masteryLevel: 'new' | 'learning' | 'reviewing' | 'mastered';
  nextReview?: number;
  reviewCount: number;
  correctCount: number;
}

interface VocabularyState {
  items: VocabularyItem[];
  isLoading: boolean;
  totalCount: number;
  byVideo: Record<string, VocabularyItem[]>;
  byMastery: Record<string, VocabularyItem[]>;
}

interface VocabularyActions {
  addItem: (item: VocabularyItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<VocabularyItem>) => void;
  clearVideoItems: (videoId: string) => void;
  getItemsByVideo: (videoId: string) => VocabularyItem[];
  getItemByWord: (word: string) => VocabularyItem | undefined;
  isWordSaved: (word: string, videoId: string) => boolean;
  setLoading: (loading: boolean) => void;
  loadItems: (items: VocabularyItem[]) => void;
}

export const useVocabularyStore = create<VocabularyState & VocabularyActions>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      totalCount: 0,
      byVideo: {},
      byMastery: {},

      addItem: (item) => {
        set((state) => {
          const newItems = [item, ...state.items];
          const byVideo = groupByVideo(newItems);
          const byMastery = groupByMastery(newItems);
          return {
            items: newItems,
            totalCount: newItems.length,
            byVideo,
            byMastery,
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const byVideo = groupByVideo(newItems);
          const byMastery = groupByMastery(newItems);
          return {
            items: newItems,
            totalCount: newItems.length,
            byVideo,
            byMastery,
          };
        });
      },

      updateItem: (id, updates) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          );
          const byVideo = groupByVideo(newItems);
          const byMastery = groupByMastery(newItems);
          return {
            items: newItems,
            totalCount: newItems.length,
            byVideo,
            byMastery,
          };
        });
      },

      clearVideoItems: (videoId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.videoId !== videoId);
          const byVideo = groupByVideo(newItems);
          const byMastery = groupByMastery(newItems);
          return {
            items: newItems,
            totalCount: newItems.length,
            byVideo,
            byMastery,
          };
        });
      },

      getItemsByVideo: (videoId) => {
        return get().items.filter((item) => item.videoId === videoId);
      },

      getItemByWord: (word) => {
        return get().items.find(
          (item) => item.word === word
        );
      },

      isWordSaved: (word, videoId) => {
        return get().items.some(
          (item) => item.word === word && item.videoId === videoId
        );
      },

      setLoading: (isLoading) => set({ isLoading }),

      loadItems: (items) => {
        const byVideo = groupByVideo(items);
        const byMastery = groupByMastery(items);
        set({
          items,
          totalCount: items.length,
          byVideo,
          byMastery,
        });
      },
    }),
    {
      name: 'kmate-vocabulary',
    }
  )
);

// Helper functions
function groupByVideo(items: VocabularyItem[]): Record<string, VocabularyItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.videoId]) {
      acc[item.videoId] = [];
    }
    acc[item.videoId].push(item);
    return acc;
  }, {} as Record<string, VocabularyItem[]>);
}

function groupByMastery(items: VocabularyItem[]): Record<string, VocabularyItem[]> {
  return items.reduce((acc, item) => {
    const level = item.masteryLevel;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(item);
    return acc;
  }, {} as Record<string, VocabularyItem[]>);
}
