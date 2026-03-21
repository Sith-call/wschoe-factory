import React, { useState } from 'react';
import {
  BrokenMoonIcon, CloudMoonIcon, HalfMoonIcon, FullMoonIcon, StarIcon
} from '../icons';
import { getRecordsByMonth, getRecord, formatDuration, getQualityLabel, getFactorLabel, formatDate } from '../store';
import { SleepRecord } from '../types';

function QualityIcon({ quality, size = 18 }: { quality: number; size?: number }) {
  const cls = 'text-primary';
  switch (quality) {
    case 1: return <BrokenMoonIcon size={size} className={cls} />;
    case 2: return <CloudMoonIcon size={size} className={cls} />;
    case 3: return <HalfMoonIcon size={size} className={cls} />;
    case 4: return <FullMoonIcon size={size} className={cls} />;
    case 5: return <StarIcon size={size} className={cls} />;
    default: return null;
  }
}

const qualityBg: Record<number, string> = {
  1: '#fecaca',  // red-200 for bad sleep — more distinct
  2: '#bae6fd',
  3: '#7dd3fc',
  4: '#38bdf8',
  5: '#0d9488',
};

/** Generate a simple verdict sentence for the detail card */
function getVerdict(record: SleepRecord): { text: string; color: string } {
  if (record.quality >= 4) {
    return { text: '좋은 밤이었어요', color: '#0d9488' };
  }
  if (record.quality === 3) {
    return { text: '보통 수준의 수면이에요', color: '#f59e0b' };
  }
  return { text: '수면 개선이 필요해요', color: '#ef4444' };
}

/** Generate a causal insight text for the detail card */
function getCausalInsight(record: SleepRecord): string | null {
  const negativeFactors = record.factors.filter(f =>
    f === 'alcohol' || f === 'caffeine' || f === 'stress' || f === 'lateFood' || f === 'screenTime'
  );
  const positiveFactors = record.factors.filter(f => f === 'exercise');

  if (record.quality <= 2 && negativeFactors.length > 0) {
    const labels = negativeFactors.map(f => getFactorLabel(f)).join(' + ');
    return `이 날은 ${labels}이 수면에 영향을 줬어요`;
  }

  if (record.quality >= 4 && positiveFactors.length > 0 && negativeFactors.length === 0) {
    return '운동 후 숙면을 취했어요';
  }

  if (record.quality >= 4 && record.factors.filter(f => f !== 'none').length === 0) {
    return '방해 요인 없이 편안한 밤이었어요';
  }

  if (record.quality <= 2 && record.duration < 360) {
    return '수면 시간이 6시간 미만이에요';
  }

  return null;
}

export const CalendarScreen: React.FC = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const records = getRecordsByMonth(year, month);
  const recordMap = new Map(records.map(r => [r.date, r]));

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  };

  // Calendar grid
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = formatDate(today);
  const selectedRecord = selectedDate ? getRecord(selectedDate) : null;

  // Month stats
  const avgDuration = records.length > 0
    ? records.reduce((s, r) => s + r.duration, 0) / records.length
    : 0;
  const avgQuality = records.length > 0
    ? records.reduce((s, r) => s + r.quality, 0) / records.length
    : 0;

  return (
    <div className="px-5 pb-8">
      {/* Month header */}
      <div className="flex items-center justify-between py-6">
        <button onClick={prevMonth} className="p-2 text-text-secondary" style={{ minWidth: '44px', minHeight: '44px' }}>
          ←
        </button>
        <h2 className="font-dm font-semibold text-text-primary" style={{ fontSize: '18px' }}>
          {month}월 {year}
        </h2>
        <button onClick={nextMonth} className="p-2 text-text-secondary" style={{ minWidth: '44px', minHeight: '44px' }}>
          →
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d} className="text-center text-text-tertiary font-semibold py-2" style={{ fontSize: '13px' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 fade-enter" key={`${year}-${month}`}>
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const record = recordMap.get(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
              className={`aspect-square flex items-center justify-center rounded-md relative ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${isToday && !isSelected ? 'ring-1 ring-primary' : ''}`}
              style={{
                backgroundColor: record ? qualityBg[record.quality] : 'transparent',
                color: record && record.quality >= 5 ? '#ffffff' : '#134e4a',
                minHeight: '40px',
                fontSize: '14px',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Detail card with verdict + causal insight */}
      {selectedDate && (
        <div className="bg-surface rounded-xl p-5 mt-4">
          <div className="text-text-tertiary mb-2" style={{ fontSize: '14px' }}>
            {selectedDate.replace(/-/g, '.')}
          </div>
          {selectedRecord ? (
            <>
              {/* Verdict banner */}
              {(() => {
                const verdict = getVerdict(selectedRecord);
                return (
                  <div
                    className="rounded-lg px-4 py-2.5 mb-4 font-semibold"
                    style={{
                      fontSize: '16px',
                      color: verdict.color,
                      backgroundColor: verdict.color === '#0d9488' ? '#f0fdfa'
                        : verdict.color === '#f59e0b' ? '#fffbeb'
                        : '#fef2f2',
                    }}
                  >
                    {verdict.text}
                  </div>
                );
              })()}

              <div className="flex items-center gap-3 mb-3">
                <span className="font-dm text-2xl font-bold text-text-primary">
                  {formatDuration(selectedRecord.duration)}
                </span>
                <QualityIcon quality={selectedRecord.quality} />
                <span className="text-text-secondary" style={{ fontSize: '15px' }}>{getQualityLabel(selectedRecord.quality)}</span>
              </div>
              <div className="flex items-center gap-2 text-text-tertiary mb-3" style={{ fontSize: '14px' }}>
                <span>취침 {selectedRecord.bedtime}</span>
                <span>→</span>
                <span>기상 {selectedRecord.wakeTime}</span>
              </div>
              {selectedRecord.factors.length > 0 && selectedRecord.factors[0] !== 'none' && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedRecord.factors.filter(f => f !== 'none').map(f => (
                    <span key={f} className="bg-primary-light text-primary-dark px-2.5 py-1 rounded-full" style={{ fontSize: '13px' }}>
                      {getFactorLabel(f)}
                    </span>
                  ))}
                </div>
              )}

              {/* Causal insight text */}
              {(() => {
                const causal = getCausalInsight(selectedRecord);
                return causal ? (
                  <div
                    className="text-text-secondary pt-3 border-t border-border"
                    style={{ fontSize: '14px', lineHeight: '1.5' }}
                  >
                    {causal}
                  </div>
                ) : null;
              })()}
            </>
          ) : (
            <p className="text-text-tertiary" style={{ fontSize: '15px' }}>기록 없음</p>
          )}
        </div>
      )}

      {/* Month stats footer */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-surface rounded-xl p-3 text-center">
          <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>기록일</div>
          <div className="font-dm text-base font-semibold text-text-primary">
            {records.length}/{daysInMonth}일
          </div>
        </div>
        <div className="bg-surface rounded-xl p-3 text-center">
          <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>평균 수면</div>
          <div className="font-dm text-base font-semibold text-text-primary">
            {avgDuration > 0 ? (avgDuration / 60).toFixed(1) : '-'}시간
          </div>
        </div>
        <div className="bg-surface rounded-xl p-3 text-center">
          <div className="text-text-tertiary mb-1" style={{ fontSize: '13px' }}>평균 질</div>
          <div className="font-dm text-base font-semibold text-text-primary">
            {avgQuality > 0 ? avgQuality.toFixed(1) : '-'}/5
          </div>
        </div>
      </div>
    </div>
  );
};
