export interface BingoCell {
  id: number;
  text: string;
  category: 'meeting' | 'lunch' | 'work' | 'people' | 'mood';
}

export interface DailyBoard {
  date: string; // YYYY-MM-DD
  cells: number[]; // 25 cell IDs in order
  checked: boolean[]; // 25 booleans
  bingoCount: number;
  completedAt?: string;
}
