import { api } from '@/lib/api';

// ============================================================
// AUTH
// ============================================================
export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post<{ data: { user: AuthUser; accessToken: string; refreshToken: string } }>('/auth/login', data),

  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ data: { user: AuthUser; accessToken: string; refreshToken: string } }>('/auth/register', data),

  logout: (refreshToken?: string) =>
    api.post('/auth/logout', { refreshToken }),

  me: () =>
    api.get<{ data: AuthUser }>('/auth/me'),

  refresh: (refreshToken: string) =>
    api.post<{ data: { accessToken: string; refreshToken: string } }>('/auth/refresh', { refreshToken }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  getSessions: () =>
    api.get<{ data: { sessions: AuthSession[]; total: number } }>('/auth/sessions'),

  revokeSession: (sessionId: string) =>
    api.delete(`/auth/sessions/${sessionId}`),

  getProviders: () =>
    api.get<{ data: { providers: AuthProvider[] } }>('/auth/providers'),
};

// ============================================================
// COIN / WALLET
// ============================================================
export const coinService = {
  getBalance: () =>
    api.get<{ data: CoinBalance }>('/coins/balance'),

  getHistory: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get<{ data: CoinTransaction[]; pagination: Pagination }>('/coins/history', { params }),

  getPackages: () =>
    api.get<{ data: CoinPackage[] }>('/coins/packages'),

  getRewards: () =>
    api.get<{ data: CoinReward[] }>('/coins/rewards'),

  dailyLogin: () =>
    api.post<{ data: DailyLoginResponse }>('/coins/daily-login'),
};

// ============================================================
// USERS
// ============================================================
export const userService = {
  getProfile: () =>
    api.get<{ data: UserProfile }>('/users/profile'),

  updateProfile: (data: { name?: string; avatar?: string; preferences?: Record<string, unknown> }) =>
    api.put('/users/profile', data),

  getStatistics: () =>
    api.get<{ data: UserStatistics }>('/users/statistics'),

  getAchievements: () =>
    api.get<{ data: UserAchievement[] }>('/users/achievements'),

  updatePreferences: (preferences: Record<string, unknown>) =>
    api.put('/users/preferences', { preferences }),

  getHistory: (params?: { page?: number; limit?: number }) =>
    api.get<{ data: LearningHistory[]; pagination: Pagination }>('/users/history', { params }),
};

// ============================================================
// NOTIFICATIONS
// ============================================================
export const notificationService = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<{ data: Notification[]; pagination: Pagination }>('/notifications', { params }),

  markAsRead: (ids?: string[]) =>
    api.put('/notifications/read', { notificationIds: ids }),

  markOneAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),

  delete: (id: string) =>
    api.delete(`/notifications/${id}`),
};

// ============================================================
// ADMIN
// ============================================================
export const adminService = {
  getDashboard: () =>
    api.get<{ data: AdminDashboard }>('/admin/dashboard'),

  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<{ data: AdminUser[]; pagination: Pagination }>('/admin/users', { params }),

  getUser: (id: string) =>
    api.get<{ data: AdminUserDetail }>(`/admin/users/${id}`),

  banUser: (id: string, reason?: string) =>
    api.post(`/admin/users/${id}/ban`, { reason }),

  unbanUser: (id: string) =>
    api.post(`/admin/users/${id}/unban`),

  getTransactions: (params?: { page?: number; limit?: number }) =>
    api.get<{ data: AdminTransaction[]; pagination: Pagination }>('/admin/transactions', { params }),

  getPayments: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<{ data: AdminPayment[]; pagination: Pagination }>('/admin/payments', { params }),

  getAIQueue: (params?: { status?: string }) =>
    api.get<{ data: AIJob[] }>('/admin/ai-queue', { params }),

  retryAIJob: (id: string) =>
    api.post(`/admin/ai-queue/${id}/retry`),

  cancelAIJob: (id: string) =>
    api.post(`/admin/ai-queue/${id}/cancel`),

  getAchievements: () =>
    api.get<{ data: Achievement[] }>('/admin/achievements'),

  createAchievement: (data: AchievementInput) =>
    api.post<{ data: Achievement }>('/admin/achievements', data),

  updateAchievement: (id: string, data: Partial<AchievementInput>) =>
    api.put<{ data: Achievement }>(`/admin/achievements/${id}`, data),

  getPackages: () =>
    api.get<{ data: CoinPackageAdmin[] }>('/admin/packages'),

  createPackage: (data: PackageInput) =>
    api.post<{ data: CoinPackageAdmin }>('/admin/packages', data),

  updatePackage: (id: string, data: Partial<PackageInput>) =>
    api.put<{ data: CoinPackageAdmin }>(`/admin/packages/${id}`, data),

  getLogs: (params?: { page?: number; limit?: number; action?: string }) =>
    api.get<{ data: AdminLog[]; pagination: Pagination }>('/admin/logs', { params }),

  getAnalytics: () =>
    api.get<{ data: AdminAnalytics }>('/admin/analytics'),
};

