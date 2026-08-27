import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { GitPullRequest, ArrowRight, CheckCircle2, DollarSign, Clock, AlertTriangle } from 'lucide-react';

interface ChangeImpactPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeImpactPreviewModal: React.FC<ChangeImpactPreviewModalProps> = ({ isOpen, onClose }) => {
  const [approved, setApproved] = useState(false);

  const preview = {
    title: 'Upgrade to Italian Bottochino Marble Flooring',
    before: {
      contractValue: 4500000,
      completionDate: '30 Sep 2027',
      scope: 'Standard Vitrified Tiles (800x800mm)'
    },
    after: {
      contractValue: 4620000,
      completionDate: '04 Oct 2027',
      scope: 'Italian Bottochino Marble (20mm Mirror Polish)'
    },
    costImpact: 120000,
    timelineImpactDays: 4
  };

  const handleApprove = () => {
    setApproved(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="No-Surprise Change Impact Preview">
      <div className="space-y-6">
        <div className="space-y-1 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
            <GitPullRequest className="w-4 h-4 text-amber-600" />
            <span>{preview.title}</span>
          </div>
          <p className="text-xs text-slate-500">Compare baseline terms vs revised project terms prior to approval</p>
        </div>

        {/* BEFORE vs AFTER Comparison Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* BEFORE */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CURRENT BASELINE</span>
            <div>
              <span className="text-slate-400 block font-medium">Contract Value</span>
              <p className="font-bold text-slate-900 font-tabular text-sm">₹{preview.before.contractValue.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Completion Date</span>
              <p className="font-bold text-slate-800">{preview.before.completionDate}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Scope Specification</span>
              <p className="font-medium text-slate-700">{preview.before.scope}</p>
            </div>
          </div>

          {/* AFTER */}
          <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3 text-xs">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">REVISED TERMS AFTER APPROVAL</span>
            <div>
              <span className="text-blue-700 block font-medium">Revised Contract Value</span>
              <p className="font-bold text-blue-900 font-tabular text-sm">+₹{preview.after.contractValue.toLocaleString('en-IN')} (+₹1.2L)</p>
            </div>
            <div>
              <span className="text-blue-700 block font-medium">Revised Completion Date</span>
              <p className="font-bold text-blue-900">{preview.after.completionDate} (+4 Days)</p>
            </div>
            <div>
              <span className="text-blue-700 block font-medium">Upgraded Scope</span>
              <p className="font-bold text-blue-950">{preview.after.scope}</p>
            </div>
          </div>
        </div>

        {approved ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Change request approved! Project Truth updated automatically.</span>
          </div>
        ) : (
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Reject Change
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Revised Terms</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
