import { createContext, useContext, useState, ReactNode } from 'react';
import type { MediaItem, WatchStatus, MediaType } from '../types';

const DEMO_ITEMS: MediaItem[] = [
  { id: 1, title: 'Dune: Parte Dois', type: 'movie', status: 'watched', genre: 'Sci-Fi', rating: 5, note: 'Épico visual e narrativo. Villeneuve entrega uma obra prima da ficção científica.', date: '15 Mar 2024' },
  { id: 2, title: 'The Bear', type: 'series', status: 'watching', genre: 'Drama', rating: 4, note: 'Intensa e angustiante do jeito certo. O ritmo é impecável.', date: '10 Mar 2024' },
  { id: 3, title: 'Oppenheimer', type: 'movie', status: 'watched', genre: 'Biografia', rating: 5, note: 'Nolan no seu melhor. A montagem é cirúrgica e o elenco impecável.', date: '01 Mar 2024' },
  { id: 4, title: 'Shogun', type: 'series', status: 'watching', genre: 'Drama', rating: 4, note: 'Produção belíssima. O Japão feudal nunca pareceu tão real.', date: '08 Mar 2024' },
  { id: 5, title: 'Alien: Romulus', type: 'movie', status: 'wishlist', genre: 'Terror', rating: 0, note: '', date: '12 Mar 2024' },
  { id: 6, title: 'Severance', type: 'series', status: 'wishlist', genre: 'Thriller', rating: 0, note: '', date: '05 Mar 2024' },
];

interface MediaContextValue {
  items: MediaItem[];
  addItem: (item: Omit<MediaItem, 'id' | 'date'>) => void;
  updateItem: (item: MediaItem) => void;
  deleteItem: (id: number) => void;
  counts: {
    all: number;
    watched: number;
    watching: number;
    wishlist: number;
    movies: number;
    series: number;
  };
  avgRating: string;
}

const MediaContext = createContext<MediaContextValue>({} as MediaContextValue);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MediaItem[]>(DEMO_ITEMS);
  const [nextId, setNextId] = useState(10);

  const addItem = (item: Omit<MediaItem, 'id' | 'date'>) => {
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    setItems(prev => [{ ...item, id: nextId, date: today }, ...prev]);
    setNextId(n => n + 1);
  };

  const updateItem = (updated: MediaItem) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const counts = {
    all: items.length,
    watched: items.filter(i => i.status === 'watched').length,
    watching: items.filter(i => i.status === 'watching').length,
    wishlist: items.filter(i => i.status === 'wishlist').length,
    movies: items.filter(i => i.type === 'movie').length,
    series: items.filter(i => i.type === 'series').length,
  };

  const rated = items.filter(i => i.rating > 0);
  const avgRating = rated.length
    ? (rated.reduce((s, i) => s + i.rating, 0) / rated.length).toFixed(1)
    : '—';

  return (
    <MediaContext.Provider value={{ items, addItem, updateItem, deleteItem, counts, avgRating }}>
      {children}
    </MediaContext.Provider>
  );
}

export const useMedia = () => useContext(MediaContext);
