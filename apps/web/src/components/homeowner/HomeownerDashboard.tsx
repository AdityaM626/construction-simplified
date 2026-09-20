import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChangeOrderApprovalModal } from './ChangeOrderApprovalModal';
import { ProjectSnapshotModal } from '../common/ProjectSnapshotModal';
import { ContextualChatModal } from '../common/ContextualChatModal';
import { Badge } from '../common/Badge';
import { useProject } from '../../context/ProjectContext';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  GitPullRequest,
  MessageSquare,
  FileText,
  DollarSign,
  Layers,
  ChevronRight,
  Camera
} from 'lucide-react';

export const HomeownerDashboard: React.FC = () => {
  const { setActiveTab } = useAuth();
  const { activeProjectId, projects } = useProject();
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [chatConfig, setChatConfig] = useState<{ isOpen: boolean; entityType: any; entityId: string; title: string }>({
    isOpen: false,
    entityType: 'PROJECT',
    entityId: 'prj-101',
    title: 'Project Discussion'
  });

  const project = projects.find(item => item.id === activeProjectId) || projects[0];
  if (!project) return <p className="text-sm text-slate-500">No project is assigned to this account yet.</p>;

  const contractValue = project.contractValue || project.totalBudget;
  const paidAmount = project.paidAmount || 0;
  const remainingContractValue = contractValue - paidAmount;

  const constructionPhases = [
    { num: 1, name: 'Planning', status: 'COMPLETED' },
    { num: 2, name: 'Design', status: 'COMPLETED' },
    { num: 3, name: 'Foundation', status: 'COMPLETED' },
    { num: 4, name: 'Structure', status: 'IN_PROGRESS' },
    { num: 5, name: 'Brickwork', status: 'UPCOMING' },
    { num: 6, name: 'Electrical & Plumbing', status: 'UPCOMING' },
    { num: 7, name: 'Flooring', status: 'UPCOMING' },
    { num: 8, name: 'Painting', status: 'UPCOMING' },
    { num: 9, name: 'Fixtures', status: 'UPCOMING' },
    { num: 10, name: 'Finishing', status: 'UPCOMING' },
    { num: 11, name: 'Inspection', status: 'UPCOMING' },
    { num: 12, name: 'Handover', status: 'UPCOMING' }
  ];

  const actionItems = [
    {
      id: 'cho-101',
      type: 'CHANGE_ORDER',
      title: 'Upgrade to Italian Marble Flooring in Master Living Room',
      impact: '+₹1,20,000 • +4 Days',
      actionText: 'Review & Approve Change Order',
      onClick: () => setShowChangeModal(true)
    },
    {
      id: 'mls-2',
      type: 'MILESTONE_APPROVAL',
      title: 'Ground & First Floor Superstructure Shuttering Approval',
      impact: 'Superstructure Phase • 72% Complete',
      actionText: 'Review Milestone & Approve',
      onClick: () => setActiveTab('connected-project')
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Calm Hero Greeting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Owner OS Dashboard</span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
              project.projectHealth === 'HEALTHY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              ● {project.projectHealth}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
          <p className="text-xs text-slate-400">{project.location} • Contractor: <b className="text-slate-700">{project.builderName}</b></p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowSnapshotModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200"
          >
            📸 Project Snapshot
          </button>
          <button
            onClick={() => setChatConfig({ isOpen: true, entityType: 'PROJECT', entityId: project.id, title: 'Contextual Project Discussion' })}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discuss</span>
          </button>
        </div>
      </div>

      {/* ⚠️ HIGH VISIBILITY ACTION REQUIRED PANEL */}
      {actionItems.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm">Action Required ({actionItems.length} Pending Approval)</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md">
              High Priority
            </span>
          </div>

          <div className="space-y-3">
            {actionItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-amber-100/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                  <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">{item.impact}</span>
                </div>
                <button
                  onClick={item.onClick}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs shrink-0"
                >
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Health Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Contract Value</span>
          <p className="text-2xl font-bold text-slate-900 font-tabular">
            ₹{(contractValue / 100000).toFixed(1)}L
          </p>
          <span className="text-[11px] text-slate-400 block">Baseline agreed budget</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Amount Paid to Date</span>
          <p className="text-2xl font-bold text-emerald-700 font-tabular">
            ₹{(paidAmount / 100000).toFixed(1)}L
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {((paidAmount / contractValue) * 100).toFixed(0)}% paid to contractor
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Remaining Contract Balance</span>
          <p className="text-2xl font-bold text-blue-600 font-tabular">
            ₹{(remainingContractValue / 100000).toFixed(1)}L
          </p>
          <span className="text-[11px] text-blue-600 font-medium block">Milestone-linked disbursements</span>
        </div>
      </div>

      {/* Visual 12-Phase Construction Timeline */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Construction Journey Timeline</h3>
            <p className="text-xs text-slate-400">Active Phase: <b>{project.currentPhase}</b></p>
          </div>
          <span className="text-xs font-bold text-blue-600">{project.completionPercentage}% Overall Complete</span>
        </div>

        {/* Phase Timeline Stepper */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {constructionPhases.map((phase) => (
            <div
              key={phase.num}
              className={`p-3 rounded-2xl text-center space-y-1 border transition-all ${
                phase.status === 'COMPLETED'
                  ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
                  : phase.status === 'IN_PROGRESS'
                  ? 'bg-blue-50 border-blue-200 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400'
              }`}
            >
              <span className="text-[10px] block opacity-70">Phase {phase.num}</span>
              <p className="text-xs truncate">{phase.name}</p>
            </div>
          ))}
        </div>
      </div>

      <ChangeOrderApprovalModal isOpen={showChangeModal} onClose={() => setShowChangeModal(false)} />
      <ProjectSnapshotModal isOpen={showSnapshotModal} onClose={() => setShowSnapshotModal(false)} />
      
      {chatConfig.isOpen && (
        <ContextualChatModal
          isOpen={chatConfig.isOpen}
          onClose={() => setChatConfig({ ...chatConfig, isOpen: false })}
          entityType={chatConfig.entityType}
          entityId={chatConfig.entityId}
          title={chatConfig.title}
        />
      )}
    </div>
  );
};
