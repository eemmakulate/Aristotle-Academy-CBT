import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { StudentUser } from '../../types';
import { JAMBStorageService } from '../../utils/storage';

interface ChangePasswordModalProps {
  student: StudentUser;
  onPasswordChanged: (updatedStudent: StudentUser) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  student,
  onPasswordChanged,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword === 'Aristotle@2026') {
      setErrorMsg('You cannot reuse the default administrative password. Please choose a unique password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    const updated = JAMBStorageService.updateStudentPassword(student.id, newPassword);
    if (updated) {
      onPasswordChanged(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-400 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4 text-amber-900">
          <div className="p-3 bg-amber-100 rounded-2xl">
            <KeyRound className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Mandatory Security Update
            </h3>
            <span className="text-xs font-semibold text-amber-700">
              First-Time Login Verification
            </span>
          </div>
        </div>

        <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 mb-5 leading-relaxed">
          <p>
            Welcome, <strong>{student.fullName}</strong> ({student.jambRegNo}). 
            You are currently using the default administrator-issued password. For your privacy and examination security, you must establish a new confidential password before accessing your student portal.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              New Confidential Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Update Password & Enter Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
