import type { Joke } from "../types";
import { loadHistory, addToHistory, clearHistory } from "./history";

export function pickRandomJoke(allJokes: readonly Joke[]): Joke {
  const history = loadHistory();
  let candidates = allJokes.filter(
    (j) => !history.recentIds.includes(j.id)
  );

  if (candidates.length === 0) {
    clearHistory();
    candidates = [...allJokes];
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  addToHistory(picked.id);
  return picked;
}

export function hasSeenAll(allJokes: readonly Joke[]): boolean {
  const history = loadHistory();
  const uniqueSeen = new Set(history.recentIds);
  return allJokes.every((j) => uniqueSeen.has(j.id));
}
