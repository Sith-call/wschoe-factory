import { DdayEvent } from './types';

/** Calculate the difference in days between the event date and today.
 *  Positive = future (D-N), Negative = past (D+N), Zero = D-Day.
 */
export function getDdayDiff(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/** Format the D-day string: "D-30", "D+5", or "D-Day" */
export function formatDday(dateStr: string): string {
  const diff = getDdayDiff(dateStr);
  if (diff > 0) return `D-${diff}`;
  if (diff < 0) return `D+${Math.abs(diff)}`;
  return 'D-Day';
}

/** Sort events: pinned first, then by nearest upcoming, then past (most recent first) */
export function sortEvents(events: DdayEvent[]): DdayEvent[] {
  return [...events].sort((a, b) => {
    // Pinned first
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

    const diffA = getDdayDiff(a.date);
    const diffB = getDdayDiff(b.date);

    // Both future or today: smaller diff (nearer) first
    if (diffA >= 0 && diffB >= 0) return diffA - diffB;
    // Both past: more recent (smaller abs) first
    if (diffA < 0 && diffB < 0) return diffB - diffA;
    // Future before past
    return diffA >= 0 ? -1 : 1;
  });
}

/** Format date for display: "2026.03.20 (금)" */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const day = days[date.getDay()];
  return `${y}.${m}.${d} (${day})`;
}
