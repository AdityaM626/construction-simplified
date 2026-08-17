import React from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

export const AnalyticsDashboardView: React.FC = () => {
  const metrics = {
    totalGMV: 327000,
    activeProjectsCount: 1,
    verifiedBuildersCount: 2,
    verifiedDealersCount: 3,
    onTimeDeliveryRate: 98.4,
    milestoneCompletionRate: 92.1,
    repeatPurchaseRate: 64.5
  };

  const analyticsEvents = [
    { id: 'evt-1', type: 'PROJECT_CREATED', actor: 'Rajesh Kumar (HOMEOWNER)', meta: 'Kumar Dream Villa (4BHK)', time: '2026-02-01 09:00' },
    { id: 'evt-2', type: 'ORDER_ACCEPTED', actor: 'UltraTech Cement (DEALER)', meta: 'Order #ord-901 (₹77,000)', time: '2026-02-10 11:22' },
    { id: 'evt-3', type: 'DELIVERY_COMPLETED', actor: 'Express Logistics (TRANSPORTER)', meta: 'Job #dlv-701 PoD Confirmed', time: '2026-02-11 10:45' },
    { id: 'evt-4', type: 'CHANGE_ORDER_APPROVED', actor: 'Rajesh Kumar (HOMEOWNER)', meta: 'Bedroom Flooring Upgrade (+₹85,000)', time: '2026-08-01 11:00' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Platform Analytics & Intelligence Stream</h1>
          <p className="text-xs text-slate-500 mt-1">Operational metric tracking — Asynchronous event architecture</p>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Material GMV Volume</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-tabular">₹{metrics.totalGMV.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">On-Time Delivery Rate</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-tabular">{metrics.onTimeDeliveryRate}%</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Milestone Velocity Rate</span>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-tabular">{metrics.milestoneCompletionRate}%</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Repeat Dealer Procurement</span>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-tabular">{metrics.repeatPurchaseRate}%</p>
        </div>
      </div>

      {/* Analytics Event Feed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Real-Time Event Stream Log</h3>
          <span className="text-xs text-slate-400 font-medium">Asynchronous analytics queue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Event Type</th>
                <th className="px-6 py-3">Actor Persona</th>
                <th className="px-6 py-3">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analyticsEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-500">{evt.time}</td>
                  <td className="px-6 py-4 font-mono font-bold text-blue-700">{evt.type}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{evt.actor}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{evt.meta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
