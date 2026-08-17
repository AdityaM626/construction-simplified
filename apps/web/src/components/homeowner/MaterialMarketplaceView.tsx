import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types';
import { MaterialCompareModal } from './MaterialCompareModal';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Search, Filter, ShieldCheck, ShoppingCart, Truck, Scale, CheckCircle2 } from 'lucide-react';

export const MaterialMarketplaceView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(100);
  const [orderSubmittedSuccess, setOrderSubmittedSuccess] = useState(false);

  const initialProducts: Product[] = [
    {
      id: 'prd-1',
      dealerId: 'dlr-prof-1',
      dealerName: 'UltraTech Authorized Cement Depot',
      name: 'UltraTech PPC Cement (50kg Bag)',
      category: 'CEMENT',
      brand: 'UltraTech Cement',
      specifications: 'Portland Pozzolana Cement Grade 53, ISO Certified, High early strength',
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
      specifications: 'Water repellent formula with micro-fillers for damp-proof construction',
      unit: 'Bag (50 kg)',
      unitPrice: 410,
      stockQty: 850,
      moq: 40,
      deliveryEtaDays: 1,
      isVerifiedDealer: true,
      rating: 4.8
    },
    {
      id: 'prd-3',
      dealerId: 'dlr-prof-2',
      dealerName: 'Jindal TMT & Steel Stockist Hub',
      name: 'Jindal Panther TMT Rebars 12mm (Fe 550D)',
      category: 'STEEL',
      brand: 'Jindal Panther',
      specifications: 'High ductility Fe 550D earthquake resistant rib design steel rebars',
      unit: 'Tonne',
      unitPrice: 62500,
      stockQty: 45,
      moq: 1,
      deliveryEtaDays: 2,
      isVerifiedDealer: true,
      rating: 4.9
    },
    {
      id: 'prd-4',
      dealerId: 'dlr-prof-2',
      dealerName: 'Jindal TMT & Steel Stockist Hub',
      name: 'Tata Tiscon 550SD TMT Steel Bars 16mm',
      category: 'STEEL',
      brand: 'Tata Tiscon',
      specifications: 'Super ductile earthquake-resistant TMT steel, GreenPro certified',
      unit: 'Tonne',
      unitPrice: 64800,
      stockQty: 30,
      moq: 1,
      deliveryEtaDays: 2,
      isVerifiedDealer: true,
      rating: 4.9
    },
    {
      id: 'prd-5',
      dealerId: 'dlr-prof-3',
      dealerName: 'Somany Tiles & Flooring Galleria',
      name: 'Somany Duragres Vitrified Floor Tiles (600x1200mm)',
      category: 'TILES',
      brand: 'Somany Ceramics',
      specifications: 'Full body double charged stain-resistant high gloss Italian marble finish',
      unit: 'Sq Ft',
      unitPrice: 85,
      stockQty: 5000,
      moq: 200,
      deliveryEtaDays: 3,
      isVerifiedDealer: true,
      rating: 4.7
    },
    {
      id: 'prd-6',
      dealerId: 'dlr-prof-3',
      dealerName: 'Somany Tiles & Flooring Galleria',
      name: 'Kajaria Premium Anti-Skid Bathroom Tiles (300x300mm)',
      category: 'TILES',
      brand: 'Kajaria',
      specifications: 'Matte finish ceramic tiles with R10 anti-slip rating',
      unit: 'Sq Ft',
      unitPrice: 62,
      stockQty: 3500,
      moq: 100,
      deliveryEtaDays: 2,
      isVerifiedDealer: true,
      rating: 4.8
    }
  ];

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Materials' },
    { id: 'CEMENT', label: 'Cement & Chemicals' },
    { id: 'STEEL', label: 'Steel & Rebars' },
    { id: 'TILES', label: 'Tiles & Flooring' },
    { id: 'ELECTRICAL', label: 'Electrical' },
    { id: 'PLUMBING', label: 'Plumbing & Pipes' },
  ];

  const toggleCompare = (prod: Product) => {
    if (compareList.some(p => p.id === prod.id)) {
      setCompareList(prev => prev.filter(p => p.id !== prod.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 materials at a time.');
        return;
      }
      setCompareList(prev => [...prev, prod]);
    }
  };

  const filteredProducts = initialProducts.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.specifications.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmittedSuccess(true);
    setTimeout(() => {
      setOrderSubmittedSuccess(false);
      setSelectedProductForOrder(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Verified Material Marketplace</h1>
          <p className="text-xs text-slate-500 mt-1">Direct from verified stockists & manufacturers — Wholesale pricing</p>
        </div>
        {compareList.length > 0 && (
          <button
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md animate-bounce"
          >
            <Scale className="w-4 h-4" />
            <span>Compare Selected ({compareList.length})</span>
          </button>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search cement, steel rebars, tiles..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto w-full pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isSelectedForCompare = compareList.some(p => p.id === product.id);
          return (
            <div
              key={product.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {product.brand}
                  </span>
                  <div className="flex items-center space-x-1 text-emerald-600 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Dealer</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2">{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{product.specifications}</p>
                <span className="text-[11px] text-slate-400 block mt-1">Supplier: {product.dealerName}</span>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Price per unit:</span>
                    <p className="text-xl font-bold text-slate-900 font-tabular">
                      ₹{product.unitPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500">/ {product.unit}</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <span>MOQ: <b>{product.moq}</b></span>
                    <span className="block text-blue-600 font-medium">ETA: {product.deliveryEtaDays} Day(s)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleCompare(product)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center space-x-1 ${
                      isSelectedForCompare
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isSelectedForCompare ? 'Added' : 'Compare'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProductForOrder(product);
                      setOrderQuantity(product.moq);
                    }}
                    className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      <MaterialCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={compareList}
        onSelectOrder={(p) => {
          setSelectedProductForOrder(p);
          setOrderQuantity(p.moq);
        }}
      />

      {/* Order Request Modal */}
      {selectedProductForOrder && (
        <Modal
          isOpen={!!selectedProductForOrder}
          onClose={() => setSelectedProductForOrder(null)}
          title={`Material Order Request — ${selectedProductForOrder.name}`}
        >
          {orderSubmittedSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Order Request Submitted!</h3>
              <p className="text-xs text-slate-500">Dealer has been notified. Estimated cost linked to project budget.</p>
            </div>
          ) : (
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p className="font-bold text-slate-900">{selectedProductForOrder.name}</p>
                <p className="text-slate-500">Supplier: {selectedProductForOrder.dealerName}</p>
                <div className="flex items-center justify-between font-tabular pt-2 border-t border-slate-200">
                  <span>Unit Price: ₹{selectedProductForOrder.unitPrice} / {selectedProductForOrder.unit}</span>
                  <span className="text-blue-600 font-bold">Delivery ETA: {selectedProductForOrder.deliveryEtaDays} Day(s)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Order Quantity ({selectedProductForOrder.unit})</label>
                <input
                  type="number"
                  min={selectedProductForOrder.moq}
                  value={orderQuantity}
                  onChange={e => setOrderQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-tabular"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Minimum Order Quantity (MOQ): {selectedProductForOrder.moq}</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Estimated Total Cost:</span>
                <span className="text-xl font-bold text-emerald-700 font-tabular">
                  ₹{(selectedProductForOrder.unitPrice * orderQuantity).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedProductForOrder(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Submit Order Request
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
