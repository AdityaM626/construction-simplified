import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProjectSwitcher } from './ProjectSwitcher';
import { AuthModal } from './AuthModal';
import { Building2, Bell, Search, ShieldCheck, UserCheck, LogOut, KeyRound } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, switchRole, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Platform Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-extrabold text-sm shadow-xs">
            COS
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm tracking-tight block">Construction OS</span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">Owner ↔ Contractor Workspace</span>
          </div>
        </div>

        {/* Central Search & Project Switcher */}
        <div className="flex items-center space-x-3 flex-1 max-w-md justify-center">
          <ProjectSwitcher />

          <div className="relative w-48 hidden lg:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search project..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Role Switcher & User Session Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs">
            <button
              onClick={() => switchRole('HOMEOWNER')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                currentUser.role === 'HOMEOWNER'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => switchRole('BUILDER')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                currentUser.role === 'BUILDER'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Contractor
            </button>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60 flex items-center space-x-1.5 text-xs font-bold"
            title="Sign In / Register Account"
          >
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          <button
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
