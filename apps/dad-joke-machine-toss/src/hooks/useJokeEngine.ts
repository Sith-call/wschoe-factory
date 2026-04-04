import { useState, useCallback, useRef } from "react";
import type { Joke, AppPhase } from "../types";
import { jokes } from "../data/jokes";
import { pickRandomJoke, hasSeenAll } from "../engine/joke-picker";
import {
  incrementDailyCount,
  getTotalViewed,
  clearHistory,
  toggleFavorite as toggleFav,
  isFavorite as checkFav,
  loadFavorites,
  removeFavorite as removeFav,
} from "../engine/history";
import { haptic, copyToClipboard, shareText } from "../engine/native";

const LAUGH_REACTIONS = [
  "ㅋㅋㅋㅋㅋ",
  "푸하하핫",
  "아..ㅋㅋㅋ",
  "헐ㅋㅋㅋㅋ",
  "ㅎㅎㅎㅎㅎ",
  "크큭ㅋㅋ",
  "빵 터졌다",
  "아 왜 웃기지",
  "ㅋㅋ 아재다",
  "아놔ㅋㅋㅋ",
];

export function useJokeEngine() {
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [showPunchline, setShowPunchline] = useState(false);
  const [reaction, setReaction] = useState("");
  const [dailyCount, setDailyCount] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [favorites, setFavorites] = useState<Joke[]>([]);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateDailyCount = useCallback(async () => {
    const count = await getTotalViewed();
    setDailyCount(count);
  }, []);

  const dispenseJoke = useCallback(async () => {
    setPhase("loading");
    setShowPunchline(false);
    setReaction("");
    if (reactionTimer.current) clearTimeout(reactionTimer.current);

    haptic("tap");

    await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));

    if (await hasSeenAll(jokes)) {
      setPhase("clear");
      haptic("confetti");
      return;
    }

    const joke = await pickRandomJoke(jokes);
    setCurrentJoke(joke);
    setPhase("showing-setup");

    const fav = await checkFav(joke.id);
    setIsFav(fav);
  }, []);

  const revealPunchline = useCallback(async () => {
    if (phase !== "showing-setup" || !currentJoke) return;
    setShowPunchline(true);
    setPhase("showing-punchline");
    haptic("success");

    reactionTimer.current = setTimeout(() => {
      setReaction(
        LAUGH_REACTIONS[Math.floor(Math.random() * LAUGH_REACTIONS.length)]
      );
    }, 500);

    await incrementDailyCount();
    await updateDailyCount();
  }, [phase, currentJoke, updateDailyCount]);

  const toggleFavorite = useCallback(async (): Promise<boolean> => {
    if (!currentJoke) return false;
    const isNow = await toggleFav(currentJoke.id);
    setIsFav(isNow);
    if (isNow) haptic("tap");
    return isNow;
  }, [currentJoke]);

  const copyJoke = useCallback(async (): Promise<boolean> => {
    if (!currentJoke) return false;
    const text = `${currentJoke.setup}\n${currentJoke.punchline}`;
    return copyToClipboard(text);
  }, [currentJoke]);

  const shareJoke = useCallback(async () => {
    if (!currentJoke) return;
    const text = `${currentJoke.setup}\n${currentJoke.punchline}\n\n— 아재개그 자판기`;
    await shareText(text);
  }, [currentJoke]);

  const resetAll = useCallback(async () => {
    await clearHistory();
    setPhase("idle");
    setCurrentJoke(null);
    setShowPunchline(false);
    setReaction("");
    await updateDailyCount();
  }, [updateDailyCount]);

  const openFavorites = useCallback(async () => {
    const favIds = await loadFavorites();
    const favJokes = favIds
      .map((id) => jokes.find((j) => j.id === id))
      .filter((j): j is Joke => j !== undefined);
    setFavorites(favJokes);
    setPhase("favorites");
  }, []);

  const removeFavorite = useCallback(async (jokeId: number) => {
    await removeFav(jokeId);
    const favIds = await loadFavorites();
    const favJokes = favIds
      .map((id) => jokes.find((j) => j.id === id))
      .filter((j): j is Joke => j !== undefined);
    setFavorites(favJokes);
  }, []);

  const goHome = useCallback(() => {
    setPhase("idle");
    setCurrentJoke(null);
    setShowPunchline(false);
    setReaction("");
  }, []);

  return {
    phase,
    currentJoke,
    showPunchline,
    reaction,
    dailyCount,
    isFav,
    favorites,
    dispenseJoke,
    revealPunchline,
    toggleFavorite,
    copyJoke,
    shareJoke,
    resetAll,
    openFavorites,
    removeFavorite,
    goHome,
    updateDailyCount,
  };
}
