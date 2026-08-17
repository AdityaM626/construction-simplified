import React, { useState } from 'react';
import { IssueRecord, IssueSeverity, IssueStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { AlertTriangle, Plus, CheckCircle2, Camera, ShieldAlert } from 'lucide-react';

export const IssueManagementView: React.FC = () => {
  const [issues, setIssues] = useState<IssueRecord[]>([
    {
      id: 'iss-1',
      projectId: 'prj-101',
      title: 'Minor hairline shrinkage crack on east parapet wall',
      description: 'Observed 2mm surface hairline crack during plaster inspection.',
      category: 'STRUCTURAL',
      severity: 'LOW',
      status: 'RESOLVED',
      createdBy: 'Rajesh Kumar',
      createdByRole: 'HOMEOWNER',
      assignedTo: 'Vikram Singh',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      resolutionNotes: 'Polymer modified mortar seal applied. Inspected and approved.',
      createdAt: '2026-07-10T09:00:00.000Z',
      resolvedAt: '2026-07-12T15:00:00.000Z'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'STRUCTURAL' | 'ELECTRICAL' | 'PLUMBING' | 'FINISHING' | 'MATERIAL_DEFECT'>('STRUCTURAL');
  const [severity, setSeverity] = useState<IssueSeverity>('MEDIUM');

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const newIssue: IssueRecord = {
      id: `iss-${Date.now()}`,
      projectId: 'prj-101',
      title,
      description,
      category,
      severity,
      status: 'OPEN',
      createdBy: 'Rajesh Kumar',
      createdByRole: 'HOMEOWNER',
      assignedTo: 'Vikram Singh (Apex Infra)',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    };
    setIssues([newIssue, ...issues]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Quality & Defect Log</h1>
          <p className="text-xs text-slate-500 mt-1">Transparent defect reporting, contractor assignment & resolution tracking</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Issue / Defect</span>
        </button>
      </div>

      <div className="space-y-4">
        {issues.map((iss) => (
          <div key={iss.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900">{iss.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    iss.severity === 'CRITICAL' || iss.severity === 'HIGH'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {iss.severity} SEVERITY
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Category: {iss.category} • Assigned to: {iss.assignedTo}</p>
              </div>
              <Badge status={iss.status} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <img src={iss.photoUrl} alt="Defect Photo" className="w-full sm:w-40 h-28 object-cover rounded-xl border border-slate-200" />
              <div className="space-y-2 text-xs">
                <p className="text-slate-700 leading-relaxed">{iss.description}</p>
                {iss.resolutionNotes && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-0.5">Resolution Notes:</span>
                    <p className="text-emerald-700">{iss.resolutionNotes}</p>
                  </div>
                )}
                <span className="text-[11px] text-slate-400 block">Reported on {new Date(iss.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Site Defect or Quality Issue">
        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Water dampness near first floor bathroom corner"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="STRUCTURAL">Structural Masonry / Concrete</option>
              <option value="ELECTRICAL">Electrical Wiring & Fittings</option>
              <option value="PLUMBING">Plumbing & Water Seepage</option>
              <option value="FINISHING">Flooring, Plaster & Paint</option>
              <option value="MATERIAL_DEFECT">Damaged Material Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="LOW">Low (Cosmetic / Minor)</option>
              <option value="MEDIUM">Medium (Requires Builder Attention)</option>
              <option value="HIGH">High (Urgent Repair Required)</option>
              <option value="CRITICAL">Critical (Halts Work Safety)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description & Location</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe exact defect location and observation..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Log Defect Issue
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
