import { ChallengeResult, ChallengeType } from './types';

const STORAGE_KEY = 'timing-challenge-results';

function loadResults(): ChallengeResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistResults(results: ChallengeResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function saveResult(result: ChallengeResult) {
  const results = loadResults();
  results.push(result);
  persistResults(results);
}

export function getBestResult(type: ChallengeType): ChallengeResult | null {
  const results = getResults(type);
  if (results.length === 0) return null;
  return results.reduce((best, r) => (r.score > best.score ? r : best), results[0]);
}

export function getResults(type: ChallengeType): ChallengeResult[] {
  return loadResults().filter((r) => r.type === type);
}

export function getTotalPlays(): number {
  return loadResults().length;
}
