import { useState, useEffect, useRef } from 'react';
import { getGrade, getGradeBadgeTextColor } from '../utils/score';
import type { GameResult } from '../hooks/useStorage';

interface ResultScreenProps {
  result: GameResult;
  previousBest: number;
  onShare: () => void;
  onRetry: () => void;
  onHistory: () => void;
}

export default function ResultScreen({
  result,
  previousBest,
  onShare,
  onRetry,
  onHistory,
}: ResultScreenProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [showPercentile, setShowPercentile] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const animRef = useRef<number | null>(null);

  const gradeInfo = getGrade(result.score);
  const isNewBest = result.score > previousBest;
  const avgReactionSec = (result.avgReactionMs / 1000).toFixed(1);

  // Count-up animation
  useEffect(() => {
    const duration = 800;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * result.score));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayScore(result.score);
        // Sequence remaining reveals
        setTimeout(() => setShowBadge(true), 100);
        setTimeout(() => setShowPercentile(true), 300);
        setTimeout(() => setShowRest(true), 500);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [result.score]);

  return (
    <div className="screen-enter min-h-screen bg-[#fafafa] flex flex-col px-5 max-w-[480px] mx-auto">
      {/* Header label */}
      <div className="pt-8">
        <p className="text-sm text-[#a1a1aa]">당신의 색 감각</p>
      </div>

      {/* Score card */}
      <div className="mt-2 bg-white border border-[#e4e4e7] rounded-xl p-6">
        {/* Score */}
        <div className="flex items-baseline gap-1">
          <span
            className="text-5xl font-bold text-[#18181b] font-tabular"
            style={{ fontFamily: "'Archivo', system-ui" }}
          >
            {displayScore.toLocaleString()}
          </span>
          <span className="text-xl text-[#71717a]">점</span>
        </div>

        {/* Badge + title */}
        {showBadge && (
          <div className="badge-enter mt-4 flex items-center gap-3">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: gradeInfo.badgeColor }}
            >
              <span
                className="text-xl font-bold font-tabular"
                style={{
                  fontFamily: "'Archivo', system-ui",
                  color: getGradeBadgeTextColor(gradeInfo.grade),
                }}
              >
                {gradeInfo.grade}
              </span>
            </div>
            <span
              className="text-xl font-semibold text-[#18181b]"
              style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
            >
              {gradeInfo.title}
            </span>
          </div>
        )}

        {/* Percentile */}
        {showPercentile && (
          <p className="mt-3 text-lg font-semibold text-[#71717a]">
            상위 {result.percentile}%
          </p>
        )}
      </div>

      {/* New best banner */}
      {isNewBest && showRest && (
        <div className="badge-enter mt-4 bg-[#ede9fe] text-[#7c3aed] text-sm font-semibold px-3 py-1.5 rounded-md">
          NEW BEST! 이전보다 +{(result.score - previousBest).toLocaleString()}점
        </div>
      )}

      {/* Stats */}
      {showRest && (
        <div className="mt-6">
          {/* Stat rows */}
          <div className="border-b border-[#e4e4e7] py-3 flex justify-between">
            <span className="text-sm text-[#71717a]">클리어 레벨</span>
            <span
              className="text-sm font-semibold text-[#18181b] font-tabular"
              style={{ fontFamily: "'Archivo', system-ui" }}
            >
              Lv.{result.maxLevel}
            </span>
          </div>
          <div className="border-b border-[#e4e4e7] py-3 flex justify-between">
            <span className="text-sm text-[#71717a]">평균 반응</span>
            <span
              className="text-sm font-semibold text-[#18181b] font-tabular"
              style={{ fontFamily: "'Archivo', system-ui" }}
            >
              {avgReactionSec}초
            </span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-sm text-[#71717a]">총 라운드</span>
            <span
              className="text-sm font-semibold text-[#18181b] font-tabular"
              style={{ fontFamily: "'Archivo', system-ui" }}
            >
              {result.rounds.length}라운드
            </span>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Buttons */}
      <div className="w-full pb-6">
        <button
          onClick={onRetry}
          className="w-full py-3 bg-[#7c3aed] text-white font-semibold rounded-md
                     hover:bg-[#6d28d9] active:bg-[#5b21b6] transition-colors"
          style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
        >
          다시 도전
        </button>

        <button
          onClick={onShare}
          className="w-full mt-2.5 py-3 border border-[#e4e4e7] text-[#18181b] font-medium rounded-md
                     hover:bg-[#fafafa] transition-colors"
          style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
        >
          결과 공유
        </button>

        <button
          onClick={onHistory}
          className="w-full mt-3 min-h-[44px] py-2 text-sm text-[#7c3aed] underline underline-offset-2"
        >
          기록 보기
        </button>

        <p className="mt-4 text-[13px] text-[#a1a1aa] text-center">
          이 테스트는 의학적 진단이 아닙니다.
        </p>
      </div>
    </div>
  );
}
