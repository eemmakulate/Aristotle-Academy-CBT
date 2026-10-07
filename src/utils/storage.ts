import { 
  StudentUser, 
  MockExamSchedule, 
  LearningMaterial, 
  Assignment, 
  PracticeQuiz, 
  QuizResult, 
  JAMBMockSubmission, 
  Question 
} from '../types';
import { 
  DEFAULT_STUDENTS, 
  DEFAULT_MOCK_SCHEDULE, 
  DEFAULT_MONTHLY_EXAMS, 
  DEFAULT_LEARNING_MATERIALS, 
  DEFAULT_ASSIGNMENTS, 
  JAMB_QUESTION_BANK 
} from '../data/jambData';

const STUDENTS_KEY = 'aristotle_jamb_students_v2';
const MOCK_SCHEDULE_KEY = 'aristotle_jamb_mock_schedule_v2';
const MONTHLY_EXAMS_KEY = 'aristotle_jamb_monthly_exams_v2';
const MATERIALS_KEY = 'aristotle_jamb_materials_v2';
const ASSIGNMENTS_KEY = 'aristotle_jamb_assignments_v2';
const QUIZ_RESULTS_KEY = 'aristotle_jamb_quiz_results_v2';
const MOCK_SUBMISSIONS_KEY = 'aristotle_jamb_mock_submissions_v2';
const QUESTIONS_KEY = 'aristotle_jamb_questions_v2';
const CURRENT_USER_KEY = 'aristotle_jamb_auth_user_v2';

