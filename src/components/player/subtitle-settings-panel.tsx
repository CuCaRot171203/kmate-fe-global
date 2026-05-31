'use client';

import React, { useCallback } from 'react';
import { Slider, Switch, Radio, type RadioChangeEvent } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore, DisplayMode, SubtitlePosition } from '@/store/player.store';
import { useVocabulary } from '@/hooks/use-vocabulary';

interface SubtitleSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubtitleSettingsPanel({ isOpen, onClose }: SubtitleSettingsPanelProps) {
  const {
    settings,
    setDisplayMode,
    toggleSubtitle,
    setSubtitleOpacity,
    setSubtitleSize,
    setSubtitlePosition,
  } = usePlayerStore();

  const { stats: vocabStats } = useVocabulary();

  const handleDisplayModeChange = useCallback((e: RadioChangeEvent) => {
    setDisplayMode(e.target.value as DisplayMode);
  }, [setDisplayMode]);

  const handlePositionChange = useCallback((e: RadioChangeEvent) => {
    setSubtitlePosition(e.target.value as SubtitlePosition);
  }, [setSubtitlePosition]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute right-4 bottom-24 z-50 w-80 bg-dark-300/95 backdrop-blur-md rounded-xl border border-dark-200 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-200">
            <h3 className="text-white font-semibold">Subtitle Settings</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close settings"
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Settings content */}
          <div className="p-4 space-y-6">
            {/* Subtitle visibility */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Show Subtitles</span>
              <Switch
                checked={settings.subtitleVisible}
                onChange={toggleSubtitle}
                size="small"
              />
            </div>

            {/* Display mode */}
            <div className="space-y-2">
              <span className="text-gray-300 text-sm block">Display Mode</span>
              <Radio.Group
                value={settings.displayMode}
                onChange={handleDisplayModeChange}
                className="flex flex-col gap-2"
              >
                <Radio value="bilingual" className="text-white">
                  <span className="text-white text-sm">Bilingual</span>
                  <span className="text-gray-500 text-xs block">Korean + Vietnamese</span>
                </Radio>
                <Radio value="ko" className="text-white">
                  <span className="text-white text-sm">Korean Only</span>
                  <span className="text-gray-500 text-xs block">Original language</span>
                </Radio>
                <Radio value="vi" className="text-white">
                  <span className="text-white text-sm">Vietnamese Only</span>
                  <span className="text-gray-500 text-xs block">Translation</span>
                </Radio>
              </Radio.Group>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <span className="text-gray-300 text-sm block">Position</span>
              <Radio.Group
                value={settings.subtitlePosition}
                onChange={handlePositionChange}
                className="flex gap-4"
              >
                <Radio value="bottom" className="text-white">
                  <span className="text-white text-sm">Bottom</span>
                </Radio>
                <Radio value="top" className="text-white">
                  <span className="text-white text-sm">Top</span>
                </Radio>
              </Radio.Group>
            </div>

            {/* Font size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Font Size</span>
                <span className="text-primary-400 text-sm font-mono">{settings.subtitleSize}px</span>
              </div>
              <Slider
                min={14}
                max={36}
                value={settings.subtitleSize}
                onChange={setSubtitleSize}
                className="text-primary-500 [&_.ant-slider-track]:bg-primary-500 [&_.ant-slider-handle]:border-primary-500"
                tooltip={{ formatter: (v) => `${v}px` }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Opacity</span>
                <span className="text-primary-400 text-sm font-mono">{Math.round(settings.subtitleOpacity * 100)}%</span>
              </div>
              <Slider
                min={0.3}
                max={1}
                step={0.05}
                value={settings.subtitleOpacity}
                onChange={setSubtitleOpacity}
                className="[&_.ant-slider-track]:bg-primary-500 [&_.ant-slider-handle]:border-primary-500"
                tooltip={{ formatter: (v) => `${Math.round((v || 0) * 100)}%` }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Transparent</span>
                <span>Solid</span>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <span className="text-gray-300 text-sm block">Preview</span>
              <div className="bg-black/50 rounded-lg p-3 text-center">
                <p
                  className="text-white"
                  style={{
                    fontSize: `${settings.subtitleSize}px`,
                    fontFamily: 'Noto Sans KR, sans-serif',
                    opacity: settings.subtitleOpacity,
                  }}
                >
                  예시 텍스트
                </p>
                {settings.displayMode === 'bilingual' && (
                  <p
                    className="text-yellow-300 mt-1"
                    style={{
                      fontSize: `${Math.max(12, settings.subtitleSize - 6)}px`,
                      opacity: settings.subtitleOpacity,
                    }}
                  >
                    Vietnames translation
                  </p>
                )}
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="pt-4 border-t border-dark-200">
              <p className="text-gray-500 text-xs">
                <strong className="text-gray-400">Shortcuts:</strong> C to toggle, M to mute, F for fullscreen, Space to play/pause
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
