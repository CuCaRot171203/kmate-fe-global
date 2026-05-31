export interface ShortVideo {
  id: string;
  youtubeId: string;
  title: string;
  thumbnail: string;
  duration: number;
  channelName: string;
  viewCount: number;
  likeCount: number;
  category: string;
  isLiked: boolean;
  createdAt: string;
}

export interface ShortVideoFeedResponse {
  shorts: ShortVideo[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ShortVideoViewResponse {
  success: boolean;
  viewCount: number;
}

export interface ShortVideoLikeResponse {
  success: boolean;
  isLiked: boolean;
  likeCount: number;
}
