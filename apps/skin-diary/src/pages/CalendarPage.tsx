import React, { useState } from 'react';
import type { SkinRecord } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';
import { CalendarGrid } from '../components/CalendarGrid';
import { DayDetail } from '../components/DayDetail';

interface CalendarPageProps {
  records: Record<string, SkinRecord>;
  onEditDate?: (date: string) => void;
}

export function CalendarPage({ records, onEditDate }: CalendarPageProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  // Monthly stats
  const monthRecords = Object.values(records).filter(r => {
    const d = new Date(r.date + 'T00:00:00');
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const morningScores = monthRecords
    .filter(r => r.morningLog)
    .map(r => r.morningLog!.score);
  const avg = morningScores.length > 0
    ? (morningScores.reduce((a, b) => a + b, 0) / morningScores.length).toFixed(1)
    : null;
  const recordedDays = monthRecords.filter(r => r.morningLog || r.nightLog).length;

  return (
    <div className="pb-20">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} aria-label="이전 달" className="text-sd-text min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ChevronLeftIcon size={22} />
        </button>
        <h1 className="font-heading text-xl text-sd-text">
          {year}년 {month + 1}월
        </h1>
        <button onClick={nextMonth} aria-label="다음 달" className="text-sd-text min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ChevronRightIcon size={22} />
        </button>
      </div>

      {/* Calendar */}
      <CalendarGrid
        year={year}
        month={month}
        records={records}
        onDateSelect={setSelectedDate}
      />

      {/* Monthly stats */}
      <div className="mt-6 space-y-1">
        {avg && (
          <p className="font-body text-sm text-sd-text-secondary">
            이번 달 평균: <span className="font-number text-sd-text font-medium">{avg}</span>
          </p>
        )}
        {recordedDays > 0 && (
          <p className="font-body text-sm text-sd-text-secondary">
            기록률: {recordedDays}일
          </p>
        )}
      </div>

      {/* Day detail bottom sheet */}
      {selectedDate && (
        <DayDetail
          date={selectedDate}
          records={records}
          onClose={() => setSelectedDate(null)}
          onEdit={(date: string) => {
            setSelectedDate(null);
            if (onEditDate) onEditDate(date);
          }}
        />
      )}
    </div>
  );
}
