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
  | 'smooth';

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

export interface NightLog {
  products: string[];
  variables: Variable[];
  loggedAt: string;
}

export interface MorningLog {
  score: 1 | 2 | 3 | 4 | 5;
  keywords: SkinKeyword[];
  memo?: string;
  loggedAt: string;
}

export interface SkinRecord {
  date: string;
  nightLog?: NightLog;
  morningLog?: MorningLog;
}

export interface ProductInsight {
  productName: string;
  usedDays: number;
  avgScoreWhenUsed: number;
  avgScoreWhenNotUsed: number;
  impact: number;
}

export interface VariableInsight {
  variable: Variable;
  activeDays: number;
  avgScoreWhenActive: number;
  avgScoreWhenInactive: number;
  impact: number;
}

export interface UserProfile {
  name: string;
  skinTypes: string[];
}

export const VARIABLE_LABELS: Record<Variable, string> = {
  flour: '밀가루',
  spicy: '매운 음식',
  alcohol: '음주',
  exercise: '운동',
  poorSleep: '수면 부족',
  bangs: '앞머리',
  stress: '스트레스',
  overtime: '야근',
  mask: '마스크',
  period: '생리전',
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
  4: '좋아',
  5: '꿀피부',
};

export const ALL_VARIABLES: Variable[] = [
  'flour', 'spicy', 'alcohol', 'exercise', 'poorSleep',
  'bangs', 'stress', 'overtime', 'mask', 'period',
];

export const ALL_KEYWORDS: SkinKeyword[] = [
  'moist', 'dry', 'trouble', 'pimple', 'flaky',
  'greasy', 'dull', 'bright', 'red', 'tight', 'smooth',
];

export const CATEGORY_ORDER: ProductCategory[] = [
  'cleansing', 'toner', 'serum', 'essence', 'cream',
  'eyecream', 'sunscreen', 'mask', 'other',
];
