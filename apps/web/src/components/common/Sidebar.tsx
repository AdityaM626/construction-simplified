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
  Building2,
  Layers,
  ShieldCheck,
  Award,
  Home,
  BarChart3,
  ShoppingCart,
  Clock,
  Camera,
  CheckCircle2,
  Activity
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useAuth();

  const homeownerItems = [
    { id: 'dashboard', label: 'Owner Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'action-center', label: 'Action Center', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'health-breakdown', label: '5D Health Breakdown', icon: <Activity className="w-4 h-4" /> },
    { id: 'connected-project', label: 'Project Workspace', icon: <Layers className="w-4 h-4" /> },
    { id: 'journal', label: 'Digital Site Diary', icon: <Camera className="w-4 h-4" /> },
    { id: 'activity-stream', label: 'Activity Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'financials', label: 'Financials & Budget', icon: <Wallet className="w-4 h-4" /> },
    { id: 'change-orders', label: 'Change Orders', icon: <GitPullRequest className="w-4 h-4" /> },
    { id: 'issues', label: 'Quality & Defects', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'documents', label: 'Document Vault', icon: <FileText className="w-4 h-4" /> },
    { id: 'handover', label: 'Digital Handover', icon: <Award className="w-4 h-4" /> },
    { id: 'home-passport', label: 'Home Passport 🏠', icon: <Home className="w-4 h-4" /> },
  ];

  const builderItems = [
    { id: 'projects', label: 'Contractor Dashboard', icon: <Building2 className="w-4 h-4" /> },
    { id: 'action-center', label: 'Action Center', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'boq-estimation', label: 'BOQ & Estimation', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'budget-vs-actual', label: 'Budget vs Actual', icon: <Wallet className="w-4 h-4" /> },
    { id: 'journal', label: 'Digital Site Diary', icon: <Camera className="w-4 h-4" /> },
    { id: 'team-roster', label: 'Labour & Team Roster', icon: <Users className="w-4 h-4" /> },
    { id: 'procurement', label: 'Internal Procurement', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'issues', label: 'Quality & Defects', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'analytics-view', label: 'Contractor Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'connected-project', label: 'Project Hub', icon: <Layers className="w-4 h-4" /> },
  ];

  const adminItems = [
    { id: 'verifications', label: 'Verification Queue', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'analytics', label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  let items = homeownerItems;
  if (currentUser.role === 'BUILDER') items = builderItems;
  if (currentUser.role === 'ADMIN') items = adminItems;
  const isBuilder = currentUser.role === 'BUILDER';

  return (
    <aside className={`w-64 border-r min-h-[calc(100vh-4rem)] p-6 hidden md:block ${isBuilder ? 'bg-amber-50/60 border-amber-100' : 'bg-blue-50/40 border-blue-100'}`}>
      <div className={`mb-6 px-4 py-3 bg-white rounded-2xl border shadow-sm ${isBuilder ? 'border-amber-200' : 'border-blue-100'}`}>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Workspace</span>
        <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{currentUser.fullName}</p>
        <span className={`text-[11px] font-semibold ${isBuilder ? 'text-amber-700' : 'text-blue-700'}`}>
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
                  ? isBuilder ? 'bg-amber-500 text-white shadow-sm border border-amber-500 font-bold' : 'bg-blue-600 text-white shadow-sm border border-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span className={isActive ? 'text-white' : isBuilder ? 'text-amber-600' : 'text-blue-500'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
