import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getDay,
  isToday,
  isFuture,
  isBefore,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDateKorean(date: Date): string {
  return format(date, 'M월 d일 EEEE', { locale: ko });
}

export function formatDateShort(date: Date): string {
  return format(date, 'M/d', { locale: ko });
}

export function formatYearMonth(date: Date): string {
  return format(date, 'yyyy년 M월', { locale: ko });
}

export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
}

export function getWeekDays(date: Date): Date[] {
  const { start, end } = getWeekRange(date);
  return eachDayOfInterval({ start, end });
}

export function getMonthCalendarDays(date: Date): (Date | null)[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = getDay(monthStart);
  const paddedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const result: (Date | null)[] = [];

  for (let i = 0; i < paddedStart; i++) {
    result.push(null);
  }
  for (const day of days) {
    result.push(day);
  }

  return result;
}

export function getWeekRangeLabel(date: Date): string {
  const { start, end } = getWeekRange(date);
  return `${formatDateShort(start)} - ${formatDateShort(end)}`;
}

export { isToday, isFuture, isBefore, addMonths, subMonths, addWeeks, subWeeks, format };
