'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePlayerStore } from '@/store/player.store';

interface UsePlayerOptions {
  videoId?: string;
  autoPlay?: boolean;
  startTime?: number;
}

export function usePlayer(options: UsePlayerOptions = {}) {
  const { autoPlay = false, startTime = 0 } = options;
  
  const {
    video,
    isPlaying,
    currentTime,
    duration,
    buffered,
    isLoading,
    hasError,
    errorMessage,
    isFullscreen,
    settings,
    controlsVisible,
    playerRef,
    setVideo,
    setPlayerRef,
    play,
    pause,
    togglePlay,
    seek,
    seekRelative,
    setCurrentTime,
    setDuration,
    setBuffered,
    setIsLoading,
    setHasError,
    setIsFullscreen,
    setSpeed,
    setVolume,
    toggleMute,
    showControls,
    hideControls,
    reset,
  } = usePlayerStore();

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Auto-hide controls after 3 seconds of inactivity
  const resetControlsTimer = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    showControls();
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        hideControls();
      }, 3000);
    }
  }, [isPlaying, showControls, hideControls]);

  // Toggle fullscreen helper (must be defined before handleKeyDown)
  const toggleFullscreen = useCallback(() => {
    const container = document.querySelector('.player-container');
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  // Auto-hide controls timer cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard event handlers for controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        resetControlsTimer();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        seekRelative(-5);
        resetControlsTimer();
        break;
      case 'ArrowRight':
        e.preventDefault();
        seekRelative(5);
        resetControlsTimer();
        break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume(Math.min(1, settings.volume + 0.1));
        resetControlsTimer();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume(Math.max(0, settings.volume - 0.1));
        resetControlsTimer();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        toggleMute();
        break;
      case 'Escape':
        if (isFullscreen) {
          document.exitFullscreen();
        }
        break;
    }
  }, [togglePlay, seekRelative, setVolume, settings.volume, toggleMute, isFullscreen, resetControlsTimer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const retry = useCallback(() => {
    if (video) {
      setIsLoading(true);
      setHasError(false);
      // In real app, this would reinitialize the player
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [video, setIsLoading, setHasError]);

  return {
    // State
    video,
    isPlaying,
    currentTime,
    duration,
    buffered,
    isLoading: isLoading || !isReady,
    hasError,
    errorMessage,
    isFullscreen,
    settings,
    controlsVisible,
    isReady,
    playerRef,
    
    // Controls
    play,
    pause,
    togglePlay,
    seek,
    seekRelative,
    setCurrentTime,
    setDuration,
    setBuffered,
    toggleFullscreen,
    setSpeed,
    setVolume,
    toggleMute,
    showControls: resetControlsTimer,
    hideControls,
    
    // Video management
    setVideo,
    setPlayerRef,
    setIsReady,
    reset,
    retry,
  };
}
