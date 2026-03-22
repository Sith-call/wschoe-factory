import type { Product, SkinRecord, Variable, SkinKeyword, TroubleArea, CustomVariable, Milestone } from '../types';
import { subtractDays, getToday } from '../utils/date';

export const DEMO_PRODUCTS: Product[] = [
  { id: 'd1', name: '아이소이 트러블케어 세럼', category: 'serum', addedAt: '2026-01-01' },
  { id: 'd2', name: '라네즈 워터슬리핑마스크', category: 'mask', addedAt: '2026-01-01' },
  { id: 'd3', name: '이니스프리 그린티 토너', category: 'toner', addedAt: '2026-01-01' },
  { id: 'd4', name: '달바 화이트트러플 크림', category: 'cream', addedAt: '2026-01-01' },
  { id: 'd5', name: '코스알엑스 스네일 에센스', category: 'essence', addedAt: '2026-01-01' },
  { id: 'd6', name: '비오레 UV 에센스', category: 'sunscreen', addedAt: '2026-01-01' },
];

export const DEMO_CUSTOM_VARIABLES: CustomVariable[] = [
  { id: 'custom_1', label: '카페인', createdAt: '2026-02-15' },
  { id: 'custom_2', label: '새벽운동', createdAt: '2026-02-20' },
];

export const DEMO_PINNED_VARIABLES: string[] = ['bangs', 'poorSleep'];

interface DayPattern {
  products: string[];
  variables: (Variable | string)[];
  score: 1 | 2 | 3 | 4 | 5;
  keywords: SkinKeyword[];
  troubleAreas?: TroubleArea[];
  nightMemo?: string;
  morningMemo?: string;
}

