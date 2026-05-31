import type { QuizType } from '../enums';

// Quiz Types
export interface Quiz {
  id: string;
  userId: string;
  videoId: string;
  type: QuizType;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  feedback: QuizFeedback | null;
  status: 'pending' | 'completed' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  type: QuizType;
  question: string;
  questionKorean: string | null;
  options: QuizOption[] | null;
  correctAnswer: string;
  explanation: string | null;
  vocabulary: string[];
  order: number;
  createdAt: Date;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizAnswer {
  id: string;
  quizId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  createdAt: Date;
}

export interface QuizFeedback {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  vocabularyToReview: VocabularyFeedback[];
}

export interface VocabularyFeedback {
  word: string;
  meaning: string;
  reason: string;
}

// AI Vocabulary Analysis
export interface AIVocabularyAnalysis {
  id: string;
  videoId: string;
  word: string;
  frequency: number;
  difficulty: 'easy' | 'medium' | 'hard';
  partOfSpeech: string | null;
  meaning: string;
  pronunciation: string | null;
  exampleSentence: string | null;
  relatedWords: string[];
  createdAt: Date;
}

export interface AIVocabularyLookup {
  id: string;
  userId: string;
  word: string;
  meaning: string | null;
  partOfSpeech: string | null;
  pronunciation: string | null;
  exampleSentence: string | null;
  createdAt: Date;
}
