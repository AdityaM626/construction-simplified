import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ArrowDown, ShieldAlert, GitCommit } from 'lucide-react';

export const SmartTimelineView: React.FC = () => {
  const milestones = [
    {
      id: 'mls-1',
      title: 'Site Excavation & Foundation RCC',
      description: 'Soil levelling, PCC footing & foundation concrete pour.',
      plannedStartDate: '2026-02-05',
      plannedEndDate: '2026-03-15',
      actualEndDate: '2026-03-12',
      completionPercentage: 100,
      status: 'COMPLETED',
      allocatedBudget: 900000
    },
    {
      id: 'mls-2',
      title: 'Ground & First Floor Superstructure',
      description: 'RCC columns, brick masonry & roof slab casting.',
      plannedStartDate: '2026-03-16',
      plannedEndDate: '2026-06-30',
      actualEndDate: null,
      completionPercentage: 72,
      status: 'IN_PROGRESS',
      allocatedBudget: 1500000,
      requiresOwnerApproval: true,
      dependsOnMilestoneId: 'mls-1'
    },
    {
      id: 'mls-3',
      title: 'Electrical & Plumbing Rough-In',
      description: 'Conduit laying, CPVC plumbing lines & distribution box installation.',
      plannedStartDate: '2026-07-01',
      plannedEndDate: '2026-09-15',
      actualEndDate: null,
      completionPercentage: 10,
      status: 'IN_PROGRESS',
      allocatedBudget: 600000,
      dependsOnMilestoneId: 'mls-2',
      downstreamImpactWarning: '⚠️ Electrical/plumbing conduit laying delayed by 3 days because superstructure brickwork shuttering is active.'
    },
    {
      id: 'mls-4',
      title: 'Flooring, Tiling & Interior Finishing',
      description: 'Italian Bottochino marble laying, vitrified tiling & wall plastering.',
      plannedStartDate: '2026-09-16',
      plannedEndDate: '2026-12-15',
      completionPercentage: 0,
      status: 'NOT_STARTED',
      allocatedBudget: 800000,
      dependsOnMilestoneId: 'mls-3'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Timeline & Smart Dependencies</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Milestone Execution & Downstream Impact Engine</h1>
        <p className="text-xs text-slate-400">Track planned vs actual progress with intelligent dependency warnings</p>
      </div>

      {/* Downstream Alert Banner */}
      <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-3xl space-y-2 shadow-2xs">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Downstream Schedule Impact Alert</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed pl-6">
          Electrical & Plumbing work is experiencing a <b>3-day delay</b> because earlier superstructure brickwork shuttering requires 72-hour curing.
        </p>
      </div>

      {/* Milestone Dependency Stepper */}
      <div className="space-y-6">
        {milestones.map((m, idx) => (
          <div key={m.id} className="relative">
            {idx < milestones.length - 1 && (
              <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-slate-200 -z-10" />
            )}

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                    m.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    m.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200 font-extrabold' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-400">{m.plannedStartDate} → {m.plannedEndDate}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                  m.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                  m.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {m.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-13">{m.description}</p>

              {m.downstreamImpactWarning && (
                <div className="ml-13 p-3 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-xl text-xs font-medium">
                  {m.downstreamImpactWarning}
                </div>
              )}

              <div className="ml-13 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Milestone Progress</span>
                  <span>{m.completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${m.completionPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
