import { useState } from 'react';
import { useMedia } from '../context/MediaContext';
import { StarRating } from './StarRating';
import { MovieSearch } from './MovieSearch';
import { POSTER_BASE, getGenreName } from '../lib/tmdb';
import type { MediaType, WatchStatus, NewMediaItem, TmdbResult } from '../types';

const DEFAULT: NewMediaItem = {
  title: '', type: 'movie', status: 'wishlist', genre: '',
  rating: 0, note: '', poster_url: '', tmdb_id: null,
};

export function MovieForm() {
  const { addItem } = useMedia();
  const [form, setForm] = useState<NewMediaItem>({ ...DEFAULT });
  const [loading, setLoading] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  const set = <K extends keyof NewMediaItem>(k: K, v: NewMediaItem[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSelect = (result: TmdbResult, type: MediaType) => {
    const genre = getGenreName(result.genre_ids);
    const posterUrl = result.poster_path ? `${POSTER_BASE}${result.poster_path}` : '';
    setSelectedPoster(posterUrl || null);
    setForm(f => ({
      ...f,
      title: result.title || result.name || '',
      type,
      genre,
      poster_url: posterUrl,
      tmdb_id: result.id,
    }));
  };

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    await addItem(form);
    setLoading(false);
    setForm({ ...DEFAULT });
    setSelectedPoster(null);
  };

  return (
    <div className="add-card">
      <div className="add-card-title">
        <span>+</span> ADICIONAR <span>TÍTULO</span>
      </div>

      <div className="add-form-layout">
        {/* Poster preview */}
        <div className="add-poster-preview">
          {selectedPoster
            ? <img src={selectedPoster} alt="Pôster" />
            : <div className="add-poster-empty">🎬</div>
          }
        </div>

        <div className="add-form-fields">
          {/* TMDB Search */}
          <MovieSearch onSelect={handleSelect} />

          {form.title && (
            <div className="selected-title-tag">
              ✅ <strong>{form.title}</strong>
              <button
                type="button"
                onClick={() => { setForm({ ...DEFAULT }); setSelectedPoster(null); }}
              >✕</button>
            </div>
          )}

          <div className="add-grid-3">
            <div>
              <label className="form-label">Tipo</label>
              <select className="form-select" value={form.type} onChange={e => set('type', e.target.value as MediaType)}>
                <option value="movie">🎬 Filme</option>
                <option value="series">📺 Série</option>
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value as WatchStatus)}>
                <option value="watched">✅ Assistido</option>
                <option value="watching">▶️ Assistindo</option>
                <option value="wishlist">🔖 Vou Assistir</option>
              </select>
            </div>
            <div>
              <label className="form-label">Gênero</label>
              <input
                className="form-input"
                placeholder="Preenchido automaticamente"
                value={form.genre}
                onChange={e => set('genre', e.target.value)}
              />
            </div>
          </div>

          <div className="star-row">
            <span className="star-label">Nota:</span>
            <StarRating value={form.rating} onChange={v => set('rating', v)} />
            {form.rating > 0 && (
              <span style={{ fontSize: 13, color: 'var(--txt-muted)', marginLeft: 6 }}>{form.rating}/5</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'end' }}>
            <div>
              <label className="form-label">Comentário (opcional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="O que você achou?"
                value={form.note}
                onChange={e => set('note', e.target.value)}
              />
            </div>
            <button
              className="btn-add"
              onClick={handleAdd}
              disabled={loading || !form.title}
              style={{ marginBottom: 1 }}
            >
              {loading ? '...' : '＋ Adicionar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
