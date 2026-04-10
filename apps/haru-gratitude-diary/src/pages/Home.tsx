import { useNavigate } from 'react-router-dom';
import { Settings, Plus } from 'lucide-react';
import { getAllEntries, getEntryByDate } from '../utils/storage';
import { generateDemoData } from '../utils/demo-data';
import {
  formatDateKorean,
  toDateString,
  getWeekDays,
} from '../utils/date-helpers';
import BottomNav from '../components/BottomNav';

const ENCOURAGEMENTS = [
  '오늘도 작은 감사를 발견해볼까요?',
  '30초면 충분해요. 오늘의 감사를 적어보세요.',
  '하루를 따뜻하게 마무리해요.',
  '작은 것에 감사하면 큰 것이 보여요.',
];

function getEncouragement(): string {
  const idx = new Date().getDate() % ENCOURAGEMENTS.length;
  return ENCOURAGEMENTS[idx];
}

function getStreakCount(entries: { date: string }[]): number {
  if (entries.length === 0) return 0;
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const d = new Date();
  while (true) {
    const ds = toDateString(d);
    if (dates.has(ds)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function Home() {
  const navigate = useNavigate();
  const today = new Date();
  const todayStr = toDateString(today);
  const todayEntry = getEntryByDate(todayStr);
  const allEntries = getAllEntries();

  const weekDays = getWeekDays(today);
  const weekRecorded = weekDays.filter((d) =>
    allEntries.some((e) => e.date === toDateString(d)),
  ).length;

  const weekMin3 = weekRecorded >= 3;
  const streak = getStreakCount(allEntries);

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <h1 className="text-lg font-semibold text-on-surface">
          {formatDateKorean(today)}
        </h1>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant"
          aria-label="설정"
        >
          <Settings size={20} />
        </button>
      </header>

      <main className="px-5 space-y-6">
        {/* Primary CTA — always visible */}
        {!todayEntry && (
          <section>
            <p className="text-sm text-on-surface-variant mb-3">
              {getEncouragement()}
            </p>
            <button
              onClick={() => navigate('/entry')}
              className="w-full bg-sage text-sage-light font-semibold py-4 rounded-xl text-base min-h-[52px] active:scale-[0.98] transition-transform"
            >
              {allEntries.length === 0
                ? '첫 감사를 기록해보세요'
                : '오늘의 감사 쓰기'}
            </button>
          </section>
        )}

        {/* Today's gratitude — shown after writing */}
        {todayEntry && (
          <section
            className="bg-surface-low border border-surface-high rounded-lg p-4 cursor-pointer"
            onClick={() => navigate(`/detail/${todayStr}`)}
            role="button"
            tabIndex={0}
            aria-label="오늘의 감사 보기"
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(`/detail/${todayStr}`);
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-on-surface-variant">오늘의 감사</p>
              {streak >= 2 && (
                <span className="text-xs font-medium text-sage">
                  {streak}일 연속 기록 중
                </span>
              )}
            </div>
            <ul className="space-y-2">
              {todayEntry.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-on-surface">
                  <span className="text-sage font-semibold shrink-0">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty state — demo data prompt */}
        {allEntries.length === 0 && (
          <section className="bg-surface-low border border-surface-high rounded-lg p-4 text-center">
            <p className="text-sm text-on-surface-variant mb-3">
              아직 기록이 없어요. 샘플 데이터로 먼저 체험해볼까요?
            </p>
            <button
              onClick={() => {
                generateDemoData();
                window.location.reload();
              }}
              className="text-sm font-semibold text-sage min-h-[44px] px-4 py-2"
            >
              샘플 데이터로 체험하기
            </button>
          </section>
        )}

        {/* Weekly progress */}
        <section>
          <p className="text-xs font-medium text-on-surface-variant mb-3">
            이번 주 {weekRecorded}/7일 기록
          </p>
          <div className="flex gap-2">
            {weekDays.map((d) => {
              const recorded = allEntries.some((e) => e.date === toDateString(d));
              const isT = toDateString(d) === todayStr;
              return (
                <div
                  key={toDateString(d)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    recorded
                      ? 'bg-sage text-sage-light font-medium'
                      : isT
                        ? 'border-2 border-sage text-sage'
                        : 'bg-surface-high text-on-surface-variant'
                  }`}
                  aria-label={`${toDateString(d)} ${recorded ? '기록 완료' : '미기록'}`}
                >
                  {d.getDate()}
                </div>
              );
            })}
          </div>
        </section>

        {/* Weekly reflection card */}
        <section className="bg-surface-low border border-surface-high rounded-lg p-4">
          {weekMin3 ? (
            <>
              <p className="text-sm font-medium text-on-surface mb-3">이번 주 회고</p>
              <button
                onClick={() => navigate('/weekly')}
                className="text-sm font-semibold text-sage min-h-[44px] py-2"
              >
                이번 주 회고 보기
              </button>
            </>
          ) : (
            <p className="text-sm text-on-surface-variant">
              {3 - weekRecorded}일 더 기록하면 주간 회고를 볼 수 있어요
            </p>
          )}
        </section>
      </main>

      {/* Floating CTA when today's entry exists — always accessible */}
      {todayEntry && (
        <div className="fixed bottom-24 left-1/2 w-full max-w-[430px] -translate-x-1/2 pointer-events-none z-40">
          <button
            onClick={() => navigate(`/entry?date=${todayStr}`)}
            className="absolute bottom-0 right-5 w-14 h-14 rounded-full bg-sage text-sage-light flex items-center justify-center shadow-lg active:scale-95 transition-transform pointer-events-auto"
            aria-label="감사 수정하기"
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
