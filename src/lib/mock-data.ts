import { VideoInfo } from '@/store/player.store';
import { SubtitleSegment } from '@/store/subtitle.store';
import { WatchProgress } from '@/store/watch-history.store';

// Sample Korean learning video data
export const MOCK_VIDEOS: VideoInfo[] = [
  {
    id: 'video-001',
    slug: 'ha-canh-noi-anh',
    youtubeId: 'jNQXAC9IVRw',
    title: 'Learn Korean with BTS - Dynamite MV',
    channelName: 'Big Hit Labels',
    thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    duration: 199,
    chapters: [
      { title: 'Intro', startTime: 0 },
      { title: 'Main Chorus', startTime: 45 },
      { title: 'Verse 1', startTime: 90 },
      { title: 'Bridge', startTime: 150 },
    ],
  },
  {
    id: 'video-002',
    slug: 'kinh-ngu-va-giao-tiep-noi-cong-so-han-quoc',
    youtubeId: 'pKKoqNjSITQ',
    title: 'Korean Short Story for Beginners - Cafe Ordering',
    channelName: 'Korean with Seoul',
    thumbnail: 'https://img.youtube.com/vi/pKKoqNjSITQ/maxresdefault.jpg',
    duration: 312,
    chapters: [
      { title: 'Vocabulary Preview', startTime: 0 },
      { title: 'Dialogue', startTime: 30 },
      { title: 'Grammar Points', startTime: 180 },
      { title: 'Practice', startTime: 260 },
    ],
  },
  {
    id: 'video-003',
    slug: 'hoc-tieng-han-qua-o3ics-newjeans-ditto',
    youtubeId: '9bZkp7q19f0',
    title: 'Korean Pop Gangnam Style - Learn Korean Phrases',
    channelName: 'Talk To Me In Korean',
    thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    duration: 219,
    chapters: [
      { title: 'Intro', startTime: 0 },
      { title: 'Key Phrases', startTime: 60 },
      { title: 'Cultural Context', startTime: 140 },
    ],
  },
];

