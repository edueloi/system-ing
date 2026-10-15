import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { getTranslation } from '../i18n/translations';
import { LessonMaterial, FormQuiz, QuizQuestion } from '../types';
import { speakEnglish, playCelebrationConfetti } from '../utils/audio';
import { AudioSettingsModal } from './AudioSettingsModal';
import {
  Flame,
  Sparkles,
  Award,
  BookOpen,
  Volume2,
  CheckCircle2,
  Lock,
  ChevronRight,
  Send,
  Calendar,
  FileText,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  Shield,
  HelpCircle,
  Play,
  RotateCcw,
  GraduationCap,
  Bookmark,
  Check,
  AlertCircle,
  Sliders
} from 'lucide-react';

interface StudentPortalProps {
  activeTab: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ activeTab }) => {
  const {
    currentUser,
    language,
    lessons,
    quizzes,
    submissions,
    badges,
    studentBadges,
    dailyGoals,
    toggleGoal,
    studyNotes,
    addStudyNote,
    deleteStudyNote,
    submitQuiz,
    audioConfig
  } = useAcademy();

  const t = getTranslation(language);

  // States
  const [selectedLesson, setSelectedLesson] = useState<LessonMaterial | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQuiz, setActiveQuiz] = useState<FormQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Journal form
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const isBlocked = currentUser.monthlyStatus === 'blocked';

  // Badges calculation for this student only
  const myUnlockedBadgeIds = new Set(
    studentBadges.filter(b => b.studentId === currentUser.id).map(b => b.badgeId)
  );

  const myUnlockedBadges = badges.filter(b => myUnlockedBadgeIds.has(b.id));
  const myLockedBadges = badges.filter(b => !myUnlockedBadgeIds.has(b.id));
  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);

  // CEFR Levels
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
  const currentLevelIndex = levels.indexOf(currentUser.englishLevel || 'B1');

  const handlePlayAudio = (text: string) => {
    setSpeakingWord(text);
    speakEnglish(text, audioConfig, () => setSpeakingWord(null));
  };

  const handleStartQuiz = (quiz: FormQuiz) => {
    if (isBlocked) return;
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmittedResult(null);
  };

  const handleQuizAnswer = (qId: string, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;

    let correctCount = 0;
    let scorableCount = 0;

    activeQuiz.questions.forEach(q => {
      if (q.type === 'multiple_choice' || q.type === 'listening') {
        scorableCount += 1;
        if (quizAnswers[q.id] === q.correctAnswer) {
          correctCount += 1;
        }
      } else if (q.type === 'open') {
        scorableCount += 1;
        if ((quizAnswers[q.id] || '').trim().length > 10) {
          correctCount += 1;
        }
      }
    });

    const percentage = Math.round((correctCount / (scorableCount || 1)) * 100);
    const passed = percentage >= activeQuiz.passingScore;

    submitQuiz({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      answers: quizAnswers,
      scorePercentage: percentage,
      isPassed: passed,
      teacherFeedback: passed
        ? 'Parabéns pelo ótimo desempenho! Continue praticando os phrasal verbs e connected speech.'
        : 'Bom esforço! Recomendamos revisar a lição e tentar novamente com atenção redobrada.',
      status: 'graded'
    });

    setQuizSubmittedResult({ score: percentage, passed });
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    addStudyNote(newNoteTitle, newNoteContent);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const filteredLessons = selectedCategory === 'All'
    ? lessons
    : lessons.filter(l => l.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-6">

      {/* SUBVIEW 1: DASHBOARD / VISÃO GERAL */}
      {(activeTab === 'dashboard' || !activeTab) && (
        <div className="space-y-6">
          {/* Welcome Hero Banner */}
          <div className="bg-gradient-to-r from-[#002868] via-[#0A2540] to-[#1E3A8A] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg ring-4 ring-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Student Dashboard
                    </span>
                    <span className="text-xs text-blue-200">
                      Nível Atual: <strong className="text-white">{currentUser.englishLevel || 'B1'}</strong>
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mt-1 tracking-tight">
                    Welcome back, {currentUser.name.split(' ')[0]}!
                  </h2>
                  <p className="text-xs text-blue-100 mt-0.5 max-w-lg leading-relaxed">
                    Você tem aulas agendadas e metas para cumprir hoje. Mantenha sua rotina para conquistar o nível B2!
                  </p>
                </div>
              </div>

              {/* Quick Stat Pills */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-center min-w-24">
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-lg">
                    <Flame className="w-5 h-5 fill-amber-400" />
                    <span>{currentUser.streakDays}d</span>
                  </div>
                  <div className="text-[10px] text-blue-200 uppercase font-semibold">Sequência</div>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-center min-w-24">
                  <div className="flex items-center justify-center gap-1 text-blue-300 font-bold text-lg">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span>{currentUser.xpPoints}</span>
                  </div>
                  <div className="text-[10px] text-blue-200 uppercase font-semibold">Total XP</div>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-center min-w-24">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-lg">
                    <Award className="w-5 h-5" />
                    <span>{myUnlockedBadges.length}</span>
                  </div>
                  <div className="text-[10px] text-blue-200 uppercase font-semibold">Badges</div>
                </div>
              </div>
            </div>
          </div>

          {/* CEFR Level Progression Roadmap */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm md:text-base text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-600" />
                  <span>Jornada de Proficiência CEFR (Quadro Europeu / ESL Americano)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Seu professor avalia sua conversação e fluência periodicamente para liberar o próximo nível
                </p>
              </div>
              <span className="text-xs font-bold text-[#002868] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Progresso Geral: {Math.round(((currentLevelIndex + 1) / levels.length) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4">
              {levels.map((lvl, idx) => {
                const isCurrent = lvl === currentUser.englishLevel;
                const isCompleted = idx < currentLevelIndex;
                const isLocked = idx > currentLevelIndex;

                return (
                  <div
                    key={lvl}
                    className={`p-3 rounded-xl border text-center transition ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                          ★
                        </span>
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="font-extrabold text-sm text-slate-900">{lvl}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {lvl === 'A1' ? 'Iniciante' : lvl === 'A2' ? 'Básico' : lvl === 'B1' ? 'Intermediário' : lvl === 'B2' ? 'Independente' : lvl === 'C1' ? 'Avançado' : 'Fluente'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Dual Cards: Daily Goals + Today's Recommended Lesson */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Study Goals */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600 fill-red-600" />
                  <h3 className="font-bold text-sm text-slate-900">{t.dailyGoals}</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {dailyGoals.filter(g => g.completed).length}/{dailyGoals.length} concluídas
                </span>
              </div>

              <div className="space-y-2.5 mt-4">
                {dailyGoals.map(goal => (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3 rounded-xl border transition flex items-center justify-between text-xs cursor-pointer ${
                      goal.completed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          goal.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {goal.completed && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={goal.completed ? 'line-through text-slate-400' : 'font-medium'}>
                        {goal.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                      +{goal.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Recommended Lesson Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#002868]" />
                    <h3 className="font-bold text-sm text-slate-900">Aula em Destaque Hoje</h3>
                  </div>
                  <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">
                    Recomendada
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
                    {lessons[0]?.category} • {lessons[0]?.durationMinutes} min
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mt-1">
                    {lessons[0]?.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {lessons[0]?.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {lessons[0]?.vocabulary.length} termos de vocabulário
                </span>
                <button
                  onClick={() => setSelectedLesson(lessons[0])}
                  disabled={isBlocked}
                  className="px-4 py-2 bg-[#002868] hover:bg-blue-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Iniciar Esta Aula</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: LESSONS & MATERIALS */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Header & Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#002868]" />
                <span>Biblioteca de Aulas & Materiais Didáticos</span>
              </h3>
              <p className="text-xs text-slate-500">
                Aprenda com áudios de pronúncia americana, gramática contextual e diálogos
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['All', 'Conversation', 'Vocabulary', 'Grammar', 'Business'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#002868] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'All' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map(lesson => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 transition shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-full">
                      {lesson.category}
                    </span>
                    <span className="font-bold text-red-600">
                      Nível {lesson.level}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition leading-snug">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} minutos
                  </span>
                  <button
                    onClick={() => setSelectedLesson(lesson)}
                    disabled={isBlocked}
                    className="px-3.5 py-1.5 bg-[#002868] hover:bg-blue-900 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Abrir Aula</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Lesson Modal Viewer */}
          {selectedLesson && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {selectedLesson.category} • Nível {selectedLesson.level}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 mt-1">
                      {selectedLesson.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Pronunciation audio player */}
                {selectedLesson.audioText && (
                  <div className="my-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePlayAudio(selectedLesson.audioText!)}
                        className="w-11 h-11 rounded-full bg-[#002868] hover:bg-blue-800 text-white flex items-center justify-center shadow-md transition cursor-pointer shrink-0"
                        title="Ouvir em áudio nativo americano"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div>
                        <div className="text-xs font-bold text-[#002868]">
                          Áudio de Fala Conectada Americana
                          {speakingWord && <span className="text-red-600 ml-2 animate-pulse">Reproduzindo...</span>}
                        </div>
                        <p className="text-xs text-slate-700 italic mt-0.5">
                          "{selectedLesson.audioText}"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handlePlayAudio(selectedLesson.audioText!)}
                        className="px-3.5 py-1.5 bg-[#002868] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ouvir Pronúncia</span>
                      </button>

                      <button
                        onClick={() => setShowVoiceModal(true)}
                        className="px-2.5 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-900 text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer flex items-center gap-1"
                        title="Alterar voz, velocidade ou tom"
                      >
                        <Sliders className="w-3.5 h-3.5 text-blue-700" />
                        <span>Voz ({audioConfig.speed}x)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Content text */}
                <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedLesson.content}
                </div>

                {/* Vocabulary Flashcards */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <span>Vocabulário Essencial ({selectedLesson.vocabulary.length} termos)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLesson.vocabulary.map((vocab, vIdx) => (
                      <div key={vIdx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{vocab.term}</span>
                          <button
                            onClick={() => handlePlayAudio(vocab.term)}
                            className="p-1 rounded-md text-blue-700 hover:bg-blue-50"
                            title="Ouvir pronúncia"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{vocab.phonetic}</div>
                        <div className="text-[11px] text-blue-900 font-semibold mt-0.5">{vocab.translation}</div>
                        <div className="text-[10px] text-slate-600 italic mt-1.5 bg-slate-50 p-2 rounded-md">
                          "{vocab.example}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="px-5 py-2 bg-[#002868] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 transition"
                  >
                    Concluir e Voltar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW 3: FORMS, QUIZZES & TESTS */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Formulários & Avaliações Atribuídas</span>
              </h3>
              <p className="text-xs text-slate-500">
                Responda os testes criados pelos professores para fixar o aprendizado e ganhar XP
              </p>
            </div>
            <span className="text-xs font-semibold bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200">
              {quizzes.length} testes disponíveis
            </span>
          </div>

          {/* Active Quiz Taker Screen */}
          {activeQuiz && (
            <div className="bg-white rounded-2xl p-6 border-2 border-red-500 shadow-xl space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Nível {activeQuiz.level} • Mínimo {activeQuiz.passingScore}%
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 mt-1">
                    {activeQuiz.title}
                  </h3>
                  <p className="text-xs text-slate-500">{activeQuiz.description}</p>
                </div>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  ✕ Sair
                </button>
              </div>

              {quizSubmittedResult ? (
                <div className="py-8 text-center space-y-3">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    quizSubmittedResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {quizSubmittedResult.passed ? <CheckCircle2 className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {quizSubmittedResult.passed ? 'Parabéns! Avaliação Aprovada!' : 'Avaliação Concluída!'}
                  </h4>
                  <div className="text-3xl font-extrabold text-blue-900">
                    {quizSubmittedResult.score}%
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {quizSubmittedResult.passed
                      ? 'Sua pontuação foi registrada no histórico escolar e você recebeu pontos de experiência.'
                      : 'Você pode refazer este exercício após revisar a lição.'}
                  </p>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-6 py-2.5 bg-[#002868] text-white rounded-xl text-xs font-bold hover:bg-blue-900 transition"
                  >
                    Retornar aos Testes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-700 mb-2">
                        <span>Questão {idx + 1} de {activeQuiz.questions.length}</span>
                        {q.type === 'listening' && (
                          <span className="text-blue-700 flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5" /> Listening Test
                          </span>
                        )}
                      </div>

                      {q.audioPrompt && (
                        <div className="mb-3 p-2.5 bg-blue-50 rounded-xl flex items-center justify-between border border-blue-200">
                          <span className="text-xs text-blue-900 font-semibold">Áudio com sotaque americano:</span>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(q.audioPrompt!)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#002868] text-white rounded-lg text-xs font-semibold hover:bg-blue-900 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            Ouvir Áudio
                          </button>
                        </div>
                      )}

                      <p className="font-semibold text-slate-900 text-sm mb-3">
                        {q.question}
                      </p>

                      {q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            const isChosen = quizAnswers[q.id] === String(oIdx);
                            return (
                              <label
                                key={oIdx}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                                  isChosen
                                    ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold'
                                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question_${q.id}`}
                                  checked={isChosen}
                                  onChange={() => handleQuizAnswer(q.id, String(oIdx))}
                                  className="w-4 h-4 text-blue-700"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'open' && (
                        <textarea
                          placeholder="Digite sua resposta em inglês aqui..."
                          rows={3}
                          value={quizAnswers[q.id] || ''}
                          onChange={e => handleQuizAnswer(q.id, e.target.value)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white"
                        />
                      )}
                    </div>
                  ))}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleFinishQuiz}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Finalizar e Enviar Respostas</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quizzes List Cards */}
          <div className="space-y-3">
            {quizzes.map(quiz => {
              const mySub = mySubmissions.find(s => s.quizId === quiz.id);
              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {quiz.level}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{quiz.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{quiz.description}</p>
                    <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-3">
                      <span>Professor: <strong>{quiz.teacherName}</strong></span>
                      <span>•</span>
                      <span>{quiz.questions.length} questões</span>
                      <span>•</span>
                      <span>Prazo: {quiz.dueDate}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {mySub ? (
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          mySub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Nota: {mySub.scorePercentage}%</span>
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Enviado em {mySub.submittedAt}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartQuiz(quiz)}
                        disabled={isBlocked}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        Responder Avaliação
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBVIEW 4: PRIVATE GAMIFICATION & BADGES */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Sala de Conquistas & Medalhas Americanas</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                🔒 <em>Suas conquistas são 100% privadas para seu foco individual (nenhum outro aluno tem acesso).</em>
              </p>
            </div>
            <div className="text-xs font-bold text-slate-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              {myUnlockedBadges.length} de {badges.length} Medalhas Desbloqueadas
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Medalhas Conquistadas ({myUnlockedBadges.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myUnlockedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="bg-white rounded-2xl p-4 border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-xs flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                    ★
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{badge.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{badge.description}</p>
                    <span className="text-[10px] text-amber-800 font-bold mt-2 inline-block bg-amber-100 px-2 py-0.5 rounded-full">
                      +{badge.xpReward} XP Concedidos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locked Badges */}
          {myLockedBadges.length > 0 && (
            <div className="space-y-3 mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Próximas Conquistas para Desbloquear
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myLockedBadges.map(badge => (
                  <div
                    key={badge.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-start gap-3 opacity-60"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center font-bold shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-700">{badge.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{badge.description}</p>
                      <span className="text-[10px] text-slate-500 mt-2 inline-block">
                        Recompensa: +{badge.xpReward} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW 5: STUDY DIARY / JOURNAL */}
      {activeTab === 'diary' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#002868]" />
                <span>{t.studyDiary}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Anote novas expressões, phrasal verbs, pronúncias difíceis e dúvidas para a próxima aula
              </p>
            </div>
          </div>

          {/* New Note Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-xs text-slate-800 mb-3">{t.addDiaryNote}</h4>
            <form onSubmit={handleSaveNote} className="space-y-3">
              <input
                type="text"
                placeholder="Título do registro (Ex: Phrasal verbs com LOOK)"
                value={newNoteTitle}
                onChange={e => setNewNoteTitle(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
              <textarea
                placeholder="Escreva suas frases de prática, significados ou pronúncia..."
                rows={3}
                value={newNoteContent}
                onChange={e => setNewNoteContent(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-slate-200 resize-none"
              />
              <button
                type="submit"
                disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                className="px-5 py-2 bg-[#002868] hover:bg-blue-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {t.saveNote}
              </button>
            </form>
          </div>

          {/* Saved Notes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Minhas Anotações Salvas
            </h4>
            {studyNotes.filter(n => n.studentId === currentUser.id).map(note => (
              <div key={note.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{note.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{note.date}</span>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW 6: AUDIO & VOICE SETTINGS */}
      {activeTab === 'audio' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#002868]" />
                <span>Personalização da Voz & Velocidade do Áudio</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ajuste a voz em inglês, velocidade e tom para facilitar sua compreensão nos exercícios e aulas
              </p>
            </div>
            <button
              onClick={() => setShowVoiceModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Abrir Painel Rápido</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Configurações Atuais
              </h4>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Perfil Ativo:</span>
                  <strong className="text-blue-900 capitalize">{audioConfig.preset.replace('_', ' ')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Velocidade de Fala:</span>
                  <strong className="text-blue-900">{audioConfig.speed}x</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tom da Voz:</span>
                  <strong className="text-blue-900">{audioConfig.pitch}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Voz do Sistema:</span>
                  <strong className="text-slate-800 text-right truncate max-w-44">
                    {audioConfig.selectedVoiceName || 'Padrão Automático US'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-blue-700" />
                  <span>Testar a Voz Atual</span>
                </h4>
                <p className="text-xs text-blue-900/80 mt-1 italic">
                  "Hello {currentUser.name.split(' ')[0]}! Are you ready for your American English listening practice?"
                </p>
              </div>

              <button
                type="button"
                onClick={() => handlePlayAudio(`Hello ${currentUser.name.split(' ')[0]}! Are you ready for your American English listening practice?`)}
                className="w-full py-2 bg-[#002868] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Ouvir Frase de Teste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Customization Modal */}
      <AudioSettingsModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
};
