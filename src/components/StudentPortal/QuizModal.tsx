import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  X, 
  ArrowRight, 
  HelpCircle,
  Award,
  Sparkles
} from 'lucide-react';
import { Question, OptionKey, QuizResult, StudentUser } from '../../types';
import { sound } from '../../utils/sound';
import { JAMBStorageService } from '../../utils/storage';

interface QuizModalProps {
  student: StudentUser;
  subject: string;
  questions: Question[];
  onClose: () => void;
  onQuizCompleted: (result: QuizResult) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  student,
  subject,
  questions,
  onClose,
  onQuizCompleted,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey | null>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [scoreResult, setScoreResult] = useState<QuizResult | null>(null);

  const currentQ = questions[currentIndex];

  const handleSelect = (opt: OptionKey) => {
    sound.playClick();
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleFinishQuiz = () => {
    sound.playSuccess();
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOption) {
        correct++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const result: QuizResult = {
      id: `qres-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName,
      quizId: `quiz-${subject.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      quizTitle: `${subject} Rapid Practice Drill`,
      subject,
      score: correct,
      totalQuestions: questions.length,
      percentage,
      date: new Date().toLocaleString(),
    };

    JAMBStorageService.saveQuizResult(result);
    setScoreResult(result);
    setIsFinished(true);
    onQuizCompleted(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {!isFinished ? (
          <>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {subject} Rapid Drill
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Question {currentIndex + 1} of {questions.length}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-slate-900 text-sm sm:text-base font-medium leading-relaxed mb-6 whitespace-pre-line">
              {currentQ.text}
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-6">
              {(['A', 'B', 'C', 'D'] as OptionKey[]).map(optKey => {
                const isSelected = answers[currentQ.id] === optKey;
                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelect(optKey)}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-blue-900 bg-blue-50 text-blue-950 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                      isSelected ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {optKey}
                    </span>
                    <span className="text-sm flex-1 pt-0.5">{currentQ.options[optKey]}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(i => i + 1)}
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Submit & See Quiz Score
                </button>
              )}
            </div>
          </>
        ) : (
          /* Finished Result View */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Quiz Completed!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {subject} Continuous Assessment Performance
            </p>

            <div className="my-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 inline-block min-w-[240px]">
              <div className="text-4xl font-black text-slate-900">
                {scoreResult?.score} / {scoreResult?.totalQuestions}
              </div>
              <div className="text-sm font-bold text-emerald-700 mt-1">
                {scoreResult?.percentage}% Score
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Recorded in your Student Profile
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
