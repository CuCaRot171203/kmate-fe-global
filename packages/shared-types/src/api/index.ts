export * from '../entities';

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface OAuthCallbackRequest {
  provider: 'google' | 'facebook';
  code: string;
  redirectUri: string;
}

export interface AuthResponse {
  user: import('../entities/user.entity').User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User API Types
export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  preferences?: import('../entities/user.entity').UserPreferences;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Video API Types
export interface VideoSearchQuery {
  q?: string;
  youtubeUrl?: string;
  page?: number;
  limit?: number;
  language?: string;
  duration?: 'short' | 'medium' | 'long';
}

export interface VideoSearchResponse {
  videos: import('../entities/user.entity').Video[];
  nextPageToken?: string;
  totalResults: number;
}

export interface UnlockVideoRequest {
  videoId: string;
}

export interface UnlockVideoResponse {
  success: boolean;
  coinDeducted: number;
  newBalance: number;
  processingStatus: 'immediate' | 'queued';
  estimatedTime?: number;
}

// Subtitle API Types
export interface SubtitleResponse {
  videoId: string;
  subtitles: import('../entities/user.entity').VideoSubtitle[];
  bilingual: import('../entities/user.entity').BilingualSubtitleSegment[];
}

export interface ProcessSubtitleRequest {
  videoId: string;
  language?: string;
}

// Payment API Types
export interface CreatePaymentRequest {
  packageId: string;
  method: 'PAYOS';
}

export interface CreatePaymentResponse {
  paymentId: string;
  checkoutUrl: string;
  qrCode: string;
  expiresAt: Date;
}

export interface PaymentCallbackPayload {
  code: string;
  desc: string;
  amount: number;
  orderCode: string;
  paidAt: number;
  signature: string;
}

// Coin API Types
export interface CoinBalanceResponse {
  balance: number;
  lifetimeEarnings: number;
  lifetimeSpent: number;
}

export interface CoinTransactionQuery {
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Flashcard API Types
export interface CreateFlashcardRequest {
  word: string;
  meaning: string;
  reading?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  deckId?: string;
  videoId?: string;
}

export interface UpdateFlashcardRequest {
  word?: string;
  meaning?: string;
  reading?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  deckId?: string;
}

export interface FlashcardReviewRequest {
  flashcardId: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface FlashcardReviewResponse {
  flashcardId: string;
  newInterval: number;
  nextReview: Date;
  easeFactor: number;
  masteryLevel: string;
}

// Quiz API Types
export interface QuizQuestionResponse {
  quizId: string;
  questions: import('../entities/quiz.entity').QuizQuestion[];
  timeLimit: number;
  expiresAt: Date;
}

export interface SubmitQuizRequest {
  answers: {
    questionId: string;
    answer: string;
    timeSpent: number;
  }[];
}

export interface QuizResultResponse {
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  feedback: import('../entities/quiz.entity').QuizFeedback | null;
}

// Notification API Types
export interface NotificationQuery {
  type?: string;
  status?: string;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export interface MarkNotificationsReadRequest {
  notificationIds: string[];
}

export interface RegisterPushTokenRequest {
  token: string;
  platform: 'ios' | 'android' | 'web';
}

// Admin API Types
export interface AdminUserQuery {
  search?: string;
  role?: string;
  isBanned?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminAnalyticsQuery {
  startDate: string;
  endDate: string;
  groupBy: 'day' | 'week' | 'month';
}

export interface AdminTransactionQuery {
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AdminAIJobQuery {
  status?: string;
  type?: string;
  videoId?: string;
  page?: number;
  limit?: number;
}

export interface RetryAIJobRequest {
  jobId: string;
}

export interface ToggleFeatureRequest {
  featureKey: string;
  isEnabled: boolean;
  rolloutPercentage?: number;
}

export interface BanUserRequest {
  userId: string;
  reason: string;
}
