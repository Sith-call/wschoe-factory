# 퇴근하면 뭐하지? — Technical Requirements Document

## 1. 개요

퇴근길에 하루 한 줄, 내가 하고 싶은 걸 적어보는 마이크로 저널 앱. 매일 건조한 프롬프트 하나와 마중물 큐레이션 카드 3~4장이 영감을 제공하고, 사용자는 한 줄만 적는다. 주간 요약 카드로 "이번 주 하고 싶었던 것들"을 돌아본다.

**핵심 가치**: 앱은 조용하다. 내 생각이 주인공이고, 앱은 마중물만 깔아준다. 한 줄이면 충분하다.

**오프라인 전용**: 서버 없음. 모든 데이터는 기기 로컬에 저장. 네트워크 요청 0건.

---

## 2. 기술 스택

| 항목 | 선택 | 근거 |
|------|------|------|
| 프레임워크 | Vite + React 18 + TypeScript | 4개 화면 + 상태 관리 + 캘린더 UI로 컴포넌트 기반이 적합 |
| 스타일링 | CSS Modules + CSS Variables | 컴포넌트 스코프 스타일링, 테마 변수 관리, 빌드 의존성 없음 |
| 네이티브 래퍼 | Capacitor 8 | 웹 코드 그대로 Android APK + PWA 겸용 |
| 상태 관리 | React Context + useReducer | 4개 화면, 글로벌 상태 최소 — 외부 라이브러리 불필요 |
| 데이터 저장 | IndexedDB (일기) + Capacitor Preferences (설정) | 아래 상세 |
| 알림 | @capacitor/local-notifications | 매일 퇴근 시간 리마인드 |
| 아이콘 | Lucide React | 경량, 트리쉐이킹 지원, 일관된 스트로크 스타일 |
| 라우팅 | React Router v6 (hash router) | Capacitor 호환성을 위해 hash 기반 |
| 포트 | 5191 |

### React 선택 근거

화면 4개, 캘린더 UI, 카드 슬라이더, 설정 폼 등 반복/조건부 렌더링이 많다. Vanilla TS로 구현하면 DOM 조작 코드가 비즈니스 로직보다 커진다. React의 선언적 UI + 컴포넌트 재사용이 이 복잡도에서 순이익을 준다.

### 외부 라이브러리 최소 원칙

React, React Router, Lucide, Capacitor 플러그인 외에는 추가 의존성을 넣지 않는다. 날짜 처리는 `Intl.DateTimeFormat` + 직접 유틸로, 애니메이션은 CSS transition으로, 상태 관리는 Context로 해결한다.

---

## 3. 데이터 모델

```typescript
// === Core Types ===

/** 하루 한 줄 기록 */
interface Entry {
  date: string;           // "2026-04-02" (YYYY-MM-DD, 기본키)
  text: string;           // 사용자가 적은 한 줄 (최대 200자)
  promptText: string;     // 그날 보여준 프롬프트 텍스트
  curationIds: number[];  // 그날 노출된 마중물 카드 ID들 (3~4개)
  selectedCurationId: number | null;  // 사용자가 탭한 카드 ID (없으면 null)
  createdAt: string;      // ISO 8601 (최초 작성 시각)
  updatedAt: string;      // ISO 8601 (마지막 수정 시각)
}

/** 앱 설정 */
interface Settings {
  notificationEnabled: boolean;   // 알림 켜기/끄기 (기본: true)
  notificationTime: string;       // "HH:mm" 형식 (기본: "18:00")
  theme: 'light' | 'dark';       // 테마 (기본: 'light')
  installedAt: string;            // ISO 8601 (첫 실행 시각, 주간 카드 기준점)
}

/** 프롬프트 */
interface Prompt {
  id: number;             // 고유 식별자
  text: string;           // "퇴근 후 한 가지."
  variants: string[];     // 변형 2~3개 ["오늘 저녁, 딱 하나.", "지금 가장 끌리는 건."]
}

/** 마중물 큐레이션 카드 */
interface CurationCard {
  id: number;             // 고유 식별자
  category: CurationCategory;
  activity: string;       // "동네 산책 15분"
  subtext: string;        // 부가 설명 (1줄)
}

/** 큐레이션 카테고리 */
type CurationCategory =
  | 'eat'       // 먹기
  | 'move'      // 움직이기
  | 'rest'      // 쉬기
  | 'meet'      // 만나기
  | 'learn'     // 배우기
  | 'make'      // 만들기
  | 'watch'     // 보기
  | 'listen';   // 듣기

/** 주간 요약 카드 (런타임 계산, 저장 안 함) */
interface WeeklySummary {
  weekStart: string;      // "2026-03-30" (월요일)
  weekEnd: string;        // "2026-04-05" (일요일)
  entries: Entry[];       // 해당 주 기록들
  totalDays: number;      // 적은 날 수 (0~7)
  topCategories: CurationCategory[];  // 가장 많이 선택한 카테고리 (selectedCurationId 기반)
}
```

