import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  AlertTriangle,
  Layers,
  Wallet,
  FileText,
  Building2,
  Camera,
  GitPullRequest,
  ShieldCheck,
  Award,
  Home,
  FileSpreadsheet,
  Users,
  ShoppingCart,
  BarChart3,
  Clock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useAuth();

  const isBuilder = currentUser.role === 'BUILDER';
  const isAdmin = currentUser.role === 'ADMIN';

  const homeownerDomains = [
    {
      domain: 'Primary Control',
      items: [
        { id: 'dashboard', label: 'Owner Overview', icon: <Layers className="w-4 h-4" /> },
        { id: 'action-center', label: 'Action Required', icon: <AlertTriangle className="w-4 h-4" />, badge: '2' },
      ]
    },
    {
      domain: 'Work & Progress',
      items: [
        { id: 'progress-timeline', label: 'Construction Timeline', icon: <Clock className="w-4 h-4" /> },
        { id: 'journal', label: 'Digital Site Diary', icon: <Camera className="w-4 h-4" /> },
        { id: 'issues', label: 'Quality & Defects', icon: <ShieldCheck className="w-4 h-4" /> },
      ]
    },
    {
      domain: 'Financials & Money',
      items: [
        { id: 'financials', label: 'Budget & Disbursements', icon: <Wallet className="w-4 h-4" /> },
        { id: 'change-orders', label: 'Change Orders', icon: <GitPullRequest className="w-4 h-4" /> },
      ]
    },
    {
      domain: 'Records & Passport',
      items: [
        { id: 'documents', label: 'Document Vault', icon: <FileText className="w-4 h-4" /> },
        { id: 'handover', label: 'Digital Handover', icon: <Award className="w-4 h-4" /> },
        { id: 'home-passport', label: 'Home Passport 🏠', icon: <Home className="w-4 h-4" /> },
      ]
    }
  ];

  const builderDomains = [
    {
      domain: 'Site Command',
      items: [
        { id: 'projects', label: 'Contractor Dashboard', icon: <Building2 className="w-4 h-4" /> },
        { id: 'action-center', label: 'Pending Actions', icon: <AlertTriangle className="w-4 h-4" />, badge: '1' },
      ]
    },
    {
      domain: 'Estimation & Money',
      items: [
        { id: 'boq-estimation', label: 'BOQ & Estimation', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { id: 'budget-vs-actual', label: 'Budget vs Actual', icon: <Wallet className="w-4 h-4" /> },
        { id: 'procurement', label: 'Internal Procurement', icon: <ShoppingCart className="w-4 h-4" /> },
      ]
    },
    {
      domain: 'Site Execution & Team',
      items: [
        { id: 'journal', label: 'Site Diary & Reports', icon: <Camera className="w-4 h-4" /> },
        { id: 'team-roster', label: 'Labour & Specialists', icon: <Users className="w-4 h-4" /> },
        { id: 'issues', label: 'Quality Checkpoints', icon: <ShieldCheck className="w-4 h-4" /> },
      ]
    }
  ];

  const adminDomains = [
    {
      domain: 'Platform Ops',
      items: [
        { id: 'verifications', label: 'Verification Queue', icon: <ShieldCheck className="w-4 h-4" /> },
        { id: 'analytics', label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
      ]
    }
  ];

  let domains = homeownerDomains;
  if (isBuilder) domains = builderDomains;
  if (isAdmin) domains = adminDomains;

  return (
    <aside className={`w-64 min-h-[calc(100vh-4rem)] p-6 hidden md:block border-r transition-all ${
      isBuilder ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-slate-50/70 border-slate-200/60'
    }`}>
      {/* Workspace Role Badge */}
      <div className={`mb-6 px-4 py-3 rounded-2xl border transition-all ${
        isBuilder ? 'bg-slate-800/90 border-slate-700 text-white' : 'bg-white border-slate-100 shadow-2xs text-slate-900'
      }`}>
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Active Workspace</span>
        <p className="text-xs font-bold truncate mt-0.5">{currentUser.fullName}</p>
        <span className={`text-[11px] font-semibold block mt-0.5 ${isBuilder ? 'text-amber-400' : 'text-blue-600'}`}>
          {isBuilder ? '🏗️ Contractor OS' : isAdmin ? '🛡️ Platform Admin' : '🏡 House Owner OS'}
        </span>
      </div>

      <nav className="space-y-6">
        {domains.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 block mb-1.5 ${
              isBuilder ? 'text-slate-400' : 'text-slate-400'
            }`}>
              {group.domain}
            </span>

            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? isBuilder
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-white text-blue-700 shadow-2xs border border-slate-100 font-bold'
                      : isBuilder
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? (isBuilder ? 'text-slate-950' : 'text-blue-600') : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? isBuilder ? 'bg-slate-950 text-amber-400' : 'bg-rose-600 text-white'
                        : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};
