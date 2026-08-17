import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProjectOnboardingModal } from './ProjectOnboardingModal';
import { Badge } from '../common/Badge';
import { Plus, Wallet, CheckSquare, HardHat, TrendingUp, ArrowRight, ShieldCheck, Camera, ShoppingCart, Clock } from 'lucide-react';

export const HomeownerDashboard: React.FC = () => {
  const { setActiveTab } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Demo Homeowner project state
  const [project, setProject] = useState({
    id: 'prj-101',
    name: 'Kumar Dream Villa (4BHK)',
    type: 'NEW_CONSTRUCTION',
    location: 'Plot #42, Palm Meadows Enclave, Whitefield, Bengaluru',
    plotAreaSqFt: 2750,
    totalBudget: 4500000,
    spentCost: 1820000,
    committedCost: 850000,
    builderName: 'Apex Infrastructure & Builders',
    builderVerified: true,
    completionPercentage: 46,
    targetCompletionDate: '2027-03-31',
    status: 'IN_PROGRESS'
  });

  const remainingBudget = project.totalBudget - (project.spentCost + project.committedCost);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
            <Badge status={project.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">{project.location} • {project.plotAreaSqFt.toLocaleString('en-IN')} sq ft</p>
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Budget Allocation</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-tabular">₹{project.totalBudget.toLocaleString('en-IN')}</p>
          <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-2">
            <span>Target completion:</span>
            <span className="font-semibold text-slate-700">{project.targetCompletionDate}</span>
          </div>
        </div>

        {/* Spent Actuals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Actual Spent to Date</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-tabular">₹{project.spentCost.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-2 block">
            {((project.spentCost / project.totalBudget) * 100).toFixed(1)}% of total budget
          </span>
        </div>

        {/* Committed Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Committed Orders</span>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-tabular">₹{project.committedCost.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-2 block">Pending delivery verification</span>
        </div>

        {/* Remaining Uncommitted Budget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Remaining Budget</span>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-tabular">₹{remainingBudget.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-2 block">Available for finishing & materials</span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Overall Construction Completion</h3>
            <p className="text-xs text-slate-500">Superstructure phase active</p>
          </div>
          <span className="text-lg font-bold text-blue-600">{project.completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${project.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Active Builder & Latest Site Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Builder & Team Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Assigned Builder</h3>
            <Badge status="VERIFIED" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              A
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{project.builderName}</h4>
              <p className="text-xs text-slate-500">14 Years Exp • 4.9 ★ Rating</p>
              <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Business License & GST</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('builders')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
          >
            View Builder Details & Contract
          </button>
        </div>

        {/* Latest Verified Site Photo Update */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Latest Verified Site Update</h3>
            </div>
            <button
              onClick={() => setActiveTab('milestones')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View All Updates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80"
              alt="Site Progress Photo"
              className="w-full sm:w-48 h-32 object-cover rounded-xl border border-slate-200 shadow-2xs"
            />
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900">Ground & First Floor Superstructure</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">72% Completed</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "First floor column reinforcement completed and slab shuttering verified by structural engineer. Preparing concrete pour schedule."
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                <span>Posted by Vikram Singh</span>
                <span>•</span>
                <span>3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('budget')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-2xs"
        >
          <Wallet className="w-6 h-6 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">Budget Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-2xs"
        >
          <CheckSquare className="w-6 h-6 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">Milestones & Site</span>
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-2xs"
        >
          <ShoppingCart className="w-6 h-6 text-amber-600" />
          <span className="text-xs font-bold text-slate-800">Order Materials</span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-2xs"
        >
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800">Document Vault</span>
        </button>
      </div>

      {/* Project Onboarding Modal */}
      <ProjectOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onProjectCreated={(newPrj) => setProject({ ...project, ...newPrj })}
      />
    </div>
  );
};