### 데이터 저장 전략

| 데이터 | 저장소 | 키/스토어 | 이유 |
|--------|--------|-----------|------|
| Entry (일기) | IndexedDB | `after-work-entries` 스토어 | 수백~수천 건 축적. 날짜 기반 범위 조회 필요 |
| Settings | Capacitor Preferences | `aw-settings` | 키-값 5개 미만. Preferences가 가장 간단 |
| Prompts (풀) | `src/data/prompts.ts` | 빌드 타임 번들 | 정적 데이터, 업데이트 없음 |
| Curations (풀) | `src/data/curations.ts` | 빌드 타임 번들 | 정적 데이터, 업데이트 없음 |
| 오늘 노출 이력 | sessionStorage | `aw-today-shown` | 앱 재시작 시 리셋 OK. 같은 세션 내 중복 방지용 |

### IndexedDB 스키마

```typescript
// 데이터베이스: "after-work-db", 버전 1
// 오브젝트 스토어: "entries"
//   - keyPath: "date" (YYYY-MM-DD 문자열이 기본키)
//   - 인덱스: "createdAt" (시간순 조회용)

const DB_NAME = 'after-work-db';
const DB_VERSION = 1;
const STORE_NAME = 'entries';
```

**date를 기본키로 쓰는 이유**: 하루 1개 기록 원칙. 같은 날짜에 다시 쓰면 `put`으로 덮어쓴다. 별도 중복 방지 로직이 불필요하다.

### 하루 1개 제약

- 같은 날짜에 기록이 이미 있으면 수정 모드로 진입
- 새로 쓰면 `put` (upsert). 기존 기록을 덮어씀
- `createdAt`은 최초 작성 시각 유지, `updatedAt`만 갱신

---

## 4. 프로젝트 구조

```
apps/after-work/
├── docs/
│   ├── trd.md                      # 이 문서
│   └── pm-outputs/                 # PM 산출물
├── src/
│   ├── main.tsx                    # React 진입점
│   ├── App.tsx                     # 라우터 + 전역 Context Provider
│   ├── components/
│   │   ├── PromptDisplay.tsx       # 오늘의 프롬프트 텍스트
│   │   ├── CurationSlider.tsx      # 마중물 카드 3~4장 (가로 스크롤)
│   │   ├── EntryInput.tsx          # 한 줄 입력 필드 + 저장
│   │   ├── CalendarGrid.tsx        # 월별 캘린더 그리드
│   │   ├── DayCell.tsx             # 캘린더 날짜 셀 (적은 날 표시)
│   │   ├── EntryCard.tsx           # 기록 한 줄 표시 카드
│   │   ├── WeeklyCard.tsx          # 주간 요약 카드
│   │   ├── TimePicker.tsx          # 알림 시간 설정
│   │   ├── Toast.tsx               # 저장/삭제 피드백 토스트
│   │   └── PageHeader.tsx          # 페이지 상단 헤더 (네비게이션 아이콘 포함)
│   ├── pages/
│   │   ├── TodayPage.tsx           # 메인: 프롬프트 + 큐레이션 + 입력
│   │   ├── RecordPage.tsx          # 캘린더 + 주간 카드 (상단)
│   │   ├── WeeklyPage.tsx          # 주간 상세 카드 (RecordPage에서 진입)
│   │   └── SettingsPage.tsx        # 알림, 테마, 데이터 초기화
│   ├── hooks/
│   │   ├── useEntries.ts           # IndexedDB CRUD 래퍼
│   │   ├── useSettings.ts          # Capacitor Preferences 래퍼
│   │   ├── useToday.ts             # 오늘의 프롬프트/큐레이션 선택 로직
│   │   └── useNotification.ts      # 알림 권한 + 스케줄링
│   ├── data/
│   │   ├── prompts.ts              # 프롬프트 풀 (30개+)
│   │   └── curations.ts            # 큐레이션 카드 풀 (60개+, 카테고리별)
│   ├── stores/
│   │   └── AppContext.tsx           # 전역 상태 (settings, todayEntry)
│   ├── utils/
│   │   ├── db.ts                   # IndexedDB 초기화 + CRUD 함수
│   │   ├── date.ts                 # 날짜 유틸 (주 시작일, 포맷팅 등)
│   │   ├── random.ts               # 시드 기반 랜덤 (날짜별 일관성)
│   │   └── platform.ts             # Capacitor/웹 플랫폼 분기
│   ├── styles/
│   │   ├── global.css              # CSS 변수, 리셋, 기본 타이포
│   │   └── tokens.css              # 디자인 토큰 (색상, 간격, 폰트)
│   └── types/
│       └── index.ts                # 공유 타입 정의
├── public/
│   ├── manifest.json               # PWA 매니페스트
│   └── sw.js                       # Service Worker (PWA용)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── capacitor.config.ts
└── package.json
```

