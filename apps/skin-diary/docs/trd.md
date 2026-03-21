# 피부 일지 (Skin Diary) — Technical Requirements Document

## 1. 개요

20대 여성을 위한 스킨케어 추적 앱. 밤에 사용한 제품과 생활 변수를 기록하고, 다음 날 아침 피부 상태를 평가하여 어떤 제품/습관이 피부에 영향을 주는지 인사이트를 제공한다.

**핵심 인사이트**: 밤 기록(Night Log)의 제품/변수가 **다음 날 아침** 기록(Morning Log)의 피부 점수와 상관관계를 가진다.

---

## 2. 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | React 18 |
| 언어 | TypeScript |
| 빌드 도구 | Vite |
| 스타일링 | Tailwind CSS (CDN) |
| 상태 관리 | React useState + Context |
| 데이터 저장 | localStorage |
| 포트 | 5186 |

---

## 3. 데이터 모델

```typescript
// === Core Types ===

type Variable =
  | 'flour'      // 밀가루 음식
  | 'spicy'      // 매운 음식
  | 'alcohol'    // 음주
  | 'exercise'   // 운동
  | 'poorSleep'  // 수면 부족
  | 'bangs'      // 앞머리 내림
  | 'stress'     // 스트레스
  | 'overtime'   // 야근
  | 'mask'       // 마스크 착용
  | 'period';    // 생리 기간

type SkinKeyword =
  | 'moist'   // 촉촉
  | 'dry'     // 건조
  | 'trouble' // 트러블
  | 'flaky'   // 각질
  | 'oily'    // 유분
  | 'bright'  // 화사
  | 'dull'    // 칙칙
  | 'red'     // 붉은기
  | 'tight';  // 당김

type ProductCategory =
  | 'cleansing'
  | 'toner'
  | 'serum'
  | 'essence'
  | 'cream'
  | 'eyecream'
  | 'sunscreen'
  | 'mask'
  | 'other';

// === Entities ===

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  addedAt: string; // ISO 8601
}

interface NightLog {
  products: string[];     // product names used
  variables: Variable[];  // lifestyle variables
  loggedAt: string;       // ISO 8601
}

interface MorningLog {
  score: 1 | 2 | 3 | 4 | 5;
  keywords: SkinKeyword[];
  memo?: string;
  loggedAt: string; // ISO 8601
}

interface SkinRecord {
  date: string; // YYYY-MM-DD
  nightLog?: NightLog;
  morningLog?: MorningLog;
}

// === Insights ===

interface ProductInsight {
  productName: string;
  usedDays: number;
  avgScoreWhenUsed: number;
  avgScoreWhenNotUsed: number;
  impact: number; // avgScoreWhenUsed - avgScoreWhenNotUsed
}

interface VariableInsight {
  variable: Variable;
  activeDays: number;
  avgScoreWhenActive: number;
  avgScoreWhenInactive: number;
  impact: number; // avgScoreWhenActive - avgScoreWhenInactive
}
```

---

## 4. localStorage 스키마

```typescript
// 키: "skin-diary-records"
// 값: Record<string, SkinRecord>  (key = date string "YYYY-MM-DD")

// 키: "skin-diary-products"
// 값: Product[]

// 키: "skin-diary-onboarded"
// 값: boolean
```

---

## 5. 상관관계 분석 로직

핵심: **날짜 N의 Night Log** → **날짜 N+1의 Morning Log**와 연결.

### 5.1 제품 인사이트 계산

```typescript
function calculateProductInsight(
  productName: string,
  records: Record<string, SkinRecord>
): ProductInsight {
  const dates = Object.keys(records).sort();
  let usedDays = 0;
  let usedScoreSum = 0;
  let notUsedDays = 0;
  let notUsedScoreSum = 0;

  for (const date of dates) {
    const record = records[date];
    if (!record.nightLog) continue;

    // Find NEXT day's morning log
    const nextDate = getNextDate(date);
    const nextRecord = records[nextDate];
    if (!nextRecord?.morningLog) continue;

    const nextScore = nextRecord.morningLog.score;

    if (record.nightLog.products.includes(productName)) {
      usedDays++;
      usedScoreSum += nextScore;
    } else {
      notUsedDays++;
      notUsedScoreSum += nextScore;
    }
  }

  const avgUsed = usedDays > 0 ? usedScoreSum / usedDays : 0;
  const avgNotUsed = notUsedDays > 0 ? notUsedScoreSum / notUsedDays : 0;

  return {
    productName,
    usedDays,
    avgScoreWhenUsed: Math.round(avgUsed * 100) / 100,
    avgScoreWhenNotUsed: Math.round(avgNotUsed * 100) / 100,
    impact: Math.round((avgUsed - avgNotUsed) * 100) / 100,
  };
}
```

