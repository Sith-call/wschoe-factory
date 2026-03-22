# 피부 일지 V2 — Product Requirements Document

> V1은 "기록과 기본 인사이트"를 검증했다.
> V2는 "깊이 있는 분석 + 습관 형성 + 공유"로 유저가 떠나지 않게 만든다.

---

## 1. V2 비전

### V1과의 차이

| 항목 | V1 | V2 |
|------|-----|-----|
| 분석 깊이 | 제품/변수 단일 평균 비교 | 부위별 추적, 콤보 분석, 3일 미니인사이트, 주간 리포트 |
| 습관 유지 | 스트릭 숫자 하나 | 변수 프리셋, 밤→아침 연결 메시지, 마일스톤 배지, 넛지 |
| 공유 | 없음 | 인사이트 카드 이미지 생성, 루틴 프로필 페이지 |
| 데이터 모델 | 고정 변수 10개, 부위 없음 | 커스텀 변수 완전 지원, 부위별 트러블 맵 |
| 기록 편의성 | 어젯밤과 동일만 | 변수 프리셋 고정, 빠른 기록 개선 |

### 핵심 원칙
- **YAGNI**: 서버 없음, localStorage 유지. 소셜은 "이미지 공유"까지만.
- **기존 디자인 유지**: dusty rose + Gowun Batang + SUIT Variable
- **데모 모드 유지**: 서버 없이 바로 체험 가능

---

## 2. 3 Pillar 기능 정의

### Pillar A: 깊이 있는 분석 (Deep Analytics)

#### A1. 부위별 트러블 추적 [P0]

밤 기록이 아닌 **아침 기록에서** 트러블 부위를 선택한다.

- 부위 선택지: `턱선` / `이마` / `볼` / `코` / `전체`
- 복수 선택 가능 (예: 턱선 + 볼)
- 선택은 optional — 기존처럼 키워드만 선택해도 저장 가능
- 인사이트에서 "턱선 트러블 빈도 추이" 같은 부위별 분석 제공

**데이터 모델 확장**:
```typescript
// MorningLog에 추가
troubleAreas?: TroubleArea[];

type TroubleArea = 'jawline' | 'forehead' | 'cheek' | 'nose' | 'whole';
```

**V1 이슈 해결**: #3 (부위별 트러블 추적 불가)

---

#### A2. 3일 미니인사이트 [P0]

7일을 기다리지 않고 3일부터 맛보기 분석을 제공한다.

- 3일 기록 시: 3일간 키워드 빈도, 점수 추이, 가장 많이 쓴 제품
- 5일 기록 시: 제품 1-2개에 대한 초기 영향 분석 (샘플 적음 경고 포함)
- 7일 이상: 기존 V1 인사이트 전체 활성화

**V1 이슈 해결**: #6 (3일 미니인사이트 없음)

---

#### A3. 키워드 빈도 시각화 (2주 트렌드) [P1]

인사이트 화면에 키워드 빈도를 시간축으로 보여준다.

- 최근 14일간 키워드별 등장 빈도 막대 차트
- 예: "건조 — 이번 2주: 3회 → 지난 2주: 7회 (57% 감소)"
- 상위 5개 키워드만 표시 (나머지는 "더보기")

---

#### A4. 제품 콤보 분석 [P1]

두 제품을 함께 사용한 날과 따로 사용한 날의 점수를 비교한다.

- 조건: 두 제품 모두 3회 이상 함께 사용한 기록이 있을 때만 표시
- 예: "세럼A + 크림B 함께 사용 시 평균 4.3점, 세럼A만 사용 시 3.7점"
- 인사이트 > 제품 분석 하단에 "콤보 분석" 섹션으로 배치
- 최대 상위 3개 콤보만 표시 (조합 폭발 방지)

**데이터 모델**: 기존 NightLog.products 배열에서 계산 가능. 새 타입 불필요.

---

#### A5. 주간/월간 리포트 자동 생성 [P1]

매주 일요일 밤, 한 주를 요약하는 리포트를 자동 생성한다.

- 내용: 평균 점수, 점수 추이 (상승/하락/유지), 가장 영향력 있었던 제품/변수, 키워드 변화
- 인앱 카드 형태로 표시 (홈 화면 상단 배너 또는 인사이트 탭 상단)
- 월간 리포트: 매월 1일에 지난 달 요약
- localStorage에 리포트 캐시 저장 (매번 재계산 방지)

**데이터 모델 확장**:
```typescript
interface WeeklyReport {
  weekStart: string; // 'YYYY-MM-DD'
  weekEnd: string;
  avgScore: number;
  scoreTrend: 'up' | 'down' | 'stable';
  topPositiveProduct?: string;
  topNegativeVariable?: string;
  keywordChanges: { keyword: SkinKeyword; change: number }[];
  recordDays: number;
  generatedAt: string;
}
```

