export type Category = '한식' | '중식' | '일식' | '양식' | '분식';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
}

export interface HistoryEntry {
  id: string;
  name: string;
  category: Category;
  timestamp: number;
}