### 5.2 변수 인사이트 계산

동일 로직, `record.nightLog.variables.includes(variable)`로 판별.

### 5.3 최소 데이터 요구

- 인사이트 표시 최소 조건: 해당 제품/변수가 **3일 이상** 사용/활성화된 경우
- 전체 인사이트 탭 활성화: **7일 이상** 기록이 있을 때

---

## 6. 화면 구조

### 6.1 네비게이션

Bottom tab bar (3 tabs, text-only — 아이콘 없이 텍스트 + 언더라인):

| 탭 | 라벨 | 화면 |
|----|------|------|
| 1 | 홈 | 오늘의 기록 + 최근 요약 |
| 2 | 캘린더 | 월간 캘린더 뷰 |
| 3 | 인사이트 | 제품/변수별 상관관계 분석 |

### 6.2 홈 화면

```
┌──────────────────────────────┐
│ 3월 21일 금요일               │
│ 오늘의 피부 일지               │
│                              │
│ ┌──────────────────────────┐ │
│ │ ☽ 어젯밤 기록              │ │
│ │                          │ │
│ │ 사용한 제품:               │ │
│ │ [클렌징] [토너] [세럼] +   │ │
│ │                          │ │
│ │ 생활 변수:                 │ │
│ │ [밀가루] [야근] [스트레스]   │ │
│ │                          │ │
│ │ [기록 완료 ✓] 또는 [기록하기]│ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ ☀ 오늘 아침 피부            │ │
│ │                          │ │
│ │ 피부 점수:                 │ │
│ │  ① ② ③ ④ ⑤              │ │
│ │                          │ │
│ │ 피부 키워드:               │ │
│ │ [촉촉] [건조] [트러블] ... │ │
│ │                          │ │
│ │ 메모: _________________   │ │
│ │                          │ │
│ │ [기록 완료 ✓] 또는 [기록하기]│ │
│ └──────────────────────────┘ │
│                              │
│ ── 최근 7일 요약 ──           │
│ 평균 점수: 3.4               │
│ 가장 많은 키워드: 건조, 트러블  │
│                              │
│  [홈]   [캘린더]   [인사이트]  │
└──────────────────────────────┘
```

### 6.3 캘린더 화면

- 월간 캘린더 그리드
- 각 날짜 셀: 피부 점수 색상으로 표시 (score-1 ~ score-5 배경)
- 기록 없는 날: 빈 셀
- 날짜 클릭 → 해당일 기록 상세 보기 (모달 또는 인라인 확장)

### 6.4 인사이트 화면

- 상단 세그먼트: **제품별** | **변수별**
- 각 항목: 이름, 사용 일수, 사용 시 평균 점수, 미사용 시 평균 점수, 영향도(+/-)
- 영향도 양수(초록) = 피부에 좋은 영향, 음수(빨강) = 피부에 나쁜 영향
- 최소 데이터 미충족 시: "7일 이상 기록하면 인사이트를 볼 수 있어요" 안내

### 6.5 제품 관리

- 홈 화면 상단 설정 아이콘 또는 Night Log 내 "제품 추가" 버튼에서 접근
- 제품 목록: 이름, 카테고리 표시
- 제품 추가: 이름 입력 + 카테고리 선택
- 제품 삭제: 스와이프 또는 삭제 버튼

### 6.6 온보딩 (최초 1회)

1. "피부 일지에 오신 것을 환영해요" — 앱 소개
2. "자주 쓰는 제품을 등록해주세요" — 제품 3개 이상 등록 유도
3. 완료 → 홈 화면

---