---

#### A6. 주간 차트 → 일별 상세 연결 [P0]

홈 주간 차트에서 날짜 점을 탭하면 해당 날의 상세 기록으로 이동한다.

- 탭 시 바텀시트로 해당 날의 밤 기록 + 아침 기록 표시
- 캘린더 상세 보기와 동일한 바텀시트 컴포넌트 재사용

**V1 이슈 해결**: #5 (주간 차트 날짜 탭 → 일별 상세 연결 안 됨)

---

### Pillar B: 습관 형성 (Habit Formation)

#### B1. 변수 프리셋/고정 [P0]

매일 반복되는 변수를 프리셋으로 저장한다.

- 설정 > "기본 변수" 메뉴에서 항상 체크될 변수를 설정
- 예: "앞머리" — 항상 ON으로 시작 (밤 기록 진입 시 자동 체크)
- 밤 기록 화면에서 개별 해제 가능
- 프리셋 변수는 칩 위에 작은 핀 아이콘으로 구분

**데이터 모델 확장**:
```typescript
interface UserSettings {
  // 기존 필드...
  pinnedVariables: string[]; // 항상 ON으로 시작할 변수 목록
}
```

**V1 이슈 해결**: #2 (변수 프리셋 없음)

---

#### B2. 밤→아침 연결 메시지 [P0]

밤 기록 저장 후, 아침 기록을 유도하는 메시지를 표시한다.

- 밤 기록 저장 직후: "내일 아침에 피부 상태도 기록해봐요" 토스트/카드
- 다음날 홈 화면 진입 시: "어젯밤 기록은 완료! 아침 피부는 어때?" 상단 배너
- 3일 연속 밤만 기록하고 아침을 빠뜨린 경우: "아침 기록이 없으면 인사이트를 만들 수 없어요" 안내

**V1 이슈 해결**: #1 (밤 기록 저장 후 아침 기록 유도 메시지 없음, 4회 반복 피드백)

---

#### B3. 기록률 시각화 + 마일스톤 축하 [P1]

기록 습관을 시각적으로 보여주고, 마일스톤에서 축하한다.

- 홈 화면 스트릭 영역 확장: "이번 달 기록률 87% (26/30일)"
- 설정에서 월별 기록률 히스토리 확인 가능
- 마일스톤: 7일 / 14일 / 30일 / 60일 / 100일 연속 기록 시 축하 카드
- 축하 카드: "30일 연속 기록 달성! 이제 데이터가 충분해서 더 정확한 인사이트를 볼 수 있어요"
- 과도한 게이미피케이션 지양 — 배지 수집보다는 "인사이트 해금"에 의미 부여

---

#### B4. 미기록 넛지 [P2]

기록을 빠뜨렸을 때 가볍게 알린다.

- 인앱 배너: 홈 화면 상단에 "어제 기록을 빠뜨렸어요. 오늘은 기록해볼까요?"
- 브라우저 알림: 밤 알림 시간에 기록 안 했으면 1회만 (재알림 없음)
- 2일 연속 미기록 시: "스트릭이 끊어졌어요" 대신 "다시 시작해볼까요?" (비압박)
- 알림 끄기 옵션 항상 제공

---

#### B5. 커스텀 변수 완전 지원 [P0]

V1의 고정 10개 변수 외에 커스텀 변수를 자유롭게 추가한다.

- 밤 기록 화면 또는 설정에서 "변수 추가" → 이름 입력 → 즉시 생성
- 커스텀 변수도 프리셋/고정 가능
- 인사이트에서 프리셋 변수와 동일하게 분석
- 커스텀 변수 삭제 시 과거 기록은 유지

**데이터 모델 확장**:
```typescript
// Variable 타입을 string union에서 확장
interface CustomVariable {
  id: string;
  label: string;
  createdAt: string;
  archived?: boolean;
}

// NightLog.variables는 기존 Variable | string 으로 확장
```

**V1 이슈 해결**: #4 (커스텀 변수 추가 불가)

---

### Pillar C: 소셜/공유 (Social & Share)

#### C1. 인사이트 카드 이미지 공유 [P1]

인사이트를 이미지로 생성해서 공유할 수 있다.

- 인사이트 카드(제품 분석, 변수 분석, 주간 리포트)에 "공유" 버튼
- 탭하면 카드를 이미지로 렌더링 (html2canvas 또는 유사 라이브러리)
- 이미지에 "피부 일지" 워터마크 + 날짜 포함
- Web Share API로 공유 (지원 안 되면 이미지 다운로드)
- 인스타 스토리 비율(9:16) 옵션 제공

