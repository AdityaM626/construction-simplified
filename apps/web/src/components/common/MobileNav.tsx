import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  Building2,
  ShieldAlert,
  Layers,
  Users,
  AlertTriangle,
  Camera
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useAuth();

  const homeownerItems = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'action-center', label: 'Actions', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'connected-project', label: 'Workspace', icon: <Layers className="w-5 h-5" /> },
    { id: 'financials', label: 'Financials', icon: <Wallet className="w-5 h-5" /> },
    { id: 'journal', label: 'Site Diary', icon: <Camera className="w-5 h-5" /> },
  ];

  const builderItems = [
    { id: 'projects', label: 'Projects', icon: <Building2 className="w-5 h-5" /> },
    { id: 'action-center', label: 'Actions', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'connected-project', label: 'Project Hub', icon: <Layers className="w-5 h-5" /> },
    { id: 'team-roster', label: 'Team', icon: <Users className="w-5 h-5" /> },
  ];

  const adminItems = [
    { id: 'verifications', label: 'Verify', icon: <ShieldAlert className="w-5 h-5" /> },
  ];

  let items = homeownerItems;
  if (currentUser.role === 'BUILDER') items = builderItems;
  if (currentUser.role === 'ADMIN') items = adminItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 py-2 px-4 flex justify-around items-center shadow-lg md:hidden">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
