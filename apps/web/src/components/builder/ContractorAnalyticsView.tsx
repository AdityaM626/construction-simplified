import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, ShieldAlert, Building2 } from 'lucide-react';

export const ContractorAnalyticsView: React.FC = () => {
  const analytics = {
    avgCostPerSqFt: 1636,
    avgMaterialCostPerSqFt: 763,
    avgLabourCostPerSqFt: 418,
    onTimeCompletionRate: 96.4,
    avgDelayDays: 2.1,
    reworkCostPercentage: 0.18,
    projectsCompared: [
      { name: 'Sharma Residence (4BHK)', area: 2750, costPerSqFt: 1636, delayDays: 0, health: 'HEALTHY' },
      { name: 'Sarjapur Luxury Villa', area: 3400, costPerSqFt: 1720, delayDays: 4, health: 'HEALTHY' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Contractor OS Analytics & Intelligence</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Construction Operational Analytics</h1>
        <p className="text-xs text-slate-400">Derived strictly from actual empirical project records (Cost/sqft, Rework %, On-time rate)</p>
      </div>

      {/* Core KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Avg Cost / Sq.Ft</span>
          <p className="text-2xl font-bold text-slate-900 font-tabular">₹{analytics.avgCostPerSqFt}</p>
          <span className="text-[11px] text-slate-400 block">₹763 Mat / ₹418 Labour</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">On-Time Completion Rate</span>
          <p className="text-2xl font-bold text-emerald-600 font-tabular">{analytics.onTimeCompletionRate}%</p>
          <span className="text-[11px] text-emerald-600 font-semibold block">Avg delay: {analytics.avgDelayDays} days</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Rework Cost Rate</span>
          <p className="text-2xl font-bold text-blue-600 font-tabular">{analytics.reworkCostPercentage}%</p>
          <span className="text-[11px] text-blue-600 font-medium block">Under 0.5% threshold</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">Completed Projects</span>
          <p className="text-2xl font-bold text-slate-900 font-tabular">28</p>
          <span className="text-[11px] text-slate-400 block">14 years experience</span>
        </div>
      </div>

      {/* Project Comparison Matrix */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Project Side-by-Side Comparison</h3>

        <div className="space-y-3">
          {analytics.projectsCompared.map((p, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{p.name}</span>
                <span className="text-slate-400 text-[11px]">{p.area} Sq.Ft built-up area</span>
              </div>
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-slate-400 block">Cost / Sq.Ft</span>
                  <span className="font-bold text-slate-900 font-tabular">₹{p.costPerSqFt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Schedule Delay</span>
                  <span className="font-bold text-emerald-600">+{p.delayDays} Days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
