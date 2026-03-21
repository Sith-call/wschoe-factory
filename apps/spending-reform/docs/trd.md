# 소비 체질 개선 (Spending Reform) — Technical Reference Document

> 앱인토스 미니앱 기술 아키텍처 문서
> 작성일: 2026-03-21

---

## 1. 앱인토스 기술 스펙

### 기술 스택
- **Frontend**: Vite + React + TypeScript
- **UI**: HTML/CSS (USE_TDS=false) — 로컬 개발 + 커스텀 디자인
- **SDK**: `@apps-in-toss/web-framework`
- **빌드**: `granite` (npx 실행 필수)
- **배포**: Toss Console → .ait 번들 업로드

### granite.config.ts 설정

```typescript
export default {
  appName: 'spending-reform',
  brand: {
    displayName: { ko: '소비 체질 개선', en: 'Spending Reform' },
    primaryColor: '#059669',
    icon: '',  // 반드시 빈 문자열
  },
  permissions: [
    { name: 'clipboard', access: ['write'] },  // 결과 텍스트 복사
  ],
}
```

### SDK 모듈 사용 계획

| 모듈 | 용도 | 권한 | 구현 시점 |
|------|------|------|----------|
| Storage | 진단 결과, 챌린지 상태, 히스토리 저장 | 없음 | MVP |
| Share | 결과 카드 카카오톡/네이티브 공유 | 없음 | MVP |
| Haptic | 체크인 성공/실패 시 촉각 피드백 | 없음 | MVP |
| Analytics | 퍼널 분석 (진단완료, 챌린지시작, 체크인, 완료) | 없음 (SDK 0.0.26+) | MVP |
| Clipboard | 결과 텍스트 복사 | clipboard: write | MVP |

---

### 데이터 모델 (Storage 기반)

Storage는 문자열만 저장 가능하므로 모든 객체는 `JSON.stringify`/`JSON.parse`로 직렬화한다.

```typescript
// ===== Storage Keys =====
// 'spending-reform:diagnosis'  → DiagnosisResult (JSON string)
// 'spending-reform:challenges' → Challenge[] (JSON string)
// 'spending-reform:settings'   → UserSettings (JSON string)

// ===== Types =====

type SpendingType = 'cafe' | 'delivery' | 'impulse' | 'subscription' | 'taxi' | 'nightlife';
type Category = 'cafe' | 'delivery' | 'shopping' | 'subscription' | 'transport' | 'nightlife';

interface DiagnosisResult {
  type: SpendingType;            // 주 소비 유형
  scores: Record<Category, number>; // 6개 카테고리, 0-10점
  estimatedWaste: number;        // 월 낭비 추정액 (만원 단위)
  completedAt: string;           // ISO 8601 timestamp
}

interface Challenge {
  id: string;                    // uuid
  type: SpendingType;            // 대상 소비 유형
  title: string;                 // "일주일 카페 금지 챌린지"
  rule: string;                  // "매일 커피 대신 텀블러 사용"
  targetSaving: number;          // 목표 절약액 (만원)
  startDate: string;             // ISO 8601
  checkIns: CheckIn[];           // 일일 체크인 기록
  status: 'active' | 'completed' | 'abandoned';
  beforeScore: number;           // 챌린지 시작 전 해당 카테고리 점수
  afterScore?: number;           // 챌린지 완료 후 재진단 점수
}

interface CheckIn {
  date: string;                  // YYYY-MM-DD
  success: boolean;
}

interface UserSettings {
  lastDiagnosisDate?: string;
  totalChallengesCompleted: number;
  totalSaved: number;            // 누적 절약액 (만원)
}
```

### Storage SDK 래퍼 패턴

