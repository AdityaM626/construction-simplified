import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { ShoppingBag, Package, CheckCircle2 } from 'lucide-react';

export const DealerDashboard: React.FC = () => {
  const { setActiveTab } = useAuth();

  const orders = [
    {
      id: 'ORD-1042',
      projectName: 'Sharma Residence / Kumar Villa (4BHK)',
      contractor: 'Vikram Singh (Apex Infra)',
      item: 'UltraTech PPC Cement (50kg Bag)',
      quantity: 500,
      deliveredQty: 350,
      totalAmount: 210000,
      status: 'PARTIALLY_DELIVERED'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Shopkeeper Order Queue</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Material Orders</h1>
        <p className="text-xs text-slate-400">UltraTech Authorized Cement Depot • Outer Ring Road Outlet</p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => (
          <div key={ord.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Order #{ord.id}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Project: {ord.projectName} • Requested by: {ord.contractor}</p>
              </div>
              <Badge status={ord.status} />
            </div>

            <div className="p-5 bg-slate-50/70 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{ord.item}</span>
                <span className="text-slate-500 mt-0.5 block">500 bags ordered • 350 bags delivered (Tranche 1)</span>
              </div>
              <span className="text-lg font-bold text-emerald-700 font-tabular">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setActiveTab('inventory')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                View Warehouse Stock
              </button>
              <button
                onClick={() => setActiveTab('connected-project')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                View Connected Context
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
