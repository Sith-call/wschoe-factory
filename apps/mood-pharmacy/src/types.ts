// ─── Mood System ───
export type MoodKey = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'tired' | 'excited' | 'empty';

export interface MoodData {
  key: MoodKey;
  label: string;
  emoji: string;
  color: string;       // tailwind text color
  bgColor: string;     // tailwind bg color
  softBg: string;      // subtle background
  description: string;
}

// ─── Prescription System ───
export interface Prescription {
  id: string;
  date: string;            // ISO date string
  mood: MoodKey;
  intensity: number;       // 1-5
  memo: string;
  activity: PrescriptionActivity;
  affirmation: string;
  breathing: BreathingExercise;
  musicGenre: MusicSuggestion;
  isFavorite: boolean;
}

export interface PrescriptionActivity {
  title: string;
  description: string;
  duration: string;
  emoji: string;
}

export interface BreathingExercise {
  name: string;
  pattern: string;       // e.g. "4-7-8"
  description: string;
  rounds: number;
}

export interface MusicSuggestion {
  genre: string;
  description: string;
  emoji: string;
  examples: string[];
}

// ─── Mood Log ───
export interface MoodLog {
  id: string;
  date: string;          // ISO date string YYYY-MM-DD
  mood: MoodKey;
  intensity: number;
  memo: string;
  prescriptionId: string;
  timestamp: string;     // ISO datetime
}

// ─── App State ───
export type ScreenName = 'intro' | 'moodCheck' | 'prescription' | 'history' | 'shelf' | 'profile';

export interface AppState {
  logs: MoodLog[];
  prescriptions: Prescription[];
  streak: number;
  lastLogDate: string | null;
}
