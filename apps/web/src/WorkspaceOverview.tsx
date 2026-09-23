import { useEffect, useState } from 'react';
import { apiFetch } from './api/client';
import type { UserRole } from './types';

type Attention = { key: string; title: string; count: number; tab: string; description: string };
type Overview = {
  metrics: { boqItems: number; milestones: number; completedMilestones: number; openDefects: number;
    projectBudget: string; committed: string; remainingAfterCommitments: string };
  attention: Attention[];
  recentActivity: { id: string; action: string; createdAt: string; actor: { fullName: string } }[];
};

const currency = (value: string) => '₹' + Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const roleTitle: Record<UserRole, string> = {
  HOMEOWNER: 'Your project decisions',
  BUILDER: 'Your site work',
  PROCUREMENT: 'Your sourcing queue',
  ADMIN: 'Project operations'
};

export function WorkspaceOverview({ projectId, role, onOpen }: {
  projectId: string; role: UserRole; onOpen: (tab: string) => void;
}) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setOverview(null);
    apiFetch<Overview>(`/projects/${projectId}/workspace-overview`)
      .then(data => { if (active) setOverview(data); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Could not load overview'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [projectId, refreshKey]);

  return <div className="mt-5 space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 className="text-lg font-bold">{roleTitle[role]}</h3>
        <p className="text-sm text-slate-600">Live project records and actions for your role.</p></div>
      <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
        onClick={() => setRefreshKey(value => value + 1)}>Refresh overview</button>
    </div>
    {loading && <p role="status" className="rounded-xl bg-slate-50 p-4 text-sm">Loading project overview…</p>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {overview && <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-blue-50 p-4"><p className="text-xs text-slate-600">Milestones completed</p>
          <strong className="text-xl">{overview.metrics.completedMilestones} / {overview.metrics.milestones}</strong></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-600">BOQ items</p>
          <strong className="text-xl">{overview.metrics.boqItems}</strong></div>
        <div className="rounded-xl bg-amber-50 p-4"><p className="text-xs text-slate-600">Open defects</p>
          <strong className="text-xl">{overview.metrics.openDefects}</strong></div>
        <div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs text-slate-600">Budget after orders</p>
          <strong className="text-xl">{currency(overview.metrics.remainingAfterCommitments)}</strong></div>
      </div>
      <p className="text-xs text-slate-600">Project budget {currency(overview.metrics.projectBudget)} ·
        purchase commitments {currency(overview.metrics.committed)}. This is not a payment balance.</p>
      <section aria-labelledby="attention-heading">
        <h4 id="attention-heading" className="font-bold">Needs attention</h4>
        {overview.attention.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {overview.attention.map(item => <button key={item.key} onClick={() => onOpen(item.tab)}
            className="rounded-xl border border-slate-200 p-4 text-left hover:border-blue-500 focus-visible:outline-blue-600">
            <span className="block text-sm font-bold">{item.count} · {item.title}</span>
            <span className="mt-1 block text-xs text-slate-600">{item.description}</span>
            <span className="mt-2 block text-xs font-bold text-blue-700">Open {item.tab} →</span>
          </button>)}
        </div> : <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          No actions need your attention right now.</p>}
      </section>
      <section aria-labelledby="activity-heading">
        <div className="flex items-center justify-between gap-3"><h4 id="activity-heading" className="font-bold">Recent activity</h4>
          <button className="text-sm font-semibold text-blue-700" onClick={() => onOpen('activity')}>View all</button></div>
        {overview.recentActivity.length ? <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
          {overview.recentActivity.map(event => <li key={event.id} className="py-3 text-sm">
            <span className="font-medium">{event.action.replace(/_/g, ' ').toLowerCase()}</span>
            <span className="block text-xs text-slate-600">{event.actor.fullName} ·
              {new Date(event.createdAt).toLocaleString()}</span>
          </li>)}</ul> : <p className="mt-3 text-sm text-slate-600">No activity recorded yet.</p>}
      </section>
    </>}
  </div>;
}
