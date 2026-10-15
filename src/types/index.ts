export type UserRole = 'admin' | 'teacher' | 'student' | 'guardian';

export type Language = 'pt' | 'en' | 'es';

export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  englishLevel?: EnglishLevel;
  levelTitle?: string;
  assignedTeacherId?: string;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  monthlyStatus: 'active' | 'blocked' | 'pending_renewal';
  monthlyFee: number;
  lastPaymentDate: string;
  accessExpiryDate: string; // YYYY-MM-DD
  streakDays: number;
  xpPoints: number;
  completedLessonsCount: number;
  createdAt: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'excused';
  topic: string;
  notes: string;
  homeworkDone: boolean;
  score?: number; // 0-10
}

export interface LessonMaterial {
  id: string;
  title: string;
  level: EnglishLevel;
  category: 'Grammar' | 'Vocabulary' | 'Conversation' | 'Listening' | 'Business';
  durationMinutes: number;
  description: string;
  content: string;
  audioText?: string;
  vocabulary: Array<{ term: string; phonetic: string; translation: string; example: string }>;
  exercisesCount: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'open' | 'listening';
  question: string;
  options?: string[];
  correctAnswer?: string; // index or text
  explanation?: string;
  audioPrompt?: string;
}

export interface FormQuiz {
  id: string;
  title: string;
  description: string;
  level: EnglishLevel;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  dueDate: string;
  questions: QuizQuestion[];
  assignedStudentIds: string[]; // empty means all
  passingScore: number; // e.g. 70%
}

export interface FormSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: Record<string, string>;
  scorePercentage: number;
  isPassed: boolean;
  teacherFeedback?: string;
  status: 'graded' | 'pending_review';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'attendance' | 'quiz' | 'streak' | 'level';
  requiredCount: number;
  xpReward: number;
}

export interface StudentBadge {
  badgeId: string;
  studentId: string;
  unlockedAt: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  icon: string;
}

export interface AISettingsConfig {
  provider: 'gemini' | 'openai';
  apiKey: string;
  modelName: string;
  status: 'connected' | 'untested' | 'error';
  lastTestedAt?: string;
  testPrompt: string;
  temperature: number;
}

export interface AudioVoiceConfig {
  selectedVoiceName: string;
  speed: number; // 0.6 to 1.4
  pitch: number; // 0.8 to 1.3
  preset: 'us_female' | 'us_male' | 'esl_coach_slow' | 'native_fast' | 'system_best';
}

export interface FinancialRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  validUntil: string;
  status: 'paid' | 'overdue' | 'pending';
  receiptCode: string;
}
