export type OptionKey = 'A' | 'B' | 'C' | 'D';

// Complete Official 24 JAMB UTME Subjects
export const OFFICIAL_JAMB_SUBJECTS = [
  'Use of English',
  'Accounting / Principles of Accounts',
  'Agricultural Science',
  'Arabic',
  'Art (Fine Art)',
  'Biology',
  'Chemistry',
  'Christian Religious Studies (CRS)',
  'Commerce',
  'Computer Studies',
  'Economics',
  'French',
  'Geography',
  'Government',
  'Hausa',
  'History',
  'Home Economics',
  'Igbo',
  'Islamic Studies (IRS)',
  'Literature-in-English',
  'Mathematics',
  'Music',
  'Physics',
  'Yoruba',
] as const;

export type JAMBSubject = typeof OFFICIAL_JAMB_SUBJECTS[number];

export interface Question {
  id: string;
  subject: string;
  subtopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
  imageUrl?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  optionImages?: {
    A?: string;
    B?: string;
    C?: string;
    D?: string;
  };
  correctOption: OptionKey;
  explanation: string;
  batchOrYear?: string; // e.g. "Series A - 2026", "Past UTME Archive"
}

export interface StudentUser {
  id: string;
  jambRegNo: string;
  fullName: string;
  email: string;
  password: string;
  isDefaultPassword: boolean;
  avatarUrl: string; // Passport photograph (uploaded file or data URL)
  facultyTrack: string;
  allocatedSubjects: string[]; // Exactly 4 subjects (Use of English compulsory + 3 others)
  phone?: string;
  seatNumber?: string;
  isAuthorizedForExam: boolean; // Invigilator / Admin authorization flag
  authorizedAt?: string;
  dateCreated: string;
}

export interface MockExamSchedule {
  id: string;
  title: string;
  monthName: string; // e.g. "October 2026", "November 2026"
  status: 'active' | 'scheduled' | 'closed'; // When 'active', students can write the exam
  durationMinutes: number; // e.g. 120 mins
  questionsPerSubject: number;
  passingScoreOutOf400: number; // e.g. 200
  scheduledDate: string;
  instructions: string;
  targetBatch: string;
  dateCreated?: string;
  isResultReleased?: boolean; // When true, results are visible in candidate portals
}

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'novel_summary' | 'formula_sheet';
  url: string;
  durationOrPages: string;
  description: string;
  downloadUrl?: string;
  dateAdded: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  submissions: Record<string, {
    submittedAt: string;
    submissionText: string;
    score?: number;
    feedback?: string;
  }>;
}

export interface PracticeQuiz {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  questions: Question[];
}

export interface QuizResult {
  id: string;
  studentId: string;
  studentName: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}

export interface ViolationRecord {
  timestamp: number;
  timeFormatted: string;
  reason: string;
}

export interface SubjectScoreBreakdown {
  subject: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  scoreOutOf100: number;
}

export interface JAMBMockSubmission {
  id: string;
  studentId: string;
  candidateName: string;
  jambRegNo: string;
  avatarUrl: string;
  mockTitle: string;
  allocatedSubjects: string[];
  startTime: number;
  endTime: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  totalCorrect: number;
  totalScoreOutOf400: number; // JAMB standard score out of 400
  percentage: number;
  passed: boolean;
  subjectBreakdowns: SubjectScoreBreakdown[];
  answers: Record<string, OptionKey | null>;
  flagged: Record<string, boolean>;
  cheatViolations: number;
  violationLogs: ViolationRecord[];
  dateFormatted: string;
  isResultReleased?: boolean; // When released by admin, student can view score & corrections
  releasedAt?: string;
}

export interface ExamSubmission {
  id: string;
  candidateName: string;
  candidateId: string;
  avatarUrl: string;
  subject: string;
  startTime: number;
  endTime: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, OptionKey | null>;
  flagged: Record<string, boolean>;
  cheatViolations: number;
  violationLogs: ViolationRecord[];
  dateFormatted: string;
}

export interface ExamConfig {
  examTitle: string;
  durationMinutes: number;
  passingPercentage: number;
  maxViolations: number;
  enableSoundAlerts: boolean;
}
