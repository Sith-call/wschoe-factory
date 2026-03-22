import React from 'react';
import type { SkinRecord } from '../types';
import { getDaysInMonth, getFirstDayOfMonth, getToday, toDateString } from '../utils/date';

interface Props {
  year: number;
  month: number;
  records: Record<string, SkinRecord>;
  onDateClick: (date: string) => void;
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getScoreColor(score: number): string {
  switch (score) {
    case 1: return 'bg-error-container';
    case 2: return 'bg-tertiary-fixed';
    case 3: return 'bg-surface-container-highest';
    case 4: return 'bg-primary-fixed';
    case 5: return 'bg-primary-container';
    default: return '';
  }
}

export function CalendarGrid({ year, month, records, onDateClick }: Props) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = getToday();

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push(dateStr);
  }

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-[10px] font-label text-on-surface-variant/60 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((dateStr, idx) => {
          if (!dateStr) {
            return <div key={`empty-${idx}`} />;
          }

          const record = records[dateStr];
          const isToday = dateStr === today;
          const hasRecord = record && (record.morningLog || record.nightLog);
          const score = record?.morningLog?.score;
          const hasBothLogs = record?.morningLog && record?.nightLog;

          return (
            <button
              key={dateStr}
              onClick={() => onDateClick(dateStr)}
              className={`relative flex flex-col items-center justify-center py-2 rounded-xl transition-colors ${
                isToday ? 'ring-1 ring-primary/30' : ''
              } ${hasRecord ? 'hover:bg-surface-container' : 'hover:bg-surface-container-low'}`}
            >
              <span
                className={`text-sm font-body ${
                  isToday
                    ? 'text-primary font-bold'
                    : hasRecord
                      ? 'text-on-surface'
                      : 'text-on-surface-variant/40'
                }`}
              >
                {parseInt(dateStr.split('-')[2])}
              </span>

              {/* Score indicator dot */}
              {score && (
                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${getScoreColor(score)}`} />
              )}

              {/* Both logs indicator */}
              {hasBothLogs && (
                <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
