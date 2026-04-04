export type CategoryId =
  | 'fundamentals'
  | 'market-price'
  | 'consumer-producer'
  | 'market-failure'
  | 'national-economy'
  | 'growth-productivity'
  | 'money-finance'
  | 'macro-fluctuation'
  | 'macro-policy'
  | 'international';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MasteryLevel = 0 | 1 | 2 | 3;

export interface Term {
  id: string;
  korean: string;
  english: string;
  definition: string;
  explanation: string;
  category: CategoryId;
  difficulty: Difficulty;
  prerequisites: string[];
  hasLab: boolean;
  keyPoints: string[];
  realWorldExample: string;
  newsConnection: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  order: number;
  prerequisiteCategories: CategoryId[];
}

export interface Quiz {
  termId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  type: 'definition' | 'relationship' | 'scenario';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TermProgress {
  termId: string;
  readAt: string | null;
  quizPassed: boolean;
  labCompleted: boolean;
  masteryLevel: MasteryLevel;
  lastReviewAt: string | null;
  nextReviewAt: string | null;
  reviewCount: number;
}

export interface AppState {
  progress: Record<string, TermProgress>;
  streak: number;
  lastStudyDate: string | null;
  quizAttempts: number;
}

export type Screen =
  | { type: 'home' }
  | { type: 'categories' }
  | { type: 'termList'; categoryId: CategoryId }
  | { type: 'termCard'; termId: string }
  | { type: 'quiz'; termId: string }
  | { type: 'lab'; termId: string }
  | { type: 'progress' }
  | { type: 'search' }
  | { type: 'settings' }
  | { type: 'mindmap' }
  | { type: 'labList' };
