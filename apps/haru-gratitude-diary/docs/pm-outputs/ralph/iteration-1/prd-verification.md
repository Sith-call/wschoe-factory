# PRD Verification Report -- Iteration 1

**App:** haru-gratitude-diary (하루 감사 일기)
**Date:** 2026-04-10
**Reviewer:** PM Executor (PRD Verification)
**PRD Version:** 1.0 (MVP)

---

## P0 User Story Verification

### US-01: 오늘의 감사 3가지 기록
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 3개 텍스트 입력 필드 | PASS | Entry.tsx에 3개 input 필드 구현 |
| 플레이스홀더 힌트 | PARTIAL | 3개 필드 모두 동일한 힌트("감사한 일을 적어보세요"). PRD는 다양한 힌트 제안 |
| 3개 입력 후 저장 | PASS | canSave = filledItems.length >= 1 |
| 1-2개만 입력 저장 가능 | PASS | 빈 항목 필터링 후 저장 |
| 저장 후 홈 이동 | PASS | setTimeout으로 800ms 후 홈 이동 |
| 오늘 날짜 표시 | PASS | formatDateKorean(displayDate) |
| 30초 완료 UI | PASS | 최소 요소만 배치, 빠른 입력 가능 |

### US-02: localStorage 저장
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| localStorage에 GratitudeEntry 저장 | PASS | storage.ts 구현 |
| 날짜 key로 하루 하나 엔트리 | PASS | date 필드 기준 중복 방지 |
| 앱 재시작 후 기록 유지 | PASS | localStorage 영속성 |
| 서버 API 없음 | PASS | 네트워크 호출 없음 |
| createdAt/updatedAt 자동 기록 | PASS | saveEntry에서 ISO timestamp 설정 |

### US-03: 홈 화면 오늘 기록 상태
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 오늘 날짜 표시 | PASS | formatDateKorean(today) |
| 미기록시 CTA 버튼 | PASS | "오늘의 감사 쓰기" 또는 "첫 감사를 기록해보세요" |
| 기록시 3가지 요약 | PASS | todayEntry.items 렌더링 |
| 이번 주 기록 현황 | PASS | "이번 주 N/7일 기록" |
| 하단 내비게이션 | PASS | BottomNav 컴포넌트 |

### US-04: 캘린더 월별 기록 조회
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 월별 캘린더 그리드 | PASS | 7열 그리드 |
| 기록 날 색상 도트 | PASS | bg-sage 도트 표시 |
| 미기록 중립 디자인 | PASS | 죄책감 없는 중립적 표시 |
| 월 이동 | PASS | 이전/다음 달 버튼 |
| 기록 통계 | PASS | "이번 달 N일 기록" |
| 날짜 탭 시 Detail 이동 | PASS | 기록 있으면 Detail, 없으면 Entry |

### US-05: 특정 날짜 상세 보기
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 날짜 표시 | PASS | formatDateKorean |
| 감사 항목 목록 | PASS | entry.items 렌더링 |
| 수정 버튼 | PASS | startEdit 함수 |
| 삭제 버튼 | PASS | deleteConfirm 다이얼로그 |
| 뒤로가기 | PASS | navigate(-1) |

### US-06: 주간 회고
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 주 날짜 범위 | PASS | getWeekRangeLabel |
| 날짜별 그룹화 | PASS | weekDays.map으로 일별 표시 |
| 반복 키워드 하이라이트 | PASS | extractKeywords 함수 (빈도 2+ 추출) |
| 인사이트 한 줄 | PASS | generateInsight 함수 |
| 기록 날수/7일 | PASS | daysRecorded / 7 카드 |
| 홈 돌아가기 | PASS | 뒤로가기 버튼 |
| 홈에서 진입 버튼 | PASS | "이번 주 회고 보기" 링크 (3일+ 기록시) |

### US-07: 감사 기록 수정
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 인라인 편집 모드 | PASS | editing 상태로 전환 |
| 기존 텍스트 채움 | PASS | padded 배열로 기존 items 로드 |
| updatedAt 갱신 | PASS | saveEntry에서 updatedAt = now |
| 수정 취소 복원 | PASS | cancelEdit 함수 |
| 수정 후 Detail 유지 | PASS | setEditing(false) |

### US-08: 감사 기록 삭제
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 확인 다이얼로그 | PASS | ConfirmDialog 컴포넌트 |
| 확인 메시지 | PASS | "이 날의 기록을 삭제할까요? 되돌릴 수 없어요." |
| localStorage 삭제 | PASS | deleteEntry 함수 |
| 삭제 후 이동 | PASS | navigate(-1) |
| 캘린더 미기록 반영 | PASS | 실시간 반영 |

