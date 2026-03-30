import { useMedia } from '../context/MediaContext';

export function StatsRow() {
  const { counts, avgRating } = useMedia();
  const stats = [
    { label: 'Total', value: counts.all, sub: 'títulos registrados', icon: '🎞️' },
    { label: 'Assistidos', value: counts.watched, sub: 'completos', icon: '✅' },
    { label: 'Assistindo', value: counts.watching, sub: 'em andamento', icon: '▶️' },
    { label: 'Média', value: avgRating, sub: 'estrelas por título', icon: '⭐' },
  ];
  return (
    <div className="stats-row">
      {stats.map(s => (
        <div key={s.label} className="stat-card">
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <div className="stat-sub">{s.icon} {s.sub}</div>
        </div>
      ))}
    </div>
  );
}
