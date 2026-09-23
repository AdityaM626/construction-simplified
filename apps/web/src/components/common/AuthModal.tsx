import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { User, Lock, Mail, Phone, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { loginWithApi, registerWithApi } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('HOMEOWNER');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithApi(email, password);
      } else {
        await registerWithApi({ email, password, fullName, role });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Account Sign In 🔐' : 'Create Construction OS Account 🚀'} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'login' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'register' ? 'bg-white text-blue-700 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            Register New Account
          </button>
        </div>

        {mode === 'register' && (
          <>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="font-bold text-slate-800 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@construction.os"
              className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-800 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-800 block mb-1">Account Role</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('HOMEOWNER')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                role === 'HOMEOWNER' ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              🏡 House Owner
            </button>
            <button
              type="button"
              onClick={() => setRole('BUILDER')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                role === 'BUILDER' ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              🏗️ Contractor / Builder
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Workspace' : 'Complete Account Onboarding'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
};