// ============================================================
// TYPES
// ============================================================
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  coinBalance: number;
  streak: number;
  isNewUser: boolean;
  preferences?: Record<string, unknown>;
  createdAt: string;
}

export interface AuthSession {
  id: string;
  deviceInfo: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

export interface AuthProvider {
  provider: string;
  email: string;
  name: string | null;
  linkedAt: string;
  isPrimary: boolean;
}

export interface CoinBalance {
  balance: number;
  lifetimeEarnings: number;
  lifetimeSpent: number;
}

export interface CoinTransaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface CoinPackage {
  id: string;
  name: string;
  description: string | null;
  coinAmount: number;
  bonusCoinAmount?: number;
  price: number;
  isActive: boolean;
  sortOrder?: number;
}

export interface CoinReward {
  id: string;
  type: string;
  name: string;
  description: string | null;
  coinAmount: number;
  maxClaims: number | null;
  currentClaims: number;
  isActive: boolean;
}

export interface DailyLoginResponse {
  message: string;
  reward: number;
  newBalance: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  coinBalance: number;
  streak: number;
  isNewUser: boolean;
  preferences: Record<string, unknown>;
  createdAt: string;
  userStreak: {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
  };
  _count: {
    flashcards: number;
    quizzes: number;
    watchProgress: number;
  };
}

export interface UserStatistics {
  totalVideosWatched: number;
  totalFlashcards: number;
  totalFlashcardReviews: number;
  totalQuizzesTaken: number;
  totalMinutesLearned: number;
  totalWordsLookedUp: number;
  currentStreak: number;
  longestStreak: number;
  currentCoinBalance: number;
  joinedAt: string;
}

export interface UserAchievement {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  coinReward: number;
  xpReward: number;
  requirement: number;
  isActive: boolean;
  unlockedAt: string | null;
  progress: number;
  isUnlocked: boolean;
}

export interface LearningHistory {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  wordsLookedUp: number;
  video: {
    id: string;
    youtubeId: string;
    title: string;
    thumbnail: string | null;
  } | null;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Admin types
export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  totalVideos: number;
  totalPayments: number;
  totalRevenue: number;
  pendingAIJobs: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  isBanned: boolean;
  coinBalance: number;
  streak: number;
  createdAt: string;
  lastActiveAt: string | null;
  _count: {
    flashcards: number;
    quizzes: number;
  };
}

export interface AdminUserDetail extends AdminUser {
  preferences: Record<string, unknown>;
  _count: {
    flashcards: number;
    quizzes: number;
    watchProgress: number;
    payments: number;
  };
}

export interface AdminTransaction {
  id: string;
  userId: string;
  walletId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  description: string | null;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
}

export interface AdminPayment {
  id: string;
  userId: string;
  amount: number;
  coinAmount: number;
  status: string;
  payosOrderCode: string | null;
  createdAt: string;
  paidAt: string | null;
  user: { id: string; email: string; name: string | null };
}

export interface AIJob {
  id: string;
  userId: string;
  videoId: string;
  type: string;
  status: string;
  progress: number;
  stage: string;
  retryCount: number;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
  user: { id: string; email: string; name: string | null };
  video: { id: string; title: string; youtubeId: string };
}

export interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  coinReward: number;
  xpReward: number;
  requirement: number;
  isActive: boolean;
  createdAt: string;
}

export type AchievementInput = Omit<Achievement, 'id' | 'createdAt'>;
export type PackageInput = Omit<CoinPackage, 'id'>;

export interface CoinPackageAdmin extends CoinPackage {
  sortOrder: number;
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  newData?: Record<string, unknown>;
  createdAt: string;
  admin: { id: string; email: string; name: string | null };
}

export interface AdminAnalytics {
  dailyStats: Array<{
    date: string;
    videosWatched: number;
    minutesLearned: number;
    flashcardsReviewed: number;
    quizzesTaken: number;
  }>;
}
