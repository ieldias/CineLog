import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MediaProvider } from './context/MediaContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import './App.css';

function AppContent() {
  const { screen } = useAuth();
  const { theme } = useTheme();

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
