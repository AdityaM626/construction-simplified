import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, NotificationItem } from '../types';

export const DEMO_USERS: Record<UserRole, User> = {
  HOMEOWNER: {
    id: 'usr-homeowner-1',
    email: 'rajesh.homeowner@gmail.com',
    fullName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    role: 'HOMEOWNER',
    isVerified: true,
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  BUILDER: {
    id: 'usr-builder-1',
    email: 'contact@apexinfra.com',
    fullName: 'Vikram Singh (Apex Infra)',
    phone: '+91 98111 22334',
    role: 'BUILDER',
    isVerified: true,
    createdAt: '2025-11-10T10:00:00.000Z'
  },
  DEALER: {
    id: 'usr-dealer-1',
    email: 'sales@ultratechoutlet.in',
    fullName: 'Suresh Agarwal (UltraTech Cement Depot)',
    phone: '+91 99888 77665',
    role: 'DEALER',
    isVerified: true,
    createdAt: '2025-10-05T10:00:00.000Z'
  },
  ADMIN: {
    id: 'usr-admin-1',
    email: 'admin@construction-os.io',
    fullName: 'Platform Ops Admin',
    phone: '+91 90000 00000',
    role: 'ADMIN',
    isVerified: true,
    createdAt: '2025-01-01T00:00:00.000Z'
  }
};

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileViewport: boolean;
  setIsMobileViewport: (val: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.HOMEOWNER);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'ntf-1',
      userId: 'usr-homeowner-1',
      title: 'Milestone Progress Updated',
      message: 'Apex Infra updated Ground & First Floor Superstructure to 72% completion with 1 new site photo.',
      type: 'MILESTONE',
      read: false,
      timestamp: '2026-08-14T14:31:00.000Z'
    },
    {
      id: 'ntf-2',
      userId: 'usr-homeowner-1',
      title: 'Material Order Delivered',
      message: 'UltraTech Cement Depot delivered 350 bags of Cement to Whitefield plot site.',
      type: 'DELIVERY',
      read: true,
      timestamp: '2026-08-11T10:46:00.000Z'
    }
  ]);

  const switchRole = (role: UserRole) => {
    const newUser = DEMO_USERS[role];
    setCurrentUser(newUser);
    if (role === 'HOMEOWNER') setActiveTab('dashboard');
    else if (role === 'BUILDER') setActiveTab('projects');
    else if (role === 'DEALER') setActiveTab('inventory');
    else if (role === 'ADMIN') setActiveTab('verifications');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        activeTab,
        setActiveTab,
        isMobileViewport,
        setIsMobileViewport,
        notifications,
        markNotificationRead,
        unreadCount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
