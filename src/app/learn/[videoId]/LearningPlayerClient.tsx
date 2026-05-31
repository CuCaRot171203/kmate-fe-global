'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Drawer, Typography, Tooltip, Spin } from 'antd';
import {
  ArrowLeftOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePlayerStore } from '@/store/player.store';
import { useSubtitleStore } from '@/store/subtitle.store';
import { useWatchHistoryStore } from '@/store/watch-history.store';
import { useVocabularyStore } from '@/store/vocabulary.store';
import { useTracking } from '@/hooks/use-tracking';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useVocabulary } from '@/hooks/use-vocabulary';
import { getMockVideo, getMockSubtitles } from '@/lib/mock-data';
import {
  VideoPlayer,
  SubtitleOverlay,
  PlayerControls,
  SubtitleSettingsPanel,
  ContinueWatching,
} from '@/components/player';

const { Title, Text } = Typography;

export default function LearningPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = params.videoId as string;
  const startTimeParam = searchParams.get('t');

  const [isLoading, setIsLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [vocabDrawerOpen, setVocabDrawerOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    position: { x: number; y: number };
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    video,
    setVideo,
    controlsVisible,
    showControls,
    settings,
    isPlaying,
    currentTime,
    reset: resetPlayer,
  } = usePlayerStore();

  const {
    segments,
    setSegments,
    currentSegment,
    clearSegments,
  } = useSubtitleStore();

  const { loadProgress } = useWatchHistoryStore();

  const { resumeFromLastPosition, stats } = useTracking({
    videoId,
    autoStart: true,
  });

  useKeyboardShortcuts({ enabled: true });

  const { items: vocabItems, totalCount: vocabCount } = useVocabulary();

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const mockVideo = getMockVideo(videoId);
        const mockSubtitles = getMockSubtitles(videoId);
        if (mockVideo) setVideo(mockVideo);
        if (mockSubtitles.length > 0) setSegments(mockSubtitles, videoId, 'vi');
        if (startTimeParam) {
          const time = parseFloat(startTimeParam);
          if (!isNaN(time)) usePlayerStore.getState().seek(time);
        } else {
          setTimeout(() => resumeFromLastPosition(), 500);
        }
      } catch (error) {
        console.error('Failed to load video:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
    return () => {
      resetPlayer();
      clearSegments();
    };
  }, [videoId, startTimeParam]);

  const handleWordClick = useCallback((word: string, position: { x: number; y: number }) => {
    setSelectedWord({ word, position });
  }, []);

  const handleCloseWordPopup = useCallback(() => setSelectedWord(null), []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const shortcuts = [
    { key: 'Space / K', action: 'Play / Pause' },
    { key: '← →', action: 'Seek ±5s' },
    { key: '↑ ↓', action: 'Volume' },
    { key: 'M', action: 'Mute' },
    { key: 'F', action: 'Fullscreen' },
    { key: 'C', action: 'Subtitles' },
    { key: ', .', action: 'Speed' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0B0B0F] text-white overflow-hidden">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0F]">
          <Spin size="large" />
          <p className="mt-4 text-slate-400">Loading video...</p>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/user/explore')}
            className="text-white hover:!text-primary"
          />
          {video && (
            <div>
              <Title level={5} className="!text-white !mb-0 !text-sm">{video.title}</Title>
              <Text className="text-xs text-slate-400">{video.channelName}</Text>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {vocabCount > 0 && (
            <Tooltip title={`${vocabCount} words saved`}>
              <Button
                type="text"
                icon={<SaveOutlined />}
                onClick={() => setVocabDrawerOpen(true)}
                className="text-gray-400 hover:!text-primary"
              />
            </Tooltip>
          )}
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            onClick={() => setShowShortcuts(!showShortcuts)}
            className={`text-gray-400 hover:!text-primary ${showShortcuts ? '!text-primary' : ''}`}
          />
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={openSettings}
            className="text-gray-400 hover:!text-white"
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        {/* Video player column */}
        <div className="flex-1 flex flex-col relative">
          {/* Player container */}
          <div className="relative flex-1 bg-black">
            <VideoPlayer />
            <SubtitleOverlay />
            <PlayerControls />
          </div>

          {/* Word popup */}
          {selectedWord && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute z-30 bg-[#1e293b] border border-primary/30 rounded-2xl p-4 w-64 shadow-xl"
              style={{ left: selectedWord.position.x, top: selectedWord.position.y }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black text-primary">{selectedWord.word}</span>
                <button onClick={handleCloseWordPopup} className="text-slate-400 hover:text-white">×</button>
              </div>
              {currentSegment && (
                <p className="text-sm text-slate-300 mb-3">{currentSegment.translation}</p>
              )}
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  useVocabularyStore.getState().addItem({
                    id: `vocab-${Date.now()}`,
                    word: selectedWord.word,
                    meaning: currentSegment?.translation || '',
                    videoId,
                    videoTitle: video?.title || '',
                    segmentId: currentSegment?.id || '',
                    timestamp: currentTime,
                    context: currentSegment?.text || '',
                    contextTranslation: currentSegment?.translation || '',
                    savedAt: Date.now(),
                    masteryLevel: 'new',
                    reviewCount: 0,
                    correctCount: 0,
                  });
                  handleCloseWordPopup();
                }}
              >
                Save to Vocabulary
              </Button>
            </motion.div>
          )}

          {/* Video info */}
          {video && (
            <div className="px-4 py-3 bg-[#111827] border-t border-white/5 flex-shrink-0">
              <Title level={5} className="!text-white !mb-1">{video.title}</Title>
              <Text className="text-slate-400 text-xs">{video.channelName}</Text>
              {stats && (
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] text-slate-500">Watched {stats.watchCount}x</span>
                  <span className="text-[10px] text-slate-500">·</span>
                  <span className="text-[10px] text-slate-500">{Math.round(stats.completionRate || 0)}% complete</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 bg-[#111827] border-l border-white/5 overflow-y-auto hidden md:flex flex-col">
          {/* Current segment info */}
          {currentSegment && (
            <div className="p-4 border-b border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Current Segment</p>
              <p className="text-white text-sm font-medium mb-1">{currentSegment.text}</p>
              <p className="text-slate-400 text-xs">{currentSegment.translation}</p>
            </div>
          )}

          {/* Chapters */}
          {video?.chapters && video.chapters.length > 0 && (
            <div className="p-4 border-b border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-3">Chapters</p>
              {video.chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => usePlayerStore.getState().seek(chapter.startTime)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-left mb-1 transition-colors"
                >
                  <span className="text-xs text-slate-500 font-mono">
                    {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs text-white">{chapter.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Vocabulary from this video */}
          <div className="p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Vocabulary ({vocabItems.filter(i => i.videoId === videoId).length})
              </p>
              {vocabItems.filter(i => i.videoId === videoId).length > 0 && (
                <Button size="small" type="link" onClick={() => setVocabDrawerOpen(true)} className="!text-xs !p-0 !h-auto">
                  View all
                </Button>
              )}
            </div>
            {vocabItems
              .filter(i => i.videoId === videoId)
              .slice(0, 5)
              .map((item) => (
                <div key={item.id} className="px-3 py-2 rounded-lg hover:bg-white/5 mb-1">
                  <span className="text-sm font-medium text-white">{item.word}</span>
                  <span className="text-xs text-slate-400 ml-2">{item.meaning}</span>
                </div>
              ))}
            {vocabItems.filter(i => i.videoId === videoId).length === 0 && (
              <p className="text-xs text-slate-500 italic">Click on words in subtitles to save them</p>
            )}
          </div>
        </aside>
      </div>

      {/* Subtitle Settings Panel */}
      <SubtitleSettingsPanel isOpen={settingsOpen} onClose={closeSettings} />

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-4">Keyboard Shortcuts</h3>
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-white/5">
                <span className="text-slate-300 text-sm">{shortcut.action}</span>
                <kbd className="text-xs bg-white/10 px-2 py-0.5 rounded text-white font-mono">{shortcut.key}</kbd>
              </div>
            ))}
            <Button block className="mt-4" onClick={() => setShowShortcuts(false)}>Close</Button>
          </motion.div>
        </div>
      )}

      {/* Vocabulary Drawer */}
      <Drawer
        title={<span className="text-white font-bold">Vocabulary</span>}
        placement="right"
        onClose={() => setVocabDrawerOpen(false)}
        open={vocabDrawerOpen}
        width={400}
        styles={{
          body: { background: '#151c2a', padding: 0 },
          header: { background: '#151c2a', borderBottom: '1px solid rgba(255,255,255,0.1)' },
        }}
      >
        {vocabItems.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-400">No vocabulary saved yet</p>
            <p className="text-xs text-slate-500 mt-2">Click on Korean words while watching to save them</p>
          </div>
        ) : (
          vocabItems.map((item) => (
            <div key={item.id} className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-primary">{item.word}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{item.masteryLevel}</span>
              </div>
              <p className="text-sm text-slate-300 mt-1">{item.meaning}</p>
              {item.reading && <p className="text-xs text-slate-500 mt-0.5">{item.reading}</p>}
              <p className="text-xs text-slate-500 mt-2 italic">&ldquo;{item.context}&rdquo;</p>
            </div>
          ))
        )}
      </Drawer>
    </div>
  );
}
