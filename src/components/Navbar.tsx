import React from 'react';
import { 
  GraduationCap, 
  Sliders, 
  BookOpen, 
  Lock, 
  Unlock, 
  LogOut, 
  User, 
  KeyRound 
} from 'lucide-react';
import { StudentUser, MockExamSchedule } from '../types';

interface NavbarProps {
  currentView: 'student-portal' | 'student-exam' | 'student-scorecard' | 'admin';
  onNavigateView: (view: 'student-portal' | 'admin') => void;
  currentUser: StudentUser | 'admin' | null;
  onOpenLoginModal: () => void;
  mockSchedule: MockExamSchedule;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  currentUser,
  onOpenLoginModal,
  mockSchedule,
}) => {
  if (currentView === 'student-exam') {
    return null; // The active JAMB exam renders its own full-screen proctor header
  }

  const isAdmin = currentUser === 'admin';
  const isStudent = currentUser && currentUser !== 'admin';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Crest */}
        <div 
          onClick={() => onNavigateView('student-portal')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:bg-blue-800 transition">
            <GraduationCap className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                Aristotle Academy
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 font-mono">
                JAMB UTME CBT
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              Continuous Assessment & Proctored Mock Engine
            </p>
          </div>
        </div>

        {/* Center: Live Mock Status Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {mockSchedule.status === 'active' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Statewide Mock: ACTIVE NOW</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>CBT Mock: Locked by Admin</span>
            </div>
          )}
        </div>

        {/* Right View Switcher & Auth Pill */}
        <div className="flex items-center gap-3">
          {/* Portal Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              type="button"
              onClick={() => onNavigateView('student-portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView !== 'admin'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>

          {/* User Profile / Switch Account Button */}
          {isStudent && (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition cursor-pointer"
              title="Click to Switch Student Account or Log Out"
            >
              <img
                src={(currentUser as StudentUser).avatarUrl}
                alt="Student"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="hidden sm:inline font-mono text-[11px]">
                {(currentUser as StudentUser).jambRegNo}
              </span>
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {isAdmin && (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold cursor-pointer"
            >
              <span>Admin</span>
              <LogOut className="w-3.5 h-3.5 text-purple-700" />
            </button>
          )}

          {!currentUser && (
            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold cursor-pointer"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
