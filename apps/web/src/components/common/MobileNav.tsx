import React from 'react';
import { AlertTriangle, Camera, Clock, FileSpreadsheet, Layers, ShieldCheck, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { navigationFor, type NavigationIcon } from '../../navigation';

const icons: Partial<Record<NavigationIcon, React.ElementType>> = {
  overview: Layers,
  actions: AlertTriangle,
  timeline: Clock,
  site: Camera,
  money: Wallet,
  boq: FileSpreadsheet,
  analytics: Layers,
  verification: ShieldCheck,
};

export const MobileNav: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useAuth();
  const items = navigationFor(currentUser.role).flatMap(group => group.items).filter(item => item.mobile);

  return (
    <nav aria-label="Mobile workspace" className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 py-2 px-4 flex justify-around items-center shadow-lg md:hidden">
      {items.map(item => {
        const Icon = icons[item.icon] ?? Layers;
        const selected = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={selected ? 'page' : undefined}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 min-w-0 text-center ${
              selected ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px] truncate max-w-20">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
