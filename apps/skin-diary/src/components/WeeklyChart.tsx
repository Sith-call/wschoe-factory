import React from 'react';
import type { SkinRecord } from '../types';
import { getRecentDates, getDayName, isToday } from '../utils/date';

interface Props {
  records: Record<string, SkinRecord>;
  onDayTap?: (date: string) => void;
}

export function WeeklyChart({ records, onDayTap }: Props) {
  const dates = getRecentDates(7);

  // Calculate average score for the week
  const scores: number[] = [];
  for (const d of dates) {
    const s = records[d]?.morningLog?.score;
    if (s !== undefined) scores.push(s);
  }
  const avgScore = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0;

  return (
    <section className="bg-surface-container-low rounded-[32px] p-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-sm font-semibold text-on-surface-variant mb-1">피부 컨디션</h3>
          <p className="font-thin-serif-num text-3xl text-primary leading-none">
            이번 주 평균 {avgScore}점
          </p>
        </div>
        <span className="text-[11px] text-on-surface-variant/60">지난 7일간</span>
      </div>

      {/* Chart */}
      <div className="relative h-24 flex items-end justify-between px-2">
        {/* Grid lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-outline-variant/10" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-outline-variant/10" />

        {dates.map(date => {
          const score = records[date]?.morningLog?.score;
          const today = isToday(date);
          const hasScore = score !== undefined;

          // Position dot based on score (1-5 mapped to height)
          const dotStyle: React.CSSProperties = hasScore
            ? { marginBottom: `${((score - 1) / 4) * 60}px` }
            : {};

          return (
            <button
              key={date}
              onClick={() => onDayTap?.(date)}
              className="flex flex-col items-center gap-2 group"
              disabled={!onDayTap}
            >
              <div style={dotStyle}>
                <div
                  className={`rounded-full transition-all ${
                    today
                      ? 'w-3 h-3 bg-primary shadow-[0_0_10px_rgba(133,80,72,0.5)]'
                      : hasScore
                        ? 'w-2 h-2 bg-primary-container group-hover:bg-primary group-hover:scale-125'
                        : 'w-2 h-2 bg-outline-variant/30'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] ${
                  today
                    ? 'text-on-surface-variant font-bold'
                    : 'text-on-surface-variant/40'
                }`}
              >
                {today ? '오늘' : getDayName(date)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
