import { create } from 'zustand';

interface VideoState {
  currentVideo: {
    id: string;
    youtubeId: string;
    title: string;
    thumbnail: string;
    duration: number;
  } | null;
  currentTime: number;
  isPlaying: boolean;
  subtitles: {
    id: string;
    startTime: number;
    endTime: number;
    korean: string;
    vietnamese: string;
  }[];
  showSubtitles: boolean;
  subtitleLanguage: 'ko' | 'vi' | 'bilingual';

  // Actions
  setCurrentVideo: (video: VideoState['currentVideo']) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSubtitles: (subtitles: VideoState['subtitles']) => void;
  toggleSubtitles: () => void;
  setSubtitleLanguage: (lang: VideoState['subtitleLanguage']) => void;
  clearVideo: () => void;
}

export const useVideoStore = create<VideoState>()((set) => ({
  currentVideo: null,
  currentTime: 0,
  isPlaying: false,
  subtitles: [],
  showSubtitles: true,
  subtitleLanguage: 'bilingual',

  setCurrentVideo: (video) => set({ currentVideo: video }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSubtitles: (subtitles) => set({ subtitles }),
  toggleSubtitles: () => set((state) => ({ showSubtitles: !state.showSubtitles })),
  setSubtitleLanguage: (subtitleLanguage) => set({ subtitleLanguage }),
  clearVideo: () => set({
    currentVideo: null,
    currentTime: 0,
    isPlaying: false,
    subtitles: [],
  }),
}));
