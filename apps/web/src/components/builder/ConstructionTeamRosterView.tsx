import React, { useState } from 'react';
import { ConstructionTeamMember, ConstructionTeamRole } from '../../types';
import { Modal } from '../common/Modal';
import { Users, Plus, Phone, CheckCircle2, UserCheck, HardHat, Zap, Wrench, Palette, Compass, Shield } from 'lucide-react';

export const ConstructionTeamRosterView: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<ConstructionTeamMember[]>([
    {
      id: 'tm-101',
      projectId: 'prj-101',
      contractorId: 'usr-builder-1',
      name: 'Ramesh Kumar',
      role: 'ELECTRICIAN',
      phone: '+91 98450 11223',
      specialization: '3-Phase Conduit Wiring & Distribution Boards',
      assignedMilestoneTitle: 'Ground & First Floor Superstructure',
      status: 'ACTIVE'
    },
    {
      id: 'tm-102',
      projectId: 'prj-101',
      contractorId: 'usr-builder-1',
      name: 'Suresh Babu',
      role: 'PLUMBER',
      phone: '+91 97411 55667',
      specialization: 'CPVC Water Supply & Sewerage Line Layout',
      assignedMilestoneTitle: 'Ground & First Floor Superstructure',
      status: 'ACTIVE'
    },
    {
      id: 'tm-103',
      projectId: 'prj-101',
      contractorId: 'usr-builder-1',
      name: 'Ananya Roy',
      role: 'ARCHITECT',
      phone: '+91 99000 33445',
      specialization: 'Structural & Elevation Blueprint Verification',
      assignedMilestoneTitle: 'Site Excavation & Foundation RCC',
      status: 'COMPLETED'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<ConstructionTeamRole>('ELECTRICIAN');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: ConstructionTeamMember = {
      id: `tm-${Date.now()}`,
      projectId: 'prj-101',
      contractorId: 'usr-builder-1',
      name: name || 'Specialist Worker',
      role,
      phone: phone || '+91 90000 11111',
      specialization: specialization || 'General Construction Services',
      assignedMilestoneTitle: 'Ground & First Floor Superstructure',
      status: 'ACTIVE'
    };
    setTeamMembers(prev => [newMember, ...prev]);
    setName('');
    setPhone('');
    setSpecialization('');
    setShowAddModal(false);
  };

  const getRoleBadgeIcon = (role: ConstructionTeamRole) => {
    switch (role) {
      case 'ELECTRICIAN': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'PLUMBER': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'PAINTER': return <Palette className="w-4 h-4 text-purple-500" />;
      case 'ARCHITECT': return <Compass className="w-4 h-4 text-indigo-500" />;
      default: return <HardHat className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction Team OS</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Team Specialist Roster</h1>
          <p className="text-xs text-slate-400">Apex Infrastructure • Assigned Specialists & Tradespeople</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Specialist</span>
        </button>
      </div>

      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                  {getRoleBadgeIcon(member.role)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{member.name}</h3>
                  <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block mt-0.5">{member.role}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                member.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {member.status}
              </span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl space-y-2 text-xs">
              <p className="text-slate-700 font-medium">Specialization: <b className="text-slate-900">{member.specialization}</b></p>
              <p className="text-slate-500">Assigned Milestone: <b className="text-slate-800">{member.assignedMilestoneTitle}</b></p>
              <div className="flex items-center space-x-2 pt-1 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono font-medium">{member.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Assign Specialist to Project Team Roster">
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialist Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialist Trade Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as ConstructionTeamRole)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="ELECTRICIAN">Electrician</option>
                <option value="PLUMBER">Plumber</option>
                <option value="PAINTER">Painter</option>
                <option value="ARCHITECT">Architect / Structural Designer</option>
                <option value="MASON">Mason</option>
                <option value="GENERAL_LABOUR">General Labour Lead</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +91 98450 11223"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialization Notes</label>
              <input
                type="text"
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                placeholder="e.g. 3-Phase Concealed Conduit Layout"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Add Specialist to Roster
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
