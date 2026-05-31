import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;
export type DisplayMode = 'bilingual' | 'ko' | 'vi';
export type SubtitlePosition = 'bottom' | 'top';

export interface VideoInfo {
  id: string;
  slug?: string;
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnail: string;
  duration: number;
  chapters?: Chapter[];
}

export interface Chapter {
  title: string;
  startTime: number;
  thumbnail?: string;
}

export interface PlaybackSettings {
  speed: PlaybackSpeed;
  volume: number;
  muted: boolean;
  displayMode: DisplayMode;
  subtitleVisible: boolean;
  subtitleOpacity: number;
  subtitleSize: number;
  subtitlePosition: SubtitlePosition;
}

interface PlayerState {
  // Video info
  video: VideoInfo | null;
  
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isFullscreen: boolean;
  
  // Settings
  settings: PlaybackSettings;
  
  // UI state
  controlsVisible: boolean;
  settingsPanelOpen: boolean;
  activeChapter: Chapter | null;
  
  // Video.js ref (stored as any since we don't want to import video.js in store)
  playerRef: unknown;
}

interface PlayerActions {
  // Video actions
  setVideo: (video: VideoInfo | null) => void;
  setPlayerRef: (ref: unknown) => void;
  
  // Playback actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  seekRelative: (delta: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setBuffered: (buffered: number) => void;
  setIsLoading: (loading: boolean) => void;
  setHasError: (error: boolean, message?: string) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  toggleFullscreen: () => void;
  
  // Settings actions
  setSpeed: (speed: PlaybackSpeed) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setDisplayMode: (mode: DisplayMode) => void;
  toggleSubtitle: () => void;
  setSubtitleOpacity: (opacity: number) => void;
  setSubtitleSize: (size: number) => void;
  setSubtitlePosition: (position: SubtitlePosition) => void;
  
  // UI actions
  showControls: () => void;
  hideControls: () => void;
  toggleControls: () => void;
  openSettingsPanel: () => void;
  closeSettingsPanel: () => void;
  setActiveChapter: (chapter: Chapter | null) => void;
  
  // Reset
  reset: () => void;
}

const defaultSettings: PlaybackSettings = {
  speed: 1,
  volume: 1,
  muted: false,
  displayMode: 'bilingual',
  subtitleVisible: true,
  subtitleOpacity: 0.85,
  subtitleSize: 24,
  subtitlePosition: 'bottom',
};

const initialState: PlayerState = {
  video: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  isLoading: true,
  hasError: false,
  errorMessage: '',
  isFullscreen: false,
  settings: defaultSettings,
  controlsVisible: true,
  settingsPanelOpen: false,
  activeChapter: null,
  playerRef: null,
};

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setVideo: (video) => set({ video, isLoading: true, hasError: false }),
      setPlayerRef: (ref) => set({ playerRef: ref }),

      play: () => {
        const player = get().playerRef as { play?: () => void } | null;
        player?.play?.();
        set({ isPlaying: true });
      },

      pause: () => {
        const player = get().playerRef as { pause?: () => void } | null;
        player?.pause?.();
        set({ isPlaying: false });
      },

      togglePlay: () => {
        const { isPlaying } = get();
        if (isPlaying) {
          get().pause();
        } else {
          get().play();
        }
      },

      seek: (time) => {
        const player = get().playerRef as { currentTime?: (t: number) => void } | null;
        const clampedTime = Math.max(0, Math.min(time, get().duration));
        player?.currentTime?.(clampedTime);
        set({ currentTime: clampedTime });
      },

      seekRelative: (delta) => {
        const { currentTime, duration } = get();
        const newTime = Math.max(0, Math.min(currentTime + delta, duration));
        get().seek(newTime);
      },

      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setBuffered: (buffered) => set({ buffered }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setHasError: (hasError, message = '') => set({ hasError, errorMessage: message }),
      setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
      toggleFullscreen: () => {
        set((state) => ({ isFullscreen: !state.isFullscreen }));
      },

      setSpeed: (speed) => {
        const player = get().playerRef as { playbackRate?: (r: number) => void } | null;
        player?.playbackRate?.(speed);
        set((state) => ({
          settings: { ...state.settings, speed },
        }));
      },

      setVolume: (volume) => {
        const player = get().playerRef as { volume?: (v: number) => void } | null;
        player?.volume?.(volume);
        set((state) => ({
          settings: { ...state.settings, volume, muted: volume === 0 },
        }));
      },

      toggleMute: () => {
        const player = get().playerRef as { muted?: (m: boolean) => void } | null;
        const { muted, volume } = get().settings;
        player?.muted?.(!muted);
        set((state) => ({
          settings: { ...state.settings, muted: !muted, volume: !muted ? 0 : volume || 1 },
        }));
      },

      setDisplayMode: (displayMode) =>
        set((state) => ({
          settings: { ...state.settings, displayMode },
        })),

      toggleSubtitle: () =>
        set((state) => ({
          settings: { ...state.settings, subtitleVisible: !state.settings.subtitleVisible },
        })),

      setSubtitleOpacity: (subtitleOpacity) =>
        set((state) => ({
          settings: { ...state.settings, subtitleOpacity },
        })),

      setSubtitleSize: (subtitleSize) =>
        set((state) => ({
          settings: { ...state.settings, subtitleSize },
        })),

      setSubtitlePosition: (subtitlePosition) =>
        set((state) => ({
          settings: { ...state.settings, subtitlePosition },
        })),

      showControls: () => set({ controlsVisible: true }),
      hideControls: () => set({ controlsVisible: false }),
      toggleControls: () => set((state) => ({ controlsVisible: !state.controlsVisible })),

      openSettingsPanel: () => set({ settingsPanelOpen: true }),
      closeSettingsPanel: () => set({ settingsPanelOpen: false }),

      setActiveChapter: (chapter) => set({ activeChapter: chapter }),

      reset: () => set(initialState),
    }),
    {
      name: 'kmate-player-settings',
      partialize: (state) => ({
        settings: {
          speed: state.settings.speed,
          volume: state.settings.volume,
          muted: state.settings.muted,
          displayMode: state.settings.displayMode,
          subtitleVisible: state.settings.subtitleVisible,
          subtitleOpacity: state.settings.subtitleOpacity,
          subtitleSize: state.settings.subtitleSize,
          subtitlePosition: state.settings.subtitlePosition,
        },
      }),
    }
  )
);
