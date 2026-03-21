import { DailyBoard } from './types';
import { situations } from './data/situations';

const STORAGE_KEY = 'office-bingo';
const HISTORY_KEY = 'office-bingo-history';

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateBoard(): DailyBoard {
  const shuffled = shuffle(situations);
  const selected = shuffled.slice(0, 25);
  const cells = selected.map((s) => s.id);
  const checked = new Array(25).fill(false);
  // Center cell (index 12) is always free
  checked[12] = true;

  return {
    date: getTodayString(),
    cells,
    checked,
    bingoCount: 0,
  };
}

export function getTodayBoard(): DailyBoard | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const board: DailyBoard = JSON.parse(raw);
    if (board.date !== getTodayString()) return null;
    return board;
  } catch {
    return null;
  }
}

export function saveTodayBoard(board: DailyBoard): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  // Also save to history
  saveToHistory(board);
}

function saveToHistory(board: DailyBoard): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: Record<string, DailyBoard> = raw ? JSON.parse(raw) : {};
    history[board.date] = board;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

function getHistory(): Record<string, DailyBoard> {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getStreak(): number {
  const history = getHistory();
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const board = history[key];
    if (board && board.bingoCount > 0) {
      streak++;
    } else if (i === 0) {
      // Today might not have a bingo yet, skip
      continue;
    } else {
      break;
    }
  }

  // Check if today has a bingo
  const todayKey = getTodayString();
  const todayBoard = history[todayKey];
  if (todayBoard && todayBoard.bingoCount > 0) {
    // Already counted
  }

  return streak;
}

export function getStats(): { totalDays: number; totalBingos: number; bestStreak: number } {
  const history = getHistory();
  const entries = Object.values(history);
  const totalDays = entries.length;
  const totalBingos = entries.reduce((sum, b) => sum + b.bingoCount, 0);

  // Calculate best streak
  const dates = Object.keys(history)
    .filter((k) => history[k].bingoCount > 0)
    .sort();

  let bestStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, currentStreak);
  }

  return { totalDays, totalBingos, bestStreak };
}

// Bingo line detection
export type BingoLine = number[]; // indices of cells in the line

const LINES: BingoLine[] = [
  // Horizontal
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Vertical
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonal
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export function detectBingoLines(checked: boolean[]): BingoLine[] {
  return LINES.filter((line) => line.every((i) => checked[i]));
}
