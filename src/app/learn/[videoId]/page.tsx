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

  // Stores
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

  // Hooks
  const { resumeFromLastPosition, stats } = useTracking({
    videoId,
    autoStart: true,
  });

  useKeyboardShortcuts({ enabled: true });

  const { items: vocabItems, totalCount: vocabCount } = useVocabulary();

  // Load video and subtitles
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);

      try {
        // In production, fetch from API
        // const { data: videoData } = await api.get(`/videos/${videoId}`);
        // const { data: subtitleData } = await api.get(`/videos/${videoId}/subtitles`);

        // Using mock data for demo
        const mockVideo = getMockVideo(videoId);
        const mockSubtitles = getMockSubtitles(videoId);

        if (mockVideo) {
          setVideo(mockVideo);
        }

        if (mockSubtitles.length > 0) {
          setSegments(mockSubtitles, videoId, 'vi');
        }

        // Resume from last position
        if (startTimeParam) {
          const time = parseFloat(startTimeParam);
          if (!isNaN(time)) {
            usePlayerStore.getState().seek(time);
          }
        } else {
          setTimeout(() => {
            resumeFromLastPosition();
          }, 500);
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

  // Handle word click from subtitle
  const handleWordClick = useCallback((word: string, position: { x: number; y: number }) => {
    setSelectedWord({ word, position });
  }, []);

  // Close word popup
  const handleCloseWordPopup = useCallback(() => {
    setSelectedWord(null);
  }, []);

  // Handle settings panel
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  // Keyboard shortcut display
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
    <div className="relative min-h-screen" ref={containerRef}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-500 z-50">
          <div className="flex flex-col items-center gap-4">
            <Spin size="large" />
            <Text className="text-gray-400">Loading video...</Text>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-500/80 backdrop-blur-sm border-b border-dark-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="text-white hover:text-primary-400"
              />
            </Link>
            {video && (
              <div className="hidden sm:block">
                <Title level={5} className="text-white !mb-0 !text-base">
                  {video.title}
                </Title>
                <Text className="text-gray-500 text-xs">{video.channelName}</Text>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Vocabulary count */}
            {vocabCount > 0 && (
              <Tooltip title={`${vocabCount} words saved`}>
                <Button
                  type="text"
                  icon={<SaveOutlined />}
                  onClick={() => setVocabDrawerOpen(true)}
                  className="text-gray-400 hover:text-primary-400"
                >
                  <span className="ml-1 text-xs">{vocabCount}</span>
                </Button>
              </Tooltip>
            )}

            {/* Shortcuts help */}
            <Tooltip title="Keyboard shortcuts">
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                onClick={() => setShowShortcuts(!showShortcuts)}
                className={`text-gray-400 hover:text-primary-400 ${showShortcuts ? 'text-primary-400' : ''}`}
              />
            </Tooltip>

            {/* Settings */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={openSettings}
              className="text-gray-400 hover:text-white"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-0">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Video player column */}
            <div className="lg:col-span-3 space-y-4">
              {/* Player container */}
              <div
                className="player-container relative rounded-xl overflow-hidden bg-black shadow-2xl"
                onMouseMove={showControls}
              >
                {/* Video Player */}
                <VideoPlayer
                  youtubeId={video?.youtubeId}
                  poster={video?.thumbnail}
                  autoPlay={false}
                  startTime={parseFloat(startTimeParam || '0')}
                />

                {/* Subtitle Overlay */}
                <SubtitleOverlay />

                {/* Player Controls */}
                <PlayerControls onOpenSettings={openSettings} />

                {/* Word popup */}
                <AnimatePresence>
                  {selectedWord && (
                    <div
                      className="fixed inset-0 z-50"
                      onClick={handleCloseWordPopup}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute w-72 bg-dark-300/95 backdrop-blur-md rounded-xl border border-dark-200 shadow-2xl overflow-hidden"
                        style={{
                          left: selectedWord.position.x,
                          top: selectedWord.position.y,
                          transform: 'translate(-50%, -100%)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold text-white">
                              {selectedWord.word}
                            </span>
                            <Button
                              type="text"
                              size="small"
                              onClick={handleCloseWordPopup}
                              className="text-gray-400"
                            >
                              ×
                            </Button>
                          </div>
                          {currentSegment && (
                            <p className="text-yellow-300 text-sm mb-3">
                              {currentSegment.translation}
                            </p>
                          )}
                          <Button
                            type="primary"
                            block
                            icon={<SaveOutlined />}
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
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Video info */}
              {video && (
                <div className="bg-dark-300 rounded-xl p-4 border border-dark-200">
                  <Title level={4} className="text-white !mt-0 mb-2">
                    {video.title}
                  </Title>
                  <Text className="text-gray-400">{video.channelName}</Text>
                  {stats && (
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>Watched {stats.watchCount}x</span>
                      <span>•</span>
                      <span>{Math.round(stats.completionRate || 0)}% complete</span>
                    </div>
                  )}
                </div>
              )}

              {/* Continue watching */}
              <ContinueWatching limit={3} />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block space-y-4">
              {/* Current segment info */}
              {currentSegment && (
                <div className="bg-dark-300 rounded-xl p-4 border border-dark-200">
                  <Text className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                    Current Segment
                  </Text>
                  <p className="text-white text-sm mb-2" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                    {currentSegment.text}
                  </p>
                  <p className="text-yellow-300 text-sm">
                    {currentSegment.translation}
                  </p>
                </div>
              )}

              {/* Chapters */}
              {video?.chapters && video.chapters.length > 0 && (
                <div className="bg-dark-300 rounded-xl p-4 border border-dark-200">
                  <Text className="text-gray-400 text-xs uppercase tracking-wider block mb-3">
                    Chapters
                  </Text>
                  <div className="space-y-2">
                    {video.chapters.map((chapter, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-dark-100 transition-colors text-left"
                        onClick={() => usePlayerStore.getState().seek(chapter.startTime)}
                      >
                        <div className="w-8 h-8 rounded bg-dark-100 flex items-center justify-center text-xs text-gray-400 font-mono">
                          {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                        </div>
                        <span className="text-white text-sm flex-1 truncate">
                          {chapter.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary from this video */}
              <div className="bg-dark-300 rounded-xl p-4 border border-dark-200">
                <div className="flex items-center justify-between mb-3">
                  <Text className="text-gray-400 text-xs uppercase tracking-wider">
                    Vocabulary ({vocabItems.filter(i => i.videoId === videoId).length})
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    className="text-primary-400"
                    onClick={() => setVocabDrawerOpen(true)}
                  >
                    View all
                  </Button>
                </div>
                <div className="space-y-2">
                  {vocabItems
                    .filter(i => i.videoId === videoId)
                    .slice(0, 5)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded bg-dark-100"
                      >
                        <div>
                          <p className="text-white text-sm font-medium">{item.word}</p>
                          <p className="text-gray-500 text-xs">{item.meaning}</p>
                        </div>
                      </div>
                    ))}
                  {vocabItems.filter(i => i.videoId === videoId).length === 0 && (
                    <Text className="text-gray-500 text-sm">
                      Click on words in subtitles to save them
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Subtitle Settings Panel */}
      <SubtitleSettingsPanel isOpen={settingsOpen} onClose={closeSettings} />

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-300 rounded-xl p-6 border border-dark-200 shadow-2xl w-80"
              onClick={(e) => e.stopPropagation()}
            >
              <Title level={4} className="text-white !mt-0 mb-4">
                Keyboard Shortcuts
              </Title>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Text className="text-gray-400">{shortcut.action}</Text>
                    <kbd className="px-2 py-1 bg-dark-100 rounded text-white text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
              <Button
                type="primary"
                block
                className="mt-6"
                onClick={() => setShowShortcuts(false)}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vocabulary Drawer */}
      <Drawer
        title="My Vocabulary"
        placement="right"
        open={vocabDrawerOpen}
        onClose={() => setVocabDrawerOpen(false)}
        width={400}
        className="[&_.ant-drawer-content]:bg-dark-300 [&_.ant-drawer-header]:bg-dark-300 [&_.ant-drawer-title]:text-white"
      >
        <div className="space-y-4">
          {vocabItems.length === 0 ? (
            <div className="text-center py-8">
              <Text className="text-gray-400">No vocabulary saved yet</Text>
              <p className="text-gray-500 text-sm mt-2">
                Click on Korean words while watching to save them
              </p>
            </div>
          ) : (
            vocabItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-dark-100 rounded-lg border border-dark-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                      {item.word}
                    </p>
                    <p className="text-gray-400 text-sm">{item.meaning}</p>
                    {item.reading && (
                      <p className="text-gray-500 text-xs">{item.reading}</p>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.masteryLevel === 'mastered' ? 'bg-green-500/20 text-green-400' :
                    item.masteryLevel === 'reviewing' ? 'bg-yellow-500/20 text-yellow-400' :
                    item.masteryLevel === 'learning' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.masteryLevel}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-2 italic">
                  "{item.context}"
                </p>
              </div>
            ))
          )}
        </div>
      </Drawer>
    </div>
  );
}