### 파일 책임 원칙

- `components/`: 재사용 가능한 UI 조각. 비즈니스 로직 없음
- `pages/`: 라우트 단위 화면. 훅 조합 + 컴포넌트 배치만 담당
- `hooks/`: 데이터 접근 + 비즈니스 로직 캡슐화
- `utils/`: 순수 함수. React 의존성 없음
- `stores/`: Context Provider + Reducer. 전역 상태 정의

---

## 5. 상태 관리 전략

### 전역 상태 (AppContext)

```typescript
interface AppState {
  settings: Settings;
  todayEntry: Entry | null;       // 오늘 기록 (있으면 수정 모드)
  todayPrompt: Prompt;            // 오늘의 프롬프트
  todayCurations: CurationCard[]; // 오늘의 마중물 카드 3~4장
  toastMessage: string | null;    // 토스트 메시지 (null이면 숨김)
}

type AppAction =
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'SET_TODAY_ENTRY'; payload: Entry | null }
  | { type: 'SET_TODAY_PROMPT'; payload: Prompt }
  | { type: 'SET_TODAY_CURATIONS'; payload: CurationCard[] }
  | { type: 'SHOW_TOAST'; payload: string }
  | { type: 'HIDE_TOAST' };
```

### 로컬 상태 (컴포넌트 내)

| 상태 | 위치 | 이유 |
|------|------|------|
| 입력 중인 텍스트 | `EntryInput` | 저장 전까지 전역에 노출할 필요 없음 |
| 캘린더 현재 월 | `CalendarGrid` | 네비게이션 상태, 다른 컴포넌트와 무관 |
| 선택된 날짜 | `RecordPage` | 해당 페이지 내에서만 사용 |
| 알림 시간 임시값 | `TimePicker` | 확인 누르기 전까지 반영 안 함 |

### 데이터 흐름

```
앱 시작
  → IndexedDB에서 오늘 Entry 조회
  → Capacitor Preferences에서 Settings 로드
  → 날짜 기반 시드로 오늘의 Prompt + Curations 결정
  → AppContext 초기화
  
사용자 입력
  → EntryInput 로컬 상태 업데이트
  → 저장 버튼 클릭
  → useEntries.save() → IndexedDB에 put
  → AppContext.todayEntry 갱신
  → Toast "저장됨" 표시 (2초 후 자동 소멸)
```

---

## 6. IndexedDB 접근 레이어 (`utils/db.ts`)

### API 설계

```typescript
// 초기화
function openDB(): Promise<IDBDatabase>;

// Entry CRUD
function getEntry(date: string): Promise<Entry | undefined>;
function putEntry(entry: Entry): Promise<void>;
function deleteEntry(date: string): Promise<void>;
function getEntriesByRange(startDate: string, endDate: string): Promise<Entry[]>;
function getAllEntries(): Promise<Entry[]>;

// 유틸
function getEntryCount(): Promise<number>;
function clearAllEntries(): Promise<void>;
```

### 구현 원칙

1. **Promise 래핑**: IDBRequest의 onsuccess/onerror를 Promise로 래핑. async/await으로 호출
2. **단일 연결**: `openDB()`는 싱글턴 패턴. 한 번 열면 앱 생애주기 동안 재사용
3. **트랜잭션 단위**: 각 함수가 독립 트랜잭션. 복합 작업이 필요하면 별도 함수로 묶음
4. **에러 처리**: IndexedDB 에러 시 console.error + 사용자에게 Toast로 "저장 실패" 안내
5. **마이그레이션**: `onupgradeneeded`에서 버전별 스키마 변경 처리

