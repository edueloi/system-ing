import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import {
  Menu,
  Globe,
  ChevronDown,
  Check,
  Users,
  Volume2
} from 'lucide-react';
import { AudioSettingsModal } from './AudioSettingsModal';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  currentTab: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu, currentTab }) => {
  const { currentUser, language, setLanguage, setCurrentUserById } = useAcademy();
  const t = getTranslation(language);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);

  const demoProfiles = [
    {
      id: 'usr_admin',
      role: 'admin',
      label: `Admin (Eduardo Silva)`,
      desc: t.quickRoleAdmin,
      badge: 'Admin',
      badgeColor: 'bg-red-600'
    },
    {
      id: 'usr_teacher_1',
      role: 'teacher',
      label: `Teacher (Sarah Jenkins)`,
      desc: t.quickRoleTeacher,
      badge: t.roleTeacher,
      badgeColor: 'bg-blue-700'
    },
    {
      id: 'usr_student_1',
      role: 'student',
      label: `Student (Lucas Mendes)`,
      desc: t.quickRoleStudent,
      badge: 'B1',
      badgeColor: 'bg-emerald-600'
    },
    {
      id: 'usr_student_4',
      role: 'student',
      label: `Student (Juliana Costa)`,
      desc: t.quickRoleBlocked,
      badge: t.blocked,
      badgeColor: 'bg-amber-600'
    }
  ];

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'dashboard': return t.navOverview;
      case 'students': return t.navStudents;
      case 'teachers': return t.navTeachers;
      case 'finances': return t.navFinances;
      case 'attendance': return t.navDiary;
      case 'forms_builder': return t.navFormsBuilder;
      case 'submissions': return t.navSubmissions;
      case 'ai_settings': return t.navAISettings;
      case 'reports': return t.navReports;
      case 'audio': return t.navAudio;
      case 'lessons': return t.navLessons;
      case 'forms': return t.navForms;
      case 'badges': return t.navBadges;
      case 'diary': return t.navStudyDiary;
      default: return t.navOverview;
    }
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'admin': return t.roleAdmin;
      case 'teacher': return t.roleTeacher;
      case 'student': return t.roleStudent;
      default: return t.roleGuardian;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Banner Notice */}
      <div className="bg-[#002868] text-white px-4 py-1 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-red-300">
            ★ {t.appName.toUpperCase()} ★
          </span>
          <span className="hidden md:inline text-slate-200">
            {t.tagline}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="hidden sm:inline">{t.navigatingAs}</span>
          <span className="font-bold text-white underline decoration-red-500 underline-offset-2">
            {currentUser.name.split(' ')[0]} ({getRoleBadge().toUpperCase()})
          </span>
        </div>
      </div>

      {/* Main Header Action Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Mobile Menu Button + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-800 block truncate">
              {getBreadcrumbTitle()}
            </span>
            <div className="text-[10px] text-slate-400 truncate hidden sm:block">
              {t.systemFooter}
            </div>
          </div>
        </div>

        {/* Right Controls: Fast Profile Switcher + Adjust Voice + Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Profile Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 transition cursor-pointer text-xs"
              title={t.switchRole}
            >
              <Users className="w-3.5 h-3.5 text-blue-700" />
              <div className="text-left hidden md:block">
                <span className="font-bold text-slate-800 block text-[11px] leading-tight">
                  {t.switchRole}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  {currentUser.name.split(' ')[0]}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  {t.switchRoleSubtitle}
                </div>
                <div className="p-1 space-y-1">
                  {demoProfiles.map(dp => {
                    const isSelected = dp.id === currentUser.id;
                    return (
                      <button
                        key={dp.id}
                        onClick={() => {
                          setCurrentUserById(dp.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{dp.label}</span>
                            <span className={`text-[9px] text-white px-1.5 py-0.2 rounded-full font-bold ${dp.badgeColor}`}>
                              {dp.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{dp.desc}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-700 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Voice Audio Settings Button */}
          <button
            onClick={() => setShowAudioModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-xs font-semibold transition cursor-pointer"
            title={t.adjustVoice}
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">{t.adjustVoice}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase font-bold">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-xs">
                <button
                  onClick={() => { setLanguage('pt'); setShowLangDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <span>🇧🇷 Português</span>
                  {language === 'pt' && <Check className="w-3 h-3 text-blue-700" />}
                </button>
                <button
                  onClick={() => { setLanguage('en'); setShowLangDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <span>🇺🇸 English</span>
                  {language === 'en' && <Check className="w-3 h-3 text-blue-700" />}
                </button>
                <button
                  onClick={() => { setLanguage('es'); setShowLangDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <span>🇪🇸 Español</span>
                  {language === 'es' && <Check className="w-3 h-3 text-blue-700" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio Voice Modal */}
      <AudioSettingsModal
        isOpen={showAudioModal}
        onClose={() => setShowAudioModal(false)}
      />
    </header>
  );
};
