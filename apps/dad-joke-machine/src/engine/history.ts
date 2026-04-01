import type { ViewHistory } from "../types";

const STORAGE_KEY = "djm-history";
const FAVORITES_KEY = "djm-favorites";
const MAX_HISTORY = 40;

export function loadHistory(): ViewHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { recentIds: [], lastUpdated: new Date().toISOString() };
    const parsed = JSON.parse(raw) as ViewHistory;
    if (!Array.isArray(parsed.recentIds)) {
      return { recentIds: [], lastUpdated: new Date().toISOString() };
    }
    return parsed;
  } catch {
    return { recentIds: [], lastUpdated: new Date().toISOString() };
  }
}

export function addToHistory(jokeId: number): void {
  const history = loadHistory();
  history.recentIds.push(jokeId);
  if (history.recentIds.length > MAX_HISTORY) {
    history.recentIds = history.recentIds.slice(-MAX_HISTORY);
  }
  history.lastUpdated = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage unavailable — continue without persistence
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const DAILY_COUNT_KEY = "djm-daily-count";

interface DailyCount {
  date: string;
  count: number;
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function loadDailyCount(): DailyCount {
  try {
    const raw = localStorage.getItem(DAILY_COUNT_KEY);
    if (!raw) return { date: getTodayString(), count: 0 };
    const parsed = JSON.parse(raw) as DailyCount;
    if (parsed.date !== getTodayString()) {
      return { date: getTodayString(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: getTodayString(), count: 0 };
  }
}

function saveDailyCount(dc: DailyCount): void {
  try {
    localStorage.setItem(DAILY_COUNT_KEY, JSON.stringify(dc));
  } catch {
    // ignore
  }
}

export function incrementDailyCount(): void {
  const dc = loadDailyCount();
  dc.count++;
  saveDailyCount(dc);
}

export function getTotalViewed(): number {
  return loadDailyCount().count;
}

// === Favorites ===

export function loadFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as number[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function toggleFavorite(jokeId: number): boolean {
  const favs = loadFavorites();
  const idx = favs.indexOf(jokeId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    saveFavorites(favs);
    return false;
  } else {
    favs.push(jokeId);
    saveFavorites(favs);
    return true;
  }
}

export function isFavorite(jokeId: number): boolean {
  return loadFavorites().includes(jokeId);
}

export function removeFavorite(jokeId: number): void {
  const favs = loadFavorites().filter((id) => id !== jokeId);
  saveFavorites(favs);
}

function saveFavorites(favs: number[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch {
    // ignore
  }
}