```typescript
import { Storage } from '@apps-in-toss/web-framework';

const KEYS = {
  diagnosis: 'spending-reform:diagnosis',
  challenges: 'spending-reform:challenges',
  settings: 'spending-reform:settings',
} as const;

// 저장
async function saveDiagnosis(result: DiagnosisResult): Promise<void> {
  await Storage.setItem(KEYS.diagnosis, JSON.stringify(result));
}

// 조회
async function loadDiagnosis(): Promise<DiagnosisResult | null> {
  const raw = await Storage.getItem(KEYS.diagnosis);
  return raw ? JSON.parse(raw) : null;
}

// 챌린지 목록
async function loadChallenges(): Promise<Challenge[]> {
  const raw = await Storage.getItem(KEYS.challenges);
  return raw ? JSON.parse(raw) : [];
}

async function saveChallenges(challenges: Challenge[]): Promise<void> {
  await Storage.setItem(KEYS.challenges, JSON.stringify(challenges));
}
```

---

### Share SDK 구현 패턴

```typescript
import { share } from '@apps-in-toss/web-framework';

async function shareResult(type: SpendingType, waste: number): Promise<void> {
  const message = `나의 소비 체질은 "${getTypeLabel(type)}"! 월 ${waste}만원 줄일 수 있대. 너도 진단해봐!`;
  try {
    await share({ message });
  } catch (error) {
    console.error('공유 실패:', error);
  }
}

async function shareChallengeResult(challenge: Challenge): Promise<void> {
  const days = challenge.checkIns.filter(c => c.success).length;
  const message = `${challenge.title} 완료! ${days}일 성공, ${challenge.targetSaving}만원 절약!`;
  await share({ message });
}
```

### Haptic SDK 구현 패턴

```typescript
import { generateHapticFeedback } from '@apps-in-toss/web-framework';

// 체크인 성공 → success 피드백
function onCheckInSuccess(): void {
  generateHapticFeedback({ type: 'success' });
}

// 챌린지 완료 → confetti 피드백
function onChallengeComplete(): void {
  generateHapticFeedback({ type: 'confetti' });
}

// 퀴즈 답변 선택 → tap 피드백
function onAnswerSelect(): void {
  generateHapticFeedback({ type: 'tap' });
}

// 체크인 실패 → error 피드백
function onCheckInFail(): void {
  generateHapticFeedback({ type: 'error' });
}
```

### Clipboard SDK 구현 패턴

```typescript
import { setClipboardText, SetClipboardTextPermissionError } from '@apps-in-toss/web-framework';

async function copyResultText(result: DiagnosisResult): Promise<boolean> {
  const text = `[소비 체질 개선] 나의 유형: ${getTypeLabel(result.type)} | 월 낭비 추정: ${result.estimatedWaste}만원`;
  try {
    await setClipboardText(text);
    return true;
  } catch (error) {
    if (error instanceof SetClipboardTextPermissionError) {
      console.log('클립보드 쓰기 권한 없음');
    }
    return false;
  }
}
```

---

### Analytics 이벤트 설계

전환 퍼널 중심 설계 — 이탈 지점 파악이 핵심.

```
퍼널 흐름:
screen:intro → screen:quiz → quiz:complete → screen:result → share:result
→ screen:challenge_intro → challenge:start → checkin:success/fail (daily)
→ challenge:complete → share:challenge_result → challenge:restart/rediagnose
```

| 이벤트 | 타입 | 파라미터 | 용도 |
|--------|------|----------|------|
| `screen:intro` | screen | — | 앱 진입률 |
| `screen:quiz` | screen | `question_index` | 퀴즈 시작률 |
| `quiz:complete` | click | `spending_type`, `estimated_waste` | 퀴즈 완료율 |
| `screen:result` | screen | `spending_type` | 결과 조회율 |
| `share:result` | click | `spending_type`, `method` | 공유 전환율 |
| `copy:result` | click | `spending_type` | 복사 전환율 |
| `screen:challenge_intro` | screen | `spending_type` | 챌린지 관심률 |
| `challenge:start` | click | `challenge_id`, `type` | 챌린지 시작률 |
| `checkin:success` | click | `challenge_id`, `day`, `streak` | 일일 체크인 성공 |
| `checkin:fail` | click | `challenge_id`, `day` | 일일 체크인 실패 |
| `challenge:complete` | click | `challenge_id`, `success_rate`, `saved` | 챌린지 완료율 |
| `share:challenge_result` | click | `challenge_id` | 챌린지 결과 공유율 |

