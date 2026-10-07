import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Database, 
  FileSpreadsheet, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  RotateCcw, 
  Unlock, 
  Lock, 
  CheckCircle, 
  KeyRound, 
  Save, 
  Search, 
  X,
  GraduationCap,
  Sparkles,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Camera,
  Layers,
  Calendar,
  CheckSquare,
  Image as ImageIcon
} from 'lucide-react';
import { 
  StudentUser, 
  MockExamSchedule, 
  Question, 
  JAMBMockSubmission, 
  LearningMaterial, 
  Assignment,
  OptionKey 
} from '../../types';
import { ALL_JAMB_SUBJECTS } from '../../data/jambData';
import { formatSeconds } from '../../utils/formatters';

interface JAMBAdminDashboardProps {
  mockSchedule: MockExamSchedule;
  onUpdateMockSchedule: (schedule: MockExamSchedule) => void;
  monthlyExams?: MockExamSchedule[];
  onAddMonthlyExam?: (exam: MockExamSchedule) => void;
  onSelectActiveExam?: (exam: MockExamSchedule) => void;
  students: StudentUser[];
  onAddStudent: (student: StudentUser) => void;
  onUpdateStudent: (student: StudentUser) => void;
  onDeleteStudent: (id: string) => void;
  onAuthorizeStudent?: (studentId: string, authorized: boolean) => void;
  onAuthorizeAllStudents?: () => void;
  questions: Question[];
  onSaveQuestions: (questions: Question[]) => void;
  mockSubmissions: JAMBMockSubmission[];
  materials: LearningMaterial[];
  onAddMaterial: (mat: LearningMaterial) => void;
  onDeleteMaterial: (id: string) => void;
  assignments?: Assignment[];
  onGradeAssignment?: (assignmentId: string, studentId: string, score: number, feedback: string) => void;
  onSwitchToStudentView: () => void;
}

