import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Building2, ChevronDown, Check } from 'lucide-react';

export const ProjectSwitcher: React.FC = () => {
  const { activeProjectId, setActiveProjectId, projects } = useProject();
  const [isOpen, setIsOpen] = useState(false);

  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200/60 text-left"
        aria-label="Switch active construction project"
      >
        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
        <div className="truncate max-w-[140px] sm:max-w-[200px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Active Project</span>
          <span className="text-xs font-bold text-slate-900 truncate block leading-tight mt-0.5">{currentProject?.name || 'No assigned project'}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 space-y-1">
          <div className="px-3 py-1.5 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Project</span>
          </div>

          {projects.map((prj) => {
            const isSelected = prj.id === activeProjectId;
            return (
              <button
                key={prj.id}
                onClick={() => {
                  setActiveProjectId(prj.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                  isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-left truncate pr-2">
                  <p className="font-bold truncate">{prj.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{prj.location}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
