import React from 'react';
import { Modal } from './Modal';
import { Building2, Layers, CheckCircle2, AlertTriangle, ArrowRight, DollarSign, Clock, ShieldCheck } from 'lucide-react';

interface ProjectSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectSnapshotModal: React.FC<ProjectSnapshotModalProps> = ({ isOpen, onClose }) => {
  const snapshot = {
    name: 'Sharma Residence / Kumar Villa (4BHK)',
    location: 'Plot #42, Palm Meadows Enclave, Whitefield, Bengaluru',
    builtUpAreaSqFt: 2750,
    ownerName: 'Rajesh Kumar',
    contractorName: 'Apex Infrastructure & Builders (Vikram Singh)',
    contractValue: 4500000,
    paidAmount: 1820000,
    remainingAmount: 2680000,
    progress: 46,
    currentPhase: 'Ground & First Floor Superstructure',
    currentMilestone: 'Ground & First Floor Superstructure Shuttering & Masonry',
    nextMilestone: 'Electrical & Plumbing Rough-In Layout',
    expectedCompletion: '30 September 2027',
    healthStatus: 'HEALTHY',
    healthExplanation: 'Milestones on schedule with minor 2.1% material rate variance',
    whatHappensNext: 'Concrete pour schedule preparation for 1st floor roof slab casting on Friday.'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Truth Snapshot 📸">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Single Source of Truth</span>
              <h3 className="font-bold text-base text-white mt-0.5">{snapshot.name}</h3>
              <p className="text-xs text-slate-400">{snapshot.location} • {snapshot.builtUpAreaSqFt} Sq.Ft</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
              ● {snapshot.healthStatus}
            </span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl text-xs space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Health Explanation</span>
            <p className="text-slate-300">{snapshot.healthExplanation}</p>
          </div>
        </div>

        {/* Financial & Schedule Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-medium">Contract Value</span>
            <p className="font-bold text-slate-900 mt-0.5 font-tabular">₹{(snapshot.contractValue / 100000).toFixed(1)}L</p>
          </div>
          <div className="p-3 bg-emerald-50/70 rounded-xl">
            <span className="text-emerald-700 block font-medium">Paid to Date</span>
            <p className="font-bold text-emerald-800 mt-0.5 font-tabular">₹{(snapshot.paidAmount / 100000).toFixed(1)}L</p>
          </div>
          <div className="p-3 bg-blue-50/70 rounded-xl">
            <span className="text-blue-700 block font-medium">Remaining</span>
            <p className="font-bold text-blue-900 mt-0.5 font-tabular">₹{(snapshot.remainingAmount / 100000).toFixed(1)}L</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block font-medium">Target Completion</span>
            <p className="font-bold text-slate-900 mt-0.5">{snapshot.expectedCompletion}</p>
          </div>
        </div>

        {/* 🌟 WHAT HAPPENS NEXT? */}
        <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
            <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
            <span>WHAT HAPPENS NEXT?</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed pl-6 font-medium">
            {snapshot.whatHappensNext}
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Close Snapshot
          </button>
        </div>
      </div>
    </Modal>
  );
};
