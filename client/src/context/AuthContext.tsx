import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isUnder18: boolean;
  studentProfile?: any;
  careerTwin?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  lang: 'en' | 'hi';
  login: (email: string, pass: string) => Promise<void>;
  signup: (payload: any) => Promise<void>;
  logout: () => void;
  toggleTheme: () => void;
  setLanguage: (l: 'en' | 'hi') => void;
  quickLoginDemo: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('pathiq_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>((localStorage.getItem('pathiq_theme') as any) || 'dark');
  const [lang, setLang] = useState<'en' | 'hi'>((localStorage.getItem('pathiq_lang') as any) || 'en');

  // Handle dark mode class on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pathiq_theme', theme);
  }, [theme]);

  // Language persistence
  useEffect(() => {
    localStorage.setItem('pathiq_lang', lang);
  }, [lang]);

  // Load current user on token change
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.getMe();
        setUser(me);
      } catch (err) {
        console.warn('Failed to load user session, clearing token');
        localStorage.removeItem('pathiq_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    localStorage.setItem('pathiq_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const signup = async (payload: any) => {
    const res = await api.signup(payload);
    localStorage.setItem('pathiq_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('pathiq_token');
    setToken(null);
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLanguage = (l: 'en' | 'hi') => {
    setLang(l);
  };

  const quickLoginDemo = async (email: string) => {
    const password = email.startsWith('admin') ? 'AdminPass123!' : 'StudentPass123!';
    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        theme,
        lang,
        login,
        signup,
        logout,
        toggleTheme,
        setLanguage,
        quickLoginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
