import React from 'react';
import { Badge } from '../common/Badge';
import { Search, CheckCircle2, ShieldCheck, FileSpreadsheet, ArrowRight } from 'lucide-react';

export const OwnerMaterialTraceabilityView: React.FC = () => {
  const materials = [
    {
      requirementId: 'req-101',
      category: 'CEMENT',
      itemName: 'UltraTech PPC Cement (50kg Bags)',
      specification: 'Grade 53 PPC Cement for slab shuttering & column casting',
      requiredQty: 500,
      orderedQty: 500,
      deliveredQty: 350,
      remainingQty: 150,
      unit: 'Bag',
      contractorName: 'Apex Infrastructure & Builders',
      supplierName: 'UltraTech Authorized Cement Depot',
      orderId: 'ORD-1042',
      orderStatus: 'PARTIALLY_DELIVERED',
      orderedDate: '17 Aug 2026',
      deliveredDate: '18 Aug 2026 (Tranche 1)',
      invoiceNumber: 'INV-ORD-1042',
      paymentStatus: 'PAID (Tranche 1)',
      totalValue: 210000
    },
    {
      requirementId: 'req-102',
      category: 'STEEL',
      itemName: 'Jindal Panther TMT Rebars 12mm',
      specification: 'Fe 550D High ductility earthquake resistant rebars',
      requiredQty: 10,
      orderedQty: 4,
      deliveredQty: 0,
      remainingQty: 6,
      unit: 'Tonne',
      contractorName: 'Apex Infrastructure & Builders',
      supplierName: 'Jindal TMT & Steel Stockist Hub',
      orderId: 'ORD-1043',
      orderStatus: 'ORDERED',
      orderedDate: '08 Aug 2026',
      deliveredDate: 'Pending',
      invoiceNumber: 'INV-ORD-1043',
      paymentStatus: 'COMMITTED',
      totalValue: 625000
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Owner OS Material Traceability</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">7-Point Material Audit Trail</h1>
        <p className="text-xs text-slate-400">Complete transparency on who requested, who supplied, unit prices, and project budget impact</p>
      </div>

      <div className="space-y-6">
        {materials.map((m) => (
          <div key={m.requirementId} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {m.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{m.itemName}</h3>
                <p className="text-xs text-slate-400">{m.specification}</p>
              </div>
              <span className="text-lg font-bold text-slate-900 font-tabular">₹{m.totalValue.toLocaleString('en-IN')}</span>
            </div>

            {/* 7-Point Audit Traceability Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/70 p-5 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block font-medium">1. Quantities:</span>
                <p className="font-bold text-slate-900 mt-0.5">Req: {m.requiredQty} • Del: {m.deliveredQty} {m.unit}s</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">2. Who Requested:</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{m.contractorName}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">3. Who Supplied:</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{m.supplierName}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">4. Order Status:</span>
                <p className="font-bold text-blue-600 mt-0.5">{m.orderStatus}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">5. Ordered Date:</span>
                <p className="font-bold text-slate-800 mt-0.5">{m.orderedDate}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">6. Invoice Number:</span>
                <p className="font-bold text-slate-800 mt-0.5 font-mono">{m.invoiceNumber}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">7. Payment State:</span>
                <p className="font-bold text-emerald-600 mt-0.5">{m.paymentStatus}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Remaining Gap:</span>
                <p className="font-bold text-amber-600 mt-0.5">{m.remainingQty} {m.unit}s</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
