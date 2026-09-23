import React, { useEffect, useState } from 'react';
import { apiFetch } from './api/client';
import type { UserRole } from './types';
import { ProcurementPanel } from './ProcurementPanel';
import { WorkspaceOverview } from './WorkspaceOverview';

type Item = Record<string, any> & { id: string; status?: string };
type Field = { key: string; label: string; type?: string; options?: string[] };
type Workflow = {
  label: string; path: string; fields: Field[];
  canCreate: UserRole[];
  title: (item: Item) => string;
  detail: (item: Item) => string;
};

const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';
const workflows: Record<string, Workflow> = {
  boq: { label: 'BOQ', path: 'boq', canCreate: ['BUILDER', 'ADMIN'],
    fields: [{ key: 'description', label: 'Item description' }, { key: 'category', label: 'Category' },
      { key: 'quantity', label: 'Quantity', type: 'number' }, { key: 'unit', label: 'Unit' },
      { key: 'estimatedRate', label: 'Estimated rate (₹)', type: 'number' }],
    title: item => item.description, detail: item => `${item.quantity} ${item.unit} · ₹${item.estimatedRate} per unit` },
  milestones: { label: 'Milestones', path: 'milestones', canCreate: ['BUILDER', 'ADMIN'],
    fields: [{ key: 'title', label: 'Milestone title' }, { key: 'plannedEndDate', label: 'Planned date', type: 'date' },
      { key: 'allocatedBudget', label: 'Allocated budget (₹)', type: 'number' }],
    title: item => item.title, detail: item => `Due ${new Date(item.plannedEndDate).toLocaleDateString()} · ₹${item.allocatedBudget}` },
  changes: { label: 'Change orders', path: 'change-orders', canCreate: ['HOMEOWNER', 'BUILDER', 'ADMIN'],
    fields: [{ key: 'title', label: 'Title' }, { key: 'description', label: 'Reason and scope' },
      { key: 'costImpact', label: 'Cost impact (₹)', type: 'number' },
      { key: 'timelineImpactDays', label: 'Time impact (days)', type: 'number' }],
    title: item => item.title, detail: item => `${item.description} · ₹${item.costImpact} · ${item.timelineImpactDays} days` },
  reports: { label: 'Site reports', path: 'site-reports', canCreate: ['BUILDER', 'ADMIN'],
    fields: [{ key: 'reportDate', label: 'Report date', type: 'date' }, { key: 'workCompleted', label: 'Work completed' },
      { key: 'materialsReceived', label: 'Materials received' }, { key: 'issuesEncountered', label: 'Issues encountered' },
      { key: 'nextPlan', label: 'Next plan' }],
    title: item => item.workCompleted, detail: item => new Date(item.reportDate).toLocaleDateString() },
  defects: { label: 'Defects', path: 'defects', canCreate: ['HOMEOWNER', 'BUILDER', 'ADMIN'],
    fields: [{ key: 'title', label: 'Defect title' }, { key: 'description', label: 'Description' },
      { key: 'severity', label: 'Severity', options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }],
    title: item => item.title, detail: item => `${item.severity} · ${item.description}` },
  materials: { label: 'Materials', path: 'material-requests', canCreate: [], fields: [],
    title: item => item.itemName, detail: item => `${item.quantity} ${item.unit}` },
  documents: { label: 'Documents', path: 'documents', canCreate: ['HOMEOWNER', 'BUILDER', 'PROCUREMENT', 'ADMIN'],
    fields: [{ key: 'title', label: 'Document title' }, { key: 'category', label: 'Category' },
      { key: 'storageKey', label: 'Document reference' }],
    title: item => item.title, detail: item => `${item.category} · ${item.storageKey}` },
  activity: { label: 'Activity', path: 'activity', canCreate: [], fields: [],
    title: item => item.action, detail: item => new Date(item.createdAt).toLocaleString() },
};

