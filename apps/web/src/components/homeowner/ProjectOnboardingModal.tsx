import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Building2, MapPin, IndianRupee, Calendar, FileText, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ProjectOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

export const ProjectOnboardingModal: React.FC<ProjectOnboardingModalProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'My New Home Project',
    type: 'NEW_CONSTRUCTION',
    location: 'Whitefield, Bengaluru',
    plotAreaSqFt: '2500',
    totalBudget: '4000000',
    targetCompletionDate: '2027-04-30',
    drawingsFile: 'structural_plan_draft.pdf'
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      id: `prj-${Date.now()}`,
      homeownerId: 'usr-homeowner-1',
      name: formData.name,
      type: formData.type,
      location: formData.location,
      plotAreaSqFt: Number(formData.plotAreaSqFt),
      totalBudget: Number(formData.totalBudget),
      spentCost: 0,
      committedCost: 0,
      targetCompletionDate: formData.targetCompletionDate,
      status: 'PLANNING',
      createdAt: new Date().toISOString()
    };
    onProjectCreated(newProject);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Construction Project Wizard">
      {/* Wizard Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className={step >= 1 ? 'text-blue-600 font-bold' : ''}>1. Project Details</span>
          <span className={step >= 2 ? 'text-blue-600 font-bold' : ''}>2. Location & Plot</span>
          <span className={step >= 3 ? 'text-blue-600 font-bold' : ''}>3. Budget & Timeline</span>
          <span className={step >= 4 ? 'text-blue-600 font-bold' : ''}>4. Review & Launch</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="e.g. Dream Villa Construction"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Construction Scope Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="NEW_CONSTRUCTION">New Build Ground Up</option>
                <option value="RENOVATION">Full Home Renovation</option>
                <option value="EXTENSION">Floor / Terrace Extension</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Site Location Address</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="Plot #, Enclave, Area, City"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plot Built-up Area (Sq Ft)</label>
              <input
                type="number"
                required
                value={formData.plotAreaSqFt}
                onChange={e => setFormData({ ...formData, plotAreaSqFt: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="2500"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Total Construction Budget (₹)</label>
              <input
                type="number"
                required
                value={formData.totalBudget}
                onChange={e => setFormData({ ...formData, totalBudget: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="4000000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Completion Date</label>
              <input
                type="date"
                required
                value={formData.targetCompletionDate}
                onChange={e => setFormData({ ...formData, targetCompletionDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">Project Summary Review</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Project Name:</span>
                <span className="font-bold text-slate-800">{formData.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Type:</span>
                <span className="font-bold text-slate-800">{formData.type.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="font-bold text-slate-800">{formData.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Area:</span>
                <span className="font-bold text-slate-800">{Number(formData.plotAreaSqFt).toLocaleString('en-IN')} sq ft</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Budget:</span>
                <span className="font-bold text-emerald-700">₹{Number(formData.totalBudget).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Target Completion:</span>
                <span className="font-bold text-slate-800">{formData.targetCompletionDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center space-x-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center space-x-1 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center space-x-1 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Project Now</span>
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};
