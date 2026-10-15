import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileCheck,
  Award,
  BookMarked,
  UserCheck,
  Users,
  DollarSign,
  Cpu,
  BarChart3,
  HeartHandshake,
  Flame,
  Sparkles,
  ChevronRight,
  Volume2,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const { currentUser, language } = useAcademy();
  const t = getTranslation(language);

  // Dynamic role-based navigation with full i18n support
  const getNavItems = () => {
    if (currentUser.role === 'student') {
      return [
        { id: 'dashboard', label: t.navOverview, icon: LayoutDashboard },
        { id: 'lessons', label: t.navLessons, icon: BookOpen },
        { id: 'forms', label: t.navForms, icon: FileCheck },
        { id: 'badges', label: t.navBadges, icon: Award },
        { id: 'diary', label: t.navStudyDiary, icon: BookMarked },
        { id: 'audio', label: t.navAudio, icon: Volume2 },
      ];
    }

    if (currentUser.role === 'teacher') {
      return [
        { id: 'dashboard', label: t.navOverview, icon: LayoutDashboard },
        { id: 'students', label: t.navStudents, icon: GraduationCap },
        { id: 'attendance', label: t.navDiary, icon: UserCheck },
        { id: 'forms_builder', label: t.navFormsBuilder, icon: FileCheck },
        { id: 'submissions', label: t.navSubmissions, icon: Award },
        { id: 'audio', label: t.navAudio, icon: Volume2 },
      ];
    }

    if (currentUser.role === 'admin') {
      return [
        { id: 'dashboard', label: t.navOverview, icon: LayoutDashboard },
        { id: 'students', label: t.navStudents, icon: GraduationCap },
        { id: 'teachers', label: t.navTeachers, icon: Users },
        { id: 'finances', label: t.navFinances, icon: DollarSign },
        { id: 'attendance', label: t.navDiary, icon: UserCheck },
        { id: 'forms_builder', label: t.navFormsBuilder, icon: FileCheck },
        { id: 'ai_settings', label: t.navAISettings, icon: Cpu },
        { id: 'reports', label: t.navReports, icon: BarChart3 },
        { id: 'audio', label: t.navAudio, icon: Volume2 },
      ];
    }

    // Guardian
    return [
      { id: 'guardian', label: t.navOverview, icon: HeartHandshake },
      { id: 'attendance', label: t.navDiary, icon: UserCheck },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  const displayName = currentUser.name.split('(')[0].trim();

  const getRoleLabel = () => {
    switch (currentUser.role) {
      case 'admin': return t.roleAdmin;
      case 'teacher': return t.roleTeacher;
      case 'student': return t.roleStudent;
      default: return t.roleGuardian;
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Fixed & Sticky on desktop (never scrolls away with page), Drawer on mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#001D4A] text-white flex flex-col justify-between border-r border-blue-950 shadow-2xl transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:shadow-none lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Navigation Section */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Brand Header */}
          <div className="p-4 border-b border-blue-900/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#002868] to-[#1E3A8A] flex items-center justify-center border-2 border-red-600 shadow-md shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">EAGLE</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-red-600 text-white uppercase tracking-wider">
                    USA
                  </span>
                </div>
                <div className="text-[11px] text-blue-200 font-medium truncate">
                  English Academy
                </div>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Profile Card */}
          <div className="px-4 py-3 bg-[#0A2540] border-b border-blue-950 flex items-center gap-3 shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate" title={currentUser.name}>
                {displayName}
              </div>
              <div className="text-[10px] text-blue-300 flex items-center gap-1 mt-0.5 truncate">
                <span className="font-semibold text-blue-200">
                  {getRoleLabel()}
                </span>
                {currentUser.englishLevel && (
                  <span className="font-bold text-amber-400">• {currentUser.englishLevel}</span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links - Scrollable on short screens, with zero pill and anti-wrap styling */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300/60">
              {t.mainMenu}
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                    <span className="truncate whitespace-nowrap">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0 ml-1" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-blue-950/80 bg-[#001736] shrink-0">
          {currentUser.role === 'student' && (
            <div className="mb-2 p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{currentUser.streakDays} {t.days}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-200 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentUser.xpPoints} XP</span>
              </div>
            </div>
          )}

          <div className="text-[10px] text-blue-300/70 text-center">
            {t.cefrStandard}
          </div>
        </div>
      </aside>
    </>
  );
};
