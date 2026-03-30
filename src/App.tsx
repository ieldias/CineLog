import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MediaProvider } from './context/MediaContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import './App.css';

function AppContent() {
  const { screen, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div
        className={`app-root ${theme}`}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
      >
        <p style={{ color: 'var(--txt-secondary)', fontFamily: 'var(--ff-display)', fontSize: 24, letterSpacing: 2 }}>
          CARREGANDO...
        </p>
      </div>
    );
  }

  return (
    <div className={`app-root ${theme}`}>
      {screen === 'dashboard' ? <Dashboard /> : <AuthPage />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MediaProvider>
          <AppContent />
        </MediaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
