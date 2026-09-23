import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types';
import { api, clearAuthToken, getAuthToken, setAuthToken } from '../api/client';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginWithApi: (email: string, password: string) => Promise<void>;
  registerWithApi: (data: { email: string; password: string; fullName: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  isMobileViewport: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const resize = () => setIsMobileViewport(window.innerWidth < 768);
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!getAuthToken()) { setLoading(false); return; }
    api.getMe()
      .then(user => setCurrentUser(user))
      .catch(() => clearAuthToken())
      .finally(() => setLoading(false));
  }, []);

  const acceptSession = (session: { user: User; token: string }) => {
    setAuthToken(session.token);
    setCurrentUser(session.user);
    setActiveTab('projects');
  };

  const loginWithApi = async (email: string, password: string) => {
    acceptSession(await api.login(email, password));
  };

  const registerWithApi = async (data: { email: string; password: string; fullName: string; role: UserRole }) => {
    acceptSession(await api.register(data));
  };

  const logout = () => {
    clearAuthToken();
    setCurrentUser(null);
    setActiveTab('projects');
  };

  return <AuthContext.Provider value={{ currentUser, loading, activeTab, setActiveTab,
    loginWithApi, registerWithApi, logout, isMobileViewport }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
