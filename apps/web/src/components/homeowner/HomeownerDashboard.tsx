import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProjectOnboardingModal } from './ProjectOnboardingModal';
import { Plus, ArrowRight, ShieldCheck, CheckCircle2, Wallet, ShoppingCart, CheckSquare, FileText } from 'lucide-react';

export const HomeownerDashboard: React.FC = () => {
  const { setActiveTab } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [project] = useState({
    name: 'Sharma Residence / Kumar Villa (4BHK)',
    location: 'Plot #42, Palm Meadows Enclave, Whitefield, Bengaluru',
    totalBudget: 4500000,
    spentCost: 1820000,
    committedCost: 850000,
    builderName: 'Apex Infrastructure & Builders',
    completionPercentage: 46,
    targetCompletionDate: '2027-03-31'
  });

  const remainingBudget = project.totalBudget - (project.spentCost + project.committedCost);

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Calm Hero Greeting */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Project Overview</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
        <p className="text-xs text-slate-400">{project.location} • Target Completion: {project.targetCompletionDate}</p>
      </div>

      {/* 3 Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Spent / Budget</span>
          <p className="text-2xl font-bold text-slate-900 font-tabular">
            ₹{(project.spentCost / 100000).toFixed(1)}L <span className="text-slate-300 font-normal text-lg">/ ₹{(project.totalBudget / 100000).toFixed(0)}L</span>
          </p>
          <span className="text-[11px] text-emerald-600 font-medium block">
            {((project.spentCost / project.totalBudget) * 100).toFixed(0)}% budget utilized
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Overall Construction</span>
          <p className="text-2xl font-bold text-blue-600 font-tabular">{project.completionPercentage}%</p>
          <span className="text-[11px] text-slate-400 block">Superstructure phase active</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Assigned Contractor</span>
          <p className="text-sm font-bold text-slate-900 truncate mt-1">{project.builderName}</p>
          <span className="text-[11px] text-emerald-600 font-semibold block flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified Builder (14 Yrs Exp)</span>
          </span>
        </div>
      </div>

      {/* Clean Progress Bar Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Construction Milestone Progress</h3>
          <span className="text-xs text-blue-600 font-bold">{project.completionPercentage}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${project.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 4 Clean Workspace Navigation Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('connected-project')}
          className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs text-left space-y-2 transition-all"
        >
          <CheckSquare className="w-5 h-5 text-blue-600" />
          <div>
            <span className="text-xs font-bold text-slate-900 block">Connected Hub</span>
            <span className="text-[11px] text-slate-400 block">View 3-role views</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs text-left space-y-2 transition-all"
        >
          <Wallet className="w-5 h-5 text-emerald-600" />
          <div>
            <span className="text-xs font-bold text-slate-900 block">Budget Ledger</span>
            <span className="text-[11px] text-slate-400 block">View expenses</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs text-left space-y-2 transition-all"
        >
          <ShoppingCart className="w-5 h-5 text-amber-600" />
          <div>
            <span className="text-xs font-bold text-slate-900 block">Materials</span>
            <span className="text-[11px] text-slate-400 block">Marketplace</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-2xs text-left space-y-2 transition-all"
        >
          <FileText className="w-5 h-5 text-indigo-600" />
          <div>
            <span className="text-xs font-bold text-slate-900 block">Documents</span>
            <span className="text-[11px] text-slate-400 block">Vault & files</span>
          </div>
        </button>
      </div>

      <ProjectOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onProjectCreated={() => {}}
      />
    </div>
  );
};
