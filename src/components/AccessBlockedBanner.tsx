import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import { ShieldAlert, MessageCircle, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';

export const AccessBlockedBanner: React.FC = () => {
  const { currentUser, language, renewStudentAccess, toggleStudentBlock } = useAcademy();
  const t = getTranslation(language);

  if (currentUser.role !== 'student' || currentUser.monthlyStatus !== 'blocked') {
    return null;
  }

  return (
    <div className="bg-red-50 border-b-2 border-red-500 p-4 shadow-sm animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-red-900 text-sm md:text-base flex items-center gap-2">
              <span>{t.blockedTitle}</span>
              <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-medium">
                Vencido em: {currentUser.accessExpiryDate}
              </span>
            </h3>
            <p className="text-xs text-red-700 mt-0.5 max-w-2xl leading-relaxed">
              {t.blockedMessage} As aulas e testes interativos estão temporariamente suspensos até a confirmação do pagamento mensal.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/5511987654321?text=Olá,%20gostaria%20de%20confirmar%20a%20renovação%20da%20minha%20mensalidade%20na%20Eagle%20English%20Academy%20para%20o%20aluno%20${encodeURIComponent(currentUser.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t.contactTeacher}</span>
          </a>

          {/* Quick Admin Simulation Action */}
          <button
            onClick={() => renewStudentAccess(currentUser.id, 30)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            title="Simula o professor confirmando o pagamento e liberando +30 dias de acesso"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-200" />
            <span>{t.simulatedUnlock}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
