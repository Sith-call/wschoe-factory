import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllEntries } from '../utils/storage';
import {
  getWeekDays,
  getWeekRangeLabel,
  toDateString,
  formatDateKorean,
  addWeeks,
  subWeeks,
} from '../utils/date-helpers';
import type { GratitudeEntry } from '../types';

function extractKeywords(entries: GratitudeEntry[]): { word: string; count: number }[] {
  const freq = new Map<string, number>();
  const stopWords = new Set([
    '오늘', '이', '그', '저', '것', '수', '때', '더', '한', '잘', '좀', '또',
    '너무', '정말', '아주', '매우', '되다', '하다', '있다', '없다', '같다',
    '에서', '으로', '에게', '부터', '까지', '이다', '했다', '있었다', '됐다',
  ]);

  for (const entry of entries) {
    for (const item of entry.items) {
      const words = item
        .replace(/[.,!?~]/g, '')
        .split(/\s+/)
        .filter((w) => w.length >= 2 && !stopWords.has(w));
      for (const word of words) {
        freq.set(word, (freq.get(word) || 0) + 1);
      }
    }
  }

  return Array.from(freq.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));
}

function generateInsight(keywords: { word: string; count: number }[]): string {
  if (keywords.length === 0) return '';
  const top = keywords[0];
  return `이번 주, 당신은 '${top.word}'에서 가장 많은 감사를 느꼈어요`;
}

export default function WeeklyReflection() {
  const navigate = useNavigate();
  const [weekAnchor, setWeekAnchor] = useState(new Date());
  const allEntries = getAllEntries();

  const weekDays = useMemo(() => getWeekDays(weekAnchor), [weekAnchor]);
  const weekLabel = useMemo(() => getWeekRangeLabel(weekAnchor), [weekAnchor]);

  const weekEntries = useMemo(() => {
    const dateSet = new Set(weekDays.map((d) => toDateString(d)));
    return allEntries.filter((e) => dateSet.has(e.date));
  }, [weekDays, allEntries]);

  const daysRecorded = weekEntries.length;
  const totalItems = weekEntries.reduce((sum, e) => sum + e.items.length, 0);
  const keywords = useMemo(() => extractKeywords(weekEntries), [weekEntries]);
  const insight = useMemo(() => generateInsight(keywords), [keywords]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <button
            onClick={() => setWeekAnchor((w) => subWeeks(w, 1))}
            className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant"
            aria-label="이전 주"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-on-surface">{weekLabel}</span>
          <button
            onClick={() => setWeekAnchor((w) => addWeeks(w, 1))}
            className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant"
            aria-label="다음 주"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="w-11" />
      </header>

      <main className="flex-1 px-5 pt-4 pb-10 space-y-6">
        {weekEntries.length === 0 ? (
          /* Empty week */
          <div className="pt-16 text-center">
            <p className="text-sm text-on-surface-variant mb-4">
              이 주에는 기록이 없어요
            </p>
            <button
              onClick={() => navigate('/entry')}
              className="text-sm font-semibold text-sage"
            >
              오늘부터 시작해볼까요?
            </button>
          </div>
        ) : (
          <>
            {/* Summary */}
            <section className="flex gap-4">
              <div className="bg-surface-low border border-surface-high rounded-lg p-4 flex-1">
                <p className="text-2xl font-bold text-sage">{daysRecorded}</p>
                <p className="text-sm text-on-surface-variant mt-1">7일 중 기록</p>
              </div>
              <div className="bg-surface-low border border-surface-high rounded-lg p-4 flex-1">
                <p className="text-2xl font-bold text-sage">{totalItems}</p>
                <p className="text-sm text-on-surface-variant mt-1">개의 감사</p>
              </div>
            </section>

            {/* Keywords */}
            {keywords.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-on-surface-variant mb-3">
                  반복 키워드
                </h2>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw, i) => (
                    <span
                      key={kw.word}
                      className={`px-3 py-2 rounded-md text-sm font-medium min-h-[36px] flex items-center ${
                        i === 0
                          ? 'bg-sage text-sage-light'
                          : 'bg-surface-high text-on-surface'
                      }`}
                    >
                      {kw.word} x{kw.count}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Insight */}
            {insight && (
              <section className="border-l-[3px] border-sage bg-surface-low pl-4 pr-4 py-3 rounded-r-lg">
                <p className="text-sm text-on-surface leading-relaxed">{insight}</p>
              </section>
            )}

            {daysRecorded < 3 && (
              <p className="text-sm text-on-surface-variant">
                더 기록하면 패턴이 보여요
              </p>
            )}

            {/* Daily items grouped by date */}
            <section className="space-y-5">
              <h2 className="text-sm font-medium text-on-surface-variant">일별 기록</h2>
              {weekDays.map((day) => {
                const dateStr = toDateString(day);
                const entry = weekEntries.find((e) => e.date === dateStr);
                return (
                  <div key={dateStr}>
                    <p className="text-xs font-medium text-on-surface-variant mb-2">
                      {formatDateKorean(day)}
                    </p>
                    {entry ? (
                      <button
                        onClick={() => navigate(`/detail/${dateStr}`)}
                        className="w-full text-left space-y-1 min-h-[44px] py-2"
                      >
                        {entry.items.map((item, i) => (
                          <p key={i} className="text-sm text-on-surface flex gap-2">
                            <span className="text-sage font-medium shrink-0">{i + 1}</span>
                            {item}
                          </p>
                        ))}
                      </button>
                    ) : (
                      <p className="text-sm text-on-surface-variant/50">기록 없음</p>
                    )}
                  </div>
                );
              })}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
