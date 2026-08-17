import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Project, MaterialRequirement, OrderRequest, DeliveryJob, ProjectLedgerEvent } from '../../types';
import { Badge } from './Badge';
import { Building2, ShoppingBag, Truck, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Clock, FileSpreadsheet, Plus } from 'lucide-react';

export const ConnectedProjectView: React.FC = () => {
  const { currentUser } = useAuth();

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

  const [materialRequirements, setMaterialRequirements] = useState<MaterialRequirement[]>([
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
  ]);

  const [orders, setOrders] = useState<OrderRequest[]>([
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
  ]);

  const [ledger, setLedger] = useState<ProjectLedgerEvent[]>([
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
  ]);

  return (
    <div className="space-y-6">
      {/* Connected Project Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
              One Project • Three Connected Users • Single Source of Truth
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{project.name}</h1>
            <p className="text-xs text-slate-500">{project.location}</p>
          </div>
          <Badge status={project.status} />
        </div>

        {/* Connected Roles Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Project House Owner</span>
            <p className="font-bold text-slate-900">{project.homeownerName}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Central Controller</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Assigned Contractor</span>
            <p className="font-bold text-slate-900">{project.builderName}</p>
            <span className="text-[11px] text-blue-600 font-semibold">Verified Builder (14 Yrs Exp)</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium block">Active Material Suppliers</span>
            <p className="font-bold text-slate-900">UltraTech Depot + Jindal Steel</p>
            <span className="text-[11px] text-indigo-600 font-semibold">Multi-Supplier Network</span>
          </div>
        </div>
      </div>

      {/* Multi-Supplier Material Procurement Transparency */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Connected Material Procurement Transparency</h3>
            <p className="text-xs text-slate-500">Contractor requirements matched against shopkeeper supplies</p>
          </div>
          <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-xl">
            {materialRequirements.length} Active Requirements
          </span>
        </div>

        <div className="space-y-4">
          {materialRequirements.map((req) => (
            <div key={req.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{req.itemName}</h4>
                  <p className="text-xs text-slate-500">Requested by: {req.contractorName} • {req.specification}</p>
                </div>
                <Badge status={req.status} />
              </div>

              {/* Connected Procurement Quantities */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs font-medium">
                <div>
                  <span className="text-slate-400 block">Required Qty:</span>
                  <span className="font-bold text-slate-900">{req.requiredQty} {req.unit}s</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Ordered Qty:</span>
                  <span className="font-bold text-amber-600">{req.orderedQty} {req.unit}s</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Delivered Qty:</span>
                  <span className="font-bold text-emerald-700">{req.deliveredQty} {req.unit}s</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Remaining Gap:</span>
                  <span className="font-bold text-blue-600">{req.remainingQty} {req.unit}s</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Selected Shopkeeper: <b className="text-slate-900">{req.selectedDealerName}</b></span>
                <span className="text-slate-500 font-tabular">Estimated Unit Price: ₹{req.estimatedUnitPrice} / {req.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Order Records (Single Record — Multiple Views) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Unified Connected Orders</h3>
        {orders.map((ord) => (
          <div key={ord.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Order #{ord.id}</h4>
                <p className="text-xs text-slate-500">
                  Contractor: {ord.contractorName} • Shopkeeper: {ord.dealerName}
                </p>
              </div>
              <Badge status={ord.status} />
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-900">{ord.items[0].productName}</span>
                <p className="text-slate-500">
                  Ordered: {ord.items[0].quantity} bags • Delivered: {ord.items[0].deliveredQuantity} bags (Tranche 1)
                </p>
              </div>
              <span className="font-bold text-emerald-700 text-sm font-tabular">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Single Source of Truth Project Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Unified Project Ledger Timeline</h3>
            <p className="text-xs text-slate-500">Single chronological history of all owner, contractor & shopkeeper events</p>
          </div>
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-xl">
            Single Source of Truth
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {ledger.map((evt) => (
            <div key={evt.id} className="p-4 hover:bg-slate-50/50 flex items-start space-x-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                {evt.actorRole.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">{evt.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{new Date(evt.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-snug">{evt.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                    Actor: {evt.actorName} ({evt.actorRole})
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">
                    {evt.eventType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
