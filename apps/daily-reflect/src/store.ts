import { DailyReflection } from './types';

const STORAGE_KEY = 'daily-reflect-data';
const FIRST_VISIT_KEY = 'daily-reflect-first-visit';

export function getReflections(): DailyReflection[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveReflection(reflection: DailyReflection): void {
  const reflections = getReflections();
  const existingIndex = reflections.findIndex(r => r.date === reflection.date);
  if (existingIndex >= 0) {
    reflections[existingIndex] = reflection;
  } else {
    reflections.push(reflection);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
}

export function getReflectionByDate(date: string): DailyReflection | undefined {
  return getReflections().find(r => r.date === date);
}

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function isFirstVisit(): boolean {
  return !localStorage.getItem(FIRST_VISIT_KEY);
}

export function markVisited(): void {
  localStorage.setItem(FIRST_VISIT_KEY, 'true');
}

export function getStreak(): number {
  const reflections = getReflections().sort((a, b) => b.date.localeCompare(a.date));
  if (reflections.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (reflections.find(r => r.date === dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function loadDemoData(): void {
  const emotions: DailyReflection['emotion'][] = ['happy', 'calm', 'grateful', 'tired', 'anxious', 'sad'];
  const categories: DailyReflection['highlightCategory'][] = ['work', 'people', 'growth', 'hobby', 'health'];
  const highlights = [
    '프로젝트 발표 성공적으로 마침',
    '오랜만에 친구와 저녁 식사',
    '새로운 기술 블로그 글 완성',
    '점심시간에 산책하며 힐링',
    '팀원들과 좋은 브레인스토밍',
    '요가 수업 다녀옴',
    '독서 모임에서 좋은 인사이트',
    '맛있는 커피 한 잔의 여유',
  ];
  const gratitudes = [
    '따뜻한 햇살',
    '좋은 동료들',
    '건강한 하루',
    '맛있는 점심',
    '편안한 퇴근길',
    '가족의 응원',
  ];

  const reflections: DailyReflection[] = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    reflections.push({
      date: d.toISOString().split('T')[0],
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      emotionIntensity: Math.floor(Math.random() * 5) + 1,
      energy: Math.floor(Math.random() * 5) + 1,
      highlightCategory: categories[Math.floor(Math.random() * categories.length)],
      highlightText: highlights[Math.floor(Math.random() * highlights.length)],
      gratitude: gratitudes[Math.floor(Math.random() * gratitudes.length)],
      createdAt: d.toISOString(),
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
  localStorage.setItem(FIRST_VISIT_KEY, 'true');
}
