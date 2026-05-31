'use client';

import { useState, useCallback } from 'react';
import { Dropdown, Button, Tooltip, Space } from 'antd';
import { TranslationOutlined, LoadingOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSubtitle, useSubtitleJobs } from '@/hooks/use-subtitle';
import type { SubtitleDisplayMode } from './subtitle-overlay';

interface SubtitleControlBarProps {
  videoId: string;
  defaultLanguage?: string;
  availableLanguages?: string[];
  className?: string;
}

const DISPLAY_MODE_LABELS: Record<SubtitleDisplayMode, string> = {
  original: 'Korean',
  translation: 'Vietnamese',
  bilingual: 'Bilingual',
};

/**
 * Control bar for subtitle display:
 * - Language selector
 * - Display mode (original / translation / bilingual)
 * - Toggle subtitles on/off
 */
export function SubtitleControlBar({
  videoId,
  defaultLanguage = 'vi',
  availableLanguages = ['ko', 'vi'],
  className = '',
}: SubtitleControlBarProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [displayMode, setDisplayMode] = useState<SubtitleDisplayMode>('bilingual');
  const [visible, setVisible] = useState(true);

  const { data: subtitle, isLoading: loadingSubtitle } = useSubtitle(videoId, selectedLanguage);
  const { data: jobList } = useSubtitleJobs();

  // Find if there's a processing job for this video
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobs = (jobList as any)?.data ?? jobList ?? [];
  const processingJob = Array.isArray(jobs)
    ? jobs.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (j: any) => j.videoId === videoId && !['COMPLETED', 'FAILED', 'DEAD_LETTER'].includes(j.status)
      )
    : null;

  const languageLabels: Record<string, string> = {
    ko: 'Korean',
    vi: 'Vietnamese',
    en: 'English',
  };

  const handleLanguageChange = useCallback((lang: string) => {
    setSelectedLanguage(lang);
  }, []);

  const handleDisplayModeChange = useCallback((mode: SubtitleDisplayMode) => {
    setDisplayMode(mode);
    if (mode !== 'original') {
      setSelectedLanguage('vi');
    }
  }, []);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Subtitle toggle */}
      <Tooltip title={visible ? 'Hide subtitles' : 'Show subtitles'}>
        <Button
          type={visible ? 'primary' : 'default'}
          size="small"
          icon={loadingSubtitle ? <LoadingOutlined /> : <TranslationOutlined />}
          onClick={() => setVisible((v) => !v)}
          disabled={!subtitle && !processingJob}
        >
          {subtitle ? 'CC' : 'No subs'}
        </Button>
      </Tooltip>

      {/* Language selector */}
      {visible && (
        <>
          <Dropdown
            menu={{
              items: availableLanguages.map((lang) => ({
                key: lang,
                label: languageLabels[lang] ?? lang,
                onClick: () => handleLanguageChange(lang),
              })),
              selectedKeys: [selectedLanguage],
            }}
            trigger={['click']}
          >
            <Button size="small" icon={<GlobalOutlined />}>
              {languageLabels[selectedLanguage] ?? selectedLanguage}
            </Button>
          </Dropdown>

          {/* Display mode selector */}
          <Space size={4}>
            {(['original', 'translation', 'bilingual'] as SubtitleDisplayMode[]).map((mode) => (
              <Tooltip key={mode} title={DISPLAY_MODE_LABELS[mode]}>
                <Button
                  size="small"
                  type={displayMode === mode ? 'primary' : 'default'}
                  onClick={() => handleDisplayModeChange(mode)}
                >
                  {mode === 'original' ? 'KO' : mode === 'translation' ? 'VI' : 'BOTH'}
                </Button>
              </Tooltip>
            ))}
          </Space>
        </>
      )}
    </div>
  );
}
