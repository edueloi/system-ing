import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import { User, EnglishLevel, FormQuiz } from '../types';
import {
  ArrowLeft,
  GraduationCap,
  Award,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  FileText,
  DollarSign,
  Phone,
  Mail,
  RefreshCw,
  PlusCircle,
  MessageCircle,
  Flame,
  Sparkles,
  Clock,
  BookOpen,
  UserCheck,
  Send,
  Check
} from 'lucide-react';

interface StudentDetailViewProps {
  student: User;
  onBack: () => void;
}

export const StudentDetailView: React.FC<StudentDetailViewProps> = ({ student, onBack }) => {
  const {
    quizzes,
    submissions,
    attendance,
    studentBadges,
    badges,
    updateUserLevel,
    renewStudentAccess,
    toggleStudentBlock,
    addAttendanceRecord,
    currentUser,
    language
  } = useAcademy();

  const t = getTranslation(language);

  const [activeTab, setActiveTab] = useState<'overview' | 'quizzes' | 'attendance' | 'finances' | 'guardian'>('overview');

  // Quick class log for this student
  const [showQuickAttendance, setShowQuickAttendance] = useState(false);
  const [quickDate, setQuickDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickStatus, setQuickStatus] = useState<'present' | 'absent' | 'excused'>('present');
  const [quickTopic, setQuickTopic] = useState('');
  const [quickNotes, setQuickNotes] = useState('');
  const [quickHw, setQuickHw] = useState(true);

  // Quick assign test to this student
  const [showAssignQuiz, setShowAssignQuiz] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(quizzes[0]?.id || '');
  const [assignSuccessMsg, setAssignSuccessMsg] = useState('');

  // Attendance metrics
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const totalClasses = studentAttendance.length;
  const presents = studentAttendance.filter(a => a.status === 'present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presents / totalClasses) * 100) : 100;

  // Quizzes taken by this student
  const studentSubmissions = submissions.filter(s => s.studentId === student.id);

  // Badges of this student
  const myUnlockedBadgeIds = new Set(
    studentBadges.filter(b => b.studentId === student.id).map(b => b.badgeId)
  );
  const studentBadgesList = badges.filter(b => myUnlockedBadgeIds.has(b.id));

  const isBlocked = student.monthlyStatus === 'blocked';

  const handleSaveQuickAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTopic.trim()) return;

    addAttendanceRecord({
      studentId: student.id,
      studentName: student.name,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      date: quickDate,
      status: quickStatus,
      topic: quickTopic,
      notes: quickNotes,
      homeworkDone: quickHw,
      score: 9.0
    });

    setQuickTopic('');
    setQuickNotes('');
    setShowQuickAttendance(false);
    alert('Aula e presença registradas com sucesso no diário do aluno!');
  };

  const handleAssignQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const quiz = quizzes.find(q => q.id === selectedQuizId);
    if (!quiz) return;

    setAssignSuccessMsg(`Atividade "${quiz.title}" atribuída ao aluno ${student.name}!`);
    setTimeout(() => {
      setAssignSuccessMsg('');
      setShowAssignQuiz(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-700" />
          <span>Voltar para Lista de Usuários</span>
        </button>

        <div className="text-xs text-slate-500">
          ID do Aluno: <code className="bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-700">{student.id}</code>
        </div>
      </div>

      {/* Student Profile Hero Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-100 shadow-md ring-2 ring-blue-700/20 shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                {isBlocked ? (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-0.5 rounded-full text-xs font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    Acesso Bloqueado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Acesso Ativo
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {student.email}
                </span>
                {student.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {student.phone}
                  </span>
                )}
                <span>
                  Vencimento do Acesso: <strong className="text-slate-800">{student.accessExpiryDate}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Control Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Level Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 pl-1">Nível:</span>
              <select
                value={student.englishLevel || 'B1'}
                onChange={e => updateUserLevel(student.id, e.target.value as EnglishLevel)}
                className="font-extrabold text-xs px-2.5 py-1 rounded-lg bg-[#002868] text-white border-0 cursor-pointer"
              >
                <option value="A1">A1 - Iniciante</option>
                <option value="A2">A2 - Básico</option>
                <option value="B1">B1 - Pré-Intermediário</option>
                <option value="B2">B2 - Intermediário</option>
                <option value="C1">C1 - Avançado</option>
                <option value="C2">C2 - Fluência Plena</option>
              </select>
            </div>

            {/* Renew 30 Days */}
            <button
              onClick={() => renewStudentAccess(student.id, 30)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-200" />
              <span>Renovar +30 Dias</span>
            </button>

            {/* Block / Unblock Toggle */}
            <button
              onClick={() => toggleStudentBlock(student.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isBlocked
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {isBlocked ? 'Desbloquear Acesso' : 'Bloquear Acesso'}
            </button>

            {student.phone && (
              <a
                href={`https://wa.me/${student.phone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(student.name)},%20sou%20seu%20professor%20da%20Eagle%20English%20Academy.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: t.navOverview, icon: GraduationCap },
            { id: 'quizzes', label: `${t.navForms} (${studentSubmissions.length})`, icon: FileText },
            { id: 'attendance', label: `${t.diaryTitle.split('&')[0].trim()} (${studentAttendance.length})`, icon: UserCheck },
            { id: 'finances', label: t.navFinances, icon: DollarSign },
            { id: 'guardian', label: t.roleGuardian, icon: Phone },
          ].map(tb => {
            const Icon = tb.icon;
            const isActive = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#002868] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT 1: OVERVIEW & ENGLISH LEVEL */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Level CEFR Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>Nível de Proficiência Atual do Aluno</span>
              </h3>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-base text-[#002868]">
                    CEFR: {student.englishLevel} ({student.levelTitle || 'Estudante'})
                  </span>
                  <span className="text-xs bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                    ESL American Standard
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  O aluno possui vocabulário para conversações situacionais, pequenas negociações e compreensão de áudios com connected speech.
                </p>
              </div>

              {/* Progress metrics */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                  <div className="text-lg font-bold text-blue-900">{attendanceRate}%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Frequência</div>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                  <div className="text-lg font-bold text-amber-700 flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{student.streakDays}d</span>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Ofensiva</div>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <div className="text-lg font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{student.xpPoints}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Pontos XP</div>
                </div>
              </div>
            </div>

            {/* Badges unlocked */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Medalhas Conquistadas ({studentBadgesList.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studentBadgesList.map(b => (
                  <div key={b.id} className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                      ★
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{b.title}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: Teacher Notes */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
                Observações Pedagógicas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {student.notes || 'Nenhuma observação registrada para este aluno.'}
              </p>

              <button
                onClick={() => setShowQuickAttendance(true)}
                className="w-full py-2 bg-[#002868] hover:bg-blue-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Registrar Aula de Hoje</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: QUIZZES & FORMS (APLICAR ATIVIDADES) */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Atividades & Formulários Aplicados a este Aluno</span>
              </h3>
              <p className="text-xs text-slate-500">
                Histórico de testes respondidos e ferramenta para aplicar novas tarefas individualmente
              </p>
            </div>

            <button
              onClick={() => setShowAssignQuiz(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Aplicar Nova Atividade</span>
            </button>
          </div>

          {assignSuccessMsg && (
            <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>{assignSuccessMsg}</span>
            </div>
          )}

          {/* Assign Quiz Box (if open) */}
          {showAssignQuiz && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Selecione o Formulário para Atribuir a {student.name}
                </h4>
                <button
                  onClick={() => setShowAssignQuiz(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                >
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleAssignQuiz} className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedQuizId}
                  onChange={e => setSelectedQuizId(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.title} ({q.level}) - {q.questions.length} questões
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Enviar para o Aluno
                </button>
              </form>
            </div>
          )}

          {/* Submissions list */}
          <div className="space-y-3">
            {studentSubmissions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                O aluno ainda não respondeu nenhum teste ou formulário. Clique em "Aplicar Nova Atividade" acima para enviar uma tarefa.
              </div>
            ) : (
              studentSubmissions.map(sub => (
                <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{sub.quizTitle}</h4>
                      <span className="text-[11px] text-slate-400">Entregue em: {sub.submittedAt}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      sub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Nota: {sub.scorePercentage}%
                    </span>
                  </div>

                  {sub.teacherFeedback && (
                    <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 mt-2">
                      <strong>Feedback do Professor:</strong> {sub.teacherFeedback}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ATTENDANCE & CLASS LOG */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#002868]" />
                <span>Histórico Completo de Frequência & Diário de Aulas</span>
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhe presenças, faltas, tópicos ministrados e lições de casa
              </p>
            </div>
            <button
              onClick={() => setShowQuickAttendance(!showQuickAttendance)}
              className="px-4 py-2 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Nova Presença</span>
            </button>
          </div>

          {/* Quick attendance form drawer */}
          {showQuickAttendance && (
            <form onSubmit={handleSaveQuickAttendance} className="bg-slate-50 p-5 rounded-2xl border border-slate-300 space-y-3 animate-fade-in">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Registrar Diário de Aula para {student.name}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={quickDate}
                    onChange={e => setQuickDate(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Presença</label>
                  <select
                    value={quickStatus}
                    onChange={e => setQuickStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="present">Presente</option>
                    <option value="absent">Falta</option>
                    <option value="excused">Falta Justificada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dever de Casa</label>
                  <div className="flex items-center gap-2 pt-1.5">
                    <input
                      type="checkbox"
                      checked={quickHw}
                      onChange={e => setQuickHw(e.target.checked)}
                      className="w-4 h-4 text-blue-700 rounded-md"
                    />
                    <span className="text-xs text-slate-700 font-medium">Entregue com sucesso</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tema da Aula</label>
                <input
                  type="text"
                  placeholder="Ex: Conversation Unit 5 - American Idioms & Slang"
                  value={quickTopic}
                  onChange={e => setQuickTopic(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Observações do Aluno</label>
                <textarea
                  placeholder="Pontos de melhoria, erros de pronúncia corrigidos..."
                  rows={2}
                  value={quickNotes}
                  onChange={e => setQuickNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAttendance(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002868] text-white rounded-xl text-xs font-bold hover:bg-blue-900"
                >
                  Salvar Presença
                </button>
              </div>
            </form>
          )}

          {/* Attendance History */}
          <div className="space-y-3">
            {studentAttendance.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                Nenhuma aula registrada ainda para este aluno.
              </div>
            ) : (
              studentAttendance.map(att => (
                <div key={att.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {att.date} • {att.topic}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      att.status === 'present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : att.status === 'absent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {att.status === 'present' ? 'Presente' : att.status === 'absent' ? 'Falta' : 'Justificada'}
                    </span>
                  </div>

                  {att.notes && (
                    <div className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic">
                      "{att.notes}"
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      Dever de Casa: <strong className={att.homeworkDone ? 'text-emerald-700' : 'text-red-600'}>
                        {att.homeworkDone ? 'Entregue ✓' : 'Pendente ✕'}
                      </strong>
                    </span>
                    <span>Prof: {att.teacherName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: FINANCES & MONTHLY ACCESS */}
      {activeTab === 'finances' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Controle de Mensalidades & Ciclos de Acesso</span>
            </h3>
            <p className="text-xs text-slate-500">
              O acesso aos materiais e testes é renovado a cada mês pelo professor ou financeiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Valor da Mensalidade</span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                R$ {student.monthlyFee?.toFixed(2) || '290.00'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Último Pagamento</span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {student.lastPaymentDate}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">Acesso Válido Até</span>
              <div className={`text-xl font-bold mt-1 ${isBlocked ? 'text-red-600' : 'text-emerald-700'}`}>
                {student.accessExpiryDate}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={() => renewStudentAccess(student.id, 30)}
              className="px-5 py-2.5 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Confirmar Pagamento e Renovar Acesso (+30 Dias)</span>
            </button>

            <button
              onClick={() => toggleStudentBlock(student.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isBlocked
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {isBlocked ? 'Desbloquear Aluno' : 'Bloquear Acesso'}
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: GUARDIAN */}
      {activeTab === 'guardian' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-700" />
              <span>Responsável Legal Cadastrado</span>
            </h3>
            <p className="text-xs text-slate-500">
              Informações de contato do pai, mãe ou tutor legal do aluno
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 max-w-lg text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Nome do Responsável:</span>
              <strong className="text-slate-900">{student.guardianName || 'Não informado'}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Telefone / WhatsApp:</span>
              <strong className="text-slate-900">{student.guardianPhone || 'Não informado'}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">E-mail de Notificação:</span>
              <strong className="text-slate-900">{student.guardianEmail || student.email}</strong>
            </div>
          </div>

          {student.guardianPhone && (
            <a
              href={`https://wa.me/${student.guardianPhone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(student.guardianName || 'Responsável')},%20falamos%20da%20Eagle%20English%20Academy%20sobre%20o(a)%20aluno(a)%20${encodeURIComponent(student.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Mensagem no WhatsApp do Responsável</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};