// Realistic subtitle segments for demo video
export const MOCK_SUBTITLES: SubtitleSegment[] = [
  {
    id: 'seg-001',
    startTime: 0,
    endTime: 3.5,
    text: '안녕하세요!',
    translation: 'Xin chào!',
    words: [
      { word: '안녕하세요', startChar: 0, endChar: 4, reading: 'annyeonghaseyo' },
    ],
  },
  {
    id: 'seg-002',
    startTime: 3.5,
    endTime: 7,
    text: '오늘은 정말 좋은 날이에요.',
    translation: 'Hôm nay thật là một ngày tuyệt vời.',
    words: [
      { word: '오늘은', startChar: 0, endChar: 3, reading: 'oneul-eun' },
      { word: '정말', startChar: 4, endChar: 6, reading: 'jeongmal' },
      { word: '좋은', startChar: 7, endChar: 9, reading: 'joeun' },
      { word: '날이에요', startChar: 10, endChar: 15, reading: 'nari-eyo' },
    ],
  },
  {
    id: 'seg-003',
    startTime: 7,
    endTime: 11,
    text: '저는 한국어를 배우고 있어요.',
    translation: 'Tôi đang học tiếng Hàn Quốc.',
    words: [
      { word: '저는', startChar: 0, endChar: 2, reading: 'jeo-neun' },
      { word: '한국어를', startChar: 3, endChar: 7, reading: 'hanguk-eo-reul' },
      { word: '배우고 있어요', startChar: 8, endChar: 16, reading: 'bae-wo-go iss-eo-yo' },
    ],
  },
  {
    id: 'seg-004',
    startTime: 11,
    endTime: 15,
    text: '한국 음식이 정말 맛있어요!',
    translation: 'Đồ ăn Hàn Quốc thật sự rất ngon!',
    words: [
      { word: '한국', startChar: 0, endChar: 2, reading: 'hanguk' },
      { word: '음식', startChar: 3, endChar: 5, reading: 'eumsik' },
      { word: '정말', startChar: 6, endChar: 8, reading: 'jeongmal' },
      { word: '맛있어요', startChar: 9, endChar: 14, reading: 'mas-iss-eo-yo' },
    ],
  },
  {
    id: 'seg-005',
    startTime: 15,
    endTime: 19,
    text: '김치는 한국의 대표적인 음식이에요.',
    translation: 'Kimchi là món ăn đại diện của Hàn Quốc.',
    words: [
      { word: '김치', startChar: 0, endChar: 2, reading: 'kimchi' },
      { word: '한국의', startChar: 3, endChar: 6, reading: 'hanguk-ui' },
      { word: '대표적인', startChar: 7, endChar: 12, reading: 'daepyo-jjeok-in' },
      { word: '음식이에요', startChar: 13, endChar: 18, reading: 'eumsik-i-eyo' },
    ],
  },
  {
    id: 'seg-006',
    startTime: 19,
    endTime: 23,
    text: '매운 음식도 좋아해요?',
    translation: 'Bạn cũng thích đồ ăn cay sao?',
    words: [
      { word: '매운', startChar: 0, endChar: 2, reading: 'mae-un' },
      { word: '음식', startChar: 3, endChar: 5, reading: 'eumsik' },
      { word: '좋아해요', startChar: 6, endChar: 11, reading: 'joahaeyo' },
    ],
  },
  {
    id: 'seg-007',
    startTime: 23,
    endTime: 27,
    text: '네, 저는 매운 음식을 정말 좋아해요!',
    translation: 'Vâng, tôi rất thích đồ ăn cay!',
    words: [
      { word: '네', startChar: 0, endChar: 1, reading: 'ne' },
      { word: '매운', startChar: 5, endChar: 7, reading: 'mae-un' },
      { word: '음식을', startChar: 8, endChar: 11, reading: 'eumsik-eul' },
      { word: '정말', startChar: 12, endChar: 14, reading: 'jeongmal' },
      { word: '좋아해요', startChar: 15, endChar: 20, reading: 'joahaeyo' },
    ],
  },
  {
    id: 'seg-008',
    startTime: 27,
    endTime: 31,
    text: '불고기는 어떤가요?',
    translation: 'Còn bulgogi thì sao?',
    words: [
      { word: '불고기', startChar: 0, endChar: 3, reading: 'bulgogi' },
      { word: '어떤가요', startChar: 4, endChar: 9, reading: 'eotteon-gayo' },
    ],
  },
  {
    id: 'seg-009',
    startTime: 31,
    endTime: 36,
    text: '불고기는 소고기로 만든 한국 바베큐예요.',
    translation: 'Bulgogi là thịt bò nướng kiểu Hàn Quốc.',
    words: [
      { word: '불고기', startChar: 0, endChar: 3, reading: 'bulgogi' },
      { word: '소고기로', startChar: 4, endChar: 8, reading: 'sogogi-ro' },
      { word: '만든', startChar: 9, endChar: 11, reading: 'mand-eun' },
      { word: '한국', startChar: 12, endChar: 14, reading: 'hanguk' },
      { word: '바베큐', startChar: 15, endChar: 18, reading: 'babe-kyu' },
      { word: '예요', startChar: 19, endChar: 21, reading: 'yeyo' },
    ],
  },
  {
    id: 'seg-010',
    startTime: 36,
    endTime: 40,
    text: '달콤하고 부드러워요.',
    translation: 'Nó ngọt và mềm.',
    words: [
      { word: '달콤하고', startChar: 0, endChar: 4, reading: 'dalkom-hago' },
      { word: '부드러워요', startChar: 5, endChar: 11, reading: 'budeureowoyo' },
    ],
  },
  {
    id: 'seg-011',
    startTime: 40,
    endTime: 44,
    text: '한국에 가본 적이 있어요?',
    translation: 'Bạn đã từng đến Hàn Quốc chưa?',
    words: [
      { word: '한국에', startChar: 0, endChar: 3, reading: 'hanguk-e' },
      { word: '가본', startChar: 4, endChar: 6, reading: 'ga-bon' },
      { word: '적이', startChar: 7, endChar: 9, reading: 'jeok-i' },
      { word: '있어요', startChar: 10, endChar: 14, reading: 'iss-eo-yo' },
    ],
  },
  {
    id: 'seg-012',
    startTime: 44,
    endTime: 49,
    text: '아직은요, 하지만 곧 갈 거예요!',
    translation: 'Chưa, nhưng tôi sẽ đi sớm thôi!',
    words: [
      { word: '아직은', startChar: 0, endChar: 3, reading: 'ajik-eun' },
      { word: '하지만', startChar: 4, endChar: 7, reading: 'hajiman' },
      { word: '곧', startChar: 8, endChar: 9, reading: 'got' },
      { word: '갈 거예요', startChar: 10, endChar: 16, reading: 'gal geoyeyo' },
    ],
  },
  {
    id: 'seg-013',
    startTime: 49,
    endTime: 53,
    text: '서울은 정말 아름다운 도시예요.',
    translation: 'Seoul là một thành phố rất đẹp.',
    words: [
      { word: '서울은', startChar: 0, endChar: 3, reading: 'seoul-eun' },
      { word: '정말', startChar: 4, endChar: 6, reading: 'jeongmal' },
      { word: '아름다운', startChar: 7, endChar: 12, reading: 'areumdaun' },
      { word: '도시', startChar: 13, endChar: 15, reading: 'dosi' },
      { word: '예요', startChar: 16, endChar: 18, reading: 'yeyo' },
    ],
  },
  {
    id: 'seg-014',
    startTime: 53,
    endTime: 57,
    text: '경복궁도 꼭 가보세요!',
    translation: 'Hãy nhất định đến Gyeongbokgung!',
    words: [
      { word: '경복궁', startChar: 0, endChar: 3, reading: 'Gyeongbokgung' },
      { word: '도', startChar: 4, endChar: 5, reading: 'do' },
      { word: '꼭', startChar: 6, endChar: 7, reading: 'kkok' },
      { word: '가보세요', startChar: 8, endChar: 13, reading: 'gaboseyo' },
    ],
  },
  {
    id: 'seg-015',
    startTime: 57,
    endTime: 62,
    text: '한국어를 잘하시네요!',
    translation: 'Bạn nói tiếng Hàn giỏi lắm!',
    words: [
      { word: '한국어를', startChar: 0, endChar: 4, reading: 'hanguk-eo-reul' },
      { word: '잘', startChar: 5, endChar: 6, reading: 'jal' },
      { word: '하시네요', startChar: 7, endChar: 12, reading: 'hasin-eyo' },
    ],
  },
  {
    id: 'seg-016',
    startTime: 62,
    endTime: 66,
    text: '감사합니다! 열심히 노력하고 있어요.',
    translation: 'Cảm ơn bạn! Tôi st efforts.',
    words: [
      { word: '감사합니다', startChar: 0, endChar: 5, reading: 'gamsahamnida' },
      { word: '열심히', startChar: 6, endChar: 9, reading: 'yeolsimhi' },
      { word: '노력하고 있어요', startChar: 10, endChar: 19, reading: 'noryeok-hago iss-eo-yo' },
    ],
  },
  {
    id: 'seg-017',
    startTime: 66,
    endTime: 70,
    text: '화이팅이에요!',
    translation: 'Cố lên nhé!',
    words: [
      { word: '화이팅', startChar: 0, endChar: 3, reading: 'hwa-iting' },
      { word: '이에요', startChar: 4, endChar: 7, reading: 'i-eyo' },
    ],
  },
  {
    id: 'seg-018',
    startTime: 70,
    endTime: 74,
    text: '다음에 또 만나요!',
    translation: 'Hẹn gặp lại lần sau nhé!',
    words: [
      { word: '다음에', startChar: 0, endChar: 3, reading: 'daeum-e' },
      { word: '또', startChar: 4, endChar: 5, reading: 'tto' },
      { word: '만나요', startChar: 6, endChar: 10, reading: 'mannayo' },
    ],
  },
];

