import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Topbar() {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const initials = (name: string) =>
    name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>CINELOG</h1>
        <p>Olá, {currentUser?.name}! Bom ver você.</p>
      </div>
      <div className="topbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
        <div className="user-avatar">
          {initials(currentUser?.name ?? '?')}
        </div>
      </div>
    </div>
  );
}
