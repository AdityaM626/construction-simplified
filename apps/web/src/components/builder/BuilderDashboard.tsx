import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Building2, CheckSquare, AlertTriangle, ArrowRight } from 'lucide-react';

export const BuilderDashboard: React.FC = () => {
  const { setActiveTab } = useAuth();

  const assignedProjects = [
    {
      id: 'prj-101',
      name: 'Sharma Residence / Kumar Villa (4BHK)',
      owner: 'Rajesh Kumar',
      location: 'Whitefield, Bengaluru',
      progress: 46,
      activeMilestone: 'Ground & First Floor Superstructure',
      status: 'IN_PROGRESS'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Contractor Workspace</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assigned Projects</h1>
        <p className="text-xs text-slate-400">Apex Infrastructure & Builders • 1 Active Construction Site</p>
      </div>

      <div className="space-y-4">
        {assignedProjects.map((prj) => (
          <div key={prj.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{prj.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Owner: {prj.owner} • {prj.location}</p>
              </div>
              <Badge status={prj.status} />
            </div>

            <div className="p-5 bg-slate-50/70 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-600">Active Milestone: <b>{prj.activeMilestone}</b></span>
                <span className="text-blue-600 font-bold">{prj.progress}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${prj.progress}%` }} />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setActiveTab('connected-project')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                Open Connected Hub
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Manage Site Tasks
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
