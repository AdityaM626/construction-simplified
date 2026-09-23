import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChangeOrderApprovalModal } from '../homeowner/ChangeOrderApprovalModal';
import { AlertTriangle, CheckCircle2, Clock, ArrowRight, ShieldAlert, GitPullRequest, FileText } from 'lucide-react';

export const ActionCenterView: React.FC = () => {
  const { currentUser, setActiveTab } = useAuth();
  const [showChangeModal, setShowChangeModal] = useState(false);

  const actions = [
    {
      id: 'act-1',
      priority: 'CRITICAL' as const,
      title: 'Upgrade to Italian Marble Flooring in Master Living Room',
      description: 'Contractor submitted change order (+₹1,20,000 • +4 Days schedule impact). Approval required.',
      targetRole: 'HOMEOWNER',
      actionText: 'Review & Approve Change Order',
      onClick: () => setShowChangeModal(true)
    },
    {
      id: 'act-2',
      priority: 'HIGH' as const,
      title: 'Ground & First Floor Superstructure Shuttering Signoff',
      description: 'Contractor requested milestone review for 72% superstructure completion.',
      targetRole: 'HOMEOWNER',
      actionText: 'Review Milestone',
      onClick: () => setActiveTab('connected-project')
    },
    {
      id: 'act-3',
      priority: 'NORMAL' as const,
      title: 'Submit Daily Site Report for 27 Aug 2026',
      description: 'Site manager daily update due for 16 workers present on site.',
      targetRole: 'BUILDER',
      actionText: 'Submit Site Report',
      onClick: () => setActiveTab('projects')
    }
  ];

  const visibleActions = actions.filter(a => a.targetRole === currentUser?.role || currentUser?.role === 'ADMIN');

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Action Center</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Required Decisions & Tasks ({visibleActions.length})</h1>
        <p className="text-xs text-slate-400">Action items prioritized strictly by project criticality</p>
      </div>

      <div className="space-y-4">
        {visibleActions.map((act) => (
          <div
            key={act.id}
            className={`p-6 rounded-3xl border transition-all ${
              act.priority === 'CRITICAL' ? 'bg-rose-50/70 border-rose-200' :
              act.priority === 'HIGH' ? 'bg-amber-50/70 border-amber-200' :
              'bg-white border-slate-100 shadow-2xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase ${
                    act.priority === 'CRITICAL' ? 'bg-rose-600 text-white font-extrabold' :
                    act.priority === 'HIGH' ? 'bg-amber-600 text-white font-extrabold' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {act.priority} Priority
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{act.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
              </div>

              <button
                onClick={act.onClick}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 shrink-0 ${
                  act.priority === 'CRITICAL' ? 'bg-rose-600 hover:bg-rose-700 text-white' :
                  act.priority === 'HIGH' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
                  'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <span>{act.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ChangeOrderApprovalModal isOpen={showChangeModal} onClose={() => setShowChangeModal(false)} />
    </div>
  );
};
