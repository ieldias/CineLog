import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, Screen } from '../types';

const DEMO_USERS: User[] = [
  { name: 'Demo', email: 'demo@cinelog.com', password: '123456' },
];

interface AuthContextValue {
  currentUser: User | null;
  screen: Screen;
  users: User[];
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  setScreen: (s: Screen) => void;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('login');

  const login = (email: string, password: string): string | null => {
    const u = users.find(u => u.email === email && u.password === password);
    if (!u) return 'E-mail ou senha inválidos.';
    setCurrentUser(u);
    setScreen('dashboard');
    return null;
  };

  const register = (name: string, email: string, password: string): string | null => {
    if (!name || !email || !password) return 'Preencha todos os campos.';
    if (users.find(u => u.email === email)) return 'E-mail já cadastrado.';
    const newUser = { name, email, password };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setScreen('dashboard');
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    setScreen('login');
  };

  return (
    <AuthContext.Provider value={{ currentUser, screen, users, login, register, logout, setScreen }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
