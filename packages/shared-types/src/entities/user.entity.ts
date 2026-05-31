import type {
  UserRole,
  AuthProvider,
  VideoSubtitleType,
  WatchStatus,
  FlashcardMasteryLevel,
} from '../enums';
export type {
  UserRole,
  AuthProvider,
  VideoSubtitleType,
  WatchStatus,
  FlashcardMasteryLevel,
};

// User Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  provider: AuthProvider;
  providerId: string | null;
  coinBalance: number;
  streak: number;
  lastActiveAt: Date | null;
  isNewUser: boolean;
  isBanned: boolean;
  banReason: string | null;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserPreferences {
  subtitleLanguage: string;
  subtitleFontSize: number;
  subtitleFontColor: string;
  subtitleBackgroundColor: string;
  playbackSpeed: number;
  autoPlay: boolean;
  notificationEmail: boolean;
  notificationPush: boolean;
  notificationInApp: boolean;
  dailyReminder: boolean;
  reminderTime: string;
}

export interface ConnectedAccount {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerId: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: Date;
}

// Video Types
export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: number;
  channelTitle: string | null;
  channelId: string | null;
  viewCount: number;
  likeCount: number;
  categoryId: string | null;
  language: string;
  subtitleStatus: VideoSubtitleType;
  subtitleType: VideoSubtitleType | null;
  cachedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface VideoMetadata {
  id: string;
  videoId: string;
  youtubeMetadata: Record<string, unknown>;
  cachedAt: Date;
  expiresAt: Date;
}

export interface VideoSubtitle {
  id: string;
  videoId: string;
  language: string;
  subtitleContent: VideoSubtitleSegment[];
  bilingualContent: BilingualSubtitleSegment[] | null;
  source: VideoSubtitleType;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoSubtitleSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface BilingualSubtitleSegment {
  id: string;
  startTime: number;
  endTime: number;
  korean: string;
  vietnamese: string;
}

export interface SubtitleCache {
  id: string;
  videoId: string;
  youtubeSubtitleUrl: string | null;
  cachedAt: Date;
  expiresAt: Date;
}

export interface WatchProgress {
  id: string;
  userId: string;
  videoId: string;
  currentTime: number;
  duration: number;
  progress: number;
  status: WatchStatus;
  lastWatchedAt: Date;
  watchCount: number;
  pauseCount: number;
  rewatchCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningHistory {
  id: string;
  userId: string;
  videoId: string;
  sessionId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number;
  wordsLookedUp: number;
  flashcardsSaved: number;
  quizScore: number | null;
  createdAt: Date;
}

export interface LearningSession {
  id: string;
  userId: string;
  videoId: string;
  startTime: Date;
  endTime: Date | null;
  totalDuration: number;
  wordsLookedUp: number;
  flashcardsSaved: number;
}

// Flashcard Types
export interface Flashcard {
  id: string;
  userId: string;
  deckId: string | null;
  word: string;
  reading: string | null;
  meaning: string;
  partOfSpeech: string | null;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  pronunciation: string | null;
  masteryLevel: FlashcardMasteryLevel;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReview: Date | null;
  source: 'smart_overlay' | 'manual' | 'quiz';
  videoId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface FlashcardDeck {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  cardCount: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface FlashcardReview {
  id: string;
  userId: string;
  flashcardId: string;
  quality: number;
  previousEaseFactor: number;
  newEaseFactor: number;
  previousInterval: number;
  newInterval: number;
  reviewedAt: Date;
}

export interface VocabularyLookup {
  id: string;
  userId: string;
  word: string;
  language: string;
  meaning: string | null;
  partOfSpeech: string | null;
  pronunciation: string | null;
  exampleSentence: string | null;
  videoId: string | null;
  subtitleTimestamp: number | null;
  isSaved: boolean;
  lookedUpAt: Date;
}

export interface VocabularyBookmark {
  id: string;
  userId: string;
  word: string;
  videoId: string;
  timestamp: number;
  createdAt: Date;
}
