import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StudentUser } from '../../types';
import { JAMBStorageService } from '../../utils/storage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StudentUser | 'admin') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState('JAMB2026/ENG01');
  const [password, setPassword] = useState('Aristotle@2026');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'admin') {
      if ((identifier === 'admin@aristotle.edu' || identifier === 'admin') && password === 'admin123') {
        onLoginSuccess('admin');
        onClose();
        return;
      }
      setErrorMsg('Invalid Administrator credentials. (Use admin@aristotle.edu / admin123)');
      return;
    }

    // Student Authentication
    const students = JAMBStorageService.getStudents();
    const cleanId = identifier.trim().toUpperCase();
    const found = students.find(
      s => (s.jambRegNo.toUpperCase() === cleanId || s.email.toLowerCase() === identifier.trim().toLowerCase()) &&
           s.password === password
    );

    if (found) {
      JAMBStorageService.setCurrentUser(found);
      onLoginSuccess(found);
      onClose();
    } else {
      setErrorMsg('Invalid JAMB Registration Number or Password. Check your credentials or try quick demo login.');
    }
  };

  const handleQuickDemoSelect = (regNo: string, pass: string) => {
    setActiveTab('student');
    setIdentifier(regNo);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center pb-5 mb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-900/20">
            <GraduationCap className="w-8 h-8 text-blue-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Aristotle Academy CBT & Student Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official JAMB UTME Preparatory & Continuous Assessment Platform
          </p>
        </div>

        {/* Tab Switcher: Student vs Admin */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setIdentifier('JAMB2026/ENG01');
              setPassword('Aristotle@2026');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'student'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Account Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setIdentifier('admin@aristotle.edu');
              setPassword('admin123');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin Management
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {activeTab === 'student' ? 'JAMB Registration Number or Email' : 'Administrator Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={activeTab === 'student' ? 'e.g. JAMB2026/ENG01' : 'admin@aristotle.edu'}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confidential Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Authenticate & Access Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials for Reviewers */}
        {activeTab === 'student' && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
              One-Click Demo Student Profiles:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('JAMB2026/ENG01', 'Aristotle@2026')}
                className="p-2 text-left rounded-lg bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 transition cursor-pointer"
              >
                <strong className="block text-blue-950">Alexandria Vance</strong>
                <span className="text-[10px] text-blue-700 font-mono">Eng. Track (Default Pass)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSelect('JAMB2026/MED02', 'Password123#')}
                className="p-2 text-left rounded-lg bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 transition cursor-pointer"
              >
                <strong className="block text-emerald-950">Chidi Okonkwo</strong>
                <span className="text-[10px] text-emerald-700 font-mono">Medical (Eng, Bio, Chm, Phy)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSelect('JAMB2026/LAW03', 'Password123#')}
                className="p-2 text-left rounded-lg bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200 transition cursor-pointer"
              >
                <strong className="block text-purple-950">Amina Bello</strong>
                <span className="text-[10px] text-purple-700 font-mono">Law (Eng, Lit, Gov, CRS)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSelect('JAMB2026/SOC04', 'Password123#')}
                className="p-2 text-left rounded-lg bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 transition cursor-pointer"
              >
                <strong className="block text-amber-950">David Adeleke</strong>
                <span className="text-[10px] text-amber-700 font-mono">Soc. Sci (Eng, Ecn, Mth, Gov)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