export function WorkflowPanel({ projectId, role, onProjectChange }: {
  projectId: string; role: UserRole; onProjectChange: () => Promise<void>;
}) {
  const [tab, setTab] = useState('overview');
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const workflow = workflows[tab] || workflows.boq;
  const base = `/projects/${projectId}/${workflow.path}`;
  const reload = async () => { if (tab !== 'materials' && tab !== 'overview') setItems(await apiFetch<Item[]>(base)); };
  useEffect(() => {
    setItems([]); setError(''); setForm({});
    reload().catch(reason => setError(reason.message));
  }, [projectId, tab]);
  const tabOrder = role === 'HOMEOWNER'
    ? ['overview', 'milestones', 'changes', 'defects', 'materials', 'reports', 'documents', 'boq', 'activity']
    : role === 'BUILDER'
      ? ['overview', 'reports', 'milestones', 'defects', 'boq', 'materials', 'changes', 'documents', 'activity']
      : role === 'PROCUREMENT'
        ? ['overview', 'materials', 'boq', 'milestones', 'reports', 'documents', 'changes', 'defects', 'activity']
        : ['overview', ...Object.keys(workflows)];

  const create = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const payload = { ...form };
      for (const field of workflow.fields) if (field.options && !payload[field.key]) payload[field.key] = field.options[0];
      await apiFetch(base, { method: 'POST', body: JSON.stringify(payload) });
      setForm({}); await reload();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not save'); }
    finally { setBusy(false); }
  };
  const act = async (path: string, body?: object) => {
    setBusy(true); setError('');
    try {
      await apiFetch(`/projects/${projectId}/${path}`, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
      await reload(); await onProjectChange();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Action failed'); }
    finally { setBusy(false); }
  };
  const actions = (item: Item) => {
    if (tab === 'milestones' && (role === 'BUILDER' || role === 'ADMIN') && ['NOT_STARTED', 'IN_PROGRESS'].includes(item.status || ''))
      return <button disabled={busy} onClick={() => act(`milestones/${item.id}/submit`)}>Submit for approval</button>;
    if (tab === 'milestones' && (role === 'HOMEOWNER' || role === 'ADMIN') && item.status === 'AWAITING_APPROVAL')
      return <button disabled={busy} onClick={() => act(`milestones/${item.id}/approve`)}>Approve completion</button>;
    if (tab === 'changes' && (role === 'HOMEOWNER' || role === 'ADMIN') && item.status === 'PENDING')
      return <><button disabled={busy} onClick={() => act(`change-orders/${item.id}/decision`, { decision: 'APPROVED' })}>Approve</button>
        <button disabled={busy} onClick={() => act(`change-orders/${item.id}/decision`, { decision: 'REJECTED' })}>Reject</button></>;
    if (tab === 'defects' && (role === 'BUILDER' || role === 'ADMIN') && ['OPEN', 'IN_PROGRESS'].includes(item.status || ''))
      return <button disabled={busy} onClick={() => act(`defects/${item.id}/resolve`)}>Mark resolved</button>;
    if (tab === 'defects' && (role === 'HOMEOWNER' || role === 'ADMIN') && item.status === 'RESOLVED')
      return <button disabled={busy} onClick={() => act(`defects/${item.id}/verify`)}>Verify closure</button>;
    return null;
  };

  return <section className="rounded-2xl bg-white p-6 shadow-sm">
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4" aria-label="Project workflows">
      {tabOrder.map(key => <button key={key} aria-pressed={tab === key}
        className={'rounded-lg px-3 py-2 text-sm font-semibold ' + (tab === key ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700')}
        onClick={() => setTab(key)}>{key === 'overview' ? 'Overview' : workflows[key].label}</button>)}
    </nav>
    {tab === 'overview' ? <WorkspaceOverview projectId={projectId} role={role} onOpen={setTab} /> :
      tab === 'materials' ? <ProcurementPanel projectId={projectId} role={role} onProjectChange={onProjectChange} /> : <>
    <h3 className="mt-5 text-lg font-bold">{workflow.label}</h3>
    {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {workflow.canCreate.includes(role) && <form onSubmit={create} className="mt-4 grid gap-3 sm:grid-cols-2">
      {workflow.fields.map(field => field.options
        ? <label key={field.key} className="text-xs font-semibold text-slate-600">{field.label}
          <select className={input + ' mt-1'} value={form[field.key] || field.options[0]}
            onChange={e => setForm({ ...form, [field.key]: e.target.value })}>{field.options.map(option => <option key={option}>{option}</option>)}</select>
        </label>
        : <label key={field.key} className="text-xs font-semibold text-slate-600">{field.label}
          <input className={input + ' mt-1'} type={field.type || 'text'} step={field.type === 'number' ? 'any' : undefined}
            value={form[field.key] || ''} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
            required={!['materialsReceived', 'issuesEncountered', 'nextPlan'].includes(field.key)} />
        </label>)}
      <button disabled={busy} className="self-end rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
        {busy ? 'Saving…' : 'Add ' + workflow.label.toLowerCase().replace(/s$/, '')}
      </button>
    </form>}
    <div className="mt-5 space-y-3">
      {items.map(item => <article key={item.id} className="rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div><h4 className="font-semibold">{workflow.title(item)}</h4><p className="mt-1 text-sm text-slate-600">{workflow.detail(item)}</p></div>
          {item.status && <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{item.status.replace('_', ' ')}</span>}
        </div>
        <div className="mt-2 flex gap-4 text-sm font-bold text-blue-700">{actions(item)}</div>
      </article>)}
      {!items.length && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No records yet.</p>}
    </div>
    </>}
  </section>;
}
