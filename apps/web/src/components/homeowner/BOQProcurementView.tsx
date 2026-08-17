import React from 'react';
import { BOQ } from '../../types';
import { Badge } from '../common/Badge';
import { FileSpreadsheet, ShoppingBag, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BOQProcurementView: React.FC = () => {
  const { setActiveTab } = useAuth();

  const boq: BOQ = {
    id: 'boq-101',
    projectId: 'prj-101',
    title: 'Master Civil & Structural Bill of Quantities',
    totalEstimatedValue: 2400000,
    orderedValue: 1050000,
    deliveredValue: 77000,
    createdAt: '2026-02-02T10:00:00.000Z',
    items: [
      {
        id: 'boq-itm-1',
        boqId: 'boq-101',
        category: 'CEMENT',
        itemName: 'UltraTech PPC Grade 53 Cement',
        specification: '50kg Bags, ISO Certified',
        requiredQty: 500,
        orderedQty: 350,
        deliveredQty: 200,
        unit: 'Bag',
        estimatedUnitPrice: 390,
        estimatedTotal: 195000,
        matchedProductId: 'prd-1',
        status: 'PARTIALLY_ORDERED'
      },
      {
        id: 'boq-itm-2',
        boqId: 'boq-101',
        category: 'STEEL',
        itemName: 'Jindal TMT Steel Rebars 12mm',
        specification: 'Fe 550D High Ductility Rebars',
        requiredQty: 10,
        orderedQty: 4,
        deliveredQty: 0,
        unit: 'Tonne',
        estimatedUnitPrice: 63000,
        estimatedTotal: 630000,
        matchedProductId: 'prd-3',
        status: 'ORDERED'
      },
      {
        id: 'boq-itm-3',
        boqId: 'boq-101',
        category: 'TILES',
        itemName: 'Somany Vitrified Italian Marble Floor Tiles',
        specification: '600x1200mm Double Charged Vitrified',
        requiredQty: 1200,
        orderedQty: 0,
        deliveredQty: 0,
        unit: 'Sq Ft',
        estimatedUnitPrice: 85,
        estimatedTotal: 102000,
        matchedProductId: 'prd-5',
        status: 'PLANNED'
      }
    ]
  };

  const remainingValue = boq.totalEstimatedValue - boq.orderedValue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project BOQ & Procurement Gap</h1>
          <p className="text-xs text-slate-500 mt-1">Bill of Quantities project-level procurement planning</p>
        </div>
        <button
          onClick={() => setActiveTab('materials')}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Procure Missing Materials</span>
        </button>
      </div>

      {/* Procurement Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Total BOQ Estimate</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-tabular">₹{boq.totalEstimatedValue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Ordered to Date</span>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-tabular">₹{boq.orderedValue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Delivered & Verified</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1 font-tabular">₹{boq.deliveredValue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Remaining Gap</span>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-tabular">₹{remainingValue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* BOQ Items & Gap Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Procurement Gap Breakdown (Required vs Delivered)</h3>
        
        <div className="space-y-4">
          {boq.items.map((item) => {
            const remainingQty = item.requiredQty - item.orderedQty;
            const pctOrdered = ((item.orderedQty / item.requiredQty) * 100).toFixed(0);
            return (
              <div key={item.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.itemName}</h4>
                    <p className="text-xs text-slate-500">{item.specification}</p>
                  </div>
                  <Badge status={item.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-lg border border-slate-200/80 font-medium">
                  <div>
                    <span className="text-slate-400 block">Required:</span>
                    <span className="font-bold text-slate-900">{item.requiredQty} {item.unit}s</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ordered:</span>
                    <span className="font-bold text-amber-600">{item.orderedQty} {item.unit}s</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Delivered:</span>
                    <span className="font-bold text-emerald-600">{item.deliveredQty} {item.unit}s</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Remaining Gap:</span>
                    <span className="font-bold text-blue-600">{remainingQty} {item.unit}s</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Fulfilment Progress</span>
                    <span>{pctOrdered}% Ordered</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pctOrdered}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
