import React, { useState } from 'react';
import { Camera, Calendar, CheckCircle2, ArrowRight, Layers, Sun, Users } from 'lucide-react';

export const ConstructionJournalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diary' | 'before-after'>('diary');

  const diaryEntries = [
    {
      id: 'jrn-1',
      date: '27 Aug 2026',
      phase: 'Ground & First Floor Superstructure',
      workersCount: 16,
      weather: 'Sunny (28°C)',
      workCompleted: 'Completed 1st floor column reinforcement & shuttering alignment.',
      materialsReceived: '350 bags UltraTech PPC Cement',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      tomorrowsPlan: 'Prepare concrete pour schedule for 1st floor roof slab.'
    }
  ];

  const beforeAfterEvidence = [
    {
      id: 'ba-1',
      title: 'East Boundary Footing Waterproofing & Defect Remediation',
      beforeUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
      dateCompleted: '2026-03-15',
      description: 'Applied 2 coats Dr. Fixit chemical compound and completed drainage sump pour.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Site Journal</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Digital Site Diary & Photo Evidence</h1>
          <p className="text-xs text-slate-400">Chronological site updates bound directly to construction phases and evidence</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('diary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'diary' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            Digital Site Diary
          </button>
          <button
            onClick={() => setActiveTab('before-after')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'before-after' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            Before / After Evidence
          </button>
        </div>
      </div>

      {activeTab === 'diary' ? (
        <div className="space-y-6">
          {diaryEntries.map((e) => (
            <div key={e.id} className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
              <img src={e.photoUrl} alt="Site Photo" className="w-full h-64 object-cover" />
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-blue-600 block">{e.date}</span>
                    <h3 className="font-bold text-base text-slate-900">{e.phase}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{e.weather} • {e.workersCount} Workers</span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-800"><b>Completed Today:</b> {e.workCompleted}</p>
                  <p className="text-slate-600"><b>Materials Delivered:</b> {e.materialsReceived}</p>
                  <p className="text-blue-600 font-medium"><b>Tomorrow's Execution:</b> {e.tomorrowsPlan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {beforeAfterEvidence.map((ba) => (
            <div key={ba.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">{ba.title}</h3>
                <p className="text-xs text-slate-400">Completed Date: <b>{ba.dateCompleted}</b></p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">BEFORE REMEDIATION</span>
                  <img src={ba.beforeUrl} alt="Before" className="w-full h-48 object-cover rounded-2xl border border-rose-100" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">AFTER REMEDIATION</span>
                  <img src={ba.afterUrl} alt="After" className="w-full h-48 object-cover rounded-2xl border border-emerald-100" />
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">{ba.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
