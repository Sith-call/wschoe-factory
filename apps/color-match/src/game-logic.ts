import type { Grade, RoundResult, GameResult } from './types';

export const TOTAL_ROUNDS = 10;

/**
 * Returns grid size for a given round (1-indexed).
 * Rounds 1-3: 3x3, Rounds 4-6: 4x4, Rounds 7-9: 5x5, Round 10: 6x6
 */
export function getGridSize(round: number): number {
  if (round <= 3) return 3;
  if (round <= 6) return 4;
  if (round <= 9) return 5;
  return 6;
}

/**
 * Returns the color difference delta for a given round.
 * Starts at 30 (easy) and decreases to 5 (hard) over 10 rounds.
 */
function getDelta(round: number): number {
  const maxDelta = 30;
  const minDelta = 5;
  const t = (round - 1) / (TOTAL_ROUNDS - 1);
  return Math.round(maxDelta - t * (maxDelta - minDelta));
}

/**
 * Generates a random base HSL color that looks good on white background.
 */
function randomBaseColor(): { h: number; s: number; l: number } {
  const h = Math.floor(Math.random() * 360);
  const s = 40 + Math.floor(Math.random() * 30); // 40-70%
  const l = 50 + Math.floor(Math.random() * 20); // 50-70%
  return { h, s, l };
}

function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export interface RoundColors {
  baseColor: string;
  oddColor: string;
  oddIndex: number;
  gridSize: number;
}

/**
 * Generate colors for a round. One cell has a different shade.
 */
export function generateRoundColors(round: number): RoundColors {
  const gridSize = getGridSize(round);
  const totalCells = gridSize * gridSize;
  const delta = getDelta(round);

  const base = randomBaseColor();
  const baseColor = hslToString(base.h, base.s, base.l);

  // Shift lightness (and sometimes hue) for the odd square
  const hueShift = Math.random() > 0.5 ? Math.floor(delta * 0.3) : 0;
  const lightnessShift = delta - hueShift;
  const direction = Math.random() > 0.5 ? 1 : -1;

  const oddH = (base.h + hueShift * direction + 360) % 360;
  const oddL = Math.max(20, Math.min(90, base.l + lightnessShift * direction));
  const oddColor = hslToString(oddH, base.s, oddL);

  const oddIndex = Math.floor(Math.random() * totalCells);

  return { baseColor, oddColor, oddIndex, gridSize };
}

/**
 * Calculate grade based on accuracy and average time per correct answer.
 */
export function calculateGrade(accuracy: number, avgTimeMs: number): Grade {
  // Weighted score: accuracy matters most, speed is a bonus
  const accuracyScore = accuracy * 100;
  const speedBonus = Math.max(0, 30 - avgTimeMs / 1000) * 2; // up to 60 bonus points for <30s avg
  const totalScore = accuracyScore + speedBonus;

  if (totalScore >= 140) return 'S';
  if (totalScore >= 120) return 'A';
  if (totalScore >= 90) return 'B';
  if (totalScore >= 60) return 'C';
  return 'D';
}

/**
 * Build final game result from round results.
 */
export function buildGameResult(rounds: RoundResult[]): GameResult {
  const correctRounds = rounds.filter((r) => r.correct);
  const totalTimeMs = rounds.reduce((sum, r) => sum + r.timeMs, 0);
  const accuracy = correctRounds.length / rounds.length;
  const avgTimeMs =
    correctRounds.length > 0
      ? correctRounds.reduce((sum, r) => sum + r.timeMs, 0) / correctRounds.length
      : 99999;
  const grade = calculateGrade(accuracy, avgTimeMs);

  return { rounds, totalTimeMs, accuracy, grade };
}