function generateDemoRecords(): Record<string, SkinRecord> {
  const today = getToday();
  const records: Record<string, SkinRecord> = {};

  const patterns: DayPattern[] = [
    // Day 30 (oldest) — Sunday, minimal routine
    {
      products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'],
      variables: ['flour'],
      score: 3,
      keywords: ['dry', 'dull'],
      morningMemo: '주말 간소화 루틴',
    },
    // Day 29 — Monday, regular
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['exercise', 'bangs'],
      score: 4,
      keywords: ['moist', 'bright'],
    },
    // Day 28 — Tuesday
    {
      products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 4,
      keywords: ['moist', 'smooth'],
    },
    // Day 27 — Wednesday, overtime
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['overtime', 'stress', 'bangs', 'custom_1'],
      score: 3,
      keywords: ['dull', 'tight'],
      troubleAreas: ['jawline'],
      nightMemo: '야근으로 스킨케어 대충함',
    },
    // Day 26 — Thursday, spicy food
    {
      products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'],
      variables: ['spicy', 'bangs'],
      score: 2,
      keywords: ['trouble', 'red'],
      troubleAreas: ['cheek_left', 'jawline'],
      morningMemo: '마라탕 먹고 턱에 트러블',
    },
    // Day 25 — Friday, alcohol
    {
      products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'],
      variables: ['alcohol', 'flour', 'bangs'],
      score: 2,
      keywords: ['greasy', 'trouble', 'dull'],
      troubleAreas: ['cheek_left', 'cheek_right'],
    },
    // Day 24 — Saturday, poor sleep
    {
      products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'],
      variables: ['poorSleep', 'bangs'],
      score: 2,
      keywords: ['dry', 'dull', 'flaky'],
    },
    // Day 23 — Sunday, full routine + mask
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림', '라네즈 워터슬리핑마스크'],
      variables: ['exercise', 'custom_2'],
      score: 4,
      keywords: ['moist', 'bright'],
      nightMemo: '슬리핑마스크 효과 좋다',
    },
    // Day 22 — Monday
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 5,
      keywords: ['moist', 'bright', 'smooth'],
      morningMemo: '오늘 피부 진짜 좋다',
    },
    // Day 21 — Tuesday
    {
      products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'],
      variables: ['exercise', 'bangs'],
      score: 4,
      keywords: ['moist'],
    },
    // Day 20 — Wednesday, stress
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['stress', 'overtime', 'bangs', 'custom_1'],
      score: 3,
      keywords: ['tight', 'dull'],
      troubleAreas: ['forehead'],
    },
    // Day 19 — Thursday
    {
      products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 3,
      keywords: ['dry'],
    },
    // Day 18 — Friday, flour + alcohol
    {
      products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'],
      variables: ['flour', 'alcohol', 'bangs'],
      score: 2,
      keywords: ['trouble', 'greasy'],
      troubleAreas: ['jawline', 'nose'],
    },
    // Day 17 — Saturday
    {
      products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'],
      variables: ['poorSleep', 'bangs'],
      score: 2,
      keywords: ['dull', 'dry', 'flaky'],
    },
    // Day 16 — Sunday, full care
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림', '라네즈 워터슬리핑마스크'],
      variables: ['exercise', 'custom_2'],
      score: 4,
      keywords: ['moist', 'bright'],
    },
    // Day 15 — Monday
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 5,
      keywords: ['moist', 'bright', 'smooth'],
      morningMemo: '꿀피부 데이',
    },
    // Day 14 — Tuesday
    {
      products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'],
      variables: ['exercise', 'bangs'],
      score: 4,
      keywords: ['moist'],
    },
    // Day 13 — Wednesday, spicy
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['spicy', 'stress', 'bangs'],
      score: 3,
      keywords: ['red', 'trouble'],
      troubleAreas: ['cheek_left'],
    },
    // Day 12 — Thursday
    {
      products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 2,
      keywords: ['trouble', 'red'],
      troubleAreas: ['jawline'],
      morningMemo: '턱 트러블 계속',
    },
    // Day 11 — Friday, alcohol
    {
      products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'],
      variables: ['alcohol', 'flour', 'bangs'],
      score: 3,
      keywords: ['greasy', 'dull'],
    },
    // Day 10 — Saturday
    {
      products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 2,
      keywords: ['dry', 'flaky'],
    },
    // Day 9 — Sunday, full care
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림', '라네즈 워터슬리핑마스크'],
      variables: ['exercise', 'custom_2'],
      score: 4,
      keywords: ['moist'],
    },
    // Day 8 — Monday
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 5,
      keywords: ['moist', 'bright'],
    },
    // Day 7 — Tuesday
    {
      products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'],
      variables: ['exercise', 'bangs'],
      score: 4,
      keywords: ['moist', 'bright'],
    },
    // Day 6 — Wednesday, overtime
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['overtime', 'stress', 'flour', 'bangs', 'custom_1'],
      score: 3,
      keywords: ['tight', 'dull'],
      troubleAreas: ['forehead', 'nose'],
    },
    // Day 5 — Thursday
    {
      products: ['이니스프리 그린티 토너', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 2,
      keywords: ['trouble'],
      troubleAreas: ['jawline'],
    },
    // Day 4 — Friday
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['exercise', 'bangs'],
      score: 3,
      keywords: ['dry'],
    },
    // Day 3 — Saturday, minimal
    {
      products: ['이니스프리 그린티 토너', '달바 화이트트러플 크림'],
      variables: ['alcohol', 'bangs'],
      score: 4,
      keywords: ['moist'],
    },
    // Day 2 — Sunday, full care
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '코스알엑스 스네일 에센스', '달바 화이트트러플 크림', '라네즈 워터슬리핑마스크'],
      variables: ['exercise', 'custom_2'],
      score: 3,
      keywords: ['trouble', 'greasy'],
      troubleAreas: ['cheek_right'],
    },
    // Day 1 (yesterday)
    {
      products: ['이니스프리 그린티 토너', '아이소이 트러블케어 세럼', '달바 화이트트러플 크림'],
      variables: ['bangs'],
      score: 4,
      keywords: ['moist', 'bright', 'smooth'],
    },
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
        memo: p.nightMemo,
        loggedAt: `${date}T22:00:00`,
      },
      morningLog: {
        score: p.score,
        keywords: p.keywords,
        troubleAreas: p.troubleAreas,
        memo: p.morningMemo,
        loggedAt: `${date}T08:00:00`,
      },
    };
  }

  return records;
}

export const DEMO_MILESTONES: Milestone[] = [
  { type: '7day', achievedAt: '2026-03-01T00:00:00', seen: true },
  { type: '14day', achievedAt: '2026-03-08T00:00:00', seen: true },
  { type: '30day', achievedAt: '2026-03-22T00:00:00', seen: false },
];

export function loadDemoData() {
  return {
    records: generateDemoRecords(),
    products: [...DEMO_PRODUCTS],
    customVariables: [...DEMO_CUSTOM_VARIABLES],
    pinnedVariables: [...DEMO_PINNED_VARIABLES],
    milestones: [...DEMO_MILESTONES],
  };
}
