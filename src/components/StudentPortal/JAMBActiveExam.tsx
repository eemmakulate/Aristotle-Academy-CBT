import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Timer, 
  Maximize, 
  Minimize, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Send, 
  AlertTriangle, 
  X, 
  ZoomIn, 
  ShieldAlert, 
  Bookmark, 
  Keyboard, 
  Layers, 
  Calculator 
} from 'lucide-react';
import { 
  StudentUser, 
  Question, 
  OptionKey, 
  ViolationRecord, 
  JAMBMockSubmission, 
  SubjectScoreBreakdown 
} from '../../types';
import { formatTimeRemaining } from '../../utils/formatters';
import { sound } from '../../utils/sound';
import { JAMBCalculator } from './JAMBCalculator';

interface JAMBActiveExamProps {
  student: StudentUser;
  mockTitle: string;
  durationMinutes: number;
  subjectQuestions: Record<string, Question[]>; // Questions mapped to each of the 4 subjects
  onCompleteMock: (submission: JAMBMockSubmission) => void;
}

export const JAMBActiveExam: React.FC<JAMBActiveExamProps> = ({
  student,
  mockTitle,
  durationMinutes,
  subjectQuestions,
  onCompleteMock,
}) => {
  const allocatedSubjects = student.allocatedSubjects;
  const [currentSubject, setCurrentSubject] = useState<string>(allocatedSubjects[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Answers and Flagged mapped by question ID
  const [answers, setAnswers] = useState<Record<string, OptionKey | null>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  // Timer
  const totalSeconds = durationMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState<number>(totalSeconds);
  const startTimeRef = useRef<number>(Date.now());

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Anti-cheat state
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [lastViolationReason, setLastViolationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Submit confirmation modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Zoom image lightbox
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // On-screen calculator state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const activeSubjectQuestions = subjectQuestions[currentSubject] || [];
  const currentQuestion = activeSubjectQuestions[currentQuestionIndex] || activeSubjectQuestions[0];

  // Helper to calculate total questions across all 4 subjects
  const allExamQuestions: Question[] = [];
  allocatedSubjects.forEach(s => {
    const list = subjectQuestions[s] || [];
    allExamQuestions.push(...list);
  });

  // Handle final submission and calculate scores out of 400
  const handleSubmitMock = useCallback((reason?: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    sound.playSuccess();

    const endTime = Date.now();
    const timeSpentSeconds = Math.max(1, Math.round((endTime - startTimeRef.current) / 1000));

    // Calculate score per subject
    const breakdowns: SubjectScoreBreakdown[] = [];
    let grandCorrect = 0;
    let grandTotalScoreOutOf400 = 0;

    allocatedSubjects.forEach(subj => {
      const qList = subjectQuestions[subj] || [];
      let cCount = 0;
      let iCount = 0;
      let uCount = 0;

      qList.forEach(q => {
        const choice = answers[q.id];
        if (!choice) {
          uCount++;
        } else if (choice === q.correctOption) {
          cCount++;
        } else {
          iCount++;
        }
      });

      // Scale subject score to 100 marks standard JAMB weighting
      const scoreOutOf100 = qList.length > 0 ? Math.round((cCount / qList.length) * 100) : 0;
      grandCorrect += cCount;
      grandTotalScoreOutOf400 += scoreOutOf100;

      breakdowns.push({
        subject: subj,
        totalQuestions: qList.length,
        correctCount: cCount,
        incorrectCount: iCount,
        unansweredCount: uCount,
        scoreOutOf100,
      });
    });

    const currentViolations = [...violations];
    if (reason) {
      currentViolations.push({
        timestamp: Date.now(),
        timeFormatted: new Date().toLocaleTimeString(),
        reason,
      });
    }

    const totalQuestions = allExamQuestions.length;
    const percentage = totalQuestions > 0 ? Math.round((grandCorrect / totalQuestions) * 100) : 0;
    const passed = grandTotalScoreOutOf400 >= 200; // Benchmark 200/400

    const submission: JAMBMockSubmission = {
      id: `JAMB-SUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: student.id,
      candidateName: student.fullName,
      jambRegNo: student.jambRegNo,
      avatarUrl: student.avatarUrl,
      mockTitle,
      allocatedSubjects,
      startTime: startTimeRef.current,
      endTime,
      timeSpentSeconds,
      totalQuestions,
      totalCorrect: grandCorrect,
      totalScoreOutOf400: grandTotalScoreOutOf400,
      percentage,
      passed,
      subjectBreakdowns: breakdowns,
      answers,
      flagged,
      cheatViolations: currentViolations.length,
      violationLogs: currentViolations,
      dateFormatted: new Date().toLocaleString(),
      isResultReleased: false,
    };

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    onCompleteMock(submission);
  }, [
    isSubmitting, 
    allocatedSubjects, 
    subjectQuestions, 
    answers, 
    violations, 
    allExamQuestions.length, 
    student, 
    mockTitle, 
    onCompleteMock
  ]);

  // Request fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch {}
    };
    enterFullscreen();

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {}
  };

  // Anti-Cheat: Tab switching & blur detection
  const recordViolation = useCallback((reason: string) => {
    if (isSubmitting) return;
    sound.playWarningBeep();

    const newRecord: ViolationRecord = {
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString(),
      reason,
    };

    setViolations(prev => {
      const updated = [...prev, newRecord];
      setLastViolationReason(reason);
      setShowViolationModal(true);

      if (updated.length >= 3) {
        setTimeout(() => {
          handleSubmitMock('Terminated on 3 Proctoring Violations');
        }, 1500);
      }
      return updated;
    });
  }, [isSubmitting, handleSubmitMock]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !isSubmitting) {
        recordViolation('Browser tab switched or minimized');
      }
    };

    const handleBlur = () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = setTimeout(() => {
        if (!document.hasFocus() && !isSubmitting) {
          recordViolation('Window focus lost / application unfocused');
        }
      }, 300);
    };

    const handleFocus = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, [isSubmitting, recordViolation]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitMock('Time Expired (Timer reached 00:00)');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [handleSubmitMock]);

  // Select Option
  const handleSelectOption = useCallback((opt: OptionKey) => {
    if (!currentQuestion) return;
    sound.playClick();
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: opt,
    }));
  }, [currentQuestion]);

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    sound.playClick();
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: null,
    }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    sound.playClick();
    setFlagged(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < activeSubjectQuestions.length - 1) {
      sound.playClick();
      setCurrentQuestionIndex(i => i + 1);
    } else {
      // If at end of current subject, auto advance to next subject if available
      const subjIdx = allocatedSubjects.indexOf(currentSubject);
      if (subjIdx < allocatedSubjects.length - 1) {
        sound.playClick();
        setCurrentSubject(allocatedSubjects[subjIdx + 1]);
        setCurrentQuestionIndex(0);
      }
    }
  }, [currentQuestionIndex, activeSubjectQuestions.length, allocatedSubjects, currentSubject]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      sound.playClick();
      setCurrentQuestionIndex(i => i - 1);
    }
  }, [currentQuestionIndex]);

  // Keyboard navigation shortcuts
  // A, B, C, D: Select option
  // P: Previous question
  // N: Next question
  // S: Submit modal
  // Y / P: Confirm submit in modal; N / Esc: Cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key;

      if (showSubmitModal) {
        if (key === 'y' || key === 'Y' || key === 'p' || key === 'P') {
          e.preventDefault();
          setShowSubmitModal(false);
          handleSubmitMock();
          return;
        }
        if (key === 'n' || key === 'N' || key === 'Escape') {
          e.preventDefault();
          setShowSubmitModal(false);
          return;
        }
        return;
      }

      if (showViolationModal) {
        if (key === 'Enter' || key === 'Escape') {
          e.preventDefault();
          setShowViolationModal(false);
          return;
        }
      }

      if (key === 'a' || key === 'A') {
        e.preventDefault();
        handleSelectOption('A');
      } else if (key === 'b' || key === 'B') {
        e.preventDefault();
        handleSelectOption('B');
      } else if (key === 'c' || key === 'C') {
        e.preventDefault();
        handleSelectOption('C');
      } else if (key === 'd' || key === 'D') {
        e.preventDefault();
        handleSelectOption('D');
      } else if (key === 'p' || key === 'P') {
        e.preventDefault();
        handlePrev();
      } else if (key === 'n' || key === 'N') {
        e.preventDefault();
        handleNext();
      } else if (key === 's' || key === 'S') {
        e.preventDefault();
        setShowSubmitModal(true);
      } else if (key === 'f' || key === 'F') {
        e.preventDefault();
        handleToggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showSubmitModal, 
    showViolationModal, 
    handleSelectOption, 
    handlePrev, 
    handleNext, 
    handleSubmitMock
  ]);

  // Total answers calculation
  const totalAnsweredAcrossExam = allExamQuestions.filter(q => answers[q.id] != null).length;
  const totalUnanswered = allExamQuestions.length - totalAnsweredAcrossExam;
  const totalFlagged = allExamQuestions.filter(q => !!flagged[q.id]).length;
  const overallProgress = allExamQuestions.length > 0 ? Math.round((totalAnsweredAcrossExam / allExamQuestions.length) * 100) : 0;

  const timerInfo = formatTimeRemaining(timeRemaining);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* =========================================================================
          1. STICKY TOP PROCTOR HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* Candidate Profile Info */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white truncate">
                  {student.fullName}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                  {student.jambRegNo}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate">
                Seat: <strong>A-14</strong> • Overall Answered: {totalAnsweredAcrossExam}/{allExamQuestions.length} ({overallProgress}%)
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-base md:text-lg font-bold border transition ${
              timerInfo.isCritical
                ? 'bg-rose-600/30 text-rose-300 border-rose-500 animate-pulse'
                : timerInfo.isUrgent
                ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                : 'bg-blue-950/80 text-white border-blue-800'
            }`}>
              <Timer className={`w-4 h-4 md:w-5 md:h-5 ${
                timerInfo.isCritical ? 'text-rose-400 animate-spin' : timerInfo.isUrgent ? 'text-amber-400' : 'text-blue-400'
              }`} />
              <span>{timerInfo.formatted}</span>
            </div>

            {violations.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-700 text-rose-300 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Violations: {violations.length}/3</span>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isFullscreen
                  ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                  : 'bg-amber-950/70 border-amber-600 text-amber-300 hover:bg-amber-900'
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-4 h-4 text-emerald-400" />
                  <span className="hidden xl:inline">Fullscreen Active</span>
                </>
              ) : (
                <>
                  <Maximize className="w-4 h-4 text-amber-400" />
                  <span className="hidden xl:inline">Re-enter Fullscreen</span>
                </>
              )}
            </button>

            {/* Calculator button */}
            <button
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isCalculatorOpen
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
              title="Open On-Screen JAMB Calculator"
            >
              <Calculator className="w-4 h-4 text-blue-300" />
              <span className="hidden xl:inline">Calculator</span>
            </button>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs md:text-sm font-bold shadow-sm transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Mock</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-rose-950 rounded border border-rose-600 font-mono">
                S
              </kbd>
            </button>
          </div>
        </div>

        {/* =========================================================================
            SUBJECT SELECTION TABS (JAMB 4 SUBJECTS)
            ========================================================================= */}
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-1.5 overflow-x-auto flex items-center gap-2">
          {allocatedSubjects.map((subj, idx) => {
            const isSubjActive = currentSubject === subj;
            const qList = subjectQuestions[subj] || [];
            const ansCount = qList.filter(q => answers[q.id] != null).length;

            return (
              <button
                key={subj}
                onClick={() => {
                  sound.playClick();
                  setCurrentSubject(subj);
                  setCurrentQuestionIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSubjActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{idx + 1}. {subj}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSubjActive ? 'bg-blue-900 text-blue-100' : 'bg-slate-900 text-slate-400'
                }`}>
                  {ansCount}/{qList.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1 transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </header>

      {/* =========================================================================
          2. MAIN EXAM BODY (Current Subject Question + Palette)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Question Card (8 Cols) */}
        <main className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex-1 flex flex-col">
            {currentQuestion ? (
              <>
                {/* Question Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-blue-900 text-white font-mono text-xs font-bold">
                      {currentSubject} — Q{currentQuestionIndex + 1} of {activeSubjectQuestions.length}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      {currentQuestion.subtopic}
                    </span>
                  </div>

                  <button
                    onClick={handleToggleFlag}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      flagged[currentQuestion.id]
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flagged[currentQuestion.id] ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                    <span>{flagged[currentQuestion.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                    <kbd className="hidden sm:inline px-1 py-0.5 text-[9px] bg-slate-100 border border-slate-300 rounded font-mono">
                      F
                    </kbd>
                  </button>
                </div>

                {/* Question Text */}
                <div className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed mb-6 whitespace-pre-line">
                  {currentQuestion.text}
                </div>

                {/* Optional Image */}
                {currentQuestion.imageUrl && (
                  <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3 relative group">
                    <div 
                      className="max-h-72 flex items-center justify-center overflow-hidden rounded-lg cursor-zoom-in"
                      onClick={() => setZoomedImage(currentQuestion.imageUrl || null)}
                    >
                      <img
                        src={currentQuestion.imageUrl}
                        alt="Question diagram"
                        className="max-h-64 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Options Choices (A, B, C, D) */}
                <div className="space-y-3 mb-6">
                  {(['A', 'B', 'C', 'D'] as OptionKey[]).map(optKey => {
                    const isSelected = answers[currentQuestion.id] === optKey;
                    const optImage = currentQuestion.optionImages?.[optKey];

                    return (
                      <button
                        key={optKey}
                        type="button"
                        onClick={() => handleSelectOption(optKey)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'border-blue-900 bg-blue-50 text-blue-950 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border transition ${
                          isSelected ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {optKey}
                        </div>
                        <div className="flex-1 pt-0.5 text-sm sm:text-base font-normal leading-relaxed space-y-2">
                          {currentQuestion.options[optKey] && (
                            <div>{currentQuestion.options[optKey]}</div>
                          )}
                          {optImage && (
                            <div 
                              className="mt-2 rounded-lg border border-slate-200 bg-white p-1.5 max-w-xs cursor-zoom-in"
                              onClick={(e) => {
                                e.stopPropagation();
                                setZoomedImage(optImage);
                              }}
                            >
                              <img
                                src={optImage}
                                alt={`Option ${optKey} diagram`}
                                className="max-h-36 object-contain rounded"
                              />
                              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">Click to enlarge image</span>
                            </div>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                          isSelected ? 'border-blue-900 bg-blue-900 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Card Navigation Footer */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleClearResponse}
                    disabled={answers[currentQuestion.id] == null}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Response</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                      <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-slate-100 border border-slate-300 rounded font-mono">
                        P
                      </kbd>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                      <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-blue-950 text-blue-200 rounded border border-blue-700 font-mono">
                        N
                      </kbd>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                No questions found in this allocated subject bank.
              </div>
            )}
          </div>
        </main>

        {/* Right: Question Palette for Active Subject (4 Cols) */}
        <aside className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-900" />
              <span>{currentSubject} Grid</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {activeSubjectQuestions.length} Questions
            </span>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {activeSubjectQuestions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const isAnswered = answers[q.id] != null;
              const isFlagged = !!flagged[q.id];

              let bg = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
              if (isFlagged) {
                bg = 'bg-amber-400 text-amber-950 font-bold border-amber-500';
              } else if (isAnswered) {
                bg = 'bg-emerald-600 text-white font-bold border-emerald-700';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    sound.playClick();
                    setCurrentQuestionIndex(idx);
                  }}
                  className={`relative h-10 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center border cursor-pointer ${bg} ${
                    isCurrent ? 'ring-2 ring-blue-700 ring-offset-2 scale-105 shadow-md' : ''
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-600 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 4 Subjects Progress Summary */}
          <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              4-Subject Completion Status:
            </span>
            {allocatedSubjects.map(s => {
              const qList = subjectQuestions[s] || [];
              const count = qList.filter(q => answers[q.id] != null).length;
              return (
                <div key={s} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 truncate font-medium">{s}</span>
                  <span className="font-mono font-bold text-blue-900">{count}/{qList.length}</span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* =========================================================================
          3. ANTI-CHEAT VIOLATION WARNING MODAL
          ========================================================================= */}
      {showViolationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-3 bg-rose-100 rounded-full">
                <ShieldAlert className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Anti-Cheat Violation Detected
                </h3>
                <span className="text-xs font-mono font-bold text-rose-600">
                  Incident {violations.length} of 3
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              You left the JAMB testing window or switched tabs:
              <span className="block mt-1 font-semibold text-slate-900 bg-rose-50 p-2 rounded-lg border border-rose-200">
                "{lastViolationReason}"
              </span>
            </p>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 mb-6">
              <strong>Strict UTME Policy:</strong> The examination will automatically submit upon <strong>3 violations</strong>.
            </div>

            <button
              onClick={() => {
                setShowViolationModal(false);
                if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              I Acknowledge — Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. SUBMIT CONFIRMATION MODAL (KEYBOARD: Y / P = confirm, N / Esc = cancel)
          ========================================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Submit Mock Examination
                  </h3>
                  <p className="text-xs text-slate-500">
                    Graded across your 4 allocated subjects out of 400 marks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-2xl font-black text-emerald-700">{totalAnsweredAcrossExam}</div>
                <div className="text-xs font-semibold text-emerald-800">Answered</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-2xl font-black text-rose-700">{totalUnanswered}</div>
                <div className="text-xs font-semibold text-rose-800">Unanswered</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-2xl font-black text-amber-700">{totalFlagged}</div>
                <div className="text-xs font-semibold text-amber-800">Flagged</div>
              </div>
            </div>

            {totalUnanswered > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs mb-5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Warning:</strong> You still have <strong>{totalUnanswered} unanswered questions</strong> across your 4 subjects.
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Return to Exam</span>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded border border-slate-300 font-mono">
                  Esc / N
                </kbd>
              </button>

              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitMock();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Yes, Finalize & Submit</span>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-blue-950 text-blue-200 rounded border border-blue-700 font-mono">
                  Y / P
                </kbd>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Zoom */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-4 shadow-2xl overflow-auto">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 bg-slate-900 text-white p-2 rounded-full hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={zoomedImage} alt="Diagram zoom" className="max-h-[80vh] w-auto mx-auto object-contain" />
          </div>
        </div>
      )}

      {/* On-Screen Standard JAMB Calculator */}
      <JAMBCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};
