import React, { useState } from 'react';
import { Project, MaterialRequirement, OrderRequest, ProjectLedgerEvent } from '../../types';
import { Badge } from './Badge';
import { Building2, ShoppingBag, ListOrdered, Clock, Layers, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ConnectedProjectView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'orders' | 'ledger'>('overview');

  const project: Project = {
    id: 'prj-101',
    homeownerId: 'usr-homeowner-1',
    homeownerName: 'Rajesh Kumar',
    builderId: 'usr-builder-1',
    builderName: 'Apex Infrastructure & Builders',
    name: 'Sharma Residence / Kumar Villa (4BHK)',
    type: 'NEW_CONSTRUCTION',
    location: 'Plot #42, Palm Meadows Enclave, Whitefield, Bengaluru',
    plotAreaSqFt: 2750,
    totalBudget: 4500000,
    spentCost: 1820000,
    committedCost: 850000,
    targetCompletionDate: '2027-03-31',
    status: 'IN_PROGRESS',
    createdAt: '2026-02-01T09:00:00.000Z'
  };

  const materialRequirements: MaterialRequirement[] = [
    {
      id: 'req-101',
      projectId: 'prj-101',
      projectName: 'Sharma Residence / Kumar Villa (4BHK)',
      contractorId: 'usr-builder-1',
      contractorName: 'Vikram Singh (Apex Infra)',
      category: 'CEMENT',
      itemName: 'UltraTech PPC Cement (50kg Bags)',
      specification: 'Grade 53 PPC Cement for slab shuttering & column casting',
      requiredQty: 500,
      orderedQty: 500,
      deliveredQty: 350,
      remainingQty: 150,
      unit: 'Bag',
      estimatedUnitPrice: 420,
      selectedDealerId: 'dlr-prof-1',
      selectedDealerName: 'UltraTech Authorized Cement Depot',
      status: 'PARTIALLY_DELIVERED',
      createdAt: '2026-02-05T10:00:00.000Z'
    },
    {
      id: 'req-102',
      projectId: 'prj-101',
      projectName: 'Sharma Residence / Kumar Villa (4BHK)',
      contractorId: 'usr-builder-1',
      contractorName: 'Vikram Singh (Apex Infra)',
      category: 'STEEL',
      itemName: 'Jindal Panther TMT Rebars 12mm',
      specification: 'Fe 550D High ductility earthquake resistant rebars',
      requiredQty: 10,
      orderedQty: 4,
      deliveredQty: 0,
      remainingQty: 6,
      unit: 'Tonne',
      estimatedUnitPrice: 62500,
      selectedDealerId: 'dlr-prof-2',
      selectedDealerName: 'Jindal TMT & Steel Stockist Hub',
      status: 'ORDERED',
      createdAt: '2026-08-08T09:00:00.000Z'
    }
  ];

  const orders: OrderRequest[] = [
    {
      id: 'ORD-1042',
      projectId: 'prj-101',
      projectName: 'Sharma Residence / Kumar Villa (4BHK)',
      homeownerId: 'usr-homeowner-1',
      homeownerName: 'Rajesh Kumar',
      contractorId: 'usr-builder-1',
      contractorName: 'Vikram Singh (Apex Infra)',
      dealerId: 'dlr-prof-1',
      dealerName: 'UltraTech Authorized Cement Depot',
      materialRequirementId: 'req-101',
      createdByRole: 'BUILDER',
      items: [
        {
          id: 'itm-1042',
          productId: 'prd-1',
          productName: 'UltraTech PPC Cement (50kg Bag)',
          unitPrice: 420,
          quantity: 500,
          deliveredQuantity: 350,
          totalPrice: 210000
        }
      ],
      totalAmount: 210000,
      status: 'PARTIALLY_DELIVERED',
      expectedDeliveryDate: '2026-08-19',
      createdAt: '2026-08-17T10:00:00.000Z',
      notes: '500 bags ordered. 350 delivered in tranche 1, 150 bags pending in tranche 2.'
    }
  ];

  const ledger: ProjectLedgerEvent[] = [
    {
      id: 'ledg-5',
      projectId: 'prj-101',
      actorId: 'usr-dealer-1',
      actorName: 'UltraTech Cement Depot',
      actorRole: 'DEALER',
      eventType: 'PARTIAL_DELIVERY',
      title: 'Tranche 1 Delivery Completed',
      description: '350 bags delivered (PoD confirmed by Vikram Singh). 150 bags remaining.',
      timestamp: '2026-08-18T10:45:00.000Z'
    },
    {
      id: 'ledg-4',
      projectId: 'prj-101',
      actorId: 'usr-dealer-1',
      actorName: 'UltraTech Cement Depot',
      actorRole: 'DEALER',
      eventType: 'ORDER_ACCEPTED',
      title: 'Order Accepted & Inventory Reserved',
      description: 'Shopkeeper accepted Order #ORD-1042. Reserved 500 bags in warehouse.',
      timestamp: '2026-08-17T10:30:00.000Z'
    },
    {
      id: 'ledg-3',
      projectId: 'prj-101',
      actorId: 'usr-builder-1',
      actorName: 'Vikram Singh',
      actorRole: 'BUILDER',
      eventType: 'SUPPLIER_SELECTED',
      title: 'Supplier Selected',
      description: 'Selected UltraTech Cement Depot @ ₹420/bag for Order #ORD-1042',
      timestamp: '2026-08-17T10:15:00.000Z'
    },
    {
      id: 'ledg-2',
      projectId: 'prj-101',
      actorId: 'usr-builder-1',
      actorName: 'Vikram Singh (Apex Infra)',
      actorRole: 'BUILDER',
      eventType: 'MATERIAL_REQUESTED',
      title: 'Material Requirement Created',
      description: 'Apex Infra added requirement: 500 bags UltraTech PPC Cement',
      timestamp: '2026-08-17T10:00:00.000Z'
    },
    {
      id: 'ledg-1',
      projectId: 'prj-101',
      actorId: 'usr-homeowner-1',
      actorName: 'Rajesh Kumar',
      actorRole: 'HOMEOWNER',
      eventType: 'PROJECT_CREATED',
      title: 'Project Initialized',
      description: 'Rajesh Kumar created Sharma Residence project (Budget ₹45,00,000)',
      timestamp: '2026-02-01T09:00:00.000Z'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Calm Project Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-xs font-semibold text-slate-500">Connected Project Hub</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{project.name}</h1>
            <p className="text-xs text-slate-400 mt-1">{project.location}</p>
          </div>
          <Badge status={project.status} />
        </div>

        {/* 3 Connected Roles Pill Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">House Owner</span>
            <p className="font-bold text-slate-900 mt-0.5">{project.homeownerName}</p>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Assigned Contractor</span>
            <p className="font-bold text-slate-900 mt-0.5">{project.builderName}</p>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Material Suppliers</span>
            <p className="font-bold text-slate-900 mt-0.5">UltraTech Depot + Jindal Steel</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-t border-slate-100 pt-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Project Overview
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'materials'
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Material Requirements ({materialRequirements.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Connected Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ledger'
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Project Ledger ({ledger.length})
          </button>
        </div>
      </div>

      {/* Tab Content Areas */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-400">Total Project Budget</span>
            <p className="text-2xl font-bold text-slate-900 font-tabular">₹{project.totalBudget.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400">₹{project.spentCost.toLocaleString('en-IN')} spent • ₹{project.committedCost.toLocaleString('en-IN')} committed</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-400">Active Material Orders</span>
            <p className="text-2xl font-bold text-blue-600 font-tabular">{orders.length} Active</p>
            <p className="text-xs text-slate-400">UltraTech PPC Cement (350 delivered, 150 pending)</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-400">Single Source of Truth</span>
            <p className="text-2xl font-bold text-emerald-600 font-tabular">100% Synced</p>
            <p className="text-xs text-slate-400">Shared between Owner, Contractor & Shopkeeper</p>
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="space-y-4">
          {materialRequirements.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{req.itemName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Requested by {req.contractorName}</p>
                </div>
                <Badge status={req.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/70 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Required:</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{req.requiredQty} {req.unit}s</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Ordered:</span>
                  <span className="font-bold text-amber-600 mt-0.5 block">{req.orderedQty} {req.unit}s</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Delivered:</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">{req.deliveredQty} {req.unit}s</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Remaining Gap:</span>
                  <span className="font-bold text-blue-600 mt-0.5 block">{req.remainingQty} {req.unit}s</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Selected Supplier: <b className="text-slate-800">{req.selectedDealerName}</b></span>
                <span>Unit Price: <b className="text-slate-800">₹{req.estimatedUnitPrice} / {req.unit}</b></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Order #{ord.id}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Supplier: {ord.dealerName}</p>
                </div>
                <Badge status={ord.status} />
              </div>

              <div className="p-4 bg-slate-50/70 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{ord.items[0].productName}</span>
                  <span className="text-slate-500 mt-0.5 block">500 ordered • 350 delivered (Tranche 1)</span>
                </div>
                <span className="text-base font-bold text-emerald-700 font-tabular">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden divide-y divide-slate-100">
          {ledger.map((evt) => (
            <div key={evt.id} className="p-5 hover:bg-slate-50/50 flex items-start space-x-4 text-xs transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
                {evt.actorRole.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">{evt.title}</h4>
                  <span className="text-[11px] text-slate-400">{new Date(evt.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">{evt.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
