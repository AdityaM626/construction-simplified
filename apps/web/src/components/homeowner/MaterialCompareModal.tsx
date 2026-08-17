import React from 'react';
import { Modal } from '../common/Modal';
import { Product } from '../../types';
import { Check, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';

interface MaterialCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectOrder: (product: Product) => void;
}

export const MaterialCompareModal: React.FC<MaterialCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectOrder
}) => {
  if (products.length === 0) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Material Price & Specs Comparison" maxWidth="max-w-4xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-3 font-bold text-slate-500 w-44">Attribute</th>
              {products.map((p) => (
                <th key={p.id} className="p-3 font-bold text-slate-900 border-l border-slate-200 min-w-[200px]">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-3 font-semibold text-slate-500">Brand</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-200 font-bold text-slate-800">
                  {p.brand}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-500">Unit Price (₹)</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-200 font-bold text-lg text-emerald-700 font-tabular">
                  ₹{p.unitPrice.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ {p.unit}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-500">Specifications</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-200 text-slate-600 leading-snug">
                  {p.specifications}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-500">Min Order Qty (MOQ)</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-200 text-slate-800 font-medium">
                  {p.moq} {p.unit}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-500">Delivery ETA</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-200 text-slate-800 font-medium">
                  <div className="flex items-center space-x-1 text-blue-700">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{p.deliveryEtaDays} Day(s)</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-500">Supplier Dealer</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-200">
                  <p className="font-bold text-slate-900">{p.dealerName}</p>
                  <div className="flex items-center space-x-1 text-[10px] text-emerald-600 font-bold mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Dealer</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-500">Action</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 border-l border-slate-200">
                  <button
                    onClick={() => {
                      onSelectOrder(p);
                      onClose();
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Request Order</span>
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
