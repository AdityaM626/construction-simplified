import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { api, setAuthToken } from '../api/client';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileViewport: boolean;
  setIsMobileViewport: (val: boolean) => void;
}

const demoUsers: Record<UserRole, User> = {
  HOMEOWNER: {
    id: 'usr-homeowner-1',
    email: 'rajesh.homeowner@gmail.com',
    fullName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    role: 'HOMEOWNER',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  BUILDER: {
    id: 'usr-builder-1',
    email: 'contact@apexinfra.com',
    fullName: 'Vikram Singh (Apex Infra)',
    phone: '+91 98111 22334',
    role: 'BUILDER',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  ADMIN: {
    id: 'usr-admin-1',
    email: 'admin@construction-os.io',
    fullName: 'Platform Ops Admin',
    phone: '+91 90000 00000',
    role: 'ADMIN',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  DEALER: { id: 'usr-dealer-1', email: '', fullName: 'Dealer', phone: '', role: 'DEALER', isVerified: true, createdAt: '' }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(demoUsers.HOMEOWNER);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);

  const switchRole = async (role: UserRole) => {
    const demoUser = demoUsers[role];
    if (demoUser?.email) {
      const { user, token } = await api.login(demoUser.email, role);
      setAuthToken(token);
      setCurrentUser(user);
      if (role === 'HOMEOWNER') setActiveTab('dashboard');
      else if (role === 'BUILDER') setActiveTab('projects');
      else if (role === 'ADMIN') setActiveTab('verifications');
    }
  };

  // Give the initial owner session the same authenticated API connection as a
  // manually selected role. This keeps the first screen and switched screens in sync.
  useEffect(() => { void switchRole('HOMEOWNER'); }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        activeTab,
        setActiveTab,
        isMobileViewport,
        setIsMobileViewport,
      }}
    >
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
