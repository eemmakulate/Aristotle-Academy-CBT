import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Printer, 
  RotateCcw, 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  GraduationCap,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Lock,
  ZoomIn,
  X
} from 'lucide-react';
import { JAMBMockSubmission, Question, OptionKey } from '../../types';
import { formatSeconds } from '../../utils/formatters';
import { JAMBStorageService } from '../../utils/storage';

interface JAMBScorecardProps {
  submission: JAMBMockSubmission;
  onReturnToDashboard: () => void;
}

export const JAMBScorecard: React.FC<JAMBScorecardProps> = ({
  submission,
  onReturnToDashboard,
}) => {
  const isQualified = submission.totalScoreOutOf400 >= 200;
  const [isReviewing, setIsReviewing] = useState(false);
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // If result is NOT yet released by administrator
  if (!submission.isResultReleased) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 sm:p-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Result Pending Official Release by Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Examination Successfully Submitted
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Your test responses for <span className="font-bold text-slate-800">{submission.mockTitle}</span> have been safely recorded and archived on the server.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 max-w-lg mx-auto text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Candidate Name:</span>
              <span className="font-bold text-slate-900">{submission.candidateName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">JAMB Registration No:</span>
              <span className="font-mono font-bold text-blue-900">{submission.jambRegNo}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Allocated 4 Subjects:</span>
              <span className="font-semibold text-slate-800">{submission.allocatedSubjects.join(', ')}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Submission Timestamp:</span>
              <span className="font-mono text-slate-700">{submission.dateFormatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Duration Taken:</span>
              <span className="font-mono font-bold text-slate-900">{formatSeconds(submission.timeSpentSeconds)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 text-left max-w-lg mx-auto leading-relaxed">
            <strong>Official Policy Notice:</strong> In accordance with Aristotle Academy CBT regulations, candidate scorecards, aggregate marks out of 400, and full solution corrections will be published on your student portal once released by the Chief Examiner.
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onReturnToDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Return to Student Portal Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allQuestions = JAMBStorageService.getQuestions();
  const examQuestions = allQuestions.filter(q => submission.allocatedSubjects.includes(q.subject));

  const filteredQuestions = examQuestions.filter(q => {
    const matchSubject = selectedSubjectTab === 'All' || q.subject === selectedSubjectTab;
    const choice = submission.answers[q.id];
    const isCorrect = choice === q.correctOption;
    const isUnanswered = choice == null;

    if (!matchSubject) return false;
    if (filterType === 'correct') return isCorrect;
    if (filterType === 'incorrect') return !isCorrect && !isUnanswered;
    if (filterType === 'unanswered') return isUnanswered;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        {/* JAMB Official Result Header */}
        <div className={`p-8 text-white ${
          isQualified 
            ? 'bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950'
            : 'bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                <GraduationCap className="w-3.5 h-3.5" />
                Joint Admissions and Matriculation Board (JAMB) Simulation
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                UTME Mock Examination Score Slip
              </h1>
              <p className="text-blue-200 text-xs sm:text-sm">
                Candidate Reg No: <span className="font-mono font-bold text-white">{submission.jambRegNo}</span> • Verified on {submission.dateFormatted}
              </p>
            </div>

            {/* Total Aggregate Score Badge Out of 400 */}
            <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center self-start sm:self-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 block">
                Total JAMB Aggregate
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {submission.totalScoreOutOf400} <span className="text-lg font-bold text-blue-300">/ 400</span>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Info Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={submission.avatarUrl}
              alt={submission.candidateName}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base">{submission.candidateName}</h3>
              <p className="text-xs font-mono text-slate-500">
                Session ID: <strong>{submission.id}</strong>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 block">Admissions Benchmark</span>
            <span className={`text-xs font-black px-3 py-1 rounded-full border inline-block ${
              isQualified
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              {isQualified ? '✓ ELIGIBLE FOR COMPETITIVE MERIT (>200)' : 'BELOW 200 CUT-OFF BENCHMARK'}
            </span>
          </div>
        </div>

        {!isReviewing ? (
          /* =========================================================================
              VIEW A: SUMMARY SCORECARD SLIP
              ========================================================================= */
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-900" />
                Allocated 4 Subjects Breakdown (Graded out of 100 Each)
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4 text-center">Questions</th>
                      <th className="py-3 px-4 text-center">Correct</th>
                      <th className="py-3 px-4 text-center">Incorrect</th>
                      <th className="py-3 px-4 text-center">Unanswered</th>
                      <th className="py-3 px-4 text-right">Scaled Score / 100</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {submission.subjectBreakdowns.map((sb, idx) => (
                      <tr key={sb.subject} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {idx + 1}. {sb.subject}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">{sb.totalQuestions}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-700 font-bold font-mono">
                          {sb.correctCount}
                        </td>
                        <td className="py-3.5 px-4 text-center text-rose-700 font-mono">
                          {sb.incorrectCount}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-500 font-mono">
                          {sb.unansweredCount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-sm text-blue-900">
                          {sb.scoreOutOf100} / 100
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-black text-sm text-slate-900">
                      <td colSpan={5} className="py-3 px-4">
                        TOTAL JAMB AGGREGATE SCORE (4 SUBJECTS)
                      </td>
                      <td className="py-3 px-4 text-right text-base text-blue-900 font-black">
                        {submission.totalScoreOutOf400} / 400
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Time & Proctoring Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-800 font-bold uppercase tracking-wider block">Total Exam Duration</span>
                  <span className="text-xl font-black text-blue-950 font-mono">{formatSeconds(submission.timeSpentSeconds)}</span>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>

              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                submission.cheatViolations === 0
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : 'bg-amber-50/80 border-amber-200'
              }`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block text-slate-700">Anti-Cheat Proctoring Status</span>
                  <span className="text-xl font-black font-mono">
                    {submission.cheatViolations === 0 ? 'Pristine (0 Incidents)' : `${submission.cheatViolations} Warnings Logged`}
                  </span>
                </div>
                {submission.cheatViolations === 0 ? (
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-8 h-8 text-amber-600" />
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 print:hidden">
              <button
                onClick={onReturnToDashboard}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Back to Student Portal</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Result Slip</span>
                </button>

                <button
                  onClick={() => setIsReviewing(true)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Review Step-by-Step Corrections</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
              VIEW B: INTERACTIVE STEP-BY-STEP CORRECTIONS REVIEW
              ========================================================================= */
          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <button
                  onClick={() => setIsReviewing(false)}
                  className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 mb-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return to Result Slip</span>
                </button>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-900" />
                  Detailed 4-Subject Corrections & Examiner Explanations
                </h2>
              </div>

              {/* Subject Tabs Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setSelectedSubjectTab('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    selectedSubjectTab === 'All' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  All Subjects
                </button>
                {submission.allocatedSubjects.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubjectTab(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold truncate cursor-pointer ${
                      selectedSubjectTab === s ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {filteredQuestions.map((q, idx) => {
                const chosen = submission.answers[q.id];
                const isCorrect = chosen === q.correctOption;
                const isUnanswered = chosen == null;

                return (
                  <div key={q.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-blue-900 text-white text-xs font-mono font-bold">
                          {q.subject} • Q{idx + 1}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{q.subtopic}</span>
                      </div>

                      {isCorrect ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                        </span>
                      ) : isUnanswered ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                          Unanswered (0)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                      {q.text}
                    </p>

                    {/* Optional Question Image */}
                    {q.imageUrl && (
                      <div className="rounded-xl border border-slate-200 bg-white p-2 max-w-md">
                        <img
                          src={q.imageUrl}
                          alt="Question diagram"
                          className="max-h-48 object-contain rounded cursor-zoom-in"
                          onClick={() => setZoomedImage(q.imageUrl || null)}
                        />
                        <span className="text-[10px] text-slate-500 block mt-1">Click image to enlarge</span>
                      </div>
                    )}

                    {/* Options list with optional option images */}
                    <div className="space-y-2">
                      {(['A', 'B', 'C', 'D'] as OptionKey[]).map(optKey => {
                        const isStudent = chosen === optKey;
                        const isOfficialCorrect = q.correctOption === optKey;
                        const optImg = q.optionImages?.[optKey];

                        let style = 'bg-white border-slate-200 text-slate-700';
                        if (isOfficialCorrect) {
                          style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isStudent && !isOfficialCorrect) {
                          style = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                        }

                        return (
                          <div key={optKey} className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${style}`}>
                            <div className="flex items-start sm:items-center gap-2 flex-1">
                              <span className="w-6 h-6 rounded-md bg-slate-100 font-mono font-bold flex items-center justify-center border text-[11px] shrink-0">
                                {optKey}
                              </span>
                              <div className="space-y-1.5 flex-1">
                                {q.options[optKey] && <span>{q.options[optKey]}</span>}
                                {optImg && (
                                  <div 
                                    className="p-1 rounded bg-white border max-w-xs cursor-zoom-in"
                                    onClick={() => setZoomedImage(optImg)}
                                  >
                                    <img src={optImg} alt={`Option ${optKey}`} className="max-h-28 object-contain rounded" />
                                    <span className="text-[9px] text-slate-500 block">Zoom option image</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-[11px] shrink-0">
                              {isOfficialCorrect && '✓ Correct Option'}
                              {isStudent && !isOfficialCorrect && '✗ Your Answer'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Faculty Explanation */}
                    <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-blue-900">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span>JAMB Faculty Solution & Derivation:</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line text-slate-800">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsReviewing(false)}
                className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer"
              >
                Return to Scorecard Slip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={zoomedImage} alt="Enlarged diagram" className="max-h-[85vh] w-auto object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
