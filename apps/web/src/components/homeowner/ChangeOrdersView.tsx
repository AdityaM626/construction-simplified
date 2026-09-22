import React, { useEffect, useState } from 'react';
import { ChangeOrder } from '../../types';
import { Badge } from '../common/Badge';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { Plus } from 'lucide-react';

export const ChangeOrdersView: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeProjectId, projects, refreshProjects } = useProject();
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', proposedChange: '', originalScope: '', reason: '', costImpact: '', timelineImpactDays: '' });

  const load = async () => {
    setLoading(true);
    try { setChangeOrders(await api.getChangeRequests(activeProjectId)); setError(''); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not load change orders.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [activeProjectId]);

  const decide = async (changeOrder: ChangeOrder, approved: boolean) => {
    try {
      await (approved ? api.approveChangeRequest(activeProjectId, changeOrder.id) : api.rejectChangeRequest(activeProjectId, changeOrder.id));
      await Promise.all([load(), refreshProjects()]);
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save this decision.'); }
  };
  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.createChangeRequest(activeProjectId, { ...form, costImpact: Number(form.costImpact), timelineImpactDays: Number(form.timelineImpactDays) });
      setForm({ title: '', proposedChange: '', originalScope: '', reason: '', costImpact: '', timelineImpactDays: '' });
      setCreating(false); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not submit this change order.'); }
  };
  const project = projects.find(item => item.id === activeProjectId);
  const canCreate = currentUser.role === 'BUILDER' || currentUser.role === 'HOMEOWNER';

  return <div className="max-w-5xl mx-auto space-y-6 py-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Shared project record</span><h1 className="text-2xl font-bold text-slate-900">Change orders</h1><p className="text-xs text-slate-500 mt-1">Every scope decision is visible to the owner and contractor.</p></div>{canCreate && <button onClick={() => setCreating(!creating)} className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2"><Plus className="w-4 h-4" />New change order</button>}</div>
    {creating && <form onSubmit={create} className="bg-slate-900 text-white rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Change title" className="sm:col-span-2 px-3 py-2.5 text-xs rounded-xl text-slate-900" /><input required value={form.originalScope} onChange={e => setForm({ ...form, originalScope: e.target.value })} placeholder="Original scope" className="px-3 py-2.5 text-xs rounded-xl text-slate-900" /><input required value={form.proposedChange} onChange={e => setForm({ ...form, proposedChange: e.target.value })} placeholder="Proposed scope" className="px-3 py-2.5 text-xs rounded-xl text-slate-900" /><input required min="0" type="number" value={form.costImpact} onChange={e => setForm({ ...form, costImpact: e.target.value })} placeholder="Cost impact (₹)" className="px-3 py-2.5 text-xs rounded-xl text-slate-900" /><input required min="0" type="number" value={form.timelineImpactDays} onChange={e => setForm({ ...form, timelineImpactDays: e.target.value })} placeholder="Timeline impact (days)" className="px-3 py-2.5 text-xs rounded-xl text-slate-900" /><input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Reason (optional)" className="sm:col-span-2 px-3 py-2.5 text-xs rounded-xl text-slate-900" /><div className="sm:col-span-2 flex justify-end gap-2"><button type="button" onClick={() => setCreating(false)} className="px-4 py-2 text-xs font-bold">Cancel</button><button className="px-4 py-2 bg-amber-400 text-slate-900 rounded-xl text-xs font-bold">Submit for review</button></div></form>}
    {error && <p className="text-xs font-semibold text-rose-700 bg-rose-50 p-3 rounded-xl">{error}</p>}
    {loading ? <p className="text-sm text-slate-500">Loading change orders…</p> : changeOrders.length === 0 ? <div className="p-10 text-center bg-white border border-slate-200 rounded-3xl text-sm text-slate-500">No change orders for {project?.name || 'this project'}.</div> : <div className="space-y-4">{changeOrders.map(cho => <article key={cho.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm"><div className="flex flex-col sm:flex-row justify-between gap-3"><div><h2 className="font-bold text-slate-900">{cho.title}</h2><p className="text-xs text-slate-500 mt-1">Requested by {cho.requestedBy} · {new Date(cho.createdAt).toLocaleDateString()}</p></div><Badge status={cho.status} /></div><div className="grid sm:grid-cols-2 gap-3 text-xs"><div className="p-3 bg-slate-50 rounded-xl"><span className="text-slate-400">Original scope</span><p className="font-semibold mt-1">{cho.originalScope || 'Not specified'}</p></div><div className="p-3 bg-blue-50 rounded-xl"><span className="text-blue-600">Proposed scope</span><p className="font-semibold mt-1">{cho.proposedChange}</p></div></div><div className="flex flex-col sm:flex-row justify-between gap-3 items-center p-4 bg-amber-50 rounded-2xl text-xs"><span className="font-bold text-slate-800">+₹{cho.costImpact.toLocaleString('en-IN')} · +{cho.timelineImpactDays} days</span>{currentUser.role === 'HOMEOWNER' && cho.status === 'PENDING' && <div className="flex gap-2"><button onClick={() => decide(cho, false)} className="px-3 py-2 bg-white rounded-lg font-bold text-slate-700">Reject</button><button onClick={() => decide(cho, true)} className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-bold">Approve</button></div>}</div></article>)}</div>}
  </div>;
};