export const JAMBAdminDashboard: React.FC<JAMBAdminDashboardProps> = ({
  mockSchedule,
  onUpdateMockSchedule,
  monthlyExams = [],
  onAddMonthlyExam,
  onSelectActiveExam,
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAuthorizeStudent,
  onAuthorizeAllStudents,
  questions,
  onSaveQuestions,
  mockSubmissions,
  materials,
  onAddMaterial,
  onDeleteMaterial,
  assignments = [],
  onGradeAssignment,
  onSwitchToStudentView,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'accreditation' | 'students' | 'questions' | 'submissions' | 'materials' | 'assignments'>('schedule');

  // Schedule form state
  const [scheduleTitle, setScheduleTitle] = useState(mockSchedule.title);
  const [scheduleMonth, setScheduleMonth] = useState(mockSchedule.monthName || 'October 2026');
  const [scheduleDuration, setScheduleDuration] = useState(mockSchedule.durationMinutes);
  const [scheduleDate, setScheduleDate] = useState(mockSchedule.scheduledDate);
  const [scheduleInstructions, setScheduleInstructions] = useState(mockSchedule.instructions);
  const [scheduleSavedToast, setScheduleSavedToast] = useState(false);

  // New monthly exam modal state
  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamMonth, setNewExamMonth] = useState('November 2026');
  const [newExamDuration, setNewExamDuration] = useState(120);
  const [newExamDate, setNewExamDate] = useState('2026-11-14 09:00 AM');

  // Student enrollment modal state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
  const [newStdName, setNewStdName] = useState('');
  const [newStdRegNo, setNewStdRegNo] = useState('');
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdTrack, setNewStdTrack] = useState('Engineering & Technology');
  const [newStdSubjects, setNewStdSubjects] = useState<string[]>(['Use of English', 'Mathematics', 'Physics', 'Chemistry']);
  const [newStdPass, setNewStdPass] = useState('Aristotle@2026');
  const [newStdSeat, setNewStdSeat] = useState('Seat LAB-01');
  const [newStdAvatar, setNewStdAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // Question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('Use of English');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState('All');
  const [qSubject, setQSubject] = useState('Use of English');
  const [qTopic, setQTopic] = useState('');
  const [qBatch, setQBatch] = useState('Series A (2026 Core)');
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState<OptionKey>('A');
  const [qExplanation, setQExplanation] = useState('');

  // Material modal state
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState('Use of English');
  const [matType, setMatType] = useState<'pdf' | 'video' | 'novel_summary' | 'formula_sheet'>('pdf');
  const [matPages, setMatPages] = useState('20 Pages PDF');
  const [matDesc, setMatDesc] = useState('');

  // Toggle Mock Exam Availability between 'active' and 'closed' / 'scheduled'
  const handleToggleMockStatus = (newStatus: 'active' | 'scheduled' | 'closed') => {
    const updated: MockExamSchedule = {
      ...mockSchedule,
      status: newStatus,
      title: scheduleTitle,
      monthName: scheduleMonth,
      durationMinutes: scheduleDuration,
      scheduledDate: scheduleDate,
      instructions: scheduleInstructions,
    };
    onUpdateMockSchedule(updated);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MockExamSchedule = {
      ...mockSchedule,
      title: scheduleTitle,
      monthName: scheduleMonth,
      durationMinutes: scheduleDuration,
      scheduledDate: scheduleDate,
      instructions: scheduleInstructions,
    };
    onUpdateMockSchedule(updated);
    setScheduleSavedToast(true);
    setTimeout(() => setScheduleSavedToast(false), 3000);
  };

  const handleCreateNewMonthlyExam = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MockExamSchedule = {
      id: `mock-exam-${Date.now()}`,
      title: newExamTitle.trim() || `${newExamMonth} Statewide UTME Mock Exam`,
      monthName: newExamMonth,
      status: 'scheduled',
      durationMinutes: newExamDuration,
      questionsPerSubject: 10,
      passingScoreOutOf400: 200,
      scheduledDate: newExamDate,
      instructions: 'You are allocated 4 subjects. Total duration: 120 minutes. Requires invigilator seat authorization.',
      targetBatch: `${newExamMonth} Aspirants`,
      dateCreated: new Date().toLocaleDateString(),
    };
    if (onAddMonthlyExam) {
      onAddMonthlyExam(created);
    }
    setIsNewExamModalOpen(false);
    alert(`Successfully created new named exam for ${newExamMonth}!`);
  };

  // Student Subject Allocation selection handler (ensures exactly 4 subjects)
  const handleToggleSubjectSelection = (subj: string) => {
    if (subj === 'Use of English') return; // Compulsory in JAMB
    if (newStdSubjects.includes(subj)) {
      setNewStdSubjects(newStdSubjects.filter(s => s !== subj));
    } else {
      if (newStdSubjects.length >= 4) {
        alert('JAMB candidates write exactly 4 subjects. Please uncheck one subject first.');
        return;
      }
      setNewStdSubjects([...newStdSubjects, subj]);
    }
  };

  // Passport Image File Upload Handler
  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewStdAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenStudentModal = (std?: StudentUser) => {
    if (std) {
      setEditingStudent(std);
      setNewStdName(std.fullName);
      setNewStdRegNo(std.jambRegNo);
      setNewStdEmail(std.email);
      setNewStdTrack(std.facultyTrack);
      setNewStdSubjects(std.allocatedSubjects);
      setNewStdPass(std.password);
      setNewStdSeat(std.seatNumber || `Seat LAB-0${students.length}`);
      setNewStdAvatar(std.avatarUrl);
    } else {
      setEditingStudent(null);
      setNewStdName('');
      setNewStdRegNo(`JAMB2026/0${students.length + 10}`);
      setNewStdEmail('');
      setNewStdTrack('Medical Sciences');
      setNewStdSubjects(['Use of English', 'Biology', 'Chemistry', 'Physics']);
      setNewStdPass('Aristotle@2026');
      setNewStdSeat(`Seat LAB-0${students.length + 1}`);
      setNewStdAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');
    }
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStdSubjects.length !== 4) {
      alert('A candidate MUST be allocated exactly 4 subjects for JAMB UTME.');
      return;
    }

    if (editingStudent) {
      const updated: StudentUser = {
        ...editingStudent,
        fullName: newStdName.trim(),
        jambRegNo: newStdRegNo.trim(),
        email: newStdEmail.trim(),
        facultyTrack: newStdTrack,
        allocatedSubjects: newStdSubjects,
        password: newStdPass,
        seatNumber: newStdSeat.trim(),
        avatarUrl: newStdAvatar,
      };
      onUpdateStudent(updated);
    } else {
      const created: StudentUser = {
        id: `std-${Date.now()}`,
        fullName: newStdName.trim(),
        jambRegNo: newStdRegNo.trim(),
        email: newStdEmail.trim() || `${newStdRegNo.toLowerCase().replace('/', '')}@student.aristotle.edu`,
        password: newStdPass,
        isDefaultPassword: true, // Will force change password on login!
        avatarUrl: newStdAvatar,
        facultyTrack: newStdTrack,
        allocatedSubjects: newStdSubjects,
        seatNumber: newStdSeat.trim(),
        isAuthorizedForExam: false, // Must be authorized before starting!
        dateCreated: new Date().toLocaleDateString(),
      };
      onAddStudent(created);
    }

    setIsStudentModalOpen(false);
  };

  // Add Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Question = {
      id: `q-jamb-${Date.now()}`,
      subject: qSubject,
      subtopic: qTopic || 'General Core Topic',
      batchOrYear: qBatch || 'Series A (2026 Core)',
      difficulty: 'Medium',
      text: qText.trim(),
      options: {
        A: qOptA.trim(),
        B: qOptB.trim(),
        C: qOptC.trim(),
        D: qOptD.trim(),
      },
      correctOption: qCorrect,
      explanation: qExplanation.trim(),
    };
    onSaveQuestions([newQ, ...questions]);
    setIsQuestionModalOpen(false);
  };

  // Add Material
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newMat: LearningMaterial = {
      id: `mat-${Date.now()}`,
      title: matTitle.trim(),
      subject: matSubject,
      type: matType,
      url: '#',
      durationOrPages: matPages,
      description: matDesc.trim(),
      dateAdded: new Date().toLocaleDateString(),
    };
    onAddMaterial(newMat);
    setIsMaterialModalOpen(false);
  };

  // Filtered Questions by Subject and Segment
  const subjectQuestions = questions.filter(q => q.subject === selectedSubjectFilter);
  const distinctSegments = Array.from(new Set(subjectQuestions.map(q => q.batchOrYear || 'Series A'))).filter(Boolean);
  const filteredQ = subjectQuestions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(questionSearch.toLowerCase()) || 
                          (q.subtopic && q.subtopic.toLowerCase().includes(questionSearch.toLowerCase()));
    const matchesSegment = selectedSegmentFilter === 'All' || (q.batchOrYear || 'Series A') === selectedSegmentFilter;
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200 mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Official JAMB UTME 24-Subject CBT Engine & Center Invigilation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Aristotle Academy Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Authorize candidate terminal seats, create monthly exams, manage 24-subject question banks, and enroll students with passport upload.
          </p>
        </div>

        <button
          onClick={onSwitchToStudentView}
          className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md transition self-start md:self-auto cursor-pointer"
        >
          View as Student Portal
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'schedule', label: 'CBT Availability & Monthly Exams', icon: Calendar },
          { id: 'accreditation', label: `Candidate Seat Authorization (${students.filter(s => s.isAuthorizedForExam).length}/${students.length})`, icon: ShieldCheck },
          { id: 'students', label: `Enrolled Students & 4 Subjects (${students.length})`, icon: Users },
          { id: 'questions', label: `24 Subjects Question Bank (${questions.length})`, icon: Database },
          { id: 'submissions', label: `Mock Exam Score Ledger (${mockSubmissions.length})`, icon: FileSpreadsheet },
          { id: 'materials', label: `Study Materials & PDFs (${materials.length})`, icon: BookOpen },
          { id: 'assignments', label: `Student Homework (${assignments.length})`, icon: FileText },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
                isActive
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: CBT MOCK EXAM ACTIVATION & NAMED MONTHLY EXAMS MANAGER
          ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Availability Toggle Hero Card */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-900" />
                  Live Mock Exam Access Switch
                </h2>
                <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                  {scheduleMonth}
                </span>
              </div>

              <div className={`p-6 rounded-2xl border-2 text-center space-y-3 ${
                mockSchedule.status === 'active'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto bg-white shadow-sm">
                  {mockSchedule.status === 'active' ? (
                    <Unlock className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <Lock className="w-8 h-8 text-amber-600" />
                  )}
                </div>

                <h3 className="text-xl font-black">
                  {mockSchedule.status === 'active'
                    ? 'CBT MOCK EXAM IS CURRENTLY ACTIVE & UNLOCKED'
                    : 'CBT MOCK EXAM IS LOCKED / PENDING RELEASE'}
                </h3>

                <p className="text-xs leading-relaxed max-w-md mx-auto">
                  {mockSchedule.status === 'active'
                    ? `Authorized candidates can now enter and answer their 4 allocated subjects. Active session: ${mockSchedule.title}.`
                    : 'Candidates cannot start the CBT until you click Activate below. Before entering, candidates also require individual seat authorization.'}
                </p>

                <div className="pt-2">
                  {mockSchedule.status === 'active' ? (
                    <button
                      onClick={() => handleToggleMockStatus('closed')}
                      className="px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Lock & Close Mock Examination
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleMockStatus('active')}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition cursor-pointer"
                    >
                      Activate Mock Exam for All Students Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Timing & Instructions Config Form */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-900" />
                  Active Exam Parameters
                </h2>
                <button
                  onClick={() => setIsNewExamModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Exam for Month</span>
                </button>
              </div>

              <form onSubmit={handleSaveSchedule} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Exam Month Name
                    </label>
                    <input
                      type="text"
                      required
                      value={scheduleMonth}
                      onChange={e => setScheduleMonth(e.target.value)}
                      placeholder="e.g. October 2026"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Exam Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="240"
                      required
                      value={scheduleDuration}
                      onChange={e => setScheduleDuration(parseInt(e.target.value) || 120)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Examination Title
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleTitle}
                    onChange={e => setScheduleTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Scheduled Recurrence / Date Notice
                  </label>
                  <input
                    type="text"
                    required
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {scheduleSavedToast && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Parameters updated!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm ml-auto cursor-pointer"
                  >
                    Save Active Parameters
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Monthly Named Exams Catalog */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-900" />
                  Monthly Named Examinations Archive & Switching
                </h3>
                <p className="text-xs text-slate-500">
                  Create newly named exams for each month/week with customized duration and assignable subject segments.
                </p>
              </div>
              <button
                onClick={() => setIsNewExamModalOpen(true)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Exam for Month</span>
              </button>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthlyExams.map(ex => {
                  const isCurrentActive = mockSchedule.id === ex.id;
                  return (
                    <div
                      key={ex.id}
                      className={`p-5 rounded-2xl border-2 space-y-3 transition ${
                        isCurrentActive ? 'border-blue-700 bg-blue-50/50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900">
                          {ex.monthName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ex.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ex.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{ex.title}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        Duration: {ex.durationMinutes} mins • Passing: {ex.passingScoreOutOf400}/400
                      </p>
                      {onSelectActiveExam && !isCurrentActive && (
                        <button
                          onClick={() => onSelectActiveExam(ex)}
                          className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                        >
                          Switch & Set as Active Exam
                        </button>
                      )}
                      {isCurrentActive && (
                        <span className="block text-center text-xs font-bold text-blue-900 bg-blue-100/70 py-1.5 rounded-xl">
                          ✓ Currently Active in Candidate Portal
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CANDIDATE SEAT ACCREDITATION & AUTHORIZATION CENTER
          ========================================================================= */}
      {activeTab === 'accreditation' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Invigilator Biometric & Terminal Accreditation
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Pre-Exam Candidate Terminal Authorization
              </h2>
              <p className="text-xs text-slate-500">
                Candidates cannot commence CBT until authorized below by the presiding center administrator.
              </p>
            </div>

            {onAuthorizeAllStudents && (
              <button
                onClick={() => {
                  onAuthorizeAllStudents();
                  alert('All registered candidates have been verified and authorized to start!');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Authorize All Candidate Terminals</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Candidate & Passport</th>
                    <th className="py-3.5 px-4">Terminal Seat No</th>
                    <th className="py-3.5 px-4">Allocated 4 Subjects</th>
                    <th className="py-3.5 px-4">Accreditation Status</th>
                    <th className="py-3.5 px-4 text-right">Invigilator Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {students.map(std => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={std.avatarUrl}
                            alt={std.fullName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{std.fullName}</span>
                            <span className="font-mono text-[11px] text-blue-700 font-bold">{std.jambRegNo}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {std.seatNumber || 'Seat LAB-01'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {std.allocatedSubjects.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 text-[10px] font-bold border border-blue-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {std.isAuthorizedForExam ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Authorized ({std.authorizedAt || 'Verified'})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                            <span>Pending Authorization</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {onAuthorizeStudent && (
                          std.isAuthorizedForExam ? (
                            <button
                              onClick={() => onAuthorizeStudent(std.id, false)}
                              className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs cursor-pointer"
                            >
                              Revoke Authorization
                            </button>
                          ) : (
                            <button
                              onClick={() => onAuthorizeStudent(std.id, true)}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                            >
                              Authorize Candidate Seat
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: REGISTERED STUDENTS & 4-SUBJECT ALLOCATION WITH PASSPORT UPLOAD
          ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Enrolled Students with Uploaded Passports & Allocated 4 Subjects
              </h2>
              <p className="text-xs text-slate-500">
                Each candidate is allocated exactly 4 subjects. First login requires default password change.
              </p>
            </div>

            <button
              onClick={() => handleOpenStudentModal()}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Student with Passport</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Student & Passport</th>
                    <th className="py-3.5 px-4">Terminal Seat No</th>
                    <th className="py-3.5 px-4">Faculty Track</th>
                    <th className="py-3.5 px-4">Allocated 4 Subjects</th>
                    <th className="py-3.5 px-4">Password Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {students.map(std => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={std.avatarUrl}
                            alt={std.fullName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{std.fullName}</span>
                            <span className="font-mono text-[11px] text-blue-700 font-bold">{std.jambRegNo}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {std.seatNumber || 'Seat LAB-01'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {std.facultyTrack}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {std.allocatedSubjects.map((s, i) => (
                            <span key={s} className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 text-[10px] font-bold border border-blue-200">
                              {i + 1}. {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {std.isDefaultPassword ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                            Default (Requires Change)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                            Changed & Secure
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenStudentModal(std)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Edit Student & Passport"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove student ${std.fullName}?`)) {
                                onDeleteStudent(std.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: 24 SUBJECTS SEPARATED QUESTION BANK WITH SEGMENTS
          ========================================================================= */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Separated Question Bank for all 24 JAMB Subjects
                </h2>
                <p className="text-xs text-slate-500">
                  Select any subject below to view or add segmented question series.
                </p>
              </div>

              <button
                onClick={() => {
                  setQSubject(selectedSubjectFilter);
                  setIsQuestionModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question to {selectedSubjectFilter}</span>
              </button>
            </div>

            {/* 24 Official JAMB Subject Tabs Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 border-t pt-3">
              {ALL_JAMB_SUBJECTS.map(subj => {
                const count = questions.filter(q => q.subject === subj).length;
                const isSelected = selectedSubjectFilter === subj;

                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubjectFilter(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{subj}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-blue-800 text-blue-200' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Subject Segments Filter & Assignment Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Segments in {selectedSubjectFilter}:
                </span>
                <button
                  onClick={() => setSelectedSegmentFilter('All')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    selectedSegmentFilter === 'All'
                      ? 'bg-blue-900 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Segments ({subjectQuestions.length})
                </button>
                {distinctSegments.map(seg => {
                  const segCount = subjectQuestions.filter(q => (q.batchOrYear || 'Series A') === seg).length;
                  const isSelected = selectedSegmentFilter === seg;
                  return (
                    <button
                      key={seg}
                      onClick={() => setSelectedSegmentFilter(seg)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition ${
                        isSelected
                          ? 'bg-blue-900 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{seg}</span>
                      <span className="text-[10px] opacity-80 font-mono">({segCount})</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const segToAssign = selectedSegmentFilter === 'All' ? (distinctSegments[0] || 'Series A (2026 Core)') : selectedSegmentFilter;
                    const count = subjectQuestions.filter(q => (q.batchOrYear || 'Series A') === segToAssign).length;
                    alert(`Successfully attached and assigned question segment "${segToAssign}" (${count} questions) from ${selectedSubjectFilter} to monthly exam "${mockSchedule.title}"!`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Assign questions in this segment to the active monthly mock exam"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Assign Segment to {mockSchedule.monthName || 'Active Exam'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                {selectedSubjectFilter} ({filteredQ.length} Segmented Questions)
              </span>
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={questionSearch}
                  onChange={e => setQuestionSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Segment / Batch</th>
                    <th className="py-3 px-4">Topic</th>
                    <th className="py-3 px-4">Question Text</th>
                    <th className="py-3 px-4 text-center">Correct Option</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredQ.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No questions in {selectedSubjectFilter} yet. Click "Add Question" above.
                      </td>
                    </tr>
                  ) : (
                    filteredQ.map(q => (
                      <tr key={q.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 text-[10px] font-bold border border-blue-200 font-mono">
                            {q.batchOrYear || 'Series A'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-semibold">{q.subtopic}</td>
                        <td className="py-3 px-4 max-w-md line-clamp-2 text-slate-800">{q.text}</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-700">{q.correctOption}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: MOCK EXAM SCORE LEDGER
          ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                JAMB UTME Mock Submissions Audit Record
              </h2>
              <p className="text-xs text-slate-500">
                Graded out of 400 total marks across each candidate's 4 allocated subjects.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Subject Scores</th>
                    <th className="py-3.5 px-4 text-center">Score / 400</th>
                    <th className="py-3.5 px-4">Time Spent</th>
                    <th className="py-3.5 px-4">Violations</th>
                    <th className="py-3.5 px-4">Date Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mockSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No mock test attempts recorded yet.
                      </td>
                    </tr>
                  ) : (
                    mockSubmissions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{sub.candidateName}</span>
                          <span className="font-mono text-[11px] text-slate-500">{sub.jambRegNo}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {sub.subjectBreakdowns.map(sb => (
                              <span key={sb.subject} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono border">
                                {sb.subject.slice(0, 4)}: <strong>{sb.scoreOutOf100}</strong>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-sm text-blue-900">
                          {sub.totalScoreOutOf400} / 400
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {formatSeconds(sub.timeSpentSeconds)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            sub.cheatViolations === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.cheatViolations} Flags
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {sub.dateFormatted}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: STUDY MATERIALS & PDF NOTES
          ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Study Materials & PDFs</h2>
              <p className="text-xs text-slate-500">Add lecture handouts, novel summaries, and formula sheets.</p>
            </div>
            <button
              onClick={() => setIsMaterialModalOpen(true)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Material</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {materials.map(mat => (
              <div key={mat.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                    {mat.subject}
                  </span>
                  <span className="text-[10px] text-slate-500">{mat.durationOrPages}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{mat.title}</h4>
                <p className="text-xs text-slate-600">{mat.description}</p>
                <div className="pt-2 border-t flex justify-end">
                  <button
                    onClick={() => onDeleteMaterial(mat.id)}
                    className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: STUDENT HOMEWORK & ASSIGNMENTS GRADING
          ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Homework & Tutor Grading</h2>
              <p className="text-xs text-slate-500">Review candidate assignments, record marks, and provide pedagogical feedback.</p>
            </div>
          </div>

          <div className="space-y-6">
            {assignments.map(asg => {
              const submissionKeys = Object.keys(asg.submissions);
              return (
                <div key={asg.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900">
                        {asg.subject}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1">{asg.title}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      Submissions: <strong>{submissionKeys.length}</strong> / {students.length}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{asg.description}</p>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Student Responses:</h4>
                    {submissionKeys.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No submissions received yet for this task.</p>
                    ) : (
                      submissionKeys.map(stdId => {
                        const sub = asg.submissions[stdId];
                        const stdObj = students.find(s => s.id === stdId);
                        const stdName = stdObj ? stdObj.fullName : stdId;

                        return (
                          <div key={stdId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                {stdName} ({stdObj?.jambRegNo})
                              </span>
                              <span className="text-[11px] text-slate-500">Submitted: {sub.submittedAt}</span>
                            </div>

                            <p className="text-slate-800 bg-white p-3 rounded-xl border border-slate-100 italic">
                              "{sub.submissionText}"
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              {sub.score !== undefined ? (
                                <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                                  Grade: {sub.score} / {asg.totalMarks} • Feedback: "{sub.feedback}"
                                </span>
                              ) : (
                                <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                                  Ungraded
                                </span>
                              )}

                              <button
                                onClick={() => {
                                  const markStr = prompt(`Enter score out of ${asg.totalMarks}:`, sub.score !== undefined ? String(sub.score) : '18');
                                  if (markStr === null) return;
                                  const mark = parseInt(markStr) || 0;
                                  const feedback = prompt('Enter tutor feedback comment:', sub.feedback || 'Well analyzed. Excellent application of principles.') || '';
                                  if (onGradeAssignment) {
                                    onGradeAssignment(asg.id, stdId, mark, feedback);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold cursor-pointer"
                              >
                                {sub.score !== undefined ? 'Update Grade & Feedback' : 'Grade Assignment'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ENROLL / EDIT STUDENT WITH PASSPORT UPLOAD & SEAT
          ========================================================================= */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Edit Student Account & Passport' : 'Enroll New Student with Passport Photo'}
              </h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              {/* PASSPORT PHOTOGRAPH UPLOAD */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                <div className="relative">
                  <img
                    src={newStdAvatar}
                    alt="Passport Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-900 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-900 text-white p-1 rounded-full">
                    <Camera className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Upload Candidate Passport Photograph
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePassportUpload}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-900 hover:file:bg-blue-200 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Supported: JPG, PNG (automatically stored with candidate profile)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStdName}
                    onChange={e => setNewStdName(e.target.value)}
                    placeholder="e.g. Ibrahim Musa"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">JAMB Registration Number</label>
                  <input
                    type="text"
                    required
                    value={newStdRegNo}
                    onChange={e => setNewStdRegNo(e.target.value)}
                    placeholder="e.g. JAMB2026/0491"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Terminal Seat No</label>
                  <input
                    type="text"
                    required
                    value={newStdSeat}
                    onChange={e => setNewStdSeat(e.target.value)}
                    placeholder="e.g. Seat LAB-05"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Track / Target Course</label>
                  <select
                    value={newStdTrack}
                    onChange={e => setNewStdTrack(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  >
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Medical Sciences (Medicine & Surgery)">Medical Sciences (Medicine & Surgery)</option>
                    <option value="Faculty of Law">Faculty of Law</option>
                    <option value="Social & Management Sciences">Social & Management Sciences</option>
                    <option value="Agricultural Sciences">Agricultural Sciences</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                  </select>
                </div>
              </div>

              {/* ALLOCATE 4 SUBJECTS SELECTOR */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Allocate Exactly 4 JAMB Subjects:
                  </label>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    newStdSubjects.length === 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {newStdSubjects.length} of 4 Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs max-h-48 overflow-y-auto pr-1">
                  {ALL_JAMB_SUBJECTS.map(subj => {
                    const isChecked = newStdSubjects.includes(subj);
                    const isEnglish = subj === 'Use of English';

                    return (
                      <label
                        key={subj}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                          isChecked
                            ? 'bg-blue-900 text-white font-bold border-blue-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isEnglish}
                          onChange={() => handleToggleSubjectSelection(subj)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate">{subj}</span>
                        {isEnglish && <span className="text-[9px] opacity-80">(Compulsory)</span>}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Login Password (Student prompted to change on first login)
                </label>
                <input
                  type="text"
                  required
                  value={newStdPass}
                  onChange={e => setNewStdPass(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Student Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW NAMED MONTHLY EXAM */}
      {isNewExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b">
              <h3 className="font-bold text-slate-900 text-sm">Create New Named Exam for Month</h3>
              <button onClick={() => setIsNewExamModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateNewMonthlyExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Exam Month (e.g. November 2026)</label>
                <input
                  required
                  value={newExamMonth}
                  onChange={e => setNewExamMonth(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Full Exam Title</label>
                <input
                  required
                  value={newExamTitle}
                  onChange={e => setNewExamTitle(e.target.value)}
                  placeholder="e.g. November National UTME Mock 2026"
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="30"
                    max="180"
                    required
                    value={newExamDuration}
                    onChange={e => setNewExamDuration(parseInt(e.target.value) || 120)}
                    className="w-full p-2 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Scheduled Date</label>
                  <input
                    required
                    value={newExamDate}
                    onChange={e => setNewExamDate(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewExamModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-900 text-white font-bold rounded-xl">Create Named Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD QUESTION TO SEGMENT */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b">
              <h3 className="font-bold text-slate-900">Add Question to Segmented Bank</h3>
              <button onClick={() => setIsQuestionModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1">JAMB Subject</label>
                  <select
                    value={qSubject}
                    onChange={e => setQSubject(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  >
                    {ALL_JAMB_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Segment / Batch Tag</label>
                  <input
                    type="text"
                    required
                    value={qBatch}
                    onChange={e => setQBatch(e.target.value)}
                    placeholder="e.g. Series A (2026 Core)"
                    className="w-full p-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Subtopic</label>
                  <input
                    type="text"
                    required
                    value={qTopic}
                    onChange={e => setQTopic(e.target.value)}
                    placeholder="e.g. Concord, Logic"
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Question Statement</label>
                <textarea
                  rows={3}
                  required
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Option A" required value={qOptA} onChange={e => setQOptA(e.target.value)} className="p-2 border rounded-xl" />
                <input placeholder="Option B" required value={qOptB} onChange={e => setQOptB(e.target.value)} className="p-2 border rounded-xl" />
                <input placeholder="Option C" required value={qOptC} onChange={e => setQOptC(e.target.value)} className="p-2 border rounded-xl" />
                <input placeholder="Option D" required value={qOptD} onChange={e => setQOptD(e.target.value)} className="p-2 border rounded-xl" />
              </div>

              <div>
                <label className="block font-bold mb-1">Correct Option Key</label>
                <div className="flex gap-2">
                  {(['A', 'B', 'C', 'D'] as OptionKey[]).map(k => (
                    <button
                      type="button"
                      key={k}
                      onClick={() => setQCorrect(k)}
                      className={`flex-1 py-1.5 rounded-lg border font-bold ${
                        qCorrect === k ? 'bg-emerald-600 text-white' : 'bg-slate-50'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Faculty Solution & Explanation</label>
                <textarea
                  rows={2}
                  value={qExplanation}
                  onChange={e => setQExplanation(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-900 text-white font-bold rounded-xl">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MATERIAL */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b">
              <h3 className="font-bold text-slate-900 text-sm">Add Learning Material</h3>
              <button onClick={() => setIsMaterialModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Document / Material Title</label>
                <input required value={matTitle} onChange={e => setMatTitle(e.target.value)} className="w-full p-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Subject</label>
                  <select value={matSubject} onChange={e => setMatSubject(e.target.value)} className="w-full p-2 border rounded-xl">
                    {ALL_JAMB_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Pages / Duration</label>
                  <input value={matPages} onChange={e => setMatPages(e.target.value)} className="w-full p-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Brief Description</label>
                <textarea rows={2} value={matDesc} onChange={e => setMatDesc(e.target.value)} className="w-full p-2 border rounded-xl" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsMaterialModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-900 text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW MONTHLY EXAM */}
      {isNewExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-900" />
                <h3 className="font-bold text-slate-900 text-base">Create Newly Named Mock Exam</h3>
              </div>
              <button 
                onClick={() => setIsNewExamModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewMonthlyExam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Exam Title Named by Admin</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. March 2026 Statewide Pre-UTME Mock"
                  value={newExamTitle}
                  onChange={e => setNewExamTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Target Month / Series Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. March 2026"
                    value={newExamMonth}
                    onChange={e => setNewExamMonth(e.target.value)}
                    className="w-full p-2.5 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Total Allotted Duration (Minutes)</label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    required
                    value={newExamDuration}
                    onChange={e => setNewExamDuration(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Scheduled Date / Instructions</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-03-21 (Saturday 09:00 AM)"
                  value={newExamDate}
                  onChange={e => setNewExamDate(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-slate-700 text-[11px] leading-relaxed">
                <span className="font-bold text-blue-950 block mb-0.5">Official JAMB 4-Subject Format:</span>
                Each student will only answer questions from their 4 allocated subjects ({ALL_JAMB_SUBJECTS.slice(0, 4).join(', ')}, etc.). Subject question segments can be assigned to this exam from the Question Bank tab.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewExamModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl cursor-pointer shadow-sm transition active:scale-95"
                >
                  Create & Save Monthly Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
