import { useMemo } from 'react';
import { ClockIcon } from './Icons';
import { getGridClass } from '../utils/grid';
import type { GamePhase } from '../hooks/useGame';

interface RoundData {
  level: number;
  gridSize: number;
  baseColor: string;
  diffColor: string;
  diffIndex: number;
  tileCount: number;
}

interface GameScreenProps {
  phase: GamePhase;
  round: RoundData;
  currentLevel: number;
  score: number;
  timeLeft: number;
  maxRounds: number;
  roundTimeMs: number;
  onTileTap: (index: number) => void;
}

export default function GameScreen({
  phase,
  round,
  currentLevel,
  timeLeft,
  maxRounds,
  roundTimeMs,
  onTileTap,
}: GameScreenProps) {
  const gridClass = getGridClass(round.gridSize);
  const timerFraction = timeLeft / roundTimeMs;
  const timerSeconds = (timeLeft / 1000).toFixed(1);

  // Timer color based on remaining time
  const timerColorClass = useMemo(() => {
    if (timeLeft <= 1000) return 'text-[#ef4444]';
    if (timeLeft <= 3000) return 'text-[#f59e0b]';
    return 'text-[#a1a1aa]';
  }, [timeLeft]);

  const tiles = useMemo(() => {
    return Array.from({ length: round.tileCount }, (_, i) => {
      const isDiff = i === round.diffIndex;
      const color = isDiff ? round.diffColor : round.baseColor;
      return { index: i, color, isDiff };
    });
  }, [round]);

  const showCorrectHighlight = phase === 'correct';
  const showWrongShake = phase === 'wrong';
  const showTimeoutHighlight = phase === 'timeout';

  return (
    <div className="screen-enter min-h-screen bg-[#1e1b2e] flex flex-col px-4 max-w-[480px] mx-auto">
      {/* HUD: top bar */}
      <div className="pt-4 pb-2 flex items-center justify-between">
        {/* Level */}
        <span className="text-sm text-[#a1a1aa]">
          Lv.{currentLevel}
        </span>

        {/* Timer */}
        <div className={`flex items-center gap-1 ${timerColorClass}`}>
          <ClockIcon size={14} />
          <span
            className="text-sm font-tabular"
            style={{ fontFamily: "'Archivo', system-ui" }}
          >
            {timerSeconds}s
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#2d2a3e] rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-[#7c3aed] transition-all duration-200"
          style={{ width: `${(currentLevel / maxRounds) * 100}%` }}
        />
      </div>

      {/* Round indicator */}
      <div className="text-center mb-4">
        <span
          className="text-[13px] text-[#71717a]"
          style={{ fontFamily: "'Archivo', system-ui" }}
        >
          {currentLevel} / {maxRounds}
        </span>
      </div>

      {/* Guide text — first round only */}
      {currentLevel === 1 && phase === 'playing' && (
        <p className="text-center text-sm text-[#71717a] mb-4">
          다른 색 타일을 찾으세요
        </p>
      )}

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`game-grid ${gridClass} w-full ${showWrongShake ? 'tile-wrong' : ''}`}
          style={{ maxWidth: '400px' }}
        >
          {tiles.map((tile) => (
            <button
              key={tile.index}
              className={`game-tile ${
                showCorrectHighlight && tile.isDiff ? 'tile-correct' : ''
              } ${
                showTimeoutHighlight && tile.isDiff
                  ? 'ring-2 ring-[#ef4444]'
                  : ''
              }`}
              style={{ backgroundColor: tile.color }}
              onClick={() => onTileTap(tile.index)}
              disabled={phase !== 'playing'}
              aria-label={`타일 ${tile.index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Timer bar */}
      <div className="mt-6 mb-6 w-full">
        <div className="w-full h-1.5 bg-[#2d2a3e] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              timeLeft <= 1000
                ? 'bg-[#ef4444]'
                : timeLeft <= 3000
                ? 'bg-[#f59e0b]'
                : 'bg-[#a1a1aa]'
            }`}
            style={{ width: `${timerFraction * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
