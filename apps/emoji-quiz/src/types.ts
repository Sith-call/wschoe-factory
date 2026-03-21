export type Category = 'movies' | 'proverbs' | 'food';

export interface QuizItem {
  emoji: string;
  answer: string;
  choices: string[];
}

export interface CategoryInfo {
  id: Category;
  label: string;
  description: string;
  itemCount: number;
}

export type Screen = 'start' | 'category' | 'quiz' | 'result';

export interface QuizState {
  category: Category | null;
  currentIndex: number;
  score: number;
  answers: (boolean | null)[];
  questions: QuizItem[];
  selectedChoices: (string | null)[];
  streak: number;
  maxStreak: number;
}

export interface BestScores {
  movies?: number;
  proverbs?: number;
  food?: number;
}
