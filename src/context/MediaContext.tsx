import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { MediaItem, NewMediaItem } from '../types';

interface MediaContextValue {
  items: MediaItem[];
  loading: boolean;
  error: string | null;
  addItem: (item: NewMediaItem) => Promise<void>;
  updateItem: (id: number, item: Partial<NewMediaItem>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
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
  const { user } = useAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca todos os itens do usuário logado
  const fetchItems = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError('Erro ao carregar dados: ' + error.message);
    } else {
      setItems(data as MediaItem[]);
    }
    setLoading(false);
  };

  // Busca os dados sempre que o usuário mudar
  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const addItem = async (item: NewMediaItem) => {
    if (!user) return;
    setError(null);

    const { data, error } = await supabase
      .from('media_items')
      .insert({ ...item, user_id: user.id })
      .select()
      .single();

    if (error) {
      setError('Erro ao adicionar: ' + error.message);
    } else {
      setItems(prev => [data as MediaItem, ...prev]);
    }
  };

  const updateItem = async (id: number, item: Partial<NewMediaItem>) => {
    if (!user) return;
    setError(null);

    const { data, error } = await supabase
      .from('media_items')
      .update(item)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      setError('Erro ao atualizar: ' + error.message);
    } else {
      setItems(prev => prev.map(i => i.id === id ? data as MediaItem : i));
    }
  };

  const deleteItem = async (id: number) => {
    if (!user) return;
    setError(null);

    const { error } = await supabase
      .from('media_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      setError('Erro ao excluir: ' + error.message);
    } else {
      setItems(prev => prev.filter(i => i.id !== id));
    }
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
    <MediaContext.Provider value={{ items, loading, error, addItem, updateItem, deleteItem, counts, avgRating }}>
      {children}
    </MediaContext.Provider>
  );
}

export const useMedia = () => useContext(MediaContext);
