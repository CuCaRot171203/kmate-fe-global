// WebSocket Event Types

export enum SocketNamespace {
  PRIVATE = '/private',
  PUBLIC = '/public',
  ADMIN = '/admin',
}

export enum SocketRoom {
  USER = 'user',
  VIDEO = 'video',
  NOTIFICATION = 'notification',
  AI_PROGRESS = 'ai-progress',
}

// Client to Server Events
export interface ClientToServerEvents {
  'join:user-room': (userId: string) => void;
  'leave:user-room': (userId: string) => void;
  'join:video-room': (videoId: string) => void;
  'leave:video-room': (videoId: string) => void;
  'subscribe:ai-progress': (jobId: string) => void;
  'unsubscribe:ai-progress': (jobId: string) => void;
  'subscribe:waiting': (jobId: string) => void;
  'unsubscribe:waiting': (jobId: string) => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  // Auth Events
  'auth:session-expired': () => void;
  'auth:force-logout': (reason: string) => void;

  // Video Events
  'video:processing-started': (data: VideoProcessingStarted) => void;
  'video:processing-completed': (data: VideoProcessingCompleted) => void;
  'video:processing-failed': (data: VideoProcessingFailed) => void;
  'video:unlocked': (data: VideoUnlocked) => void;

  // AI Progress Events
  'ai:job-progress': (data: AIJobProgress) => void;
  'ai:job-completed': (data: AIJobCompleted) => void;
  'ai:job-failed': (data: AIJobFailed) => void;
  'ai:queue-position': (data: AIQueuePosition) => void;

  // Subtitle Processing Events
  'subtitle:job-created': (data: SubtitleJobCreated) => void;
  'subtitle:job-progress': (data: SubtitleJobProgress) => void;
  'subtitle:job-completed': (data: SubtitleJobCompleted) => void;
  'subtitle:job-failed': (data: SubtitleJobFailed) => void;
  'subtitle:ready': (data: SubtitleReady) => void;
  'subtitle:error': (data: SubtitleError) => void;

  // Waiting Events (Smart Waiting Module)
  'waiting:job-progress': (data: WaitingJobProgressPayload) => void;
  'waiting:job-completed': (data: WaitingJobCompletedPayload) => void;
  'waiting:job-failed': (data: WaitingJobFailedPayload) => void;
  'waiting:eta-update': (data: WaitingEtaUpdatePayload) => void;
  'waiting:queue-update': (data: WaitingQueueUpdatePayload) => void;

  // Notification Events
  'notification:new': (data: NewNotification) => void;
  'notification:flashcard-reminder': (data: FlashcardReminder) => void;
  'notification:streak-reminder': (data: StreakReminder) => void;
  'notification:payment-success': (data: PaymentSuccessNotification) => void;

  // Quiz Events
  'quiz:available': (data: QuizAvailable) => void;
  'quiz:reminder': (data: QuizReminder) => void;

  // Coin Events
  'coin:balance-updated': (data: CoinBalanceUpdated) => void;
  'coin:deducted': (data: CoinDeducted) => void;
  'coin:earned': (data: CoinEarned) => void;

  // Learning Events
  'learning:milestone': (data: LearningMilestone) => void;
  'learning:achievement-unlocked': (data: AchievementUnlocked) => void;

  // System Events
  'system:maintenance': (data: SystemMaintenance) => void;
  'system:announcement': (data: SystemAnnouncement) => void;
}

// Payload Types
export interface VideoProcessingStarted {
  videoId: string;
  jobId: string;
  estimatedTime: number;
  queuePosition: number;
}

export interface VideoProcessingCompleted {
  videoId: string;
  jobId: string;
  subtitleUrl?: string;
}

export interface VideoProcessingFailed {
  videoId: string;
  jobId: string;
  error: string;
  retryable: boolean;
  nextRetryAt?: number;
}

