import React, { useState } from 'react';
import { BuilderProfile } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Search, MapPin, Award, ShieldCheck, Star, Send, CheckCircle2, Building2 } from 'lucide-react';

export const BuilderDiscoveryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilderForQuote, setSelectedBuilderForQuote] = useState<BuilderProfile | null>(null);
  const [quoteRequirements, setQuoteRequirements] = useState('');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const builders: BuilderProfile[] = [
    {
      id: 'bld-prof-1',
      userId: 'usr-builder-1',
      companyName: 'Apex Infrastructure & Builders',
      experienceYears: 14,
      serviceArea: 'Whitefield & Electronic City, Bengaluru',
      verificationStatus: 'VERIFIED',
      portfolio: [
        { title: '4BHK Luxury Villa at Sarjapur', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', areaSqFt: 3400 },
        { title: 'Independent Duplex Residence', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80', areaSqFt: 2800 }
      ],
      rating: 4.9,
      completedProjectsCount: 28,
      specialties: ['Residential Villas', 'Structural Engineering', 'Eco-friendly Masonry']
    },
    {
      id: 'bld-prof-2',
      userId: 'usr-builder-2',
      companyName: 'GreenBuild Sustainable Constructions',
      experienceYears: 9,
      serviceArea: 'Indiranagar & Koramangala, Bengaluru',
      verificationStatus: 'VERIFIED',
      portfolio: [
        { title: 'Modern Green Home Construction', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', areaSqFt: 2400 }
      ],
      rating: 4.7,
      completedProjectsCount: 16,
      specialties: ['Renovations', 'Solar Rooftop Integration', 'Modern Interior Layouts']
    }
  ];

  const filteredBuilders = builders.filter(b => 
    b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.serviceArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setSelectedBuilderForQuote(null);
      setQuoteRequirements('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Verified Builder & Contractor Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Vetted background, verified GST & structural engineering expertise</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">Verified Business Badges</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search builder name, service location (Whitefield, Indiranagar), or specialty..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Builders Cards List */}
      <div className="space-y-6">
        {filteredBuilders.map((bld) => (
          <div key={bld.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-900">{bld.companyName}</h3>
                  <Badge status={bld.verificationStatus} />
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{bld.serviceArea}</span>
                  </span>
                  <span>•</span>
                  <span>{bld.experienceYears} Years Exp</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{bld.rating}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{bld.completedProjectsCount} Projects Completed</span>
                </div>
                <button
                  onClick={() => setSelectedBuilderForQuote(bld)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Estimate</span>
                </button>
              </div>
            </div>

            {/* Specialties & Portfolio Showcase */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">Specialties:</span>
                <div className="flex flex-wrap gap-1.5">
                  {bld.specialties.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 block mb-2">Past Construction Portfolio</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bld.portfolio.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-lg" />
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">{item.title}</h5>
                        <span className="text-[11px] text-slate-500">{item.areaSqFt.toLocaleString('en-IN')} sq ft</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Request Modal */}
      {selectedBuilderForQuote && (
        <Modal
          isOpen={!!selectedBuilderForQuote}
          onClose={() => setSelectedBuilderForQuote(null)}
          title={`Request Estimate — ${selectedBuilderForQuote.companyName}`}
        >
          {quoteSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Estimate Request Sent!</h3>
              <p className="text-xs text-slate-500">Builder has received your project details and will respond with a BOQ proposal.</p>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Project</label>
                <input
                  type="text"
                  disabled
                  value="Kumar Dream Villa (4BHK) - Whitefield"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scope & Material Quality Requirements</label>
                <textarea
                  required
                  rows={4}
                  value={quoteRequirements}
                  onChange={e => setQuoteRequirements(e.target.value)}
                  placeholder="Describe your structural requirements, preferred cement/steel brands, and target completion timeline..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedBuilderForQuote(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Send Estimate Request
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
