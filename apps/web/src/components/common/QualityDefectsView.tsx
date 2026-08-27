import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Wrench, XCircle, Clock, DollarSign } from 'lucide-react';

export const QualityDefectsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'checkpoints' | 'defects'>('checkpoints');

  const qualityCheckpoints = [
    {
      id: 'qcp-101',
      title: 'Foundation RCC Slab Shuttering & Rebar Spacing Inspection',
      category: 'REBAR_SPACING',
      status: 'PASS',
      inspectorName: 'Ananya Roy (Lead Structural Engineer)',
      inspectionDate: '2026-03-10',
      notes: 'Rebar spacing verified at 150mm c/c with cover blocks inserted.'
    },
    {
      id: 'qcp-102',
      title: 'Underground Sump Waterproofing Application Test',
      category: 'WATERPROOFING',
      status: 'PASS',
      inspectorName: 'Suresh Babu (Senior Quality Auditor)',
      inspectionDate: '2026-04-15',
      notes: '2-coat Dr. Fixit chemical application verified. 48-hr ponding leak test passed.'
    }
  ];

  const defects = [
    {
      id: 'def-101',
      title: 'Hairline shrinkage crack near East Boundary footing PCC',
      description: 'Minor thermal shrinkage crack observed after initial foundation curing.',
      defectType: 'CRACK',
      location: 'Grid A-4 East Boundary Footing',
      severity: 'LOW',
      responsibleTrade: 'Masonry & Concreting',
      reworkTimeDays: 1,
      reworkCost: 8500,
      status: 'VERIFIED_CLOSED',
      discoveredDate: '2026-03-14',
      resolvedDate: '2026-03-15'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Quality Control</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quality Checkpoints & Defect Tracker</h1>
          <p className="text-xs text-slate-400">Record formal quality inspections and measure rework time & cost</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('checkpoints')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'checkpoints' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            Quality Checkpoints
          </button>
          <button
            onClick={() => setActiveSubTab('defects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'defects' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            Defects & Rework Log
          </button>
        </div>
      </div>

      {activeSubTab === 'checkpoints' ? (
        <div className="space-y-4">
          {qualityCheckpoints.map((q) => (
            <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                    {q.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{q.title}</h3>
                  <p className="text-xs text-slate-400">Inspector: <b>{q.inspectorName}</b> • {q.inspectionDate}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  ✓ {q.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">{q.notes}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {defects.map((d) => (
            <div key={d.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900">{d.title}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase">
                      {d.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Location: <b>{d.location}</b> • Trade: {d.responsibleTrade}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  {d.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Rework Time Impact</span>
                  <p className="font-bold text-slate-900 mt-0.5">{d.reworkTimeDays} Day(s)</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Rework Cost Impact</span>
                  <p className="font-bold text-rose-600 mt-0.5 font-tabular">₹{d.reworkCost.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
