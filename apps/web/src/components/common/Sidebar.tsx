import React from 'react';
import {
  AlertTriangle, Award, BarChart3, Building2, Camera, Clock,
  FileSpreadsheet, FileText, GitPullRequest, Home, Layers,
  ShieldCheck, ShoppingCart, Users, Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { navigationFor, type NavigationIcon } from '../../navigation';

const icons: Record<NavigationIcon, React.ElementType> = {
  overview: Layers,
  actions: AlertTriangle,
  timeline: Clock,
  site: Camera,
  quality: ShieldCheck,
  money: Wallet,
  changes: GitPullRequest,
  documents: FileText,
  handover: Award,
  home: Home,
  boq: FileSpreadsheet,
  procurement: ShoppingCart,
  team: Users,
  analytics: BarChart3,
  verification: Building2,
};

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useAuth();
  const isBuilder = currentUser.role === 'BUILDER';
  const groups = navigationFor(currentUser.role);

  return (
    <aside className={`w-64 min-h-[calc(100vh-4rem)] p-6 hidden md:block border-r ${
      isBuilder ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-slate-50/70 border-slate-200/60'
    }`}>
      <div className={`mb-6 px-4 py-3 rounded-2xl border ${
        isBuilder ? 'bg-slate-800/90 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'
      }`}>
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Active workspace</span>
        <p className="text-xs font-bold truncate mt-0.5">{currentUser.fullName}</p>
        <span className={`text-[11px] font-semibold block mt-0.5 ${isBuilder ? 'text-amber-400' : 'text-blue-600'}`}>
          {isBuilder ? 'Builder / contractor' : currentUser.role === 'ADMIN' ? 'Platform admin' : 'Homeowner'}
        </span>
      </div>

      <nav aria-label="Workspace" className="space-y-6">
        {groups.map(group => (
          <div key={group.label} className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 block mb-1.5 text-slate-400">
              {group.label}
            </span>
            {group.items.map(item => {
              const Icon = icons[item.icon];
              const selected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={selected ? 'page' : undefined}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    selected
                      ? isBuilder ? 'bg-amber-500 text-slate-950' : 'bg-white text-blue-700 border border-slate-100'
                      : isBuilder ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};
