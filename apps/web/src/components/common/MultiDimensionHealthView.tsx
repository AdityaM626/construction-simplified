import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, DollarSign, Clock, FileText, CheckSquare } from 'lucide-react';

export const MultiDimensionHealthView: React.FC = () => {
  const healthBreakdown = {
    overall: 'HEALTHY' as const,
    explanation: 'Project execution is running on schedule with a minor 2.1% material rate variance.',
    dimensions: {
      schedule: { status: 'HEALTHY' as const, detail: '1st floor superstructure execution on track for 30 Sep target' },
      budget: { status: 'AT_RISK' as const, detail: 'Material unit prices experienced a 2.1% rate escalation' },
      quality: { status: 'HEALTHY' as const, detail: '2 quality inspection checkpoints PASSED with 0 open defects' },
      payments: { status: 'HEALTHY' as const, detail: '₹18.2L milestone disbursements paid up to date' },
      approvals: { status: 'AT_RISK' as const, detail: '1 pending Change Order awaiting homeowner approval' }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Health Analytics</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">5-Dimensional Project Health Breakdown</h1>
        <p className="text-xs text-slate-400">Multi-dimensional evaluation of Schedule, Budget, Quality, Payments, and Approvals</p>
      </div>

      {/* Overall Health Card with Explanation */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Overall Evaluated Status</span>
            <h2 className="text-2xl font-bold mt-0.5">🟢 HEALTHY</h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
            Weighted Score: 94 / 100
          </span>
        </div>
        <p className="text-xs text-slate-300 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 leading-relaxed">
          <b>Empirical Explanation:</b> {healthBreakdown.explanation}
        </p>
      </div>

      {/* 5-Dimension Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(healthBreakdown.dimensions).map(([key, dim]) => (
          <div key={key} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900 uppercase tracking-wider">{key}</span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                dim.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                ● {dim.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{dim.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
