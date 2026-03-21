export type Screen = 'start' | 'game' | 'result';

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface RoundResult {
  round: number;
  correct: boolean;
  timeMs: number;
  gridSize: number;
}

export interface GameResult {
  rounds: RoundResult[];
  totalTimeMs: number;
  accuracy: number;
  grade: Grade;
}