### 범위 조회 구현

```typescript
// getEntriesByRange: IDBKeyRange.bound 사용
// date가 "YYYY-MM-DD" 문자열이므로 사전순 정렬 = 날짜순 정렬
const range = IDBKeyRange.bound(startDate, endDate);
const request = store.openCursor(range);
```

**문자열 날짜의 이점**: "2026-04-01" < "2026-04-07"이 사전순으로도 성립. 별도 인덱스 변환 없이 IDBKeyRange로 범위 조회 가능.

---

## 7. 프롬프트 / 큐레이션 선택 로직

### 오늘의 프롬프트 결정

```
1. 날짜 문자열 "2026-04-02"를 해시 → 시드값 생성
2. 시드값 % prompts.length → 프롬프트 인덱스
3. 선택된 프롬프트의 variants 중 시드값 % variants.length → 실제 텍스트
```

**날짜 기반 시드를 쓰는 이유**: 같은 날 앱을 여러 번 열어도 같은 프롬프트를 보여준다. Math.random()을 쓰면 새로고침마다 바뀌어서 일관성이 깨진다.

### 마중물 카드 선택

```
1. 같은 날짜 시드 사용
2. 카테고리 8개 중 3~4개를 시드 기반으로 선택 (중복 없이)
3. 선택된 카테고리별로 시드 기반으로 활동 1개씩 선택
4. 결과: 서로 다른 카테고리의 카드 3~4장
```

**카테고리 중복 방지**: "먹기" 카드 3장이 나오면 영감의 다양성이 사라진다. 항상 다른 카테고리에서 1장씩 뽑는다.

### 시드 해시 함수

```typescript
function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0; // 32비트 정수 변환
  }
  return Math.abs(hash);
}
```

---

## 8. 화면별 상세 스펙

### 8-1. 오늘 (메인) — `TodayPage`

```
┌─────────────────────────────┐
│ [캘린더]            [설정]  │  ← PageHeader (아이콘 2개, 우측 정렬)
│                             │
│ "퇴근 후 한 가지."          │  ← PromptDisplay (오늘의 프롬프트)
│                             │
│ ┌─────┐ ┌─────┐ ┌─────┐   │  ← CurationSlider (가로 스크롤)
│ │먹기 │ │쉬기 │ │배우기│   │     마중물 카드 3~4장
│ │동네  │ │반신욕│ │팟캐 │   │
│ │치킨  │ │20분 │ │스트  │   │
│ └─────┘ └─────┘ └─────┘   │
│                             │
│ ┌─────────────────────────┐ │  ← EntryInput
│ │ 오늘 하고 싶은 거...     │ │     placeholder 텍스트
│ └─────────────────────────┘ │
│                             │
│         [ 적기 ]            │  ← 저장 버튼 (입력 비어있으면 비활성)
└─────────────────────────────┘
```

**동작 상세**:
- 앱 진입 시 오늘 기록이 있으면 입력란에 기존 텍스트 표시 + "적기" → "고치기"로 변경
- 마중물 카드 탭 시 해당 활동 텍스트가 입력란에 자동 입력 (기존 텍스트 있으면 확인 후 덮어쓰기)
- 저장 후 토스트 "적었다." 표시 (2초)
- 입력 최대 200자. 카운터 표시 없음 (200자 도달 시에만 "200/200" 표시)
- 키보드 올라올 때 입력란이 가려지지 않도록 스크롤 조정

### 8-2. 기록 (캘린더) — `RecordPage`

```
┌─────────────────────────────┐
│ ← 오늘                      │  ← 뒤로가기 + 페이지 제목
│                             │
│ ┌─────────────────────────┐ │  ← WeeklyCard (이번 주 요약, 탭하면 상세)
│ │ 이번 주: 3일 적음        │ │
│ │ 먹기 2 · 쉬기 1          │ │
│ └─────────────────────────┘ │
│                             │
│   < 2026년 4월 >            │  ← 월 네비게이션
│ 월 화 수 목 금 토 일        │
│  ·     ·        ·          │  ← 적은 날에 점 표시
│        ·  ·                 │
│                             │
│ ─────────────────────────── │
│ 4월 2일                     │  ← 선택된 날짜의 기록
│ "치킨 먹고 넷플릭스"        │
│                             │
└─────────────────────────────┘
```

