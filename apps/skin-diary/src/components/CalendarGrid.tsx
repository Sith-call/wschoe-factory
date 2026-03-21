import React from 'react';
import type { SkinRecord } from '../types';
import { getDaysInMonth, getFirstDayOfMonth, getToday } from '../utils/date';

interface CalendarGridProps {
  year: number;
  month: number;
  records: Record<string, SkinRecord>;
  onDateSelect: (date: string) => void;
}

const SCORE_BG: Record<number, string> = {
  1: 'rgba(232, 160, 160, 0.2)',
  2: 'rgba(232, 196, 160, 0.2)',
  3: 'rgba(232, 220, 160, 0.2)',
  4: 'rgba(160, 212, 160, 0.2)',
  5: 'rgba(122, 194, 122, 0.2)',
};

const SCORE_DOT: Record<number, string> = {
  1: '#e8a0a0',
  2: '#e8c4a0',
  3: '#e8dca0',
  4: '#a0d4a0',
  5: '#7ac27a',
};

const DAY_HEADERS = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarGrid({ year, month, records, onDateSelect }: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = getToday();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center font-body text-[0.8125rem] text-sd-text-secondary py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const record = records[dateStr];
          const score = record?.morningLog?.score;
          const isToday = dateStr === today;
          const hasRecord = !!record?.morningLog || !!record?.nightLog;

          return (
            <button
              key={dateStr}
              onClick={() => hasRecord && onDateSelect(dateStr)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center relative ${
                isToday ? 'border-2 border-sd-primary' : ''
              } ${hasRecord ? 'cursor-pointer' : 'cursor-default'}`}
              style={score ? { backgroundColor: SCORE_BG[score] } : undefined}
              aria-label={`${month + 1}월 ${day}일${score ? ` ${score}점` : ''}`}
            >
              <span className={`font-number text-[0.9375rem] ${
                isToday ? 'text-sd-primary font-medium' : 'text-sd-text'
              }`}>
                {day}
              </span>
              {score && (
                <span
                  className="w-1.5 h-1.5 rounded-full absolute bottom-1"
                  style={{ backgroundColor: SCORE_DOT[score] }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