```typescript
import { Analytics } from '@apps-in-toss/web-framework';

// 화면 진입
Analytics.screen({ log_name: 'screen:result', spending_type: 'cafe' });

// 클릭 이벤트
Analytics.click({ button_name: 'challenge:start', challenge_id: 'abc', type: 'cafe' });

// 선언적 노출 로깅
<Analytics.Impression params={{ item_id: 'result_card' }}>
  <ResultCard />
</Analytics.Impression>
```

---

## 2. 프로젝트 구조

```
spending-reform/
├── granite.config.ts           # 앱 설정 (appName, brand, permissions)
├── package.json                # npm scripts (dev/build/deploy)
├── vite.config.ts              # Vite 설정
├── tsconfig.json               # TypeScript 설정
├── index.html                  # 진입점 HTML
├── src/
│   ├── main.tsx                # React 엔트리포인트
│   ├── App.tsx                 # 메인 라우팅 + 상태 관리
│   ├── types.ts                # 공통 타입 정의
│   ├── store.ts                # Storage SDK 래퍼 (CRUD)
│   ├── analytics.ts            # Analytics 이벤트 헬퍼
│   ├── share.ts                # Share SDK 래퍼
│   ├── haptic.ts               # Haptic SDK 래퍼
│   ├── icons.tsx               # 커스텀 SVG 아이콘 모음
│   ├── data/
│   │   ├── questions.ts        # 12개 퀴즈 문항
│   │   ├── types.ts            # 6개 소비 유형 정의 (라벨, 설명, 팁)
│   │   └── challenges.ts       # 유형별 챌린지 템플릿
│   └── components/
│       ├── IntroScreen.tsx      # 시작 화면
│       ├── QuizScreen.tsx       # 12문항 진단 퀴즈
│       ├── LoadingScreen.tsx    # 분석 중 로딩
│       ├── ResultScreen.tsx     # 진단 결과 (레이더 차트 + 유형 설명)
│       ├── ChallengeIntroScreen.tsx  # 챌린지 소개/선택
│       ├── ChallengeScreen.tsx  # 챌린지 진행 (체크인 캘린더)
│       ├── CheckInScreen.tsx    # 오늘의 체크인
│       ├── ChallengeCompleteScreen.tsx  # 챌린지 완료 결과
│       ├── ShareCard.tsx        # 공유용 결과 카드 (canvas → image)
│       └── HistoryScreen.tsx    # 과거 진단/챌린지 히스토리
├── docs/
│   ├── pm-outputs/             # PM 산출물
│   └── trd.md                  # 이 문서
└── __tests__/                  # 테스트
```

### 화면 플로우

```
[IntroScreen] ──시작하기──→ [QuizScreen] ──12문항 완료──→ [LoadingScreen]
                                                              │
                                                              ▼
[HistoryScreen] ←──히스토리── [ResultScreen] ──챌린지 시작──→ [ChallengeIntroScreen]
       │                           │                              │
       │                      공유/복사                      챌린지 선택
       │                                                          │
       ▼                                                          ▼
  과거 기록 조회                                         [ChallengeScreen]
                                                              │
                                                         매일 체크인
                                                              │
                                                              ▼
                                                      [CheckInScreen]
                                                              │
                                                      성공/실패 기록
                                                              │
                                                              ▼
                                                  [ChallengeCompleteScreen]
                                                         │         │
                                                     재진단     새 챌린지
```

### 네비게이션 패턴
- **선형 플로우** (DESIGN_RULES R5 준수): 탭바 없음
- 진단 퀴즈 → 결과 → 챌린지: 단방향 진행 + 뒤로가기
- 상단 프로그레스 바로 퀴즈 진행률 표시
- 결과 화면에서 히스토리/재진단 분기

---

## 3. 디자인 시스템

### DESIGN_RULES.md 체크리스트 준수

```
[x] 기존 앱과 다른 색상 팔레트 (emerald 기반 — 금융/절약/성장)
[x] 기존 앱과 다른 폰트 조합 (Wanted Sans Variable + Inter)
[x] 그라디언트 텍스트 미사용
[x] 네비게이션: 선형 플로우 (퀴즈/챌린지 특성에 맞춤) — 탭바 없음
[x] fadeInUp 외 다양한 애니메이션 (scale, 즉시 표시, 시차 로딩)
[x] 불필요한 장식 요소 없음 (파티클, 오브 없음)
[x] backdrop-blur 최소화 (모달 오버레이에서만)
[x] 라이트 모드 기본
[x] 이모지 아이콘 사용 안 함 — 전부 커스텀 SVG
```

