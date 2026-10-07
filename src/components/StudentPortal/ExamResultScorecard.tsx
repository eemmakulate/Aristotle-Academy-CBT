import React from 'react';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Clock, 
  ShieldAlert, 
  BookOpen, 
  RotateCcw, 
  Printer, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { ExamSubmission } from '../../types';
import { formatSeconds } from '../../utils/formatters';

interface ExamResultScorecardProps {
  submission: ExamSubmission;
  passingPercentage?: number;
  onReviewCorrections: () => void;
  onRetakeExam: () => void;
}

export const ExamResultScorecard: React.FC<ExamResultScorecardProps> = ({
  submission,
  passingPercentage = 65,
  onReviewCorrections,
  onRetakeExam,
}) => {
  const isPassed = submission.percentage >= passingPercentage;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Printable Result Certificate Slip Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        {/* Certificate / Slip Header */}
        <div className={`p-8 text-white relative ${
          isPassed 
            ? 'bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900' 
            : 'bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <Award className="w-3.5 h-3.5" />
                Aristotle Academy CBT Assessment System
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Official Examination Scorecard
              </h1>
              <p className="text-blue-200 text-xs sm:text-sm">
                Reference ID: <span className="font-mono">{submission.id}</span> • Certified on {submission.dateFormatted}
              </p>
            </div>

            {/* Pass / Fail Big Badge */}
            <div className={`px-6 py-3 rounded-2xl border-2 flex items-center gap-3 self-start sm:self-auto ${
              isPassed
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-rose-500/20 border-rose-400 text-rose-300'
            }`}>
              {isPassed ? (
                <Trophy className="w-8 h-8 text-emerald-400" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400" />
              )}
              <div>
                <div className="text-xs uppercase tracking-wider font-bold">Assessment Result</div>
                <div className="text-xl sm:text-2xl font-black">
                  {isPassed ? 'PASSED / QUALIFIED' : 'DID NOT MEET BENCHMARK'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Profile Details Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={submission.avatarUrl}
              alt={submission.candidateName}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {submission.candidateName}
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Roll ID: <strong className="text-slate-800">{submission.candidateId}</strong>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 font-medium block">Examination Subject</span>
            <span className="text-sm font-bold text-blue-950 bg-blue-100/60 px-3 py-1 rounded-lg border border-blue-200 inline-block">
              {submission.subject}
            </span>
          </div>
        </div>

        {/* Main Scorecard Body */}
        <div className="p-8 space-y-8">
          {/* Primary Metric Ring / Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke={isPassed ? '#10b981' : '#f43f5e'}
                    strokeWidth="10"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * submission.percentage) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-slate-900">
                    {submission.percentage}%
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Final Score
                  </span>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-slate-600 font-medium">
                Benchmark threshold: <span className="font-bold text-slate-900">{passingPercentage}%</span>
              </div>
            </div>

            {/* Key Metrics Breakdown */}
            <div className="md:col-span-7 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <div className="flex items-center justify-between text-emerald-800 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Correct Answers</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-900">
                  {submission.correctCount}
                  <span className="text-xs font-medium text-emerald-700 ml-1">/ {submission.totalQuestions}</span>
                </div>
                <div className="text-xs text-emerald-700 mt-1">
                  +{submission.correctCount} marks earned
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
                <div className="flex items-center justify-between text-rose-800 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Incorrect Answers</span>
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-rose-900">
                  {submission.incorrectCount}
                </div>
                <div className="text-xs text-rose-700 mt-1">
                  Needs conceptual review
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
                <div className="flex items-center justify-between text-slate-700 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Unanswered</span>
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {submission.unansweredCount}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Skipped / timed out
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
                <div className="flex items-center justify-between text-blue-900 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">Time Utilized</span>
                  <Clock className="w-4 h-4 text-blue-700" />
                </div>
                <div className="text-2xl font-black text-blue-950 font-mono">
                  {formatSeconds(submission.timeSpentSeconds)}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Total duration spent
                </div>
              </div>
            </div>
          </div>

          {/* Anti-Cheat Integrity Audit Log */}
          <div className={`p-5 rounded-2xl border ${
            submission.cheatViolations === 0
              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {submission.cheatViolations === 0 ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                )}
                <h4 className="font-bold text-sm">
                  {submission.cheatViolations === 0
                    ? 'Proctoring Integrity Verification: Pristine Session'
                    : `Proctoring Warnings Recorded (${submission.cheatViolations})`}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold">
                {submission.cheatViolations === 0 ? 'STATUS: VERIFIED' : 'STATUS: FLAGGED'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {submission.cheatViolations === 0
                ? 'Candidate remained in full-screen focus throughout the duration. No tab-switching or abnormal blur events were registered.'
                : 'The system logged focus deviations during examination. Below is the automated audit ledger.'}
            </p>

            {submission.violationLogs.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-amber-200/60 pt-2 text-xs">
                {submission.violationLogs.map((log: { timeFormatted: string; reason: string }, i: number) => (
                  <div key={i} className="flex items-center justify-between font-mono text-[11px] text-amber-900">
                    <span>Incident #{i + 1}: {log.reason}</span>
                    <span className="text-amber-700">{log.timeFormatted}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 print:hidden">
            <button
              onClick={onRetakeExam}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return to Exam Lobby</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Result Certificate</span>
              </button>

              <button
                onClick={onReviewCorrections}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-950/20 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Review Detailed Corrections</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
