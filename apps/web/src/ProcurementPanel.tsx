import React, { useEffect, useState } from 'react';
import { apiFetch } from './api/client';
import type { UserRole } from './types';

type MaterialRequest = {
  id: string; itemName: string; quantity: string; unit: string; status: string;
  neededBy?: string; boqItemId?: string; purchaseOrder?: { id: string; status: string };
};
type Vendor = { id: string; name: string; contactName?: string; email?: string };
type Quote = { id: string; vendorId: string; unitPrice: string; leadTimeDays: number;
  vendor: { name: string }; validUntil?: string };
type PurchaseOrder = {
  id: string; requestId: string; status: string; quantity: string; unitPrice: string;
  acceptedQuantity: string; damagedQuantity: string; trackingReference?: string;
  expectedDate?: string; vendor: { name: string }; request: { itemName: string; unit: string };
  receipts: { id: string; acceptedQuantity: string; damagedQuantity: string;
    evidenceReference?: string; finalDelivery: boolean }[];
};
type Summary = { projectBudget: string; committed: string; receivedValue: string;
  remainingAfterCommitments: string; openOrders: number; exceptions: number; overdue: number };
type BOQItem = { id: string; description: string; quantity: string; unit: string };

const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none';
const primary = 'rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50';
const money = (value: string) => '₹' + Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });

export function ProcurementPanel({ projectId, role, onProjectChange }: {
  projectId: string; role: UserRole; onProjectChange: () => Promise<void>;
}) {
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [boq, setBoq] = useState<BOQItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [requestForm, setRequestForm] = useState({ boqItemId: '', itemName: '', quantity: '', unit: '', neededBy: '', notes: '' });
  const [vendorForm, setVendorForm] = useState({ name: '', contactName: '', email: '' });
  const [quoteForm, setQuoteForm] = useState({ vendorId: '', unitPrice: '', leadTimeDays: '', validUntil: '', notes: '' });
  const [trackingReference, setTrackingReference] = useState('');
  const [receiptForm, setReceiptForm] = useState({ acceptedQuantity: '', damagedQuantity: '0',
    finalDelivery: true, evidenceReference: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const base = `/projects/${projectId}`;
  const canSource = role === 'PROCUREMENT' || role === 'ADMIN';
  const canBuild = role === 'BUILDER' || role === 'ADMIN';
  const selectedRequest = requests.find(request => request.id === selectedRequestId);
  const selectedOrder = orders.find(order => order.id === selectedOrderId);
  const visibleRequests = requests.filter(request => filter === 'ALL' || request.status === filter);

  const refresh = async () => {
    const [nextRequests, nextVendors, nextOrders, nextBoq, nextSummary] = await Promise.all([
      apiFetch<MaterialRequest[]>(base + '/material-requests'),
      apiFetch<Vendor[]>(base + '/vendors'),
      apiFetch<PurchaseOrder[]>(base + '/purchase-orders'),
      apiFetch<BOQItem[]>(base + '/boq'),
      apiFetch<Summary>(base + '/procurement-summary')
    ]);
    setRequests(nextRequests); setVendors(nextVendors); setOrders(nextOrders);
    setBoq(nextBoq); setSummary(nextSummary);
    setSelectedRequestId(id => nextRequests.some(request => request.id === id) ? id : nextRequests[0]?.id || '');
    setSelectedOrderId(id => nextOrders.some(order => order.id === id) ? id : nextOrders[0]?.id || '');
  };
  useEffect(() => {
    setLoading(true); setError('');
    refresh().catch(reason => setError(reason.message)).finally(() => setLoading(false));
  }, [projectId]);
  useEffect(() => {
    if (!selectedRequestId) { setQuotes([]); return; }
    apiFetch<Quote[]>(base + `/material-requests/${selectedRequestId}/quotations`)
      .then(setQuotes).catch(reason => setError(reason.message));
  }, [projectId, selectedRequestId, requests]);

  const run = async (action: () => Promise<unknown>, success: string): Promise<boolean> => {
    setBusy(true); setError(''); setMessage('');
    try { await action(); await refresh(); await onProjectChange(); setMessage(success); return true; }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Action failed'); return false; }
    finally { setBusy(false); }
  };
  const createRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await run(() => apiFetch(base + '/material-requests', { method: 'POST',
      body: JSON.stringify(requestForm) }), 'Material request created')) {
      setRequestForm({ boqItemId: '', itemName: '', quantity: '', unit: '', neededBy: '', notes: '' });
    }
  };
  const createVendor = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await run(() => apiFetch(base + '/vendors', { method: 'POST', body: JSON.stringify(vendorForm) }), 'Supplier recorded')) {
      setVendorForm({ name: '', contactName: '', email: '' });
    }
  };
  const createQuote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRequest) return;
    if (await run(() => apiFetch(base + `/material-requests/${selectedRequest.id}/quotations`,
      { method: 'POST', body: JSON.stringify(quoteForm) }), 'Quotation recorded')) {
      setQuoteForm({ vendorId: '', unitPrice: '', leadTimeDays: '', validUntil: '', notes: '' });
    }
  };
  const dispatch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOrder) return;
    if (await run(() => apiFetch(base + `/purchase-orders/${selectedOrder.id}/dispatch`,
      { method: 'POST', body: JSON.stringify({ trackingReference }) }), 'Dispatch recorded')) {
      setTrackingReference('');
    }
  };
  const receive = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOrder) return;
    if (await run(() => apiFetch(base + `/purchase-orders/${selectedOrder.id}/receipts`,
      { method: 'POST', body: JSON.stringify(receiptForm) }), 'Site receipt recorded')) {
      setReceiptForm({ acceptedQuantity: '', damagedQuantity: '0', finalDelivery: true, evidenceReference: '', notes: '' });
    }
  };

  return <div className="mt-5 space-y-5">
    {loading && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Loading procurement records…</p>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}
    {summary && <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl bg-blue-50 p-4"><p className="text-xs text-slate-600">Purchase commitments</p><strong>{money(summary.committed)}</strong></div>
      <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-600">Budget after commitments</p><strong>{money(summary.remainingAfterCommitments)}</strong></div>
      <div className="rounded-xl bg-amber-50 p-4"><p className="text-xs text-slate-600">Exceptions / overdue</p><strong>{summary.exceptions} / {summary.overdue}</strong></div>
    </div>}

    {canBuild && <form onSubmit={createRequest} className="rounded-xl border border-slate-200 p-4">
      <h4 className="font-bold">Request materials</h4>
      <p className="mt-1 text-xs text-slate-500">Link a BOQ item where available. One request can be raised per BOQ item.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold">BOQ item
          <select className={field + ' mt-1'} value={requestForm.boqItemId} onChange={e => {
            const item = boq.find(entry => entry.id === e.target.value);
            setRequestForm({ ...requestForm, boqItemId: e.target.value,
              itemName: item?.description || '', unit: item?.unit || '' });
          }}><option value="">Ad hoc material</option>{boq.map(item =>
            <option key={item.id} value={item.id}>{item.description} ({item.quantity} {item.unit})</option>)}</select>
        </label>
        <label className="text-xs font-semibold">Material
          <input className={field + ' mt-1'} value={requestForm.itemName} disabled={!!requestForm.boqItemId}
            onChange={e => setRequestForm({ ...requestForm, itemName: e.target.value })} required /></label>
        <label className="text-xs font-semibold">Quantity
          <input className={field + ' mt-1'} type="number" min="0.001" step="0.001" value={requestForm.quantity}
            onChange={e => setRequestForm({ ...requestForm, quantity: e.target.value })} required /></label>
        <label className="text-xs font-semibold">Unit
          <input className={field + ' mt-1'} value={requestForm.unit} disabled={!!requestForm.boqItemId}
            onChange={e => setRequestForm({ ...requestForm, unit: e.target.value })} required /></label>
        <label className="text-xs font-semibold">Needed by
          <input className={field + ' mt-1'} type="date" value={requestForm.neededBy}
            onChange={e => setRequestForm({ ...requestForm, neededBy: e.target.value })} /></label>
        <label className="text-xs font-semibold">Notes
          <input className={field + ' mt-1'} value={requestForm.notes}
            onChange={e => setRequestForm({ ...requestForm, notes: e.target.value })} /></label>
      </div>
      <button className={primary + ' mt-3'} disabled={busy}>Create request</button>
    </form>}

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold">Material requirements</h4>
          <select aria-label="Filter material requests" className={field + ' max-w-36'} value={filter}
            onChange={e => setFilter(e.target.value)}>
            {['ALL', 'REQUESTED', 'ACCEPTED', 'DISPATCHED', 'DELIVERED'].map(value => <option key={value}>{value}</option>)}
          </select>
        </div>
        <div className="mt-3 space-y-2">
          {visibleRequests.map(request => <button key={request.id} onClick={() => setSelectedRequestId(request.id)}
            className={'w-full rounded-lg border p-3 text-left text-sm ' +
              (selectedRequestId === request.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200')}>
            <span className="block font-semibold">{request.itemName} · {request.quantity} {request.unit}</span>
            <span className="text-xs text-slate-500">{request.status.replace('_', ' ')}
              {request.boqItemId ? ' · BOQ linked' : ''}</span>
          </button>)}
          {!visibleRequests.length && <p className="text-sm text-slate-500">No requests in this queue.</p>}
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 p-4">
        <h4 className="font-bold">Sourcing</h4>
        {selectedRequest ? <div className="mt-3 space-y-3">
          <p className="text-sm">{selectedRequest.itemName} · {selectedRequest.quantity} {selectedRequest.unit}</p>
          {canSource && selectedRequest.status === 'REQUESTED' &&
            <button className={primary} disabled={busy} onClick={() =>
              run(() => apiFetch(base + `/material-requests/${selectedRequest.id}/advance`,
                { method: 'POST' }), 'Request accepted')}>Accept request</button>}
          <div className="space-y-2">{quotes.map(quote => <div key={quote.id} className="rounded-lg bg-slate-50 p-3 text-sm">
            <strong>{quote.vendor.name}</strong>
            <p>{money(quote.unitPrice)} per unit · {quote.leadTimeDays} days ·
              total {money(String(Number(quote.unitPrice) * Number(selectedRequest.quantity)))}</p>
            {canSource && selectedRequest.status === 'ACCEPTED' && !selectedRequest.purchaseOrder &&
              <button className="mt-1 font-semibold text-blue-700" disabled={busy} onClick={() =>
                run(() => apiFetch(base + `/material-requests/${selectedRequest.id}/purchase-order`,
                  { method: 'POST', body: JSON.stringify({ quotationId: quote.id }) }), 'Purchase order issued')}>
                Issue purchase order</button>}
          </div>)}</div>
          {!quotes.length && <p className="text-sm text-slate-500">No supplier quotations yet.</p>}
          {canSource && selectedRequest.status === 'ACCEPTED' && !selectedRequest.purchaseOrder &&
            <form onSubmit={createQuote} className="grid gap-2 sm:grid-cols-2">
              <select aria-label="Supplier" className={field} value={quoteForm.vendorId} required
                onChange={e => setQuoteForm({ ...quoteForm, vendorId: e.target.value })}>
                <option value="">Choose supplier</option>{vendors.map(vendor =>
                  <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}</select>
              <input aria-label="Unit price" className={field} type="number" min="0.01" step="0.01"
                placeholder="Unit price (₹)" value={quoteForm.unitPrice} required
                onChange={e => setQuoteForm({ ...quoteForm, unitPrice: e.target.value })} />
              <input aria-label="Lead time in days" className={field} type="number" min="0" max="365"
                placeholder="Lead time (days)" value={quoteForm.leadTimeDays} required
                onChange={e => setQuoteForm({ ...quoteForm, leadTimeDays: e.target.value })} />
              <input aria-label="Quote valid until" className={field} type="date" value={quoteForm.validUntil}
                onChange={e => setQuoteForm({ ...quoteForm, validUntil: e.target.value })} />
              <button className={primary} disabled={busy || !vendors.length}>Record quotation</button>
            </form>}
        </div> : <p className="mt-3 text-sm text-slate-500">Choose a requirement to view quotations.</p>}
      </section>
    </div>

    {canSource && <form onSubmit={createVendor} className="rounded-xl border border-slate-200 p-4">
      <h4 className="font-bold">Record a supplier</h4>
      <p className="mt-1 text-xs text-slate-500">Suppliers are project records, not login accounts.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input aria-label="Supplier name" className={field} placeholder="Supplier name" value={vendorForm.name}
          onChange={e => setVendorForm({ ...vendorForm, name: e.target.value })} required />
        <input aria-label="Contact name" className={field} placeholder="Contact name" value={vendorForm.contactName}
          onChange={e => setVendorForm({ ...vendorForm, contactName: e.target.value })} />
        <input aria-label="Contact email" className={field} type="email" placeholder="Contact email" value={vendorForm.email}
          onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })} />
      </div>
      <button className={primary + ' mt-3'} disabled={busy}>Add supplier</button>
    </form>}

    <section className="rounded-xl border border-slate-200 p-4">
      <h4 className="font-bold">Purchase orders and deliveries</h4>
      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-2">{orders.map(order => <button key={order.id}
          onClick={() => setSelectedOrderId(order.id)}
          className={'w-full rounded-lg border p-3 text-left text-sm ' +
            (selectedOrderId === order.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200')}>
          <span className="block font-semibold">{order.request.itemName} · {order.vendor.name}</span>
          <span className="text-xs text-slate-500">{order.status.replace('_', ' ')} ·
            {money(String(Number(order.quantity) * Number(order.unitPrice)))}</span>
        </button>)}
          {!orders.length && <p className="text-sm text-slate-500">No purchase orders issued.</p>}</div>
        {selectedOrder && <div className="space-y-3 text-sm">
          <p><strong>{selectedOrder.request.itemName}</strong> from {selectedOrder.vendor.name}</p>
          <p>Ordered {selectedOrder.quantity} {selectedOrder.request.unit};
            accepted {selectedOrder.acceptedQuantity}, damaged {selectedOrder.damagedQuantity}</p>
          {selectedOrder.trackingReference && <p>Tracking: {selectedOrder.trackingReference}</p>}
          {canSource && selectedOrder.status === 'ISSUED' && <form onSubmit={dispatch} className="space-y-2">
            <input aria-label="Tracking reference" className={field} placeholder="Tracking reference" required
              value={trackingReference} onChange={e => setTrackingReference(e.target.value)} />
            <button className={primary} disabled={busy}>Record dispatch</button>
          </form>}
          {canBuild && ['DISPATCHED', 'PARTIALLY_RECEIVED'].includes(selectedOrder.status) &&
            <form onSubmit={receive} className="grid gap-2 sm:grid-cols-2">
              <input aria-label="Accepted quantity" className={field} type="number" min="0" step="0.001"
                placeholder="Accepted quantity" value={receiptForm.acceptedQuantity} required
                onChange={e => setReceiptForm({ ...receiptForm, acceptedQuantity: e.target.value })} />
              <input aria-label="Damaged quantity" className={field} type="number" min="0" step="0.001"
                placeholder="Damaged quantity" value={receiptForm.damagedQuantity} required
                onChange={e => setReceiptForm({ ...receiptForm, damagedQuantity: e.target.value })} />
              <input aria-label="Receipt evidence reference" className={field} placeholder="Evidence reference"
                value={receiptForm.evidenceReference} required
                onChange={e => setReceiptForm({ ...receiptForm, evidenceReference: e.target.value })} />
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input type="checkbox" checked={receiptForm.finalDelivery}
                  onChange={e => setReceiptForm({ ...receiptForm, finalDelivery: e.target.checked })} />
                Final delivery</label>
              <input aria-label="Receipt notes" className={field} placeholder="Shortage / damage notes"
                value={receiptForm.notes} onChange={e => setReceiptForm({ ...receiptForm, notes: e.target.value })} />
              <button className={primary} disabled={busy}>Record site receipt</button>
            </form>}
          {selectedOrder.receipts.map(receipt => <p key={receipt.id} className="rounded-lg bg-slate-50 p-2 text-xs">
            Receipt: {receipt.acceptedQuantity} accepted, {receipt.damagedQuantity} damaged
            {receipt.finalDelivery ? ' · final' : ' · partial'} · {receipt.evidenceReference}
          </p>)}
        </div>}
      </div>
    </section>
  </div>;
}