// Mock watch progress data
export const MOCK_WATCH_HISTORY: WatchProgress[] = [
  {
    videoId: 'video-001',
    youtubeId: 'jNQXAC9IVRw',
    title: 'Learn Korean with BTS - Dynamite MV',
    channelName: 'Big Hit Labels',
    thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    duration: 199,
    currentTime: 120,
    progress: 60.3,
    lastWatched: Date.now() - 3600000, // 1 hour ago
    completedSegments: MOCK_SUBTITLES.slice(0, 10).map(s => s.id),
    totalSegments: MOCK_SUBTITLES.length,
    isCompleted: false,
    watchCount: 3,
    totalWatchTime: 360000, // 1 hour total
  },
  {
    videoId: 'video-002',
    youtubeId: 'pKKoqNjSITQ',
    title: 'Korean Short Story for Beginners',
    channelName: 'Korean with Seoul',
    thumbnail: 'https://img.youtube.com/vi/pKKoqNjSITQ/maxresdefault.jpg',
    duration: 312,
    currentTime: 0,
    progress: 0,
    lastWatched: Date.now() - 86400000, // 1 day ago
    completedSegments: [],
    totalSegments: MOCK_SUBTITLES.length,
    isCompleted: false,
    watchCount: 1,
    totalWatchTime: 0,
  },
  {
    videoId: 'video-003',
    youtubeId: '9bZkp7q19f0',
    title: 'Korean Pop Gangnam Style - Learn Korean',
    channelName: 'Talk To Me In Korean',
    thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    duration: 219,
    currentTime: 219,
    progress: 100,
    lastWatched: Date.now() - 172800000, // 2 days ago
    completedSegments: MOCK_SUBTITLES.map(s => s.id),
    totalSegments: MOCK_SUBTITLES.length,
    isCompleted: true,
    watchCount: 2,
    totalWatchTime: 438000, // 2 hours total
  },
];

// Helper functions to get mock data
export function getMockVideo(videoIdOrSlug: string): VideoInfo | undefined {
  return MOCK_VIDEOS.find(v => v.id === videoIdOrSlug || v.slug === videoIdOrSlug);
}

export function getMockSubtitles(videoId: string): SubtitleSegment[] {
  // Return same subtitles for all demo videos
  return MOCK_SUBTITLES;
}

export function getMockWatchProgress(videoId: string): WatchProgress | undefined {
  return MOCK_WATCH_HISTORY.find(p => p.videoId === videoId);
}

export function getMockContinueWatching(): WatchProgress[] {
  return MOCK_WATCH_HISTORY.filter(p => !p.isCompleted && p.progress > 0);
}

export function getMockRecentlyWatched(): WatchProgress[] {
  return [...MOCK_WATCH_HISTORY].sort((a, b) => b.lastWatched - a.lastWatched);
}
