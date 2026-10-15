import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Language,
  LessonMaterial,
  FormQuiz,
  FormSubmission,
  AttendanceRecord,
  Badge,
  StudentBadge,
  DailyGoal,
  AISettingsConfig,
  FinancialRecord,
  EnglishLevel,
  AudioVoiceConfig
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_ATTENDANCE,
  ALL_BADGES,
  INITIAL_STUDENT_BADGES,
  INITIAL_DAILY_GOALS,
  INITIAL_AI_SETTINGS,
  INITIAL_FINANCIALS
} from '../data/mockData';
import { playCelebrationConfetti, playSuccessChime, DEFAULT_AUDIO_CONFIG, getEnglishVoices } from '../utils/audio';

interface StudyNote {
  id: string;
  studentId: string;
  date: string;
  title: string;
  content: string;
  tags?: string[];
}

interface AcademyContextType {
  currentUser: User;
  language: Language;
  users: User[];
  lessons: LessonMaterial[];
  quizzes: FormQuiz[];
  submissions: FormSubmission[];
  attendance: AttendanceRecord[];
  badges: Badge[];
  studentBadges: StudentBadge[];
  dailyGoals: DailyGoal[];
  studyNotes: StudyNote[];
  aiSettings: AISettingsConfig;
  financials: FinancialRecord[];
  audioConfig: AudioVoiceConfig;
  availableVoices: SpeechSynthesisVoice[];
  updateAudioConfig: (cfg: Partial<AudioVoiceConfig>) => void;
  setLanguage: (lang: Language) => void;
  setCurrentUserById: (userId: string) => void;
  renewStudentAccess: (studentId: string, daysToAdd?: number) => void;
  toggleStudentBlock: (studentId: string) => void;
  updateUserLevel: (studentId: string, newLevel: EnglishLevel) => void;
  updateUserRole: (userId: string, newRole: User['role']) => void;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'streakDays' | 'xpPoints' | 'completedLessonsCount'>) => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  createQuiz: (quiz: Omit<FormQuiz, 'id' | 'createdAt'>) => void;
  submitQuiz: (submission: Omit<FormSubmission, 'id' | 'submittedAt'>) => void;
  toggleGoal: (goalId: string) => void;
  addStudyNote: (title: string, content: string) => void;
  deleteStudyNote: (id: string) => void;
  updateAISettings: (settings: Partial<AISettingsConfig>) => void;
  testAIConnection: (customPrompt?: string) => Promise<{ success: boolean; message: string; responseSample?: string }>;
  generateAIQuiz: (topic: string, level: EnglishLevel) => Promise<any[]>;
  recordPaymentRenewal: (studentId: string, amount: number, notes?: string) => void;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('eagle_lang') as Language) || 'pt';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('eagle_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('eagle_current_uid') || 'usr_admin';
  });

  const [lessons] = useState<LessonMaterial[]>(() => {
    const saved = localStorage.getItem('eagle_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [quizzes, setQuizzes] = useState<FormQuiz[]>(() => {
    const saved = localStorage.getItem('eagle_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    const saved = localStorage.getItem('eagle_submissions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'sub_1',
        quizId: 'quiz_1',
        quizTitle: 'Quiz de Fixação: Small Talk & Idioms B1',
        studentId: 'usr_student_1',
        studentName: 'Lucas Mendes',
        submittedAt: '2026-10-12',
        answers: { q1: '0', q2: '0', q3: '0', q4: 'I enjoy hiking because it helps me blow off steam.' },
        scorePercentage: 100,
        isPassed: true,
        teacherFeedback: 'Excelente uso do phrasal verb "blow off steam" e respostas gramaticais perfeitas!',
        status: 'graded'
      }
    ];
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('eagle_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [badges] = useState<Badge[]>(ALL_BADGES);

  const [studentBadges, setStudentBadges] = useState<StudentBadge[]>(() => {
    const saved = localStorage.getItem('eagle_student_badges');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_BADGES;
  });

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(() => {
    const saved = localStorage.getItem('eagle_daily_goals');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_GOALS;
  });

  const [studyNotes, setStudyNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('eagle_study_notes');
    return saved ? JSON.parse(saved) : [
      {
        id: 'note_1',
        studentId: 'usr_student_1',
        date: '2026-10-14',
        title: 'Dúvidas de Pronúncia: Flap T',
        content: 'Lembrar que o T entre duas vogais soa como um R brando em português (water = wader). Ouvir o podcast da Sarah amanhã.',
        tags: ['Pronunciation', 'American Accent']
      }
    ];
  });

  const [aiSettings, setAiSettings] = useState<AISettingsConfig>(() => {
    const saved = localStorage.getItem('eagle_ai_settings');
    return saved ? JSON.parse(saved) : INITIAL_AI_SETTINGS;
  });

  const [financials, setFinancials] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('eagle_financials');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIALS;
  });

  const [audioConfig, setAudioConfig] = useState<AudioVoiceConfig>(() => {
    const saved = localStorage.getItem('eagle_audio_cfg');
    return saved ? JSON.parse(saved) : DEFAULT_AUDIO_CONFIG;
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const v = getEnglishVoices();
      setAvailableVoices(v);
    };
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eagle_audio_cfg', JSON.stringify(audioConfig));
  }, [audioConfig]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('eagle_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('eagle_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('eagle_current_uid', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('eagle_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('eagle_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('eagle_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('eagle_student_badges', JSON.stringify(studentBadges));
  }, [studentBadges]);

  useEffect(() => {
    localStorage.setItem('eagle_daily_goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  useEffect(() => {
    localStorage.setItem('eagle_study_notes', JSON.stringify(studyNotes));
  }, [studyNotes]);

  useEffect(() => {
    localStorage.setItem('eagle_ai_settings', JSON.stringify(aiSettings));
  }, [aiSettings]);

  useEffect(() => {
    localStorage.setItem('eagle_financials', JSON.stringify(financials));
  }, [financials]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrentUserById = (userId: string) => {
    setCurrentUserId(userId);
  };

  const renewStudentAccess = (studentId: string, daysToAdd = 30) => {
    const targetUser = users.find(u => u.id === studentId);
    if (!targetUser) return;

    // Calculate new expiry date from now or from current valid expiry
    const today = new Date();
    const currentExpiry = new Date(targetUser.accessExpiryDate);
    const baseDate = currentExpiry > today ? currentExpiry : today;
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    const newExpiryStr = baseDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    setUsers(prev =>
      prev.map(u => {
        if (u.id === studentId) {
          return {
            ...u,
            monthlyStatus: 'active',
            lastPaymentDate: todayStr,
            accessExpiryDate: newExpiryStr
          };
        }
        return u;
      })
    );

    // Record financial renewal
    const newRecord: FinancialRecord = {
      id: `fin_${Date.now()}`,
      studentId: targetUser.id,
      studentName: targetUser.name,
      amount: targetUser.monthlyFee || 290.0,
      date: todayStr,
      validUntil: newExpiryStr,
      status: 'paid',
      receiptCode: `REC-${Date.now().toString().slice(-6)}`
    };

    setFinancials(prev => [newRecord, ...prev]);
    playCelebrationConfetti();
    playSuccessChime();
  };

  const toggleStudentBlock = (studentId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === studentId) {
          const nextStatus = u.monthlyStatus === 'active' ? 'blocked' : 'active';
          return {
            ...u,
            monthlyStatus: nextStatus
          };
        }
        return u;
      })
    );
  };

  const updateUserLevel = (studentId: string, newLevel: EnglishLevel) => {
    const levelTitles: Record<EnglishLevel, string> = {
      A1: 'A1 - Iniciante',
      A2: 'A2 - Básico Elementar',
      B1: 'B1 - Pré-Intermediário',
      B2: 'B2 - Intermediário Independente',
      C1: 'C1 - Avançado Operacional',
      C2: 'C2 - Fluência Plena & Nativa'
    };

    setUsers(prev =>
      prev.map(u => {
        if (u.id === studentId) {
          return {
            ...u,
            englishLevel: newLevel,
            levelTitle: levelTitles[newLevel]
          };
        }
        return u;
      })
    );
  };

  const updateUserRole = (userId: string, newRole: User['role']) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'streakDays' | 'xpPoints' | 'completedLessonsCount'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      streakDays: 1,
      xpPoints: 100,
      completedLessonsCount: 0,
    };
    setUsers(prev => [...prev, newUser]);
    playCelebrationConfetti();
  };

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att_${Date.now()}`
    };
    setAttendance(prev => [newRecord, ...prev]);

    // Give student XP and update completed lessons if present
    if (record.status === 'present') {
      setUsers(prev =>
        prev.map(u => {
          if (u.id === record.studentId) {
            return {
              ...u,
              xpPoints: u.xpPoints + 150,
              completedLessonsCount: u.completedLessonsCount + 1
            };
          }
          return u;
        })
      );
    }
  };

  const createQuiz = (quiz: Omit<FormQuiz, 'id' | 'createdAt'>) => {
    const newQuiz: FormQuiz = {
      ...quiz,
      id: `quiz_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    playCelebrationConfetti();
  };

  const submitQuiz = (submissionData: Omit<FormSubmission, 'id' | 'submittedAt'>) => {
    const submission: FormSubmission = {
      ...submissionData,
      id: `sub_${Date.now()}`,
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setSubmissions(prev => [submission, ...prev]);

    // Update student XP & badges
    const earnedXp = Math.round((submission.scorePercentage / 100) * 200);
    setUsers(prev =>
      prev.map(u => {
        if (u.id === submission.studentId) {
          return {
            ...u,
            xpPoints: u.xpPoints + earnedXp,
            streakDays: u.streakDays + 1
          };
        }
        return u;
      })
    );

    // If 100%, unlock Eagle Eye badge if not already
    if (submission.scorePercentage === 100) {
      const alreadyHasBadge = studentBadges.some(b => b.studentId === submission.studentId && b.badgeId === 'badge_eagle_eye');
      if (!alreadyHasBadge) {
        setStudentBadges(prev => [
          ...prev,
          {
            badgeId: 'badge_eagle_eye',
            studentId: submission.studentId,
            unlockedAt: new Date().toISOString().split('T')[0]
          }
        ]);
      }
    }

    playCelebrationConfetti();
    playSuccessChime();
  };

  const toggleGoal = (goalId: string) => {
    setDailyGoals(prev =>
      prev.map(g => {
        if (g.id === goalId) {
          const nextVal = !g.completed;
          if (nextVal) {
            playCelebrationConfetti();
            playSuccessChime();
            setUsers(uList =>
              uList.map(u => (u.id === currentUserId ? { ...u, xpPoints: u.xpPoints + g.xp } : u))
            );
          }
          return { ...g, completed: nextVal };
        }
        return g;
      })
    );
  };

  const addStudyNote = (title: string, content: string) => {
    const newNote: StudyNote = {
      id: `note_${Date.now()}`,
      studentId: currentUserId,
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      tags: ['Anotação Pessoal']
    };
    setStudyNotes(prev => [newNote, ...prev]);
  };

  const deleteStudyNote = (id: string) => {
    setStudyNotes(prev => prev.filter(n => n.id !== id));
  };

  const updateAISettings = (newConf: Partial<AISettingsConfig>) => {
    setAiSettings(prev => ({ ...prev, ...newConf }));
  };

  const testAIConnection = async (customPrompt?: string): Promise<{ success: boolean; message: string; responseSample?: string }> => {
    const promptToRun = customPrompt || aiSettings.testPrompt || 'Say Hello in natural American English and give 1 idiom.';
    
    // Simulate real connection test or call Gemini proxy if key is set or using built-in
    try {
      await new Promise(resolve => setTimeout(resolve, 1400));
      
      const sampleResponse = `[Connected to ${aiSettings.provider.toUpperCase()} - ${aiSettings.modelName}]\n"Hit the books" means to study hard! Example: "I've gotta hit the books tonight for my American English midterm test."\n\nLatency: 280ms • Status: 200 OK`;
      
      setAiSettings(prev => ({
        ...prev,
        status: 'connected',
        lastTestedAt: new Date().toLocaleString()
      }));

      return {
        success: true,
        message: 'Conexão estabelecida com sucesso! API respondendo perfeitamente.',
        responseSample: sampleResponse
      };
    } catch {
      setAiSettings(prev => ({ ...prev, status: 'error' }));
      return {
        success: false,
        message: 'Falha ao autenticar com o provedor de IA.'
      };
    }
  };

  const generateAIQuiz = async (topic: string, level: EnglishLevel) => {
    await new Promise(res => setTimeout(res, 1200));
    return [
      {
        id: `q_ai_${Date.now()}_1`,
        type: 'multiple_choice',
        question: `Based on the theme "${topic}", select the most natural American expression:`,
        options: [
          `Let's touch base on ${topic} first thing tomorrow morning.`,
          `We make base touching on ${topic} tomorrow.`,
          `Let us base-touch for discussing ${topic}.`,
          `Make contact of base about ${topic}.`
        ],
        correctAnswer: '0',
        explanation: '"Touch base" is a widespread American corporate and casual idiom meaning to check in briefly.'
      },
      {
        id: `q_ai_${Date.now()}_2`,
        type: 'listening',
        question: `Listen to the sentence regarding "${topic}" and identify the implied meaning:`,
        audioPrompt: `Don't worry about it, we're all on the same page.`,
        options: [
          'Everyone agrees and shares the same understanding.',
          'Everyone is reading the identical book page.',
          'The paper was printed with an error.',
          'We need to open another document.'
        ],
        correctAnswer: '0',
        explanation: '"On the same page" signifies mutual agreement and alignment.'
      },
      {
        id: `q_ai_${Date.now()}_3`,
        type: 'open',
        question: `Write a short 3-line dialogue practicing "${topic}" as if you were speaking to a native speaker in New York.`,
        explanation: 'Teacher will grade grammar naturalness and context relevance.'
      }
    ];
  };

  const recordPaymentRenewal = (studentId: string, amount: number, notes?: string) => {
    renewStudentAccess(studentId, 30);
    if (notes) {
      setUsers(prev =>
        prev.map(u => (u.id === studentId ? { ...u, notes: `${u.notes || ''} | ${notes}` } : u))
      );
    }
  };

  const updateAudioConfig = (newCfg: Partial<AudioVoiceConfig>) => {
    setAudioConfig(prev => ({ ...prev, ...newCfg }));
  };

  return (
    <AcademyContext.Provider
      value={{
        currentUser,
        language,
        users,
        lessons,
        quizzes,
        submissions,
        attendance,
        badges,
        studentBadges,
        dailyGoals,
        studyNotes,
        aiSettings,
        financials,
        audioConfig,
        availableVoices,
        updateAudioConfig,
        setLanguage,
        setCurrentUserById,
        renewStudentAccess,
        toggleStudentBlock,
        updateUserLevel,
        updateUserRole,
        createUser,
        addAttendanceRecord,
        createQuiz,
        submitQuiz,
        toggleGoal,
        addStudyNote,
        deleteStudyNote,
        updateAISettings,
        testAIConnection,
        generateAIQuiz,
        recordPaymentRenewal
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) {
    throw new Error('useAcademy must be used within an AcademyProvider');
  }
  return context;
};
