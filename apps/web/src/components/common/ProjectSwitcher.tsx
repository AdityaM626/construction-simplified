import React, { useState } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';

interface ProjectOption {
  id: string;
  name: string;
  location: string;
  status: string;
}

export const ProjectSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects] = useState<ProjectOption[]>([
    { id: 'prj-101', name: 'Sharma Residence / Kumar Villa (4BHK)', location: 'Whitefield, Bengaluru', status: 'IN_PROGRESS' },
    { id: 'prj-102', name: 'Green Villa Renovation', location: 'Indiranagar, Bengaluru', status: 'PLANNING' },
    { id: 'prj-103', name: 'Patel Structural Extension', location: 'HSR Layout, Bengaluru', status: 'IN_PROGRESS' }
  ]);

  const [selectedProject, setSelectedProject] = useState<ProjectOption>(projects[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold transition-colors"
      >
        <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
        <div className="text-left max-w-[140px] sm:max-w-[200px] truncate">
          <span className="text-[10px] text-slate-400 block font-normal leading-none">Active Project</span>
          <span className="truncate block font-bold text-slate-100">{selectedProject.name}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
          <div className="px-4 py-2 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Connected Project</span>
          </div>
          <div className="divide-y divide-slate-100">
            {projects.map((p) => {
              const isSelected = p.id === selectedProject.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProject(p);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start justify-between transition-colors ${
                    isSelected ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{p.name}</span>
                    <span className="text-[11px] text-slate-500 block">{p.location}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
