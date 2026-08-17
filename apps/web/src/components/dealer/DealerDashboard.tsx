import React, { useState } from 'react';
import { Product, OrderRequest } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Package, ListOrdered, CheckCircle2, XCircle, Plus, ShieldCheck } from 'lucide-react';

export const DealerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');

  const [orders, setOrders] = useState<OrderRequest[]>([
    {
      id: 'ord-901',
      projectId: 'prj-101',
      projectName: 'Kumar Dream Villa (4BHK)',
      homeownerId: 'usr-homeowner-1',
      homeownerName: 'Rajesh Kumar',
      dealerId: 'dlr-prof-1',
      dealerName: 'UltraTech Authorized Cement Depot',
      items: [
        {
          id: 'itm-1',
          productId: 'prd-1',
          productName: 'UltraTech PPC Cement (50kg Bag)',
          unitPrice: 385,
          quantity: 200,
          totalPrice: 77000
        }
      ],
      totalAmount: 77000,
      status: 'DELIVERED',
      createdAt: '2026-02-10T11:20:00.000Z',
      notes: 'Delivered to Whitefield plot site.'
    },
    {
      id: 'ord-902',
      projectId: 'prj-101',
      projectName: 'Kumar Dream Villa (4BHK)',
      homeownerId: 'usr-homeowner-1',
      homeownerName: 'Rajesh Kumar',
      dealerId: 'dlr-prof-1',
      dealerName: 'UltraTech Authorized Cement Depot',
      items: [
        {
          id: 'itm-2',
          productId: 'prd-2',
          productName: 'ACC Gold Water Shield Cement (50kg Bag)',
          unitPrice: 410,
          quantity: 50,
          totalPrice: 20500
        }
      ],
      totalAmount: 20500,
      status: 'REQUESTED',
      createdAt: '2026-08-16T10:00:00.000Z'
    }
  ]);

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
      moq: 50,
      deliveryEtaDays: 1,
      isVerifiedDealer: true,
      rating: 4.9
    },
    {
      id: 'prd-2',
      dealerId: 'dlr-prof-1',
      dealerName: 'UltraTech Authorized Cement Depot',
      name: 'ACC Gold Water Shield Cement (50kg Bag)',
      category: 'CEMENT',
      brand: 'ACC Cement',
      specifications: 'Water repellent formula with micro-fillers',
      unit: 'Bag (50 kg)',
      unitPrice: 410,
      stockQty: 850,
      moq: 40,
      deliveryEtaDays: 1,
      isVerifiedDealer: true,
      rating: 4.8
    }
  ]);

  const updateOrderStatus = (orderId: string, status: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dealer Portal & Order Fulfilment</h1>
          <p className="text-xs text-slate-500 mt-1">UltraTech Authorized Cement Depot • GST Verified</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Order Requests ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Catalog & Stock ({products.length})
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Incoming Order Requests Queue</h3>
            <span className="text-xs text-slate-400 font-medium">Real-time homeowner procurement requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Project & Homeowner</th>
                  <th className="px-6 py-3">Items & Quantity</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">{ord.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{ord.projectName}</p>
                      <span className="text-[11px] text-slate-500">{ord.homeownerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      {ord.items.map((itm) => (
                        <span key={itm.id} className="block text-slate-800 font-medium">
                          {itm.quantity} x {itm.productName}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-700 font-tabular">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={ord.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ord.status === 'REQUESTED' ? (
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'ACCEPTED')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'REJECTED')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-rose-600 rounded-lg text-[11px] font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : ord.status === 'ACCEPTED' ? (
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'DELIVERED')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">No pending action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Store Catalog & Availability</h3>
            <button
              onClick={() => alert('New product entry form')}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                    <span className="text-[10px] text-slate-500">{p.brand} • {p.specifications}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-tabular">₹{p.unitPrice} / {p.unit}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200 pt-2 font-medium">
                  <span>In Stock: <b className="text-slate-800">{p.stockQty}</b></span>
                  <span>MOQ: <b>{p.moq}</b></span>
                  <span>ETA: <b>{p.deliveryEtaDays}d</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
