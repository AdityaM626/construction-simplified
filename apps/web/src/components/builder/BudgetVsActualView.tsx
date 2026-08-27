import React from 'react';
import { Wallet, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

export const BudgetVsActualView: React.FC = () => {
  const records = [
    { category: 'MATERIALS', estimatedAmount: 2200000, actualSpent: 1050000, varianceAmount: -1150000, variancePercentage: -52.2, notes: 'Procurement on track for superstructure phase' },
    { category: 'LABOUR', estimatedAmount: 1400000, actualSpent: 570000, varianceAmount: -830000, variancePercentage: -59.2, notes: 'Masonry and shuttering team weekly disbursements' },
    { category: 'EQUIPMENT', estimatedAmount: 400000, actualSpent: 120000, varianceAmount: -280000, variancePercentage: -70.0, notes: 'JCB excavation and concrete mixer rentals' },
    { category: 'LOGISTICS', estimatedAmount: 250000, actualSpent: 80000, varianceAmount: -170000, variancePercentage: -68.0, notes: 'Material transport & unloading charges' },
    { category: 'DESIGN', estimatedAmount: 250000, actualSpent: 0, varianceAmount: -250000, variancePercentage: -100.0, notes: 'Architect elevation design & structural signoff' }
  ];

  const totalEst = records.reduce((s, r) => s + r.estimatedAmount, 0);
  const totalSpent = records.reduce((s, r) => s + r.actualSpent, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Contractor OS Financial Control</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Budget vs Actual Variance Matrix</h1>
        <p className="text-xs text-slate-400">Category-wise cost tracking across Materials, Labour, Equipment, and Logistics</p>
      </div>

      {/* Financial Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Baseline Budget</span>
          <p className="text-2xl font-bold text-slate-900 font-tabular">₹{totalEst.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Actual Spent</span>
          <p className="text-2xl font-bold text-emerald-700 font-tabular">₹{totalSpent.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {((totalSpent / totalEst) * 100).toFixed(1)}% of total baseline
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Remaining Unspent Budget</span>
          <p className="text-2xl font-bold text-blue-600 font-tabular">₹{(totalEst - totalSpent).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Variance Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden space-y-4 p-6">
        <h3 className="font-bold text-sm text-slate-900">Category Variance Breakdown</h3>

        <div className="space-y-4">
          {records.map((r) => {
            const pct = Math.round((r.actualSpent / r.estimatedAmount) * 100);
            return (
              <div key={r.category} className="p-5 bg-slate-50/70 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{r.category}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{r.notes}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 font-tabular block">
                      ₹{r.actualSpent.toLocaleString('en-IN')} / ₹{r.estimatedAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">{pct}% spent</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
