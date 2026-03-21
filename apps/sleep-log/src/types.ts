export interface SleepRecord {
  date: string; // YYYY-MM-DD
  bedtime: string; // HH:MM (24h)
  wakeTime: string; // HH:MM (24h)
  duration: number; // minutes
  quality: 1 | 2 | 3 | 4 | 5;
  factors: Factor[];
  createdAt: string;
}

export type Factor = 'caffeine' | 'exercise' | 'alcohol' | 'stress' | 'lateFood' | 'screenTime' | 'none';

export interface UserSettings {
  goalHours: number;
  typicalBedtime: string;
  typicalWakeTime: string;
  onboardingDone: boolean;
}

export interface WeeklyInsight {
  avgDuration: number;
  avgQuality: number;
  bestDay: { date: string; duration: number; quality: number } | null;
  worstDay: { date: string; duration: number; quality: number } | null;
  factorImpact: { factor: Factor; qualityDiff: number }[];
  goalAchievedDays: number;
}

export type Screen = 'onboarding' | 'home' | 'log' | 'calendar' | 'insight' | 'settings';
