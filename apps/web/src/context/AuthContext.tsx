import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, setAuthToken, clearAuthToken, getAuthToken } from '../api/client';

interface AuthContextType {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  switchRole: (role: UserRole) => void;
  loginWithApi: (email: string, password?: string, role?: string) => Promise<void>;
  registerWithApi: (data: any) => Promise<void>;
  logout: () => void;
  isMobileViewport: boolean;
}

const defaultUser: User = {
  id: 'usr-homeowner-1',
  email: 'owner@sharmahouse.com',
  fullName: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  role: 'HOMEOWNER',
  isVerified: true,
  createdAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Try restoring token session from localStorage
    const token = getAuthToken();
    if (token) {
      api.getMe()
        .then(user => {
          if (user && user.id) {
            setCurrentUser(user);
          }
        })
        .catch(() => {
          clearAuthToken();
        });
    }
  }, []);

  const loginWithApi = async (email: string, password?: string, role?: string) => {
    const res = await api.login(email, password, role);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setCurrentUser(res.user);
      setActiveTab(res.user.role === 'BUILDER' ? 'projects' : 'dashboard');
    }
  };

  const registerWithApi = async (data: any) => {
    const res = await api.register(data);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setCurrentUser(res.user);
      setActiveTab(res.user.role === 'BUILDER' ? 'projects' : 'dashboard');
    }
  };

  const logout = () => {
    clearAuthToken();
    setCurrentUser(defaultUser);
    setActiveTab('dashboard');
  };

  const switchRole = (role: UserRole) => {
    let mockUser: User = { ...defaultUser, role };
    if (role === 'BUILDER') {
      mockUser = {
        id: 'usr-builder-1',
        email: 'vikram@apexinfra.com',
        fullName: 'Vikram Singh (Apex Infra)',
        phone: '+91 99887 76655',
        role: 'BUILDER',
        isVerified: true,
        createdAt: new Date().toISOString()
      };
      setActiveTab('projects');
    } else if (role === 'ADMIN') {
      mockUser = {
        id: 'usr-admin-1',
        email: 'ops@construction.os',
        fullName: 'Platform Ops Admin',
        phone: '+91 90000 00000',
        role: 'ADMIN',
        isVerified: true,
        createdAt: new Date().toISOString()
      };
      setActiveTab('verifications');
    } else {
      setActiveTab('dashboard');
    }
    setCurrentUser(mockUser);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      activeTab,
      setActiveTab,
      switchRole,
      loginWithApi,
      registerWithApi,
      logout,
      isMobileViewport
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
