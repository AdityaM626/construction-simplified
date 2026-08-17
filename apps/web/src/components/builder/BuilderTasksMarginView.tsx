import React, { useState } from 'react';
import { TaskItem, WorkforceTeam } from '../../types';
import { Badge } from '../common/Badge';
import { CheckSquare, Users, TrendingUp, DollarSign, Plus } from 'lucide-react';

export const BuilderTasksMarginView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'tsk-1',
      projectId: 'prj-101',
      milestoneId: 'mls-2',
      title: 'Perform First Floor Slab Shuttering Safety Check',
      assignedTo: 'Vikram Singh',
      priority: 'HIGH',
      status: 'COMPLETED',
      dueDate: '2026-08-14'
    },
    {
      id: 'tsk-2',
      projectId: 'prj-101',
      milestoneId: 'mls-2',
      title: 'Verify Concealed Electrical PVC Conduit Slots',
      assignedTo: 'Ramesh Electrician',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: '2026-08-20'
    }
  ]);

  const workforce: WorkforceTeam[] = [
    {
      id: 'wfk-1',
      builderId: 'usr-builder-1',
      teamName: 'RCC Masonry Team Alpha',
      trade: 'Civil Masonry & Concrete Pouring',
      workerCount: 14,
      dailyRateTotal: 16800,
      status: 'ACTIVE'
    }
  ];

  // Financial Profit Margin Calculation Model
  const contractValue = 4500000;
  const actualCivilCost = 1820000;
  const committedCost = 850000;
  const labourExpenses = 350000;
  const totalExpenses = actualCivilCost + committedCost + labourExpenses;
  const projectedProfit = contractValue - totalExpenses;
  const profitMarginPct = ((projectedProfit / contractValue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Builder Execution Tasks & Profit Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">Apex Infrastructure • Internal contractor margin & task management</p>
        </div>
      </div>

      {/* Builder Margin Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Contract Revenue</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-tabular">₹{contractValue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Total Project Expenses</span>
          <p className="text-2xl font-bold text-rose-700 mt-1 font-tabular">₹{totalExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Projected Builder Profit</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-tabular">₹{projectedProfit.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Net Profit Margin</span>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-tabular">{profitMarginPct}%</p>
        </div>
      </div>

      {/* Task Kanban & Workforce Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Project Task Board</h3>
            <button
              onClick={() => alert('New Task Modal')}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{t.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Assigned to: {t.assignedTo} • Due: {t.dueDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                    {t.priority}
                  </span>
                  <Badge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workforce Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Active Workforce Teams</h3>
          {workforce.map((w) => (
            <div key={w.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">{w.teamName}</h4>
                  <span className="text-slate-500">{w.trade}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {w.status}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-medium text-slate-600">
                <span>Workers Onsite: <b>{w.workerCount}</b></span>
                <span>Daily Wage Total: <b>₹{w.dailyRateTotal}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
