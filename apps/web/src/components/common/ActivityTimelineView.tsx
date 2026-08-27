import React, { useState } from 'react';
import { Clock, Filter, Layers, DollarSign, GitPullRequest, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const ActivityTimelineView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const activities = [
    {
      id: 'act-1',
      category: 'Construction',
      title: 'Daily Site Report Logged',
      description: 'Site manager submitted update: 1st floor column shuttering alignment verified. 16 workers present.',
      actor: 'Vikram Singh (Contractor)',
      timestamp: '27 Aug 2026 • 5:30 PM'
    },
    {
      id: 'act-2',
      category: 'Changes',
      title: 'Change Order Requested',
      description: 'Owner requested upgrade to Italian Bottochino Marble (+₹1,20,000 • +4 Days).',
      actor: 'Rajesh Kumar (Owner)',
      timestamp: '25 Aug 2026 • 2:00 PM'
    },
    {
      id: 'act-3',
      category: 'Financial',
      title: 'Tranche Disbursement Paid',
      description: 'Milestone payment ₹18.2L confirmed by homeowner.',
      actor: 'Rajesh Kumar (Owner)',
      timestamp: '18 Aug 2026 • 10:45 AM'
    }
  ];

  const filtered = filterCategory === 'All' ? activities : activities.filter(a => a.category === filterCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Activity Stream</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Activity & Audit Timeline</h1>
          <p className="text-xs text-slate-400">Permanent chronological stream of every construction, financial, and approval event</p>
        </div>

        {/* Filter Pills */}
        <div className="flex overflow-x-auto bg-slate-100 p-1 rounded-xl border border-slate-200/60 no-scrollbar">
          {['All', 'Construction', 'Financial', 'Changes', 'Approvals'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterCategory === cat ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
                {item.category}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{item.timestamp}</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 mt-1">{item.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            <p className="text-[11px] text-slate-400 font-medium pt-1">By: <b>{item.actor}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
};