**동작 상세**:
- 캘린더는 월 단위 그리드. 좌/우 화살표로 월 이동
- 기록이 있는 날짜에 작은 점(dot) 표시
- 날짜 탭 시 하단에 해당 날 기록 표시. 기록 없으면 빈 상태 + "이 날 적기" CTA
- 미래 날짜는 비활성 (탭 불가)
- 오늘 이전 날짜에 기록 없으면 탭 시 소급 기록 가능 (입력 UI 표시)
- 주간 카드 탭 시 WeeklyPage로 이동

### 8-3. 이번 주 (주간 카드) — `WeeklyPage`

```
┌─────────────────────────────┐
│ ← 기록                      │
│                             │
│ 3/30 ~ 4/5                  │  ← 주간 범위
│ 이번 주 하고 싶었던 것들     │
│                             │
│ 월 "치킨 먹고 넷플릭스"     │  ← 요일별 기록 나열
│ 화 "런닝 30분"              │
│ 수  —                       │  ← 빈 날은 대시
│ 목 "기타 연습"              │
│ 금                          │  ← 아직 안 온 날은 비워둠
│ 토                          │
│ 일                          │
│                             │
│ 3일 적음 · 먹기 2 · 움직이기 1 │  ← 간단한 통계
└─────────────────────────────┘
```

**동작 상세**:
- 현재 주(월~일) 기준으로 표시
- 과거 주는 RecordPage 캘린더에서 해당 주의 날짜를 탭하여 진입
- 빈 날 대시(—)를 탭하면 소급 기록 가능
- 통계는 런타임 계산: 적은 날 수 + selectedCurationId 기반 카테고리 집계

### 8-4. 설정 — `SettingsPage`

```
┌─────────────────────────────┐
│ ← 오늘                      │
│                             │
│ 알림                        │
│ ┌─────────────────────────┐ │
│ │ 퇴근 알림          [ON] │ │  ← 토글 스위치
│ │ 시간             18:00  │ │  ← 탭하면 TimePicker
│ └─────────────────────────┘ │
│                             │
│ 화면                        │
│ ┌─────────────────────────┐ │
│ │ 테마         라이트 ◉   │ │  ← 라이트/다크 선택
│ │              다크   ○   │ │
│ └─────────────────────────┘ │
│                             │
│ 데이터                      │
│ ┌─────────────────────────┐ │
│ │ 기록 수          47개   │ │
│ │ 내보내기 (JSON)    →    │ │  ← 파일로 내보내기
│ │ 전체 삭제           →   │ │  ← 확인 모달 후 삭제
│ └─────────────────────────┘ │
│                             │
│ 버전 1.0.0                  │
└─────────────────────────────┘
```

**동작 상세**:
- 알림 토글 ON 시 권한 요청 (Android 13+ POST_NOTIFICATIONS)
- 시간 변경 시 기존 알림 취소 + 새 시간으로 재스케줄
- 전체 삭제: 확인 모달 "모든 기록이 사라집니다. 되돌릴 수 없습니다." + "삭제" 버튼 (빨간색)
- JSON 내보내기: 모든 Entry를 JSON 배열로 변환 → 파일 다운로드 (웹) 또는 공유 시트 (Capacitor)
- 테마 변경 시 즉시 반영 (CSS 변수 전환)

---

## 9. 알림 시스템

### 기본 동작

```
매일 설정된 시간 (기본 18:00)에 로컬 알림 발송
→ 알림 텍스트: 프롬프트 풀에서 랜덤 선택 (예: "퇴근 후 한 가지.")
→ 탭하면 앱 오늘 페이지로 이동
```

### Capacitor Local Notifications 구현

```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

async function scheduleDaily(time: string): Promise<void> {
  // 기존 알림 전부 취소
  await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  
  const [hours, minutes] = time.split(':').map(Number);
  
  await LocalNotifications.schedule({
    notifications: [{
      id: 1,
      title: '퇴근하면 뭐하지?',
      body: getRandomPromptText(),   // 프롬프트 풀에서 랜덤
      schedule: {
        on: { hour: hours, minute: minutes },
        repeats: true,
        allowWhileIdle: true,        // Doze 모드 대응
      },
      smallIcon: 'ic_notification',  // Android 리소스
      channelId: 'after-work-daily',
    }],
  });
}
```

### Android 13+ 권한 처리

```typescript
async function requestNotificationPermission(): Promise<boolean> {
  const permission = await LocalNotifications.checkPermissions();
  
  if (permission.display === 'granted') return true;
  if (permission.display === 'denied') return false; // 설정에서 직접 변경 필요
  
  const result = await LocalNotifications.requestPermissions();
  return result.display === 'granted';
}
```

