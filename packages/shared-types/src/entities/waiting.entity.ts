import { SubtitleProcessingStatus } from './subtitle.entity';

export type WaitingStage = SubtitleProcessingStatus;

export interface WaitingJobStatus {
  jobId: string;
  videoId: string;
  userId: string;
  status: SubtitleProcessingStatus;
  stage: string | null;
  progress: number;
  estimatedSeconds: number;
  queuePosition: number | null;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  isCompleted: boolean;
  isFailed: boolean;
  isWaiting: boolean;
  subtitles?: ShortVideoSubtitle[];
}

export interface ShortVideoSubtitle {
  language: string;
  fileUrl: string | null;
  segmentCount: number;
}

export interface WaitingProgress {
  jobId: string;
  status: SubtitleProcessingStatus;
  stage: string | null;
  progress: number;
  estimatedSeconds: number;
  isCompleted: boolean;
  isFailed: boolean;
}

export interface QueuePosition {
  position: number;
  total: number;
  estimatedWaitSeconds: number;
}

export const WAITING_STAGE_LABELS: Record<string, { label: string; description: string; emoji: string }> = {
  PENDING: { label: 'Preparing', description: 'Setting up your learning session', emoji: '⚙️' },
  QUEUED: { label: 'In Queue', description: 'Waiting for AI processing', emoji: '⏳' },
  DOWNLOADING: { label: 'Downloading', description: 'Getting the video ready', emoji: '📥' },
  EXTRACTING_AUDIO: { label: 'Extracting Audio', description: 'Preparing audio for transcription', emoji: '🎵' },
  TRANSCRIBING: { label: 'Transcribing', description: 'AI is listening to the video', emoji: '🎧' },
  TRANSLATING: { label: 'Translating', description: 'Converting Korean to Vietnamese', emoji: '🌐' },
  SYNCING: { label: 'Syncing', description: 'Aligning subtitles with video', emoji: '⏱️' },
  UPLOADING: { label: 'Saving', description: 'Finalizing your subtitles', emoji: '💾' },
  COMPLETED: { label: 'Ready!', description: 'Your video is ready to watch', emoji: '✅' },
  FAILED: { label: 'Failed', description: 'Something went wrong', emoji: '❌' },
  DEAD_LETTER: { label: 'Failed', description: 'Processing failed after retries', emoji: '❌' },
};

export const WAITING_STAGE_ICONS: Record<string, string> = {
  PENDING: 'SettingOutlined',
  QUEUED: 'ClockCircleOutlined',
  DOWNLOADING: 'DownloadOutlined',
  EXTRACTING_AUDIO: 'AudioOutlined',
  TRANSCRIBING: 'CustomerServiceOutlined',
  TRANSLATING: 'GlobalOutlined',
  SYNCING: 'SyncOutlined',
  UPLOADING: 'CloudUploadOutlined',
  COMPLETED: 'CheckCircleOutlined',
  FAILED: 'CloseCircleOutlined',
  DEAD_LETTER: 'CloseCircleOutlined',
};
