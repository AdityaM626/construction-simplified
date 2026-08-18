import React from 'react';
import { PaymentTransaction } from '../../types';
import { Badge } from '../common/Badge';
import { CreditCard, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const payments: PaymentTransaction[] = [
    {
      id: 'pay-1001',
      projectId: 'prj-101',
      orderId: 'ord-901',
      payerId: 'usr-homeowner-1',
      payerName: 'Rajesh Kumar',
      payeeId: 'dlr-prof-1',
      payeeName: 'UltraTech Authorized Cement Depot',
      amount: 77000,
      currency: 'INR',
      paymentMethod: 'NET_BANKING',
      status: 'SUCCESS',
      transactionReference: 'TXN-SBI-20260210-998811',
      receiptUrl: '#',
      timestamp: '2026-02-10T11:25:00.000Z'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payments & Financial Receipts</h1>
          <p className="text-xs text-slate-500 mt-1">Payment abstraction transactions — Milestone tranche payments</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">Verified Payment Partner Architecture</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Payment Transaction Records</h3>
          <span className="text-xs text-slate-400 font-medium">Bank reference code linked to order IDs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Txn Ref & Date</th>
                <th className="px-6 py-3">Payer & Payee</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3">Amount (₹)</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{p.transactionReference}</p>
                    <span className="text-[10px] text-slate-400">{new Date(p.timestamp).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{p.payerName}</p>
                    <span className="text-[11px] text-slate-500">Paid to: {p.payeeName}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{(p.paymentMethod || 'Online').replace('_', ' ')}</td>
                  <td className="px-6 py-4 font-bold text-emerald-700 font-tabular text-sm">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => alert(`Downloading payment receipt: ${p.transactionReference}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg inline-flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Receipt PDF</span>
                    </button>
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
