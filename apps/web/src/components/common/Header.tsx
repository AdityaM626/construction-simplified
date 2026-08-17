import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, Bell, Smartphone, Monitor, HardHat, Store, User, CheckCircle2, Search } from 'lucide-react';
import { ProjectSwitcher } from './ProjectSwitcher';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Header: React.FC = () => {
  const { currentUser, switchRole, isMobileViewport, setIsMobileViewport, notifications, markNotificationRead, unreadCount } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const roleLabels: Record<UserRole, string> = {
    HOMEOWNER: 'House Owner',
    BUILDER: 'Contractor',
    DEALER: 'Shopkeeper',
    ADMIN: 'Platform Admin'
  };

  return (
    <>
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Active Project */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-base text-white shadow-xs">
                  C
                </div>
                <span className="font-bold text-base tracking-tight text-white hidden sm:inline-block">Construction OS</span>
              </div>
              <div className="h-5 w-px bg-slate-800 hidden sm:block" />
              <ProjectSwitcher />
            </div>

            {/* Role Switcher Pills */}
            <div className="hidden lg:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              {(Object.keys(DEMO_USERS) as UserRole[]).map((role) => {
                const active = currentUser.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      active
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium'
                    }`}
                  >
                    {roleLabels[role]}
                  </button>
                );
              })}
            </div>

            {/* Action Tools */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-slate-300 border border-slate-700/60 transition-colors flex items-center space-x-2 text-xs font-medium"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline text-slate-300">Search...</span>
              </button>

              <button
                onClick={() => setIsMobileViewport(!isMobileViewport)}
                title={isMobileViewport ? "Switch to Desktop view" : "Switch to Mobile App Preview"}
                className={`p-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 border transition-colors ${
                  isMobileViewport
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700/80'
                }`}
              >
                {isMobileViewport ? <Smartphone className="w-4 h-4 text-amber-400" /> : <Monitor className="w-4 h-4 text-slate-400" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/80 relative transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-slate-900" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in duration-150">
                    <div className="px-5 py-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Notifications</h4>
                      <span className="text-xs text-blue-600 font-semibold">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="px-5 py-6 text-center text-xs text-slate-400">No new notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !n.read ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-bold text-xs text-slate-900">{n.title}</span>
                              {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="flex items-center space-x-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
};
