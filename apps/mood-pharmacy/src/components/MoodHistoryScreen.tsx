import { useState, useMemo } from 'react';
import { MOOD_MAP, getCalendarDays, MOODS } from '../data';
import type { MoodLog } from '../types';

interface Props {
  logs: MoodLog[];
  streak: number;
  onBack: () => void;
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function MoodHistoryScreen({ logs, streak, onBack }: Props) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [tab, setTab] = useState<'calendar' | 'trend'>('calendar');

  const calendarDays = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const logMap = useMemo(() => {
    const m: Record<string, MoodLog> = {};
    for (const log of logs) m[log.date] = log;
    return m;
  }, [logs]);

  // Last 7 days trend
  const trendData = useMemo(() => {
    const result: { date: string; label: string; log: MoodLog | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
      result.push({ date: dateStr, label: dayLabel, log: logMap[dateStr] || null });
    }
    return result;
  }, [logMap]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const todayStr = now.toISOString().split('T')[0];

  return (
    <div className="min-h-[100dvh] flex flex-col px-5 pt-8 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-on-surface-dim text-sm">{'\u2190'} 돌아가기</button>
        <h2 className="text-lg font-bold text-on-surface">감정 기록</h2>
        <div className="w-16" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-card rounded-xl p-3 border border-white/5 text-center">
          <p className="text-xl font-bold text-teal-bright">{logs.length}</p>
          <p className="text-[10px] text-on-surface-muted">총 기록</p>
        </div>
        <div className="bg-surface-card rounded-xl p-3 border border-white/5 text-center">
          <p className="text-xl font-bold text-amber-light">{streak}</p>
          <p className="text-[10px] text-on-surface-muted">연속 기록</p>
        </div>
        <div className="bg-surface-card rounded-xl p-3 border border-white/5 text-center">
          <p className="text-xl font-bold text-purple-calm">
            {logs.length > 0 ? MOOD_MAP[logs[logs.length - 1].mood].emoji : '-'}
          </p>
          <p className="text-[10px] text-on-surface-muted">최근 감정</p>
        </div>
      </div>

      {/* Tab switch */}
      <div className="flex bg-surface-card rounded-lg p-1 mb-5 border border-white/5">
        <button
          onClick={() => setTab('calendar')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'calendar' ? 'bg-teal/60 text-teal-bright' : 'text-on-surface-muted'
          }`}
        >
          달력
        </button>
        <button
          onClick={() => setTab('trend')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'trend' ? 'bg-teal/60 text-teal-bright' : 'text-on-surface-muted'
          }`}
        >
          추이
        </button>
      </div>

      {tab === 'calendar' ? (
        <>
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="text-on-surface-dim px-3 py-1">{'\u276E'}</button>
            <span className="text-on-surface font-semibold">{viewYear}년 {MONTH_NAMES[viewMonth]}</span>
            <button onClick={nextMonth} className="text-on-surface-dim px-3 py-1">{'\u276F'}</button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAY_LABELS.map(d => (
              <div key={d} className="text-center text-[10px] text-on-surface-muted py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {calendarDays.map((dateStr, i) => {
              if (!dateStr) return <div key={`empty-${i}`} className="aspect-square" />;
              const log = logMap[dateStr];
              const day = parseInt(dateStr.split('-')[2]);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={dateStr}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors
                    ${isToday ? 'border border-teal-bright/40' : ''}
                    ${log ? log && MOOD_MAP[log.mood].softBg : 'bg-white/3'}
                  `}
                >
                  <span className={`text-[10px] ${isToday ? 'text-teal-bright font-bold' : 'text-on-surface-muted'}`}>
                    {day}
                  </span>
                  {log && (
                    <span className="text-sm mt-0.5">{MOOD_MAP[log.mood].emoji}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="bg-surface-card rounded-xl p-4 border border-white/5">
            <p className="text-on-surface-muted text-xs mb-3">감정 범례</p>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map(m => (
                <div key={m.key} className="flex items-center gap-1.5">
                  <span className="text-sm">{m.emoji}</span>
                  <span className="text-[10px] text-on-surface-dim">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 7-day trend */}
          <div className="bg-surface-card rounded-xl p-5 border border-white/5 mb-5">
            <p className="text-on-surface font-medium text-sm mb-4">최근 7일 감정 추이</p>

            {/* Intensity chart */}
            <div className="flex items-end gap-2 h-32 mb-3">
              {trendData.map(({ date, label, log }) => (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  {log ? (
                    <>
                      <span className="text-sm">{MOOD_MAP[log.mood].emoji}</span>
                      <div
                        className={`w-full rounded-t-md ${MOOD_MAP[log.mood].bgColor} transition-all`}
                        style={{ height: `${(log.intensity / 5) * 80}px`, opacity: 0.7 }}
                      />
                    </>
                  ) : (
                    <div className="w-full h-2 rounded bg-white/5" />
                  )}
                  <span className="text-[9px] text-on-surface-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent entries list */}
          <div className="space-y-2">
            <p className="text-on-surface font-medium text-sm mb-2">기록 목록</p>
            {[...logs].reverse().slice(0, 10).map(log => (
              <div key={log.id} className="bg-surface-card rounded-xl p-3 border border-white/5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${MOOD_MAP[log.mood].softBg} flex items-center justify-center`}>
                  <span className="text-lg">{MOOD_MAP[log.mood].emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface text-sm font-medium">{MOOD_MAP[log.mood].label}</span>
                    <span className="text-on-surface-muted text-[10px]">Lv.{log.intensity}</span>
                  </div>
                  {log.memo && <p className="text-on-surface-dim text-xs mt-0.5 truncate">{log.memo}</p>}
                </div>
                <span className="text-on-surface-muted text-xs shrink-0">{log.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
