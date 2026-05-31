'use client';

import { useState, useCallback, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, SoundOutlined, CloseOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useVocabulary } from '@/hooks/use-vocabulary';
import { usePlayerStore } from '@/store/player.store';

interface WordPopupProps {
  word: string;
  meaning: string;
  reading?: string;
  context?: string;
  contextTranslation?: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function WordPopup({
  word,
  meaning,
  reading,
  context,
  contextTranslation,
  position,
  onClose,
}: WordPopupProps) {
  const { saveWord, isWordSaved, isSaving } = useVocabulary();
  const { video } = usePlayerStore();
  
  const [isSaved, setIsSaved] = useState(isWordSaved(word));
  const [showMeaning, setShowMeaning] = useState(false);

  const handleSave = useCallback(async () => {
    if (isSaved) return;
    
    const result = await saveWord({
      word,
      meaning,
      reading,
      segmentId: 'current',
      context: context || '',
      contextTranslation: contextTranslation || '',
    });
    
    if (result) {
      setIsSaved(true);
    }
  }, [isSaved, saveWord, word, meaning, reading, context, contextTranslation]);

  const handlePlayAudio = useCallback(() => {
    // Text-to-speech for pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, [word]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 w-72 bg-dark-300/95 backdrop-blur-md rounded-xl border border-dark-200 shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-400/50">
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
          >
            {word}
          </span>
          {reading && (
            <span className="text-gray-400 text-sm">{reading}</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <CloseOutlined />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Meaning */}
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Meaning</p>
          <p className="text-yellow-300 font-medium">{meaning}</p>
        </div>

        {/* Context */}
        {context && (
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Context</p>
            <p
              className="text-white text-sm"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              {context}
            </p>
            {contextTranslation && (
              <p className="text-gray-400 text-sm mt-1">{contextTranslation}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Tooltip title="Play pronunciation">
            <Button
              type="text"
              icon={<SoundOutlined />}
              onClick={handlePlayAudio}
              className="text-gray-400 hover:text-primary-400"
            />
          </Tooltip>

          <div className="flex-1" />

          <Button
            type={isSaved ? 'primary' : 'default'}
            icon={isSaved ? <HeartFilled /> : <HeartOutlined />}
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaved}
            size="small"
            className={isSaved ? 'bg-primary-500 border-primary-500' : ''}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Arrow */}
      <div
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid rgba(30, 41, 59, 0.95)',
        }}
      />
    </motion.div>
  );
}

// Component for clickable Korean words in subtitles
interface ClickableTextProps {
  text: string;
  onWordClick: (word: string, position: { x: number; y: number }) => void;
}

export function ClickableSubtitleText({ text, onWordClick }: ClickableTextProps) {
  // Split Korean text into words (simple tokenizer)
  const words = text.split(/(\s+)/);

  return (
    <>
      {words.map((word, index) => {
        // Check if it's a Korean word (has Korean characters)
        const isKorean = /[\uAC00-\uD7AF]/.test(word);
        
        if (!isKorean || word.trim() === '') {
          return <span key={index}>{word}</span>;
        }

        return (
          <span
            key={index}
            className="cursor-pointer hover:text-primary-300 transition-colors"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onWordClick(word.trim(), {
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
            }}
          >
            {word}
          </span>
        );
      })}
    </>
  );
}
