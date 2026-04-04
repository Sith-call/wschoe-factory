import type { Joke } from "../types";
import { loadHistory, addToHistory, clearHistory } from "./history";

export async function pickRandomJoke(allJokes: readonly Joke[]): Promise<Joke> {
  const history = await loadHistory();
  let candidates = allJokes.filter(
    (j) => !history.recentIds.includes(j.id)
  );

  if (candidates.length === 0) {
    await clearHistory();
    candidates = [...allJokes];
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  await addToHistory(picked.id);
  return picked;
}

export async function hasSeenAll(allJokes: readonly Joke[]): Promise<boolean> {
  const history = await loadHistory();
  const uniqueSeen = new Set(history.recentIds);
  return allJokes.every((j) => uniqueSeen.has(j.id));
}
