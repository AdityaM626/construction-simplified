import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  return <header className="flex items-center justify-between border-b bg-white px-6 py-4">
    <strong>Construction OS</strong>
    {currentUser && <div className="flex items-center gap-4 text-sm">
      <span>{currentUser.fullName} · {currentUser.role}</span>
      <button onClick={logout} className="font-semibold text-blue-700">Sign out</button>
    </div>}
  </header>;
};
