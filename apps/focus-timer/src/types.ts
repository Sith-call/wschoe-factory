export type TimerState = 'idle' | 'focus' | 'break' | 'paused';

export interface Session {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
  energy: number; // 1-5
  completedAt: string; // ISO timestamp
}

export interface PetStage {
  emoji: string;
  name: string;
  message: string;
  minSessions: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null; // ISO timestamp or null if locked
}
