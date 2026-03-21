export interface Question {
  id: number;
  emoji: string;
  question: string;
  options: Option[];
  category: string;
}

export interface Option {
  text: string;
  value: number;
  reaction: string;
}

export interface QuizResult {
  totalWorth: number;
  title: string;
  description: string;
  answers: { questionId: number; optionIndex: number }[];
  completedAt: string;
}