## 7. 데모 모드

DB 없이 바로 체험 가능한 데모 데이터 포함:

```typescript
const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: '라운드랩 독도 토너', category: 'toner', addedAt: '...' },
  { id: '2', name: '코스알엑스 스네일 에센스', category: 'essence', addedAt: '...' },
  { id: '3', name: '이니스프리 그린티 세럼', category: 'serum', addedAt: '...' },
  { id: '4', name: '아이오페 레티놀 크림', category: 'cream', addedAt: '...' },
  { id: '5', name: '비오레 워터리 선크림', category: 'sunscreen', addedAt: '...' },
  { id: '6', name: '토리든 다이브인 클렌저', category: 'cleansing', addedAt: '...' },
];

// 최근 14일간의 샘플 데이터 포함
// - 다양한 점수 분포 (1~5)
// - 제품 사용 패턴 (일부 날은 3개, 일부는 5개)
// - 변수 활성화 패턴 (음주 후 다음 날 점수 낮게 등)
```

---

## 8. 컴포넌트 구조

```
src/
├── App.tsx                    # 라우팅 + 탭 네비게이션
├── main.tsx                   # 엔트리포인트
├── index.css                  # Tailwind + 커스텀 스타일
├── types.ts                   # 타입 정의
├── data/
│   └── demo.ts                # 데모 데이터
├── hooks/
│   ├── useRecords.ts          # SkinRecord CRUD
│   ├── useProducts.ts         # Product CRUD
│   └── useInsights.ts         # 인사이트 계산
├── components/
│   ├── TabBar.tsx             # 하단 텍스트 탭바
│   ├── NightLogCard.tsx       # 밤 기록 카드
│   ├── MorningLogCard.tsx     # 아침 기록 카드
│   ├── ScoreSelector.tsx      # 1~5 점수 선택
│   ├── KeywordChips.tsx       # 피부 키워드 칩
│   ├── VariableChips.tsx      # 생활 변수 칩
│   ├── ProductSelector.tsx    # 제품 선택/추가
│   ├── CalendarGrid.tsx       # 월간 캘린더
│   ├── DayDetail.tsx          # 일별 기록 상세
│   ├── InsightCard.tsx        # 인사이트 항목 카드
│   └── WeeklySummary.tsx      # 주간 요약
├── pages/
│   ├── HomePage.tsx           # 홈 탭
│   ├── CalendarPage.tsx       # 캘린더 탭
│   ├── InsightPage.tsx        # 인사이트 탭
│   ├── ProductManagePage.tsx  # 제품 관리
│   └── OnboardingPage.tsx     # 온보딩
└── utils/
    ├── date.ts                # 날짜 유틸리티
    ├── storage.ts             # localStorage 래퍼
    └── insights.ts            # 상관관계 계산 함수
```

---

## 9. 한국어 UI 라벨

```typescript
const VARIABLE_LABELS: Record<Variable, string> = {
  flour: '밀가루',
  spicy: '매운 음식',
  alcohol: '음주',
  exercise: '운동',
  poorSleep: '수면 부족',
  bangs: '앞머리',
  stress: '스트레스',
  overtime: '야근',
  mask: '마스크',
  period: '생리',
};

const KEYWORD_LABELS: Record<SkinKeyword, string> = {
  moist: '촉촉',
  dry: '건조',
  trouble: '트러블',
  flaky: '각질',
  oily: '유분기',
  bright: '화사',
  dull: '칙칙',
  red: '붉은기',
  tight: '당김',
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
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

const SCORE_LABELS: Record<number, string> = {
  1: '최악',
  2: '별로',
  3: '보통',
  4: '좋아',
  5: '꿀피부',
};
```

---

## 10. 비기능 요구사항

- **데이터 영속성**: localStorage만 사용, 서버 없음
- **반응형**: 모바일 우선 (max-width: 430px 기준), 데스크톱에서도 깨지지 않게
- **접근성**: 모든 interactive 요소에 aria-label, 키보드 네비게이션 지원
- **성능**: 초기 로딩 1초 이내, 인사이트 계산은 useMemo로 캐싱
- **데모 모드**: 최초 진입 시 데모 데이터 로딩 옵션 제공
