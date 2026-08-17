import React from 'react';
import { Badge } from '../common/Badge';
import { CheckCircle2, Clock, Camera, Calendar, AlertCircle } from 'lucide-react';

export const MilestonesView: React.FC = () => {
  const milestones = [
    {
      id: 'mls-1',
      title: 'Site Excavation & Foundation RCC',
      desc: 'Soil levelling, PCC footing, reinforcement mesh laying & foundation concrete casting.',
      plannedStart: '2026-02-05',
      plannedEnd: '2026-03-15',
      actualEnd: '2026-03-12',
      pct: 100,
      status: 'COMPLETED',
      allocatedBudget: 900000
    },
    {
      id: 'mls-2',
      title: 'Ground & First Floor Superstructure',
      desc: 'RCC columns, brick masonry walls, beam framework and roof slab casting.',
      plannedStart: '2026-03-16',
      plannedEnd: '2026-06-30',
      actualEnd: null,
      pct: 72,
      status: 'IN_PROGRESS',
      allocatedBudget: 1500000
    },
    {
      id: 'mls-3',
      title: 'Electrical Conduit & Plumbing Rough-in',
      desc: 'Chipping wall slots, concealed PVC conduit fitting, sanitary sewer lines.',
      plannedStart: '2026-07-01',
      plannedEnd: '2026-08-31',
      actualEnd: null,
      pct: 10,
      status: 'IN_PROGRESS',
      allocatedBudget: 700000
    },
    {
      id: 'mls-4',
      title: 'Plastering, Flooring & Finishing',
      desc: 'Internal smooth plaster, vitrified tile flooring, painting, fixture installation.',
      plannedStart: '2026-09-01',
      plannedEnd: '2027-01-31',
      actualEnd: null,
      pct: 0,
      status: 'PLANNED',
      allocatedBudget: 1400000
    }
  ];

  const updates = [
    {
      id: 'sup-1',
      title: 'First Floor Slab Shuttering Complete',
      notes: 'First floor column reinforcement completed and slab shuttering verified by structural engineer. Preparing concrete pour schedule.',
      pct: 72,
      photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      author: 'Vikram Singh (Apex Infra)',
      date: '2026-08-14'
    },
    {
      id: 'sup-2',
      title: 'Foundation Footing Concrete Pour',
      notes: 'Foundation footing RCC pour successful. Curing process active with daily water spray.',
      pct: 100,
      photo: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
      author: 'Vikram Singh (Apex Infra)',
      date: '2026-03-12'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Milestones & Site Progress Timeline</h1>
          <p className="text-xs text-slate-500 mt-1">Real progress evidence uploaded by verified builders</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-blue-800">Target Completion: March 2027</span>
        </div>
      </div>

      {/* Chronological Milestone Nodes */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Construction Stages Breakdown</h3>
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {milestones.map((m) => {
            let iconNode = <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white ring-2 ring-slate-300" />;
            if (m.status === 'COMPLETED') {
              iconNode = <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-emerald-100"><CheckCircle2 className="w-3.5 h-3.5" /></div>;
            } else if (m.status === 'IN_PROGRESS') {
              iconNode = <div className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-blue-100" />;
            }

            return (
              <div key={m.id} className="relative flex items-start space-x-4">
                <div className="absolute -left-6 top-1">{iconNode}</div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 w-full space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{m.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{m.desc}</p>
                    </div>
                    <Badge status={m.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.plannedStart} to {m.plannedEnd}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-700 font-bold">Allocated: ₹{m.allocatedBudget.toLocaleString('en-IN')}</span>
                      <span className="text-blue-600 font-bold">{m.pct}% Done</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Site Photo Log Gallery */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Builder Photo Updates Feed</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">All photos timestamped</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {updates.map((u) => (
            <div key={u.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
              <img
                src={u.photo}
                alt={u.title}
                className="w-full h-48 object-cover rounded-lg border border-slate-200 shadow-2xs"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{u.title}</h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">{u.pct}% Progress</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">{u.notes}</p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60 pt-2">
                <span>By: {u.author}</span>
                <span>{u.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
