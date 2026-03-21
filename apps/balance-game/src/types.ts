export interface Question {
  id: number;
  category: Category;
  optionA: string;
  optionB: string;
  percentA: number;
  percentB: number;
}

export type Category = '직장생활' | '연애' | '음식' | '돈' | '인생' | '극한선택';

export interface UserAnswer {
  questionId: number;
  choice: 'A' | 'B';
  answeredAt: string;
}

export interface GameStats {
  totalAnswered: number;
  streak: number;
  bestStreak: number;
  majorityCount: number;
}
