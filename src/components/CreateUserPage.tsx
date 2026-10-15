import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { EnglishLevel, UserRole } from '../types';
import {
  ArrowLeft,
  UserPlus,
  GraduationCap,
  Users,
  DollarSign,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileText
} from 'lucide-react';

import { getTranslation } from '../i18n/translations';

interface CreateUserPageProps {
  initialRole?: 'student' | 'teacher';
  onBack: () => void;
  onSuccess: (newUserId?: string) => void;
}

export const CreateUserPage: React.FC<CreateUserPageProps> = ({
  initialRole = 'student',
  onBack,
  onSuccess
}) => {
  const { createUser, users, language } = useAcademy();
  const t = getTranslation(language);

  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>('B1');
  const [monthlyFee, setMonthlyFee] = useState<number>(290.00);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedTeacherId, setAssignedTeacherId] = useState(
    users.find(u => u.role === 'teacher' || u.role === 'admin')?.id || ''
  );

  const teachers = users.filter(u => u.role === 'teacher' || u.role === 'admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const levelTitles: Record<EnglishLevel, string> = {
      A1: 'A1 - Iniciante',
      A2: 'A2 - Básico Elementar',
      B1: 'B1 - Pré-Intermediário',
      B2: 'B2 - Intermediário Independente',
      C1: 'C1 - Avançado Operacional',
      C2: 'C2 - Fluência Plena & Nativa'
    };

    const newUserData = {
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
      phone: phone.trim() || undefined,
      englishLevel: role === 'student' ? englishLevel : 'C2',
      levelTitle: role === 'student' ? levelTitles[englishLevel] : 'Professor(a) ESL Certificado(a)',
      assignedTeacherId: role === 'student' ? assignedTeacherId : undefined,
      guardianName: role === 'student' ? guardianName.trim() || undefined : undefined,
      guardianEmail: role === 'student' ? guardianEmail.trim() || undefined : undefined,
      guardianPhone: role === 'student' ? guardianPhone.trim() || undefined : undefined,
      monthlyStatus: 'active' as const,
      monthlyFee: role === 'student' ? Number(monthlyFee) : 0,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      accessExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: notes.trim() || undefined
    };

    createUser(newUserData);
    alert(`Novo(a) ${role === 'student' ? 'Aluno(a)' : 'Professor(a)'} cadastrado com sucesso!`);
    onSuccess();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-700" />
          <span>Voltar para Lista de Usuários</span>
        </button>

        <span className="text-xs text-slate-500">
          Formulário de Cadastro Acadêmico Completo
        </span>
      </div>

      {/* Main Page Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full">
              Página de Matrícula & Cadastro
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#002868]" />
              <span>Cadastrar Novo {role === 'student' ? 'Aluno' : 'Professor'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preencha os dados de matrícula, proficiência de inglês, plano financeiro e contatos do responsável
            </p>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                role === 'student' ? 'bg-[#002868] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aluno
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                role === 'teacher' ? 'bg-[#002868] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Professor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: DADOS BÁSICOS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Identificação & Contato</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriela Monteiro Silva"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail de Acesso *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ex: gabriela@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone / WhatsApp do Aluno
                </label>
                <input
                  type="tel"
                  placeholder="+55 11 98888-7777"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professor Tutor Responsável
                  </label>
                  <select
                    value={assignedTeacherId}
                    onChange={e => setAssignedTeacherId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: PROFICIÊNCIA & NÍVEIS DE INGLÊS */}
          {role === 'student' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Nível de Inglês Inicial (Quadro CEFR Americano)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {[
                  { level: 'A1', label: 'Iniciante', desc: 'Frases simples e vocabulário básico' },
                  { level: 'A2', label: 'Básico', desc: 'Diálogos curtos e rotina' },
                  { level: 'B1', label: 'Pré-Interm.', desc: 'Conversação diária independente' },
                  { level: 'B2', label: 'Intermediário', desc: 'Fluência em diversos tópicos' },
                  { level: 'C1', label: 'Avançado', desc: 'Inglês corporativo e acadêmico' },
                  { level: 'C2', label: 'Fluência Plena', desc: 'Domínio nativo e especializado' },
                ].map(item => {
                  const isSelected = englishLevel === item.level;
                  return (
                    <div
                      key={item.level}
                      onClick={() => setEnglishLevel(item.level as EnglishLevel)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        isSelected
                          ? 'border-blue-700 bg-blue-50/80 shadow-xs ring-2 ring-blue-700/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-base text-slate-900">{item.level}</div>
                      <div className="text-xs font-bold text-blue-900 mt-0.5">{item.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-tight">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: MENSALIDADE & CONTROLE DE ACESSO */}
          {role === 'student' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Plano de Mensalidade & Acesso à Plataforma</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Valor da Mensalidade (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={monthlyFee}
                      onChange={e => setMonthlyFee(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    * O aluno receberá 30 dias de acesso inicial liberado no sistema.
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800">Regra de Renovação Mensal:</div>
                  <p className="text-[11px] leading-relaxed">
                    A cada 30 dias, o professor ou administrador confirma o recebimento e renova o acesso por mais 30 dias. Caso não seja renovado, a plataforma bloqueia automaticamente o aluno.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: RESPONSÁVEL LEGAL */}
          {role === 'student' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Dados do Responsável / Parent (Para Dashboard em Tempo Real)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Eduardo Silva"
                    value={guardianName}
                    onChange={e => setGuardianName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone / WhatsApp do Responsável
                  </label>
                  <input
                    type="tel"
                    placeholder="+55 11 99999-8888"
                    value={guardianPhone}
                    onChange={e => setGuardianPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail do Responsável
                  </label>
                  <input
                    type="email"
                    placeholder="carlos.silva@parent.com"
                    value={guardianEmail}
                    onChange={e => setGuardianEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: OBSERVAÇÕES & METAS */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[10px] font-bold">{role === 'student' ? '5' : '2'}</span>
              <span>Observações Iniciais do Professor / Diretor</span>
            </h3>

            <textarea
              rows={3}
              placeholder="Objetivos do aluno (ex: Viagem para os EUA em 6 meses, foco em conversação e listening)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Cadastro de {role === 'student' ? 'Aluno' : 'Professor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
