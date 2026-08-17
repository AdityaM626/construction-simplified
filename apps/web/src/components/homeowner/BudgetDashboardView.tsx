import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, PieChart, Info, CheckCircle2 } from 'lucide-react';

export const BudgetDashboardView: React.FC = () => {
  const totalBudget = 4500000;
  const spentCost = 1820000;
  const committedCost = 850000;
  const remainingBudget = totalBudget - (spentCost + committedCost);

  const categories = [
    { name: 'Civil & Foundation RCC', budget: 900000, spent: 900000, committed: 0, status: 'COMPLETED' },
    { name: 'Superstructure & Masonry', budget: 1500000, spent: 670000, committed: 410000, status: 'IN_PROGRESS' },
    { name: 'Electrical & Plumbing Rough-in', budget: 700000, spent: 250000, committed: 250000, status: 'IN_PROGRESS' },
    { name: 'Flooring, Plaster & Painting', budget: 1400000, spent: 0, committed: 190000, status: 'PLANNED' },
  ];

  const ledgerItems = [
    { id: 'tx-1', date: '2026-08-10', description: '4 Tonnes Jindal TMT Steel Rebars (Fe 550D)', category: 'Superstructure', amount: 250000, status: 'COMMITTED', vendor: 'Jindal Steel Stockist Hub' },
    { id: 'tx-2', date: '2026-02-10', description: '200 Bags UltraTech PPC Cement Batch #1', category: 'Civil Foundation', amount: 77000, status: 'PAID', vendor: 'UltraTech Cement Depot' },
    { id: 'tx-3', date: '2026-03-12', description: 'Foundation Subcontractor Work Tranche #1', category: 'Civil Foundation', amount: 900000, status: 'PAID', vendor: 'Apex Infrastructure' },
    { id: 'tx-4', date: '2026-05-20', description: 'Superstructure Slab Masonry Tranche #2', category: 'Superstructure', amount: 670000, status: 'PAID', vendor: 'Apex Infrastructure' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Budget & Spending Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">Transparent financial breakdown — No hidden overruns</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">100% Traceable Accounting</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Total Allocated Budget</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-tabular">₹{totalBudget.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Actual Paid Out</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-tabular">₹{spentCost.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-400 font-medium">Invoices settled</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Committed Orders</span>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-tabular">₹{committedCost.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-400 font-medium">Approved orders pending delivery</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Uncommitted Buffer</span>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-tabular">₹{remainingBudget.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-400 font-medium">Available balance</span>
        </div>
      </div>

      {/* Category Spending Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Budget Allocation by Construction Domain</h3>
        <div className="space-y-4">
          {categories.map((cat, idx) => {
            const pctSpent = ((cat.spent + cat.committed) / cat.budget) * 100;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{cat.name}</span>
                  <div className="flex items-center space-x-3 font-tabular">
                    <span className="text-slate-500">Budget: ₹{cat.budget.toLocaleString('en-IN')}</span>
                    <span className="text-emerald-700 font-bold">Spent: ₹{cat.spent.toLocaleString('en-IN')}</span>
                    {cat.committed > 0 && <span className="text-amber-600 font-bold">Committed: ₹{cat.committed.toLocaleString('en-IN')}</span>}
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-600 h-full" style={{ width: `${(cat.spent / cat.budget) * 100}%` }} title="Spent" />
                  <div className="bg-amber-500 h-full" style={{ width: `${(cat.committed / cat.budget) * 100}%` }} title="Committed" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Transaction Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Traceable Transaction Ledger</h3>
          <span className="text-xs text-slate-500 font-medium">All financial events logged to audit chain</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description & Vendor</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Amount (₹)</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgerItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-500">{item.date}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{item.description}</p>
                    <span className="text-[11px] text-slate-500">{item.vendor}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.category}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 font-tabular">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
