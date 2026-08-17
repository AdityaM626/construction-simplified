import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Building2, Camera, CheckSquare, Plus, FileText, Send, CheckCircle2 } from 'lucide-react';

export const BuilderDashboard: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState('75');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80');
  const [postSuccess, setPostSuccess] = useState(false);

  const assignedProjects = [
    {
      id: 'prj-101',
      name: 'Kumar Dream Villa (4BHK)',
      homeowner: 'Rajesh Kumar',
      location: 'Whitefield, Bengaluru',
      type: 'NEW_CONSTRUCTION',
      completionPercentage: 46,
      currentMilestone: 'Ground & First Floor Superstructure',
      status: 'IN_PROGRESS'
    }
  ];

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setIsUpdateModalOpen(false);
      setNotes('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Builder Workspace & Site Operations</h1>
          <p className="text-xs text-slate-500 mt-1">Apex Infrastructure & Builders • Verified Contractor</p>
        </div>
        <button
          onClick={() => setIsUpdateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Camera className="w-4 h-4" />
          <span>Post Site Photo Update</span>
        </button>
      </div>

      {/* Assigned Projects */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Active Assigned Projects</h3>
        {assignedProjects.map((prj) => (
          <div key={prj.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{prj.name}</h4>
                <p className="text-xs text-slate-500">{prj.location} • Client: {prj.homeowner}</p>
              </div>
              <Badge status={prj.status} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Active Milestone: {prj.currentMilestone}</span>
                <span className="text-blue-600 font-bold">{prj.completionPercentage}% Overall</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${prj.completionPercentage}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Site Update Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Upload Progress Site Photo">
        {postSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Site Photo Update Published!</h3>
            <p className="text-xs text-slate-500">Homeowner has been notified in real time.</p>
          </div>
        ) : (
          <form onSubmit={handlePostUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Project</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700">
                <option>Kumar Dream Villa (4BHK) - Whitefield</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Milestone Stage</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700">
                <option>Ground & First Floor Superstructure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Completion Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={completionPercentage}
                onChange={e => setCompletionPercentage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Engineer Site Notes & Remarks</label>
              <textarea
                required
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe current structural status, inspection observations..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Site Photo Image URL</label>
              <input
                type="text"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Publish Site Update
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
