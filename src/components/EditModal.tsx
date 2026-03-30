import { useState } from 'react';
import { StarRating } from './StarRating';
import { GENRES } from '../utils/constants';
import type { MediaItem, MediaType, WatchStatus } from '../types';

interface EditModalProps {
  item: MediaItem;
  onClose: () => void;
  onSave: (item: MediaItem) => void;
}

export function EditModal({ item, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState<MediaItem>({ ...item });
  const set = <K extends keyof MediaItem>(k: K, v: MediaItem[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">EDITAR</div>

        <div className="form-group">
          <label className="form-label">Título</label>
          <input
            className="form-input"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Nome do filme ou série"
          />
        </div>

        <div className="add-grid-2">
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select className="form-select" value={form.type} onChange={e => set('type', e.target.value as MediaType)}>
              <option value="movie">🎬 Filme</option>
              <option value="series">📺 Série</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value as WatchStatus)}>
              <option value="watched">✅ Assistido</option>
              <option value="watching">▶️ Assistindo</option>
              <option value="wishlist">🔖 Vou Assistir</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Gênero</label>
          <select className="form-select" value={form.genre} onChange={e => set('genre', e.target.value)}>
            <option value="">Selecionar gênero</option>
            {GENRES.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Nota</label>
          <StarRating value={form.rating} onChange={v => set('rating', v)} />
        </div>

        <div className="form-group">
          <label className="form-label">Comentário</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={form.note}
            onChange={e => set('note', e.target.value)}
            placeholder="O que você achou?"
          />
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-add" onClick={() => onSave(form)}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
