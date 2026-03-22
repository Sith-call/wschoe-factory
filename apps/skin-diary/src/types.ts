// === V1 Base Types (preserved for migration) ===

export type Variable =
  | 'flour'
  | 'spicy'
  | 'alcohol'
  | 'exercise'
  | 'poorSleep'
  | 'bangs'
  | 'stress'
  | 'overtime'
  | 'mask'
  | 'period';

export type SkinKeyword =
  | 'moist'
  | 'dry'
  | 'trouble'
  | 'pimple'
  | 'flaky'
  | 'greasy'
  | 'dull'
  | 'bright'
  | 'red'
  | 'tight'
  | 'smooth'
  | 'pore'
  | 'sebum';

export type ProductCategory =
  | 'cleansing'
  | 'toner'
  | 'serum'
  | 'essence'
  | 'cream'
  | 'eyecream'
  | 'sunscreen'
  | 'mask'
  | 'other';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  addedAt: string;
  archived?: boolean;
}

// === V2 New Types ===

export type TroubleArea = 'jawline' | 'forehead' | 'cheek_left' | 'cheek_right' | 'nose' | 'whole';

export interface CustomVariable {
  id: string;
  label: string;
  createdAt: string;
  archived?: boolean;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  avgScore: number;
  scoreTrend: 'up' | 'down' | 'stable';
  topPositiveProduct?: string;
  topNegativeVariable?: string;
  keywordChanges: { keyword: SkinKeyword; change: number }[];
  recordDays: number;
  generatedAt: string;
}

export interface Milestone {
  type: '7day' | '14day' | '30day' | '60day' | '100day';
  achievedAt: string;
  seen: boolean;
}

// === V2 Extended Log Types ===

export interface NightLog {
  products: string[];
  variables: (Variable | string)[]; // V2: supports custom variables
  memo?: string;
  loggedAt: string;
}

export interface MorningLog {
  score: 1 | 2 | 3 | 4 | 5;
  keywords: SkinKeyword[];
  troubleAreas?: TroubleArea[]; // V2: trouble area tracking
  memo?: string;
  loggedAt: string;
}

export interface SkinRecord {
  date: string;
  nightLog?: NightLog;
  morningLog?: MorningLog;
}

// === Insight Types ===

export interface ProductInsight {
  productName: string;
  usedDays: number;
  avgScoreWhenUsed: number;
  avgScoreWhenNotUsed: number;
  impact: number;
}

export interface VariableInsight {
  variable: string;
  activeDays: number;
  avgScoreWhenActive: number;
  avgScoreWhenInactive: number;
  impact: number;
}

export interface ComboInsight {
  productA: string;
  productB: string;
  togetherDays: number;
  avgScoreTogether: number;
  avgScoreAOnly: number;
  avgScoreBOnly: number;
  synergyScore: number;
}

export interface KeywordTrend {
  keyword: SkinKeyword;
  currentCount: number;
  previousCount: number;
  changePercent: number;
}

export interface UserProfile {
  name: string;
  skinTypes: string[];
}

export interface UserSettings {
  pinnedVariables: string[];
  customVariables: CustomVariable[];
}

// === Label Maps ===

export const VARIABLE_LABELS: Record<Variable, string> = {
  flour: '밀가루',
  spicy: '매운음식',
  alcohol: '음주',
  exercise: '운동',
  poorSleep: '수면부족',
  bangs: '앞머리',
  stress: '스트레스',
  overtime: '야근',
  mask: '마스크',
  period: '생리',
};

export const KEYWORD_LABELS: Record<SkinKeyword, string> = {
  moist: '촉촉',
  dry: '건조',
  trouble: '트러블',
  pimple: '뾰루지',
  flaky: '각질',
  greasy: '번들',
  dull: '칙칙',
  bright: '화사',
  red: '붉음',
  tight: '당김',
  smooth: '매끈',
  pore: '모공',
  sebum: '피지',
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  cleansing: '클렌징',
  toner: '토너',
  serum: '세럼',
  essence: '에센스',
  cream: '크림',
  eyecream: '아이크림',
  sunscreen: '선크림',
  mask: '마스크팩',
  other: '기타',
};

export const SCORE_LABELS: Record<number, string> = {
  1: '최악',
  2: '별로',
  3: '보통',
  4: '좋아요',
  5: '꿀피부',
};

export const TROUBLE_AREA_LABELS: Record<TroubleArea, string> = {
  jawline: '턱선',
  forehead: '이마',
  cheek_left: '볼(좌)',
  cheek_right: '볼(우)',
  nose: '코',
  whole: '전체',
};

export const ALL_VARIABLES: Variable[] = [
  'flour', 'spicy', 'alcohol', 'exercise', 'poorSleep',
  'bangs', 'stress', 'overtime', 'mask', 'period',
];

export const ALL_KEYWORDS: SkinKeyword[] = [
  'moist', 'dry', 'trouble', 'pimple', 'flaky',
  'greasy', 'dull', 'bright', 'red', 'tight', 'smooth',
  'pore', 'sebum',
];

export const CATEGORY_ORDER: ProductCategory[] = [
  'cleansing', 'toner', 'serum', 'essence', 'cream',
  'eyecream', 'sunscreen', 'mask', 'other',
];

export const ALL_TROUBLE_AREAS: TroubleArea[] = [
  'forehead', 'cheek_left', 'nose', 'cheek_right', 'jawline', 'whole',
];

export const MILESTONE_TYPES: Milestone['type'][] = ['7day', '14day', '30day', '60day', '100day'];

export const MILESTONE_LABELS: Record<Milestone['type'], string> = {
  '7day': '7일 연속 기록',
  '14day': '14일 연속 기록',
  '30day': '30일 연속 기록',
  '60day': '60일 연속 기록',
  '100day': '100일 연속 기록',
};

export const MILESTONE_DAYS: Record<Milestone['type'], number> = {
  '7day': 7,
  '14day': 14,
  '30day': 30,
  '60day': 60,
  '100day': 100,
};
