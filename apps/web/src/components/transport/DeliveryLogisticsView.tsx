import React, { useState } from 'react';
import { DeliveryJob } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Truck, Camera, CheckCircle2, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const DeliveryLogisticsView: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryJob[]>([
    {
      id: 'dlv-701',
      orderId: 'ord-901',
      projectId: 'prj-101',
      projectName: 'Kumar Dream Villa (4BHK)',
      dealerId: 'dlr-prof-1',
      dealerName: 'UltraTech Authorized Cement Depot',
      transporterId: 'trp-prof-1',
      transporterName: 'Express Heavy Haul Logistics',
      driverPhone: '+91 97777 88899',
      vehicleNumber: 'KA-01-EQ-9876',
      pickupAddress: 'Outer Ring Road Cement Depot, Marathahalli, Bengaluru',
      deliveryAddress: 'Plot #42, Palm Meadows Enclave, Whitefield, Bengaluru',
      status: 'DELIVERED',
      estimatedEta: '2026-02-11 11:00 AM',
      proofOfDelivery: {
        recipientName: 'Vikram Singh (Site Engineer)',
        photoUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
        timestamp: '2026-02-11T10:45:00.000Z',
        notes: '200 cement bags unloaded safely at Whitefield plot.'
      },
      createdAt: '2026-02-10T14:00:00.000Z'
    }
  ]);

  const [selectedJobForPoD, setSelectedJobForPoD] = useState<DeliveryJob | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [podPhotoUrl, setPodPhotoUrl] = useState('https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80');
  const [podNotes, setPodNotes] = useState('');

  const handlePoDSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJobForPoD) {
      setDeliveries(prev => prev.map(d => d.id === selectedJobForPoD.id ? {
        ...d,
        status: 'DELIVERED',
        proofOfDelivery: {
          recipientName: recipientName || 'Site Engineer',
          photoUrl: podPhotoUrl,
          timestamp: new Date().toISOString(),
          notes: podNotes
        }
      } : d));
      setSelectedJobForPoD(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Transporter Job Board & Logistics Operations</h1>
          <p className="text-xs text-slate-500 mt-1">Express Heavy Haul Logistics • Vehicle KA-01-EQ-9876 (10-Wheeler Tipper)</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
          <Truck className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-blue-800">142 Successful Deliveries</span>
        </div>
      </div>

      <div className="space-y-4">
        {deliveries.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Delivery Job #{job.id} — {job.projectName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Supplier: {job.dealerName} • Driver: {job.transporterName}</p>
              </div>
              <Badge status={job.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-medium">Pickup Location:</span>
                <p className="font-bold text-slate-800 mt-0.5">{job.pickupAddress}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Delivery Location:</span>
                <p className="font-bold text-slate-800 mt-0.5">{job.deliveryAddress}</p>
              </div>
            </div>

            {/* Proof of Delivery (PoD) Section */}
            {job.proofOfDelivery ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Proof of Delivery (PoD) Confirmed</span>
                  </span>
                  <span className="text-emerald-700 font-medium">{new Date(job.proofOfDelivery.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-emerald-800">Verified Recipient: <b>{job.proofOfDelivery.recipientName}</b></p>
                <p className="text-emerald-700">{job.proofOfDelivery.notes}</p>
                <img src={job.proofOfDelivery.photoUrl} alt="PoD Photo" className="w-32 h-20 object-cover rounded-lg border border-emerald-300 mt-2" />
              </div>
            ) : (
              <button
                onClick={() => setSelectedJobForPoD(job)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Proof of Delivery (PoD Photo & Recipient)</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedJobForPoD && (
        <Modal isOpen={!!selectedJobForPoD} onClose={() => setSelectedJobForPoD(null)} title="Upload Proof of Delivery (PoD)">
          <form onSubmit={handlePoDSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Verified Recipient Full Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder="e.g. Vikram Singh (Site Engineer)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unloading Photo URL</label>
              <input
                type="text"
                value={podPhotoUrl}
                onChange={e => setPodPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Condition Notes</label>
              <input
                type="text"
                value={podNotes}
                onChange={e => setPodNotes(e.target.value)}
                placeholder="e.g. 200 bags unloaded in dry storage shed. Zero damage."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setSelectedJobForPoD(null)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Submit PoD & Mark Delivered
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
