import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Topbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const name = (user?.user_metadata?.full_name as string) || user?.email || '';
  const initials = name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>CINELOG</h1>
        <p>Olá, {name.split(' ')[0]}! Bom ver você.</p>
      </div>
      <div className="topbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
        <div className="user-avatar">{initials}</div>
      </div>
    </div>
  );
}