**디자인**: dusty rose 배경 + Gowun Batang 타이틀의 카드 이미지

---

#### C2. "내 루틴" 프로필 페이지 [P2]

내 스킨케어 루틴을 한 페이지로 정리해서 보여준다.

- 프로필: 피부 타입 + 현재 사용 제품 목록 + 기록 일수
- "최고 조합": 가장 점수 높았던 제품 조합
- "주의 변수": 피부에 가장 안 좋았던 생활 변수 Top 3
- URL 공유 불가 (서버 없음) — 이미지로 공유만 가능
- 홈 화면 프로필 아이콘에서 접근

---

#### C3. 인기 루틴 탐색 [P2 — MVP 이후 재검토]

비슷한 피부 타입의 인기 루틴을 보여준다.

- **MVP 범위**: 정적 JSON 데이터로 3-5개 샘플 루틴 제공
- 피부 타입별 필터 (건성/복합성/지성/민감성)
- "이 루틴 따라하기" → 제품 목록 일괄 추가
- **서버 없이 가능한 수준으로만** — 실제 유저 데이터 수집/분석은 하지 않음

---

## 3. 우선순위 정리

### P0 — V2 코어 (반드시 구현)

| ID | 기능 | Pillar | V1 이슈 해결 |
|-----|------|--------|-------------|
| A1 | 부위별 트러블 추적 | A | #3 |
| A2 | 3일 미니인사이트 | A | #6 |
| A6 | 주간 차트 → 일별 상세 연결 | A | #5 |
| B1 | 변수 프리셋/고정 | B | #2 |
| B2 | 밤→아침 연결 메시지 | B | #1 |
| B5 | 커스텀 변수 완전 지원 | B | #4 |

### P1 — V2 확장 (가능하면 구현)

| ID | 기능 | Pillar |
|-----|------|--------|
| A3 | 키워드 빈도 2주 트렌드 | A |
| A4 | 제품 콤보 분석 | A |
| A5 | 주간/월간 리포트 | A |
| B3 | 기록률 시각화 + 마일스톤 | B |
| C1 | 인사이트 카드 이미지 공유 | C |

### P2 — V2 부가 (여유 있으면)

| ID | 기능 | Pillar |
|-----|------|--------|
| B4 | 미기록 넛지 | B |
| C2 | 내 루틴 프로필 페이지 | C |
| C3 | 인기 루틴 탐색 | C |

---

## 4. 데이터 모델 확장 방향

### 변경되는 타입

```typescript
// === 신규 타입 ===

type TroubleArea = 'jawline' | 'forehead' | 'cheek' | 'nose' | 'whole';

interface CustomVariable {
  id: string;
  label: string;
  createdAt: string;
  archived?: boolean;
}

interface WeeklyReport {
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

interface Milestone {
  type: '7day' | '14day' | '30day' | '60day' | '100day';
  achievedAt: string;
  seen: boolean;
}

interface ShareCard {
  type: 'product' | 'variable' | 'weekly' | 'routine';
  data: Record<string, unknown>;
  generatedAt: string;
}

// === 확장되는 타입 ===

interface MorningLog {
  score: 1 | 2 | 3 | 4 | 5;
  keywords: SkinKeyword[];
  troubleAreas?: TroubleArea[];  // NEW
  memo?: string;
  loggedAt: string;
}

interface NightLog {
  products: string[];
  variables: (Variable | string)[];  // CHANGED: 커스텀 변수 지원
  memo?: string;
  loggedAt: string;
}

interface UserSettings {
  nightAlarmTime: string;
  morningAlarmTime: string;
  nightAlarmEnabled: boolean;
  morningAlarmEnabled: boolean;
  pinnedVariables: string[];       // NEW: 프리셋 변수
  customVariables: CustomVariable[]; // NEW
  milestones: Milestone[];          // NEW
}
```

### localStorage 키 구조 (추가분)

| 키 | 내용 |
|----|------|
| `skin-diary-custom-variables` | CustomVariable[] |
| `skin-diary-pinned-variables` | string[] |
| `skin-diary-weekly-reports` | WeeklyReport[] |
| `skin-diary-milestones` | Milestone[] |

### 마이그레이션

V1 → V2 마이그레이션은 앱 초기 로딩 시 자동 수행:
- 기존 `Variable` 타입 데이터는 그대로 유지
- `MorningLog`에 `troubleAreas` 필드가 없으면 `undefined`로 처리
- `NightLog.variables`에 string이 포함되면 커스텀 변수로 간주
- 신규 localStorage 키가 없으면 빈 배열로 초기화

---

## 5. 성공 지표 (KPI)

### 핵심 지표

