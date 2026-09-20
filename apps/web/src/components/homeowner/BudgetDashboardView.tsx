import React, { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, PieChart, Info, CheckCircle2, Edit3, Save } from 'lucide-react';
import { Modal } from '../common/Modal';

export const BudgetDashboardView: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState(4500000);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [categories, setCategories] = useState([
    { id: 'cat-1', name: 'Civil & Foundation RCC', budget: 900000, spent: 900000, committed: 0, status: 'COMPLETED' },
    { id: 'cat-2', name: 'Superstructure & Masonry', budget: 1500000, spent: 670000, committed: 410000, status: 'IN_PROGRESS' },
    { id: 'cat-3', name: 'Electrical & Plumbing Rough-in', budget: 700000, spent: 250000, committed: 250000, status: 'IN_PROGRESS' },
    { id: 'cat-4', name: 'Flooring, Plaster & Painting', budget: 1400000, spent: 0, committed: 190000, status: 'PLANNED' },
  ]);

  const [ledgerItems] = useState([
    { id: 'tx-1', date: '2026-08-10', description: '4 Tonnes Jindal TMT Steel Rebars (Fe 550D)', category: 'Superstructure', amount: 250000, status: 'COMMITTED', vendor: 'Jindal Steel Stockist Hub' },
    { id: 'tx-2', date: '2026-02-10', description: '200 Bags UltraTech PPC Cement Batch #1', category: 'Civil Foundation', amount: 77000, status: 'PAID', vendor: 'UltraTech Cement Depot' },
    { id: 'tx-3', date: '2026-03-12', description: 'Foundation Subcontractor Work Tranche #1', category: 'Civil Foundation', amount: 900000, status: 'PAID', vendor: 'Apex Infrastructure' },
    { id: 'tx-4', date: '2026-05-20', description: 'Superstructure Slab Masonry Tranche #2', category: 'Superstructure', amount: 670000, status: 'PAID', vendor: 'Apex Infrastructure' },
  ]);

  const spentCost = categories.reduce((sum, c) => sum + c.spent, 0);
  const committedCost = categories.reduce((sum, c) => sum + c.committed, 0);
  const remainingBudget = totalBudget - (spentCost + committedCost);

  // Modal State for Budget Configuration
  const [tempTotalBudget, setTempTotalBudget] = useState(totalBudget);
  const [tempCategories, setTempCategories] = useState([...categories]);

  const handleOpenConfigModal = () => {
    setTempTotalBudget(totalBudget);
    setTempCategories([...categories]);
    setIsConfigModalOpen(true);
  };

  const handleCategoryBudgetChange = (id: string, newBudget: number) => {
    setTempCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, budget: newBudget } : c))
    );
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setTotalBudget(tempTotalBudget);
    setCategories(tempCategories);
    setIsConfigModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Financial Control Center</span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Project Budget & Spending Ledger</h1>
          <p className="text-xs text-slate-500">Transparent financial breakdown — Configured baseline & 100% traceable accounting</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleOpenConfigModal}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Configure Baseline Budget</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">100% Traceable Accounting</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Total Allocated Budget</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-tabular">₹{totalBudget.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-blue-600 font-medium">Configured baseline</span>
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
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Budget Allocation by Construction Domain</h3>
          <span className="text-xs text-slate-400">Owner-managed category caps</span>
        </div>
        <div className="space-y-4">
          {categories.map((cat) => {
            const pctSpent = ((cat.spent + cat.committed) / cat.budget) * 100;
            return (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{cat.name}</span>
                  <div className="flex items-center space-x-3 font-tabular">
                    <span className="text-slate-500">Budget: ₹{cat.budget.toLocaleString('en-IN')}</span>
                    <span className="text-emerald-700 font-bold">Spent: ₹{cat.spent.toLocaleString('en-IN')}</span>
                    {cat.committed > 0 && <span className="text-amber-600 font-bold">Committed: ₹{cat.committed.toLocaleString('en-IN')}</span>}
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-600 h-full" style={{ width: `${Math.min(100, (cat.spent / cat.budget) * 100)}%` }} title="Spent" />
                  <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, (cat.committed / cat.budget) * 100)}%` }} title="Committed" />
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
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {ledgerItems.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 text-slate-500">{tx.date}</td>
                  <td className="px-6 py-3.5">
                    <p className="font-bold text-slate-900">{tx.description}</p>
                    <p className="text-[11px] text-slate-400">{tx.vendor}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-bold font-tabular text-slate-900">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      ● {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✏️ CONFIGURE BASELINE BUDGET MODAL */}
      <Modal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} title="Configure Baseline Project Budget ✏️" maxWidth="max-w-xl">
        <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Total Target Baseline Budget (₹)</label>
            <input
              type="number"
              value={tempTotalBudget}
              onChange={(e) => setTempTotalBudget(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 font-tabular text-sm"
              step={50000}
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Baseline agreed project budget (e.g. ₹45,00,000)</span>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 block">Category Budget Allocations</label>
            {tempCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="truncate">
                  <span className="font-bold text-slate-900 block truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">Spent: ₹{cat.spent.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-36 shrink-0">
                  <input
                    type="number"
                    value={cat.budget}
                    onChange={(e) => handleCategoryBudgetChange(cat.id, Number(e.target.value))}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-right font-tabular text-xs"
                    step={10000}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Allocated Sum: <b>₹{tempCategories.reduce((s, c) => s + c.budget, 0).toLocaleString('en-IN')}</b>
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Baseline Budget</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
