import { EyeIcon } from './Icons';
import { getGrade } from '../utils/score';

interface IntroScreenProps {
  bestScore: number;
  hasHistory: boolean;
  onStart: () => void;
  onHistory: () => void;
}

export default function IntroScreen({
  bestScore,
  hasHistory,
  onStart,
  onHistory,
}: IntroScreenProps) {
  const bestGrade = bestScore > 0 ? getGrade(bestScore) : null;

  return (
    <div className="screen-enter min-h-screen bg-[#fafafa] flex flex-col items-center px-5 max-w-[480px] mx-auto">
      {/* Top spacing */}
      <div className="pt-12" />

      {/* Eye icon */}
      <div className="text-[#7c3aed]">
        <EyeIcon size={48} />
      </div>

      {/* Title */}
      <div className="mt-6 text-center">
        <h1
          className="text-[28px] font-bold text-[#18181b] leading-tight"
          style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
        >
          컬러 감각 테스트
        </h1>
        <p className="mt-2 text-base text-[#71717a]">
          다른 색 하나를 찾아보세요
        </p>
      </div>

      {/* Best score section */}
      {bestScore > 0 && bestGrade && (
        <div className="mt-8 w-full border-t border-[#e4e4e7] pt-4">
          <p className="text-[13px] text-[#71717a]">내 최고 기록</p>
          <p className="mt-1">
            <span
              className="text-[18px] font-semibold text-[#18181b] font-tabular"
              style={{ fontFamily: "'Archivo', system-ui" }}
            >
              {bestScore.toLocaleString()}점
            </span>
            <span className="ml-2 text-sm text-[#71717a]">
              {bestGrade.grade}등급
            </span>
            <span className="ml-1 text-sm text-[#71717a]">
              {bestGrade.percentileLabel}
            </span>
          </p>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA */}
      <div className="w-full pb-6">
        <button
          onClick={onStart}
          className="w-full py-3 bg-[#7c3aed] text-white font-semibold text-base rounded-md
                     hover:bg-[#6d28d9] active:bg-[#5b21b6] transition-colors"
          style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
        >
          시작하기
        </button>

        {hasHistory && (
          <button
            onClick={onHistory}
            className="w-full mt-3 min-h-[44px] py-2 text-sm text-[#7c3aed] underline underline-offset-2"
          >
            기록 보기
          </button>
        )}
      </div>
    </div>
  );
}
