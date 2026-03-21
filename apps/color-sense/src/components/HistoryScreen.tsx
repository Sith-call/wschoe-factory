import { BackIcon } from './Icons';
import { getGrade, getGradeBadgeTextColor } from '../utils/score';
import type { GameResult } from '../hooks/useStorage';

interface HistoryScreenProps {
  results: GameResult[];
  bestScore: number;
  onBack: () => void;
  onRetry: () => void;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}.${day}`;
}

export default function HistoryScreen({
  results,
  bestScore,
  onBack,
  onRetry,
}: HistoryScreenProps) {
  const bestResult = results.find((r) => r.score === bestScore);
  const bestGrade = bestScore > 0 ? getGrade(bestScore) : null;

  // Stats
  const totalPlays = results.length;
  const avgScore =
    totalPlays > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / totalPlays)
      : 0;
  const maxLevel =
    totalPlays > 0 ? Math.max(...results.map((r) => r.maxLevel)) : 0;

  if (results.length === 0) {
    return (
      <div className="screen-enter min-h-screen bg-[#fafafa] flex flex-col px-5 max-w-[480px] mx-auto">
        {/* Header */}
        <div className="pt-4 flex items-center gap-2">
          <button onClick={onBack} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#18181b]">
            <BackIcon size={20} />
          </button>
          <h2
            className="text-lg font-semibold text-[#18181b]"
            style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
          >
            내 기록
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-base text-[#a1a1aa] text-center">
            아직 기록이 없어요
          </p>
          <p className="text-sm text-[#a1a1aa] text-center mt-1">
            첫 도전을 시작해보세요!
          </p>
          <button
            onClick={onRetry}
            className="mt-6 px-8 py-3 bg-[#7c3aed] text-white font-semibold rounded-md"
          >
            도전하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter min-h-screen bg-[#fafafa] flex flex-col px-5 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="pt-4 flex items-center gap-2">
        <button onClick={onBack} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#18181b]">
          <BackIcon size={20} />
        </button>
        <h2
          className="text-lg font-semibold text-[#18181b]"
          style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
        >
          내 기록
        </h2>
      </div>

      {/* Best score card */}
      {bestGrade && bestResult && (
        <div className="mt-6 bg-white border border-[#e4e4e7] rounded-xl p-5">
          <p className="text-[13px] text-[#a1a1aa] mb-2">최고 기록</p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: bestGrade.badgeColor }}
            >
              <span
                className="text-sm font-bold"
                style={{
                  fontFamily: "'Archivo', system-ui",
                  color: getGradeBadgeTextColor(bestGrade.grade),
                }}
              >
                {bestGrade.grade}
              </span>
            </div>
            <div>
              <p
                className="text-2xl font-semibold text-[#18181b] font-tabular"
                style={{ fontFamily: "'Archivo', system-ui" }}
              >
                {bestScore.toLocaleString()}점
              </p>
              <p className="text-sm text-[#71717a]">
                {bestGrade.percentileLabel} &middot; {formatDate(bestResult.playedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-[#18181b] mb-3">통계</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[13px] text-[#a1a1aa]">총 플레이</p>
            <p
              className="text-lg font-semibold text-[#18181b] font-tabular"
              style={{ fontFamily: "'Archivo', system-ui" }}
            >
              {totalPlays}회
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#a1a1aa]">평균 점수</p>
            <p
              className="text-lg font-semibold text-[#18181b] font-tabular"
              style={{ fontFamily: "'Archivo', system-ui" }}
            >
              {avgScore.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#a1a1aa]">최고 라운드</p>
            <p
              className="text-lg font-semibold text-[#18181b] font-tabular"
              style={{ fontFamily: "'Archivo', system-ui" }}
            >
              {maxLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-5 border-t border-[#e4e4e7]" />

      {/* Recent records */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-[#18181b] mb-3">최근 기록</p>
        <div className="hide-scrollbar overflow-y-auto" style={{ maxHeight: '320px' }}>
          {results.map((r, i) => {
            const g = getGrade(r.score);
            const isBest = r.score === bestScore;
            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 py-3 ${
                  i < results.length - 1 ? 'border-b border-[#f4f4f5]' : ''
                }`}
              >
                {/* Badge */}
                <div
                  className="w-7 h-7 flex items-center justify-center rounded"
                  style={{ backgroundColor: g.badgeColor }}
                >
                  <span
                    className="text-[13px] font-bold"
                    style={{
                      fontFamily: "'Archivo', system-ui",
                      color: getGradeBadgeTextColor(g.grade),
                    }}
                  >
                    {g.grade}
                  </span>
                </div>

                {/* Score + level */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-base font-medium text-[#18181b] font-tabular"
                      style={{ fontFamily: "'Archivo', system-ui" }}
                    >
                      {r.score.toLocaleString()}점
                    </span>
                    {isBest && (
                      <span className="text-[13px] font-medium bg-[#ede9fe] text-[#7c3aed] px-1.5 py-0.5 rounded-sm">
                        BEST
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-[#a1a1aa]">
                    R{r.maxLevel}
                  </span>
                </div>

                {/* Date */}
                <span
                  className="text-sm text-[#a1a1aa] font-tabular"
                  style={{ fontFamily: "'Archivo', system-ui" }}
                >
                  {formatDate(r.playedAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA */}
      <div className="w-full pb-6 pt-4">
        <button
          onClick={onRetry}
          className="w-full py-3 bg-[#7c3aed] text-white font-semibold rounded-md
                     hover:bg-[#6d28d9] active:bg-[#5b21b6] transition-colors"
          style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
        >
          다시 도전
        </button>
      </div>
    </div>
  );
}
