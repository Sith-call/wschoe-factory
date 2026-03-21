import { useEffect, useMemo } from 'react';
import type { GameResult, Grade } from '../types';

interface BestRecord {
  bestTimeMs: number;
  bestGrade: Grade;
}

const gradeRank: Record<Grade, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };

function saveBestRecord(result: GameResult): void {
  try {
    const raw = localStorage.getItem('color-match-best');
    const prev: BestRecord | null = raw ? JSON.parse(raw) : null;
    const isBetter =
      !prev ||
      gradeRank[result.grade] > gradeRank[prev.bestGrade] ||
      (gradeRank[result.grade] === gradeRank[prev.bestGrade] && result.totalTimeMs < prev.bestTimeMs);
    if (isBetter) {
      localStorage.setItem(
        'color-match-best',
        JSON.stringify({ bestTimeMs: result.totalTimeMs, bestGrade: result.grade }),
      );
    }
  } catch {
    // localStorage unavailable
  }
}

interface ResultScreenProps {
  result: GameResult;
  onRestart: () => void;
  onHome: () => void;
}

const gradeConfig: Record<Grade, { label: string; color: string; bg: string; desc: string }> = {
  S: { label: 'S', color: 'text-primary', bg: 'bg-teal-50', desc: '최고의 색감!' },
  A: { label: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: '뛰어난 색감입니다' },
  B: { label: 'B', color: 'text-blue-600', bg: 'bg-blue-50', desc: '좋은 색감이에요' },
  C: { label: 'C', color: 'text-amber-600', bg: 'bg-amber-50', desc: '나쁘지 않아요' },
  D: { label: 'D', color: 'text-gray-500', bg: 'bg-gray-50', desc: '조금 더 연습해보세요' },
};

function formatMs(ms: number): string {
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}초`;
}

const CONFETTI_COLORS = ['#2dd4bf', '#34d399', '#fbbf24', '#f472b6', '#818cf8', '#fb923c'];

function ConfettiCelebration() {
  const dots = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: `${Math.random() * 1.2}s`,
        duration: `${1.5 + Math.random() * 1.5}s`,
        size: `${6 + Math.random() * 6}px`,
      })),
    [],
  );

  return (
    <div className="confetti-container" aria-hidden="true">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="confetti-dot"
          style={{
            left: dot.left,
            backgroundColor: dot.color,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
            width: dot.size,
            height: dot.size,
          }}
        />
      ))}
    </div>
  );
}

export default function ResultScreen({ result, onRestart, onHome }: ResultScreenProps) {
  const { grade, accuracy, totalTimeMs, rounds } = result;
  const config = gradeConfig[grade];
  const correctCount = rounds.filter((r) => r.correct).length;
  const showConfetti = grade === 'S' || grade === 'A';

  useEffect(() => {
    saveBestRecord(result);
  }, [result]);

  return (
    <div className="flex flex-col items-center px-6 py-10 max-w-sm mx-auto w-full">
      {showConfetti && <ConfettiCelebration />}
      <p className="text-sm text-gray-400 font-medium mb-4">테스트 결과</p>

      {/* Grade card */}
      <div className={`${config.bg} rounded-xl p-8 w-full text-center mb-6 animate-card-enter`}>
        <div className={`font-heading text-7xl font-bold ${config.color} mb-2`}>
          {config.label}
        </div>
        <p className="text-base text-gray-700 font-medium">{config.desc}</p>
      </div>

      {/* Stats */}
      <div className="w-full grid grid-cols-3 gap-3 mb-8">
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">정확도</p>
          <p className="text-lg font-semibold text-gray-900">
            {Math.round(accuracy * 100)}%
          </p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">정답</p>
          <p className="text-lg font-semibold text-gray-900">
            {correctCount}/{rounds.length}
          </p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">총 시간</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatMs(totalTimeMs)}
          </p>
        </div>
      </div>

      {/* Round details */}
      <div className="w-full mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-3">라운드별 기록</p>
        <div className="space-y-1.5">
          {rounds.map((r) => (
            <div
              key={r.round}
              className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    r.correct ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  R{r.round}{' '}
                  <span className="text-gray-400">({r.gridSize}x{r.gridSize})</span>
                </span>
              </div>
              <span className="text-sm text-gray-500 tabular-nums">
                {r.correct ? formatMs(r.timeMs) : '오답'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={onRestart}
          className="w-full bg-primary text-white font-semibold text-base py-3.5 rounded-lg active:scale-[0.97] transition-transform"
          aria-label="게임 다시 하기"
        >
          다시 하기
        </button>
        <button
          onClick={onHome}
          className="w-full bg-gray-100 text-gray-600 font-medium text-base py-3.5 rounded-lg active:scale-[0.97] transition-transform"
          aria-label="시작 화면으로 돌아가기"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}
