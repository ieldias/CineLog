import { useMedia } from '../context/MediaContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const { counts } = useMedia();
  const { signOut, user } = useAuth();

  const mainNav = [
    { id: 'dashboard', icon: '⚡', label: 'Dashboard', count: counts.all },
    { id: 'watched',   icon: '✅', label: 'Assistidos', count: counts.watched },
    { id: 'watching',  icon: '▶️', label: 'Assistindo', count: counts.watching },
    { id: 'wishlist',  icon: '🔖', label: 'Quero Ver',  count: counts.wishlist },
  ];

  const typeNav = [
    { id: 'all-types', icon: '🎞️', label: 'Todos',   count: counts.all },
    { id: 'movies',    icon: '🎬', label: 'Filmes',  count: counts.movies },
    { id: 'series',    icon: '📺', label: 'Séries',  count: counts.series },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🎬</div>
        <div className="sidebar-brand-name">CINE</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {mainNav.map(n => (
          <button key={n.id} className={`sidebar-item ${activeNav === n.id ? 'active' : ''}`} onClick={() => onNavChange(n.id)}>
            <span className="sidebar-item-icon">{n.icon}</span>
            {n.label}
            <span className="sidebar-count">{n.count}</span>
          </button>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 20 }}>Tipo</div>
        {typeNav.map(n => (
          <button key={n.id} className={`sidebar-item ${activeNav === n.id ? 'active' : ''}`} onClick={() => onNavChange(n.id)}>
            <span className="sidebar-item-icon">{n.icon}</span>
            {n.label}
            <span className="sidebar-count">{n.count}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div style={{ padding: '0 14px 12px', fontSize: 12, color: '#5C5854', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </div>
        <button className="sidebar-item" onClick={signOut}>
          <span className="sidebar-item-icon">🚪</span>
          Sair
        </button>
      </div>
    </aside>
  );
}
