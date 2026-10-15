import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import { EnglishLevel, QuizQuestion, User } from '../types';
import { StudentDetailView } from './StudentDetailView';
import { CreateUserPage } from './CreateUserPage';
import {
  UserCheck,
  PlusCircle,
  FileText,
  Calendar,
  CheckCircle2,
  Sparkles,
  Send,
  Trash2,
  RefreshCw,
  Search,
  Check,
  Users,
  Award,
  Eye,
  GraduationCap,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface TeacherPortalProps {
  activeTab: string;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ activeTab }) => {
  const {
    currentUser,
    language,
    users,
    quizzes,
    submissions,
    attendance,
    addAttendanceRecord,
    createQuiz,
    renewStudentAccess,
    toggleStudentBlock,
    generateAIQuiz
  } = useAcademy();

  const t = getTranslation(language);

  // Sub-navigation states
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Attendance states
  const [diarySubTab, setDiarySubTab] = useState<'register' | 'history' | 'roster'>('register');
  const [selectedStudentId, setSelectedStudentId] = useState(users.find(u => u.role === 'student')?.id || '');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState<'present' | 'absent' | 'excused'>('present');
  const [lessonTopic, setLessonTopic] = useState('');
  const [lessonNotes, setLessonNotes] = useState('');
  const [homeworkDone, setHomeworkDone] = useState(true);
  const [attendanceToast, setAttendanceToast] = useState('');
  const [diarySearchFilter, setDiarySearchFilter] = useState('');

  // Form / Quiz Builder State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLevel, setFormLevel] = useState<EnglishLevel>('B1');
  const [formDueDate, setFormDueDate] = useState('2026-10-31');
  const [formQuestions, setFormQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q_custom_1',
      type: 'multiple_choice',
      question: 'Which sentence demonstrates correct American English connected speech?',
      options: [
        'I am gonna go to the grocery store.',
        'I am go to grocery store.',
        'Gonna I go grocery to.',
        'Store I am gonna.'
      ],
      correctAnswer: '0',
      explanation: '"Gonna" is the standard spoken reduction of "going to".'
    }
  ]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('Phrasal verbs in business meetings');
  const [formToast, setFormToast] = useState('');

  // Filter students
  const [searchStudent, setSearchStudent] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  const students = users.filter(u => u.role === 'student');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchStudent.toLowerCase()) || s.email.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : s.monthlyStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const student = users.find(u => u.id === selectedStudentId);
    if (!student || !lessonTopic.trim()) return;

    addAttendanceRecord({
      studentId: student.id,
      studentName: student.name,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      date: attendanceDate,
      status: attendanceStatus,
      topic: lessonTopic.trim(),
      notes: lessonNotes.trim(),
      homeworkDone,
      score: 9.0
    });

    setAttendanceToast(t.diarySaveSuccess);
    setLessonTopic('');
    setLessonNotes('');
    setTimeout(() => setAttendanceToast(''), 3000);
  };

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q_custom_${Date.now()}`,
      type: 'multiple_choice',
      question: 'New question prompt...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: '0',
      explanation: 'Explanation for correct answer.'
    };
    setFormQuestions([...formQuestions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    const updated = formQuestions.filter((_, i) => i !== idx);
    setFormQuestions(updated);
  };

  const handleGenerateQuestionsWithAI = async () => {
    if (!aiTopicInput.trim()) return;
    setIsGeneratingAI(true);
    try {
      const generated = await generateAIQuiz(aiTopicInput, formLevel);
      if (generated && generated.length > 0) {
        setFormQuestions(prev => [...prev, ...generated]);
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handlePublishQuiz = () => {
    if (!formTitle.trim()) return;

    createQuiz({
      title: formTitle.trim(),
      description: formDescription.trim() || 'Custom teacher evaluation.',
      level: formLevel,
      dueDate: formDueDate,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      assignedStudentIds: [],
      passingScore: 70,
      questions: formQuestions
    });

    setFormToast(t.formPublishSuccess);
    setFormTitle('');
    setFormDescription('');
    setTimeout(() => setFormToast(''), 3500);
  };

  // Dedicated Page navigation
  if (isCreatingUser) {
    return (
      <CreateUserPage
        initialRole="student"
        onBack={() => setIsCreatingUser(false)}
        onSuccess={() => setIsCreatingUser(false)}
      />
    );
  }

  if (selectedStudentDetail) {
    return (
      <StudentDetailView
        student={selectedStudentDetail}
        onBack={() => setSelectedStudentDetail(null)}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* VIEW: TEACHER OVERVIEW / DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#002868] to-[#1E3A8A] rounded-2xl p-6 text-white shadow-md">
            <span className="text-[11px] bg-red-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {t.roleTeacher}
            </span>
            <h2 className="text-xl font-bold mt-2">
              {currentUser.name}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              {t.tagline} • {students.length} {t.navStudents.toLowerCase()}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.studentsTitle}</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{students.length}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.diaryTotalClasses}</span>
              <div className="text-2xl font-bold text-blue-900 mt-1">{attendance.length}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.repTotalQuizzes}</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{submissions.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CLASS DIARY (DIÁRIO DE AULAS) */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#002868]" />
                <span>{t.diaryTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.diarySubtitle}
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setDiarySubTab('register')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  diarySubTab === 'register' ? 'bg-[#002868] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.diaryTabRegister}
              </button>
              <button
                onClick={() => setDiarySubTab('history')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  diarySubTab === 'history' ? 'bg-[#002868] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.diaryTabHistory} ({attendance.length})
              </button>
              <button
                onClick={() => setDiarySubTab('roster')}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                  diarySubTab === 'roster' ? 'bg-[#002868] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.diaryTabOverview}
              </button>
            </div>
          </div>

          {/* Toast feedback */}
          {attendanceToast && (
            <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{attendanceToast}</span>
            </div>
          )}

          {/* SUB-TAB 1: REGISTRAR NOVA AULA */}
          {diarySubTab === 'register' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
              <h4 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
                {t.diaryTabRegister}
              </h4>

              <form onSubmit={handleSaveAttendance} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.diarySelectStudent} *
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={e => setSelectedStudentId(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                      required
                    >
                      {students.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.englishLevel || 'B1'}) - {st.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.diaryClassDate} *
                    </label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={e => setAttendanceDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.diaryAttendanceStatus} *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'present', label: t.diaryPresent, color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                      { id: 'absent', label: t.diaryAbsent, color: 'border-red-500 bg-red-50 text-red-800' },
                      { id: 'excused', label: t.diaryExcused, color: 'border-amber-500 bg-amber-50 text-amber-800' },
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setAttendanceStatus(st.id as any)}
                        className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                          attendanceStatus === st.id ? `${st.color} ring-2 ring-current/20 shadow-xs` : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.diaryTopic} *
                  </label>
                  <input
                    type="text"
                    value={lessonTopic}
                    onChange={e => setLessonTopic(e.target.value)}
                    placeholder={t.diaryTopicPlaceholder}
                    required
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />

                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[10px] text-slate-400 font-bold">{t.diaryTopicSuggestions}</span>
                    {[
                      'American Connected Speech & Flap T',
                      'Small Talk & Business Etiquette',
                      'Present Perfect vs Simple Past',
                      'Job Interview Practice',
                      'Idioms for Daily Conversation'
                    ].map(tp => (
                      <button
                        key={tp}
                        type="button"
                        onClick={() => setLessonTopic(tp)}
                        className="text-[10px] bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 px-2 py-0.5 rounded-lg border border-slate-200 transition cursor-pointer"
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{t.diaryHomework}</span>
                    <span className="text-[11px] text-slate-500">
                      {homeworkDone ? t.diaryHomeworkDone : t.diaryHomeworkPending}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={homeworkDone}
                    onChange={e => setHomeworkDone(e.target.checked)}
                    className="w-5 h-5 accent-[#002868] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.diaryNotes}
                  </label>
                  <textarea
                    rows={3}
                    value={lessonNotes}
                    onChange={e => setLessonNotes(e.target.value)}
                    placeholder={t.diaryNotesPlaceholder}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.diarySaveBtn}</span>
                </button>
              </form>
            </div>
          )}

          {/* SUB-TAB 2: HISTÓRICO DO DIÁRIO */}
          {diarySubTab === 'history' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={t.diarySearchPlaceholder}
                  value={diarySearchFilter}
                  onChange={e => setDiarySearchFilter(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="space-y-3">
                {attendance
                  .filter(a => a.studentName.toLowerCase().includes(diarySearchFilter.toLowerCase()) || a.topic.toLowerCase().includes(diarySearchFilter.toLowerCase()))
                  .map(att => (
                    <div key={att.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-xs space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{att.studentName}</span>
                            <span className="text-[11px] text-slate-400">• {att.date}</span>
                          </div>
                          <h5 className="font-semibold text-blue-900 text-xs mt-0.5">{att.topic}</h5>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          att.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : att.status === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {att.status === 'present' ? t.diaryPresent : att.status === 'absent' ? t.diaryAbsent : t.diaryExcused}
                        </span>
                      </div>

                      {att.notes && (
                        <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 italic">
                          "{att.notes}"
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>
                          {t.diaryHomeworkLabel} <strong className={att.homeworkDone ? 'text-emerald-700' : 'text-red-600'}>
                            {att.homeworkDone ? t.diaryHomeworkDone : t.diaryHomeworkPending}
                          </strong>
                        </span>
                        <span>{t.diaryTaughtBy}: {att.teacherName}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: QUADRO DE FREQUÊNCIA GERAL */}
          {diarySubTab === 'roster' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">{t.finTableStudent}</th>
                    <th className="py-3 px-3">{t.diaryTotalClasses}</th>
                    <th className="py-3 px-3">{t.diaryPresent}</th>
                    <th className="py-3 px-3">{t.diaryAbsent}</th>
                    <th className="py-3 px-3">{t.diaryAvgAttendance}</th>
                    <th className="py-3 px-4 text-right">Progresso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(st => {
                    const studentClasses = attendance.filter(a => a.studentId === st.id);
                    const presents = studentClasses.filter(a => a.status === 'present').length;
                    const absences = studentClasses.filter(a => a.status === 'absent').length;
                    const rate = studentClasses.length > 0 ? Math.round((presents / studentClasses.length) * 100) : 100;
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.avatar}
                              alt={st.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{st.name}</div>
                              <div className="text-[11px] text-slate-500">Nível {st.englishLevel || 'B1'}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-semibold text-slate-800">{studentClasses.length}</td>
                        <td className="py-3 px-3 font-semibold text-emerald-700">{presents}</td>
                        <td className="py-3 px-3 font-semibold text-red-600">{absences}</td>
                        <td className="py-3 px-3 font-bold text-[#002868]">{rate}%</td>

                        <td className="py-3 px-4 text-right">
                          <div className="w-36 ml-auto bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${rate >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: FORMS & QUIZ BUILDER (100% TRADUZIDO) */}
      {activeTab === 'forms_builder' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              <span>{t.formsBuilderTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.formsBuilderSubtitle}
            </p>
          </div>

          {formToast && (
            <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{formToast}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form settings & AI generation box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.formTitleLabel} *
                </label>
                <input
                  type="text"
                  placeholder={t.formTitlePlaceholder}
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.formDescLabel}
                </label>
                <textarea
                  rows={2}
                  placeholder={t.formDescPlaceholder}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.formLevelLabel}
                  </label>
                  <select
                    value={formLevel}
                    onChange={e => setFormLevel(e.target.value as EnglishLevel)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="A1">A1 - Beginner</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Independent</option>
                    <option value="C1">C1 - Advanced</option>
                    <option value="C2">C2 - Fluent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.formDueDateLabel}
                  </label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* AI Question Generator Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span>{t.formAiBoxTitle}</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  {t.formAiBoxDesc}
                </p>
                <input
                  type="text"
                  placeholder={t.formAiTopicPlaceholder}
                  value={aiTopicInput}
                  onChange={e => setAiTopicInput(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-blue-200 bg-white"
                />
                <button
                  type="button"
                  onClick={handleGenerateQuestionsWithAI}
                  disabled={isGeneratingAI}
                  className="w-full py-2 bg-[#002868] hover:bg-blue-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {isGeneratingAI ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{isGeneratingAI ? t.formAiGenerating : t.formAiGenerateBtn}</span>
                </button>
              </div>

              <button
                onClick={handlePublishQuiz}
                disabled={!formTitle.trim()}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                {t.formPublishBtn}
              </button>
            </div>

            {/* Questions list & preview */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-sm text-slate-800">
                  {t.formQuestionsAdded} ({formQuestions.length})
                </h4>
                <button
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t.formAddQuestionManual}</span>
                </button>
              </div>

              <div className="space-y-4">
                {formQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-blue-900">
                        Question {idx + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={e => {
                        const updated = [...formQuestions];
                        updated[idx].question = e.target.value;
                        setFormQuestions(updated);
                      }}
                      className="w-full text-xs font-semibold p-2 bg-white rounded-lg border border-slate-200 mb-2"
                    />

                    {q.options && (
                      <div className="space-y-1.5 mt-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2 text-xs">
                            <input
                              type="radio"
                              name={`correct_${q.id}`}
                              checked={q.correctAnswer === String(oIdx)}
                              onChange={() => {
                                const updated = [...formQuestions];
                                updated[idx].correctAnswer = String(oIdx);
                                setFormQuestions(updated);
                              }}
                              className="text-blue-700"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={e => {
                                const updated = [...formQuestions];
                                if (updated[idx].options) {
                                  updated[idx].options![oIdx] = e.target.value;
                                  setFormQuestions(updated);
                                }
                              }}
                              className="flex-1 text-xs px-2 py-1 bg-white rounded-md border border-slate-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: STUDENTS GRID & DETAILS */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#002868]" />
                <span>{t.studentsTitle} ({students.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.studentsSubtitle}
              </p>
            </div>

            <button
              onClick={() => setIsCreatingUser(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.newStudentBtn}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t.searchStudentPlaceholder}
                value={searchStudent}
                onChange={e => setSearchStudent(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="active">{t.active}</option>
              <option value="blocked">{t.blocked}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map(student => {
              const isBlocked = student.monthlyStatus === 'blocked';
              return (
                <div
                  key={student.id}
                  className={`bg-white rounded-2xl border p-5 transition flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isBlocked ? 'border-red-300 bg-red-50/20' : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {student.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {student.email}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        isBlocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isBlocked ? t.blocked : t.active}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">CEFR</span>
                        <span className="font-extrabold text-[#002868] text-sm">{student.englishLevel || 'B1'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">{t.validUntil}</span>
                        <span className="font-semibold text-slate-800">{student.accessExpiryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedStudentDetail(student)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#002868] rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      <span>{t.viewStudentProfile}</span>
                    </button>

                    <button
                      onClick={() => renewStudentAccess(student.id, 30)}
                      className="px-3 py-2 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      title={t.finRenewBtn}
                    >
                      +30d
                    </button>

                    <button
                      onClick={() => toggleStudentBlock(student.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isBlocked
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {isBlocked ? t.finUnblockBtn : t.finBlockBtn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4 animate-fade-in">
          <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
            {t.navSubmissions} ({submissions.length})
          </h3>
          <div className="space-y-3">
            {submissions.map(sub => (
              <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {sub.studentName} • {sub.quizTitle}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {sub.submittedAt}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    sub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sub.scorePercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
