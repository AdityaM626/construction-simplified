import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ShoppingCart, Plus, Building2, CheckCircle2, FileText } from 'lucide-react';

export const InternalProcurementView: React.FC = () => {
  const [procurements, setProcurements] = useState([
    {
      id: 'proc-101',
      vendorName: 'Sri Balaji Cement Traders',
      category: 'CEMENT',
      itemName: 'UltraTech PPC Cement (50kg Bag)',
      quantity: 500,
      unit: 'Bag',
      unitRate: 420,
      totalAmount: 210000,
      invoiceNumber: 'INV-SBC-9921',
      purchaseDate: '2026-08-17',
      deliveryDate: '2026-08-18',
      paymentStatus: 'PAID'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('500');
  const [unitRate, setUnitRate] = useState('420');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const handleAddProcurement = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity) || 1;
    const rate = Number(unitRate) || 0;
    const newRecord = {
      id: `proc-${Date.now()}`,
      vendorName: vendorName || 'Vendor Supplier',
      category: 'CEMENT',
      itemName: itemName || 'Material Item',
      quantity: qty,
      unit: 'Unit',
      unitRate: rate,
      totalAmount: qty * rate,
      invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
      purchaseDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'PAID'
    };

    setProcurements([newRecord, ...procurements]);
    setVendorName('');
    setItemName('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Contractor OS Internal Ops</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Internal Vendor Procurement Records</h1>
          <p className="text-xs text-slate-400">Record vendor material purchases internally without requiring vendor logins</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Vendor Purchase</span>
        </button>
      </div>

      <div className="space-y-4">
        {procurements.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {p.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{p.itemName}</h3>
                <p className="text-xs text-slate-400">Vendor: <b className="text-slate-700">{p.vendorName}</b> • Invoice #{p.invoiceNumber}</p>
              </div>
              <span className="text-lg font-bold text-emerald-700 font-tabular">₹{p.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/70 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Quantity</span>
                <p className="font-bold text-slate-900 mt-0.5">{p.quantity} {p.unit}s</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Unit Rate</span>
                <p className="font-bold text-slate-900 mt-0.5">₹{p.unitRate}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Purchase Date</span>
                <p className="font-bold text-slate-800 mt-0.5">{p.purchaseDate}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Payment Status</span>
                <p className="font-bold text-emerald-600 mt-0.5">{p.paymentStatus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Log Internal Vendor Purchase Record">
          <form onSubmit={handleAddProcurement} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vendor / Supplier Name</label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
                placeholder="e.g. Sri Balaji Cement Traders"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Material Item Name</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="e.g. UltraTech PPC Cement"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit Rate (₹)</label>
                <input
                  type="number"
                  required
                  value={unitRate}
                  onChange={e => setUnitRate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Invoice #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)}
                  placeholder="INV-1092"
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
                Log Purchase Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
