'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePlayerStore, PlaybackSpeed } from '@/store/player.store';

interface ShortcutConfig {
  key: string;
  action: () => void;
  description: string;
  whenPlaying?: boolean;
  whenPaused?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  seekAmount?: number;
  volumeStep?: number;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const { enabled = true, seekAmount = 5, volumeStep = 0.1 } = options;

  const {
    togglePlay,
    seekRelative,
    setVolume,
    toggleMute,
    settings,
    setSpeed,
    toggleSubtitle,
    setDisplayMode,
    showControls,
    hideControls,
    isFullscreen,
    controlsVisible,
  } = usePlayerStore();

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  const resetControlsTimer = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    showControls();

    const { isPlaying } = usePlayerStore.getState();
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        hideControls();
      }, 3000);
    }
  }, [showControls, hideControls]);

  const increaseSpeed = useCallback(() => {
    const currentIndex = SPEEDS.indexOf(settings.speed);
    if (currentIndex < SPEEDS.length - 1) {
      setSpeed(SPEEDS[currentIndex + 1]);
    }
    resetControlsTimer();
  }, [settings.speed, setSpeed, resetControlsTimer]);

  const decreaseSpeed = useCallback(() => {
    const currentIndex = SPEEDS.indexOf(settings.speed);
    if (currentIndex > 0) {
      setSpeed(SPEEDS[currentIndex - 1]);
    }
    resetControlsTimer();
  }, [settings.speed, setSpeed, resetControlsTimer]);

  const toggleFullscreen = useCallback(() => {
    const container = document.querySelector('.player-container');
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  const cycleDisplayMode = useCallback(() => {
    const modes = ['bilingual', 'ko', 'vi'] as const;
    const currentIndex = modes.indexOf(settings.displayMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setDisplayMode(modes[nextIndex]);
    resetControlsTimer();
  }, [settings.displayMode, setDisplayMode, resetControlsTimer]);

  // All keyboard shortcuts
  const shortcuts: ShortcutConfig[] = [
    // Playback
    { key: ' ', action: togglePlay, description: 'Play/Pause', whenPlaying: true, whenPaused: true },
    { key: 'k', action: togglePlay, description: 'Play/Pause', whenPlaying: true, whenPaused: true },
    { key: 'K', action: togglePlay, description: 'Play/Pause' },

    // Seeking
    { key: 'ArrowLeft', action: () => seekRelative(-seekAmount), description: `Rewind ${seekAmount}s` },
    { key: 'ArrowRight', action: () => seekRelative(seekAmount), description: `Forward ${seekAmount}s` },
    { key: 'j', action: () => seekRelative(-seekAmount), description: `Rewind ${seekAmount}s` },
    { key: 'l', action: () => seekRelative(seekAmount), description: `Forward ${seekAmount}s` },

    // Volume
    { key: 'ArrowUp', action: () => setVolume(Math.min(1, settings.volume + volumeStep)), description: `Volume +${Math.round(volumeStep * 100)}%` },
    { key: 'ArrowDown', action: () => setVolume(Math.max(0, settings.volume - volumeStep)), description: `Volume -${Math.round(volumeStep * 100)}%` },
    { key: 'm', action: toggleMute, description: 'Mute/Unmute' },
    { key: 'M', action: toggleMute, description: 'Mute/Unmute' },

    // Speed
    { key: '>', action: increaseSpeed, description: 'Speed up' },
    { key: '<', action: decreaseSpeed, description: 'Speed down' },
    { key: '.', action: increaseSpeed, description: 'Speed up' },
    { key: ',', action: decreaseSpeed, description: 'Speed down' },

    // Subtitles
    { key: 'c', action: toggleSubtitle, description: 'Toggle subtitles' },
    { key: 'C', action: cycleDisplayMode, description: 'Cycle subtitle language' },

    // Fullscreen
    { key: 'f', action: toggleFullscreen, description: 'Toggle fullscreen' },
    { key: 'F', action: toggleFullscreen, description: 'Toggle fullscreen' },
    { key: 'Escape', action: () => { if (isFullscreen) toggleFullscreen(); }, description: 'Exit fullscreen' },

    // Controls visibility
    { key: '?', action: resetControlsTimer, description: 'Show controls' },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't handle if user is typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.isContentEditable
    ) {
      return;
    }

    const { isPlaying } = usePlayerStore.getState();

    for (const shortcut of shortcuts) {
      if (event.key === shortcut.key) {
        // Check conditional shortcuts
        if (shortcut.whenPlaying && !isPlaying) continue;
        if (shortcut.whenPaused && isPlaying) continue;

        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [enabled, shortcuts]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Return shortcut map for display
  const shortcutMap = shortcuts.reduce((acc, shortcut) => {
    acc[shortcut.key] = shortcut.description;
    return acc;
  }, {} as Record<string, string>);

  return {
    shortcuts,
    shortcutMap,
    resetControlsTimer,
  };
}
