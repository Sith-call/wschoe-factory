import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { RoundResult, GameResult } from '../types';
import { TOTAL_ROUNDS, generateRoundColors, buildGameResult } from '../game-logic';
import type { RoundColors } from '../game-logic';

function getDifficultyLabel(round: number): { text: string; color: string } {
  if (round <= 3) return { text: '쉬움', color: 'text-green-500' };
  if (round <= 6) return { text: '보통', color: 'text-amber-500' };
  if (round <= 9) return { text: '어려움', color: 'text-orange-500' };
  return { text: '극한', color: 'text-red-500' };
}

interface GameScreenProps {
  onFinish: (result: GameResult) => void;
}

export default function GameScreen({ onFinish }: GameScreenProps) {
  const [round, setRound] = useState(1);
  const [roundColors, setRoundColors] = useState<RoundColors | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [feedback, setFeedback] = useState<{ index: number; correct: boolean } | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const roundStartRef = useRef<number>(Date.now());
  const timerRef = useRef<number>(0);

  // Generate colors for current round
  useEffect(() => {
    const colors = generateRoundColors(round);
    setRoundColors(colors);
    setFeedback(null);
    roundStartRef.current = Date.now();
  }, [round]);

  // Timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setElapsedMs(Date.now() - roundStartRef.current);
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [round]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (!roundColors || feedback) return;

      clearInterval(timerRef.current);
      const timeMs = Date.now() - roundStartRef.current;
      const correct = index === roundColors.oddIndex;

      setFeedback({ index, correct });

      const roundResult: RoundResult = {
        round,
        correct,
        timeMs,
        gridSize: roundColors.gridSize,
      };

      const newResults = [...results, roundResult];
      setResults(newResults);

      // Delay before next round
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          onFinish(buildGameResult(newResults));
        } else {
          setRound((r) => r + 1);
          setElapsedMs(0);
        }
      }, 600);
    },
    [roundColors, feedback, round, results, onFinish],
  );

  const difficulty = useMemo(() => getDifficultyLabel(round), [round]);

  if (!roundColors) return null;

  const { baseColor, oddColor, oddIndex, gridSize } = roundColors;
  const totalCells = gridSize * gridSize;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${seconds}.${tenths}s`;
  };

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400 font-medium">
          라운드 <span className="text-gray-900 font-semibold">{round}</span> / {TOTAL_ROUNDS}
          <span className={`ml-2 text-xs font-semibold ${difficulty.color}`} aria-label={`난이도: ${difficulty.text}`}>
            {difficulty.text}
          </span>
        </div>
        <div className="text-sm text-gray-400 font-medium tabular-nums" aria-label={`경과 시간 ${formatTime(elapsedMs)}`}>
          {formatTime(elapsedMs)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((round - 1) / TOTAL_ROUNDS) * 100}%` }}
        />
      </div>

      {/* Grid */}
      <div
        className="grid gap-2 w-full animate-card-enter"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          maxWidth: `${Math.min(gridSize * 72, 360)}px`,
        }}
        key={round}
      >
        {Array.from({ length: totalCells }, (_, i) => {
          const isOdd = i === oddIndex;
          const color = isOdd ? oddColor : baseColor;

          let extraClass = '';
          if (feedback) {
            if (feedback.index === i && feedback.correct) {
              extraClass = 'animate-correct ring-2 ring-green-400';
            } else if (feedback.index === i && !feedback.correct) {
              extraClass = 'animate-wrong animate-haptic ring-2 ring-red-400';
            } else if (isOdd && !feedback.correct) {
              // Highlight the correct answer when wrong
              extraClass = 'ring-2 ring-green-400';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={!!feedback}
              className={`aspect-square rounded-md cursor-pointer transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-teal-400 focus-visible:outline-offset-2 ${extraClass}`}
              style={{ backgroundColor: color }}
              aria-label={`${gridSize}x${gridSize} 격자 칸 ${i + 1}`}
            />
          );
        })}
      </div>

      {/* Hint text */}
      <p className="text-xs text-gray-400 mt-6" aria-live="polite">
        다른 색을 가진 칸을 터치하세요
      </p>

      {/* Round results dots */}
      <div className="flex gap-1.5 mt-4" aria-label="라운드 진행 현황" role="group">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
          const r = results[i];
          let bgColor = 'bg-gray-200';
          let dotLabel = `라운드 ${i + 1}: 대기`;
          if (r) {
            bgColor = r.correct ? 'bg-green-400' : 'bg-red-400';
            dotLabel = `라운드 ${i + 1}: ${r.correct ? '정답' : '오답'}`;
          } else if (i === round - 1) {
            bgColor = 'bg-primary';
            dotLabel = `라운드 ${i + 1}: 진행 중`;
          }
          return (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${bgColor}`}
              aria-label={dotLabel}
            />
          );
        })}
      </div>
    </div>
  );
}
