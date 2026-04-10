import type { GratitudeEntry } from '../types';

const ENTRIES_KEY = 'haru-gratitude-entries';
const ONBOARDING_KEY = 'haru-onboarding-seen';

export function getAllEntries(): GratitudeEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GratitudeEntry[];
  } catch {
    return [];
  }
}

export function getEntryByDate(date: string): GratitudeEntry | undefined {
  return getAllEntries().find((e) => e.date === date);
}

export function saveEntry(date: string, items: string[]): GratitudeEntry {
  const entries = getAllEntries();
  const now = new Date().toISOString();
  const existing = entries.find((e) => e.date === date);

  if (existing) {
    existing.items = items;
    existing.updatedAt = now;
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    return existing;
  }

  const newEntry: GratitudeEntry = {
    id: date,
    date,
    items,
    createdAt: now,
    updatedAt: now,
  };
  entries.push(newEntry);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  return newEntry;
}

export function deleteEntry(date: string): void {
  const entries = getAllEntries().filter((e) => e.date !== date);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function deleteAllEntries(): void {
  localStorage.removeItem(ENTRIES_KEY);
}

export function setEntriesBulk(entries: GratitudeEntry[]): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function isOnboardingSeen(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function markOnboardingSeen(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}
