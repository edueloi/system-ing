import { User, LessonMaterial, FormQuiz, AttendanceRecord, Badge, StudentBadge, DailyGoal, AISettingsConfig, FinancialRecord } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Prof. Eduardo Silva (Admin & Lead Coach)',
    email: 'admin@eagleenglish.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+55 11 98765-4321',
    englishLevel: 'C2',
    levelTitle: 'Diretor Acadêmico & Professor Sênior',
    monthlyStatus: 'active',
    monthlyFee: 0,
    lastPaymentDate: '2026-10-01',
    accessExpiryDate: '2029-12-31',
    streakDays: 45,
    xpPoints: 9200,
    completedLessonsCount: 88,
    createdAt: '2025-01-10',
    notes: 'Administrador Geral com privilégios plenos de gestão e docência.'
  },
  {
    id: 'usr_teacher_1',
    name: 'Teacher Sarah Jenkins',
    email: 'sarah.jenkins@eagleenglish.com',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 415 555-0199',
    englishLevel: 'C2',
    levelTitle: 'Native ESL Specialist (California, US)',
    monthlyStatus: 'active',
    monthlyFee: 0,
    lastPaymentDate: '2026-10-01',
    accessExpiryDate: '2029-12-31',
    streakDays: 32,
    xpPoints: 5400,
    completedLessonsCount: 42,
    createdAt: '2025-02-15',
    notes: 'Especialista em redução de sotaque e conversação avançada.'
  },
  {
    id: 'usr_teacher_2',
    name: 'Prof. Marcus Taylor',
    email: 'marcus.taylor@eagleenglish.com',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+55 11 97711-2233',
    englishLevel: 'C2',
    levelTitle: 'Business English & IELTS Instructor',
    monthlyStatus: 'active',
    monthlyFee: 0,
    lastPaymentDate: '2026-10-01',
    accessExpiryDate: '2029-12-31',
    streakDays: 28,
    xpPoints: 4800,
    completedLessonsCount: 35,
    createdAt: '2025-03-01',
  },
  {
    id: 'usr_student_1',
    name: 'Lucas Mendes',
    email: 'lucas.mendes@email.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+55 11 99123-4567',
    englishLevel: 'B1',
    levelTitle: 'B1 - Pré-Intermediário / Independent User',
    assignedTeacherId: 'usr_admin',
    guardianName: 'Ana Mendes (Mãe)',
    guardianEmail: 'ana.mendes@parent.com',
    guardianPhone: '+55 11 99988-7766',
    monthlyStatus: 'active',
    monthlyFee: 290.00,
    lastPaymentDate: '2026-10-05',
    accessExpiryDate: '2026-11-05',
    streakDays: 14,
    xpPoints: 1850,
    completedLessonsCount: 12,
    createdAt: '2025-05-10',
    notes: 'Ótima dedicação na fala. Focando em phrasal verbs e preposições.'
  },
  {
    id: 'usr_student_2',
    name: 'Beatriz Costa',
    email: 'beatriz.costa@email.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+55 21 98877-6655',
    englishLevel: 'A2',
    levelTitle: 'A2 - Básico Elementar',
    assignedTeacherId: 'usr_teacher_1',
    guardianName: 'Carlos Costa (Pai)',
    guardianEmail: 'carlos.costa@parent.com',
    guardianPhone: '+55 21 99881-2233',
    monthlyStatus: 'active',
    monthlyFee: 290.00,
    lastPaymentDate: '2026-10-10',
    accessExpiryDate: '2026-11-10',
    streakDays: 6,
    xpPoints: 940,
    completedLessonsCount: 7,
    createdAt: '2025-06-12',
    notes: 'Em rápida evolução. Praticando simple past e verbos irregulares.'
  },
  {
    id: 'usr_student_3',
    name: 'Rafael Duarte',
    email: 'rafael.duarte@email.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+55 31 98455-1122',
    englishLevel: 'C1',
    levelTitle: 'C1 - Avançado Operacional',
    assignedTeacherId: 'usr_teacher_2',
    guardianName: 'Marise Duarte',
    guardianEmail: 'marise.duarte@parent.com',
    guardianPhone: '+55 31 99112-3344',
    monthlyStatus: 'active',
    monthlyFee: 350.00,
    lastPaymentDate: '2026-10-01',
    accessExpiryDate: '2026-11-01',
    streakDays: 22,
    xpPoints: 3400,
    completedLessonsCount: 28,
    createdAt: '2025-01-20',
  },
  {
    id: 'usr_student_4',
    name: 'Juliana Souza (Acesso Pendente)',
    email: 'juliana.souza@email.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+55 41 99234-9988',
    englishLevel: 'A1',
    levelTitle: 'A1 - Iniciante',
    assignedTeacherId: 'usr_admin',
    guardianName: 'Roberto Souza',
    guardianEmail: 'roberto.souza@parent.com',
    guardianPhone: '+55 41 98800-1122',
    monthlyStatus: 'blocked',
    monthlyFee: 290.00,
    lastPaymentDate: '2026-09-10',
    accessExpiryDate: '2026-10-10', // expired!
    streakDays: 2,
    xpPoints: 320,
    completedLessonsCount: 3,
    createdAt: '2025-08-01',
    notes: 'Mensalidade de Outubro pendente. Aguardando renovação pelo professor/admin.'
  },
  {
    id: 'usr_guardian_1',
    name: 'Ana Mendes (Responsável de Lucas)',
    email: 'ana.mendes@parent.com',
    role: 'guardian',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+55 11 99988-7766',
    monthlyStatus: 'active',
    monthlyFee: 0,
    lastPaymentDate: '2026-10-05',
    accessExpiryDate: '2029-12-31',
    streakDays: 0,
    xpPoints: 0,
    completedLessonsCount: 0,
    createdAt: '2025-05-10',
    notes: 'Responsável pelo aluno Lucas Mendes.'
  }
];

