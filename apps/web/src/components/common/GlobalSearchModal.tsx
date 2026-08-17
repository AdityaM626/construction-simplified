import React, { useState } from 'react';
import { Search, X, Building2, ShoppingBag, ListOrdered, Users, FileText, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';

interface SearchResult {
  id: string;
  type: 'PROJECT' | 'MATERIAL' | 'ORDER' | 'BUILDER' | 'SHOPKEEPER' | 'DOCUMENT';
  title: string;
  subtitle: string;
  tag: string;
}

export const GlobalSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, setActiveTab } = useAuth();
  const [query, setQuery] = useState('');

  const sampleResults: SearchResult[] = [
    { id: '1', type: 'PROJECT', title: 'Sharma Residence / Kumar Villa (4BHK)', subtitle: 'Whitefield, Bengaluru • Budget ₹45.0L', tag: 'Project' },
    { id: '2', type: 'MATERIAL', title: 'UltraTech PPC Cement (50kg Bags)', subtitle: 'Grade 53 PPC Cement • In Stock @ ₹420/bag', tag: 'Material' },
    { id: '3', type: 'ORDER', title: 'Order #ORD-1042 — 500 Cement Bags', subtitle: 'UltraTech Depot • 350 Delivered, 150 Pending', tag: 'Order' },
    { id: '4', type: 'BUILDER', title: 'Apex Infrastructure & Builders', subtitle: '14 Yrs Exp • 4.9 Rating • Verified Builder', tag: 'Builder' },
    { id: '5', type: 'SHOPKEEPER', title: 'UltraTech Authorized Cement Depot', subtitle: 'Outer Ring Road, Marathahalli • 4.9 Rating', tag: 'Shopkeeper' },
    { id: '6', type: 'DOCUMENT', title: 'Architect Structural Blueprints (G+2)', subtitle: 'Uploaded by Apex Infra • Approved', tag: 'Document' }
  ];

  const filteredResults = query.trim() === ''
    ? sampleResults
    : sampleResults.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) || 
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      );

  const getIcon = (type: string) => {
    switch (type) {
      case 'PROJECT': return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'MATERIAL': return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'ORDER': return <ListOrdered className="w-4 h-4 text-amber-600" />;
      case 'BUILDER': return <Users className="w-4 h-4 text-purple-600" />;
      case 'SHOPKEEPER': return <Users className="w-4 h-4 text-indigo-600" />;
      default: return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleSelect = (item: SearchResult) => {
    if (item.type === 'PROJECT' || item.type === 'ORDER') setActiveTab('connected-project');
    else if (item.type === 'MATERIAL') setActiveTab('materials');
    else if (item.type === 'BUILDER') setActiveTab('builders');
    else if (item.type === 'DOCUMENT') setActiveTab('documents');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Project Search">
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, materials, orders, builders, shopkeepers, documents..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
          {filteredResults.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-400">No matching search results found.</p>
          ) : (
            filteredResults.map((res) => (
              <button
                key={res.id}
                onClick={() => handleSelect(res)}
                className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors">
                    {getIcon(res.type)}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">{res.title}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{res.subtitle}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {res.tag}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
