/** 오늘 날짜를 YYYY-MM-DD 문자열로 반환 */
export function getTodayString(): string {
  const now = new Date();
  return formatDate(now);
}

/** Date 객체를 YYYY-MM-DD 문자열로 */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** YYYY-MM-DD 문자열을 Date 객체로 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** 요일 이름 (한국어) */
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function getDayName(dateStr: string): string {
  const d = parseDate(dateStr);
  return DAY_NAMES[d.getDay()];
}

/** "M월 D일 요일" 형식 */
export function formatDateKorean(dateStr: string): string {
  const d = parseDate(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = DAY_NAMES[d.getDay()];
  return `${month}월 ${day}일 ${dayName}요일`;
}

/** 시각 포맷: "HH:mm" */
export function formatTime(isoStr: string): string {
  const d = new Date(isoStr);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** 이번 주 월요일 ~ 일요일 범위 (ISO 8601 기준) */
export function getWeekRange(dateStr?: string): { start: string; end: string } {
  const d = dateStr ? parseDate(dateStr) : new Date();
  const day = d.getDay(); // 0=일, 1=월 ...
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  };
}

/** 요일 인덱스 (월=0, 화=1, ..., 일=6) */
export function getWeekdayIndex(dateStr: string): number {
  const d = parseDate(dateStr);
  const day = d.getDay(); // 0=일
  return day === 0 ? 6 : day - 1;
}

/** 이번 주 월요일 날짜 문자열 반환 */
export function getWeekStartString(): string {
  const { start } = getWeekRange();
  return start;
}

const SHORT_DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

export function getShortDayName(index: number): string {
  return SHORT_DAY_NAMES[index];
}
