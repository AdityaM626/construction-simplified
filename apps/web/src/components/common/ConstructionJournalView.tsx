import React, { useState } from 'react';
import { Camera, Calendar, CheckCircle2, ArrowRight, Plus, Upload, Sun, Users, Image as ImageIcon } from 'lucide-react';
import { Modal } from './Modal';

export const ConstructionJournalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diary' | 'before-after'>('diary');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [diaryEntries, setDiaryEntries] = useState([
    {
      id: 'jrn-1',
      date: '2026-08-27',
      phase: 'Ground & First Floor Superstructure',
      workersCount: 16,
      weather: 'Sunny (28°C)',
      workCompleted: 'Completed 1st floor column reinforcement & shuttering alignment.',
      materialsReceived: '350 bags UltraTech PPC Cement',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      tomorrowsPlan: 'Prepare concrete pour schedule for 1st floor roof slab.'
    },
    {
      id: 'jrn-2',
      date: '2026-08-20',
      phase: 'Foundation & Footing Casting',
      workersCount: 14,
      weather: 'Partly Cloudy (26°C)',
      workCompleted: 'Poured M25 grade RCC concrete for east wing footings & waterproofing seal.',
      materialsReceived: '12 MT Fe550 TMT Steel Bars',
      photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      tomorrowsPlan: 'Curing and column starter marking.'
    }
  ]);

  const [beforeAfterEvidence] = useState([
    {
      id: 'ba-1',
      title: 'East Boundary Footing Waterproofing & Defect Remediation',
      beforeUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
      dateCompleted: '2026-03-15',
      description: 'Applied 2 coats Dr. Fixit chemical compound and completed drainage sump pour.'
    }
  ]);

  // Modal Form State
  const [newPhase, setNewPhase] = useState('Ground & First Floor Superstructure');
  const [newWorkers, setNewWorkers] = useState(16);
  const [newWeather, setNewWeather] = useState('Sunny (29°C)');
  const [newWorkCompleted, setNewWorkCompleted] = useState('');
  const [newMaterials, setNewMaterials] = useState('');
  const [newTomorrowsPlan, setNewTomorrowsPlan] = useState('');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80');
  const [customFilePreview, setCustomFilePreview] = useState<string | null>(null);

  const presetPhotos = [
    { label: 'Column Shuttering', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80' },
    { label: 'Foundation Concrete', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Rebar & Steel Binding', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80' },
    { label: 'Brickwork Masonry', url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomFilePreview(objectUrl);
      setSelectedPhotoUrl(objectUrl);
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkCompleted.trim()) return;

    const newEntry = {
      id: `jrn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      phase: newPhase,
      workersCount: Number(newWorkers) || 10,
      weather: newWeather,
      workCompleted: newWorkCompleted,
      materialsReceived: newMaterials || 'None',
      photoUrl: selectedPhotoUrl,
      tomorrowsPlan: newTomorrowsPlan || 'Continue scheduled execution'
    };

    setDiaryEntries(prev => [newEntry, ...prev]);
    setIsAddModalOpen(false);
    setNewWorkCompleted('');
    setNewMaterials('');
    setNewTomorrowsPlan('');
    setCustomFilePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Site Journal</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Digital Site Diary & Photo Evidence</h1>
          <p className="text-xs text-slate-400">Chronological site updates bound directly to construction phases and evidence</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>+ Add Photo Entry</span>
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('diary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'diary' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
              }`}
            >
              Site Diary
            </button>
            <button
              onClick={() => setActiveTab('before-after')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'before-after' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
              }`}
            >
              Before / After
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'diary' ? (
        <div className="space-y-6">
          {diaryEntries.map((e) => (
            <div key={e.id} className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
              <div className="relative">
                <img src={e.photoUrl} alt="Site Photo" className="w-full h-72 object-cover" />
                <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center space-x-1 border border-white/20">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>Site Photo Captured</span>
                </span>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-blue-600 block">{e.date}</span>
                    <h3 className="font-bold text-base text-slate-900">{e.phase}</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{e.weather} • <b>{e.workersCount} Workers</b></span>
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

      {/* 📸 ADD SITE ENTRY & PHOTO MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Log New Site Diary Entry & Photo 📸" maxWidth="max-w-2xl">
        <form onSubmit={handleAddEntry} className="space-y-4 text-xs">
          {/* Photo Selection / Upload */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">1. Attach Site Photo</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presetPhotos.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedPhotoUrl(preset.url);
                    setCustomFilePreview(null);
                  }}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    selectedPhotoUrl === preset.url && !customFilePreview ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover rounded-lg mb-1" />
                  <span className="text-[10px] font-semibold text-slate-700 block truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Custom File Upload Option */}
            <div className="mt-3 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                id="photo-upload-input"
                className="hidden"
              />
              <label htmlFor="photo-upload-input" className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold shadow-2xs hover:bg-slate-100">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Upload Custom Photo from Device</span>
              </label>

              {customFilePreview && (
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <img src={customFilePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-blue-500" />
                  <span className="text-emerald-600 font-bold text-xs">✓ Custom photo loaded</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Active Phase</label>
              <input
                type="text"
                value={newPhase}
                onChange={(e) => setNewPhase(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Workers On Site Today</label>
              <input
                type="number"
                value={newWorkers}
                onChange={(e) => setNewWorkers(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                min={1}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Work Completed Today</label>
            <textarea
              value={newWorkCompleted}
              onChange={(e) => setNewWorkCompleted(e.target.value)}
              placeholder="e.g. Completed 1st floor roof slab rebar binding and concrete shuttering inspection"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium h-20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Materials Delivered</label>
              <input
                type="text"
                value={newMaterials}
                onChange={(e) => setNewMaterials(e.target.value)}
                placeholder="e.g. 400 bags PPC Cement"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Tomorrow's Execution Plan</label>
              <input
                type="text"
                value={newTomorrowsPlan}
                onChange={(e) => setNewTomorrowsPlan(e.target.value)}
                placeholder="e.g. Prepare concrete pour batching"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Post Site Entry with Photo</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
