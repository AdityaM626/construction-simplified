import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './api/client';
import type { UserRole } from './types';
import { WorkflowPanel } from './WorkflowPanel';

type ProjectSummary = {
  id: string; name: string; type: string; location: string; status: string;
  totalBudget: string; targetCompletionDate: string;
  members: { userId: string; role: string; user: { fullName: string; email: string } }[];
};

const input = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500';
const button = 'rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50';

function AccountGate() {
  const { currentUser, loading, loginWithApi, registerWithApi } = useAuth();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('HOMEOWNER');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading) return <div className="p-10 text-slate-600">Restoring your session…</div>;
  if (currentUser) return <Workspace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (register) await registerWithApi({ email, password, fullName, role });
      else await loginWithApi(email, password);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in');
    } finally { setBusy(false); }
  };
  return <main className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
      <div className="text-2xl font-bold text-slate-900">Construction OS</div>
      <p className="mt-2 text-sm text-slate-600">Projects shared by homeowners, builders and procurement teams.</p>
      <div className="mt-6 flex gap-2">
        <button className={register ? 'text-slate-500' : 'font-bold text-blue-700'} onClick={() => setRegister(false)}>Sign in</button>
        <button className={register ? 'font-bold text-blue-700' : 'text-slate-500'} onClick={() => setRegister(true)}>Create account</button>
      </div>
      <form onSubmit={submit} className="mt-5 space-y-3">
        {register && <input className={input} aria-label="Full name" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required />}
        <input className={input} aria-label="Email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className={input} aria-label="Password" type="password" placeholder={register ? 'Password (12 characters minimum)' : 'Password'} minLength={register ? 12 : 1} value={password} onChange={e => setPassword(e.target.value)} required />
        {register && <select className={input} aria-label="Account role" value={role} onChange={e => setRole(e.target.value as UserRole)}>
          <option value="HOMEOWNER">Homeowner</option><option value="BUILDER">Builder / contractor</option><option value="PROCUREMENT">Procurement / logistics</option>
        </select>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className={button + ' w-full'}>{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button>
      </form>
    </div>
  </main>;
}

function Workspace() {
  const { currentUser, logout } = useAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('NEW_CONSTRUCTION');
  const [location, setLocation] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [targetCompletionDate, setTargetCompletionDate] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('BUILDER');
  const selected = projects.find(p => p.id === selectedId);

  const refresh = async () => {
    const list = await api.getProjects();
    setProjects(list);
    setSelectedId(id => list.some(p => p.id === id) ? id : list[0]?.id || '');
  };
  useEffect(() => { refresh().catch(e => setError(e.message)); }, [currentUser?.id]);

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const project = await api.createProject({ name, type, location, totalBudget, targetCompletionDate });
      await refresh(); setSelectedId(project.id); setName(''); setLocation(''); setTotalBudget(''); setTargetCompletionDate('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not create project'); }
    finally { setBusy(false); }
  };
  const addMember = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selected) return; setBusy(true); setError('');
    try { await api.addMember(selected.id, { email: memberEmail, role: memberRole }); await refresh(); setMemberEmail(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not add member'); }
    finally { setBusy(false); }
  };

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div><h1 className="text-xl font-bold">Construction OS</h1><p className="text-xs text-slate-500">Shared project workspace</p></div>
      <div className="text-right"><p className="text-sm font-semibold">{currentUser?.fullName}</p>
        <p className="text-xs text-slate-500">{currentUser?.role.replace('_', ' ')}</p>
        <button className="text-xs font-semibold text-blue-700" onClick={logout}>Sign out</button></div>
    </header>
    <div className="mx-auto max-w-6xl p-6 grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl bg-white p-4 shadow-sm self-start">
        <h2 className="font-bold">Your projects</h2>
        <div className="mt-3 space-y-2">
          {projects.map(project => <button key={project.id} onClick={() => setSelectedId(project.id)}
            className={'w-full rounded-xl p-3 text-left text-sm ' + (selectedId === project.id ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50')}>
            <span className="block font-semibold">{project.name}</span><span className="block text-xs text-slate-500">{project.location}</span>
          </button>)}
          {!projects.length && <p className="text-sm text-slate-500">No projects assigned yet.</p>}
        </div>
      </aside>
      <main className="space-y-5">
        {error && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {selected && <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase text-blue-700">{selected.status.replace('_', ' ')}</p>
          <h2 className="mt-1 text-2xl font-bold">{selected.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{selected.location} · {selected.type.replace('_', ' ')}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-xl bg-slate-50 p-3"><span className="block text-slate-500">Budget</span>₹{Number(selected.totalBudget).toLocaleString('en-IN')}</div>
            <div className="rounded-xl bg-slate-50 p-3"><span className="block text-slate-500">Target date</span>{new Date(selected.targetCompletionDate).toLocaleDateString()}</div>
          </div>
          <h3 className="mt-6 font-bold">Project team</h3>
          <ul className="mt-2 space-y-2">{selected.members.map(member => <li key={member.userId} className="text-sm">{member.user.fullName} <span className="text-slate-500">· {member.role.toLowerCase()}</span></li>)}</ul>
          {(currentUser?.id === selected.members.find(m => m.role === 'HOMEOWNER')?.userId || currentUser?.role === 'ADMIN') &&
            <form onSubmit={addMember} className="mt-4 flex flex-wrap gap-2">
              <input className={input + ' flex-1'} type="email" aria-label="Member email" placeholder="Registered member email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required />
              <select className={input + ' max-w-48'} aria-label="Member role" value={memberRole} onChange={e => setMemberRole(e.target.value)}><option value="BUILDER">Builder</option><option value="PROCUREMENT">Procurement</option></select>
              <button className={button} disabled={busy}>Add member</button>
            </form>}
        </section>}
        {selected && currentUser && <WorkflowPanel key={selected.id} projectId={selected.id}
          role={currentUser.role} onProjectChange={refresh} />}
        {(currentUser?.role === 'HOMEOWNER' || currentUser?.role === 'ADMIN') && <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Start a project</h2>
          <form onSubmit={createProject} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className={input} aria-label="Project name" placeholder="Project name" value={name} onChange={e => setName(e.target.value)} required />
            <select className={input} aria-label="Project type" value={type} onChange={e => setType(e.target.value)}><option value="NEW_CONSTRUCTION">New construction</option><option value="RENOVATION">Renovation</option></select>
            <input className={input} aria-label="Location" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
            <input className={input} aria-label="Total budget" type="number" min="1" placeholder="Total budget (₹)" value={totalBudget} onChange={e => setTotalBudget(e.target.value)} required />
            <input className={input} aria-label="Target completion date" type="date" value={targetCompletionDate} onChange={e => setTargetCompletionDate(e.target.value)} required />
            <button className={button} disabled={busy}>Create project</button>
          </form>
        </section>}
      </main>
    </div>
  </div>;
}

export default function App() { return <AuthProvider><AccountGate /></AuthProvider>; }
