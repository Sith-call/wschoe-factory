const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = DAY_NAMES[d.getDay()];
  return `${month}월 ${day}일 ${dayName}요일`;
}

export function getToday(): string {
  const d = new Date();
  return toDateString(d);
}

export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getNextDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  return toDateString(d);
}

export function getPrevDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return toDateString(d);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function getRecentDates(days: number): string[] {
  const result: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    result.push(toDateString(d));
  }
  return result;
}

export function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return DAY_NAMES[d.getDay()];
}

export function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() - days);
  return toDateString(d);
}
