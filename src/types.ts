export type MediaType = 'movie' | 'series';
export type WatchStatus = 'watched' | 'watching' | 'wishlist';

export interface MediaItem {
  id: number;
  title: string;
  type: MediaType;
  status: WatchStatus;
  genre: string;
  rating: number; // 0-5
  note: string;
  date: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export type Theme = 'dark' | 'light';
export type Screen = 'login' | 'register' | 'dashboard';