export const INITIAL_LESSONS: LessonMaterial[] = [
  {
    id: 'les_1',
    title: 'Mastering American Small Talk & Connected Speech',
    level: 'B1',
    category: 'Conversation',
    durationMinutes: 35,
    description: 'Learn how native speakers naturally reduce sounds ("wanna", "gonna", "coulda") and start friendly conversations with coworkers or strangers.',
    content: `In American English culture, small talk builds rapport before jumping into business or deeper relationships. Key questions include: 'How's your day going?', 'Did you catch the game last night?', and 'Any plans for the weekend?'.
    
Notice connected speech rules:
1. Flap T: In words like 'water', 'city', 'better', the T sounds almost like a soft D in Portuguese ('r' in 'caro').
2. Glottal stop: In words like 'mountain', 'button', 'curtain', Americans skip the full T pop.
3. Reductions: 'What are you doing?' -> 'Whatcha doin?'.`,
    audioText: "Hey there! How's your morning going? Let's grab some coffee and chat about the project before the meeting starts.",
    vocabulary: [
      { term: 'Rapport', phonetic: '/ræˈpɔːr/', translation: 'Sintonia / Conexão amigável', example: 'Building rapport with your client is essential for negotiations.' },
      { term: 'Small Talk', phonetic: '/smɔːl tɔːk/', translation: 'Conversa informal / quebra-gelo', example: 'Americans love making small talk in elevators and grocery lines.' },
      { term: 'Connected Speech', phonetic: '/kəˈnɛktɪd spiːtʃ/', translation: 'Fala conectada e fluida', example: 'Connected speech makes you sound natural and fluent.' },
      { term: 'Catch up', phonetic: '/kætʃ ʌp/', translation: 'Colocar o papo em dia', example: 'We should grab lunch soon to catch up!' }
    ],
    exercisesCount: 4
  },
  {
    id: 'les_2',
    title: 'Essential Phrasal Verbs for Everyday Life',
    level: 'B1',
    category: 'Vocabulary',
    durationMinutes: 30,
    description: 'Stop translating word-by-word. Discover the 10 most powerful phrasal verbs used in offices, homes, and trips in the USA.',
    content: `Phrasal verbs consist of a verb plus a preposition/particle that totally changes its primary meaning.
    
Top phrasal verbs this week:
- Figure out: Discover or solve a problem. ('I finally figured out the code error.')
- Run into: Meet someone unexpectedly. ('I ran into my former English teacher at Target.')
- Put off: Postpone. ('Don't put off studying for your proficiency test.')
- Look forward to: Anticipate something with joy. ('I look forward to our next class!')`,
    audioText: "I was trying to figure out the subway route in New York and ran into a very helpful local.",
    vocabulary: [
      { term: 'Figure out', phonetic: '/ˈfɪɡ.jər aʊt/', translation: 'Descobrir / Encontrar a solução', example: 'Can you help me figure this out?' },
      { term: 'Run into', phonetic: '/rʌn ˈɪn.tuː/', translation: 'Esbarrar com alguém por acaso', example: 'Guess who I ran into yesterday at the airport?' },
      { term: 'Call off', phonetic: '/kɔːl ɔːf/', translation: 'Cancelar um evento ou reunião', example: 'They called off the outdoor barbecue due to heavy rain.' }
    ],
    exercisesCount: 5
  },
  {
    id: 'les_3',
    title: 'Present Perfect vs. Simple Past in American English',
    level: 'A2',
    category: 'Grammar',
    durationMinutes: 40,
    description: 'Clear breakdown between completed actions at a specific time in the past and experiences with present relevance.',
    content: `Americans often simplify the Present Perfect when using 'already', 'just', and 'yet', but it is crucial for talking about life experience without a specified date:
    - 'Have you ever visited the Grand Canyon?' -> Life experience.
    - 'I went to Chicago last summer.' -> Specific past time ('last summer').`,
    audioText: "Have you ever traveled to the United States? Yes, I visited Miami two years ago and it was unforgettable.",
    vocabulary: [
      { term: 'Ever', phonetic: '/ˈev.ər/', translation: 'Alguma vez na vida', example: 'Have you ever tried American pumpkin pie?' },
      { term: 'Already', phonetic: '/ɔːlˈred.i/', translation: 'Já (em afirmativas)', example: 'I have already submitted my homework assignment.' },
      { term: 'Yet', phonetic: '/jet/', translation: 'Ainda (negativas) / Já (perguntas)', example: 'Have you finished the lesson yet?' }
    ],
    exercisesCount: 6
  },
  {
    id: 'les_4',
    title: 'Executive Pitching & Business Email Etiquette',
    level: 'C1',
    category: 'Business',
    durationMinutes: 45,
    description: 'High-level business correspondence, polite assertiveness, and elevator pitching for international companies.',
    content: `In US corporate communication, brevity and clarity reign supreme. Avoid overly formal Victorian phrases like 'Kindly be informed' in favor of direct, courteous phrasing like 'Just following up on yesterday's proposal' and 'Please let me know if you have any questions by Friday.'`,
    audioText: "Thank you for the productive sync today. I will circle back with the revised deliverables by tomorrow afternoon.",
    vocabulary: [
      { term: 'Circle back', phonetic: '/ˈsɜːr.kəl bæk/', translation: 'Retomar contato mais tarde', example: 'Let me look at the figures and circle back to you.' },
      { term: 'Actionable', phonetic: '/ˈæk.ʃən.ə.bəl/', translation: 'Executável / Prático', example: 'Please provide actionable feedback for the team.' },
      { term: 'Bottom line', phonetic: '/ˌbɑː.t̬əm ˈlaɪn/', translation: 'Ponto crucial / Lucro líquido', example: 'The bottom line is that we need to boost conversation speed.' }
    ],
    exercisesCount: 4
  }
];

