import type { TmdbResult } from '../types';

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = 'https://api.themoviedb.org/3';
export const POSTER_BASE = 'https://image.tmdb.org/t/p/w200';

// Mapa de genre_id
export const TMDB_GENRES: Record<number, string> = {
  28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia',
  80: 'Crime', 99: 'Documentário', 18: 'Drama', 10751: 'Família',
  14: 'Fantasia', 36: 'Biografia', 27: 'Terror', 10402: 'Música',
  9648: 'Mistério', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Suspense',
  10752: 'Guerra', 37: 'Faroeste', 10759: 'Ação & Aventura',
  10762: 'Infantil', 10763: 'Notícias', 10764: 'Reality', 10765: 'Sci-Fi & Fantasia',
  10766: 'Novela', 10767: 'Talk Show', 10768: 'Guerra & Política',
};

export function getGenreName(ids: number[]): string {
  for (const id of ids) {
    if (TMDB_GENRES[id]) return TMDB_GENRES[id];
  }
  return '';
}

export async function searchTmdb(query: string): Promise<TmdbResult[]> {
  if (!query.trim() || !TMDB_KEY) return [];
  try {
    const res = await fetch(
      `${BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=pt-BR&page=1`
    );
    const data = await res.json();
    // Filtra apenas filmes e séries (exclui pessoas)
    return (data.results as TmdbResult[]).filter(
      r => r.media_type === 'movie' || r.media_type === 'tv'
    ).slice(0, 8);
  } catch {
    return [];
  }
}