**권한 플로우**:
1. 설정에서 알림 토글 ON 시 `requestNotificationPermission()` 호출
2. 허용 → 알림 스케줄링
3. 거부 → 토글 OFF로 되돌림 + Toast "설정에서 알림을 허용해 주세요"
4. "다시 묻지 않기" 선택 시 → 앱 설정 페이지로 유도하는 안내 표시

### Doze 모드 대응

- `allowWhileIdle: true` 설정으로 Doze 모드에서도 알림 발송
- Capacitor Local Notifications 플러그인이 `AlarmManager.setExactAndAllowWhileIdle()` 사용
- Android 12+에서 정확한 알림을 위해 `SCHEDULE_EXACT_ALARM` 권한 필요 → Capacitor가 자동 처리

### 알림 채널 (Android 8+)

```typescript
await LocalNotifications.createChannel({
  id: 'after-work-daily',
  name: '퇴근 알림',
  description: '매일 퇴근 시간에 한 줄 적기 리마인드',
  importance: 3,  // DEFAULT
  sound: 'default',
  vibration: true,
});
```

---

## 10. PWA + Capacitor 겸용 전략

### 플랫폼 분기 (`utils/platform.ts`)

```typescript
import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const isWeb = !isNative;
export const platform = Capacitor.getPlatform(); // 'web' | 'android' | 'ios'
```

### 플랫폼별 차이 처리

| 기능 | 웹 (PWA) | Android (Capacitor) |
|------|----------|---------------------|
| 알림 | Web Notifications API (제한적) | @capacitor/local-notifications |
| 데이터 저장 | IndexedDB | IndexedDB (동일) |
| 설정 저장 | localStorage 폴백 | Capacitor Preferences |
| JSON 내보내기 | `<a download>` 파일 다운로드 | Share API → 파일 공유 |
| 상태바 | 없음 | @capacitor/status-bar 색상 동기화 |
| 스플래시 | 없음 | @capacitor/splash-screen |
| 뒤로가기 | 브라우저 히스토리 | Android 하드웨어 백 버튼 핸들링 |

### PWA 설정

**manifest.json**:
```json
{
  "name": "퇴근하면 뭐하지?",
  "short_name": "퇴근",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fafaf8",
  "theme_color": "#fafaf8",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Service Worker** (`public/sw.js`):
- 프리캐시: index.html, JS/CSS 번들, 폰트
- 런타임 캐시: 불필요 (외부 네트워크 요청 없음)
- 캐시 전략: Cache First (오프라인 전용이므로)
- 업데이트: 새 버전 배포 시 SW 파일 해시 변경 → 자동 업데이트

### Capacitor 설정

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.afterwork.journal',
  appName: '퇴근하면 뭐하지?',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_notification',
      iconColor: '#5B6ABF',
    },
    SplashScreen: {
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      backgroundColor: '#fafaf8',
    },
  },
};

export default config;
```

### Android 하드웨어 백 버튼

```typescript
import { App as CapApp } from '@capacitor/app';

// 뒤로가기 처리
CapApp.addListener('backButton', ({ canGoBack }) => {
  if (canGoBack) {
    window.history.back();
  } else {
    CapApp.exitApp();  // 메인 화면에서 뒤로가기 → 앱 종료
  }
});
```

---

## 11. 프롬프트 / 큐레이션 데이터 풀

### 프롬프트 풀 (`src/data/prompts.ts`)

최소 30개. 각 프롬프트는 2~3개 변형을 가진다.

```typescript
export const prompts: Prompt[] = [
  {
    id: 1,
    text: '퇴근 후 한 가지.',
    variants: ['오늘 저녁, 딱 하나.', '퇴근길에 떠오른 것.'],
  },
  {
    id: 2,
    text: '지금 가장 끌리는 건.',
    variants: ['딱 하나 고른다면.', '지금 당장이라면.'],
  },
  {
    id: 3,
    text: '아무거나 하나.',
    variants: ['뭐든 하나.', '생각나는 대로.'],
  },
  // ... 30개+
];
```

**프롬프트 톤 원칙**:
- 짧다. 10자 이내 권장
- 건조하다. 응원, 감탄, 이모지 없음
- 질문하지 않는다. "오늘 뭐 하고 싶어?"가 아니라 "퇴근 후 한 가지."
- 마침표(.) 또는 쉼표(,)로 끝남. 물음표(?) 사용 안 함

