import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

export function AuthPage() {
  const { screen } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">🎬</div>
          <div className="auth-brand-name">CINELOG</div>
        </div>
        <div className="auth-tagline">
          <h1>SEU <span>DIÁRIO</span><br />CINEMATOGRÁFICO</h1>
          <p>Registre, avalie e organize tudo que você assiste num só lugar. Filmes, séries e mais.</p>
        </div>
        <p style={{ color: '#5C5854', fontSize: 13 }}>© 2024 CineLog. Feito com ♥</p>
      </div>

      <div className="auth-right" style={{ position: 'relative' }}>
        <button className="theme-toggle-auth" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
        </button>
        <div className="auth-form-box">
          {screen === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
