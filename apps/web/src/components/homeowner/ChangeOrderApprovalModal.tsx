import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { GitPullRequest, CheckCircle2, XCircle, ArrowRight, DollarSign, Clock, AlertTriangle } from 'lucide-react';

interface ChangeOrderApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeOrderApprovalModal: React.FC<ChangeOrderApprovalModalProps> = ({ isOpen, onClose }) => {
  const [approved, setApproved] = useState(false);

  const changeReq = {
    id: 'cho-101',
    title: 'Upgrade to Italian Marble Flooring in Master Living Room',
    description: 'Owner requested upgrade from standard vitrified tiles to premium Italian Bottochino marble.',
    originalScope: 'Vitrified Tiles (800x800mm)',
    proposedChange: 'Italian Bottochino Marble (20mm)',
    costImpact: 120000,
    timelineImpactDays: 4,
    requestedBy: 'Rajesh Kumar',
    status: approved ? 'APPROVED' : 'PENDING'
  };

  const handleApprove = () => {
    setApproved(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Change Order Request">
      <div className="space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-slate-900">{changeReq.title}</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{changeReq.description}</p>
        </div>

        {/* Scope Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1 text-xs">
            <span className="text-slate-400 block font-semibold">Original Contract Scope</span>
            <p className="font-bold text-slate-700">{changeReq.originalScope}</p>
          </div>
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1 text-xs">
            <span className="text-blue-600 block font-bold">Proposed Change Scope</span>
            <p className="font-bold text-blue-900">{changeReq.proposedChange}</p>
          </div>
        </div>

        {/* Financial & Timeline Impact */}
        <div className="grid grid-cols-2 gap-4 bg-slate-900 text-white p-5 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 block">Cost Impact</span>
            <p className="text-xl font-bold text-emerald-400 font-tabular mt-0.5">+₹{changeReq.costImpact.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-slate-400 block">Schedule Impact</span>
            <p className="text-xl font-bold text-amber-400 mt-0.5">+{changeReq.timelineImpactDays} Days</p>
          </div>
        </div>

        {approved ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Change order approved! Project contract value updated by +₹1,20,000.</span>
          </div>
        ) : (
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Reject Change
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Change Order</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
