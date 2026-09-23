import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Building2, ShoppingBag, CheckCircle2, ArrowRight, Layers, Users, BookOpen } from 'lucide-react';

export const PublicLandingPage: React.FC = () => {
  const { setActiveTab } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full border border-blue-100 text-xs font-semibold">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Connected Construction Operating System</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Build your home with clarity.
        </h1>

        <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
          Manage your construction project, people, materials, progress and payments from one connected platform. 
          Complex construction made simple for everyone involved.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <button
            onClick={() => {
              setActiveTab('projects');
              setActiveTab('dashboard');
            }}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveTab('projects');
              setActiveTab('projects');
            }}
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center space-x-2"
          >
            <span>Join as Construction Professional</span>
          </button>
        </div>
      </div>

      {/* 3 Core Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            🏡
          </div>
          <h3 className="font-bold text-base text-slate-900">Owner OS</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Full construction control center from start to finish. Understand expenses, materials, progress, and payment status with 100% transparency.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            👷
          </div>
          <h3 className="font-bold text-base text-slate-900">Construction Team OS</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Operational management for contractors, electricians, plumbers, painters, and architects to execute projects seamlessly.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            🏪
          </div>
          <h3 className="font-bold text-base text-slate-900">Shopkeeper OS</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fulfillment hub for material dealers to manage product catalogs, inventory reservations, order dispatch, and invoicing.
          </p>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xs space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Why Construction OS?</h3>
          <p className="text-xs text-slate-400">One project • One connected source of truth</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
          <div className="flex items-start space-x-3 p-4 bg-slate-50/70 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <b className="text-slate-900 block">7-Point Material Traceability</b>
              <span className="text-slate-500">Know who requested, who supplied, unit costs, and delivery status for every material bag and tonne.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-slate-50/70 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <b className="text-slate-900 block">Construction Specialist Roster</b>
              <span className="text-slate-500">Contractors organize assigned electricians, plumbers, painters, and architects directly under project milestones.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-slate-50/70 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <b className="text-slate-900 block">Zero Duplicate Records</b>
              <span className="text-slate-500">Single order state machine shared across Homeowner, Contractor, and Shopkeeper views.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-slate-50/70 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <b className="text-slate-900 block">Single Source of Truth Ledger</b>
              <span className="text-slate-500">Chronological history recording every material order, milestone progress photo, and invoice event.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
