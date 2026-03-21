import type { Product, SkinRecord, Variable, SkinKeyword } from '../types';
import { subtractDays, getToday } from '../utils/date';

export const DEMO_PRODUCTS: Product[] = [
  { id: 'd1', name: '아이소이 트러블케어 세럼', category: 'serum', addedAt: '2026-01-01' },
  { id: 'd2', name: '라네즈 워터슬리핑마스크', category: 'mask', addedAt: '2026-01-01' },
  { id: 'd3', name: '이니스프리 그린티 토너', category: 'toner', addedAt: '2026-01-01' },
  { id: 'd4', name: '달바 화이트트러플 크림', category: 'cream', addedAt: '2026-01-01' },
  { id: 'd5', name: '코스알엑스 스네일 에센스', category: 'essence', addedAt: '2026-01-01' },
  { id: 'd6', name: '비오레 UV 에센스', category: 'sunscreen', addedAt: '2026-01-01' },
];

interface DayPattern {
  products: string[];
  variables: Variable[];
  score: 1 | 2 | 3 | 4 | 5;
  keywords: SkinKeyword[];
  memo?: string;
}

function generateDemoRecords(): Record<string, SkinRecord> {
  const today = getToday();
  const records: Record<string, SkinRecord> = {};

  const patterns: DayPattern[] = [
    // Day 30 (oldest) - 일요일, 간소화 루틴
    { products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'], variables: ['flour'], score: 3, keywords: ['dry', 'dull'], memo: '주말 간소화 루틴' },
    // Day 29 - 월요일, 규칙적
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: ['exercise'], score: 4, keywords: ['moist', 'bright'] },
    // Day 28 - 화요일
    { products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'], variables: [], score: 4, keywords: ['moist'] },
    // Day 27 - 수요일, 야근
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: ['overtime', 'stress'], score: 3, keywords: ['dull', 'tight'] },
    // Day 26 - 목요일, 매운거
    { products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'], variables: ['spicy'], score: 2, keywords: ['trouble', 'red'], memo: '마라탕 먹음' },
    // Day 25 - 금요일, 음주
    { products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'], variables: ['alcohol', 'flour'], score: 2, keywords: ['greasy', 'trouble', 'dull'] },
    // Day 24 - 토요일, 간소화
    { products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'], variables: ['poorSleep'], score: 2, keywords: ['dry', 'dull', 'flaky'] },
    // Day 23 - 일요일, 풀루틴 + 마스크팩
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림', '라네즈 워터슬리핑마스크'], variables: ['exercise'], score: 4, keywords: ['moist', 'bright'], memo: '슬리핑마스크 효과 좋다' },
    // Day 22 - 월요일
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: [], score: 5, keywords: ['moist', 'bright'], memo: '오늘 피부 진짜 좋다' },
    // Day 21 - 화요일
    { products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'], variables: ['exercise'], score: 4, keywords: ['moist'] },
    // Day 20 - 수요일, 스트레스
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: ['stress', 'overtime'], score: 3, keywords: ['tight', 'dull'] },
    // Day 19 - 목요일
    { products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'], variables: [], score: 3, keywords: ['dry'] },
    // Day 18 - 금요일, 밀가루
    { products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'], variables: ['flour', 'alcohol'], score: 2, keywords: ['trouble', 'greasy'] },
    // Day 17 - 토요일
    { products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'], variables: ['poorSleep'], score: 2, keywords: ['dull', 'dry', 'flaky'] },
    // Day 16 - 일요일, 풀케어
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림', '라네즈 워터슬리핑마스크'], variables: ['exercise'], score: 4, keywords: ['moist', 'bright'] },
    // Day 15 - 월요일
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: [], score: 5, keywords: ['moist', 'bright'], memo: '꿀피부 데이' },
    // Day 14 - 화요일
    { products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'], variables: ['exercise'], score: 4, keywords: ['moist'] },
    // Day 13 - 수요일, 매운거
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: ['spicy', 'stress'], score: 3, keywords: ['red', 'trouble'] },
    // Day 12 - 목요일
    { products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'], variables: [], score: 2, keywords: ['trouble', 'red'], memo: '턱 트러블' },
    // Day 11 - 금요일, 음주
    { products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'], variables: ['alcohol', 'flour'], score: 3, keywords: ['greasy', 'dull'] },
    // Day 10 - 토요일
    { products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'], variables: [], score: 2, keywords: ['dry', 'flaky'] },
    // Day 9 - 일요일, 풀케어
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림', '라네즈 워터슬리핑마스크'], variables: ['exercise'], score: 4, keywords: ['moist'] },
    // Day 8 - 월요일
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: [], score: 5, keywords: ['moist', 'bright'] },
    // Day 7 - 화요일
    { products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'], variables: ['exercise'], score: 4, keywords: ['moist', 'bright'] },
    // Day 6 - 수요일, 야근
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: ['overtime', 'stress', 'flour'], score: 3, keywords: ['tight', 'dull'] },
    // Day 5 - 목요일
    { products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'], variables: [], score: 2, keywords: ['trouble'] },
    // Day 4 - 금요일
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: ['exercise'], score: 3, keywords: ['dry'] },
    // Day 3 - 토요일, 간소화
    { products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'], variables: ['alcohol'], score: 4, keywords: ['moist'] },
    // Day 2 - 일요일, 풀케어
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림', '라네즈 워터슬리핑마스크'], variables: ['exercise'], score: 2, keywords: ['trouble', 'greasy'] },
    // Day 1 (yesterday)
    { products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'], variables: [], score: 4, keywords: ['moist', 'bright'] },
  ];

  for (let i = 0; i < patterns.length; i++) {
    const dayOffset = patterns.length - i;
    const date = subtractDays(today, dayOffset);
    const p = patterns[i];

    records[date] = {
      date,
      nightLog: {
        products: p.products,
        variables: p.variables,
        loggedAt: `${date}T22:00:00`,
      },
      morningLog: {
        score: p.score,
        keywords: p.keywords,
        memo: p.memo,
        loggedAt: `${date}T08:00:00`,
      },
    };
  }

  return records;
}

export function loadDemoData(): { records: Record<string, SkinRecord>; products: Product[] } {
  return {
    records: generateDemoRecords(),
    products: [...DEMO_PRODUCTS],
  };
}