### 큐레이션 풀 (`src/data/curations.ts`)

최소 60개 (카테고리별 7~8개).

```typescript
export const curations: CurationCard[] = [
  // eat (먹기)
  { id: 1, category: 'eat', activity: '동네 치킨', subtext: '배달 말고 포장' },
  { id: 2, category: 'eat', activity: '편의점 맥주', subtext: '캔 하나면 충분' },
  { id: 3, category: 'eat', activity: '라면 끓이기', subtext: '계란은 필수' },
  
  // move (움직이기)
  { id: 10, category: 'move', activity: '동네 산책 15분', subtext: '이어폰 끼고' },
  { id: 11, category: 'move', activity: '스트레칭', subtext: '유튜브 따라하기 10분' },
  
  // rest (쉬기)
  { id: 20, category: 'rest', activity: '반신욕 20분', subtext: '폰 안 보기' },
  { id: 21, category: 'rest', activity: '낮잠 30분', subtext: '알람 필수' },
  
  // ... 카테고리별 7~8개씩, 총 60개+
];
```

**큐레이션 톤 원칙**:
- 활동은 3~6단어. 구체적이되 거창하지 않음
- subtext는 한마디 코멘트. 재치 있되 과하지 않음
- 돈이 많이 드는 활동 배제. "소소한 즐거움" 범위 내
- 혼자 할 수 있는 활동 중심. 타인 의존 활동은 "만나기" 카테고리에 한정

---

## 12. 빌드 & 배포 파이프라인

### 로컬 개발

```bash
npm install
npm run dev          # vite dev → localhost:5191
```

### 웹 빌드 (PWA)

```bash
npm run build        # vite build → dist/
npm run preview      # dist/ 로컬 서빙으로 확인
```

### Android 빌드

```bash
npm run build                    # 웹 빌드
npx cap sync android             # dist/ → android/ 동기화
npx cap open android             # Android Studio 열기
# Android Studio에서 Build → Generate Signed Bundle/APK
```

### APK/AAB 서명

```
키스토어: after-work-release.keystore (별도 관리, git 미포함)
앱 ID: com.afterwork.journal
버전 관리: package.json version → capacitor.config.ts → build.gradle 동기화
```

