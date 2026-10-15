import React, { useState, useEffect } from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { AccessBlockedBanner } from './components/AccessBlockedBanner';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminPortal } from './components/AdminPortal';
import { GuardianPortal } from './components/GuardianPortal';

const DashboardApp: React.FC = () => {
  const { currentUser } = useAcademy();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // When user role changes, reset to 'dashboard' so the view is always tailored
  useEffect(() => {
    setCurrentTab('dashboard');
  }, [currentUser.id, currentUser.role]);

  const renderActiveView = () => {
    // 1. Guardian Mode
    if (currentUser.role === 'guardian') {
      return <GuardianPortal />;
    }

    // 2. Student Mode
    if (currentUser.role === 'student') {
      return <StudentPortal activeTab={currentTab} />;
    }

    // 3. Teacher Mode
    if (currentUser.role === 'teacher') {
      if (currentTab === 'audio') {
        return <AdminPortal activeTab="audio" />;
      }
      return <TeacherPortal activeTab={currentTab} />;
    }

    // 4. Admin Geral Mode
    if (currentUser.role === 'admin') {
      // If Admin wants to access Teacher-specific tasks (Attendance register or Form builder)
      if (currentTab === 'attendance' || currentTab === 'forms_builder' || currentTab === 'submissions') {
        return <TeacherPortal activeTab={currentTab} />;
      }
      return <AdminPortal activeTab={currentTab} />;
    }

    return <StudentPortal activeTab="dashboard" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sleek Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={tabId => setCurrentTab(tabId)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header with Role Switcher & Language Selector */}
        <TopHeader
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          currentTab={currentTab}
        />

        {/* Access Blocked Warning (for students whose monthly payment expired) */}
        <AccessBlockedBanner />

        {/* Active Page View Container */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Clean Minimalist Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-slate-800">Eagle English Academy</span>
              <span>• Portal Educacional ESL Americano</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Sistema de Aulas, Diário Pedagógico & Controle de Mensalidades
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <DashboardApp />
    </AcademyProvider>
  );
}
