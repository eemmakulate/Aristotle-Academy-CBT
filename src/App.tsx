/**
 * Aristotle Academy CBT & Student Portal
 * Designed specifically for JAMB UTME Examinations & Continuous Assessment
 */

import React, { useState, useEffect } from 'react';
import { 
  StudentUser, 
  MockExamSchedule, 
  LearningMaterial, 
  Assignment, 
  QuizResult, 
  JAMBMockSubmission, 
  Question 
} from './types';
import { JAMBStorageService } from './utils/storage';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/Auth/LoginModal';
import { ChangePasswordModal } from './components/Auth/ChangePasswordModal';
import { StudentPortalDashboard } from './components/StudentPortal/StudentPortalDashboard';
import { JAMBActiveExam } from './components/StudentPortal/JAMBActiveExam';
import { JAMBScorecard } from './components/StudentPortal/JAMBScorecard';
import { JAMBAdminDashboard } from './components/AdminPortal/JAMBAdminDashboard';

type ViewMode = 'student-portal' | 'student-exam' | 'student-scorecard' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('student-portal');
  const [currentUser, setCurrentUser] = useState<StudentUser | 'admin' | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Core Data
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [mockSchedule, setMockSchedule] = useState<MockExamSchedule>(JAMBStorageService.getMockSchedule());
  const [monthlyExams, setMonthlyExams] = useState<MockExamSchedule[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [mockSubmissions, setMockSubmissions] = useState<JAMBMockSubmission[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Active finished mock submission
  const [latestMockSubmission, setLatestMockSubmission] = useState<JAMBMockSubmission | null>(null);

  // Initialize data on mount
  useEffect(() => {
    refreshAllData();
    const storedUser = JAMBStorageService.getCurrentUser();
    setCurrentUser(storedUser);
  }, []);

  const refreshAllData = () => {
    setStudents(JAMBStorageService.getStudents());
    setMockSchedule(JAMBStorageService.getMockSchedule());
    setMonthlyExams(JAMBStorageService.getMonthlyExams());
    setMaterials(JAMBStorageService.getMaterials());
    setAssignments(JAMBStorageService.getAssignments());
    setQuizResults(JAMBStorageService.getQuizResults());
    setMockSubmissions(JAMBStorageService.getMockSubmissions());
    setQuestions(JAMBStorageService.getQuestions());
  };

  // Auth Handlers
  const handleLoginSuccess = (user: StudentUser | 'admin') => {
    setCurrentUser(user);
    if (user === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('student-portal');
    }
    refreshAllData();
  };

  const handlePasswordChanged = (updatedStudent: StudentUser) => {
    setCurrentUser(updatedStudent);
    refreshAllData();
  };

  // Mock Exam Trigger (Student Portal)
  const handleStartMockExam = () => {
    if (!currentUser || currentUser === 'admin') {
      alert('Please log in with a student account to take the mock exam.');
      setIsLoginModalOpen(true);
      return;
    }

    if (mockSchedule.status !== 'active') {
      alert('This mock examination is currently locked. It will become accessible once activated by the administrator.');
      return;
    }

    const currentStudent = currentUser as StudentUser;
    if (!currentStudent.isAuthorizedForExam) {
      alert('Candidate terminal not authorized! Please notify the presiding administrator or invigilator to authorize your seat.');
      return;
    }

    // Enforce automatic browser fullscreen mode upon launch
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    setCurrentView('student-exam');
  };

  // Build subject questions map for the active student's 4 allocated subjects
  const getSubjectQuestionsForStudent = (student: StudentUser) => {
    const map: Record<string, Question[]> = {};
    student.allocatedSubjects.forEach(subj => {
      // Pick up to 10 questions per subject for mock simulation
      const matching = questions.filter(q => q.subject === subj);
      map[subj] = matching.length > 0 ? matching.slice(0, 10) : [];
    });
    return map;
  };

  // Submission handler
  const handleCompleteMock = (submission: JAMBMockSubmission) => {
    JAMBStorageService.saveMockSubmission(submission);
    setMockSubmissions(JAMBStorageService.getMockSubmissions());
    setLatestMockSubmission(submission);
    setCurrentView('student-scorecard');
  };

  // Assignment Submit Handler
  const handleSubmitAssignment = (asgId: string, text: string) => {
    if (currentUser && currentUser !== 'admin') {
      JAMBStorageService.submitAssignment(asgId, currentUser.id, text);
      setAssignments(JAMBStorageService.getAssignments());
    }
  };

  // Admin Handlers
  const handleUpdateSchedule = (updated: MockExamSchedule) => {
    JAMBStorageService.saveMockSchedule(updated);
    setMockSchedule(updated);
  };

  const handleAddMonthlyExam = (exam: MockExamSchedule) => {
    JAMBStorageService.addMonthlyExam(exam);
    refreshAllData();
  };

  const handleSelectActiveExam = (exam: MockExamSchedule) => {
    const activated: MockExamSchedule = {
      ...exam,
      status: 'active',
    };
    JAMBStorageService.saveMockSchedule(activated);
    setMockSchedule(activated);
    const updatedList = monthlyExams.map(e => ({
      ...e,
      status: e.id === exam.id ? ('active' as const) : ('scheduled' as const),
    }));
    JAMBStorageService.saveMonthlyExams(updatedList);
    refreshAllData();
  };

  const handleAuthorizeStudent = (studentId: string, authorized: boolean) => {
    JAMBStorageService.authorizeStudent(studentId, authorized);
    refreshAllData();
    const storedUser = JAMBStorageService.getCurrentUser();
    if (storedUser && currentUser && currentUser !== 'admin' && (currentUser as StudentUser).id === studentId) {
      setCurrentUser(storedUser);
    }
  };

  const handleAuthorizeAllStudents = () => {
    JAMBStorageService.authorizeAllStudents();
    refreshAllData();
    const storedUser = JAMBStorageService.getCurrentUser();
    if (storedUser && currentUser && currentUser !== 'admin') {
      setCurrentUser(storedUser);
    }
  };

  const handleReleaseSubmissionResult = (submissionId: string, released: boolean) => {
    const updated = JAMBStorageService.releaseSubmissionResult(submissionId, released);
    setMockSubmissions(updated);
    if (latestMockSubmission && latestMockSubmission.id === submissionId) {
      setLatestMockSubmission({ ...latestMockSubmission, isResultReleased: released });
    }
  };

  const handleReleaseAllResults = (released: boolean) => {
    const updated = JAMBStorageService.releaseAllSubmissionResults(released);
    setMockSubmissions(updated);
    if (latestMockSubmission) {
      setLatestMockSubmission({ ...latestMockSubmission, isResultReleased: released });
    }
  };

  const handleViewScorecard = (submission: JAMBMockSubmission) => {
    setLatestMockSubmission(submission);
    setCurrentView('student-scorecard');
  };

  const handleAddStudent = (std: StudentUser) => {
    JAMBStorageService.addStudent(std);
    refreshAllData();
  };

  const handleUpdateStudent = (std: StudentUser) => {
    JAMBStorageService.updateStudent(std);
    refreshAllData();
  };

  const handleDeleteStudent = (id: string) => {
    JAMBStorageService.deleteStudent(id);
    refreshAllData();
  };

  const handleSaveQuestions = (updated: Question[]) => {
    JAMBStorageService.saveQuestions(updated);
    setQuestions(updated);
  };

  const handleAddMaterial = (mat: LearningMaterial) => {
    JAMBStorageService.addMaterial(mat);
    setMaterials(JAMBStorageService.getMaterials());
  };

  const handleDeleteMaterial = (id: string) => {
    JAMBStorageService.deleteMaterial(id);
    setMaterials(JAMBStorageService.getMaterials());
  };

  const handleGradeAssignment = (assignmentId: string, studentId: string, score: number, feedback: string) => {
    JAMBStorageService.gradeAssignment(assignmentId, studentId, score, feedback);
    setAssignments(JAMBStorageService.getAssignments());
  };

  const isStudent = currentUser && currentUser !== 'admin';
  const activeStudent = isStudent ? (currentUser as StudentUser) : students[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateView={(view) => {
          if (view === 'admin' && currentUser !== 'admin') {
            setIsLoginModalOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        mockSchedule={mockSchedule}
      />

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        {/* 1. STUDENT PORTAL DASHBOARD (Study materials, videos, quizzes, assignments, CBT mock status) */}
        {currentView === 'student-portal' && activeStudent && (
          <StudentPortalDashboard
            student={activeStudent}
            mockSchedule={mockSchedule}
            materials={materials}
            assignments={assignments}
            quizResults={quizResults}
            mockSubmissions={mockSubmissions}
            allQuestions={questions}
            onStartJAMBMockExam={handleStartMockExam}
            onSubmitAssignment={handleSubmitAssignment}
            onRefreshData={refreshAllData}
            onAuthorizeStudent={handleAuthorizeStudent}
            onViewScorecard={handleViewScorecard}
          />
        )}

        {/* 2. JAMB ACTIVE CBT EXAM (4 Allocated Subjects, 120 Mins Timer, Anti-cheat) */}
        {currentView === 'student-exam' && activeStudent && (
          <JAMBActiveExam
            student={activeStudent}
            mockTitle={mockSchedule.title}
            durationMinutes={mockSchedule.durationMinutes}
            subjectQuestions={getSubjectQuestionsForStudent(activeStudent)}
            onCompleteMock={handleCompleteMock}
          />
        )}

        {/* 3. JAMB OFFICIAL MOCK SCORECARD (Scored out of 400 marks) */}
        {currentView === 'student-scorecard' && latestMockSubmission && (
          <JAMBScorecard
            submission={latestMockSubmission}
            onReturnToDashboard={() => setCurrentView('student-portal')}
          />
        )}

        {/* 4. ADMIN MANAGEMENT DASHBOARD */}
        {currentView === 'admin' && (
          <JAMBAdminDashboard
            mockSchedule={mockSchedule}
            onUpdateMockSchedule={handleUpdateSchedule}
            monthlyExams={monthlyExams}
            onAddMonthlyExam={handleAddMonthlyExam}
            onSelectActiveExam={handleSelectActiveExam}
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onAuthorizeStudent={handleAuthorizeStudent}
            onAuthorizeAllStudents={handleAuthorizeAllStudents}
            questions={questions}
            onSaveQuestions={handleSaveQuestions}
            mockSubmissions={mockSubmissions}
            onReleaseSubmissionResult={handleReleaseSubmissionResult}
            onReleaseAllResults={handleReleaseAllResults}
            materials={materials}
            onAddMaterial={handleAddMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            assignments={assignments}
            onGradeAssignment={handleGradeAssignment}
            onSwitchToStudentView={() => setCurrentView('student-portal')}
          />
        )}
      </div>

      {/* Mandatory Change Default Password Modal */}
      {isStudent && (currentUser as StudentUser).isDefaultPassword && currentView !== 'student-exam' && (
        <ChangePasswordModal
          student={currentUser as StudentUser}
          onPasswordChanged={handlePasswordChanged}
        />
      )}

      {/* Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      {currentView !== 'student-exam' && (
        <footer className="bg-white border-t border-slate-200 py-6 px-4 mt-auto print:hidden">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Aristotle Academy CBT Engine</span>
              <span>•</span>
              <span>JAMB UTME Statewide Mock & Continuous Learning Portal</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
              <span>Joint Admissions and Matriculation Board Standard Spec</span>
              <span>v3.0.0 Pro</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
