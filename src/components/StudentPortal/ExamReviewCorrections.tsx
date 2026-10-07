import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Flag, 
  BookOpen, 
  Lightbulb, 
  ZoomIn, 
  X,
  Filter
} from 'lucide-react';
import { Question, OptionKey, ExamSubmission } from '../../types';

interface ExamReviewCorrectionsProps {
  submission: ExamSubmission;
  questions: Question[];
  onBackToScorecard: () => void;
}

export const ExamReviewCorrections: React.FC<ExamReviewCorrectionsProps> = ({
  submission,
  questions,
  onBackToScorecard,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered' | 'flagged'>('all');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const filteredQuestions = questions.filter((q) => {
    const chosen = submission.answers[q.id];
    const isCorrect = chosen === q.correctOption;
    const isUnanswered = chosen == null;
    const isFlagged = !!submission.flagged[q.id];

    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect && !isUnanswered;
    if (filter === 'unanswered') return isUnanswered;
    if (filter === 'flagged') return isFlagged;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onBackToScorecard}
            className="inline-flex items-center gap-1.5 text-blue-900 hover:text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Final Scorecard
          </button>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-900" />
            Detailed Examination Review & Explanations
          </h1>
          <p className="text-xs text-slate-500">
            Candidate: <strong>{submission.candidateName}</strong> ({submission.candidateId}) • Score: {submission.percentage}%
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filter === 'correct'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            Correct ({submission.correctCount})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filter === 'incorrect'
                ? 'bg-rose-700 text-white'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            Incorrect ({submission.incorrectCount})
          </button>
          <button
            onClick={() => setFilter('unanswered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filter === 'unanswered'
                ? 'bg-slate-700 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Skipped ({submission.unansweredCount})
          </button>
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <Filter className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="font-semibold text-slate-700">No questions match this filter criteria.</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const originalIndex = questions.findIndex((item) => item.id === q.id);
            const chosen = submission.answers[q.id];
            const isCorrect = chosen === q.correctOption;
            const isUnanswered = chosen == null;
            const isFlagged = !!submission.flagged[q.id];

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5"
              >
                {/* Question Header Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-900 text-white">
                      Question #{originalIndex + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {q.subtopic}
                    </span>
                    {isFlagged && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                        <Flag className="w-3 h-3 fill-amber-700" />
                        Flagged
                      </span>
                    )}
                  </div>

                  {/* Result Badge */}
                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Correct (+1)
                      </span>
                    ) : isUnanswered ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                        Unanswered (0)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Body */}
                <div className="text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                  {q.text}
                </div>

                {/* Optional Diagram */}
                {q.imageUrl && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 max-w-md">
                    <div 
                      className="cursor-zoom-in"
                      onClick={() => setZoomedImage(q.imageUrl || null)}
                    >
                      <img
                        src={q.imageUrl}
                        alt="Question diagram"
                        className="max-h-48 mx-auto object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Options Choices Grid with Highlighting */}
                <div className="space-y-2.5">
                  {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => {
                    const isCandidateChoice = chosen === optKey;
                    const isTheCorrectOption = q.correctOption === optKey;

                    let rowStyle = 'bg-slate-50/70 border-slate-200 text-slate-700';
                    let badgeStyle = 'bg-white border-slate-300 text-slate-700';

                    if (isTheCorrectOption) {
                      rowStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                      badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isCandidateChoice && !isTheCorrectOption) {
                      rowStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold ring-1 ring-rose-400';
                      badgeStyle = 'bg-rose-600 text-white border-rose-600';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${rowStyle}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${badgeStyle}`}
                        >
                          {optKey}
                        </div>
                        <div className="flex-1 text-sm pt-0.5 leading-relaxed">
                          {q.options[optKey]}
                        </div>
                        <div className="shrink-0 text-xs font-bold pt-1">
                          {isTheCorrectOption && (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              Correct Answer
                            </span>
                          )}
                          {isCandidateChoice && !isTheCorrectOption && (
                            <span className="text-rose-700 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              Your Response
                            </span>
                          )}
                          {isCandidateChoice && isTheCorrectOption && (
                            <span className="text-emerald-700 text-[11px] block text-right">
                              (Your Choice)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* In-depth Solution & Explanation Box */}
                <div className="bg-blue-50/80 rounded-2xl p-4 sm:p-5 border border-blue-200/80 text-blue-950">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-blue-900 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Aristotle Academic Faculty Solution & Derivation</span>
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-line font-normal">
                    {q.explanation}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Zoom Lightbox */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-4 shadow-2xl overflow-auto">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 bg-slate-900 text-white p-2 rounded-full hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Diagram Zoom"
              className="max-h-[80vh] w-auto mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
