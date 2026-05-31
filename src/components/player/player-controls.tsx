'use client';

import { useCallback, useRef } from 'react';
import { Slider, Tooltip } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  MutedOutlined,
  SettingOutlined,
  ExpandOutlined,
  CompressOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore, PlaybackSpeed, DisplayMode } from '@/store/player.store';
import { useSubtitleSync } from '@/hooks/use-subtitle-sync';
import { TimelineBar } from './timeline-bar';

interface PlayerControlsProps {
  onOpenSettings?: () => void;
}

const SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
const SPEED_LABELS: Record<PlaybackSpeed, string> = {
  0.25: '0.25x',
  0.5: '0.5x',
  0.75: '0.75x',
  1: '1x',
  1.25: '1.25x',
  1.5: '1.5x',
  2: '2x',
};

export function PlayerControls({ onOpenSettings }: PlayerControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    isPlaying,
    currentTime,
    duration,
    settings,
    controlsVisible,
    isFullscreen,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    setSpeed,
    toggleSubtitle,
    setSubtitlePosition,
    showControls,
    setIsFullscreen,
  } = usePlayerStore();

  const { formatTime } = useSubtitleSync();

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      containerRef.current.closest('.player-container')?.requestFullscreen();
      setIsFullscreen(true);
    }
  }, [setIsFullscreen]);

  const handleSpeedChange = useCallback((speed: number) => {
    setSpeed(speed as PlaybackSpeed);
  }, [setSpeed]);

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value / 100);
  }, [setVolume]);

  const toggleSubtitlePosition = useCallback(() => {
    setSubtitlePosition(settings.subtitlePosition === 'bottom' ? 'top' : 'bottom');
  }, [settings.subtitlePosition, setSubtitlePosition]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {controlsVisible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-0 bottom-0 z-40"
          onMouseEnter={showControls}
          onMouseMove={showControls}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

          {/* Mini progress bar at very top of controls */}
          <div className="h-1 bg-white/20 w-full">
            <div
              className="h-full bg-primary-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Main controls */}
          <div className="relative p-4 space-y-2">
            {/* Timeline */}
            <TimelineBar />

            {/* Control buttons row */}
            <div className="flex items-center justify-between gap-4">
              {/* Left controls */}
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <Tooltip title={isPlaying ? 'Pause (k)' : 'Play (k)'}>
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-primary-400 transition-colors p-1"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <PauseCircleOutlined className="text-3xl" />
                    ) : (
                      <PlayCircleOutlined className="text-3xl" />
                    )}
                  </button>
                </Tooltip>

                {/* Volume */}
                <div className="flex items-center gap-2 group">
                  <Tooltip title={settings.muted ? 'Unmute (m)' : 'Mute (m)'}>
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-primary-400 transition-colors"
                      aria-label={settings.muted ? 'Unmute' : 'Mute'}
                    >
                      {settings.muted || settings.volume === 0 ? (
                        <MutedOutlined className="text-xl" />
                      ) : (
                        <SoundOutlined className="text-xl" />
                      )}
                    </button>
                  </Tooltip>

                  <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-200">
                    <Slider
                      min={0}
                      max={100}
                      value={settings.volume * 100}
                      onChange={handleVolumeChange}
                      className="!m-0"
                      tooltip={{ formatter: (v) => `${v}%` }}
                    />
                  </div>
                </div>

                {/* Time display */}
                <div className="text-white text-sm font-mono tabular-nums">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-gray-400">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-3">
                {/* Speed selector */}
                <div className="relative group/speed">
                  <button
                    className="text-white hover:text-primary-400 transition-colors px-2 py-1 text-sm font-medium rounded hover:bg-white/10"
                    aria-label="Playback speed"
                  >
                    {SPEED_LABELS[settings.speed]}
                  </button>

                  {/* Speed dropdown */}
                  <div className="absolute bottom-full right-0 mb-2 py-2 bg-dark-400/95 backdrop-blur-sm rounded-lg shadow-xl border border-dark-200 opacity-0 invisible group-hover/speed:opacity-100 group-hover/speed:visible transition-all duration-200 min-w-[100px]">
                    {SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full px-4 py-1.5 text-sm text-left hover:bg-white/10 transition-colors ${
                          settings.speed === speed
                            ? 'text-primary-400 font-medium'
                            : 'text-white'
                        }`}
                      >
                        {SPEED_LABELS[speed]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtitle toggle */}
                <Tooltip title={settings.subtitleVisible ? 'Hide subtitles (c)' : 'Show subtitles (c)'}>
                  <button
                    onClick={toggleSubtitle}
                    className={`text-white hover:text-primary-400 transition-colors px-2 py-1 text-sm rounded hover:bg-white/10 ${
                      settings.subtitleVisible ? 'text-primary-400' : ''
                    }`}
                    aria-label="Toggle subtitles"
                  >
                    CC
                  </button>
                </Tooltip>

                {/* Subtitle position */}
                <Tooltip title="Subtitle position">
                  <button
                    onClick={toggleSubtitlePosition}
                    className="text-white hover:text-primary-400 transition-colors"
                    aria-label="Toggle subtitle position"
                  >
                    {settings.subtitlePosition === 'bottom' ? (
                      <VerticalAlignBottomOutlined className="text-xl" />
                    ) : (
                      <VerticalAlignTopOutlined className="text-xl" />
                    )}
                  </button>
                </Tooltip>

                {/* Settings */}
                {onOpenSettings && (
                  <Tooltip title="Settings">
                    <button
                      onClick={onOpenSettings}
                      className="text-white hover:text-primary-400 transition-colors"
                      aria-label="Settings"
                    >
                      <SettingOutlined className="text-xl" />
                    </button>
                  </Tooltip>
                )}

                {/* Fullscreen */}
                <Tooltip title={isFullscreen ? 'Exit fullscreen (f)' : 'Fullscreen (f)'}>
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-primary-400 transition-colors"
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <CompressOutlined className="text-xl" />
                    ) : (
                      <ExpandOutlined className="text-xl" />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
