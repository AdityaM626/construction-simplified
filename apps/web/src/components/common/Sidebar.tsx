import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  CheckSquare,
  ShoppingBag,
  Users,
  FileText,
  ShieldAlert,
  Package,
  ListOrdered,
  Building2,
  Truck,
  FileSpreadsheet,
  AlertTriangle,
  GitPullRequest,
  CreditCard,
  BarChart3,
  Star,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useAuth();

  const homeownerItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'connected-project', label: 'Connected Project Hub', icon: <Layers className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget & Ledger', icon: <Wallet className="w-4 h-4" /> },
    { id: 'boq', label: 'BOQ & Procurement', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'milestones', label: 'Milestones & Site', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'materials', label: 'Material Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'builders', label: 'Verified Builders', icon: <Users className="w-4 h-4" /> },
    { id: 'issues', label: 'Defect & Issues', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'change-orders', label: 'Change Orders', icon: <GitPullRequest className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments & Receipts', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'documents', label: 'Document Vault', icon: <FileText className="w-4 h-4" /> },
    { id: 'reviews', label: 'Verified Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics Insights', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const builderItems = [
    { id: 'projects', label: 'Assigned Projects', icon: <Building2 className="w-4 h-4" /> },
    { id: 'connected-project', label: 'Connected Project Hub', icon: <Layers className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks & Profit Margin', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'updates', label: 'Site Updates & Photos', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'issues', label: 'Site Defects', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  const dealerItems = [
    { id: 'inventory', label: 'Real-Time Inventory', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'Order Requests Queue', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'connected-project', label: 'Connected Project Context', icon: <Layers className="w-4 h-4" /> },
  ];

  const transportItems = [
    { id: 'deliveries', label: 'Logistics Jobs Board', icon: <Truck className="w-4 h-4" /> },
  ];

  const adminItems = [
    { id: 'verifications', label: 'Verification Queue', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'analytics', label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'audit', label: 'System Audit Logs', icon: <FileText className="w-4 h-4" /> },
  ];

  let items = homeownerItems;
  if (currentUser.role === 'BUILDER') items = builderItems;
  if (currentUser.role === 'DEALER') items = dealerItems;
  if (currentUser.role === 'TRANSPORT_PARTNER') items = transportItems;
  if (currentUser.role === 'ADMIN') items = adminItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="mb-6 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Workspace</span>
        <p className="text-xs font-bold text-slate-800 truncate">{currentUser.fullName}</p>
        <span className="text-[11px] text-blue-600 font-semibold">{currentUser.role.replace('_', ' ')} Portal</span>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