export const INITIAL_QUIZZES: FormQuiz[] = [
  {
    id: 'quiz_1',
    title: 'Quiz de Fixação: Small Talk & Idioms B1',
    description: 'Avaliação rápida de fixação sobre cumprimentos comuns, conectivos e phrasal verbs americanos.',
    level: 'B1',
    teacherId: 'usr_admin',
    teacherName: 'Prof. Eduardo Silva',
    createdAt: '2026-10-10',
    dueDate: '2026-10-25',
    passingScore: 70,
    assignedStudentIds: ['usr_student_1', 'usr_student_2', 'usr_student_4'],
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'When someone asks you: "How\'s it going?", what is the most natural American response?',
        options: [
          'Pretty good, thanks! How about you?',
          'I am going with my car.',
          'Yes, I go very well today.',
          'It is going on the street.'
        ],
        correctAnswer: '0',
        explanation: '"Pretty good, thanks! How about you?" is the everyday standard friendly response.'
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'Choose the correct phrasal verb: "I need to _____ why the audio file is not opening."',
        options: ['figure out', 'look after', 'take off', 'run into'],
        correctAnswer: '0',
        explanation: '"Figure out" means to solve, understand, or find the answer to a problem.'
      },
      {
        id: 'q3',
        type: 'listening',
        question: 'Listen to the phrase and choose what the speaker actually reduced: "Whatcha wanna do tonight?"',
        audioPrompt: 'Whatcha wanna do tonight?',
        options: [
          'What do you want to do tonight?',
          'Which day do you want to do tonight?',
          'Who told you to do tonight?',
          'Where will you want to do tonight?'
        ],
        correctAnswer: '0',
        explanation: '"Whatcha wanna" is the casual spoken reduction of "What do you want to".'
      },
      {
        id: 'q4',
        type: 'open',
        question: 'Write 2 sentences in English describing one of your favorite hobbies using at least one phrasal verb.',
        explanation: 'Teacher will evaluate your sentence structure and natural vocabulary use.'
      }
    ]
  },
  {
    id: 'quiz_2',
    title: 'Diagnostic Test: Irregular Past & Daily Routine (A1-A2)',
    description: 'Diagnóstico rápido para verificar o domínio de verbos irregulares no passado simples.',
    level: 'A2',
    teacherId: 'usr_teacher_1',
    teacherName: 'Teacher Sarah Jenkins',
    createdAt: '2026-10-12',
    dueDate: '2026-10-28',
    passingScore: 75,
    assignedStudentIds: ['usr_student_1', 'usr_student_2'],
    questions: [
      {
        id: 'q2_1',
        type: 'multiple_choice',
        question: 'What is the simple past form of the verb "CATCH"?',
        options: ['Catched', 'Caught', 'Cought', 'Cating'],
        correctAnswer: '1',
        explanation: '"Caught" is the irregular past form of catch.'
      },
      {
        id: 'q2_2',
        type: 'multiple_choice',
        question: 'Select the sentence with correct American grammar:',
        options: [
          'She didn\'t saw the movie yesterday.',
          'She didn\'t see the movie yesterday.',
          'She don\'t saw the movie yesterday.',
          'She didn\'t seen the movie yesterday.'
        ],
        correctAnswer: '1',
        explanation: 'After the auxiliary "didn\'t", the main verb always stays in base form (see).'
      }
    ]
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    studentId: 'usr_student_1',
    studentName: 'Lucas Mendes',
    teacherId: 'usr_admin',
    teacherName: 'Prof. Eduardo Silva',
    date: '2026-10-14',
    status: 'present',
    topic: 'Connected Speech & Flap T Drill',
    notes: 'Excelente pronúncia no exercício de repetição. Falou bastante em aula.',
    homeworkDone: true,
    score: 9.5
  },
  {
    id: 'att_2',
    studentId: 'usr_student_1',
    studentName: 'Lucas Mendes',
    teacherId: 'usr_admin',
    teacherName: 'Prof. Eduardo Silva',
    date: '2026-10-11',
    status: 'present',
    topic: 'American Culture & Weekend Small Talk',
    notes: 'Boa participação nas duplas. Precisa apenas revisar preposições in/on/at.',
    homeworkDone: true,
    score: 9.0
  },
  {
    id: 'att_3',
    studentId: 'usr_student_1',
    studentName: 'Lucas Mendes',
    teacherId: 'usr_admin',
    teacherName: 'Prof. Eduardo Silva',
    date: '2026-10-07',
    status: 'excused',
    topic: 'Phrasal Verbs with Look & Get',
    notes: 'Avisou com antecedência que tinha consulta médica. Enviou o resumo do material.',
    homeworkDone: true,
    score: 8.5
  },
  {
    id: 'att_4',
    studentId: 'usr_student_2',
    studentName: 'Beatriz Costa',
    teacherId: 'usr_teacher_1',
    teacherName: 'Teacher Sarah Jenkins',
    date: '2026-10-13',
    status: 'present',
    topic: 'Simple Past Dialogues & Storytelling',
    notes: 'Superou a timidez e fez todo o diálogo em inglês!',
    homeworkDone: true,
    score: 9.2
  },
  {
    id: 'att_5',
    studentId: 'usr_student_4',
    studentName: 'Juliana Souza',
    teacherId: 'usr_admin',
    teacherName: 'Prof. Eduardo Silva',
    date: '2026-10-02',
    status: 'absent',
    topic: 'Introductions & Alphabet Phonetics',
    notes: 'Não compareceu e não justificou. Mensalidade de outubro pendente de renovação.',
    homeworkDone: false,
    score: 0.0
  }
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge_liberty',
    title: 'Statue of Liberty - Primeiro Passo',
    description: 'Completou a primeira aula e participou da aula inaugural na academia.',
    iconName: 'Landmark',
    rarity: 'common',
    category: 'attendance',
    requiredCount: 1,
    xpReward: 100
  },
  {
    id: 'badge_eagle_eye',
    title: 'Eagle Eye - Mestre da Gramática',
    description: 'Acertou 100% de precisão em uma avaliação de gramática ou teste formulário.',
    iconName: 'Zap',
    rarity: 'rare',
    category: 'quiz',
    requiredCount: 1,
    xpReward: 250
  },
  {
    id: 'badge_streak_7',
    title: 'Broadway Routine - 7 Dias de Fogo',
    description: 'Manteve uma sequência ininterrupta de 7 dias consecutivos de estudos.',
    iconName: 'Flame',
    rarity: 'rare',
    category: 'streak',
    requiredCount: 7,
    xpReward: 350
  },
  {
    id: 'badge_streak_30',
    title: 'Wall Street Discipline - 30 Dias',
    description: 'Alcançou 30 dias consecutivos sem perder nenhum dia de treino de inglês.',
    iconName: 'Award',
    rarity: 'epic',
    category: 'streak',
    requiredCount: 30,
    xpReward: 800
  },
  {
    id: 'badge_bridge_b1',
    title: 'Golden Gate - Ponte para o B1',
    description: 'Atingiu proficiência nível B1 validada pelo professor.',
    iconName: 'ShieldCheck',
    rarity: 'epic',
    category: 'level',
    requiredCount: 1,
    xpReward: 500
  },
  {
    id: 'badge_native_flow',
    title: 'American Accent Champion',
    description: 'Demonstrou fala contínua com connected speech e entonação natural.',
    iconName: 'Mic',
    rarity: 'legendary',
    category: 'quiz',
    requiredCount: 1,
    xpReward: 1000
  }
];

