import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Wallet, FileSpreadsheet, ShoppingBag, Building2, Package, ListOrdered, ShieldAlert, Truck, CheckSquare } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useAuth();

  const homeownerItems = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'budget', label: 'Budget', icon: <Wallet className="w-5 h-5" /> },
    { id: 'boq', label: 'BOQ Gap', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'materials', label: 'Materials', icon: <ShoppingBag className="w-5 h-5" /> },
  ];

  const builderItems = [
    { id: 'projects', label: 'Projects', icon: <Building2 className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
  ];

  const dealerItems = [
    { id: 'inventory', label: 'Stock', icon: <Package className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <ListOrdered className="w-5 h-5" /> },
  ];

  const transportItems = [
    { id: 'deliveries', label: 'Jobs Board', icon: <Truck className="w-5 h-5" /> },
  ];

  const adminItems = [
    { id: 'verifications', label: 'Verify', icon: <ShieldAlert className="w-5 h-5" /> },
  ];

  let items = homeownerItems;
  if (currentUser.role === 'BUILDER') items = builderItems;
  if (currentUser.role === 'DEALER') items = dealerItems;
  if (currentUser.role === 'TRANSPORT_PARTNER') items = transportItems;
  if (currentUser.role === 'ADMIN') items = adminItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 py-2 px-4 flex justify-around items-center shadow-lg md:hidden">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
