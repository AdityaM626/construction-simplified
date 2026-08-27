import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  CheckSquare,
  FileSpreadsheet,
  Users,
  FileText,
  AlertTriangle,
  GitPullRequest,
  CreditCard,
  Building2,
  Layers,
  BookOpen,
  ClipboardList,
  ShieldAlert,
  BarChart3,
  Search,
  ShoppingCart
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useAuth();

  const homeownerItems = [
    { id: 'dashboard', label: 'Owner Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'connected-project', label: 'Project Workspace', icon: <Layers className="w-4 h-4" /> },
    { id: 'progress-timeline', label: 'Construction Progress', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'financials', label: 'Financials & Budget', icon: <Wallet className="w-4 h-4" /> },
    { id: 'change-orders', label: 'Change Orders', icon: <GitPullRequest className="w-4 h-4" /> },
    { id: 'issues', label: 'Issues & Defects', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'documents', label: 'Document Vault', icon: <FileText className="w-4 h-4" /> },
    { id: 'team-roster', label: 'Contractor & Team', icon: <Users className="w-4 h-4" /> },
  ];

  const builderItems = [
    { id: 'projects', label: 'Contractor Dashboard', icon: <Building2 className="w-4 h-4" /> },
    { id: 'boq-estimation', label: 'BOQ & Estimation', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'budget-vs-actual', label: 'Budget vs Actual', icon: <Wallet className="w-4 h-4" /> },
    { id: 'team-roster', label: 'Labour & Team Roster', icon: <Users className="w-4 h-4" /> },
    { id: 'procurement', label: 'Internal Procurement', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'issues', label: 'Quality & Defects', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'connected-project', label: 'Project Hub', icon: <Layers className="w-4 h-4" /> },
  ];

  const adminItems = [
    { id: 'verifications', label: 'Verification Queue', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'analytics', label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  let items = homeownerItems;
  if (currentUser.role === 'BUILDER') items = builderItems;
  if (currentUser.role === 'ADMIN') items = adminItems;

  return (
    <aside className="w-64 bg-slate-50/50 border-r border-slate-200/60 min-h-[calc(100vh-4rem)] p-6 hidden md:block">
      <div className="mb-6 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-2xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Workspace</span>
        <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{currentUser.fullName}</p>
        <span className="text-[11px] text-blue-600 font-semibold">
          {currentUser.role === 'BUILDER' ? 'Contractor Partner' : currentUser.role === 'HOMEOWNER' ? 'House Owner' : 'Platform Admin'}
        </span>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-100 font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