export const INITIAL_STUDENT_BADGES: StudentBadge[] = [
  { badgeId: 'badge_liberty', studentId: 'usr_student_1', unlockedAt: '2025-05-15' },
  { badgeId: 'badge_streak_7', studentId: 'usr_student_1', unlockedAt: '2025-06-20' },
  { badgeId: 'badge_bridge_b1', studentId: 'usr_student_1', unlockedAt: '2025-09-10' },
  { badgeId: 'badge_liberty', studentId: 'usr_student_2', unlockedAt: '2025-06-15' },
  { badgeId: 'badge_liberty', studentId: 'usr_student_3', unlockedAt: '2025-01-25' },
  { badgeId: 'badge_streak_7', studentId: 'usr_student_3', unlockedAt: '2025-02-10' },
  { badgeId: 'badge_streak_30', studentId: 'usr_student_3', unlockedAt: '2025-04-01' },
];

export const INITIAL_DAILY_GOALS: DailyGoal[] = [
  { id: 'g1', title: 'Ouvir e repetir 5 sentenças com pronúncia americana', xp: 50, completed: true, icon: 'Headphones' },
  { id: 'g2', title: 'Praticar 3 phrasal verbs novos no diário de estudos', xp: 40, completed: false, icon: 'BookOpen' },
  { id: 'g3', title: 'Resolver o Quiz de Fixação atribuído pelo professor', xp: 80, completed: false, icon: 'CheckCircle' }
];