### 색상 팔레트

금융 + 절약 + 성장 컨셉. emerald 계열 primary + amber 경고색.

```
Token               Value       용도
─────────────────────────────────────────────
background          #f8faf9     페이지 배경 (극히 연한 그린-그레이)
surface             #ffffff     카드/컨테이너 배경
text-primary        #1a1a2e     본문 텍스트 (네이비 블랙)
text-secondary      #6b7280     보조 텍스트
primary             #059669     CTA, 성공, 절약 (emerald-600)
primary-light       #d1fae5     배지, 하이라이트 배경 (emerald-100)
primary-dark        #065f46     hover/active 상태 (emerald-800)
accent              #f59e0b     경고, 주의, 낭비 표시 (amber-500)
danger              #ef4444     실패, 위험 수준 (red-500)
border              #e5e7eb     구분선, 카드 테두리
```

### 폰트

기존 앱에서 사용하지 않은 조합을 선택한다.

- **한국어**: Wanted Sans Variable (토스 자체 폰트)
  - CDN: `https://cdn.jsdelivr.net/gh/AcmeGameStudios/WantedSansVariable/WantedSansVariable.min.css`
  - 대안: SUITE (`https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css`)
- **영문/숫자**: Inter (Google Fonts)
- **사용 금지** (기존 앱에서 사용됨): Plus Jakarta Sans, Manrope, Pretendard, IBM Plex Sans KR, Spoqa Han Sans, Space Grotesk, Outfit, Sora, DM Sans, Nanum Gothic

```css
font-family: 'Wanted Sans Variable', 'Inter', system-ui, sans-serif;
```

### 폰트 웨이트 위계 (R12 준수)

| 요소 | 웨이트 | 크기 |
|------|--------|------|
| H1 (화면 제목) | 700 (bold) | 24px |
| H2 (섹션 제목) | 600 (semibold) | 20px |
| H3 (카드 제목) | 500 (medium) | 17px |
| Body | 400 (regular) | 15px |
| Caption | 400 (regular) | 13px |
| 강조 숫자 (절약액 등) | 700 (bold) | 28-32px |

### Border Radius 위계 (R10 준수)

| 요소 | Radius |
|------|--------|
| 메인 카드/결과 카드 | 16px |
| 내부 요소 (배지, 진행바) | 6px |
| 버튼 | 12px (rounded, pill 아님) |
| 체크인 셀 | 8px |
| 인풋 | 8px |

### 애니메이션 (R4 준수)

fadeInUp 만능 대신 다양한 패턴 사용:

| 상황 | 애니메이션 |
|------|-----------|
| 퀴즈 문항 전환 | 좌→우 슬라이드 (translateX) |
| 결과 카드 등장 | scale(0.95→1) + opacity |
| 로딩 화면 | 커스텀 pulse (숫자 카운트업) |
| 체크인 성공 | 바운스 (spring easing) |
| 레이더 차트 | 점진적 path draw (SVG stroke-dashoffset) |
| 일반 콘텐츠 | 즉시 표시 (애니메이션 없음) |
| 리스트 아이템 | 시차 로딩 (staggered, 각 100ms 딜레이) |

### 아이콘 (R11, R13 준수)

모든 아이콘은 인라인 SVG로 제작. 이모지 사용 금지. Material Symbols 사용 금지.

