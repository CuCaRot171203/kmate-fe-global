export interface SubtitleSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  translation?: string;
}

export interface SubtitleFile {
  id: string;
  videoId: string;
  language: string;
  subtitleContent: SubtitleSegment[];
  bilingualContent?: SubtitleSegment[];
  source: 'AUTO_GENERATED' | 'CACHED' | 'MANUAL';
  createdAt: string;
  updatedAt: string;
}

export interface SubtitleProcessingJob {
  id: string;
  videoId: string;
  userId: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: SubtitleProcessingStatus;
  progress: number;
  stage: string | null;
  retryCount: number;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
  subtitles?: SubtitleFile[];
}

export type SubtitleProcessingStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'DOWNLOADING'
  | 'EXTRACTING_AUDIO'
  | 'TRANSCRIBING'
  | 'TRANSLATING'
  | 'SYNCING'
  | 'UPLOADING'
  | 'COMPLETED'
  | 'FAILED'
  | 'DEAD_LETTER';

export interface SubtitleGenerationRequest {
  videoId: string;
  youtubeUrl?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface SubtitleGenerationResponse {
  status: 'CACHED' | 'EXISTS' | 'IN_PROGRESS' | 'QUEUED';
  jobId?: string;
  subtitleId?: string;
  url?: string;
  message?: string;
}

export const SUBTITLE_STAGE_LABELS: Record<string, string> = {
  PENDING: 'Preparing...',
  QUEUED: 'In queue...',
  DOWNLOADING: 'Downloading video...',
  EXTRACTING_AUDIO: 'Extracting audio...',
  TRANSCRIBING: 'Transcribing with AI...',
  TRANSLATING: 'Translating subtitles...',
  SYNCING: 'Syncing subtitles...',
  UPLOADING: 'Saving subtitles...',
  COMPLETED: 'Ready!',
  FAILED: 'Failed',
  DEAD_LETTER: 'Failed',
};
