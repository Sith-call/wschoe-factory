import { useState, useCallback, useRef, useEffect } from 'react';
import { generateRoundColors } from '../utils/color';
import { getGridSize, getTileCount } from '../utils/grid';
import { calculateRoundScore, calculatePercentile, getGrade } from '../utils/score';
import type { GameRound, GameResult } from './useStorage';

const MAX_ROUNDS = 20;
const ROUND_TIME_MS = 10000;

export type GamePhase =
  | 'idle'
  | 'playing'
  | 'correct'
  | 'wrong'
  | 'timeout'
  | 'gameOver';

interface RoundState {
  level: number;
  gridSize: number;
  baseColor: string;
  diffColor: string;
  diffIndex: number;
  colorDiff: number;
  tileCount: number;
}

export function useGame(onGameEnd: (result: GameResult) => void) {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [round, setRound] = useState<RoundState | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_MS);
  const [rounds, setRounds] = useState<GameRound[]>([]);

  const roundStartRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const gameActiveRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const startTimerAnimation = useCallback(() => {
    const tick = () => {
      if (!gameActiveRef.current) return;
      const elapsed = performance.now() - roundStartRef.current;
      const remaining = Math.max(0, ROUND_TIME_MS - elapsed);
      setTimeLeft(remaining);
      if (remaining > 0) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const handleTimeout = useCallback(
    (currentRound: RoundState, level: number) => {
      if (!gameActiveRef.current) return;
      clearTimers();
      setPhase('timeout');

      const failedRound: GameRound = {
        level,
        gridSize: currentRound.gridSize,
        baseColor: currentRound.baseColor,
        diffColor: currentRound.diffColor,
        diffIndex: currentRound.diffIndex,
        colorDiff: currentRound.colorDiff,
        foundInMs: ROUND_TIME_MS,
        success: false,
      };

      setRounds((prev) => [...prev, failedRound]);
    },
    [clearTimers]
  );

  const setupRound = useCallback((level: number) => {
    const gridSize = getGridSize(level);
    const tileCount = getTileCount(gridSize);
    const colors = generateRoundColors(level, tileCount);

    const newRound: RoundState = {
      level,
      gridSize,
      tileCount,
      ...colors,
    };

    setRound(newRound);
    setCurrentLevel(level);
    setTimeLeft(ROUND_TIME_MS);
    setPhase('playing');

    roundStartRef.current = performance.now();
    startTimerAnimation();

    // Timeout handler
    timerRef.current = window.setTimeout(() => {
      handleTimeout(newRound, level);
    }, ROUND_TIME_MS);
  }, [startTimerAnimation, handleTimeout]);

  const startGame = useCallback(() => {
    // Clean up any previous game state
    clearTimers();
    gameActiveRef.current = true;
    setScore(0);
    setRounds([]);
    setCurrentLevel(1);
    setPhase('idle');
    // Use setTimeout to ensure state is clean before starting
    setTimeout(() => {
      setupRound(1);
    }, 0);
  }, [setupRound, clearTimers]);

  const handleTileTap = useCallback(
    (tileIndex: number) => {
      if (phase !== 'playing' || !round) return;

      const reactionMs = performance.now() - roundStartRef.current;

      if (tileIndex === round.diffIndex) {
        // Correct — stop timers, record score, advance
        clearTimers();
        const roundScore = calculateRoundScore(reactionMs, round.level);
        setScore((prev) => prev + roundScore);
        setPhase('correct');

        const completedRound: GameRound = {
          level: round.level,
          gridSize: round.gridSize,
          baseColor: round.baseColor,
          diffColor: round.diffColor,
          diffIndex: round.diffIndex,
          colorDiff: round.colorDiff,
          foundInMs: Math.round(reactionMs),
          success: true,
        };

        setRounds((prev) => [...prev, completedRound]);

        // Next round or game over after brief feedback
        setTimeout(() => {
          if (!gameActiveRef.current) return;
          if (round.level >= MAX_ROUNDS) {
            setPhase('gameOver');
          } else {
            setupRound(round.level + 1);
          }
        }, 100);
      } else {
        // Wrong — brief red shake feedback, then continue same round
        // Do NOT stop timers — timer keeps running
        setPhase('wrong');

        // After 200ms shake animation, return to playing
        setTimeout(() => {
          if (!gameActiveRef.current) return;
          setPhase('playing');
        }, 200);
      }
    },
    [phase, round, clearTimers, setupRound]
  );

  // Finalize game when phase is gameOver or timeout (NOT wrong anymore)
  useEffect(() => {
    if (phase !== 'gameOver' && phase !== 'timeout') return;
    if (!gameActiveRef.current) return;

    // Mark game as inactive to prevent further callbacks
    gameActiveRef.current = false;

    // Build result after a render cycle so rounds state is updated
    const timer = setTimeout(() => {
      const currentRounds = rounds;
      const successRounds = currentRounds.filter((r) => r.success);
      const totalScore = successRounds.reduce(
        (sum, r) => sum + calculateRoundScore(r.foundInMs, r.level),
        0
      );

      const avgReaction =
        successRounds.length > 0
          ? Math.round(
              successRounds.reduce((s, r) => s + r.foundInMs, 0) /
                successRounds.length
            )
          : 0;

      const maxLevel = successRounds.length > 0
        ? Math.max(...successRounds.map((r) => r.level))
        : 0;

      const percentile = calculatePercentile(totalScore);
      const gradeInfo = getGrade(totalScore);

      const result: GameResult = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        rounds: currentRounds,
        score: totalScore,
        maxLevel,
        avgReactionMs: avgReaction,
        percentile,
        grade: gradeInfo.grade,
        gradeTitle: gradeInfo.title,
        playedAt: new Date().toISOString(),
      };

      onGameEnd(result);
    }, 0);

    return () => clearTimeout(timer);
  }, [phase, rounds, onGameEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      gameActiveRef.current = false;
    };
  }, [clearTimers]);

  return {
    phase,
    round,
    currentLevel,
    score,
    timeLeft,
    rounds,
    startGame,
    handleTileTap,
    maxRounds: MAX_ROUNDS,
    roundTimeMs: ROUND_TIME_MS,
  };
}
