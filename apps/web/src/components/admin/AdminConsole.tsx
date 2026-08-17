import React, { useState } from 'react';
import { AuditEvent } from '../../types';
import { Badge } from '../common/Badge';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, FileText, UserCheck } from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'verifications' | 'audit'>('verifications');

  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'vrf-1',
      name: 'BuildCraft Innovations Pvt Ltd',
      type: 'BUILDER',
      applicant: 'Manoj Verma',
      email: 'manoj@buildcraft.in',
      phone: '+91 98333 44556',
      serviceArea: 'Koramangala & HSR Layout, Bengaluru',
      gstNumber: '29AAACB1234C1Z9',
      submittedDate: '2026-08-15'
    },
    {
      id: 'vrf-2',
      name: 'Somany Flooring & Tiles Galleria',
      type: 'DEALER',
      applicant: 'Ramesh Gupta',
      email: 'contact@somanytilesworld.in',
      phone: '+91 97111 55443',
      serviceArea: 'Bengaluru South Radius 25km',
      gstNumber: '29XYZW9876Q3Z1',
      submittedDate: '2026-08-16'
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([
    {
      id: 'adt-1',
      actorId: 'usr-homeowner-1',
      actorName: 'Rajesh Kumar',
      actorRole: 'HOMEOWNER',
      action: 'CREATE_PROJECT',
      entity: 'PROJECT',
      entityId: 'prj-101',
      metadata: 'Created project Kumar Dream Villa (4BHK) with budget ₹45,00,000',
      timestamp: '2026-02-01T09:00:00.000Z'
    },
    {
      id: 'adt-2',
      actorId: 'usr-builder-1',
      actorName: 'Vikram Singh',
      actorRole: 'BUILDER',
      action: 'POST_SITE_UPDATE',
      entity: 'SITE_UPDATE',
      entityId: 'sup-1',
      metadata: 'Uploaded site photo update for milestone Ground & First Floor Superstructure (72%)',
      timestamp: '2026-08-14T14:30:00.000Z'
    },
    {
      id: 'adt-3',
      actorId: 'usr-homeowner-1',
      actorName: 'Rajesh Kumar',
      actorRole: 'HOMEOWNER',
      action: 'SUBMIT_ORDER_REQUEST',
      entity: 'ORDER',
      entityId: 'ord-902',
      metadata: 'Submitted material order request for 4 Tonnes Jindal TMT Steel Rebars',
      timestamp: '2026-08-10T09:15:00.000Z'
    }
  ]);

  const handleApprove = (id: string) => {
    const item = pendingVerifications.find(v => v.id === id);
    setPendingVerifications(prev => prev.filter(v => v.id !== id));
    if (item) {
      const newAudit: AuditEvent = {
        id: `adt-${Date.now()}`,
        actorId: 'usr-admin-1',
        actorName: 'Platform Ops Admin',
        actorRole: 'ADMIN',
        action: 'VERIFY_ACCOUNT',
        entity: item.type,
        entityId: item.id,
        metadata: `Verified ${item.type} application for ${item.name} (GST: ${item.gstNumber})`,
        timestamp: new Date().toISOString()
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }
  };

  const handleReject = (id: string) => {
    setPendingVerifications(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Operations & Admin Operations Console</h1>
          <p className="text-xs text-slate-500 mt-1">KYC/GST Verification Queue & Platform Audit Trail</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('verifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'verifications' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Verification Queue ({pendingVerifications.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'audit' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            System Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'verifications' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Pending Builder & Dealer Trust Applications</h3>
            <span className="text-xs text-slate-400 font-medium">Verify official business license & GST registrations</span>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">Verification Queue is Empty!</p>
              <p>All builder and dealer credentials have been verified.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVerifications.map((v) => (
                <div key={v.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-900">{v.name}</h4>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {v.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Applicant: {v.applicant} ({v.email}) • GST: {v.gstNumber}</p>
                    </div>
                    <Badge status="PENDING" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <span>Service Radius: <b>{v.serviceArea}</b></span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(v.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors shadow-2xs flex items-center space-x-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve Trust Badge</span>
                      </button>
                      <button
                        onClick={() => handleReject(v.id)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Platform Audit Events Chain</h3>
            <span className="text-xs text-slate-400 font-medium">Immutable audit trail of all security & financial events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Actor & Role</th>
                  <th className="px-6 py-3">Action Type</th>
                  <th className="px-6 py-3">Entity Details & Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{log.actorName}</p>
                      <span className="text-[10px] text-blue-600 font-semibold">{log.actorRole}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-800 font-mono text-[11px] px-2 py-0.5 rounded-md border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 leading-snug">
                      <span className="font-bold text-slate-800">{log.entity}</span> #{log.entityId} — {log.metadata}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
