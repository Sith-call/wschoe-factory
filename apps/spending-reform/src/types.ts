export type SpendingType = 'cafe' | 'delivery' | 'impulse' | 'subscription' | 'taxi' | 'nightlife';
export type Category = 'cafe' | 'delivery' | 'shopping' | 'subscription' | 'transport' | 'nightlife';

export interface DiagnosisResult {
  type: SpendingType;
  scores: Record<Category, number>;
  estimatedWaste: number;
  completedAt: string;
}

export interface Challenge {
  id: string;
  type: SpendingType;
  title: string;
  rule: string;
  dailySaving: number;
  targetSaving: number;
  startDate: string;
  checkIns: CheckIn[];
  status: 'active' | 'completed' | 'abandoned';
  beforeScore: number;
  afterScore?: number;
}

export interface CheckIn {
  date: string;
  day: number;
  success: boolean;
}

export interface QuizQuestion {
  id: number;
  category: Category;
  categoryLabel: string;
  text: string;
  options: QuizOption[];
}

export interface QuizOption {
  text: string;
  score: number;
}

export interface SpendingTypeInfo {
  type: SpendingType;
  label: string;
  description: string;
  challengeTitle: string;
  challengeRule: string;
  dailySaving: number;
  targetSaving: number;
}

export type Screen =
  | 'intro'
  | 'quiz'
  | 'loading'
  | 'result'
  | 'challengeIntro'
  | 'challenge'
  | 'checkIn'
  | 'challengeComplete'
  | 'share'
  | 'history';
