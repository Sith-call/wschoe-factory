import { useState, useCallback } from 'react';

export interface GameRound {
  level: number;
  gridSize: number;
  baseColor: string;
  diffColor: string;
  diffIndex: number;
  colorDiff: number;
  foundInMs: number;
  success: boolean;
}

export interface GameResult {
  id: string;
  rounds: GameRound[];
  score: number;
  maxLevel: number;
  avgReactionMs: number;
  percentile: number;
  grade: string;
  gradeTitle: string;
  playedAt: string;
}

const RESULTS_KEY = 'color-sense-results';
const BEST_KEY = 'color-sense-best';
const MAX_RESULTS = 50;

function loadResults(): GameResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadBest(): number {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function useStorage() {
  const [results, setResults] = useState<GameResult[]>(loadResults);
  const [bestScore, setBestScore] = useState<number>(loadBest);

  const saveResult = useCallback(
    (result: GameResult) => {
      const updated = [result, ...loadResults()].slice(0, MAX_RESULTS);
      localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
      setResults(updated);

      if (result.score > loadBest()) {
        localStorage.setItem(BEST_KEY, String(result.score));
        setBestScore(result.score);
      }
    },
    []
  );

  return { results, bestScore, saveResult };
}
