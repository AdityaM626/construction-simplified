import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DailySiteReportModal } from './DailySiteReportModal';
import { Badge } from '../common/Badge';
import { useProject } from '../../context/ProjectContext';
import {
  Building2,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Plus,
  ClipboardList,
  Wallet,
  Users,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

export const BuilderDashboard: React.FC = () => {
  const { setActiveTab } = useAuth();
  const { projects } = useProject();
  const [showDailyReportModal, setShowDailyReportModal] = useState(false);

  const activeProjects = projects.map(project => ({
    ...project,
    owner: project.homeownerName || 'Homeowner',
    progress: project.completionPercentage || 0,
    contractValue: project.contractValue || project.totalBudget,
    projectHealth: project.projectHealth || 'HEALTHY',
    activeMilestone: project.currentPhase || 'Planning'
  }));

  const todaysTasks = [
    { id: 'tsk-1', title: 'Verify 1st floor column shuttering alignment', trade: 'Masonry', priority: 'HIGH', status: 'IN_PROGRESS' },
    { id: 'tsk-2', title: 'Confirm 350 cement bag delivery receipt', trade: 'Logistics', priority: 'MEDIUM', status: 'COMPLETED' },
    { id: 'tsk-3', title: 'Submit Daily Site Report for homeowner review', trade: 'Site Ops', priority: 'HIGH', status: 'IN_PROGRESS' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Contractor OS Workspace</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Apex Infrastructure & Builders</h1>
          <p className="text-xs text-slate-400">1 Active Construction Site • 16 Active Site Workers</p>
        </div>

        <button
          onClick={() => setShowDailyReportModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-2 shrink-0"
        >
          <ClipboardList className="w-4 h-4" />
          <span>Submit Daily Site Report</span>
        </button>
      </div>

      {/* Operational Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Active Projects</span>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{activeProjects.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium block">100% on schedule</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Today's Tasks</span>
          <p className="text-2xl font-bold text-blue-600 font-tabular">3</p>
          <span className="text-[11px] text-slate-400 block">1 completed • 2 in progress</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Pending Owner Approvals</span>
          <p className="text-2xl font-bold text-amber-600 font-tabular">1</p>
          <span className="text-[11px] text-amber-600 font-medium block">Italian Marble Change Order</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Open Defects</span>
          <p className="text-2xl font-bold text-slate-900 font-tabular">0</p>
          <span className="text-[11px] text-emerald-600 font-medium block">All defects resolved</span>
        </div>
      </div>

      {/* TODAY'S WORK AREA */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Today's Work Execution Checklist</h3>
          </div>
          <span className="text-xs text-slate-400">27 Aug 2026</span>
        </div>

        <div className="space-y-2">
          {todaysTasks.map((t) => (
            <div key={t.id} className="p-3.5 bg-slate-50/70 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <span className={`w-2.5 h-2.5 rounded-full ${t.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className={`font-semibold ${t.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{t.title}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-md">
                {t.trade}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIVE PROJECTS LIST */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Active Construction Site</h3>

        {activeProjects.map((prj) => (
          <div key={prj.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-slate-900">{prj.name}</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-100">
                    ● {prj.projectHealth}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Owner: <b className="text-slate-700">{prj.owner}</b> • {prj.location}</p>
              </div>
              <span className="text-lg font-bold text-slate-900 font-tabular">₹{(prj.contractValue / 100000).toFixed(1)}L</span>
            </div>

            <div className="p-5 bg-slate-50/70 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-600">Active Milestone: <b>{prj.activeMilestone}</b></span>
                <span className="text-blue-600 font-bold">{prj.progress}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${prj.progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                onClick={() => setActiveTab('boq-estimation')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-100 space-y-1 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 block">BOQ & Estimate</span>
              </button>

              <button
                onClick={() => setActiveTab('budget-vs-actual')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-100 space-y-1 transition-all"
              >
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 block">Budget vs Actual</span>
              </button>

              <button
                onClick={() => setActiveTab('procurement')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-100 space-y-1 transition-all"
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-900 block">Procurement Log</span>
              </button>

              <button
                onClick={() => setActiveTab('connected-project')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-100 space-y-1 transition-all"
              >
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-900 block">Project Hub</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <DailySiteReportModal isOpen={showDailyReportModal} onClose={() => setShowDailyReportModal(false)} />
    </div>
  );
};
