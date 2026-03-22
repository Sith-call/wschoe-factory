import React, { useState, useMemo } from 'react';
import type { SkinRecord, SkinKeyword } from '../types';
import { KEYWORD_LABELS, SCORE_LABELS } from '../types';
import { CalendarGrid } from '../components/CalendarGrid';
import { DayDetail } from '../components/DayDetail';

interface Props {
  records: Record<string, SkinRecord>;
  onEditMorning: (date: string) => void;
  onEditNight: (date: string) => void;
}

export function CalendarPage({ records, onEditMorning, onEditNight }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  // Count records this month
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthRecords = Object.keys(records).filter(d => d.startsWith(monthPrefix));
  const recordedDays = monthRecords.filter(d => records[d].morningLog || records[d].nightLog).length;

  // Monthly summary stats
  const monthlySummary = useMemo(() => {
    const scores: number[] = [];
    const keywordCounts: Record<string, number> = {};
    let bestDay: { date: string; score: number } | null = null;
    let worstDay: { date: string; score: number } | null = null;

    for (const date of monthRecords) {
      const r = records[date];
      if (!r?.morningLog) continue;
      const score = r.morningLog.score;
      scores.push(score);

      if (!bestDay || score > bestDay.score) bestDay = { date, score };
      if (!worstDay || score < worstDay.score) worstDay = { date, score };

      for (const kw of r.morningLog.keywords) {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      }
    }

    if (scores.length === 0) return null;

    const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    const topKeyword = Object.entries(keywordCounts).sort(([, a], [, b]) => b - a)[0];

    return {
      avgScore,
      topKeyword: topKeyword ? { keyword: topKeyword[0] as SkinKeyword, count: topKeyword[1] } : null,
      bestDay,
      worstDay: worstDay && worstDay.date !== bestDay?.date ? worstDay : null,
      totalScored: scores.length,
    };
  }, [records, monthPrefix]);

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="w-full top-0 sticky z-50 pt-6 pb-4 bg-[#fdf8f4]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="text-[#524341] hover:text-[#855048] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h1 className="font-headline text-xl font-medium text-on-surface">
            {year}년 {monthNames[month]}
          </h1>
          <button
            onClick={nextMonth}
            className="text-[#524341] hover:text-[#855048] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Recording stats */}
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container rounded-full"
              style={{ width: `${(recordedDays / 30) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-on-surface-variant/60 whitespace-nowrap">
            {recordedDays}일 기록
          </span>
        </div>
      </header>

      {/* Calendar Grid */}
      <CalendarGrid
        year={year}
        month={month}
        records={records}
        onDateClick={setSelectedDate}
      />

      {/* Monthly Summary */}
      {monthlySummary && (
        <section className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-on-surface-variant">
            {monthNames[month]} 요약
          </h3>
          <div className="bg-surface-container-lowest rounded-xl p-5 space-y-4 border border-outline-variant/5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="serif-numbers text-2xl text-primary">{monthlySummary.avgScore}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">평균 점수</p>
              </div>
              <div>
                <p className="serif-numbers text-2xl text-primary">{monthlySummary.totalScored}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">기록일</p>
              </div>
              <div>
                {monthlySummary.topKeyword ? (
                  <>
                    <p className="text-sm font-medium text-primary mt-1">
                      {KEYWORD_LABELS[monthlySummary.topKeyword.keyword]}
                    </p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
                      최다 키워드 ({monthlySummary.topKeyword.count}회)
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-on-surface-variant/40">-</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">키워드</p>
                  </>
                )}
              </div>
            </div>
            {(monthlySummary.bestDay || monthlySummary.worstDay) && (
              <div className="flex gap-3 pt-3 border-t border-outline-variant/10">
                {monthlySummary.bestDay && (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      sentiment_very_satisfied
                    </span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant">최고의 날</p>
                      <p className="text-xs font-medium text-on-surface">
                        {new Date(monthlySummary.bestDay.date + 'T12:00:00').getDate()}일 ({monthlySummary.bestDay.score}점)
                      </p>
                    </div>
                  </div>
                )}
                {monthlySummary.worstDay && (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      sentiment_dissatisfied
                    </span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant">힘들었던 날</p>
                      <p className="text-xs font-medium text-on-surface">
                        {new Date(monthlySummary.worstDay.date + 'T12:00:00').getDate()}일 ({monthlySummary.worstDay.score}점)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Day detail bottom sheet */}
      {selectedDate && (
        <DayDetail
          date={selectedDate}
          record={records[selectedDate]}
          records={records}
          onClose={() => setSelectedDate(null)}
          onEditMorning={(d) => { setSelectedDate(null); onEditMorning(d); }}
          onEditNight={(d) => { setSelectedDate(null); onEditNight(d); }}
        />
      )}
    </div>
  );
}
