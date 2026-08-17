import React, { useState } from 'react';
import { ChangeOrder } from '../../types';
import { Badge } from '../common/Badge';
import { GitPullRequest, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export const ChangeOrdersView: React.FC = () => {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([
    {
      id: 'cho-1',
      projectId: 'prj-101',
      title: 'Upgrade Bedroom Flooring to Italian Marble Finish Vitrified Tiles',
      reason: 'Homeowner selected premium 600x1200mm Somany Duragres vitrified tiles',
      originalScope: 'Standard 600x600mm ceramic floor tiles',
      proposedChange: 'Full body double-charged Italian marble gloss vitrified tiles',
      costImpact: 85000,
      timelineImpactDays: 3,
      requestedBy: 'Rajesh Kumar',
      requestedByRole: 'HOMEOWNER',
      status: 'APPROVED',
      approvedBy: 'Rajesh Kumar',
      approvedAt: '2026-08-01T11:00:00.000Z',
      createdAt: '2026-07-28T10:00:00.000Z'
    },
    {
      id: 'cho-2',
      projectId: 'prj-101',
      title: 'Add Extra Concealed AC Electrical Conduit Points in Living Room',
      reason: 'Additional split AC unit provision requested',
      originalScope: '1 Split AC electrical point',
      proposedChange: '2 Heavy duty 16A concealed copper wiring AC points',
      costImpact: 14500,
      timelineImpactDays: 1,
      requestedBy: 'Vikram Singh (Apex Infra)',
      requestedByRole: 'BUILDER',
      status: 'UNDER_REVIEW',
      createdAt: '2026-08-15T09:30:00.000Z'
    }
  ]);

  const handleApprove = (id: string) => {
    setChangeOrders(prev => prev.map(c => c.id === id ? { ...c, status: 'APPROVED', approvedBy: 'Rajesh Kumar' } : c));
  };

  const handleReject = (id: string) => {
    setChangeOrders(prev => prev.map(c => c.id === id ? { ...c, status: 'REJECTED' } : c));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Change Orders & Scope Revisions</h1>
          <p className="text-xs text-slate-500 mt-1">Formal scope change approvals — Complete financial & timeline transparency</p>
        </div>
      </div>

      <div className="space-y-4">
        {changeOrders.map((cho) => (
          <div key={cho.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{cho.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Reason: {cho.reason} • Requested by: {cho.requestedBy}</p>
              </div>
              <Badge status={cho.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-medium">Original Scope:</span>
                <p className="font-bold text-slate-800 mt-0.5">{cho.originalScope}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Proposed Revision:</span>
                <p className="font-bold text-blue-700 mt-0.5">{cho.proposedChange}</p>
              </div>
            </div>

            {/* Impact Calculation Panel */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-4 font-tabular">
                <div>
                  <span className="text-slate-500 block">Financial Cost Impact:</span>
                  <span className="text-base font-bold text-emerald-700">+₹{cho.costImpact.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Timeline Impact:</span>
                  <span className="text-base font-bold text-amber-700">+{cho.timelineImpactDays} Day(s)</span>
                </div>
              </div>

              {cho.status === 'UNDER_REVIEW' && (
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(cho.id)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                  >
                    Approve Scope Change
                  </button>
                  <button
                    onClick={() => handleReject(cho.id)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-slate-200 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
