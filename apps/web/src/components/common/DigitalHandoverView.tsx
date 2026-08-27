import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, FileText, Lock, Award, DollarSign } from 'lucide-react';

export const DigitalHandoverView: React.FC = () => {
  const [signedByOwner, setSignedByOwner] = useState(false);

  const handover = {
    id: 'hnd-101',
    handoverDate: '2027-03-31',
    finalContractValue: 4620000,
    finalAmountPaid: 1820000,
    outstandingBalance: 2800000,
    openDefectsCount: 0,
    isFinalInspectionPassed: true,
    contractorConfirmed: true,
    documentsBundle: [
      { name: 'Architectural Structural Blueprints (As-Built)', category: 'DRAWING' },
      { name: '10-Year Waterproofing Warranty Certification', category: 'WARRANTY' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Lifecycle Completion</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Digital Handover Center</h1>
        <p className="text-xs text-slate-400">Final inspection signoff, financial settlement & handover document transfer</p>
      </div>

      {/* Handover Status Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <h3 className="font-bold text-lg">Project Completion & Handover Readiness</h3>
              <p className="text-xs text-slate-400">Scheduled Handover Date: <b>{handover.handoverDate}</b></p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
            Final Inspection Passed
          </span>
        </div>
      </div>

      {/* Financial Settlement Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Final Financial Settlement</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <span className="text-slate-400 block font-medium">Final Revised Contract</span>
            <p className="text-lg font-bold text-slate-900 font-tabular">₹{handover.finalContractValue.toLocaleString('en-IN')}</p>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl space-y-1">
            <span className="text-emerald-700 block font-medium">Total Paid to Date</span>
            <p className="text-lg font-bold text-emerald-800 font-tabular">₹{handover.finalAmountPaid.toLocaleString('en-IN')}</p>
          </div>

          <div className="p-4 bg-blue-50/70 rounded-2xl space-y-1">
            <span className="text-blue-700 block font-medium">Outstanding Balance at Handover</span>
            <p className="text-lg font-bold text-blue-900 font-tabular">₹{handover.outstandingBalance.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Document Bundle */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Handover Document Bundle ({handover.documentsBundle.length} Files)</h3>

        <div className="space-y-2">
          {handover.documentsBundle.map((doc, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900">{doc.name}</span>
              </div>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md uppercase">{doc.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Digital Signoff */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Dual Digital Signoff Confirmation</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-emerald-800 block">✓ Contractor Signature Verified</span>
            <p className="text-[11px] text-emerald-700">Apex Infrastructure & Builders (Signed on 27 Aug 2026)</p>
          </div>

          <div className={`p-4 rounded-2xl text-xs space-y-2 border ${
            signedByOwner ? 'bg-emerald-50/60 border-emerald-100' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="font-bold text-slate-900 block">
              {signedByOwner ? '✓ Homeowner Signature Verified' : 'Pending Homeowner Digital Signoff'}
            </span>
            {!signedByOwner && (
              <button
                onClick={() => setSignedByOwner(true)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-2xs"
              >
                Confirm Digital Handover Signoff
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
