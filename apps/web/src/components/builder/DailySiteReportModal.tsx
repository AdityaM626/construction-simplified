import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ClipboardList, CheckCircle2, Camera, Sun, Users, Wrench } from 'lucide-react';
import { api } from '../../api/client';
import { useProject } from '../../context/ProjectContext';

interface DailySiteReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailySiteReportModal: React.FC<DailySiteReportModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { activeProjectId } = useProject();
  const [workersCount, setWorkersCount] = useState('16');
  const [workCompleted, setWorkCompleted] = useState('Completed 1st floor column reinforcement & shuttering alignment.');
  const [materialsReceived, setMaterialsReceived] = useState('Received 350 bags UltraTech PPC Cement.');
  const [tomorrowsPlan, setTomorrowsPlan] = useState('Prepare concrete pour schedule for 1st floor roof slab.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.submitDailyReport(activeProjectId, {
        workersPresentCount: workersCount,
        workCompleted,
        materialsReceived,
        tomorrowsPlan
      });
      setSubmitted(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit the site report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fast Daily Site Report (Site Manager Tool)">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Site Workers Present Today</label>
          <input
            type="number"
            required
            value={workersCount}
            onChange={e => setWorkersCount(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Work Completed Today</label>
          <textarea
            required
            rows={2}
            value={workCompleted}
            onChange={e => setWorkCompleted(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Materials Received / Delivered Today</label>
          <input
            type="text"
            value={materialsReceived}
            onChange={e => setMaterialsReceived(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Tomorrow's Planned Execution</label>
          <input
            type="text"
            required
            value={tomorrowsPlan}
            onChange={e => setTomorrowsPlan(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Daily Site Report submitted! Homeowner notified automatically.</span>
          </div>
        ) : (
          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <ClipboardList className="w-4 h-4" />
              <span>{submitting ? 'Submitting…' : 'Submit Site Report'}</span>
            </button>
          </div>
        )}
        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
      </form>
    </Modal>
  );
};
