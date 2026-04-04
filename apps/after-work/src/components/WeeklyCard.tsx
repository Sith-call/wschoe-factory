import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Entry } from '../types';
import { getWeekRange, getWeekdayIndex, getShortDayName } from '../utils/date';
import styles from './WeeklyCard.module.css';

interface WeeklyCardProps {
  entries: Entry[];
}

export function WeeklyCard({ entries }: WeeklyCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { start, end } = getWeekRange();

  const weekEntries = useMemo(() => {
    return entries.filter(e => e.date >= start && e.date <= end);
  }, [entries, start, end]);

  const dayMap = useMemo(() => {
    const map = new Map<number, Entry>();
    weekEntries.forEach(e => {
      map.set(getWeekdayIndex(e.date), e);
    });
    return map;
  }, [weekEntries]);

  if (weekEntries.length === 0) return null;

  const summary = weekEntries
    .slice(0, 3)
    .map(e => {
      const words = e.text.split(/\s+/);
      return words.length > 2 ? words.slice(0, 2).join(' ') + '...' : e.text;
    })
    .join(', ');

  return (
    <div className={styles.card}>
      <button className={styles.toggle} onClick={() => setExpanded(!expanded)}>
        <div className={styles.header}>
          <span className={styles.title}>이번 주</span>
          {expanded ? (
            <ChevronUp size={18} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={18} strokeWidth={1.5} />
          )}
        </div>
        {!expanded && (
          <span className={styles.summary}>
            7일 중 {weekEntries.length}일 · {summary}
          </span>
        )}
      </button>

      {expanded && (
        <div className={styles.detail}>
          <span className={styles.count}>7일 중 {weekEntries.length}일 기록</span>
          <div className={styles.dayList}>
            {Array.from({ length: 7 }, (_, i) => {
              const entry = dayMap.get(i);
              return (
                <div key={i} className={styles.dayRow}>
                  <span className={styles.dayName}>{getShortDayName(i)}</span>
                  <span className={entry ? styles.dayText : styles.dayEmpty}>
                    {entry ? `"${entry.text}"` : '\u2014'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
