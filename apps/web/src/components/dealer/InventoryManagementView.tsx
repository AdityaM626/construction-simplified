import React, { useState } from 'react';
import { InventoryMovement, Product } from '../../types';
import { Modal } from '../common/Modal';
import { Package, RefreshCw, AlertTriangle, ShieldCheck, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const InventoryManagementView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prd-1',
      dealerId: 'dlr-prof-1',
      dealerName: 'UltraTech Authorized Cement Depot',
      name: 'UltraTech PPC Cement (50kg Bag)',
      category: 'CEMENT',
      brand: 'UltraTech Cement',
      specifications: 'Portland Pozzolana Cement Grade 53, ISO Certified',
      unit: 'Bag (50 kg)',
      unitPrice: 385,
      stockQty: 1200,
      availableQty: 1000,
      reservedQty: 200,
      moq: 50,
      deliveryEtaDays: 1,
      isVerifiedDealer: true,
      rating: 4.9,
      stockStatus: 'IN_STOCK'
    }
  ]);

  const [movements, setMovements] = useState<InventoryMovement[]>([
    {
      id: 'inv-mov-1',
      productId: 'prd-1',
      productName: 'UltraTech PPC Cement (50kg Bag)',
      dealerId: 'dlr-prof-1',
      type: 'RESERVATION',
      quantityChange: -200,
      previousQty: 1200,
      newQty: 1000,
      reason: 'Order #ord-901 accepted — 200 bags reserved for delivery',
      timestamp: '2026-02-10T11:22:00.000Z'
    }
  ]);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustQty, setAdjustQty] = useState('100');
  const [adjustReason, setAdjustReason] = useState('Fresh shipment received from UltraTech plant');

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyChange = Number(adjustQty);
    const prod = products[0];
    const prev = prod.availableQty || 0;
    prod.availableQty = prev + qtyChange;
    prod.stockQty = (prod.availableQty || 0) + (prod.reservedQty || 0);

    const newMov: InventoryMovement = {
      id: `inv-mov-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      dealerId: prod.dealerId,
      type: 'STOCK_ADDITION',
      quantityChange: qtyChange,
      previousQty: prev,
      newQty: prod.availableQty || 0,
      reason: adjustReason,
      timestamp: new Date().toISOString()
    };

    setMovements([newMov, ...movements]);
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Real-Time Inventory & Stock Allocation</h1>
          <p className="text-xs text-slate-500 mt-1">UltraTech Cement Depot • Available-to-Sell vs Reserved Allocation</p>
        </div>
        <button
          onClick={() => setIsAdjustModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Stock Replenishment / Correction</span>
        </button>
      </div>

      {/* Product Stock Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Available-to-Sell Inventory Ledger</h3>
        
        {products.map((p) => (
          <div key={p.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                <p className="text-xs text-slate-500">{p.brand} • Unit: {p.unit}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                {p.stockStatus}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block font-medium">Total Warehouse Stock:</span>
                <span className="font-bold text-slate-900 text-sm font-tabular">{p.stockQty} {p.unit}s</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Available-to-Sell:</span>
                <span className="font-bold text-emerald-700 text-sm font-tabular">{p.availableQty} {p.unit}s</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Reserved for Orders:</span>
                <span className="font-bold text-amber-600 text-sm font-tabular">{p.reservedQty} {p.unit}s</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Movements Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Auditable Inventory Movement Chain</h3>
          <span className="text-xs text-slate-400 font-medium">All additions, reservations, and dispatches logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Movement Type</th>
                <th className="px-6 py-3">Qty Change</th>
                <th className="px-6 py-3">Prev &rarr; New Qty</th>
                <th className="px-6 py-3">Audit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-500">{new Date(mov.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{mov.productName}</td>
                  <td className="px-6 py-4 font-bold text-blue-700">{mov.type}</td>
                  <td className="px-6 py-4 font-bold font-tabular">
                    <span className={(mov.quantityChange || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {(mov.quantityChange || 0) >= 0 ? `+${mov.quantityChange || 0}` : (mov.quantityChange || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{mov.previousQty} &rarr; {mov.newQty}</td>
                  <td className="px-6 py-4 text-slate-600 leading-snug">{mov.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} title="Stock Replenishment / Correction">
        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Adjustment Quantity (+/-)</label>
            <input
              type="number"
              required
              value={adjustQty}
              onChange={e => setAdjustQty(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-tabular"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Audit Log Reason</label>
            <input
              type="text"
              required
              value={adjustReason}
              onChange={e => setAdjustReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={() => setIsAdjustModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Log Movement & Adjust Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
