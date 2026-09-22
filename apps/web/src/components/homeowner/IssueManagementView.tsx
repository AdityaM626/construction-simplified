import React, { useEffect, useState } from 'react';
import { IssueRecord, IssueSeverity, IssueStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { AlertTriangle, Plus, CheckCircle2, Camera, ShieldAlert } from 'lucide-react';

export const IssueManagementView: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeProjectId } = useProject();
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'STRUCTURAL' | 'ELECTRICAL' | 'PLUMBING' | 'FINISHING' | 'MATERIAL_DEFECT'>('STRUCTURAL');
  const [severity, setSeverity] = useState<IssueSeverity>('MEDIUM');

  const loadIssues = async () => {
    setLoading(true);
    try {
      setIssues(await api.getIssues(activeProjectId));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load project issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadIssues(); }, [activeProjectId]);

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createIssue(activeProjectId, { title, description, category, severity });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not report this issue.');
    }
  };

  const updateIssue = async (issue: IssueRecord, status: 'IN_PROGRESS' | 'RESOLVED') => {
    try {
      await api.updateIssue(activeProjectId, issue.id, { status, resolutionNotes: status === 'RESOLVED' ? 'Contractor marked this issue as resolved.' : undefined });
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this issue.');
    }
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

      {error && <p className="text-xs font-semibold text-rose-700 bg-rose-50 p-3 rounded-xl">{error}</p>}

      {loading ? <p className="text-sm text-slate-500">Loading issues…</p> : <div className="space-y-4">
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
              {iss.photoUrl && <img src={iss.photoUrl} alt="Defect Photo" className="w-full sm:w-40 h-28 object-cover rounded-xl border border-slate-200" />}
              <div className="space-y-2 text-xs">
                <p className="text-slate-700 leading-relaxed">{iss.description}</p>
                {iss.resolutionNotes && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-0.5">Resolution Notes:</span>
                    <p className="text-emerald-700">{iss.resolutionNotes}</p>
                  </div>
                )}
                <span className="text-[11px] text-slate-400 block">Reported on {new Date(iss.createdAt).toLocaleDateString()}</span>
                {currentUser.role === 'BUILDER' && (iss.status === 'OPEN' || iss.status === 'IN_PROGRESS') && <div className="flex gap-2 pt-2"><button onClick={() => updateIssue(iss, 'IN_PROGRESS')} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-bold">Start work</button><button onClick={() => updateIssue(iss, 'RESOLVED')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold">Mark resolved</button></div>}
              </div>
            </div>
          </div>
        ))}
      </div>}

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