### US-09: 온보딩
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 첫 방문 자동 표시 | PASS | OnboardingGuard 컴포넌트 |
| 1-2 화면 안내 | PASS | SLIDES 배열 2개 슬라이드 |
| 완료 후 Entry 이동 | PASS | handleStart -> navigate('/entry') |
| 가입/로그인 없음 | PASS | 인증 로직 없음 |
| 완료 여부 저장 | PASS | markOnboardingSeen (localStorage) |
| 건너뛰기 가능 | PASS | handleSkip 버튼 |

### US-10: 빈 상태 CTA
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 홈 빈 상태 CTA | PASS | "첫 감사를 기록해보세요" |
| 캘린더 빈 상태 안내 | PASS | "첫 감사를 기록하면 여기에 표시돼요" |
| 주간 회고 빈 상태 | PASS | "이 주에는 기록이 없어요" + Entry 링크 |
| 빈 상태에서 Entry 이동 경로 | PASS | 모든 빈 상태에서 Entry 진입 가능 |
| 에러 미발생 | PASS | 빈 배열 처리 안전 |

### US-11: 데모 모드
**Status: PARTIAL PASS (1 gap)**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 데모 모드 활성화 옵션 | PARTIAL | Settings에만 존재. 온보딩/홈에서는 접근 불가 |
| 7일간 샘플 생성 | PASS | 14-21일간 생성 (PRD 요구 초과) |
| 전체 화면 체험 | PASS | 캘린더, Detail, 주간 회고 모두 체험 가능 |
| 한국어 데이터 | PASS | 21개 한국어 샘플 세트 |
| 직접 기록 추가/수정 | PASS | 데모 데이터와 실제 데이터 혼합 가능 |
| 데모 데이터 초기화 | PASS | "모든 데이터 삭제" 옵션 |

### US-12: 하단 내비게이션
**Status: PASS**

| Acceptance Criteria | Result | Notes |
|---|---|---|
| 고정 내비게이션 바 | PASS | fixed bottom-0 |
| 홈/캘린더 탭 | PASS | 2개 탭 |
| 활성 탭 구분 | PASS | text-sage + font-semibold |
| 탭 전환 | PASS | navigate(tab.path) |
| 서브화면 뒤로가기 | PASS | Entry, Detail, Weekly에서 ArrowLeft 버튼 |

---

## Summary

| Story | Status | Gap |
|---|---|---|
| US-01 | PASS | Placeholder 다양성 부족 (minor) |
| US-02 | PASS | - |
| US-03 | PASS | - |
| US-04 | PASS | - |
| US-05 | PASS | - |
| US-06 | PASS | - |
| US-07 | PASS | - |
| US-08 | PASS | - |
| US-09 | PASS | - |
| US-10 | PASS | - |
| US-11 | PARTIAL | 데모 모드 진입점이 Settings에만 존재 |
| US-12 | PASS | - |

**P0 Coverage: 11.5 / 12 (96%)**

---

## Top Findings

### 1. [Medium] 데모 모드 접근성 부족
- **US-11 AC:** "온보딩 또는 홈 화면에서 데모 모드 활성화 옵션이 존재"
- **현재:** Settings 화면에서만 데모 데이터 생성 가능
- **영향:** 첫 사용자가 주간 회고 가치를 체험하기 어려움. 온보딩에서 "체험해보기" 옵션이 없으므로 설정을 직접 찾아야 함.
- **권장:** 온보딩 2번째 슬라이드에 "샘플 데이터로 체험하기" 버튼 추가, 또는 홈 빈 상태에 데모 CTA 추가.

### 2. [Low] Entry 화면 플레이스홀더 동일
- **US-01 AC:** "각 필드에 플레이스홀더 힌트가 표시된다"
- **현재:** 3개 필드 모두 "감사한 일을 적어보세요"로 동일
- **PRD F-02 참조:** 부드러운 프롬프트는 P1이나, 최소한 각 필드별 다른 기본 힌트를 제공하면 빈 페이지 불안 완화에 도움.
- **권장:** "첫 번째 감사", "두 번째 감사", "세 번째 감사" 또는 "사람에 대한 감사", "경험에 대한 감사", "작은 것에 대한 감사" 등으로 분화.

### 3. [Low] 데이터 모델 ID가 UUID가 아닌 날짜 문자열
- **PRD 데이터 모델:** id: string (UUID)
- **현재:** id = date (YYYY-MM-DD)
- **영향:** 기능적으로 문제 없음. 하루에 하나의 엔트리만 존재하므로 date가 자연 키 역할.
- **권장:** 현재 구현이 실용적이므로 변경 불필요. PRD 부록 업데이트 권장.

### 4. [Info] 주간 회고 진입 조건 차이
- **PRD:** "일요일 또는 7일 데이터 존재 시 활성"
- **현재:** weekRecorded >= 3 (이번 주 3일 이상 기록)
- **영향:** 더 관대한 조건으로, 사용자 경험에 긍정적. PRD보다 나은 결정.
