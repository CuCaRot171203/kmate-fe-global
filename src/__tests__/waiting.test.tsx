/**
 * Frontend tests for Smart Waiting Module - useWaitingStore
 */
import { useWaitingStore } from '@/store/waiting.store';

describe('useWaitingStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useWaitingStore.getState().reset();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useWaitingStore.getState();

      expect(state.jobId).toBeNull();
      expect(state.videoId).toBeNull();
      expect(state.videoTitle).toBeNull();
      expect(state.stage).toBeNull();
      expect(state.progress).toBe(0);
      expect(state.estimatedSeconds).toBe(0);
      expect(state.queuePosition).toBeNull();
      expect(state.socketConnected).toBe(false);
      expect(state.isCompleted).toBe(false);
      expect(state.isFailed).toBe(false);
      expect(state.errorMessage).toBeNull();
      expect(state.shortsFeed).toEqual([]);
      expect(state.showPlayer).toBe(false);
    });
  });

  describe('setJob', () => {
    it('should set job information', () => {
      const { setJob } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Korean Lesson 1', 'https://example.com/thumb.jpg');

      const state = useWaitingStore.getState();
      expect(state.jobId).toBe('job-123');
      expect(state.videoId).toBe('video-456');
      expect(state.videoTitle).toBe('Korean Lesson 1');
      expect(state.videoThumbnail).toBe('https://example.com/thumb.jpg');
    });

    it('should set thumbnail to null if not provided', () => {
      const { setJob } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Korean Lesson 1');

      const state = useWaitingStore.getState();
      expect(state.videoThumbnail).toBeNull();
    });
  });

  describe('updateFromProgress', () => {
    it('should update progress fields', () => {
      const { setJob, updateFromProgress } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Test Video');
      updateFromProgress({
        stage: 'TRANSCRIBING',
        progress: 55,
        estimatedSeconds: 120,
        isCompleted: false,
        isFailed: false,
      });

      const state = useWaitingStore.getState();
      expect(state.stage).toBe('TRANSCRIBING');
      expect(state.progress).toBe(55);
      expect(state.estimatedSeconds).toBe(120);
      expect(state.isCompleted).toBe(false);
      expect(state.isFailed).toBe(false);
    });

    it('should preserve existing values when partial update', () => {
      const { setJob, updateFromProgress } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Test Video');
      updateFromProgress({ stage: 'DOWNLOADING', progress: 20 });
      updateFromProgress({ progress: 30 });

      const state = useWaitingStore.getState();
      expect(state.stage).toBe('DOWNLOADING');
      expect(state.progress).toBe(30);
    });
  });

  describe('markCompleted', () => {
    it('should mark job as completed with correct state', () => {
      const { setJob, markCompleted } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Test Video');
      markCompleted({
        jobId: 'job-123',
        videoId: 'video-456',
        subtitleId: 'sub-1',
        url: 'https://example.com/sub.vtt',
        language: 'vi',
        segmentCount: 150,
        duration: 3600,
        timestamp: Date.now(),
      });

      const state = useWaitingStore.getState();
      expect(state.isCompleted).toBe(true);
      expect(state.isFailed).toBe(false);
      expect(state.progress).toBe(100);
      expect(state.stage).toBe('COMPLETED');
      expect(state.completedData).not.toBeNull();
      expect(state.completedData?.segmentCount).toBe(150);
    });
  });

  describe('markFailed', () => {
    it('should mark job as failed with error message', () => {
      const { setJob, markFailed } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Test Video');
      markFailed({
        jobId: 'job-123',
        videoId: 'video-456',
        error: 'Download timeout',
        retryable: false,
        attempt: 3,
        timestamp: Date.now(),
      });

      const state = useWaitingStore.getState();
      expect(state.isFailed).toBe(true);
      expect(state.isCompleted).toBe(false);
      expect(state.errorMessage).toBe('Download timeout');
    });
  });

  describe('shortsFeed management', () => {
    it('should set shorts feed', () => {
      const { setShortsFeed } = useWaitingStore.getState();
      const mockFeed = [
        { id: '1', title: 'Short 1', youtubeId: 'yt1', thumbnail: 't1', duration: 60, channelName: 'ch1', viewCount: 100, likeCount: 10, category: 'learning', isLiked: false, createdAt: new Date().toISOString() },
        { id: '2', title: 'Short 2', youtubeId: 'yt2', thumbnail: 't2', duration: 45, channelName: 'ch2', viewCount: 50, likeCount: 5, category: 'vocabulary', isLiked: true, createdAt: new Date().toISOString() },
      ];

      setShortsFeed(mockFeed);

      const state = useWaitingStore.getState();
      expect(state.shortsFeed).toHaveLength(2);
      expect(state.shortsFeed[0].title).toBe('Short 1');
    });

    it('should add to existing shorts feed', () => {
      const { setShortsFeed, addToShortsFeed } = useWaitingStore.getState();

      const mockFeed = [
        { id: '1', title: 'Short 1', youtubeId: 'yt1', thumbnail: 't1', duration: 60, channelName: 'ch1', viewCount: 100, likeCount: 10, category: 'learning', isLiked: false, createdAt: new Date().toISOString() },
      ];

      const newShorts = [
        { id: '2', title: 'Short 2', youtubeId: 'yt2', thumbnail: 't2', duration: 45, channelName: 'ch2', viewCount: 50, likeCount: 5, category: 'vocabulary', isLiked: false, createdAt: new Date().toISOString() },
      ];

      setShortsFeed(mockFeed);
      addToShortsFeed(newShorts);

      const state = useWaitingStore.getState();
      expect(state.shortsFeed).toHaveLength(2);
    });

    it('should track viewed short IDs', () => {
      const { markShortViewed } = useWaitingStore.getState();

      markShortViewed('short-1');
      markShortViewed('short-2');

      const state = useWaitingStore.getState();
      expect(state.viewedShortIds.has('short-1')).toBe(true);
      expect(state.viewedShortIds.has('short-2')).toBe(true);
      expect(state.viewedShortIds.has('short-3')).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { setJob, updateFromProgress, setShortsFeed, markCompleted, reset } =
        useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Test Video');
      updateFromProgress({
        stage: 'TRANSCRIBING',
        progress: 55,
        estimatedSeconds: 120,
        isCompleted: false,
        isFailed: false,
      });
      setShortsFeed([{ id: '1', title: 'Short 1' }]);
      markCompleted({
        jobId: 'job-123',
        videoId: 'video-456',
        subtitleId: 'sub-1',
        url: 'https://example.com',
        language: 'vi',
        segmentCount: 150,
        duration: 3600,
        timestamp: Date.now(),
      });
      reset();

      const state = useWaitingStore.getState();
      expect(state.jobId).toBeNull();
      expect(state.videoId).toBeNull();
      expect(state.stage).toBeNull();
      expect(state.progress).toBe(0);
      expect(state.isCompleted).toBe(false);
      expect(state.shortsFeed).toEqual([]);
    });
  });

  describe('setQueuePosition', () => {
    it('should set queue position', () => {
      const { setQueuePosition } = useWaitingStore.getState();

      setQueuePosition(3);

      const state = useWaitingStore.getState();
      expect(state.queuePosition).toBe(3);
    });
  });

  describe('setEta', () => {
    it('should set estimated seconds', () => {
      const { setEta } = useWaitingStore.getState();

      setEta(300);

      const state = useWaitingStore.getState();
      expect(state.estimatedSeconds).toBe(300);
    });
  });

  describe('setSocketConnected', () => {
    it('should update socket connection status', () => {
      const { setSocketConnected } = useWaitingStore.getState();

      setSocketConnected(true);
      expect(useWaitingStore.getState().socketConnected).toBe(true);

      setSocketConnected(false);
      expect(useWaitingStore.getState().socketConnected).toBe(false);
    });
  });

  describe('selectors', () => {
    it('selectProgressPercent should return current progress', () => {
      const { setJob, updateFromProgress, selectProgressPercent } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Test Video');
      updateFromProgress({ progress: 75 });

      expect(selectProgressPercent(useWaitingStore.getState())).toBe(75);
    });

    it('selectIsWaiting should return true when job is active', () => {
      const { setJob, updateFromProgress, selectIsWaiting } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Test Video');
      updateFromProgress({
        stage: 'TRANSCRIBING',
        progress: 50,
        isCompleted: false,
        isFailed: false,
      });

      expect(selectIsWaiting(useWaitingStore.getState())).toBe(true);
    });

    it('selectIsWaiting should return false when completed', () => {
      const { setJob, markCompleted, selectIsWaiting } = useWaitingStore.getState();

      setJob('job-123', 'video-456', 'Test Video');
      markCompleted({
        jobId: 'job-123',
        videoId: 'video-456',
        subtitleId: 'sub-1',
        url: 'https://example.com',
        language: 'vi',
        segmentCount: 150,
        duration: 3600,
        timestamp: Date.now(),
      });

      expect(selectIsWaiting(useWaitingStore.getState())).toBe(false);
    });
  });
});
