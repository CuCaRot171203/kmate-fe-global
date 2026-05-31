import type {
  AIJobType,
  AIJobStatus,
  AchievementType,
} from '../enums';

// AI Job Types
export interface AIJob {
  id: string;
  userId: string;
  videoId: string;
  type: AIJobType;
  status: AIJobStatus;
  priority: number;
  progress: number;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  startedAt: Date | null;
  completedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AISubtitleJob {
  id: string;
  jobId: string;
  videoId: string;
  youtubeUrl: string;
  language: string;
  audioUrl: string | null;
  transcript: string | null;
  subtitles: string | null;
  translation: string | null;
  processingStep: 'audio_extraction' | 'transcription' | 'translation' | 'sync' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface AIQuizJob {
  id: string;
  jobId: string;
  videoId: string;
  vocabulary: string[];
  questions: import('./quiz.entity').QuizQuestion[] | null;
  generatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Achievement Types
export interface Achievement {
  id: string;
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  coinReward: number;
  xpReward: number;
  requirement: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Streak Types
export interface UserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  streakStartDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyActivity {
  id: string;
  userId: string;
  date: Date;
  videosWatched: number;
  minutesLearned: number;
  wordsLookedUp: number;
  flashcardsReviewed: number;
  flashcardsCreated: number;
  quizzesTaken: number;
  averageQuizScore: number;
  createdAt: Date;
  updatedAt: Date;
}
