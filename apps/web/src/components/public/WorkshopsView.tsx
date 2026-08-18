import React from 'react';
import { BookOpen, FileText, Lightbulb, Compass, PhoneCall } from 'lucide-react';

export const WorkshopsView: React.FC = () => {
  const guides = [
    { id: '1', title: 'Plot Layout & Vastu Orientation Essentials', category: 'Layout & Planning', readTime: '5 min read', desc: 'Understanding setback rules, ground coverage, room orientation, and Vastu compliance for 30x40 plots.' },
    { id: '2', title: 'PPC vs OPC Cement Selection Guide', category: 'Material Selection', readTime: '7 min read', desc: 'Comparing Grade 53 PPC for slab casting vs OPC for rapid shuttering removal.' },
    { id: '3', title: 'Electrical Conduit & 3-Phase Load Calculation', category: 'Services', readTime: '6 min read', desc: 'How to plan concealed conduit piping before roof slab casting.' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Community & Knowledge</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Homeowner Workshops & Layout Guides</h1>
        <p className="text-xs text-slate-400">Practical knowledge resources for residential construction planning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((g) => (
          <div key={g.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                {g.category}
              </span>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">{g.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{g.desc}</p>
            </div>
            <span className="text-[11px] text-slate-400 font-medium block pt-2 border-t border-slate-100">{g.readTime}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Have questions about your plot layout or materials?</h3>
          <p className="text-xs text-slate-400 mt-1">Talk to our verified construction engineering network.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shrink-0">
          Contact Construction Experts
        </button>
      </div>
    </div>
  );
};
