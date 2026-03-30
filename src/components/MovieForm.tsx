import { useState } from 'react';
import { useMedia } from '../context/MediaContext';
import { StarRating } from './StarRating';
import { GENRES } from '../utils/constants';
import type { MediaType, WatchStatus, NewMediaItem } from '../types';

const DEFAULT: NewMediaItem = {
  title: '', type: 'movie', status: 'wishlist', genre: '', rating: 0, note: '',
};

export function MovieForm() {
  const { addItem } = useMedia();
  const [form, setForm] = useState<NewMediaItem>({ ...DEFAULT });
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof NewMediaItem>(k: K, v: NewMediaItem[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    await addItem(form);
    setLoading(false);
    setForm({ ...DEFAULT });
  };

  return (
    <div className="add-card">
      <div className="add-card-title">
        <span>+</span> ADICIONAR <span>TÍTULO</span>
      </div>

      <div className="add-grid">
        <div>
          <label className="form-label">Título</label>
          <input
            className="form-input"
            placeholder="Nome do filme ou série..."
            value={form.title}
            onChange={e => set('title', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </div>
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
          <select className="form-select" value={form.genre} onChange={e => set('genre', e.target.value)}>
            <option value="">Gênero</option>
            {GENRES.map(g => <option key={g}>{g}</option>)}
          </select>
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
        <button className="btn-add" onClick={handleAdd} disabled={loading} style={{ marginBottom: 1 }}>
          {loading ? '...' : '＋ Adicionar'}
        </button>
      </div>
    </div>
  );
}