| 아이콘 | 설명 | 사용처 |
|--------|------|--------|
| CafeIcon | 커피잔 | 카페 소비 유형 |
| DeliveryIcon | 배달 바이크 | 배달 소비 유형 |
| ShoppingIcon | 쇼핑백 | 충동구매 소비 유형 |
| SubscriptionIcon | 스마트폰/앱 | 구독 소비 유형 |
| TaxiIcon | 택시 | 교통비 소비 유형 |
| NightlifeIcon | 맥주잔 | 야식/술자리 소비 유형 |
| CheckIcon | 체크마크 | 체크인 성공 |
| XIcon | X 표시 | 체크인 실패 |
| ChartIcon | 레이더 차트 | 진단 결과 |
| ShareIcon | 공유 화살표 | 공유 버튼 |
| TrophyIcon | 트로피 | 챌린지 완료 |
| FlameIcon | 불꽃 | 연속 스트릭 |
| CoinIcon | 동전 | 절약 금액 표시 |
| CopyIcon | 문서 복사 | 클립보드 복사 |
| HistoryIcon | 시계/화살표 | 히스토리 조회 |

---

## 4. 빌드 & 배포

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:ait": "npx granite build",
    "deploy": "npx ait deploy",
    "preview": "vite preview"
  }
}
```

### 로컬 개발 (USE_TDS=false)

```bash
npm run dev          # Vite dev server (http://localhost:5173)
```

- TDS 컴포넌트 미사용 — 로컬 브라우저에서 전체 기능 확인 가능
- Storage 등 네이티브 SDK는 로컬에서 mock 처리 (localStorage fallback)

### 토스 빌드

```bash
npx granite build    # .ait 번들 생성
```

- `granite`은 반드시 `npx`로 실행 (bun 불가)
- 빌드 결과물: `.ait` 디렉토리

### 배포 프로세스

1. Toss Console (`https://console-apps-in-toss.toss.im`) 가입
2. 앱 등록 + 권한 설정 (clipboard: write)
3. `.ait` 번들 업로드
4. 심사 (2-3 영업일)
5. 출시

### 로컬 데모 모드

DB 없이 바로 체험 가능하도록 데모/mock 모드 포함:
- `Storage` SDK 미사용 환경에서는 `localStorage` fallback
- 퀴즈 데이터, 챌린지 템플릿은 정적 데이터 (서버 불필요)
- 첫 방문 시 바로 진단 시작 가능 (로그인 불필요)

---

## 5. MVP 이후 로드맵

### Phase 2 (출시 2주 후)
- **AdMob 보상형 광고 통합** — `in-app-ad` 모듈 (Console 등록 필요)
  - 챌린지 추가 힌트 보기 시 리워드 광고
- **토스 포인트 프로모션** — `promotion` 모듈 (toss-login 필수 + Console + Biz Wallet)
  - 챌린지 완료 시 토스 포인트 적립

### Phase 3 (출시 1달 후)
- **공유 리워드** — `share-reward` 모듈 (Console 등록 필요)
  - 공유 → 친구 앱 진입 시 양쪽 리워드
- **인앱 결제** — `in-app-purchase` 모듈 (Console 상품 등록 필요)
  - 프리미엄 챌린지 팩 (더 상세한 소비 분석 + 맞춤 절약 전략)

### Phase 2-3 의존성 정리

```
Phase 2:
  in-app-ad      → Console 등록 필요
  promotion      → toss-login 필수 (mTLS 인증서 + 백엔드 서버)

Phase 3:
  share-reward   → Console 등록 필요
  in-app-purchase → Console 상품 등록 필요
```

---

## 6. 기술 제약사항 & 주의사항

1. **granite은 npx로만 실행** — bun 사용 불가
2. **brand.icon은 빈 문자열 `''`** — null이나 undefined 불가
3. **Storage 값은 문자열만** — 객체는 반드시 JSON.stringify/parse
4. **Analytics는 런칭 후에만 데이터 수집** — 샌드박스/개발 환경에서 테스트 불가
5. **TDS 미사용** (USE_TDS=false) — `@toss/tds-mobile-ait` import 금지
6. **영문 앱 이름 규칙**: 이모지 불가, 특수문자 `:∙?`만 허용, Title Case
7. **클립보드 권한 에러 처리 필수** — `SetClipboardTextPermissionError` catch
8. **민감 정보 저장 금지** — Storage에 토큰, 비밀번호 등 저장하지 않음
9. **Haptic 과도 사용 금지** — 의미 있는 순간에만 (체크인 성공/실패, 챌린지 완료)
10. **intoss:// 딥링크는 정식 출시 후에만** — 개발 중에는 테스트 QR 코드 사용