### Vite 설정

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5191,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,  // 단일 번들 (오프라인 앱이므로 코드 스플리팅 불필요)
      },
    },
  },
});
```

**단일 번들 선택 이유**: 네트워크 요청 없는 오프라인 앱이므로 코드 스플리팅의 이점(초기 로딩 최적화)이 없다. 단일 번들이 Service Worker 캐싱과 Capacitor 동기화에 더 단순하다.

---

## 13. 성능 목표

| 메트릭 | 목표 | 측정 방법 |
|--------|------|-----------|
| 초기 로딩 (FCP) | < 1.5초 | Lighthouse (모바일 시뮬레이션) |
| 인터랙티브 (TTI) | < 2초 | Lighthouse |
| 입력 → IndexedDB 저장 | < 100ms | Performance.now() 계측 |
| 번들 사이즈 (gzip) | < 200KB | `vite build` 출력 확인 |
| 번들 사이즈 (비압축) | < 500KB | `du -sh dist/assets/` |
| IndexedDB 조회 (월별) | < 50ms | 31일 범위 조회 기준 |
| 메모리 사용 | < 30MB | Chrome DevTools Memory 탭 |
| Lighthouse 점수 | Performance 90+, Accessibility 95+ | Lighthouse CI |

### 성능 확보 방안

1. **폰트**: 시스템 폰트 우선 (`system-ui`). 웹폰트 사용 시 `font-display: swap` + 서브셋팅
2. **아이콘**: Lucide는 트리쉐이킹 지원. 사용하는 아이콘만 번들에 포함
3. **이미지**: 없음. 이 앱에 이미지는 불필요
4. **CSS**: CSS Modules로 사용하지 않는 스타일 자동 제거
5. **React**: StrictMode 개발 전용. 프로덕션에서는 제거
6. **IndexedDB**: 캘린더 화면 진입 시 해당 월 데이터만 조회. 전체 조회 하지 않음

---

## 14. 접근성

| 항목 | 구현 |
|------|------|
| 키보드 네비게이션 | 모든 인터랙티브 요소에 tabIndex, 캘린더 화살표 키 이동 |
| 스크린 리더 | aria-label (캘린더 날짜: "4월 2일, 기록 있음"), role (캘린더 grid) |
| 색상 대비 | WCAG AA 기준 (4.5:1) 이상. 라이트/다크 모두 검증 |
| 터치 타겟 | 최소 44x44px. 캘린더 셀, 아이콘 버튼 모두 해당 |
| 모션 감소 | `prefers-reduced-motion` 미디어 쿼리로 애니메이션 비활성화 |
| 폰트 스케일링 | rem 단위 사용. 시스템 폰트 크기 변경 시 비례 확대 |

---

## 15. 에러 처리

| 시나리오 | 처리 |
|----------|------|
| IndexedDB 열기 실패 | 인메모리 폴백 + Toast "저장이 불안정할 수 있습니다" |
| 저장 실패 | Toast "저장에 실패했습니다. 다시 시도해 주세요" + 입력 유지 |
| 알림 권한 거부 | 토글 OFF 복원 + Toast "설정에서 알림을 허용해 주세요" |
| 알림 스케줄 실패 | console.error + 무시 (치명적이지 않음) |
| JSON 내보내기 실패 | Toast "내보내기에 실패했습니다" |
| 전체 삭제 실패 | Toast "삭제에 실패했습니다" + 재시도 안내 |
| 데이터 없는 캘린더 날짜 | 빈 상태 UI + "이 날 적기" CTA |

---

## 16. 데이터 내보내기 / 가져오기

### 내보내기 포맷

```json
{
  "app": "after-work",
  "version": "1.0.0",
  "exportedAt": "2026-04-02T18:30:00.000Z",
  "entries": [
    {
      "date": "2026-04-01",
      "text": "치킨 먹고 넷플릭스",
      "promptText": "퇴근 후 한 가지.",
      "createdAt": "2026-04-01T18:15:00.000Z",
      "updatedAt": "2026-04-01T18:15:00.000Z"
    }
  ]
}
```

### 내보내기 구현

```typescript
async function exportEntries(): Promise<void> {
  const entries = await getAllEntries();
  const data = {
    app: 'after-work',
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    entries,
  };
  const json = JSON.stringify(data, null, 2);
  
  if (isNative) {
    // Capacitor: Share API로 파일 공유
    await Share.share({
      title: '퇴근하면 뭐하지? 기록',
      text: json,
      dialogTitle: '기록 내보내기',
    });
  } else {
    // 웹: 파일 다운로드
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `after-work-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
```

---

## 17. 테스트 전략

| 계층 | 도구 | 대상 |
|------|------|------|
| 유닛 | Vitest | `utils/date.ts`, `utils/random.ts`, 시드 해시, 범위 계산 |
| 훅 | Vitest + @testing-library/react-hooks | `useEntries`, `useToday` |
| 컴포넌트 | Vitest + @testing-library/react | 입력 → 저장 플로우, 캘린더 렌더링 |
| E2E | 수동 (gstack browse) | 전체 플로우, 알림, 소급 기록 |

### 핵심 테스트 케이스

1. **시드 일관성**: 같은 날짜 → 같은 프롬프트/큐레이션 반환
2. **하루 1개 제약**: 같은 날짜에 put 2번 → 마지막 값만 남음, createdAt 유지
3. **범위 조회**: 4월 1일~4월 30일 조회 → 해당 범위만 반환, 3월/5월 제외
4. **마중물 카테고리 중복 방지**: 카드 3~4장의 카테고리가 모두 다름
5. **200자 제한**: 201자 입력 시도 → 200자에서 잘림
6. **빈 입력 저장 불가**: 공백/빈 문자열 → 저장 버튼 비활성

---

## 18. 향후 확장 고려사항

현재 v1에는 포함하지 않지만, 데이터 모델과 구조가 막지 않아야 하는 기능들:

| 기능 | 대비 사항 |
|------|-----------|
| 가져오기 (JSON) | 내보내기 포맷에 `app`과 `version` 필드 포함 → 호환성 검증 가능 |
| 연간 요약 | Entry의 date 기반 keyPath → 연도별 범위 조회 자연스럽게 지원 |
| 큐레이션 풀 업데이트 | data/ 파일 교체 + 빌드만으로 갱신. 런타임 로직 변경 불필요 |
| 다국어 | 프롬프트/큐레이션이 data/ 파일에 격리되어 있으므로 언어 파일 교체 가능 |
| 위젯 (Android) | Entry 데이터가 IndexedDB에 정형화되어 있으므로 Capacitor 플러그인으로 접근 가능 |

---

*작성일: 2026-04-02*