export interface VideoUnlocked {
  videoId: string;
  coinDeducted: number;
  newBalance: number;
}

export interface AIJobProgress {
  jobId: string;
  type: string;
  progress: number;
  stage?: string;
  message?: string;
}

export interface AIJobCompleted {
  jobId: string;
  type: string;
  result: Record<string, unknown>;
}

export interface AIJobFailed {
  jobId: string;
  type: string;
  error: string;
  retryable: boolean;
  retryCount: number;
}

export interface AIQueuePosition {
  jobId: string;
  position: number;
  estimatedWaitTime: number;
}

export interface NewNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

export interface FlashcardReminder {
  dueCount: number;
  dueCards: {
    id: string;
    word: string;
    dueAt: Date;
  }[];
}

export interface StreakReminder {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  daysMissed: number;
}

export interface PaymentSuccessNotification {
  paymentId: string;
  amount: number;
  coinAmount: number;
  newBalance: number;
}

export interface QuizAvailable {
  videoId: string;
  quizId: string;
  questionCount: number;
  expiresAt: number;
}

export interface QuizReminder {
  videoId: string;
  quizId: string;
  dueIn: number;
}

export interface CoinBalanceUpdated {
  balance: number;
  change: number;
  reason: string;
}

export interface CoinDeducted {
  amount: number;
  newBalance: number;
  referenceType: string;
  referenceId: string;
}

export interface CoinEarned {
  amount: number;
  newBalance: number;
  type: string;
  reason: string;
}

export interface LearningMilestone {
  type: 'first_video' | 'streak_7' | 'streak_30' | 'flashcards_100' | 'quiz_perfect';
  title: string;
  message: string;
}

export interface AchievementUnlocked {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  coinReward: number;
}

export interface SystemMaintenance {
  scheduledAt: number;
  estimatedDuration: number;
  message: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: number;
}

// Subtitle Processing Payload Types
export interface SubtitleJobCreated {
  jobId: string;
  videoId: string;
  status: string;
  timestamp: number;
}

export interface SubtitleJobProgress {
  jobId: string;
  userId: string;
  videoId: string;
  stage: string;
  progress: number;
  message: string;
  timestamp: number;
}

export interface SubtitleJobCompleted {
  jobId: string;
  userId: string;
  videoId: string;
  subtitleId: string;
  url: string;
  language: string;
  segmentCount: number;
  duration: number;
  timestamp: number;
}

export interface SubtitleJobFailed {
  jobId: string;
  userId: string;
  videoId: string;
  error: string;
  retryable: boolean;
  attempt: number;
  timestamp: number;
}

export interface SubtitleReady {
  videoId: string;
  subtitleId: string;
  language: string;
  url: string;
  segmentCount: number;
  duration: number;
  timestamp: number;
}

export interface SubtitleError {
  jobId: string;
  videoId: string;
  message: string;
  code: string;
  timestamp: number;
}

// Waiting Module Payload Types
export interface WaitingJobProgressPayload {
  jobId: string;
  stage: string;
  progress: number;
  message: string;
  estimatedSeconds: number;
  queuePosition: number | null;
  timestamp: number;
}

export interface WaitingJobCompletedPayload {
  jobId: string;
  videoId: string;
  subtitleId: string;
  url: string;
  language: string;
  segmentCount: number;
  duration: number;
  timestamp: number;
}

export interface WaitingJobFailedPayload {
  jobId: string;
  videoId: string;
  error: string;
  retryable: boolean;
  attempt: number;
  timestamp: number;
}

export interface WaitingEtaUpdatePayload {
  jobId: string;
  estimatedSeconds: number;
}

export interface WaitingQueueUpdatePayload {
  jobId: string;
  queuePosition: number;
}

// Socket Data
export interface SocketData {
  userId?: string;
  role?: string;
  connectedAt: number;
}

// Inter-server events
export interface InterServerEvents {
  ping: () => void;
}
