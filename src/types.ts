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
  poster_url: string;
  tmdb_id: number | null;
  created_at: string;
}

export type NewMediaItem = Omit<MediaItem, 'id' | 'user_id' | 'created_at'>;

export type Theme = 'dark' | 'light';

// TMDB API types
export interface TmdbResult {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  genre_ids: number[];
  media_type?: string;
  overview: string;
}
