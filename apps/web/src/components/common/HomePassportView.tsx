import React from 'react';
import { Home, ShieldCheck, Zap, Droplet, Layers, Paintbrush, Wrench, BookOpen } from 'lucide-react';

export const HomePassportView: React.FC = () => {
  const passport = {
    propertyName: 'Sharma Residence / Kumar Villa (4BHK)',
    address: 'Plot #42, Palm Meadows Enclave, Whitefield, Bengaluru',
    builtUpAreaSqFt: 2750,
    floorsCount: 2,
    constructionStartDate: '2026-02-01',
    handoverDate: '2027-03-31',
    contractorName: 'Apex Infrastructure & Builders (Vikram Singh)',
    contractorPhone: '+91 98111 22334',
    systems: {
      electrical: { dbBoardLocation: 'Ground Floor Utility Room', wiringBrand: 'Havells FRLS 3-Phase', mainBreakerCapacity: '63A TPN' },
      plumbing: { pipeBrand: 'Ashirvad CPVC & Supreme SWR', pumpSpecs: '1.5 HP Submersible Automatic Sump Pump', tankCapacityLiters: 5000 },
      waterproofing: { chemicalBrand: 'Dr. Fixit Fastflex 2-Coat', warrantyYears: 10 },
      paint: { interiorBrand: 'Asian Paints Royale Luxury Emulsion', exteriorBrand: 'Asian Paints Apex Ultima Protek' },
      flooring: { materialType: 'Italian Bottochino Marble & Somany Vitrified Tiles', brand: 'Bottochino Italy / Somany' }
    },
    maintenanceHistory: [
      { date: '2026-03-15', title: 'Foundation PCC Crack Sealing', category: 'REPAIR', cost: 8500, performedBy: 'Apex Infra Maintenance Crew' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Construction OS Permanent Record</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Digital Home Passport 🏠</h1>
        <p className="text-xs text-slate-400">Permanent digital record of home construction specifications, warranties, and maintenance</p>
      </div>

      {/* Property Passport Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <Home className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold">{passport.propertyName}</h2>
            <p className="text-xs text-slate-300 mt-0.5">{passport.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-700/80 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block">Built-up Area</span>
            <p className="font-bold text-white mt-0.5">{passport.builtUpAreaSqFt} Sq.Ft</p>
          </div>
          <div>
            <span className="text-slate-400 block">Floors</span>
            <p className="font-bold text-white mt-0.5">{passport.floorsCount} Floors</p>
          </div>
          <div>
            <span className="text-slate-400 block">Master Builder</span>
            <p className="font-bold text-blue-300 mt-0.5 truncate">{passport.contractorName}</p>
          </div>
          <div>
            <span className="text-slate-400 block">Handover Completed</span>
            <p className="font-bold text-emerald-400 mt-0.5">{passport.handoverDate}</p>
          </div>
        </div>
      </div>

      {/* Embedded Building Systems */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Building Infrastructure Systems</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-2">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Electrical System Specs</span>
            </div>
            <p className="text-xs text-slate-700"><b>Wiring:</b> {passport.systems.electrical.wiringBrand}</p>
            <p className="text-xs text-slate-700"><b>Distribution Box:</b> {passport.systems.electrical.dbBoardLocation}</p>
            <p className="text-xs text-slate-700"><b>Main Breaker:</b> {passport.systems.electrical.mainBreakerCapacity}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-2">
            <div className="flex items-center space-x-2 text-cyan-600 font-bold text-xs">
              <Droplet className="w-4 h-4" />
              <span>Plumbing & Drainage Specs</span>
            </div>
            <p className="text-xs text-slate-700"><b>Pipes:</b> {passport.systems.plumbing.pipeBrand}</p>
            <p className="text-xs text-slate-700"><b>Pump:</b> {passport.systems.plumbing.pumpSpecs}</p>
            <p className="text-xs text-slate-700"><b>Overhead Tank:</b> {passport.systems.plumbing.tankCapacityLiters} Liters</p>
          </div>
        </div>
      </div>
    </div>
  );
};
