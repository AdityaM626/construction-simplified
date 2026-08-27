import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FileSpreadsheet, Plus, DollarSign, Calculator, Trash2 } from 'lucide-react';

export const BOQEstimationView: React.FC = () => {
  const [boqItems, setBoqItems] = useState([
    {
      id: 'boq-1',
      category: 'CEMENT',
      itemName: 'UltraTech PPC Cement (50kg Bags)',
      description: 'Grade 53 PPC Cement for columns & roof slab shuttering',
      quantity: 1200,
      unit: 'Bag',
      estimatedRate: 420,
      estimatedTotal: 504000
    },
    {
      id: 'boq-2',
      category: 'STEEL',
      itemName: 'Jindal Panther TMT Rebars 12mm',
      description: 'Fe 550D High ductility earthquake resistant rebars',
      quantity: 15,
      unit: 'Tonne',
      estimatedRate: 62500,
      estimatedTotal: 937500
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [category, setCategory] = useState('CEMENT');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState('Bag');
  const [estimatedRate, setEstimatedRate] = useState('420');

  const totalEstimate = boqItems.reduce((sum, item) => sum + item.estimatedTotal, 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity) || 1;
    const rate = Number(estimatedRate) || 0;
    const newItem = {
      id: `boq-${Date.now()}`,
      category,
      itemName: itemName || 'New Material Item',
      description: description || '',
      quantity: qty,
      unit: unit || 'Unit',
      estimatedRate: rate,
      estimatedTotal: qty * rate
    };
    setBoqItems([...boqItems, newItem]);
    setItemName('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Contractor OS BOQ & Estimation</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Bill of Quantities (BOQ)</h1>
          <p className="text-xs text-slate-400">Sharma Residence / Kumar Villa (4BHK) • Baseline Budget Allocation</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add BOQ Item</span>
        </button>
      </div>

      {/* BOQ Summary Card */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2">
        <span className="text-xs font-semibold text-slate-400">Calculated BOQ Total Estimate</span>
        <p className="text-3xl font-bold text-emerald-400 font-tabular">₹{totalEstimate.toLocaleString('en-IN')}</p>
        <span className="text-xs text-slate-400 block">{boqItems.length} items in baseline bill of quantities</span>
      </div>

      {/* BOQ Items Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="px-6 py-4">Category & Item</th>
                <th className="px-6 py-4">Qty & Unit</th>
                <th className="px-6 py-4">Est. Rate</th>
                <th className="px-6 py-4">Est. Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {boqItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md block w-fit mb-1">
                      {item.category}
                    </span>
                    <span className="font-bold text-slate-900 block">{item.itemName}</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">{item.description}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.quantity} {item.unit}s</td>
                  <td className="px-6 py-4 font-mono font-medium">₹{item.estimatedRate}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 font-tabular">₹{item.estimatedTotal.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add BOQ Item Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add BOQ Item to Estimate">
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Material Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="CEMENT">Cement</option>
                <option value="STEEL">Steel Rebars</option>
                <option value="BRICKS">Bricks & Blocks</option>
                <option value="TILES">Tiles & Flooring</option>
                <option value="ELECTRICAL">Electrical Conduit</option>
                <option value="PLUMBING">Plumbing Pipes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Item Name</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="e.g. UltraTech PPC Cement (50kg Bag)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description / Specification</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Grade 53 PPC for slab casting"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  placeholder="Bag, Tonne, SqFt"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rate (₹)</label>
                <input
                  type="number"
                  required
                  value={estimatedRate}
                  onChange={e => setEstimatedRate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                Add BOQ Item
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
