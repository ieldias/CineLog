import { useState } from 'react';
import { useMedia } from '../context/MediaContext';
import { MovieItem } from './MovieItem';
import { EditModal } from './EditModal';
import type { MediaItem, WatchStatus, MediaType } from '../types';

export function MovieList() {
  const { items, loading, error, deleteItem } = useMedia();
  const [statusFilter, setStatusFilter] = useState<'all' | WatchStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | MediaType>('all');
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<MediaItem | null>(null);

  const filtered = items.filter(i => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (typeFilter !== 'all' && i.type !== typeFilter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="empty-state">
        <div className="emoji">⏳</div>
        <h3>CARREGANDO...</h3>
        <p>Buscando seus títulos no banco de dados.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="emoji">⚠️</div>
        <h3>ERRO AO CARREGAR</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="filters-row">
        {([
          { id: 'all', label: 'Todos' },
          { id: 'watched', label: '✅ Assistidos' },
          { id: 'watching', label: '▶️ Assistindo' },
          { id: 'wishlist', label: '🔖 Quero Ver' },
        ] as const).map(f => (
          <button
            key={f.id}
            className={`filter-chip ${statusFilter === f.id ? 'active' : ''}`}
            onClick={() => setStatusFilter(f.id)}
          >{f.label}</button>
        ))}

        {([
          { id: 'all', label: '🎞️ Todos' },
          { id: 'movie', label: '🎬 Filmes' },
          { id: 'series', label: '📺 Séries' },
        ] as const).map(f => (
          <button
            key={f.id}
            className={`filter-chip ${typeFilter === f.id ? 'active' : ''}`}
            onClick={() => setTypeFilter(f.id)}
          >{f.label}</button>
        ))}

        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Buscar título..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="movie-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🎬</div>
            <h3>NENHUM TÍTULO ENCONTRADO</h3>
            <p>Adicione seu primeiro filme ou série acima!</p>
          </div>
        ) : (
          filtered.map(item => (
            <MovieItem
              key={item.id}
              item={item}
              onDelete={deleteItem}
              onEdit={setEditItem}
            />
          ))
        )}
      </div>

      {editItem && (
        <EditModal item={editItem} onClose={() => setEditItem(null)} />
      )}
    </>
  );
}
