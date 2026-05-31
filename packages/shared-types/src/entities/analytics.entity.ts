// Analytics Types
export interface UserStats {
  userId: string;
  totalVideosWatched: number;
  totalMinutesLearned: number;
  totalWordsLookedUp: number;
  totalFlashcardsCreated: number;
  totalFlashcardsReviewed: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  currentStreak: number;
  longestStreak: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  currentCoinBalance: number;
  joinedAt: Date;
  lastActiveAt: Date | null;
}

export interface VideoStats {
  videoId: string;
  totalViews: number;
  uniqueViewers: number;
  averageWatchDuration: number;
  completionRate: number;
  averageQuizScore: number;
  totalFlashcardsCreated: number;
  totalCoinsEarned: number;
}

export interface DailyStats {
  date: Date;
  newUsers: number;
  activeUsers: number;
  totalVideosWatched: number;
  totalMinutesLearned: number;
  totalPayments: number;
  totalRevenue: number;
  newFlashcardsCreated: number;
  quizzesTaken: number;
}

export interface RevenueStats {
  period: string;
  totalRevenue: number;
  transactionCount: number;
  averageOrderValue: number;
  coinPackagesSold: Record<string, number>;
}
