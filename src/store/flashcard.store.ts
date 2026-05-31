import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Flashcard {
  id: string;
  word: string;
  reading: string | null;
  meaning: string;
  masteryLevel: 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED';
  nextReview: Date;
}

interface FlashcardState {
  dueCards: Flashcard[];
  currentReviewIndex: number;
  isReviewing: boolean;

  // Actions
  setDueCards: (cards: Flashcard[]) => void;
  nextCard: () => void;
  startReview: () => void;
  endReview: () => void;
  updateCardMastery: (cardId: string, mastery: Flashcard['masteryLevel']) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      dueCards: [],
      currentReviewIndex: 0,
      isReviewing: false,

      setDueCards: (dueCards) => set({ dueCards, currentReviewIndex: 0 }),

      nextCard: () => {
        const { currentReviewIndex, dueCards } = get();
        if (currentReviewIndex < dueCards.length - 1) {
          set({ currentReviewIndex: currentReviewIndex + 1 });
        } else {
          set({ isReviewing: false, currentReviewIndex: 0 });
        }
      },

      startReview: () => set({ isReviewing: true, currentReviewIndex: 0 }),

      endReview: () => set({ isReviewing: false, currentReviewIndex: 0 }),

      updateCardMastery: (cardId, mastery) =>
        set((state) => ({
          dueCards: state.dueCards.filter((c) => c.id !== cardId),
        })),
    }),
    {
      name: 'kmate-flashcard',
      partialize: (state) => ({
        dueCards: state.dueCards,
      }),
    }
  )
);
