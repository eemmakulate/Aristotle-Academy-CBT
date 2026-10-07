import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Download, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck,
  Lock, 
  Unlock, 
  ChevronRight,
  TrendingUp,
  BookmarkCheck,
  User,
  GraduationCap,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { 
  StudentUser, 
  MockExamSchedule, 
  LearningMaterial, 
  Assignment, 
  QuizResult, 
  JAMBMockSubmission, 
  Question 
} from '../../types';
import { QuizModal } from './QuizModal';
import { MaterialReaderModal } from './MaterialReaderModal';

interface StudentPortalDashboardProps {
  student: StudentUser;
  mockSchedule: MockExamSchedule;
  materials: LearningMaterial[];
  assignments: Assignment[];
  quizResults: QuizResult[];
  mockSubmissions: JAMBMockSubmission[];
  allQuestions: Question[];
  onStartJAMBMockExam: () => void;
  onSubmitAssignment: (assignmentId: string, text: string) => void;
  onRefreshData: () => void;
  onAuthorizeStudent?: (studentId: string, authorized: boolean) => void;
  onViewScorecard?: (submission: JAMBMockSubmission) => void;
}

export const StudentPortalDashboard: React.FC<StudentPortalDashboardProps> = ({
  student,
  mockSchedule,
  materials,
  assignments,
  quizResults,
  mockSubmissions,
  allQuestions,
  onStartJAMBMockExam,
  onSubmitAssignment,
  onRefreshData,
  onAuthorizeStudent,
  onViewScorecard,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'videos' | 'assignments' | 'quizzes' | 'history'>('overview');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  // Quiz modal state
  const [activeQuizSubject, setActiveQuizSubject] = useState<string | null>(null);

  // Material reader modal state
  const [readingMaterial, setReadingMaterial] = useState<LearningMaterial | null>(null);

  // Assignment submission text state
  const [assignmentInputs, setAssignmentInputs] = useState<Record<string, string>>({});

  // Filtered materials
  const filteredMaterials = materials.filter(m => {
    const matchesSubject = selectedSubjectFilter === 'All' || m.subject === selectedSubjectFilter;
    const isStudentSubject = student.allocatedSubjects.includes(m.subject) || selectedSubjectFilter !== 'All';
    return matchesSubject && isStudentSubject;
  });

  // Calculate student stats
  const studentMocks = mockSubmissions.filter(s => s.studentId === student.id || s.jambRegNo === student.jambRegNo);
  const studentQuizzes = quizResults.filter(q => q.studentId === student.id);
  const latestMock = studentMocks[0] || null;

  const handleOpenQuiz = (subj: string) => {
    setActiveQuizSubject(subj);
  };

  const handleAssignmentSubmit = (asgId: string) => {
    const text = assignmentInputs[asgId] || '';
    if (!text.trim()) {
      alert('Please enter your assignment response before submitting.');
      return;
    }
    onSubmitAssignment(asgId, text.trim());
    setAssignmentInputs(prev => ({ ...prev, [asgId]: '' }));
    alert('Assignment successfully submitted to instructor for grading!');
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* =========================================================================
          CANDIDATE PROFILE & ALLOCATED 4 SUBJECTS HERO CARD
          ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-blue-400 shadow-md shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
                <span>JAMB UTME 2026 Candidate Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {student.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm text-blue-200">
                <span className="font-mono bg-blue-900/80 px-2.5 py-0.5 rounded border border-blue-700 font-bold text-white">
                  Reg No: {student.jambRegNo}
                </span>
                <span>•</span>
                <span className="font-medium text-slate-300">{student.facultyTrack}</span>
              </div>
            </div>
          </div>

          {/* 4 Allocated Subjects Pills */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 max-w-md w-full lg:w-auto">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block mb-2">
              Your 4 Allocated JAMB Subjects:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {student.allocatedSubjects.map((subj, idx) => (
                <div
                  key={subj}
                  className="bg-blue-950/70 border border-blue-400/30 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 text-white"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-[10px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="truncate">{subj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION SUB-TABS
          ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'Dashboard & Mock CBT', icon: Sparkles },
          { id: 'materials', label: 'Study PDFs & Texts', icon: FileText },
          { id: 'videos', label: 'Video Masterclasses', icon: Video },
          { id: 'assignments', label: 'Assignments & Tasks', icon: BookOpen },
          { id: 'quizzes', label: 'Daily Practice Quizzes', icon: HelpCircle },
          { id: 'history', label: 'Scorecard History', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
                isActive
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & JAMB MOCK CBT ACCESS (ADMIN CONTROLLED)
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* MOCK EXAMINATION STATUS CARD */}
          <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-lg transition ${
            mockSchedule.status === 'active'
              ? 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 border-emerald-500 text-white'
              : 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border-slate-700 text-white'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {mockSchedule.status === 'active' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400">
                      <Unlock className="w-3.5 h-3.5 text-emerald-300" />
                      MOCK EXAM NOW ACTIVE & RELEASED BY ADMIN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400">
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      CBT LOCKED — PENDING ADMIN RELEASE
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black">
                  {mockSchedule.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {mockSchedule.status === 'active'
                    ? `The administrator has activated this mock examination. You will answer questions from your 4 registered subjects (${student.allocatedSubjects.join(', ')}). Total allotted time: ${mockSchedule.durationMinutes} minutes. Scored out of 400.`
                    : `The periodic mock examination is currently locked until released by the administration. Scheduled for: ${mockSchedule.scheduledDate}. Continue practicing with study materials and daily drills below.`}
                </p>
              </div>

              {/* Enter Button or Status */}
              <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
                {mockSchedule.status === 'active' ? (
                  student.isAuthorizedForExam ? (
                    <div>
                      <button
                        onClick={() => {
                          if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                            document.documentElement.requestFullscreen().catch(() => {});
                          }
                          onStartJAMBMockExam();
                        }}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/40 active:scale-95 transition flex items-center justify-center gap-3 cursor-pointer group"
                      >
                        <Maximize2 className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                        <span>Start Examination (Auto Fullscreen)</span>
                      </button>
                      <span className="text-[11px] text-emerald-200/80 block mt-1.5 text-center sm:text-right">
                        4 Allocated Subjects • Standard JAMB UTME Screen
                      </span>
                    </div>
                  ) : (
                    <div className="text-center sm:text-right">
                      <button
                        disabled
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-800 text-slate-400 font-bold text-sm border border-slate-700 opacity-80 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Awaiting Exam Authorization...</span>
                      </button>
                      <span className="text-[11px] text-slate-400 block mt-1.5">
                        Terminal clearance is managed by presiding admin
                      </span>
                    </div>
                  )
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-xs text-amber-300 font-bold block">Next Statewide Mock</span>
                    <span className="text-sm font-mono text-white font-bold">{mockSchedule.scheduledDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Latest Mock Score</span>
                <Award className="w-4 h-4 text-blue-800" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {latestMock ? `${latestMock.totalScoreOutOf400} / 400` : 'Not Taken'}
              </div>
              <div className="text-xs text-emerald-700 mt-1 font-semibold">
                {latestMock ? (latestMock.totalScoreOutOf400 >= 200 ? '✓ University Cutoff Met' : 'Needs Practice') : 'Awaiting First Mock'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Quizzes Completed</span>
                <HelpCircle className="w-4 h-4 text-indigo-700" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {studentQuizzes.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Continuous assessment drills
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Pending Assignments</span>
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {assignments.filter(a => !a.submissions[student.id]).length}
              </div>
              <div className="text-xs text-amber-700 mt-1 font-medium">
                Due this week
              </div>
            </div>
          </div>

          {/* Quick Subject Practice Drills Section */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-900" />
              Instant Daily Quizzes in Your 4 Subjects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {student.allocatedSubjects.map(subj => {
                const count = allQuestions.filter(q => q.subject === subj).length;
                return (
                  <div
                    key={subj}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                        JAMB Drill
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{subj}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{count} High-Yield Questions</p>
                    </div>

                    <button
                      onClick={() => handleOpenQuiz(subj)}
                      className="w-full py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Take Practice Drill</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: STUDY MATERIALS & TEXTS
          ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                High-Yield JAMB Study Materials & Syllabus Notes
              </h2>
              <p className="text-xs text-slate-500">
                Curated summaries, novels, and formula sheets for your subjects.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter:</span>
              <select
                value={selectedSubjectFilter}
                onChange={e => setSelectedSubjectFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="All">All Your Subjects</option>
                {student.allocatedSubjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map(mat => (
              <div
                key={mat.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      {mat.subject}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {mat.durationOrPages}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 truncate">Added: {mat.dateAdded}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setReadingMaterial(mat)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Online</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloading '${mat.title}' offline document archive...`)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                      title="Download PDF Archive"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VIDEO MASTERCLASSES
          ========================================================================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Interactive Video Masterclasses & Walkthroughs
            </h2>
            <p className="text-xs text-slate-500">
              Solved past UTME questions and concept demonstrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materials.filter(m => m.type === 'video').map(video => (
              <div
                key={video.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4"
              >
                {/* Responsive Video Container */}
                <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                  <div className="text-center p-6 text-white space-y-2">
                    <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                    <span className="text-xs font-bold text-blue-300 block">{video.subject} Video Lecture</span>
                    <h4 className="text-sm font-bold text-slate-200 max-w-sm">{video.title}</h4>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {video.subject}
                    </span>
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {video.durationOrPages}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ASSIGNMENTS & HOMEWORK
          ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Weekly Homework & Subject Assignments
            </h2>
            <p className="text-xs text-slate-500">
              Submit your exercises and receive direct grading and feedback from Aristotle Academy tutors.
            </p>
          </div>

          <div className="space-y-5">
            {assignments.map(asg => {
              const submission = asg.submissions[student.id];
              return (
                <div
                  key={asg.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-900 text-white">
                        {asg.subject}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500">Total Marks: <strong>{asg.totalMarks}</strong></span>
                      <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                        Due: {asg.dueDate}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {asg.description}
                  </p>

                  {/* Submission Status */}
                  {submission ? (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Submitted on {submission.submittedAt}
                        </span>
                        {submission.score !== undefined && (
                          <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                            Score: {submission.score} / {asg.totalMarks}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 italic">
                        "{submission.submissionText}"
                      </p>
                      {submission.feedback && (
                        <div className="text-xs text-emerald-900 pt-2 border-t border-emerald-200">
                          <strong>Tutor Feedback:</strong> {submission.feedback}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Your Solution / Response:
                      </label>
                      <textarea
                        rows={3}
                        value={assignmentInputs[asg.id] || ''}
                        onChange={e => setAssignmentInputs({ ...assignmentInputs, [asg.id]: e.target.value })}
                        placeholder="Type your explanation, answers, and working steps here..."
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAssignmentSubmit(asg.id)}
                        className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Assignment for Grading</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: DAILY PRACTICE QUIZZES
          ========================================================================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Rapid UTME Subject Quizzes
            </h2>
            <p className="text-xs text-slate-500">
              Practice 10 high-yield questions at your own pace. All scores are logged to your academic record.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {student.allocatedSubjects.map(subj => {
              const qCount = allQuestions.filter(q => q.subject === subj).length;
              return (
                <div
                  key={subj}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      Allocated Subject
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-2">{subj}</h3>
                    <p className="text-xs text-slate-500 mt-1">{qCount} Available questions</p>
                  </div>

                  <button
                    onClick={() => handleOpenQuiz(subj)}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch 10-Question Drill</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: SCORECARD & PERFORMANCE HISTORY
          ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Continuous Assessment & Mock Examination Score Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Complete history of statewide mock test results (scored out of 400) and practice drills.
            </p>
          </div>

          {/* Statewide Mock Exam History Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-sm flex items-center justify-between">
              <span>JAMB UTME Mock Examinations History</span>
              <span className="text-xs text-slate-500 font-normal">Graded out of 400 Marks</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Mock Examination Title</th>
                    <th className="py-3 px-4">Date Taken</th>
                    <th className="py-3 px-4">Subject Scores Breakdown</th>
                    <th className="py-3 px-4 text-center">JAMB Aggregate</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentMocks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No statewide mock examination attempts recorded yet.
                      </td>
                    </tr>
                  ) : (
                    studentMocks.map(mock => (
                      <tr key={mock.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {mock.mockTitle}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {mock.dateFormatted}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {mock.subjectBreakdowns.map(sb => (
                              <span key={sb.subject} className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium border border-slate-200">
                                {sb.subject}: <strong>{sb.scoreOutOf100}/100</strong>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-sm text-blue-900">
                          {mock.totalScoreOutOf400} / 400
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            mock.totalScoreOutOf400 >= 200
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {mock.totalScoreOutOf400 >= 200 ? 'QUALIFIED (>200)' : 'BELOW CUTOFF'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rapid Practice Quiz Logs */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-sm">
              Practice Quizzes Log
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Quiz Title</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Date Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentQuizzes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No practice quizzes taken yet.
                      </td>
                    </tr>
                  ) : (
                    studentQuizzes.map(qz => (
                      <tr key={qz.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-800">{qz.quizTitle}</td>
                        <td className="py-3 px-4 text-slate-600">{qz.subject}</td>
                        <td className="py-3 px-4 font-bold">{qz.score} / {qz.totalQuestions}</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">{qz.percentage}%</td>
                        <td className="py-3 px-4 text-slate-500">{qz.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ RUNNER MODAL */}
      {activeQuizSubject && (
        <QuizModal
          student={student}
          subject={activeQuizSubject}
          questions={allQuestions.filter(q => q.subject === activeQuizSubject).slice(0, 10)}
          onClose={() => setActiveQuizSubject(null)}
          onQuizCompleted={() => onRefreshData()}
        />
      )}

      {/* DOCUMENT & STUDY MATERIAL IN-PORTAL READER */}
      {readingMaterial && (
        <MaterialReaderModal
          material={readingMaterial}
          onClose={() => setReadingMaterial(null)}
        />
      )}
    </div>
  );
};
