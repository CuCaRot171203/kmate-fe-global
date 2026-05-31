'use client';

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { usePlayerStore } from '@/store/player.store';
import { useSubtitleStore } from '@/store/subtitle.store';

// Types for Video.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VideoJsPlayer = any;

export interface VideoPlayerHandle {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  dispose: () => void;
}

interface VideoPlayerProps {
  youtubeId?: string;
  poster?: string;
  autoPlay?: boolean;
  startTime?: number;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onError?: (error: string) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ youtubeId, poster, autoPlay = false, startTime = 0, onReady, onPlay, onPause, onEnded, onTimeUpdate, onError }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
      setPlayerRef,
      setIsLoading,
      setHasError,
      setCurrentTime,
      setDuration,
      setBuffered,
      setIsFullscreen,
      settings,
    } = usePlayerStore();

    const { setIsLoading: setSubtitleLoading } = useSubtitleStore();

    // Format YouTube URL to embed format
    const getEmbedUrl = useCallback((ytId: string): string => {
      return `https://www.youtube.com/embed/${ytId}?enablejsapi=1&rel=0&modestbranding=1&controls=0&disablekb=1&showinfo=0&iv_load_policy=3`;
    }, []);

    // Expose player methods via ref
    useImperativeHandle(ref, () => ({
      play: () => {
        playerRef.current?.play();
      },
      pause: () => {
        playerRef.current?.pause();
      },
      seek: (time: number) => {
        if (playerRef.current) {
          playerRef.current.currentTime(time);
        } else if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
      },
      getCurrentTime: () => {
        return playerRef.current?.currentTime() ?? videoRef.current?.currentTime ?? 0;
      },
      getDuration: () => {
        return playerRef.current?.duration() ?? videoRef.current?.duration ?? 0;
      },
      setPlaybackRate: (rate: number) => {
        if (playerRef.current) {
          playerRef.current.playbackRate(rate);
        } else if (videoRef.current) {
          videoRef.current.playbackRate = rate;
        }
      },
      setVolume: (volume: number) => {
        if (playerRef.current) {
          playerRef.current.volume(volume);
        } else if (videoRef.current) {
          videoRef.current.volume = volume;
        }
      },
      dispose: () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      },
    }), []);

    // Initialize Video.js
    useEffect(() => {
      if (!youtubeId || !containerRef.current) return;

      const initVideo = async () => {
        setIsLoading(true);
        setSubtitleLoading(true);

        try {
          // Dynamically import Video.js to avoid SSR issues
          const videojs = (await import('video.js')).default;

          // Dispose existing player if any
          if (playerRef.current) {
            playerRef.current.dispose();
          }

          // Clear any existing video element
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }

          // Create video element
          const videoElement = document.createElement('video');
          videoElement.className = 'video-js vjs-default-skin vjs-big-play-centered';
          videoElement.setAttribute('playsinline', 'true');
          if (poster) {
            videoElement.setAttribute('poster', poster);
          }
          if (containerRef.current) {
            containerRef.current.appendChild(videoElement);
          }

          // Initialize Video.js player
          const player = videojs(videoElement, {
            autoplay: autoPlay,
            controls: false, // We'll use custom controls
            responsive: true,
            fluid: false,
            playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
            sources: [
              {
                src: `https://www.youtube.com/watch?v=${youtubeId}`,
                type: 'video/youtube',
              },
            ],
            youtube: {
              ytControls: 0,
              noCookie: true,
              rel: 0,
              showinfo: 0,
              modestbranding: 1,
            },
            html5: {
              vhs: {
                overrideNative: true,
              },
            },
          });

          playerRef.current = player;
          setPlayerRef(player);

          // Player ready
          player.on('ready', () => {
            setIsLoading(false);
            setSubtitleLoading(false);
            onReady?.();

            // Apply initial settings
            if (startTime > 0) {
              player.currentTime(startTime);
            }
            player.volume(settings.volume);
            player.playbackRate(settings.speed);

            if (autoPlay) {
              player.play();
            }
          });

          // Time update
          player.on('timeupdate', () => {
            const time = player.currentTime() ?? 0;
            setCurrentTime(time);
            onTimeUpdate?.(time);
          });

          // Duration loaded
          player.on('loadedmetadata', () => {
            setDuration(player.duration() ?? 0);
          });

          // Progress (buffered)
          player.on('progress', () => {
            const buffered = player.bufferedPercent?.() ?? 0;
            setBuffered(buffered * 100);
          });

          // Play event
          player.on('play', () => {
            onPlay?.();
          });

          // Pause event
          player.on('pause', () => {
            onPause?.();
          });

          // Ended
          player.on('ended', () => {
            onEnded?.();
          });

          // Error handling
          player.on('error', () => {
            const error = player.error();
            setHasError(true, error?.message || 'Video playback error');
            onError?.(error?.message || 'Video playback error');
          });

        } catch (err) {
          console.error('Failed to initialize video player:', err);
          setHasError(true, 'Failed to load video');
          onError?.('Failed to load video');
        }
      };

      initVideo();

      // Cleanup
      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }, [youtubeId, autoPlay, poster, startTime]);

    // Sync settings changes
    useEffect(() => {
      if (playerRef.current) {
        playerRef.current.volume(settings.volume);
        playerRef.current.muted(settings.muted);
      }
    }, [settings.volume, settings.muted]);

    useEffect(() => {
      if (playerRef.current) {
        playerRef.current.playbackRate(settings.speed);
      }
    }, [settings.speed]);

    // Sync fullscreen state
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }, [setIsFullscreen]);

    // Fallback: Direct YouTube iframe for better compatibility
    const useIframe = !youtubeId?.startsWith('video-');

    if (useIframe && youtubeId) {
      return (
        <div className="relative w-full aspect-video bg-dark-400 rounded-lg overflow-hidden">
          <iframe
            ref={videoRef as unknown as React.RefObject<HTMLIFrameElement>}
            src={getEmbedUrl(youtubeId)}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video Player"
          />
        </div>
      );
    }

    return (
      <div className="relative w-full aspect-video bg-dark-400 rounded-lg overflow-hidden group">
        {/* Loading overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-dark-400 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading video...</span>
          </div>
        </div>

        {/* Video.js container */}
        <div
          ref={containerRef}
          className="video-player-container w-full h-full"
        />

        {/* Error overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-dark-400/90 hidden">
          <div className="text-center">
            <p className="text-red-400 mb-3">Video playback failed</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>

        {/* Click to play overlay (shows when paused) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
