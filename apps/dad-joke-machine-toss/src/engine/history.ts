import type { ViewHistory } from "../types";
import { getItem, setItem, removeItem } from "./storage";

const STORAGE_KEY = "djm-history";
const FAVORITES_KEY = "djm-favorites";
const DAILY_COUNT_KEY = "djm-daily-count";
const MAX_HISTORY = 40;

// --- History ---

export async function loadHistory(): Promise<ViewHistory> {
  try {
    const raw = await getItem(STORAGE_KEY);
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

export async function addToHistory(jokeId: number): Promise<void> {
  const history = await loadHistory();
  history.recentIds.push(jokeId);
  if (history.recentIds.length > MAX_HISTORY) {
    history.recentIds = history.recentIds.slice(-MAX_HISTORY);
  }
  history.lastUpdated = new Date().toISOString();
  await setItem(STORAGE_KEY, JSON.stringify(history));
}

export async function clearHistory(): Promise<void> {
  await removeItem(STORAGE_KEY);
}

// --- Daily Count ---

interface DailyCount {
  date: string;
  count: number;
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

async function loadDailyCount(): Promise<DailyCount> {
  try {
    const raw = await getItem(DAILY_COUNT_KEY);
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

export async function incrementDailyCount(): Promise<void> {
  const dc = await loadDailyCount();
  dc.count++;
  await setItem(DAILY_COUNT_KEY, JSON.stringify(dc));
}

export async function getTotalViewed(): Promise<number> {
  return (await loadDailyCount()).count;
}

// --- Favorites ---

export async function loadFavorites(): Promise<number[]> {
  try {
    const raw = await getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as number[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

async function saveFavorites(favs: number[]): Promise<void> {
  await setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export async function toggleFavorite(jokeId: number): Promise<boolean> {
  const favs = await loadFavorites();
  const idx = favs.indexOf(jokeId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    await saveFavorites(favs);
    return false;
  } else {
    favs.push(jokeId);
    await saveFavorites(favs);
    return true;
  }
}

export async function isFavorite(jokeId: number): Promise<boolean> {
  return (await loadFavorites()).includes(jokeId);
}

export async function removeFavorite(jokeId: number): Promise<void> {
  const favs = (await loadFavorites()).filter((id) => id !== jokeId);
  await saveFavorites(favs);
}
