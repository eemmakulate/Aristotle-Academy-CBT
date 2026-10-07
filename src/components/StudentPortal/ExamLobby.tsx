import React, { useState } from 'react';
import { 
  GraduationCap, 
  Timer, 
  ShieldAlert, 
  Maximize2, 
  Keyboard, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  User, 
  Sparkles,
  Info
} from 'lucide-react';
import { ExamConfig, Question } from '../../types';

interface ExamLobbyProps {
  config: ExamConfig;
  allQuestions: Question[];
  onStartExam: (candidateData: {
    candidateName: string;
    candidateId: string;
    avatarUrl: string;
    subject: string;
    filteredQuestions: Question[];
    durationMinutes: number;
  }) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const ExamLobby: React.FC<ExamLobbyProps> = ({
  config,
  allQuestions,
  onStartExam,
}) => {
  const [candidateName, setCandidateName] = useState('Alexandria Vance');
  const [candidateId, setCandidateId] = useState('AA-2026-9402');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  
  // Available subjects
  const availableSubjects = [
    'All Subjects (Comprehensive Mock)',
    'SAT Mathematics & EBRW',
    'PTE Academic English',
    'Senior Secondary Science',
  ];
  const [selectedSubject, setSelectedSubject] = useState(availableSubjects[0]);
  const [agreedToRules, setAgreedToRules] = useState(true);

  // Filter questions for the selected subject
  const currentQuestions = selectedSubject === 'All Subjects (Comprehensive Mock)'
    ? allQuestions
    : allQuestions.filter(q => q.subject === selectedSubject);

  const durationForExam = selectedSubject === 'All Subjects (Comprehensive Mock)'
    ? Math.max(35, config.durationMinutes)
    : config.durationMinutes;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToRules) {
      alert('Please review and acknowledge the anti-cheat and exam conduct terms.');
      return;
    }
    if (currentQuestions.length === 0) {
      alert('No questions available in this category. Please select another subject or add questions via Admin.');
      return;
    }

    onStartExam({
      candidateName: candidateName.trim() || 'Candidate',
      candidateId: candidateId.trim() || 'AA-2026-0001',
      avatarUrl: selectedAvatar,
      subject: selectedSubject,
      filteredQuestions: currentQuestions,
      durationMinutes: durationForExam,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden border border-blue-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Standardized CBT Proctored Environment
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {config.examTitle}
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl">
              Official testing session for candidate certification and academic placement.
              Verify your credentials, review the navigation shortcuts, and initiate examination mode.
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-blue-800/80 pt-4 md:pt-0 md:pl-6 gap-3">
            <div className="text-left md:text-right">
              <div className="text-xs text-blue-300 font-medium">Session Duration</div>
              <div className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                <Timer className="w-5 h-5 text-amber-400" />
                {durationForExam} Minutes
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-xs text-blue-300 font-medium">Pool Questions</div>
              <div className="text-lg md:text-xl font-bold text-white">
                {currentQuestions.length} Questions
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Candidate Information & Subject */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <User className="w-5 h-5 text-blue-800" />
              Candidate Verification & Session Setup
            </h2>

            <form onSubmit={handleStart} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white transition"
                    placeholder="Enter candidate name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Registration ID / Roll No.
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm font-medium font-mono text-slate-800 bg-slate-50 focus:bg-white transition"
                    placeholder="e.g. AA-2026-9402"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Identification Photo
                </label>
                <div className="flex items-center gap-3">
                  {AVATAR_OPTIONS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative rounded-full p-0.5 transition ${
                        selectedAvatar === avatar
                          ? 'ring-3 ring-blue-700 scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={avatar}
                        alt={`Avatar ${idx + 1}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      {selectedAvatar === avatar && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-700 text-white rounded-full p-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Examination Domain / Subject
                </label>
                <div className="space-y-2">
                  {availableSubjects.map((subj) => {
                    const qCount = subj === 'All Subjects (Comprehensive Mock)'
                      ? allQuestions.length
                      : allQuestions.filter(q => q.subject === subj).length;

                    return (
                      <label
                        key={subj}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                          selectedSubject === subj
                            ? 'bg-blue-50 border-blue-700 text-blue-950 font-semibold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="subject"
                            checked={selectedSubject === subj}
                            onChange={() => setSelectedSubject(subj)}
                            className="w-4 h-4 text-blue-700 focus:ring-blue-700"
                          />
                          <span className="text-sm">{subj}</span>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono">
                          {qCount} Questions
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Acknowledge Anti-Cheat */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToRules}
                    onChange={(e) => setAgreedToRules(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-800 focus:ring-blue-800 border-amber-300"
                  />
                  <span className="text-xs font-medium leading-relaxed">
                    I acknowledge that full-screen mode is required. Switching tabs, minimizing windows, or navigating away will log an anti-cheat violation. 
                    <strong className="block text-red-700 font-bold mt-0.5">
                      The examination will automatically terminate and submit upon 3 violations.
                    </strong>
                  </span>
                </label>
              </div>

              {/* Start Button */}
              <button
                type="submit"
                disabled={currentQuestions.length === 0}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-950/20 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                Enter Secure Fullscreen & Begin Exam
              </button>
            </form>
          </div>
        </div>

        {/* Right Info: Shortcuts & Protocol */}
        <div className="lg:col-span-5 space-y-6">
          {/* Keyboard Shortcuts Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Keyboard className="w-5 h-5 text-indigo-700" />
              <h2 className="text-base font-bold text-slate-900">
                Mandatory Keyboard Shortcuts
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              To mirror real-world professional CBT standards, the portal supports instantaneous keyboard navigation:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">Select Option Choice</span>
                <div className="flex gap-1">
                  {['A', 'B', 'C', 'D'].map((key) => (
                    <kbd key={key} className="px-2 py-1 bg-white border border-slate-300 rounded shadow-xs font-mono font-bold text-blue-900">
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">Navigate to Previous Question</span>
                <kbd className="px-2.5 py-1 bg-white border border-slate-300 rounded shadow-xs font-mono font-bold text-slate-800">
                  P
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">Navigate to Next Question</span>
                <kbd className="px-2.5 py-1 bg-white border border-slate-300 rounded shadow-xs font-mono font-bold text-slate-800">
                  N
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">Open Submit Confirmation</span>
                <kbd className="px-2.5 py-1 bg-white border border-slate-300 rounded shadow-xs font-mono font-bold text-rose-700">
                  S
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-medium">Confirm Submit / Cancel Modal</span>
                <div className="flex gap-1.5">
                  <kbd className="px-2 py-1 bg-emerald-50 border border-emerald-300 rounded shadow-xs font-mono font-bold text-emerald-800">
                    Y
                  </kbd>
                  <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded shadow-xs font-mono font-bold text-slate-700">
                    Esc / N
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Anti-cheat guidelines */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
              <ShieldAlert className="w-5 h-5 text-crimson-600 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">
                Anti-Cheat & Proctoring System
              </h2>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <Maximize2 className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                <span><strong>Fullscreen Protocol:</strong> Fullscreen mode is engaged upon start. Exiting fullscreen prompts a manual restore warning.</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>Blur & Tab Switching:</strong> Moving cursor outside the application, alt-tabbing, or switching tabs immediately increments the violation counter.</span>
              </li>
              <li className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Auto-Grading:</strong> Instant scorecard calculation and granular solutions provided immediately upon completion.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
