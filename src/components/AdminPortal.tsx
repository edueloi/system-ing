import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import { User, EnglishLevel, UserRole } from '../types';
import { StudentDetailView } from './StudentDetailView';
import { CreateUserPage } from './CreateUserPage';
import {
  ShieldAlert,
  UserPlus,
  Users,
  DollarSign,
  TrendingUp,
  Cpu,
  Key,
  CheckCircle2,
  RefreshCw,
  Search,
  BookOpen,
  Calendar,
  Sparkles,
  BarChart3,
  Award,
  Zap,
  Check,
  Volume2,
  VolumeX,
  Play,
  LayoutGrid,
  List,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  GraduationCap,
  Clock,
  FileCheck,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { speakEnglish, stopSpeaking } from '../utils/audio';

interface AdminPortalProps {
  activeTab: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ activeTab }) => {
  const {
    currentUser,
    language,
    users,
    createUser,
    updateUserLevel,
    renewStudentAccess,
    toggleStudentBlock,
    addAttendanceRecord,
    aiSettings,
    updateAISettings,
    testAIConnection,
    attendance,
    submissions,
    audioConfig,
    updateAudioConfig,
    availableVoices,
    financials
  } = useAcademy();

  const t = getTranslation(language);

  // Dedicated Page & Subview states
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createUserInitialRole, setCreateUserInitialRole] = useState<'student' | 'teacher'>('student');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search & filter states for students
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState<'all' | EnglishLevel>('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  // Finances screen states
  const [financeSearch, setFinanceSearch] = useState('');
  const [financeStatusFilter, setFinanceStatusFilter] = useState<'all' | 'active' | 'expiring' | 'blocked'>('all');
  const [financeToast, setFinanceToast] = useState('');

  // Class Diary screen states
  const [diarySubTab, setDiarySubTab] = useState<'register' | 'history' | 'roster'>('register');
  const [diaryStudentId, setDiaryStudentId] = useState(users.find(u => u.role === 'student')?.id || '');
  const [diaryDate, setDiaryDate] = useState(new Date().toISOString().split('T')[0]);
  const [diaryStatus, setDiaryStatus] = useState<'present' | 'absent' | 'excused'>('present');
  const [diaryTopic, setDiaryTopic] = useState('');
  const [diaryHomeworkDone, setDiaryHomeworkDone] = useState(true);
  const [diaryNotes, setDiaryNotes] = useState('');
  const [diaryToast, setDiaryToast] = useState('');
  const [diarySearchFilter, setDiarySearchFilter] = useState('');

  // Teachers screen search
  const [teacherSearch, setTeacherSearch] = useState('');

  // Audio test states
  const [adminAudioTestText, setAdminAudioTestText] = useState(
    'Welcome to Eagle English Academy! Today we are practicing American connected speech and idioms.'
  );
  const [isAdminAudioPlaying, setIsAdminAudioPlaying] = useState(false);

  // AI Settings State
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai'>(aiSettings.provider);
  const [aiApiKey, setAiApiKey] = useState(aiSettings.apiKey || '');
  const [aiModelName, setAiModelName] = useState(aiSettings.modelName || 'gemini-2.5-flash');
  const [aiTestPrompt, setAiTestPrompt] = useState(aiSettings.testPrompt || 'Give me 3 American English idioms for teamwork.');
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{ success: boolean; message: string; responseSample?: string } | null>(null);

  const students = users.filter(u => u.role === 'student');
  const activeStudents = students.filter(s => s.monthlyStatus === 'active');
  const blockedStudents = students.filter(s => s.monthlyStatus === 'blocked');
  const teachers = users.filter(u => u.role === 'teacher' || u.role === 'admin');

  // Attendance metrics
  const totalAttendance = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;
  const estimatedMonthlyRevenue = activeStudents.reduce((acc, curr) => acc + (curr.monthlyFee || 290), 0);
  const pendingRevenue = blockedStudents.reduce((acc, curr) => acc + (curr.monthlyFee || 290), 0);

  // Class Diary submission
  const handleSaveDiary = (e: React.FormEvent) => {
    e.preventDefault();
    const st = users.find(u => u.id === diaryStudentId);
    if (!st || !diaryTopic.trim()) return;

    addAttendanceRecord({
      studentId: st.id,
      studentName: st.name,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      date: diaryDate,
      status: diaryStatus,
      topic: diaryTopic.trim(),
      notes: diaryNotes.trim(),
      homeworkDone: diaryHomeworkDone,
      score: 9.5
    });

    setDiaryToast(t.diarySaveSuccess);
    setDiaryTopic('');
    setDiaryNotes('');
    setTimeout(() => setDiaryToast(''), 3000);
  };

  // Quick renewal action
  const handleRenewStudent = (st: User) => {
    renewStudentAccess(st.id, 30);
    const msg = t.finRenewSuccess.replace('{name}', st.name);
    setFinanceToast(msg);
    setTimeout(() => setFinanceToast(''), 3500);
  };

  // Quick block toggle
  const handleToggleBlock = (st: User) => {
    toggleStudentBlock(st.id);
    const msg = t.finBlockedSuccess.replace('{name}', st.name);
    setFinanceToast(msg);
    setTimeout(() => setFinanceToast(''), 3500);
  };

  // Calculate days remaining or expired
  const getDaysRemaining = (expiryDateStr?: string) => {
    if (!expiryDateStr) return { days: 0, isExpired: true, diffDays: -999 };
    const expiry = new Date(expiryDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return {
      days: Math.abs(diffDays),
      isExpired: diffDays < 0,
      diffDays
    };
  };

  const handleTestAI = async () => {
    setIsTestingAI(true);
    setAiTestResult(null);

    updateAISettings({
      provider: aiProvider,
      apiKey: aiApiKey,
      modelName: aiModelName,
      testPrompt: aiTestPrompt
    });

    try {
      const res = await testAIConnection(aiTestPrompt);
      setAiTestResult(res);
    } finally {
      setIsTestingAI(false);
    }
  };

  // Dedicated Page navigation intercept
  if (isCreatingUser) {
    return (
      <CreateUserPage
        initialRole={createUserInitialRole}
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

      {/* VIEW 1: EXECUTIVE DASHBOARD */}
      {(activeTab === 'dashboard' || !activeTab) && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Header Banner */}
          <div className="bg-gradient-to-r from-[#002868] via-[#0A2540] to-[#1E3A8A] rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs bg-red-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  ★ Eagle Executive Portal
                </span>
                <h2 className="text-xl font-bold mt-2">
                  {t.appName}
                </h2>
                <p className="text-xs text-blue-200 mt-0.5">
                  {t.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCreateUserInitialRole('student');
                    setIsCreatingUser(true);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t.newStudentBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>{t.finTotalActive}</span>
                <Users className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {activeStudents.length}
                <span className="text-xs text-slate-400 font-normal ml-1">/ {students.length} {t.all.toLowerCase()}</span>
              </div>
              <div className="text-[11px] text-amber-600 font-medium mt-1">
                {blockedStudents.length} {t.finTotalBlocked.toLowerCase()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>{t.finMonthlyRevenue}</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                R$ {estimatedMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {t.upToDate}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>{t.diaryAvgAttendance}</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {attendanceRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {presentCount} {t.diaryPresent.toLowerCase()} / {totalAttendance} {t.diaryTotalClasses.toLowerCase()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>{t.teachersTitle}</span>
                <Award className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {teachers.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {t.roleTeacher} ESL
              </div>
            </div>
          </div>

          {/* Quick Access Block Alert Box */}
          {blockedStudents.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-red-900">
                    {t.blockedBannerTitle}: {blockedStudents.length} {t.roleStudent.toLowerCase()}(s)
                  </h4>
                  <p className="text-xs text-red-700">
                    {blockedStudents.map(s => s.name).join(', ')}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CEFR Level distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-700" />
              <span>{t.repLevelDistribution}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as EnglishLevel[]).map(lvl => {
                const count = students.filter(s => s.englishLevel === lvl).length;
                return (
                  <div key={lvl} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="font-extrabold text-base text-[#002868]">{lvl}</span>
                    <div className="text-xs font-bold text-slate-800 mt-1">{count} {t.roleStudent.toLowerCase()}</div>
                    <div className="text-[10px] text-slate-400">
                      {Math.round((count / (students.length || 1)) * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GESTÃO DE ALUNOS (SEPARADO EM GRID) */}
      {(activeTab === 'students' || activeTab === 'users') && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Action Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#002868]" />
                <span>{t.studentsTitle} ({students.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                {t.studentsSubtitle}
              </p>
            </div>

            <button
              onClick={() => {
                setCreateUserInitialRole('student');
                setIsCreatingUser(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.newStudentBtn}</span>
            </button>
          </div>

          {/* Search, Filter Toolbar & View Mode */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t.searchStudentPlaceholder}
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* CEFR Level filter */}
              <select
                value={studentLevelFilter}
                onChange={e => setStudentLevelFilter(e.target.value as any)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="all">{t.allLevels}</option>
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Independent</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Fluent</option>
              </select>

              {/* Status filter */}
              <select
                value={studentStatusFilter}
                onChange={e => setStudentStatusFilter(e.target.value as any)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="all">{t.allStatuses}</option>
                <option value="active">{t.active}</option>
                <option value="blocked">{t.blocked}</option>
              </select>

              {/* Grid / Table toggle */}
              <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#002868] text-white' : 'text-slate-500'
                  }`}
                  title="Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === 'table' ? 'bg-[#002868] text-white' : 'text-slate-500'
                  }`}
                  title="List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Students Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {students
                .filter(s => {
                  const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase());
                  const matchLevel = studentLevelFilter === 'all' || s.englishLevel === studentLevelFilter;
                  const matchStatus = studentStatusFilter === 'all' || s.monthlyStatus === studentStatusFilter;
                  return matchSearch && matchLevel && matchStatus;
                })
                .map(student => {
                  const isBlocked = student.monthlyStatus === 'blocked';
                  const daysInfo = getDaysRemaining(student.accessExpiryDate);
                  return (
                    <div
                      key={student.id}
                      className={`bg-white rounded-2xl border p-5 transition flex flex-col justify-between shadow-xs hover:shadow-md ${
                        isBlocked ? 'border-red-300 bg-red-50/20' : 'border-slate-200/90'
                      }`}
                    >
                      <div>
                        {/* Header Avatar & Status */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 truncate" title={student.name}>
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

                        {/* Level & Access Info Box */}
                        <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">CEFR</span>
                            <span className="font-extrabold text-[#002868] text-sm">{student.englishLevel || 'B1'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">{t.validUntil}</span>
                            <span className={`font-semibold ${isBlocked ? 'text-red-700 font-bold' : 'text-slate-800'}`}>
                              {student.accessExpiryDate}
                            </span>
                          </div>
                        </div>

                        {/* Countdown Pill */}
                        <div className="mt-2 text-[11px]">
                          {isBlocked ? (
                            <span className="text-red-700 font-semibold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{t.expiredDaysAgo} {daysInfo.days} {t.days}</span>
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{t.expiringIn} {daysInfo.days} {t.days}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedStudentDetail(student)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#002868] rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-700" />
                          <span>{t.viewStudentProfile}</span>
                        </button>

                        <button
                          onClick={() => handleRenewStudent(student)}
                          className="px-3 py-2 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                          title={t.finRenewBtn}
                        >
                          +30d
                        </button>

                        <button
                          onClick={() => handleToggleBlock(student)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isBlocked
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                          title={isBlocked ? t.finUnblockBtn : t.finBlockBtn}
                        >
                          {isBlocked ? t.finUnblockBtn : t.finBlockBtn}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            /* Students Table View */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">{t.finTableStudent}</th>
                    <th className="py-3 px-3">CEFR</th>
                    <th className="py-3 px-3">{t.finTableStatus}</th>
                    <th className="py-3 px-3">{t.finTableExpiry}</th>
                    <th className="py-3 px-4 text-right">{t.finTableActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(s => {
                      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase());
                      const matchLevel = studentLevelFilter === 'all' || s.englishLevel === studentLevelFilter;
                      const matchStatus = studentStatusFilter === 'all' || s.monthlyStatus === studentStatusFilter;
                      return matchSearch && matchLevel && matchStatus;
                    })
                    .map(student => {
                      const isBlocked = student.monthlyStatus === 'blocked';
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{student.name}</div>
                                <div className="text-[11px] text-slate-500">{student.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-bold text-[#002868]">
                            {student.englishLevel || 'B1'}
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isBlocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isBlocked ? t.blocked : t.active}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-700 font-semibold">
                            {student.accessExpiryDate}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedStudentDetail(student)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{t.viewStudentProfile}</span>
                              </button>
                              <button
                                onClick={() => handleRenewStudent(student)}
                                className="px-2.5 py-1.5 bg-[#002868] text-white rounded-lg text-xs font-bold hover:bg-blue-900 cursor-pointer"
                              >
                                +30d
                              </button>
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

      {/* VIEW 3: CORPO DOCENTE / PROFESSORES (SEPARADO EM GRID) */}
      {activeTab === 'teachers' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                <span>{t.teachersTitle} ({teachers.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                {t.teachersSubtitle}
              </p>
            </div>

            <button
              onClick={() => {
                setCreateUserInitialRole('teacher');
                setIsCreatingUser(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.newTeacherBtn}</span>
            </button>
          </div>

          <div className="relative max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t.searchTeacherPlaceholder}
              value={teacherSearch}
              onChange={e => setTeacherSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers
              .filter(tc => tc.name.toLowerCase().includes(teacherSearch.toLowerCase()) || tc.email.toLowerCase().includes(teacherSearch.toLowerCase()))
              .map(teacher => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          {teacher.role === 'admin' ? t.roleAdmin : t.roleTeacher}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                          {teacher.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {teacher.email}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <div className="font-bold text-slate-800">{teacher.levelTitle || 'Certified ESL Instructor'}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Status: <strong className="text-emerald-700">{t.active}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{teacher.createdAt}</span>
                    {teacher.phone && (
                      <a
                        href={`https://wa.me/${teacher.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-bold flex items-center gap-1 hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VIEW 4: TEAL DE MENSALIDADES E ACESSO (SUPER MELHORADA) */}
      {activeTab === 'finances' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>{t.financesTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.financesSubtitle}
            </p>
          </div>

          {/* Feedback Toast */}
          {financeToast && (
            <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{financeToast}</span>
            </div>
          )}

          {/* 4 Financial Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.finTotalActive}</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {activeStudents.length}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">{t.upToDate}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.finTotalBlocked}</span>
              <div className="text-2xl font-bold text-red-600 mt-1">
                {blockedStudents.length}
              </div>
              <span className="text-[11px] text-red-600 font-medium">{t.pendingRenewal}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.finMonthlyRevenue}</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                R$ {estimatedMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-400">Mensalidades confirmadas</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.finPendingAmount}</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                R$ {pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-amber-600 font-medium">Aguardando pagamento</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t.finSearchPlaceholder}
                value={financeSearch}
                onChange={e => setFinanceSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: t.finFilterAll },
                { id: 'active', label: t.finFilterActive },
                { id: 'expiring', label: t.finFilterExpiring },
                { id: 'blocked', label: t.finFilterBlocked },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFinanceStatusFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    financeStatusFilter === f.id
                      ? 'bg-[#002868] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tuition Management Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t.finTableStudent}</th>
                  <th className="py-3 px-3">{t.finTablePlan}</th>
                  <th className="py-3 px-3">{t.finTableLastPayment}</th>
                  <th className="py-3 px-3">{t.finTableExpiry}</th>
                  <th className="py-3 px-3">{t.finTableStatus}</th>
                  <th className="py-3 px-4 text-right">{t.finTableActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students
                  .filter(st => {
                    const matchSearch = st.name.toLowerCase().includes(financeSearch.toLowerCase()) || st.email.toLowerCase().includes(financeSearch.toLowerCase());
                    const daysInfo = getDaysRemaining(st.accessExpiryDate);
                    let matchStatus = true;
                    if (financeStatusFilter === 'active') matchStatus = st.monthlyStatus === 'active';
                    if (financeStatusFilter === 'blocked') matchStatus = st.monthlyStatus === 'blocked';
                    if (financeStatusFilter === 'expiring') matchStatus = st.monthlyStatus === 'active' && daysInfo.diffDays <= 7;
                    return matchSearch && matchStatus;
                  })
                  .map(st => {
                    const isBlocked = st.monthlyStatus === 'blocked';
                    const daysInfo = getDaysRemaining(st.accessExpiryDate);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.avatar}
                              alt={st.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{st.name}</div>
                              <div className="text-[11px] text-slate-500">{st.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-bold text-slate-900">
                          R$ {st.monthlyFee?.toFixed(2) || '290.00'}
                        </td>

                        <td className="py-3 px-3 text-slate-600">
                          {st.lastPaymentDate || '2026-10-01'}
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{st.accessExpiryDate}</div>
                          <div className="text-[10px] mt-0.5">
                            {isBlocked ? (
                              <span className="text-red-600 font-bold">{t.expiredDaysAgo} {daysInfo.days} {t.days}</span>
                            ) : daysInfo.diffDays <= 3 ? (
                              <span className="text-amber-600 font-bold">{t.expiringIn} {daysInfo.days} {t.days}!</span>
                            ) : (
                              <span className="text-emerald-700 font-medium">{t.expiringIn} {daysInfo.days} {t.days}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isBlocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isBlocked ? t.blocked : t.upToDate}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRenewStudent(st)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#002868] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                              title={t.finRenewBtn}
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>{t.finRenewBtn}</span>
                            </button>

                            <button
                              onClick={() => handleToggleBlock(st)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                isBlocked
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              }`}
                            >
                              {isBlocked ? t.finUnblockBtn : t.finBlockBtn}
                            </button>

                            {st.phone && (
                              <a
                                href={`https://wa.me/${st.phone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(st.name)},%20lembramos%20que%20sua%20mensalidade%20da%20Eagle%20English%20Academy%20vence%20em%20breve.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                title={t.finSendWhatsApp}
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Recent Payment Transactions Log */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>{t.finRenewalHistoryTitle}</span>
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {financials.map(fn => (
                <div key={fn.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900">{fn.studentName}</strong>
                    <span className="text-slate-400 text-[11px] ml-2">{fn.date} • {fn.receiptCode || 'REC-CONFIRMED'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700">R$ {fn.amount.toFixed(2)}</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                      Confirmado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: DIÁRIO DE AULAS (SUPER MELHORADA) */}
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
          {diaryToast && (
            <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{diaryToast}</span>
            </div>
          )}

          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.diaryTotalClasses}</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{attendance.length}</div>
              <span className="text-[11px] text-slate-400">Total acumulado no sistema</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.diaryAvgAttendance}</span>
              <div className="text-2xl font-bold text-blue-900 mt-1">{attendanceRate}%</div>
              <span className="text-[11px] text-emerald-600 font-medium">{presentCount} aulas assistidas</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t.diaryHomeworkRate}</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {attendance.length > 0 ? Math.round((attendance.filter(a => a.homeworkDone).length / attendance.length) * 100) : 100}%
              </div>
              <span className="text-[11px] text-slate-400">Entrega de exercícios</span>
            </div>
          </div>

          {/* SUB-TAB 1: REGISTRAR NOVA AULA */}
          {diarySubTab === 'register' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t.diaryTabRegister}</h4>
                  <p className="text-xs text-slate-500">{t.diarySubtitle}</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-900 font-bold px-3 py-1 rounded-full border border-blue-200">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <form onSubmit={handleSaveDiary} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Student */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.diarySelectStudent} *
                    </label>
                    <select
                      value={diaryStudentId}
                      onChange={e => setDiaryStudentId(e.target.value)}
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

                  {/* Class Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.diaryClassDate} *
                    </label>
                    <input
                      type="date"
                      value={diaryDate}
                      onChange={e => setDiaryDate(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Attendance Status Selector */}
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
                        onClick={() => setDiaryStatus(st.id as any)}
                        className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                          diaryStatus === st.id ? `${st.color} shadow-xs ring-2 ring-current/20` : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic / Content */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.diaryTopic} *
                  </label>
                  <input
                    type="text"
                    value={diaryTopic}
                    onChange={e => setDiaryTopic(e.target.value)}
                    placeholder={t.diaryTopicPlaceholder}
                    required
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />

                  {/* Suggested Quick Topics */}
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
                        onClick={() => setDiaryTopic(tp)}
                        className="text-[10px] bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 px-2 py-0.5 rounded-lg border border-slate-200 transition cursor-pointer"
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Homework Toggle */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{t.diaryHomework}</span>
                    <span className="text-[11px] text-slate-500">
                      {diaryHomeworkDone ? t.diaryHomeworkDone : t.diaryHomeworkPending}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={diaryHomeworkDone}
                    onChange={e => setDiaryHomeworkDone(e.target.checked)}
                    className="w-5 h-5 accent-[#002868] cursor-pointer"
                  />
                </div>

                {/* Teacher Pedagogical Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.diaryNotes}
                  </label>
                  <textarea
                    rows={3}
                    value={diaryNotes}
                    onChange={e => setDiaryNotes(e.target.value)}
                    placeholder={t.diaryNotesPlaceholder}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white resize-none"
                  />
                </div>

                {/* Save button */}
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
                    <th className="py-3 px-4 text-right">Barra de Progresso</th>
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

      {/* VIEW 6: CONFIGURAÇÃO DE IA */}
      {activeTab === 'ai_settings' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-5 animate-fade-in">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-red-600" />
              <span>{t.aiTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.aiSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.apiProvider}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAiProvider('gemini');
                      setAiModelName('gemini-2.5-flash');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      aiProvider === 'gemini'
                        ? 'border-blue-700 bg-blue-50 text-blue-900 ring-2 ring-blue-700/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>Google Gemini AI</span>
                    {aiProvider === 'gemini' && <Check className="w-4 h-4 text-blue-700" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAiProvider('openai');
                      setAiModelName('gpt-4o-mini');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      aiProvider === 'openai'
                        ? 'border-blue-700 bg-blue-50 text-blue-900 ring-2 ring-blue-700/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>ChatGPT (OpenAI)</span>
                    {aiProvider === 'openai' && <Check className="w-4 h-4 text-blue-700" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.modelName}
                </label>
                <input
                  type="text"
                  value={aiModelName}
                  onChange={e => setAiModelName(e.target.value)}
                  placeholder={aiProvider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini'}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.apiKeyLabel}
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={aiApiKey}
                    onChange={e => setAiApiKey(e.target.value)}
                    placeholder={aiProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.testPrompt}
                </label>
                <textarea
                  rows={2}
                  value={aiTestPrompt}
                  onChange={e => setAiTestPrompt(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleTestAI}
                disabled={isTestingAI}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                {isTestingAI ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{isTestingAI ? t.testing : t.testConnection}</span>
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 flex flex-col justify-between font-mono text-xs shadow-inner">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span>{t.diagnosticTerminal}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Ready
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-slate-300">
                  <p className="text-slate-500">$ checking provider credentials...</p>
                  <p>Provider: <span className="text-blue-400 font-bold">{aiProvider.toUpperCase()}</span></p>
                  <p>Model: <span className="text-amber-400 font-bold">{aiModelName}</span></p>
                  
                  {aiTestResult && (
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{aiTestResult.message}</span>
                      </div>
                      <pre className="text-[11px] text-slate-300 whitespace-pre-wrap bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        {aiTestResult.responseSample}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-800">
                Eagle AI Gateway v2.5 • Unified LLM Engine
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 7: RELATÓRIOS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-5 animate-fade-in">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-800" />
              <span>{t.reportsTitle}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {t.reportsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">{t.repTotalQuizzes}</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{submissions.length}</div>
              <p className="text-[11px] text-emerald-600 mt-1">100% {t.formPublishSuccess.slice(0, 20)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">{t.repTotalHomeworks}</span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {attendance.filter(a => a.homeworkDone).length} / {attendance.length}
              </div>
              <p className="text-[11px] text-blue-700 mt-1">
                {attendance.length > 0 ? Math.round((attendance.filter(a => a.homeworkDone).length / attendance.length) * 100) : 100}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold">{t.repTotalClasses}</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{attendance.length}</div>
              <p className="text-[11px] text-slate-500 mt-1">{t.diaryTitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 8: VOZES & ÁUDIO */}
      {activeTab === 'audio' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6 animate-fade-in">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#002868]" />
                <span>{t.navAudio}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.tagline}
              </p>
            </div>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {availableVoices.length} voices
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Voice Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'us_female', name: 'US Female Natural', desc: 'Friendly conversational tone.', speed: 0.95, pitch: 1.05 },
                    { id: 'us_male', name: 'US Male Business', desc: 'Crisp articulation for corporate English.', speed: 0.95, pitch: 0.95 },
                    { id: 'esl_coach_slow', name: 'ESL Coach (0.8x Slow)', desc: 'Clear pronunciation for beginner learners.', speed: 0.8, pitch: 1.0 },
                    { id: 'native_fast', name: 'Fluent Native (1.1x)', desc: 'Natural fast connected speech.', speed: 1.1, pitch: 1.0 },
                  ].map(p => {
                    const isSelected = audioConfig.preset === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => updateAudioConfig({ preset: p.id as any, speed: p.speed, pitch: p.pitch })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          isSelected ? 'border-blue-700 bg-blue-50/70 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                          <span>{p.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-700" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{p.desc}</p>
                        <div className="text-[10px] text-blue-900 font-semibold mt-1.5">
                          {p.speed}x • Pitch {p.pitch}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Browser Speech Synthesis Voice
                </label>
                <select
                  value={audioConfig.selectedVoiceName || ''}
                  onChange={e => updateAudioConfig({ selectedVoiceName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="">Auto Native English Voice</option>
                  {availableVoices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Speed</span>
                    <strong className="text-blue-900">{audioConfig.speed.toFixed(2)}x</strong>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.4"
                    step="0.05"
                    value={audioConfig.speed}
                    onChange={e => updateAudioConfig({ speed: parseFloat(e.target.value) })}
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Pitch</span>
                    <strong className="text-blue-900">{audioConfig.pitch.toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={audioConfig.pitch}
                    onChange={e => updateAudioConfig({ pitch: parseFloat(e.target.value) })}
                    className="w-full accent-blue-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-blue-700" />
                  <span>Pronunciation Audio Test</span>
                </h4>
                <p className="text-xs text-slate-500 mb-2">
                  Test the audio playback in real-time with selected voice settings:
                </p>

                <textarea
                  rows={4}
                  value={adminAudioTestText}
                  onChange={e => setAdminAudioTestText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white resize-none"
                />

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminAudioPlaying(true);
                      speakEnglish(adminAudioTestText, audioConfig, () => setIsAdminAudioPlaying(false));
                    }}
                    className="flex-1 py-2.5 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isAdminAudioPlaying ? 'Playing Audio...' : 'Play Audio'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      setIsAdminAudioPlaying(false);
                    }}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                Connected Speech & Phonetics ESL Lab
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
