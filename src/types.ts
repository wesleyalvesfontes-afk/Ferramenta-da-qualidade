export interface Question {
  id: number;
  title: string;
  concept: string;
  levelName: string;
  altitude: number; // e.g. 250, 500, 750...
  text: string;
  options: string[];
  answer: number;
  formula: string;
  formulaHint: string;
  explanation: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Estratégico';
}

export interface AvatarOption {
  id: string;
  emoji: string;
  name: string;
  role: string;
  bio: string;
  climbingQuote: string;
  celebrationQuote: string;
  thinkingQuote: string;
}

export interface MountainCamp {
  level: number;
  name: string;
  altitude: number;
  xPercent: number; // 0 to 100 on the mountain SVG path
  yPercent: number; // 0 to 100 on the mountain SVG path
  zone: 'base' | 'rock' | 'ice' | 'summit';
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Participant {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  avatarId: string;
  avatarEmoji: string;
  currentLevel: number;
  altitude: number;
  xp: number;
  coins: number;
  streak: number;
  maxStreak: number;
  firstTryCount: number;
  isClimbing: boolean;
  avatarState: 'idle' | 'climbing' | 'celebrating' | 'thinking';
  completedAt?: number | null;
  lastActive: number;
  isOnline: boolean;
}

export interface ActivityEvent {
  id: string;
  timestamp: number;
  type: 'join' | 'climb' | 'summit' | 'streak' | 'announcement';
  text: string;
  studentName?: string;
  emoji?: string;
}

export interface RoomState {
  code: string;
  title: string;
  teacherName: string;
  createdAt: number;
  participants: Record<string, Participant>;
  events: ActivityEvent[];
  announcement: { message: string; timestamp: number } | null;
  isRaceActive: boolean;
}
