export type MediaType = 'movie' | 'series';
export type WatchStatus = 'watched' | 'watching' | 'wishlist';

export interface MediaItem {
  id: number;
  user_id: string;
  title: string;
  type: MediaType;
  status: WatchStatus;
  genre: string;
  rating: number;
  note: string;
  created_at: string;
}

export type NewMediaItem = Omit<MediaItem, 'id' | 'user_id' | 'created_at'>;

export type Theme = 'dark' | 'light';
