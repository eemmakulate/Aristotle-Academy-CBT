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
  Check, 
  Eye, 
  Bookmark,
  Keyboard,
  Sparkles
} from 'lucide-react';
import { Question, OptionKey, ViolationRecord, ExamSubmission } from '../../types';
import { formatTimeRemaining } from '../../utils/formatters';
import { sound } from '../../utils/sound';

interface ActiveExamProps {
  candidateName: string;
  candidateId: string;
  avatarUrl: string;
  subject: string;
  questions: Question[];
  durationMinutes: number;
  maxViolations?: number;
  onCompleteExam: (submission: ExamSubmission) => void;
}

export const ActiveExam: React.FC<ActiveExamProps> = ({
  candidateName,
  candidateId,
  avatarUrl,
  subject,
  questions,
  durationMinutes,
  maxViolations = 3,
  onCompleteExam,
}) => {
  // Navigation & Answers State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey | null>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  // Timer State (in seconds)
  const totalSeconds = durationMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const startTimeRef = useRef<number>(Date.now());

  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Anti-Cheat State
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [lastViolationReason, setLastViolationReason] = useState('');
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Submit Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Zoom Lightbox State
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Mobile Palette Drawer Toggle
  const [showMobilePalette, setShowMobilePalette] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Helper to trigger submission
  const handleSubmitExam = useCallback((autoTriggeredReason?: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    sound.playSuccess();

    const endTime = Date.now();
    const timeSpentSeconds = Math.max(1, Math.round((endTime - startTimeRef.current) / 1000));

    // Calculate score
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    questions.forEach((q) => {
      const chosen = answers[q.id];
      if (!chosen) {
        unansweredCount++;
      } else if (chosen === q.correctOption) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 65;

    const currentViolations = [...violations];
    if (autoTriggeredReason) {
      currentViolations.push({
        timestamp: Date.now(),
        timeFormatted: new Date().toLocaleTimeString(),
        reason: autoTriggeredReason,
      });
    }

    const submission: ExamSubmission = {
      id: `SUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      candidateName,
      candidateId,
      avatarUrl,
      subject,
      startTime: startTimeRef.current,
      endTime,
      timeSpentSeconds,
      totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      score: correctCount,
      percentage,
      passed,
      answers,
      flagged,
      cheatViolations: currentViolations.length,
      violationLogs: currentViolations,
      dateFormatted: new Date().toLocaleString(),
    };

    // Exit fullscreen cleanly if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    onCompleteExam(submission);
  }, [
    isSubmitting, 
    questions, 
    answers, 
    flagged, 
    violations, 
    candidateName, 
    candidateId, 
    avatarUrl, 
    subject, 
    onCompleteExam
  ]);

  // Request fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch {
        // User may need gesture interaction
      }
    };
    enterFullscreen();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
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
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  };

  // Anti-Cheat: Tab switching & blur detector
  const recordViolation = useCallback((reason: string) => {
    if (isSubmitting) return;

    sound.playWarningBeep();
    const newRecord: ViolationRecord = {
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString(),
      reason,
    };

    setViolations((prev) => {
      const updated = [...prev, newRecord];
      setLastViolationReason(reason);
      setShowViolationModal(true);

      // Check if threshold exceeded
      if (updated.length >= maxViolations) {
        setTimeout(() => {
          handleSubmitExam(`Exceeded maximum anti-cheat violations (${maxViolations}/${maxViolations})`);
        }, 1500);
      }
      return updated;
    });
  }, [isSubmitting, maxViolations, handleSubmitExam]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitting) {
        recordViolation('Browser tab switched or minimized');
      }
    };

    const handleWindowBlur = () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      // Small debounce to avoid false positives during file pickers or modal dialogs
      blurTimeoutRef.current = setTimeout(() => {
        if (!document.hasFocus() && !isSubmitting) {
          recordViolation('Window focus lost / Application unfocused');
        }
      }, 300);
    };

    const handleWindowFocus = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, [isSubmitting, recordViolation]);

  // Live Timer Countdown
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleSubmitExam('Exam timer reached 00:00 (Time Expired)');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [handleSubmitExam]);

  // Option selection handler
  const handleSelectOption = useCallback((option: OptionKey) => {
    sound.playClick();
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  }, [currentQuestion]);

  const handleClearResponse = () => {
    sound.playClick();
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: null,
    }));
  };

  const handleToggleFlag = () => {
    sound.playClick();
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      sound.playClick();
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      sound.playClick();
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  // KEYBOARD NAVIGATION SHORTCUTS
  // A, B, C, D: Select option
  // P / p: Previous question
  // N / n: Next question
  // S / s: Trigger submit confirmation modal
  // In Submit Modal:
  //   Y / y: Confirm submission
  //   N / n / Escape: Cancel submission
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key;

      // Handle Submit Confirmation Modal keys
      if (showSubmitModal) {
        if (key === 'y' || key === 'Y' || key === 'p' || key === 'P') {
          e.preventDefault();
          setShowSubmitModal(false);
          handleSubmitExam();
          return;
        }
        if (key === 'n' || key === 'N' || key === 'Escape') {
          e.preventDefault();
          setShowSubmitModal(false);
          return;
        }
        return; // Don't handle other keys when modal is open
      }

      // Handle Violation Modal dismiss
      if (showViolationModal) {
        if (key === 'Enter' || key === 'Escape') {
          e.preventDefault();
          setShowViolationModal(false);
          return;
        }
      }

      // Option selection shortcuts: A, B, C, D
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
      }
      // Previous: P / p
      else if (key === 'p' || key === 'P') {
        e.preventDefault();
        handlePrev();
      }
      // Next: N / n
      else if (key === 'n' || key === 'N') {
        e.preventDefault();
        handleNext();
      }
      // Submit: S / s
      else if (key === 's' || key === 'S') {
        e.preventDefault();
        setShowSubmitModal(true);
      }
      // Flag: F / f
      else if (key === 'f' || key === 'F') {
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
    handleSubmitExam
  ]);

  // Statistics calculation for palette and submit modal
  const answeredCount = questions.filter((q) => answers[q.id] != null).length;
  const flaggedCount = questions.filter((q) => !!flagged[q.id]).length;
  const unansweredCount = questions.length - answeredCount;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const timerInfo = formatTimeRemaining(timeRemaining);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* =========================================================================
          1. STICKY EXAM TOP HEADER BAR
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* Candidate Profile Info */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={avatarUrl}
              alt={candidateName}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white truncate">
                  {candidateName}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-blue-300 border border-slate-700">
                  {candidateId}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                <span className="text-blue-400 font-medium">{subject}</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline text-slate-400">
                  {answeredCount}/{questions.length} answered ({progressPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Countdown Timer */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-base md:text-lg font-bold border transition ${
                timerInfo.isCritical
                  ? 'bg-rose-600/30 text-rose-300 border-rose-500 animate-pulse'
                  : timerInfo.isUrgent
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-blue-950/80 text-white border-blue-800'
              }`}
            >
              <Timer
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  timerInfo.isCritical
                    ? 'text-rose-400 animate-spin'
                    : timerInfo.isUrgent
                    ? 'text-amber-400'
                    : 'text-blue-400'
                }`}
              />
              <span>{timerInfo.formatted}</span>
            </div>

            {/* Anti-cheat badge */}
            {violations.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-700 text-rose-300 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Violations: {violations.length}/{maxViolations}</span>
              </div>
            )}
          </div>

          {/* Right: Fullscreen + Mobile Palette + Submit Button */}
          <div className="flex items-center gap-2">
            {/* Fullscreen toggle button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Secure Fullscreen'}
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

            {/* Mobile Palette Button */}
            <button
              onClick={() => setShowMobilePalette(!showMobilePalette)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-medium cursor-pointer"
            >
              Grid ({questions.length})
            </button>

            {/* Submit Exam Button with [S] Badge */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 active:scale-95 text-white text-xs md:text-sm font-bold shadow-sm transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-rose-900/80 rounded border border-rose-500/50">
                S
              </kbd>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* =========================================================================
          2. MAIN EXAM BODY (Center Question Area + Sidebar Palette Grid)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question Presentation Area (8 Cols) */}
        <main className="lg:col-span-8 flex flex-col space-y-4">
          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex-1 flex flex-col">
            {/* Question Top Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-blue-900 text-white font-mono text-xs font-bold">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {currentQuestion.subtopic}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  currentQuestion.difficulty === 'Easy'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : currentQuestion.difficulty === 'Medium'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Mark for Review Button */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  flagged[currentQuestion.id]
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
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

            {/* Optional Question Image / Diagram Rendering */}
            {currentQuestion.imageUrl && (
              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3 relative group">
                <div 
                  className="max-h-72 flex items-center justify-center overflow-hidden rounded-lg cursor-zoom-in"
                  onClick={() => setZoomedImage(currentQuestion.imageUrl || null)}
                >
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question Diagram"
                    className="max-h-64 object-contain transition duration-200 group-hover:scale-102"
                  />
                </div>
                <button
                  onClick={() => setZoomedImage(currentQuestion.imageUrl || null)}
                  className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-lg text-xs font-medium flex items-center gap-1 shadow-md transition cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Enlarge Diagram</span>
                </button>
              </div>
            )}

            {/* 4 Option Choices (A, B, C, D) */}
            <div className="space-y-3 mb-6">
              {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => {
                const isSelected = answers[currentQuestion.id] === optKey;
                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-blue-800 bg-blue-50/70 text-blue-950 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {/* Option letter pill with keyboard badge */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border transition ${
                        isSelected
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {optKey}
                    </div>

                    <div className="flex-1 pt-1 text-sm sm:text-base font-normal leading-relaxed">
                      {currentQuestion.options[optKey]}
                    </div>

                    {/* Radio indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition ${
                        isSelected
                          ? 'border-blue-900 bg-blue-900 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions within Card */}
            <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClearResponse}
                disabled={answers[currentQuestion.id] == null}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Response</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Previous [P] */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                  <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-slate-100 border border-slate-300 rounded font-mono">
                    P
                  </kbd>
                </button>

                {/* Next [N] */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-35 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                  <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-blue-950 rounded border border-blue-700 font-mono text-blue-200">
                    N
                  </kbd>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right: Sidebar Question Palette Grid (4 Cols) */}
        <aside
          className={`lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col ${
            showMobilePalette ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-900" />
              Question Palette
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Total: {questions.length}
            </span>
          </div>

          {/* Color Key Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-emerald-600" />
              <span className="text-slate-700 font-medium">Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-300" />
              <span className="text-slate-700 font-medium">Unanswered ({unansweredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-amber-400" />
              <span className="text-slate-700 font-medium">Review / Flagged ({flaggedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded border-2 border-blue-600 bg-white" />
              <span className="text-slate-700 font-medium">Current (# {currentIndex + 1})</span>
            </div>
          </div>

          {/* Number Grid */}
          <div className="flex-1 overflow-y-auto max-h-[380px] pr-1">
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id] != null;
                const isFlagged = !!flagged[q.id];

                let bgClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                if (isFlagged) {
                  bgClass = 'bg-amber-400 text-amber-950 font-bold border-amber-500';
                } else if (isAnswered) {
                  bgClass = 'bg-emerald-600 text-white font-bold border-emerald-700';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCurrentIndex(idx);
                      if (showMobilePalette) setShowMobilePalette(false);
                    }}
                    className={`relative h-10 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center border cursor-pointer ${bgClass} ${
                      isCurrent
                        ? 'ring-2 ring-blue-700 ring-offset-2 scale-105 shadow-md'
                        : ''
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
          </div>

          {/* Keyboard Shortcuts Cheatsheet Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs mb-1.5">
              <Keyboard className="w-3.5 h-3.5 text-blue-800" />
              <span>Keyboard Direct Control</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-blue-900">A</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-blue-900">B</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-blue-900">C</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-blue-900">D</kbd> Options</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">P</kbd> Prev / <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">N</kbd> Next</div>
              <div><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">F</kbd> Toggle Flag</div>
              <div><kbd className="px-1.5 py-0.5 bg-rose-50 border border-rose-300 rounded font-mono font-bold text-rose-800">S</kbd> Submit Modal</div>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          3. ANTI-CHEAT VIOLATION MODAL
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
                  Anti-Cheat Violation Warning
                </h3>
                <span className="text-xs font-mono font-bold text-rose-600">
                  Violation {violations.length} of {maxViolations}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              You left the exam window or switched tabs:
              <span className="block mt-1 font-semibold text-slate-900 bg-rose-50 p-2 rounded-lg border border-rose-200">
                "{lastViolationReason}"
              </span>
            </p>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 mb-6">
              <strong>Strict Proctoring Policy:</strong> If you reach{' '}
              <strong className="text-rose-700 font-bold">{maxViolations} violations</strong>, your
              examination will be automatically terminated and submitted to the administration.
            </div>

            <button
              onClick={() => {
                setShowViolationModal(false);
                // Try to ensure fullscreen is active
                if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              I Understand — Return to Examination
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. SUBMIT CONFIRMATION MODAL (KEYBOARD: Y = confirm, N / Esc = cancel)
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
                    Submit Examination Confirmation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aristotle Academy CBT Engine Session Verification
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

            {/* Answer Breakdown Summary */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-2xl font-black text-emerald-700">{answeredCount}</div>
                <div className="text-xs font-semibold text-emerald-800">Answered</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-2xl font-black text-rose-700">{unansweredCount}</div>
                <div className="text-xs font-semibold text-rose-800">Unanswered</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-2xl font-black text-amber-700">{flaggedCount}</div>
                <div className="text-xs font-semibold text-amber-800">Flagged</div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs mb-5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Attention:</strong> You still have <strong>{unansweredCount} unanswered questions</strong>. 
                  Unanswered questions receive 0 points.
                </span>
              </div>
            )}

            <p className="text-xs text-slate-600 mb-6">
              Are you sure you want to end this testing session? Once submitted, your answers will be locked and your final score will be calculated immediately.
            </p>

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
                  handleSubmitExam();
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

      {/* =========================================================================
          5. ZOOM LIGHTBOX MODAL FOR QUESTION DIAGRAMS
          ========================================================================= */}
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
              alt="Enlarged Diagram"
              className="max-h-[80vh] w-auto mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
