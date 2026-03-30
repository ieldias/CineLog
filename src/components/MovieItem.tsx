import { StarRating } from './StarRating';
import { STATUS_CONFIG } from '../utils/constants';
import type { MediaItem } from '../types';

interface MovieItemProps {
  item: MediaItem;
  onDelete: (id: number) => void;
  onEdit: (item: MediaItem) => void;
}

export function MovieItem({ item, onDelete, onEdit }: MovieItemProps) {
  const status = STATUS_CONFIG[item.status];
  const date = new Date(item.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="movie-card">
      <div className="movie-card-header">
        <span className={`status-badge ${status.cls}`}>{status.label}</span>
        <div className={`movie-type-badge ${item.type === 'movie' ? 'badge-movie' : 'badge-series'}`}>
          {item.type === 'movie' ? '🎬 Filme' : '📺 Série'}
        </div>
        <div className="movie-title">{item.title}</div>
        {item.genre && <div className="movie-genre">{item.genre}</div>}
      </div>

      <div className="movie-card-body">
        <StarRating value={item.rating} onChange={() => {}} readOnly size={16} />
        {item.note && <p className="movie-note">{item.note}</p>}
      </div>

      <div className="movie-card-footer">
        <span className="movie-date">{date}</span>
        <div className="card-actions">
          <button className="icon-btn" onClick={() => onEdit(item)} title="Editar">✏️</button>
          <button className="icon-btn delete" onClick={() => onDelete(item.id)} title="Excluir">🗑</button>
        </div>
      </div>
    </div>
  );
}
