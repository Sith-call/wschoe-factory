import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllEntries } from '../utils/storage';
import {
  getMonthCalendarDays,
  formatYearMonth,
  toDateString,
  isToday,
  isFuture,
  addMonths,
  subMonths,
} from '../utils/date-helpers';
import BottomNav from '../components/BottomNav';

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export default function CalendarPage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const entries = getAllEntries();
  const calendarDays = getMonthCalendarDays(currentMonth);

  const recordedDates = new Set(entries.map((e) => e.date));

  const monthRecordCount = calendarDays.filter(
    (d) => d && recordedDates.has(toDateString(d)),
  ).length;

  function handleDayClick(day: Date) {
    const dateStr = toDateString(day);
    if (isFuture(day) && !isToday(day)) return;

    if (recordedDates.has(dateStr)) {
      navigate(`/detail/${dateStr}`);
    } else {
      navigate(`/entry?date=${dateStr}`);
    }
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <header className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant"
            aria-label="이전 달"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-base font-semibold text-on-surface">
            {formatYearMonth(currentMonth)}
          </h1>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant"
            aria-label="다음 달"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <main className="px-5">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-medium text-on-surface-variant py-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {calendarDays.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="h-11" />;
            }
            const dateStr = toDateString(day);
            const recorded = recordedDates.has(dateStr);
            const today = isToday(day);
            const future = isFuture(day) && !today;

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(day)}
                disabled={future}
                className={`h-11 flex flex-col items-center justify-center rounded-lg text-sm relative min-w-[44px] ${
                  future
                    ? 'text-on-surface-variant/30 cursor-default'
                    : 'cursor-pointer'
                } ${
                  today
                    ? 'ring-2 ring-sage ring-inset font-semibold text-sage'
                    : 'text-on-surface'
                }`}
                aria-label={`${dateStr} ${recorded ? '기록됨' : future ? '미래' : '미기록'}`}
              >
                <span>{day.getDate()}</span>
                {recorded && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sage absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Monthly stats */}
        <div className="mt-6">
          {monthRecordCount > 0 ? (
            <p className="text-sm text-on-surface-variant">
              이번 달 <span className="font-semibold text-sage">{monthRecordCount}일</span> 기록
            </p>
          ) : (
            <p className="text-sm text-on-surface-variant">
              첫 감사를 기록하면 여기에 표시돼요
            </p>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
