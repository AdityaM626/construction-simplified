import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProjectSwitcher } from './ProjectSwitcher';
import { GlobalSearchModal } from './GlobalSearchModal';
import { Layers, Search, Bell, Smartphone, Monitor, ShieldCheck, UserCheck, HardHat } from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { currentUser, switchRole, isMobileViewport, setIsMobileViewport } = useAuth();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);

  const notifications = [
    { id: '1', title: 'Daily Site Report Submitted', time: '10 min ago', unread: true },
    { id: '2', title: 'Change Request: Italian Marble (+₹1.2L)', time: '2 hours ago', unread: true },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Project Switcher */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-xs">
              COS
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight block">Construction OS</span>
              <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">Owner ↔ Contractor Hub</span>
            </div>
          </div>

          <div className="hidden sm:block border-l border-slate-200 pl-6">
            <ProjectSwitcher />
          </div>
        </div>

        {/* Center / Right Header Tools */}
        <div className="flex items-center space-x-3">
          {/* Quick Search */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-500 rounded-xl text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline font-medium">Search project...</span>
            <kbd className="hidden lg:inline text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-400">⌘K</kbd>
          </button>

          {/* Role Switcher Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => switchRole('HOMEOWNER')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                currentUser.role === 'HOMEOWNER'
                  ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Owner</span>
            </button>
            <button
              onClick={() => switchRole('BUILDER')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                currentUser.role === 'BUILDER'
                  ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Contractor</span>
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationPopover(!showNotificationPopover)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            {showNotificationPopover && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900">Project Notifications</h4>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">2 New</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl text-xs space-y-0.5 transition-colors cursor-pointer">
                      <p className="font-bold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </header>
  );
};
