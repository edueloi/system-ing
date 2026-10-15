import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import {
  Users,
  CheckCircle2,
  Calendar,
  Award,
  DollarSign,
  MessageCircle,
  FileText,
  Clock,
  Sparkles,
  BookOpen,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const GuardianPortal: React.FC = () => {
  const { currentUser, language, users, attendance, submissions } = useAcademy();
  const t = getTranslation(language);

  // Default to student linked or first student
  const students = users.filter(u => u.role === 'student');
  const [selectedStudentId, setSelectedStudentId] = useState(
    students[0]?.id || ''
  );

  const student = users.find(u => u.id === selectedStudentId) || students[0];

  if (!student) {
    return <div>Nenhum aluno cadastrado.</div>;
  }

  // Student metrics
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const totalClasses = studentAttendance.length;
  const presents = studentAttendance.filter(a => a.status === 'present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presents / totalClasses) * 100) : 100;

  const studentSubmissions = submissions.filter(s => s.studentId === student.id);
  const avgGrade =
    studentSubmissions.length > 0
      ? Math.round(
          studentSubmissions.reduce((acc, c) => acc + c.scorePercentage, 0) / studentSubmissions.length
        )
      : 95;

  const isBlocked = student.monthlyStatus === 'blocked';

  return (
    <div className="space-y-6">
      {/* Guardian Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900">
              {t.guardianTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.guardianSubtitle}
            </p>
          </div>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            {t.selectStudent}:
          </label>
          <select
            value={student.id}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white text-blue-900 shadow-2xs"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.englishLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{t.attendanceRate}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {attendanceRate}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {presents} presenças em {totalClasses} aulas
          </p>
        </div>

        {/* English Level CEFR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{t.myLevel}</span>
            <Award className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-[#002868]">
            {student.englishLevel || 'B1'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {student.levelTitle || 'Pré-Intermediário'}
          </p>
        </div>

        {/* Average Grade */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Média das Avaliações</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {avgGrade}%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Excelente aproveitamento
          </p>
        </div>

        {/* Monthly Tuition Status */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{t.financialStatus}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`text-sm font-bold mt-1 ${isBlocked ? 'text-red-600' : 'text-emerald-700'}`}>
            {isBlocked ? 'Pendente de Renovação' : 'Em Dia (Ativo)'}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Válido até: <strong className="text-slate-800">{student.accessExpiryDate}</strong>
          </p>
        </div>
      </div>

      {/* Main Grid: Class Attendance Log & Teacher Feedbacks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance & Homework Log (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#002868]" />
              <span>Diário de Aulas & Frequência de {student.name}</span>
            </h3>
            <span className="text-xs text-slate-500">
              {studentAttendance.length} aulas registradas
            </span>
          </div>

          <div className="space-y-3">
            {studentAttendance.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Nenhuma aula registrada ainda.</p>
            ) : (
              studentAttendance.map(att => (
                <div key={att.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {att.date} • {att.topic}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
                    <div className="mt-2 text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                      <strong>Observação do Professor:</strong> "{att.notes}"
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Dever de Casa: <strong className={att.homeworkDone ? 'text-emerald-700' : 'text-red-600'}>
                        {att.homeworkDone ? 'Realizado ✓' : 'Não Realizado ✕'}
                      </strong>
                    </span>
                    <span>Prof: {att.teacherName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Direct Contact & Tuition Info */}
        <div className="space-y-6">
          {/* Tuition Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="font-bold text-xs md:text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Controle da Mensalidade</span>
            </h3>

            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Valor:</span>
                <strong>R$ {student.monthlyFee?.toFixed(2) || '290.00'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Último Pagamento:</span>
                <strong>{student.lastPaymentDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Acesso Ativo Até:</span>
                <strong className={isBlocked ? 'text-red-600' : 'text-emerald-700'}>
                  {student.accessExpiryDate}
                </strong>
              </div>
            </div>

            {isBlocked && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  O acesso às aulas está bloqueado aguardando renovação da mensalidade.
                </span>
              </div>
            )}

            <a
              href={`https://wa.me/5511987654321?text=Olá,%20sou%20responsável%20pelo(a)%20aluno(a)%20${encodeURIComponent(student.name)}%20e%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20as%20aulas.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar com o Professor no WhatsApp</span>
            </a>
          </div>

          {/* Pedagogy Note */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200 text-xs text-blue-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>Metodologia Imersiva Eagle</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Nosso sistema utiliza padrões da escala CEFR para garantir que cada aluno evolua de forma sólida na conversação, listening e gramática americana.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
