import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import { Language, UserRole } from '../types';
import { 
  GraduationCap, 
  Flame, 
  Sparkles, 
  Globe, 
  UserCheck, 
  ShieldAlert, 
  ChevronDown, 
  Check, 
  Users,
  Settings,
  BookOpen
} from 'lucide-react';

export const Header: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { currentUser, language, setLanguage, users, setCurrentUserById } = useAcademy();
  const t = getTranslation(language);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-xs">Admin / Prof</span>;
      case 'teacher':
        return <span className="bg-blue-700 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-xs">{t.roleTeacher}</span>;
      case 'student':
        return <span className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-xs">{t.roleStudent}</span>;
      case 'guardian':
        return <span className="bg-purple-600 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-xs">{t.roleGuardian}</span>;
    }
  };

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: BookOpen, visible: true },
    { 
      id: 'lessons', 
      label: t.navLessons, 
      icon: GraduationCap, 
      visible: currentUser.role === 'student' || currentUser.role === 'teacher' || currentUser.role === 'admin' 
    },
    { 
      id: 'forms', 
      label: t.navForms, 
      icon: Sparkles, 
      visible: currentUser.role === 'student' || currentUser.role === 'teacher' || currentUser.role === 'admin' 
    },
    { 
      id: 'attendance', 
      label: t.navAttendance, 
      icon: UserCheck, 
      visible: currentUser.role === 'teacher' || currentUser.role === 'admin' 
    },
    { 
      id: 'users', 
      label: t.navUsers, 
      icon: Users, 
      visible: currentUser.role === 'admin' || currentUser.role === 'teacher' 
    },
    { 
      id: 'guardian', 
      label: t.navGuardian, 
      icon: Users, 
      visible: true 
    },
    { 
      id: 'ai_settings', 
      label: t.navAISettings, 
      icon: Settings, 
      visible: currentUser.role === 'admin' 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner with USA Flag Motif & Quick Switcher */}
      <div className="bg-gradient-to-r from-[#002868] via-[#0A2540] to-[#1E3A8A] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-red-600/90 text-white px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
              USA Standard ESL
            </span>
            <span className="hidden sm:inline text-slate-200">
              Metodologia Americana • Imersão & Diário de Progresso
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Button */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer"
              title="Trocar perfil de usuário para testar as visões de Aluno, Professor, Admin e Responsável"
            >
              <Users className="w-3.5 h-3.5 text-red-400" />
              <span>{t.switchRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 text-slate-200 hover:text-white px-2 py-1 rounded-md text-xs font-medium cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase font-semibold">{language}</span>
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-slate-800 z-50">
                  <button
                    onClick={() => { setLanguage('pt'); setShowLangDropdown(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>🇧🇷 Português</span>
                    {language === 'pt' && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setShowLangDropdown(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>🇺🇸 English</span>
                    {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('es'); setShowLangDropdown(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>🇪🇸 Español</span>
                    {language === 'es' && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Academy Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#002868] text-white flex items-center justify-center shadow-md relative overflow-hidden border-2 border-red-600">
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full" />
              <GraduationCap className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base md:text-lg text-slate-900 tracking-tight leading-tight">
                  Eagle English
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-red-600 text-white uppercase tracking-wider">
                  Academy
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* User Status Bar */}
          <div className="flex items-center gap-3">
            {currentUser.role === 'student' && (
              <>
                {/* Streak flame */}
                <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>{currentUser.streakDays}d {t.streak}</span>
                </div>

                {/* XP */}
                <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>{currentUser.xpPoints} XP</span>
                </div>

                {/* Monthly status */}
                {currentUser.monthlyStatus === 'blocked' ? (
                  <div className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    <span>{t.blockedAccount}</span>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{t.activeAccount}</span>
                  </div>
                )}
              </>
            )}

            {/* Current User Card */}
            <div 
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full hover:bg-slate-100 transition cursor-pointer border border-slate-200/80"
              title="Clique para alternar de usuário"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  {getRoleBadge(currentUser.role)}
                  {currentUser.englishLevel && (
                    <span className="font-bold text-blue-800 ml-1">[{currentUser.englishLevel}]</span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 overflow-x-auto pb-1 text-xs">
          {navItems.filter(item => item.visible).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#002868] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role / User Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {t.switchRole}
                </h3>
                <p className="text-xs text-slate-500">
                  Selecione qualquer perfil para explorar todas as funcionalidades do sistema
                </p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto pr-1">
              {users.map(u => {
                const isSelected = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      setCurrentUserById(u.id);
                      setShowRoleModal(false);
                      // Route nicely
                      if (u.role === 'guardian') setActiveTab('guardian');
                      else if (u.role === 'admin' && activeTab === 'guardian') setActiveTab('dashboard');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {getRoleBadge(u.role)}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{u.email}</span>
                          {u.englishLevel && (
                            <span className="font-semibold text-blue-700">• Nível {u.englishLevel}</span>
                          )}
                          {u.monthlyStatus === 'blocked' && (
                            <span className="text-red-600 font-semibold">• [Acesso Bloqueado]</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
