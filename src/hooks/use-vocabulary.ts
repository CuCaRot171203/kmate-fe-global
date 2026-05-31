'use client';

import { useCallback, useState } from 'react';
import { useVocabularyStore, VocabularyItem } from '@/store/vocabulary.store';
import { usePlayerStore } from '@/store/player.store';
import { useSubtitleStore } from '@/store/subtitle.store';
import { api } from '@/lib/api';

interface SaveVocabularyOptions {
  word: string;
  meaning: string;
  reading?: string;
  segmentId: string;
  context: string;
  contextTranslation: string;
}

// Mock translations for demo (in production, use a real API)
const MOCK_TRANSLATIONS: Record<string, string> = {
  '안녕하세요': 'Xin chào',
  '좋은': 'Tốt',
  '날이에요': 'Ngày',
  '한국어를': 'Tiếng Hàn',
  '배우고 있어요': 'Đang học',
  '음식': 'Đồ ăn',
  '정말': 'Thật sự',
  '맛있어요': 'Ngon',
  '좋아해요': 'Thích',
  '매운': 'Cay',
  '감사합니다': 'Cảm ơn',
  '화이팅': 'Cố lên',
};

export function useVocabulary() {
  const {
    items,
    totalCount,
    addItem,
    removeItem,
    updateItem,
    getItemsByVideo,
    getItemByWord,
    isWordSaved,
    loadItems,
  } = useVocabularyStore();

  const { video } = usePlayerStore();
  const { currentSegment } = useSubtitleStore();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save a vocabulary item
  const saveWord = useCallback(async (options: SaveVocabularyOptions): Promise<VocabularyItem | null> => {
    const { word, meaning, reading, segmentId, context, contextTranslation } = options;

    // Check if already saved
    if (video && isWordSaved(word, video.id)) {
      setError('Word already saved');
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const newItem: VocabularyItem = {
        id: `vocab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        word,
        reading,
        meaning,
        videoId: video?.id || 'unknown',
        videoTitle: video?.title || 'Unknown Video',
        segmentId,
        timestamp: video ? usePlayerStore.getState().currentTime : 0,
        context,
        contextTranslation,
        savedAt: Date.now(),
        masteryLevel: 'new',
        reviewCount: 0,
        correctCount: 0,
      };

      // Optimistic update
      addItem(newItem);

      // Sync to API
      if (video) {
        try {
          // await api.post('/vocabulary', newItem);
          console.debug('[Vocabulary] Saved:', word);
        } catch (apiError) {
          // Don't rollback on API error - localStorage is sufficient
          console.warn('[Vocabulary] API save failed, stored locally:', apiError);
        }
      }

      return newItem;
    } catch (err) {
      setError('Failed to save word');
      console.error('[Vocabulary] Save error:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [video, isWordSaved, addItem]);

  // Quick save from current subtitle segment
  const saveFromSegment = useCallback(async (word: string): Promise<VocabularyItem | null> => {
    if (!currentSegment || !video) {
      setError('No segment selected');
      return null;
    }

    // Look up translation or use mock
    const meaning = MOCK_TRANSLATIONS[word] || `Translation for: ${word}`;
    
    return saveWord({
      word,
      meaning,
      segmentId: currentSegment.id,
      context: currentSegment.text,
      contextTranslation: currentSegment.translation,
    });
  }, [currentSegment, video, saveWord]);

  // Remove a vocabulary item
  const deleteWord = useCallback(async (id: string): Promise<boolean> => {
    try {
      removeItem(id);
      
      try {
        // await api.delete(`/vocabulary/${id}`);
        console.debug('[Vocabulary] Removed:', id);
      } catch (apiError) {
        console.warn('[Vocabulary] API delete failed:', apiError);
      }
      
      return true;
    } catch (err) {
      setError('Failed to remove word');
      console.error('[Vocabulary] Delete error:', err);
      return false;
    }
  }, [removeItem]);

  // Update mastery level after review
  const updateMastery = useCallback(async (id: string, correct: boolean): Promise<void> => {
    const item = getItemByWord(id);
    if (!item) return;

    const newMastery = correct
      ? getNextMasteryUp(item.masteryLevel)
      : getNextMasteryDown(item.masteryLevel);

    // Calculate next review time (spaced repetition)
    const intervals: Record<string, number> = {
      new: 60000, // 1 min
      learning: 300000, // 5 min
      reviewing: 86400000, // 1 day
      mastered: 604800000, // 7 days
    };

    const nextReview = Date.now() + (intervals[newMastery] || 86400000);

    updateItem(id, {
      masteryLevel: newMastery,
      nextReview,
      reviewCount: item.reviewCount + 1,
      correctCount: correct ? item.correctCount + 1 : item.correctCount,
    });
  }, [getItemByWord, updateItem]);

  // Load vocabulary from API
  const loadFromApi = useCallback(async (): Promise<void> => {
    try {
      // const { data } = await api.get<{ items: VocabularyItem[] }>('/vocabulary');
      // loadItems(data.items);
      console.debug('[Vocabulary] Loaded from API');
    } catch (err) {
      console.error('[Vocabulary] Failed to load from API:', err);
    }
  }, [loadItems]);

  // Get vocabulary items for current video
  const getCurrentVideoVocab = useCallback((): VocabularyItem[] => {
    if (!video) return [];
    return getItemsByVideo(video.id);
  }, [video, getItemsByVideo]);

  // Export vocabulary as flashcard format
  const exportAsCsv = useCallback((): string => {
    const headers = ['Word', 'Reading', 'Meaning', 'Context', 'Translation', 'Video'];
    const rows = items.map(item => [
      item.word,
      item.reading || '',
      item.meaning,
      item.context,
      item.contextTranslation,
      item.videoTitle,
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }, [items]);

  return {
    // State
    items,
    totalCount,
    isSaving,
    error,
    
    // Actions
    saveWord,
    saveFromSegment,
    deleteWord,
    updateMastery,
    loadFromApi,
    
    // Queries
    getCurrentVideoVocab,
    getItemByWord,
    isWordSaved: video ? (word: string) => isWordSaved(word, video.id) : () => false,
    getItemsByVideo,
    
    // Export
    exportAsCsv,
    
    // Stats
    stats: {
      total: items.length,
      new: items.filter(i => i.masteryLevel === 'new').length,
      learning: items.filter(i => i.masteryLevel === 'learning').length,
      reviewing: items.filter(i => i.masteryLevel === 'reviewing').length,
      mastered: items.filter(i => i.masteryLevel === 'mastered').length,
    },
  };
}

// Helper functions for spaced repetition
function getNextMasteryUp(current: VocabularyItem['masteryLevel']): VocabularyItem['masteryLevel'] {
  const progression: Record<string, VocabularyItem['masteryLevel']> = {
    new: 'learning',
    learning: 'reviewing',
    reviewing: 'mastered',
    mastered: 'mastered',
  };
  return progression[current];
}

function getNextMasteryDown(current: VocabularyItem['masteryLevel']): VocabularyItem['masteryLevel'] {
  const progression: Record<string, VocabularyItem['masteryLevel']> = {
    new: 'new',
    learning: 'new',
    reviewing: 'learning',
    mastered: 'reviewing',
  };
  return progression[current];
}
