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

  const roleIcons: Record<UserRole, React.ReactNode> = {
    HOMEOWNER: <User className="w-4 h-4" />,
    BUILDER: <HardHat className="w-4 h-4" />,
    DEALER: <Store className="w-4 h-4" />,
    ADMIN: <ShieldCheck className="w-4 h-4" />
  };

  return (
    <>
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Project Switcher */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-sm shrink-0">
                C
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-base tracking-tight text-white block">Construction OS</span>
                <span className="text-[10px] text-slate-400 font-medium block">Pre-Audit Production State</span>
              </div>
              <div className="pl-2 border-l border-slate-800">
                <ProjectSwitcher />
              </div>
            </div>

            {/* Persona Switcher Bar */}
            <div className="hidden md:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              {(Object.keys(DEMO_USERS) as UserRole[]).map((role) => {
                const active = currentUser.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {roleIcons[role]}
                    <span>{role === 'DEALER' ? 'SHOPKEEPER' : role === 'BUILDER' ? 'CONTRACTOR' : role}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Global Search Button */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center space-x-1.5 text-xs font-medium"
                title="Global Search (Projects, Materials, Orders)"
              >
                <Search className="w-4 h-4 text-slate-300" />
                <span className="hidden lg:inline">Search...</span>
              </button>

              {/* Viewport Mode Switcher */}
              <button
                onClick={() => setIsMobileViewport(!isMobileViewport)}
                title={isMobileViewport ? "Switch to Desktop view" : "Switch to Mobile App Preview"}
                className={`p-2 rounded-xl text-xs font-medium flex items-center space-x-1 border transition-colors ${
                  isMobileViewport
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isMobileViewport ? <Smartphone className="w-4 h-4 text-amber-400" /> : <Monitor className="w-4 h-4 text-slate-300" />}
                <span className="hidden sm:inline">{isMobileViewport ? 'Mobile View' : 'Desktop View'}</span>
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 relative transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
                  )}
                </button>

                {/* Notification Popover */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-sm">Notifications</h4>
                      <span className="text-xs text-slate-500 font-medium">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-center text-xs text-slate-400">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !n.read ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                              {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Current User Pill */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/30">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold leading-tight">{currentUser.fullName}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">
                      {currentUser.role === 'DEALER' ? 'SHOPKEEPER' : currentUser.role === 'BUILDER' ? 'CONTRACTOR' : currentUser.role}
                    </span>
                    {currentUser.isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
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
