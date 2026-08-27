import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
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
  DEALER: {
    id: 'usr-dealer-1',
    email: 'sales@ultratechoutlet.in',
    fullName: 'Suresh Agarwal (UltraTech Cement Outlet)',
    phone: '+91 99888 77665',
    role: 'DEALER',
    isVerified: true,
    createdAt: new Date().toISOString(),
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(demoUsers.HOMEOWNER);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);

  const switchRole = (role: UserRole) => {
    if (demoUsers[role]) {
      setCurrentUser(demoUsers[role]);
      if (role === 'HOMEOWNER') setActiveTab('dashboard');
      else if (role === 'BUILDER') setActiveTab('projects');
      else if (role === 'ADMIN') setActiveTab('verifications');
    }
  };

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
