import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  Sliders, 
  Save, 
  Eye, 
  X,
  FileSpreadsheet,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { Question, OptionKey, ExamSubmission, ExamConfig } from '../../types';
import { formatSeconds } from '../../utils/formatters';

interface AdminDashboardProps {
  questions: Question[];
  onSaveQuestions: (questions: Question[]) => void;
  onResetQuestions: () => void;
  submissions: ExamSubmission[];
  onDeleteSubmission: (id: string) => void;
  onClearAllSubmissions: () => void;
  config: ExamConfig;
  onSaveConfig: (config: ExamConfig) => void;
  onSwitchToStudentView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  questions,
  onSaveQuestions,
  onResetQuestions,
  submissions,
  onDeleteSubmission,
  onClearAllSubmissions,
  config,
  onSaveConfig,
  onSwitchToStudentView,
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'logs' | 'config'>('questions');

  // Search & Filters for questions
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  // Add / Edit Question Modal State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [formSubject, setFormSubject] = useState('SAT Mathematics & EBRW');
  const [formSubtopic, setFormSubtopic] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [formText, setFormText] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formOptionA, setFormOptionA] = useState('');
  const [formOptionB, setFormOptionB] = useState('');
  const [formOptionC, setFormOptionC] = useState('');
  const [formOptionD, setFormOptionD] = useState('');
  const [formCorrectOption, setFormCorrectOption] = useState<OptionKey>('A');
  const [formExplanation, setFormExplanation] = useState('');

  // View Submission Details Modal
  const [viewingSubmission, setViewingSubmission] = useState<ExamSubmission | null>(null);

  // Config State
  const [tempConfig, setTempConfig] = useState<ExamConfig>(config);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  // KPI Calculations
  const totalSubmissions = submissions.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(submissions.reduce((acc, curr) => acc + curr.percentage, 0) / totalSubmissions)
    : 0;
  const passRate = totalSubmissions > 0
    ? Math.round((submissions.filter((s) => s.passed).length / totalSubmissions) * 100)
    : 0;
  const totalViolations = submissions.reduce((acc, curr) => acc + curr.cheatViolations, 0);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormSubject('SAT Mathematics & EBRW');
    setFormSubtopic('Algebraic Structures');
    setFormDifficulty('Medium');
    setFormText('');
    setFormImageUrl('');
    setFormOptionA('');
    setFormOptionB('');
    setFormOptionC('');
    setFormOptionD('');
    setFormCorrectOption('A');
    setFormExplanation('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(q);
    setFormSubject(q.subject);
    setFormSubtopic(q.subtopic || '');
    setFormDifficulty(q.difficulty || 'Medium');
    setFormText(q.text);
    setFormImageUrl(q.imageUrl || '');
    setFormOptionA(q.options.A);
    setFormOptionB(q.options.B);
    setFormOptionC(q.options.C);
    setFormOptionD(q.options.D);
    setFormCorrectOption(q.correctOption);
    setFormExplanation(q.explanation);
    setIsModalOpen(true);
  };

  // Save Question Form
  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim() || !formOptionA.trim() || !formOptionB.trim() || !formOptionC.trim() || !formOptionD.trim()) {
      alert('Please fill in the question text and all 4 options.');
      return;
    }

    const newQuestion: Question = {
      id: editingQuestion ? editingQuestion.id : `q-custom-${Date.now()}`,
      subject: formSubject,
      subtopic: formSubtopic || 'General Topic',
      difficulty: formDifficulty,
      text: formText.trim(),
      imageUrl: formImageUrl.trim() || undefined,
      options: {
        A: formOptionA.trim(),
        B: formOptionB.trim(),
        C: formOptionC.trim(),
        D: formOptionD.trim(),
      },
      correctOption: formCorrectOption,
      explanation: formExplanation.trim() || 'No explanation provided.',
    };

    if (editingQuestion) {
      const updated = questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q));
      onSaveQuestions(updated);
    } else {
      onSaveQuestions([newQuestion, ...questions]);
    }

    setIsModalOpen(false);
  };

  // Delete Question
  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this question from the bank?')) {
      const updated = questions.filter((q) => q.id !== id);
      onSaveQuestions(updated);
    }
  };

  // Export Questions to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `aristotle_question_bank_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  // Import Questions from JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onSaveQuestions(parsed);
            alert(`Successfully imported ${parsed.length} questions into the bank!`);
          } else {
            alert('Invalid JSON structure. Expected array of questions.');
          }
        } catch {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  // Export Submissions to CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert('No candidate submission logs to export.');
      return;
    }

    const headers = ['Submission ID', 'Candidate Name', 'Registration ID', 'Subject', 'Score %', 'Correct', 'Incorrect', 'Unanswered', 'Time Spent (s)', 'Violations', 'Date'];
    const rows = submissions.map((s) => [
      s.id,
      `"${s.candidateName}"`,
      `"${s.candidateId}"`,
      `"${s.subject}"`,
      s.percentage,
      s.correctCount,
      s.incorrectCount,
      s.unansweredCount,
      s.timeSpentSeconds,
      s.cheatViolations,
      `"${s.dateFormatted}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const dl = document.createElement('a');
    dl.setAttribute('href', encodeURI(csvContent));
    dl.setAttribute('download', `aristotle_exam_logs_${Date.now()}.csv`);
    dl.click();
  };

  // Filtered Questions List
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(questionSearch.toLowerCase()) ||
      (q.subtopic && q.subtopic.toLowerCase().includes(questionSearch.toLowerCase()));
    const matchesSubject = selectedSubjectFilter === 'All' || q.subject === selectedSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  const subjectOptions = ['All', 'SAT Mathematics & EBRW', 'PTE Academic English', 'Senior Secondary Science'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            Administrative Portal & Exam Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Aristotle CBT Engine — Management Console
          </h1>
          <p className="text-sm text-slate-500">
            Configure proctoring thresholds, manage questions, and review audit records.
          </p>
        </div>

        <button
          onClick={onSwitchToStudentView}
          className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition self-start md:self-auto cursor-pointer"
        >
          Launch Student Examination View
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
            <span>Question Bank</span>
            <Database className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-black text-slate-900">{questions.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across all subjects</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
            <span>Exams Taken</span>
            <Users className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalSubmissions}</div>
          <div className="text-[11px] text-slate-500 mt-1">Completed sessions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{avgScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Mean candidate score</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
            <span>Pass Rate</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{passRate}%</div>
          <div className="text-[11px] text-emerald-600 mt-1">&gt;= {config.passingPercentage}% benchmark</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
            <span>Security Flags</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">{totalViolations}</div>
          <div className="text-[11px] text-rose-600 mt-1">Tab switches logged</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'questions'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Question Management ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'logs'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Candidate Performance Logs ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'config'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Exam Configuration</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: QUESTION BANK MANAGEMENT
          ========================================================================= */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions by text or topic..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-slate-50"
                />
              </div>

              {/* Subject Filter */}
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                {subjectOptions.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Buttons: Add, JSON export/import, Reset */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Download Question Bank as JSON"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>

              <button
                onClick={() => {
                  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Aristotle Academy CBT Engine - Offline Client</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap">
</head>
<body class="bg-slate-100 text-slate-900 font-sans p-8">
  <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
    <div class="flex items-center gap-3 border-b pb-4 mb-6">
      <div class="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl">A</div>
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Aristotle Academy CBT Engine</h1>
        <p class="text-xs text-slate-500">Standalone Offline Assessment Archive (${new Date().toLocaleDateString()})</p>
      </div>
    </div>
    <p class="text-sm text-slate-700 mb-6">This archive contains the exported ${questions.length} questions and curriculum metadata from Aristotle Academy CBT Engine.</p>
    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs overflow-auto max-h-96">
      <pre>${JSON.stringify({ examTitle: config.examTitle, durationMinutes: config.durationMinutes, questions }, null, 2)}</pre>
    </div>
  </div>
</body>
</html>`;
                  const blob = new Blob([htmlContent], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `aristotle_cbt_standalone_${Date.now()}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Download Standalone Offline HTML Package"
              >
                <Download className="w-4 h-4 text-indigo-700" />
                <span className="hidden sm:inline">Offline HTML</span>
              </button>

              <label className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  if (confirm('Reset to default pre-loaded questions from Aristotle Academy curriculum?')) {
                    onResetQuestions();
                  }
                }}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                title="Restore default questions"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Questions Table / List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">Subject & Subtopic</th>
                    <th className="py-3.5 px-4">Question Text</th>
                    <th className="py-3.5 px-4">Diagram</th>
                    <th className="py-3.5 px-4 text-center">Correct Option</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No questions found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((q, idx) => (
                      <tr key={q.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{q.subject}</div>
                          <div className="text-[11px] text-slate-500">{q.subtopic}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="line-clamp-2 text-slate-700 font-medium">
                            {q.text}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {q.imageUrl ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              Yes
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold leading-6 border border-emerald-300">
                            {q.correctOption}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(q)}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="Edit Question"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
          TAB 2: CANDIDATE PERFORMANCE LOGS
          ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Candidate Assessment Audit Log
              </h3>
              <p className="text-xs text-slate-500">
                Track full history of test attempts, anti-cheat violations, and results.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={submissions.length === 0}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Clear all candidate submission records from local storage?')) {
                    onClearAllSubmissions();
                  }
                }}
                disabled={submissions.length === 0}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Logs</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Score & Status</th>
                    <th className="py-3.5 px-4">Breakdown</th>
                    <th className="py-3.5 px-4">Time Spent</th>
                    <th className="py-3.5 px-4">Security Violations</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No examination attempts recorded yet.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={sub.avatarUrl}
                              alt={sub.candidateName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-800">{sub.candidateName}</div>
                              <div className="text-[11px] font-mono text-slate-500">{sub.candidateId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {sub.subject}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-slate-900">{sub.percentage}%</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.passed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {sub.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-emerald-700 font-bold">{sub.correctCount}C</span> /{' '}
                          <span className="text-rose-700 font-bold">{sub.incorrectCount}I</span> /{' '}
                          <span className="text-slate-500 font-medium">{sub.unansweredCount}U</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {formatSeconds(sub.timeSpentSeconds)}
                        </td>
                        <td className="py-3.5 px-4">
                          {sub.cheatViolations === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                              <CheckCircle className="w-3 h-3" />
                              Clean (0)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-200">
                              <ShieldAlert className="w-3 h-3" />
                              {sub.cheatViolations} Flagged
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {sub.dateFormatted}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingSubmission(sub)}
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="View Full Scorecard"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteSubmission(sub.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
          TAB 3: EXAM CONFIGURATION
          ========================================================================= */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-2 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-900" />
            CBT Portal Engine Configuration
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSaveConfig(tempConfig);
              setConfigSavedToast(true);
              setTimeout(() => setConfigSavedToast(false), 3000);
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Examination Portal Title
              </label>
              <input
                type="text"
                required
                value={tempConfig.examTitle}
                onChange={(e) => setTempConfig({ ...tempConfig, examTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Default Exam Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  required
                  value={tempConfig.durationMinutes}
                  onChange={(e) => setTempConfig({ ...tempConfig, durationMinutes: parseInt(e.target.value) || 25 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Passing Benchmark Percentage (%)
                </label>
                <input
                  type="number"
                  min="30"
                  max="100"
                  required
                  value={tempConfig.passingPercentage}
                  onChange={(e) => setTempConfig({ ...tempConfig, passingPercentage: parseInt(e.target.value) || 65 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Max Allowed Anti-Cheat Violations Before Auto-Submission
              </label>
              <select
                value={tempConfig.maxViolations}
                onChange={(e) => setTempConfig({ ...tempConfig, maxViolations: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
              >
                <option value={1}>1 Violation (Strict Zero Tolerance)</option>
                <option value={2}>2 Violations</option>
                <option value={3}>3 Violations (Standard Default)</option>
                <option value={5}>5 Violations (Lenient Mode)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                If candidate switches tabs or unfocuses this many times, exam terminates automatically.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              {configSavedToast ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Settings saved successfully!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          ADD / EDIT QUESTION MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingQuestion ? 'Edit Question Record' : 'Add New Question to Bank'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  >
                    <option value="SAT Mathematics & EBRW">SAT Mathematics & EBRW</option>
                    <option value="PTE Academic English">PTE Academic English</option>
                    <option value="Senior Secondary Science">Senior Secondary Science</option>
                    <option value="General Academic Aptitude">General Academic Aptitude</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtopic / Category</label>
                  <input
                    type="text"
                    required
                    value={formSubtopic}
                    onChange={(e) => setFormSubtopic(e.target.value)}
                    placeholder="e.g. Kinematics, Algebra"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Statement</label>
                <textarea
                  required
                  rows={3}
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Enter the complete question text..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Diagram / Image URL (or SVG Data URI)
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://... or data:image/svg+xml;..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
                {formImageUrl && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Diagram Preview:</span>
                    <img src={formImageUrl} alt="Preview" className="max-h-28 mx-auto object-contain" />
                  </div>
                )}
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  Multiple Choice Options (A, B, C, D)
                </label>
                
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0">A</span>
                  <input
                    type="text"
                    required
                    value={formOptionA}
                    onChange={(e) => setFormOptionA(e.target.value)}
                    placeholder="Option A text"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0">B</span>
                  <input
                    type="text"
                    required
                    value={formOptionB}
                    onChange={(e) => setFormOptionB(e.target.value)}
                    placeholder="Option B text"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0">C</span>
                  <input
                    type="text"
                    required
                    value={formOptionC}
                    onChange={(e) => setFormOptionC(e.target.value)}
                    placeholder="Option C text"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0">D</span>
                  <input
                    type="text"
                    required
                    value={formOptionD}
                    onChange={(e) => setFormOptionD(e.target.value)}
                    placeholder="Option D text"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designate Correct Option Key
                </label>
                <div className="flex gap-4">
                  {(['A', 'B', 'C', 'D'] as OptionKey[]).map((key) => (
                    <label
                      key={key}
                      className={`flex-1 py-2 rounded-xl border text-center font-bold text-xs cursor-pointer transition ${
                        formCorrectOption === key
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={formCorrectOption === key}
                        onChange={() => setFormCorrectOption(key)}
                        className="hidden"
                      />
                      Option {key}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Step-by-Step Solution & Faculty Explanation
                </label>
                <textarea
                  required
                  rows={3}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Explain why the option is correct, including formulas, proofs, or grammatical rules..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW SUBMISSION SCORECARD MODAL (ADMIN INSPECT)
          ========================================================================= */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingSubmission.avatarUrl}
                  alt={viewingSubmission.candidateName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{viewingSubmission.candidateName}</h3>
                  <p className="text-xs font-mono text-slate-500">{viewingSubmission.candidateId} • {viewingSubmission.subject}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingSubmission(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Final Percentage</span>
                <div className="text-2xl font-black text-slate-900">{viewingSubmission.percentage}%</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${viewingSubmission.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {viewingSubmission.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Time Taken</span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {formatSeconds(viewingSubmission.timeSpentSeconds)}
                </div>
                <span className="text-[10px] text-slate-500">Duration spent</span>
              </div>
            </div>

            {/* Violations audit */}
            <div className="mb-4 p-4 rounded-xl border bg-amber-50 border-amber-200 text-xs">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Anti-Cheat Incidents: {viewingSubmission.cheatViolations}</span>
              </div>
              {viewingSubmission.violationLogs.length === 0 ? (
                <p className="text-slate-600">Zero focus deviations logged during this session.</p>
              ) : (
                <ul className="space-y-1 font-mono text-[11px] text-amber-950 mt-2">
                  {viewingSubmission.violationLogs.map((log: { timeFormatted: string; reason: string }, i: number) => (
                    <li key={i}>
                      #{i + 1} [{log.timeFormatted}]: {log.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={() => setViewingSubmission(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
