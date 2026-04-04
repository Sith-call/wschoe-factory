import { AppState, TermProgress, MasteryLevel } from './types';

const STORAGE_KEY = 'econ-academy-v3';
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

function defaultProgress(termId: string): TermProgress {
  return { termId, readAt: null, quizPassed: false, labCompleted: false, masteryLevel: 0, lastReviewAt: null, nextReviewAt: null, reviewCount: 0 };
}

function defaultState(): AppState {
  return { progress: {}, streak: 0, lastStudyDate: null, quizAttempts: 0 };
}

export function loadState(): AppState {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return defaultState();
}

export function saveState(s: AppState) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

export function getProgress(s: AppState, id: string): TermProgress {
  return s.progress[id] ?? defaultProgress(id);
}

export function getMastery(p: TermProgress, hasLab: boolean): MasteryLevel {
  if (!p.readAt) return 0;
  if (!p.quizPassed) return 1;
  if (hasLab && !p.labCompleted) return 2;
  return 3;
}

function nextReview(from: string, count: number): string {
  const d = new Date(from);
  d.setDate(d.getDate() + REVIEW_INTERVALS[Math.min(count, REVIEW_INTERVALS.length - 1)]);
  return d.toISOString();
}

function updateProg(s: AppState, id: string, p: TermProgress): AppState {
  return { ...s, progress: { ...s.progress, [id]: p } };
}

export function markRead(s: AppState, id: string): AppState {
  const p = getProgress(s, id);
  const now = new Date().toISOString();
  return updateProg(s, id, { ...p, readAt: p.readAt ?? now, masteryLevel: Math.max(p.masteryLevel, 1) as MasteryLevel, lastReviewAt: now, nextReviewAt: nextReview(now, 0) });
}

export function markQuizPassed(s: AppState, id: string): AppState {
  const p = getProgress(s, id);
  const now = new Date().toISOString();
  return updateProg(s, id, { ...p, quizPassed: true, masteryLevel: Math.max(p.masteryLevel, 2) as MasteryLevel, lastReviewAt: now, nextReviewAt: nextReview(now, p.reviewCount), reviewCount: p.reviewCount + 1 });
}

export function markLabDone(s: AppState, id: string): AppState {
  const p = getProgress(s, id);
  const now = new Date().toISOString();
  return updateProg(s, id, { ...p, labCompleted: true, masteryLevel: 3, lastReviewAt: now, nextReviewAt: nextReview(now, p.reviewCount), reviewCount: p.reviewCount + 1 });
}

export function updateStreak(s: AppState): AppState {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (s.lastStudyDate === today) return s;
  return { ...s, streak: s.lastStudyDate === yesterday ? s.streak + 1 : 1, lastStudyDate: today };
}

export function getReviewIds(s: AppState): string[] {
  const now = new Date().toISOString();
  return Object.values(s.progress).filter(p => p.nextReviewAt && p.nextReviewAt <= now && p.readAt).map(p => p.termId);
}

export function resetState(): AppState { localStorage.removeItem(STORAGE_KEY); return defaultState(); }

export function catProgress(s: AppState, ids: string[]) {
  let read = 0, quiz = 0, master = 0;
  for (const id of ids) { const p = getProgress(s, id); if (p.masteryLevel >= 1) read++; if (p.masteryLevel >= 2) quiz++; if (p.masteryLevel >= 3) master++; }
  return { read, quiz, master, total: ids.length };
}

export function isCatUnlocked(s: AppState, prereqTermIds: string[][]): boolean {
  if (prereqTermIds.length === 0) return true;
  return prereqTermIds.every(ids => catProgress(s, ids).read >= 7);
}

export function isTermUnlocked(s: AppState, prereqs: string[]): boolean {
  if (prereqs.length === 0) return true;
  return prereqs.every(pid => getProgress(s, pid).readAt !== null);
}
