import React, { useState } from 'react';
import { SmartTimelineView } from './SmartTimelineView';
import { QualityDefectsView } from './QualityDefectsView';
import { DigitalHandoverView } from './DigitalHandoverView';
import { HomePassportView } from './HomePassportView';
import { BOQEstimationView } from '../builder/BOQEstimationView';
import { BudgetVsActualView } from '../builder/BudgetVsActualView';
import { Building2, Layers, CheckSquare, FileSpreadsheet, ShieldCheck, Award, Home, AlertTriangle } from 'lucide-react';

export const ConnectedProjectView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'boq' | 'quality' | 'handover' | 'passport'>('overview');

  const project = {
    id: 'prj-101',
    name: 'Sharma Residence / Kumar Villa (4BHK)',
    location: 'Plot #42, Palm Meadows Enclave, Whitefield, Bengaluru',
    homeownerName: 'Rajesh Kumar',
    builderName: 'Apex Infrastructure & Builders',
    builtUpAreaSqFt: 2750,
    contractValue: 4500000,
    spentCost: 1820000,
    paidAmount: 1820000,
    completionPercentage: 46,
    projectHealth: 'HEALTHY',
    status: 'IN_PROGRESS'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Project Workspace Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Central Project Workspace</span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100">
                ● HEALTHY
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{project.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{project.location} • Owner: <b>{project.homeownerName}</b> • Contractor: <b>{project.builderName}</b></p>
          </div>

          <span className="text-xl font-bold text-slate-900 font-tabular">₹{(project.contractValue / 100000).toFixed(1)}L</span>
        </div>

        {/* Tab Strip */}
        <div className="flex overflow-x-auto bg-slate-100 p-1 rounded-2xl border border-slate-200/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'overview' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'timeline' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Timeline & Smart Dependencies</span>
          </button>

          <button
            onClick={() => setActiveTab('boq')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'boq' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>BOQ & Budget</span>
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'quality' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quality & Defects</span>
          </button>

          <button
            onClick={() => setActiveTab('handover')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'handover' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Digital Handover</span>
          </button>

          <button
            onClick={() => setActiveTab('passport')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'passport' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Passport 🏠</span>
          </button>
        </div>
      </div>

      {/* Tab Render Area */}
      {activeTab === 'overview' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
          <h3 className="font-bold text-base text-slate-900">Project Overview Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-400 block font-medium">Built-Up Area</span>
              <p className="font-bold text-slate-900 font-tabular text-sm">{project.builtUpAreaSqFt} Sq.Ft</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-400 block font-medium">Contract Value</span>
              <p className="font-bold text-slate-900 font-tabular text-sm">₹{project.contractValue.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-slate-400 block font-medium">Progress</span>
              <p className="font-bold text-blue-600 font-tabular text-sm">{project.completionPercentage}% Complete</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && <SmartTimelineView />}
      {activeTab === 'boq' && <BudgetVsActualView />}
      {activeTab === 'quality' && <QualityDefectsView />}
      {activeTab === 'handover' && <DigitalHandoverView />}
      {activeTab === 'passport' && <HomePassportView />}
    </div>
  );
};
