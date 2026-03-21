import { QuizResult } from './types';

const STORAGE_KEY = 'worth-calculator-results';

export function saveResult(result: QuizResult): void {
  const results = getResults();
  results.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function getResults(): QuizResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuizResult[];
  } catch {
    return [];
  }
}

export function getLatestResult(): QuizResult | null {
  const results = getResults();
  return results.length > 0 ? results[results.length - 1] : null;
}