| 지표 | V1 목표 | V2 목표 | 측정 방법 |
|------|---------|---------|----------|
| 일간 기록률 (밤+아침) | 60% | 75% | 양쪽 모두 기록한 날 / 활성일 |
| 아침 기록 전환율 | 측정 안 함 | 80% | 밤 기록 후 다음날 아침 기록한 비율 |
| 7일 리텐션 | 50% | 65% | 첫 기록 후 7일 내 재기록 비율 |
| 30일 리텐션 | 측정 안 함 | 40% | 첫 기록 후 30일 내 재기록 비율 |
| 인사이트 조회율 | 주 3회 | 주 5회 | 인사이트 탭 방문 수 / 주 |
| 공유 카드 생성 수 | N/A | 월 2회 | 공유 이미지 생성 횟수 / 월 |

### 기능별 지표

| 기능 | 지표 | 목표 |
|------|------|------|
| 부위별 트러블 | 부위 선택 비율 | 아침 기록의 40%+ |
| 변수 프리셋 | 프리셋 설정 유저 비율 | 7일+ 유저의 60% |
| 밤→아침 연결 | 연결 메시지 후 아침 기록 전환 | 70% |
| 3일 미니인사이트 | 3일차 인사이트 조회율 | 80% |
| 커스텀 변수 | 커스텀 변수 1개+ 추가 유저 | 14일+ 유저의 30% |
| 주간 리포트 | 리포트 조회율 | 생성된 리포트의 60% |

### 측정 방법

모든 지표는 localStorage 기반 이벤트 로그로 측정:
```typescript
interface AnalyticsEvent {
  type: string;
  timestamp: string;
  data?: Record<string, unknown>;
}
```
설정 > "사용 통계"에서 유저가 직접 확인 가능.

---

## 6. 기존 화면 변경 사항

### HomeScreen
- 주간 차트 날짜 탭 → 바텀시트 (A6)
- 스트릭 영역에 기록률 추가 (B3)
- 밤 기록 후 아침 유도 배너 (B2)
- 주간 리포트 배너 (A5)

### MorningLogScreen
- 부위별 트러블 선택 추가 (A1)
- 부위 선택은 키워드 아래에 배치, optional

### NightLogScreen
- 변수 프리셋 자동 체크 (B1)
- 커스텀 변수 인라인 추가 (B5)
- 저장 후 아침 유도 메시지 (B2)

### InsightScreen
- 3일 미니인사이트 섹션 (A2)
- 키워드 2주 트렌드 차트 (A3)
- 제품 콤보 분석 섹션 (A4)
- 인사이트 카드 "공유" 버튼 (C1)

### CalendarScreen
- 변경 없음 (기존 기능 유지)

### SettingsScreen
- "기본 변수" 설정 메뉴 추가 (B1)
- "커스텀 변수 관리" 메뉴 추가 (B5)
- 마일스톤/기록 통계 확인 (B3)

---

## 7. 신규 화면

| # | 화면 | 진입 경로 | 핵심 기능 | 우선순위 |
|---|------|----------|----------|---------|
| 1 | WeeklyReportCard | 홈 배너 / 인사이트 탭 | 주간 요약 리포트 | P1 |
| 2 | ShareCardPreview | 인사이트 카드 > 공유 | 이미지 미리보기 + 공유 | P1 |
| 3 | RoutineProfileScreen | 홈 상단 프로필 아이콘 | 내 루틴 요약 페이지 | P2 |
| 4 | MilestoneModal | 마일스톤 달성 시 자동 | 축하 카드 | P1 |

---

## 8. Out of Scope (V2 이후)

- 피부 사진 촬영/AI 분석
- 제품 데이터베이스 연동
- 실시간 소셜 네트워크 (팔로우, 피드, 댓글)
- 서버 기반 데이터 동기화
- 날씨/습도 자동 연동
- 생리 주기 트래커 연동
- 다크 모드
- 다국어 지원

---

## 9. 리스크 및 대응

| 리스크 | 심각도 | 대응 |
|--------|--------|------|
| 부위 선택이 기록 시간을 늘림 | 중간 | optional로 유지, 15초 목표 사수 |
| 콤보 분석 데이터 부족 | 중간 | 최소 3회 함께 사용 시에만 표시, 부족 안내 |
| 프리셋 변수가 잘못된 데이터 유발 | 낮음 | 프리셋 해제 쉽게, "오늘은 아니에요" UX |
| 공유 이미지 렌더링 성능 | 낮음 | html2canvas lazy load, 생성 중 로딩 표시 |
| localStorage 용량 한계 | 중간 | 1년 기록 기준 ~2MB 예상, 충분. 리포트 캐시 90일 제한 |
| V1→V2 마이그레이션 실패 | 높음 | 마이그레이션 전 자동 백업, 실패 시 V1 데이터 유지 |