export const JAMBStorageService = {
  // --- STUDENTS ---
  getStudents(): StudentUser[] {
    try {
      const data = localStorage.getItem(STUDENTS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  },

  saveStudents(students: StudentUser[]) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  },

  updateStudentPassword(studentId: string, newPassword: string): StudentUser | null {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === studentId);
    if (idx !== -1) {
      students[idx].password = newPassword;
      students[idx].isDefaultPassword = false;
      this.saveStudents(students);
      // Also update auth user if matching
      const current = this.getCurrentUser();
      if (current && current.id === studentId) {
        this.setCurrentUser(students[idx]);
      }
      return students[idx];
    }
    return null;
  },

  addStudent(student: StudentUser) {
    const students = this.getStudents();
    students.unshift(student);
    this.saveStudents(students);
  },

  updateStudent(student: StudentUser) {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx !== -1) {
      students[idx] = student;
      this.saveStudents(students);
    }
  },

  deleteStudent(studentId: string) {
    const students = this.getStudents().filter(s => s.id !== studentId);
    this.saveStudents(students);
  },

  // Authorize individual candidate to write CBT exam
  authorizeStudent(studentId: string, authorized: boolean): StudentUser | null {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === studentId);
    if (idx !== -1) {
      students[idx].isAuthorizedForExam = authorized;
      students[idx].authorizedAt = authorized ? new Date().toLocaleTimeString() : undefined;
      this.saveStudents(students);
      const current = this.getCurrentUser();
      if (current && current.id === studentId) {
        this.setCurrentUser(students[idx]);
      }
      return students[idx];
    }
    return null;
  },

  authorizeAllStudents() {
    const students = this.getStudents().map(s => ({
      ...s,
      isAuthorizedForExam: true,
      authorizedAt: new Date().toLocaleTimeString(),
    }));
    this.saveStudents(students);
    const current = this.getCurrentUser();
    if (current) {
      const updatedCurr = students.find(s => s.id === current.id);
      if (updatedCurr) this.setCurrentUser(updatedCurr);
    }
  },

  // --- AUTH SESSION ---
  getCurrentUser(): StudentUser | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    // Default to student Alexandria Vance for instant evaluation, or null
    return this.getStudents()[0] || null;
  },

  setCurrentUser(user: StudentUser | null) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // --- MOCK EXAM SCHEDULE (Controlled by Admin) ---
  getMockSchedule(): MockExamSchedule {
    try {
      const data = localStorage.getItem(MOCK_SCHEDULE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(MOCK_SCHEDULE_KEY, JSON.stringify(DEFAULT_MOCK_SCHEDULE));
    return DEFAULT_MOCK_SCHEDULE;
  },

  saveMockSchedule(schedule: MockExamSchedule) {
    localStorage.setItem(MOCK_SCHEDULE_KEY, JSON.stringify(schedule));
  },

  // Named Monthly Exams
  getMonthlyExams(): MockExamSchedule[] {
    try {
      const data = localStorage.getItem(MONTHLY_EXAMS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(MONTHLY_EXAMS_KEY, JSON.stringify(DEFAULT_MONTHLY_EXAMS));
    return DEFAULT_MONTHLY_EXAMS;
  },

  saveMonthlyExams(exams: MockExamSchedule[]) {
    localStorage.setItem(MONTHLY_EXAMS_KEY, JSON.stringify(exams));
  },

  addMonthlyExam(exam: MockExamSchedule) {
    const list = this.getMonthlyExams();
    list.unshift(exam);
    this.saveMonthlyExams(list);
  },

  deleteMonthlyExam(id: string) {
    const list = this.getMonthlyExams().filter(e => e.id !== id);
    this.saveMonthlyExams(list);
  },

  // --- LEARNING MATERIALS ---
  getMaterials(): LearningMaterial[] {
    try {
      const data = localStorage.getItem(MATERIALS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(DEFAULT_LEARNING_MATERIALS));
    return DEFAULT_LEARNING_MATERIALS;
  },

  saveMaterials(materials: LearningMaterial[]) {
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
  },

  addMaterial(mat: LearningMaterial) {
    const mats = this.getMaterials();
    mats.unshift(mat);
    this.saveMaterials(mats);
  },

  deleteMaterial(id: string) {
    const mats = this.getMaterials().filter(m => m.id !== id);
    this.saveMaterials(mats);
  },

  // --- ASSIGNMENTS ---
  getAssignments(): Assignment[] {
    try {
      const data = localStorage.getItem(ASSIGNMENTS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(DEFAULT_ASSIGNMENTS));
    return DEFAULT_ASSIGNMENTS;
  },

  saveAssignments(assignments: Assignment[]) {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  },

  submitAssignment(assignmentId: string, studentId: string, text: string) {
    const list = this.getAssignments();
    const asg = list.find(a => a.id === assignmentId);
    if (asg) {
      asg.submissions[studentId] = {
        submittedAt: new Date().toLocaleString(),
        submissionText: text,
      };
      this.saveAssignments(list);
    }
  },

  gradeAssignment(assignmentId: string, studentId: string, score: number, feedback: string) {
    const list = this.getAssignments();
    const asg = list.find(a => a.id === assignmentId);
    if (asg && asg.submissions[studentId]) {
      asg.submissions[studentId].score = score;
      asg.submissions[studentId].feedback = feedback;
      this.saveAssignments(list);
    }
  },

  // --- QUIZ RESULTS ---
  getQuizResults(): QuizResult[] {
    try {
      const data = localStorage.getItem(QUIZ_RESULTS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [
      {
        id: 'qres-1',
        studentId: 'std-1',
        studentName: 'Alexandria Vance',
        quizId: 'quiz-eng-1',
        quizTitle: 'Daily Lexis & Concord Drill #4',
        subject: 'Use of English',
        score: 9,
        totalQuestions: 10,
        percentage: 90,
        date: '2026-10-04 14:15',
      },
      {
        id: 'qres-2',
        studentId: 'std-1',
        studentName: 'Alexandria Vance',
        quizId: 'quiz-math-1',
        quizTitle: 'Calculus Integration Rapid Fire',
        subject: 'Mathematics',
        score: 8,
        totalQuestions: 10,
        percentage: 80,
        date: '2026-10-05 09:30',
      },
    ];
  },

  saveQuizResult(result: QuizResult) {
    const current = this.getQuizResults();
    current.unshift(result);
    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(current));
  },

  // --- JAMB MOCK SUBMISSIONS ---
  getMockSubmissions(): JAMBMockSubmission[] {
    try {
      const data = localStorage.getItem(MOCK_SUBMISSIONS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [
      {
        id: 'JAMB-SUB-2026-8841',
        studentId: 'std-1',
        candidateName: 'Alexandria Vance',
        jambRegNo: 'JAMB2026/ENG01',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        mockTitle: 'JAMB UTME Comprehensive Mock #2',
        allocatedSubjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry'],
        startTime: Date.now() - 7200000,
        endTime: Date.now() - 3600000,
        timeSpentSeconds: 4320, // 1 hr 12 mins
        totalQuestions: 40,
        totalCorrect: 31,
        totalScoreOutOf400: 310, // JAMB aggregate
        percentage: 78,
        passed: true,
        subjectBreakdowns: [
          { subject: 'Use of English', totalQuestions: 10, correctCount: 8, incorrectCount: 2, unansweredCount: 0, scoreOutOf100: 80 },
          { subject: 'Mathematics', totalQuestions: 10, correctCount: 8, incorrectCount: 1, unansweredCount: 1, scoreOutOf100: 80 },
          { subject: 'Physics', totalQuestions: 10, correctCount: 7, incorrectCount: 3, unansweredCount: 0, scoreOutOf100: 70 },
          { subject: 'Chemistry', totalQuestions: 10, correctCount: 8, incorrectCount: 2, unansweredCount: 0, scoreOutOf100: 80 },
        ],
        answers: {},
        flagged: {},
        cheatViolations: 0,
        violationLogs: [],
        dateFormatted: '2026-10-01, 11:45 AM',
        isResultReleased: true,
        releasedAt: '2026-10-01 12:00 PM',
      },
    ];
  },

  saveMockSubmission(submission: JAMBMockSubmission) {
    const current = this.getMockSubmissions();
    current.unshift(submission);
    localStorage.setItem(MOCK_SUBMISSIONS_KEY, JSON.stringify(current));
  },

  releaseSubmissionResult(submissionId: string, released: boolean): JAMBMockSubmission[] {
    const list = this.getMockSubmissions().map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          isResultReleased: released,
          releasedAt: released ? new Date().toLocaleString() : undefined,
        };
      }
      return s;
    });
    localStorage.setItem(MOCK_SUBMISSIONS_KEY, JSON.stringify(list));
    return list;
  },

  releaseAllSubmissionResults(released: boolean): JAMBMockSubmission[] {
    const list = this.getMockSubmissions().map(s => ({
      ...s,
      isResultReleased: released,
      releasedAt: released ? new Date().toLocaleString() : undefined,
    }));
    localStorage.setItem(MOCK_SUBMISSIONS_KEY, JSON.stringify(list));
    return list;
  },

  deleteMockSubmission(id: string) {
    const current = this.getMockSubmissions().filter(s => s.id !== id);
    localStorage.setItem(MOCK_SUBMISSIONS_KEY, JSON.stringify(current));
  },

  // --- QUESTION BANK ---
  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(QUESTIONS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(JAMB_QUESTION_BANK));
    return JAMB_QUESTION_BANK;
  },

  saveQuestions(questions: Question[]) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  },

  resetQuestions(): Question[] {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(JAMB_QUESTION_BANK));
    return JAMB_QUESTION_BANK;
  },
};
