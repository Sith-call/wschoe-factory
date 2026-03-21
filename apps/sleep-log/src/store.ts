import { SleepRecord, UserSettings, WeeklyInsight, Factor } from './types';

const RECORDS_KEY = 'sleep-log-records';
const SETTINGS_KEY = 'sleep-log-settings';
const DEMO_KEY = 'sleep-log-demo';

const defaultSettings: UserSettings = {
  goalHours: 7.5,
  typicalBedtime: '23:00',
  typicalWakeTime: '07:00',
  onboardingDone: false,
};

export function getSettings(): UserSettings {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return { ...defaultSettings };
  return JSON.parse(raw);
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getRecords(): SleepRecord[] {
  const raw = localStorage.getItem(RECORDS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

function setRecords(records: SleepRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function saveRecord(record: SleepRecord): void {
  const records = getRecords();
  const idx = records.findIndex(r => r.date === record.date);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.push(record);
  }
  records.sort((a, b) => a.date.localeCompare(b.date));
  setRecords(records);
}

export function getRecord(date: string): SleepRecord | null {
  const records = getRecords();
  return records.find(r => r.date === date) || null;
}

export function getRecordsByMonth(year: number, month: number): SleepRecord[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getRecords().filter(r => r.date.startsWith(prefix));
}

export function getWeekRecords(): SleepRecord[] {
  const now = new Date();
  const records: SleepRecord[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const rec = getRecord(dateStr);
    if (rec) records.push(rec);
  }
  return records;
}

export function getMonthRecords(): SleepRecord[] {
  const now = new Date();
  const records: SleepRecord[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const rec = getRecord(dateStr);
    if (rec) records.push(rec);
  }
  return records;
}

export function calculateWeeklyInsight(): WeeklyInsight {
  const records = getWeekRecords();
  const settings = getSettings();

  if (records.length === 0) {
    return {
      avgDuration: 0,
      avgQuality: 0,
      bestDay: null,
      worstDay: null,
      factorImpact: [],
      goalAchievedDays: 0,
    };
  }

  const avgDuration = records.reduce((s, r) => s + r.duration, 0) / records.length;
  const avgQuality = records.reduce((s, r) => s + r.quality, 0) / records.length;

  let bestDay = records[0];
  let worstDay = records[0];
  let goalAchievedDays = 0;

  for (const r of records) {
    if (r.quality > bestDay.quality || (r.quality === bestDay.quality && r.duration > bestDay.duration)) {
      bestDay = r;
    }
    if (r.quality < worstDay.quality || (r.quality === worstDay.quality && r.duration < worstDay.duration)) {
      worstDay = r;
    }
    if (r.duration >= settings.goalHours * 60) {
      goalAchievedDays++;
    }
  }

  // Factor impact analysis
  const allRecords = getMonthRecords();
  const factorImpact = calculateFactorImpact(allRecords);

  return {
    avgDuration,
    avgQuality,
    bestDay: { date: bestDay.date, duration: bestDay.duration, quality: bestDay.quality },
    worstDay: { date: worstDay.date, duration: worstDay.duration, quality: worstDay.quality },
    factorImpact,
    goalAchievedDays,
  };
}

function calculateFactorImpact(records: SleepRecord[]): { factor: Factor; qualityDiff: number }[] {
  if (records.length < 3) return [];

  const factors: Factor[] = ['caffeine', 'exercise', 'alcohol', 'stress', 'lateFood', 'screenTime'];
  const avgQuality = records.reduce((s, r) => s + r.quality, 0) / records.length;
  const result: { factor: Factor; qualityDiff: number }[] = [];

  for (const factor of factors) {
    const withFactor = records.filter(r => r.factors.includes(factor));
    if (withFactor.length >= 3) {
      const avgWithFactor = withFactor.reduce((s, r) => s + r.quality, 0) / withFactor.length;
      result.push({ factor, qualityDiff: Math.round((avgWithFactor - avgQuality) * 10) / 10 });
    }
  }

  result.sort((a, b) => a.qualityDiff - b.qualityDiff);
  return result;
}

export function getStreak(): number {
  const records = getRecords();
  if (records.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const todayStr = formatDate(today);
  const hasToday = records.some(r => r.date === todayStr);

  const startDate = new Date(today);
  if (!hasToday) {
    startDate.setDate(startDate.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    if (records.some(r => r.date === dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getBestStreak(): number {
  const records = getRecords();
  if (records.length === 0) return 0;

  let best = 0;
  let current = 0;
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      current = 1;
    } else {
      const prev = new Date(sorted[i - 1].date);
      const curr = new Date(sorted[i].date);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
      } else {
        current = 1;
      }
    }
    best = Math.max(best, current);
  }

  return best;
}

export function calculateDuration(bedtime: string, wakeTime: string): number {
  const [bH, bM] = bedtime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);
  let bedMinutes = bH * 60 + bM;
  let wakeMinutes = wH * 60 + wM;
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }
  return wakeMinutes - bedMinutes;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_KEY) === 'true';
}

export function clearData(): void {
  localStorage.removeItem(RECORDS_KEY);
  localStorage.removeItem(DEMO_KEY);
}

export function loadDemoData(): void {
  const records: SleepRecord[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Bedtime
    let bedHour: number;
    let bedMin: number;
    if (isWeekend) {
      bedHour = 0 + Math.floor(Math.random() * 3); // 0-2
      bedMin = Math.floor(Math.random() * 6) * 10;
    } else {
      bedHour = 23 + Math.floor(Math.random() * 2); // 23-24
      if (bedHour === 24) bedHour = 0;
      bedMin = Math.floor(Math.random() * 6) * 10;
    }

    // Wake time
    let wakeHour: number;
    let wakeMin: number;
    if (isWeekend) {
      wakeHour = 9 + Math.floor(Math.random() * 3); // 9-11
      wakeMin = Math.floor(Math.random() * 6) * 10;
    } else {
      wakeHour = 6 + Math.floor(Math.random() * 2); // 6-7
      wakeMin = Math.round(Math.random() * 5) * 10;
      if (wakeMin === 60) wakeMin = 50;
    }

    const bedtime = `${String(bedHour).padStart(2, '0')}:${String(bedMin).padStart(2, '0')}`;
    const wakeTime = `${String(wakeHour).padStart(2, '0')}:${String(wakeMin).padStart(2, '0')}`;
    const duration = calculateDuration(bedtime, wakeTime);

    // Factors
    const factors: Factor[] = [];
    const isFriSat = dayOfWeek === 5 || dayOfWeek === 6;

    if (Math.random() < 0.4) factors.push('caffeine');
    if (Math.random() < 0.3) factors.push('exercise');
    if (Math.random() < (isFriSat ? 0.4 : 0.1)) factors.push('alcohol');
    if (Math.random() < 0.25) factors.push('stress');
    if (Math.random() < 0.2) factors.push('lateFood');
    if (Math.random() < 0.35) factors.push('screenTime');
    if (factors.length === 0) factors.push('none');

    // Quality - correlated with factors
    let baseQuality = isWeekend ? 3.5 : 3;
    if (factors.includes('exercise')) baseQuality += 0.8;
    if (factors.includes('caffeine')) baseQuality -= 0.6;
    if (factors.includes('alcohol')) baseQuality -= 0.8;
    if (factors.includes('stress')) baseQuality -= 0.5;
    if (factors.includes('screenTime')) baseQuality -= 0.3;
    if (duration >= 420) baseQuality += 0.5; // 7+ hours bonus
    if (duration < 360) baseQuality -= 0.5; // <6 hours penalty

    baseQuality += (Math.random() - 0.5) * 1.5;
    const quality = Math.max(1, Math.min(5, Math.round(baseQuality))) as 1 | 2 | 3 | 4 | 5;

    records.push({
      date: dateStr,
      bedtime,
      wakeTime,
      duration,
      quality,
      factors,
      createdAt: d.toISOString(),
    });
  }

  setRecords(records);
  localStorage.setItem(DEMO_KEY, 'true');
}

export function getPreviousWeekRecords(): SleepRecord[] {
  const now = new Date();
  const records: SleepRecord[] = [];
  for (let i = 13; i >= 7; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const rec = getRecord(dateStr);
    if (rec) records.push(rec);
  }
  return records;
}

export function calculateSleepScore(records: SleepRecord[], settings: UserSettings): number {
  if (records.length === 0) return 0;

  // Duration score (0-40): how close avg duration is to goal
  const avgDuration = records.reduce((s, r) => s + r.duration, 0) / records.length;
  const goalMinutes = settings.goalHours * 60;
  const durationRatio = avgDuration / goalMinutes;
  const durationScore = Math.max(0, Math.min(40, 40 * (1 - Math.abs(1 - durationRatio) * 1.5)));

  // Quality score (0-35): avg quality out of 5
  const avgQuality = records.reduce((s, r) => s + r.quality, 0) / records.length;
  const qualityScore = (avgQuality / 5) * 35;

  // Consistency score (0-25): bedtime standard deviation
  const bedtimeMinutes = records.map(r => {
    const [h, m] = r.bedtime.split(':').map(Number);
    let mins = h * 60 + m;
    if (mins < 12 * 60) mins += 24 * 60; // normalize past midnight
    return mins;
  });
  const avgBedtime = bedtimeMinutes.reduce((s, m) => s + m, 0) / bedtimeMinutes.length;
  const bedtimeVariance = bedtimeMinutes.reduce((s, m) => s + Math.pow(m - avgBedtime, 2), 0) / bedtimeMinutes.length;
  const bedtimeStdDev = Math.sqrt(bedtimeVariance);
  // 0 stddev = 25pts, 120min stddev = 0pts
  const consistencyScore = Math.max(0, Math.min(25, 25 * (1 - bedtimeStdDev / 120)));

  return Math.round(durationScore + qualityScore + consistencyScore);
}

export function calculateBedtimeConsistency(records: SleepRecord[]): { avgBedtime: string; stdDevMinutes: number } | null {
  if (records.length < 2) return null;

  const bedtimeMinutes = records.map(r => {
    const [h, m] = r.bedtime.split(':').map(Number);
    let mins = h * 60 + m;
    if (mins < 12 * 60) mins += 24 * 60; // normalize past midnight
    return mins;
  });

  const avg = bedtimeMinutes.reduce((s, m) => s + m, 0) / bedtimeMinutes.length;
  const variance = bedtimeMinutes.reduce((s, m) => s + Math.pow(m - avg, 2), 0) / bedtimeMinutes.length;
  const stdDev = Math.sqrt(variance);

  // Convert avg back to HH:MM
  let avgNormalized = Math.round(avg) % (24 * 60);
  const avgH = Math.floor(avgNormalized / 60);
  const avgM = avgNormalized % 60;
  const avgBedtime = `${String(avgH).padStart(2, '0')}:${String(avgM).padStart(2, '0')}`;

  return { avgBedtime, stdDevMinutes: Math.round(stdDev) };
}

export function getActionableTip(factorImpact: { factor: Factor; qualityDiff: number }[]): string | null {
  if (factorImpact.length === 0) return null;

  // Find the worst (most negative) factor
  const worst = factorImpact[0]; // already sorted ascending by qualityDiff
  if (worst.qualityDiff >= 0) return null;

  const improvement = Math.abs(worst.qualityDiff).toFixed(1);

  switch (worst.factor) {
    case 'caffeine':
      return `오후 2시 이후 카페인을 줄이면 수면 질이 ${improvement}점 개선될 수 있어요`;
    case 'alcohol':
      return `음주를 줄이면 수면 질이 ${improvement}점 개선될 수 있어요. 특히 잠들기 3시간 전까지 절주를 권해요`;
    case 'stress':
      return `스트레스가 수면 질을 ${improvement}점 낮추고 있어요. 취침 전 10분 명상이나 호흡법을 시도해보세요`;
    case 'lateFood':
      return `야식이 수면 질을 ${improvement}점 낮추고 있어요. 잠들기 2시간 전에는 식사를 마무리하세요`;
    case 'screenTime':
      return `스크린타임이 수면 질을 ${improvement}점 낮추고 있어요. 잠들기 1시간 전 블루라이트 차단을 시도해보세요`;
    default:
      return null;
  }
}

export function getWeekdayWeekendAvg(): { weekdayAvg: number; weekendAvg: number; weekdayCount: number; weekendCount: number } {
  const records = getWeekRecords();
  let weekdayTotal = 0, weekdayCount = 0, weekendTotal = 0, weekendCount = 0;
  for (const r of records) {
    const d = new Date(r.date);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) {
      weekendTotal += r.duration;
      weekendCount++;
    } else {
      weekdayTotal += r.duration;
      weekdayCount++;
    }
  }
  return {
    weekdayAvg: weekdayCount > 0 ? weekdayTotal / weekdayCount : 0,
    weekendAvg: weekendCount > 0 ? weekendTotal / weekendCount : 0,
    weekdayCount,
    weekendCount,
  };
}

export function getDayName(dateStr: string): string {
  const d = new Date(dateStr);
  const names = ['일', '월', '화', '수', '목', '금', '토'];
  return names[d.getDay()];
}

export function getQualityLabel(q: number): string {
  switch (q) {
    case 1: return '최악';
    case 2: return '나쁨';
    case 3: return '보통';
    case 4: return '좋음';
    case 5: return '최고';
    default: return '';
  }
}

export function getFactorLabel(f: Factor): string {
  switch (f) {
    case 'caffeine': return '카페인';
    case 'exercise': return '운동';
    case 'alcohol': return '음주';
    case 'stress': return '스트레스';
    case 'lateFood': return '야식';
    case 'screenTime': return '스크린타임';
    case 'none': return '없음';
  }
}