export const INITIAL_AI_SETTINGS: AISettingsConfig = {
  provider: 'gemini',
  apiKey: '',
  modelName: 'gemini-2.5-flash',
  status: 'connected',
  lastTestedAt: '2026-10-15 10:30',
  testPrompt: 'Explain the difference between "look forward to" and "expect" with 2 American English examples.',
  temperature: 0.7
};

export const INITIAL_FINANCIALS: FinancialRecord[] = [
  {
    id: 'fin_1',
    studentId: 'usr_student_1',
    studentName: 'Lucas Mendes',
    amount: 290.0,
    date: '2026-10-05',
    validUntil: '2026-11-05',
    status: 'paid',
    receiptCode: 'REC-2026-1005-01'
  },
  {
    id: 'fin_2',
    studentId: 'usr_student_2',
    studentName: 'Beatriz Costa',
    amount: 290.0,
    date: '2026-10-10',
    validUntil: '2026-11-10',
    status: 'paid',
    receiptCode: 'REC-2026-1010-02'
  },
  {
    id: 'fin_3',
    studentId: 'usr_student_3',
    studentName: 'Rafael Duarte',
    amount: 350.0,
    date: '2026-10-01',
    validUntil: '2026-11-01',
    status: 'paid',
    receiptCode: 'REC-2026-1001-03'
  },
  {
    id: 'fin_4',
    studentId: 'usr_student_4',
    studentName: 'Juliana Souza',
    amount: 290.0,
    date: '2026-09-10',
    validUntil: '2026-10-10',
    status: 'overdue',
    receiptCode: 'REC-2026-0910-04'
  }
];
