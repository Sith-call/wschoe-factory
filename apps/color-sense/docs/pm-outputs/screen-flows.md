# 화면 플로우: 컬러 감각 테스트 (Color Sense Test)

> **Version**: 1.0
> **Last Updated**: 2026-03-21
> **참조**: prd.md, user-stories.md

---

## 네비게이션 구조

```
IntroScreen ──→ GameScreen (20라운드 루프)
                    │
                    ├── 정답 → 다음 라운드 (자동)
                    ├── 오답 → shake + 재시도 (같은 라운드)
                    └── 시간초과 → GameOverScreen (1.5초) ──→ ResultScreen
                    │
                    └── 20라운드 완료 ──→ ResultScreen
                                              │
                                              ├── "공유하기" → ShareCard (모달)
                                              ├── "다시 도전" → GameScreen (라운드1)
                                              └── "기록 보기" → HistoryScreen
                                                                    │
                                                                    ├── "다시 도전" → GameScreen
                                                                    └── "뒤로" → IntroScreen

IntroScreen
    └── "내 기록 보기" → HistoryScreen
```

### 네비게이션 원칙
- **선형 플로우**: 탭바 없음 (R5 준수)
- **뒤로가기**: HistoryScreen에서만 상단 좌측 뒤로가기 아이콘 표시
- **GameScreen**: 뒤로가기 없음 (게임 중 이탈 방지)
- **전환 애니메이션**: opacity fade, 200ms ease-out (모든 화면 동일)
- **앱 재진입 분기**:
  - 데이터 있음 → IntroScreen (최고 기록 포함)
  - 데이터 없음 → IntroScreen (기본)

---

## 화면 1: IntroScreen

### 목적
앱의 가치를 3초 안에 전달하고 즉시 게임 시작 유도

### 레이아웃

```
┌─────────────────────────────────┐
│                                 │
│  (상단 여백 48px)                │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    [일러스트레이션 영역]     │  │
│  │    (눈 + 그리드 SVG)       │  │
│  │    200 x 200              │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  (간격 24px)                     │
│                                 │
│  당신의 눈은                     │  ← H1, Pretendard 700, 28px, #1a1a2e
│  몇 등급인가요?                  │     좌측 정렬, line-height 1.3
│                                 │
│  (간격 8px)                      │
│                                 │
│  다른 색 타일을 찾아보세요.       │  ← Body, Pretendard 400, 16px, #6b7280
│  20라운드 도전!                  │     좌측 정렬
│                                 │
│  (간격 32px)                     │
│                                 │
│  ─── 최고 기록 영역 ───          │  ← 기록 있을 때만 표시
│  내 최고 기록                    │     Pretendard 400, 13px, #9ca3af
│  2,840점  A등급  상위 15%        │     Space Grotesk 600, 18px, #1a1a2e
│  ────────────────                │
│                                 │
│  (flex-grow 영역)                │
│                                 │
│  ┌───────────────────────────┐  │
│  │       시작하기              │  │  ← Primary CTA
│  └───────────────────────────┘  │     bg: #e63946, text: white
│                                 │     rounded-lg (8px), py-3.5
│  (간격 12px)                     │     Pretendard 600, 16px
│                                 │
│  내 기록 보기                    │  ← Tertiary (텍스트 링크)
│                                 │     Pretendard 400, 14px, #6b7280
│  (하단 여백 safe-area + 24px)    │     기록 없으면 미표시
│                                 │
└─────────────────────────────────┘
```

### 컴포넌트

| 컴포넌트 | 스펙 |
|----------|------|
| 일러스트 | 인라인 SVG, 눈동자 + 작은 그리드(4칸) 모티프, 레드(#e63946) + 그레이(#d1d5db) |
| 제목 | "당신의 눈은 몇 등급인가요?", Pretendard 700, 28px, #1a1a2e, 좌측 정렬 |
| 부제 | "다른 색 타일을 찾아보세요. 20라운드 도전!", Pretendard 400, 16px, #6b7280 |
| 최고 기록 | border-top 1px #e5e7eb 위에 기록 표시, 기록 없으면 영역 자체 미렌더링 |
| CTA | "시작하기", bg #e63946, text white, rounded-lg, width 100%, py-3.5 |
| 기록 링크 | "내 기록 보기", 텍스트만, #6b7280, 중앙 정렬 (이 버튼만 예외) |

### 상태

| 상태 | 표시 |
|------|------|
| 첫 방문 (기록 없음) | 최고 기록 영역 미표시, "내 기록 보기" 미표시 |
| 재방문 (기록 있음) | 최고 기록 영역 표시, "내 기록 보기" 표시 |
| 공유 링크로 진입 | "친구의 기록: X점 (상위 X%)" 추가 표시 |

### 전환
- "시작하기" 탭 → GameScreen (fade, 200ms)
- "내 기록 보기" 탭 → HistoryScreen (fade, 200ms)

---

## 화면 2: GameScreen

### 목적
핵심 게임플레이 — 색이 다른 타일 찾기

### 레이아웃

```
┌─────────────────────────────────┐
│                                 │
│  (상단 여백 safe-area + 16px)    │
│                                 │
│  Round 5/20                     │  ← Space Grotesk 600, 16px, #1a1a2e
│  ┌───────────────────────────┐  │
│  │████████████░░░░░░░░░░░░░░│  │  ← 프로그레스 바
│  └───────────────────────────┘  │     h: 4px, bg: #e5e7eb, fill: #1a1a2e
│                                 │
│  (간격 8px)                      │
│                                 │
│  다른 색 타일을 찾으세요          │  ← Pretendard 400, 14px, #9ca3af
│                                 │     첫 라운드에서만 표시 (이후 미표시)
│  (간격 16px)                     │
│                                 │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │  ┌────┬────┬────┬────┐  │    │  ← NxN 그리드
│  │  │    │    │    │    │  │    │     정사각형, 화면 너비 - 32px 패딩
│  │  ├────┼────┼────┼────┤  │    │     타일 간격: 3px
│  │  │    │ ** │    │    │  │    │     ** = 다른 색 타일
│  │  ├────┼────┼────┼────┤  │    │     bg: 베이스 색상
│  │  │    │    │    │    │  │    │     border-radius: 4px
│  │  ├────┼────┼────┼────┤  │    │
│  │  │    │    │    │    │  │    │
│  │  └────┴────┴────┴────┘  │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  (간격 24px)                     │
│                                 │
│  ┌───────────────────────────┐  │
│  │██████████████████████░░░░│  │  ← 타이머 바
│  └───────────────────────────┘  │     h: 6px, border-radius: 3px
│                                 │     10-4초: #d1d5db
│                                 │     3-1초: #ffd166
│                                 │     1초 이하: #e63946
│  (하단 여백 24px)                │
│                                 │
└─────────────────────────────────┘
```

### 컴포넌트

| 컴포넌트 | 스펙 |
|----------|------|
| 라운드 표시 | "Round X/20", Space Grotesk 600, 16px, #1a1a2e, 좌측 정렬 |
| 프로그레스 바 | width 100%, h 4px, bg #e5e7eb, fill #1a1a2e, rounded-full, transition width 200ms |
| 안내 텍스트 | "다른 색 타일을 찾으세요", 라운드 1에서만 표시, fade out at round 2 |
| 그리드 컨테이너 | 정사각형, 화면 너비 - 32px (좌우 패딩 16px씩), bg #f0f0f0, rounded-lg (12px), padding 8px |
| 타일 | 정사각형, gap 3px, border-radius 4px, 터치 영역 = 시각 영역 |
| 타이머 바 | width 100%, h 6px, bg #e5e7eb, fill 색상 변화, rounded-full, 실시간 width 감소 |

### 그리드 크기별 타일 사이즈 (화면 너비 375px 기준)

| 그리드 | 컨테이너 | 타일 크기 | 라운드 |
|--------|----------|-----------|--------|
| 2x2 | 343px | ~168px | 1-4 |
| 3x3 | 343px | ~110px | 5-8 |
| 4x4 | 343px | ~82px | 9-12 |
| 5x5 | 343px | ~65px | 13-16 |
| 6x6 | 343px | ~53px | 17-20 |

### 인터랙션 피드백

| 액션 | 피드백 |
|------|--------|
| 정답 탭 | 해당 타일 scale(1.1), 150ms ease-out → 100ms 후 다음 라운드 |
| 오답 탭 | 전체 그리드 translateX(-4px, 4px, -2px, 0), 200ms |
| 시간 초과 | 정답 타일에 2px solid #e63946 테두리 + blink 2회 → 1.5초 후 GameOverScreen |

### 전환
- 정답 탭 → 다음 라운드 (그리드만 교체, 화면 전환 없음, 100ms)
- 20라운드 정답 → ResultScreen (fade, 200ms)
- 시간 초과 → GameOverScreen (fade, 200ms, 정답 표시 1.5초 후)

---

## 화면 3: GameOverScreen

### 목적
시간 초과 피드백 + 결과 화면 연결

### 레이아웃

```
┌─────────────────────────────────┐
│                                 │
│  (flex center, 전체 화면)        │
│                                 │
│                                 │
│                                 │
│  시간 초과!                      │  ← Pretendard 700, 24px, #1a1a2e
│                                 │     중앙 정렬
│  (간격 8px)                      │
│                                 │
│  Round 13에서 탈락               │  ← Pretendard 400, 16px, #6b7280
│                                 │     중앙 정렬
│  (간격 32px)                     │
│                                 │
│  ┌───────────────────────────┐  │
│  │       결과 보기            │  │  ← Primary CTA
│  └───────────────────────────┘  │     bg: #e63946, text: white
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### 컴포넌트

| 컴포넌트 | 스펙 |
|----------|------|
| 제목 | "시간 초과!", Pretendard 700, 24px, #1a1a2e, 중앙 정렬 |
| 부제 | "Round X에서 탈락", Pretendard 400, 16px, #6b7280, 중앙 정렬 |
| CTA | "결과 보기", bg #e63946, text white, rounded-lg, width 100%, py-3.5 |

### 동작
- 2초 후 자동으로 ResultScreen 전환 (또는 "결과 보기" 탭)
- 자동 전환 전 CTA 탭 → 즉시 전환

### 전환
- "결과 보기" 탭 또는 2초 자동 → ResultScreen (fade, 200ms)

---

## 화면 4: ResultScreen

### 목적
성취감 제공 + 공유 동기 부여 + 재도전 유도

### 레이아웃

```
┌─────────────────────────────────┐
│                                 │
│  (상단 여백 safe-area + 24px)    │
│                                 │
│  당신의 색 감각                   │  ← Pretendard 400, 14px, #9ca3af
│                                 │     좌측 정렬
│  (간격 4px)                      │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │  3,240                    │  │  ← Space Grotesk 700, 48px, #1a1a2e
│  │  점                       │  │     카운트업 0→최종값, 1.5초
│  │                           │  │
│  │  ┌──────┐                 │  │
│  │  │  A   │  예리한 눈       │  │  ← 등급 뱃지 + 타이틀
│  │  └──────┘                 │  │     뱃지: bg #2563eb, text white
│  │                           │  │     48x48, rounded-lg (8px)
│  │  상위 15%                  │  │     Pretendard 600, 20px
│  │                           │  │
│  └───────────────────────────┘  │     카드: bg white, border 1px #e5e7eb
│                                 │     rounded-lg (12px), p-24px
│  (간격 16px)                     │
│                                 │
│  [NEW BEST! 이전보다 +320점]     │  ← 최고 기록 갱신 시만 표시
│                                 │     bg: #fef2f2, text: #e63946
│                                 │     Pretendard 600, 14px
│                                 │     rounded-md (6px), px-12, py-6
│  (간격 24px)                     │
│                                 │
│  라운드별 기록                    │  ← Pretendard 600, 14px, #374151
│                                 │
│  R1  ██░░░░░░  1.2초  2x2      │  ← 바 차트 (가로)
│  R2  ████░░░░  2.8초  2x2      │     빠른(~3초): #06d6a0
│  R3  ██░░░░░░  1.5초  2x2      │     보통(3-7초): #ffd166
│  R4  █████░░░  4.1초  2x2      │     느린(7초~): #e63946
│  R5  ██████░░  5.3초  3x3      │     게임오버: X + #e63946
│  ...                            │     스크롤 가능 영역 (max-h 200px)
│  R13 ████████  X     5x5       │
│                                 │
│  (flex-grow 영역)                │
│                                 │
│  ┌───────────────────────────┐  │
│  │       공유하기              │  │  ← Primary CTA
│  └───────────────────────────┘  │     bg: #e63946, text: white
│                                 │
│  (간격 10px)                     │
│                                 │
│  ┌───────────────────────────┐  │
│  │       다시 도전             │  │  ← Secondary CTA
│  └───────────────────────────┘  │     border: 1px #d1d5db, text: #374151
│                                 │
│  (간격 12px)                     │
│                                 │
│  기록 보기                       │  ← Tertiary (텍스트 링크)
│                                 │     Pretendard 400, 14px, #6b7280
│  (하단 여백 safe-area + 24px)    │
│                                 │
│  이 테스트는 의학적 진단이        │  ← 고지, Pretendard 400, 11px, #d1d5db
│  아닙니다.                       │
│                                 │
└─────────────────────────────────┘
```

### 컴포넌트

| 컴포넌트 | 스펙 |
|----------|------|
| 섹션 라벨 | "당신의 색 감각", Pretendard 400, 14px, #9ca3af, 좌측 정렬 |
| 점수 | Space Grotesk 700, 48px, #1a1a2e, 카운트업 애니메이션 |
| 점 텍스트 | "점", Pretendard 400, 20px, #6b7280, 점수 옆 (baseline 정렬) |
| 등급 뱃지 | 48x48px, rounded-lg (8px), 등급별 색상, Space Grotesk 700, 20px, white |
| 등급 타이틀 | Pretendard 600, 20px, #1a1a2e, 뱃지 우측 |
| 퍼센타일 | "상위 X%", Pretendard 600, 18px, #6b7280 |
| NEW BEST | 기록 갱신 시만 표시, bg #fef2f2, text #e63946, rounded-md |
| 바 차트 | 라운드별 가로 바, max-width: 100%, 높이 24px, gap 4px |
| Primary CTA | "공유하기", bg #e63946, text white, rounded-lg, py-3.5 |
| Secondary CTA | "다시 도전", border 1px #d1d5db, text #374151, rounded-lg, py-3.5 |
| Tertiary | "기록 보기", 텍스트만, #6b7280 |
| 고지 | "이 테스트는 의학적 진단이 아닙니다.", 11px, #d1d5db |

### 등급별 뱃지 색상

| 등급 | 뱃지 bg | 뱃지 text |
|------|---------|-----------|
| S+ | #e63946 | white |
| S | #e63946 | white |
| A | #2563eb | white |
| B+ | #06d6a0 | white |
| B | #06d6a0 | white |
| C | #6b7280 | white |
| D | #9ca3af | white |
| F | #d1d5db | #374151 |

### 애니메이션 시퀀스
1. 화면 진입 (0ms): 섹션 라벨 즉시 표시
2. 카운트업 (0-1500ms): 점수 0 → 최종값
3. 뱃지 등장 (1500ms): scale(0.8→1), 200ms ease-out
4. 퍼센타일 (1700ms): opacity 0→1, 200ms
5. NEW BEST (1900ms, 해당 시): scale(0.9→1), 300ms spring
6. 나머지 (2100ms): 즉시 표시

### 전환
- "공유하기" 탭 → ShareCard (모달, slide-up, 300ms)
- "다시 도전" 탭 → GameScreen 라운드 1 (fade, 200ms)
- "기록 보기" 탭 → HistoryScreen (fade, 200ms)

---

## 화면 5: HistoryScreen

### 목적
플레이 기록 확인 + 성장 추이 + 재도전 유도

### 레이아웃

```
┌─────────────────────────────────┐
│                                 │
│  (상단 여백 safe-area + 16px)    │
│                                 │
│  ←  내 기록                     │  ← 뒤로가기 아이콘 (Lucide ChevronLeft)
│                                 │     Pretendard 600, 18px, #1a1a2e
│  (간격 24px)                     │
│                                 │
│  ┌───────────────────────────┐  │
│  │  최고 기록                  │  │  ← 상단 카드
│  │                           │  │     bg: white, border 1px #e5e7eb
│  │  ┌────┐                   │  │     rounded-lg (12px)
│  │  │ S  │  3,450점           │  │
│  │  └────┘  상위 5%           │  │     뱃지: 36x36, Space Grotesk 700
│  │          2026.03.21        │  │     점수: Space Grotesk 600, 24px
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  (간격 20px)                     │
│                                 │
│  통계                            │  ← Pretendard 600, 14px, #374151
│                                 │
│  총 플레이     평균 점수     최고 라운드 │
│  12회          2,680점       20         │  ← Space Grotesk 600, 18px
│                                 │     라벨: Pretendard 400, 12px, #9ca3af
│  (간격 20px)                     │
│                                 │
│  ──── 구분선 ────                │  ← 1px #e5e7eb
│                                 │
│  최근 기록                       │  ← Pretendard 600, 14px, #374151
│                                 │
│  ┌───────────────────────────┐  │
│  │ BEST                      │  │  ← 최고 기록 항목에 라벨
│  │ [S] 3,450점  R20  03.21   │  │     "BEST": bg #fef2f2, text #e63946
│  ├───────────────────────────┤  │     Pretendard 500, 10px
│  │ [A] 2,840점  R18  03.20   │  │
│  ├───────────────────────────┤  │  ← 각 항목
│  │ [B] 2,100점  R15  03.19   │  │     높이 56px
│  ├───────────────────────────┤  │     뱃지: 28x28, rounded-md (4px)
│  │ [C] 1,600점  R12  03.18   │  │     점수: Space Grotesk 500, 16px
│  ├───────────────────────────┤  │     라운드: "R18", 14px, #9ca3af
│  │ [B] 2,200점  R16  03.17   │  │     날짜: 14px, #9ca3af
│  └───────────────────────────┘  │     스크롤 가능 (max 20개)
│                                 │
│  (flex-grow 영역)                │
│                                 │
│  ┌───────────────────────────┐  │
│  │       다시 도전             │  │  ← Primary CTA
│  └───────────────────────────┘  │     bg: #e63946, text: white
│                                 │
│  (하단 여백 safe-area + 24px)    │
│                                 │
└─────────────────────────────────┘
```

### 빈 상태 (기록 없음)

```
┌─────────────────────────────────┐
│                                 │
│  ←  내 기록                     │
│                                 │
│  (flex center, 나머지 영역)      │
│                                 │
│  아직 기록이 없어요               │  ← Pretendard 400, 16px, #9ca3af
│  첫 도전을 시작해보세요!          │     중앙 정렬
│                                 │
│  ┌───────────────────────────┐  │
│  │       도전하기              │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### 컴포넌트

| 컴포넌트 | 스펙 |
|----------|------|
| 헤더 | "← 내 기록", Lucide ChevronLeft 20px + Pretendard 600, 18px, #1a1a2e |
| 최고 기록 카드 | bg white, border 1px #e5e7eb, rounded-lg (12px), p-20px |
| 통계 | 3열 그리드, 라벨 12px #9ca3af, 값 Space Grotesk 600 18px #1a1a2e |
| 기록 목록 | 리스트, 각 항목 h-56px, border-bottom 1px #f3f4f6 |
| BEST 라벨 | bg #fef2f2, text #e63946, rounded-sm, px-6, py-2, 10px |
| CTA | "다시 도전", bg #e63946, text white, rounded-lg, py-3.5, 하단 고정 |

### 전환
- "← " 탭 → IntroScreen (fade, 200ms)
- "다시 도전" 탭 → GameScreen 라운드 1 (fade, 200ms)

---

## 화면 6: ShareCard (모달)

### 목적
결과를 시각적 카드로 공유 — 바이럴 확산

### 레이아웃

```
┌─────────────────────────────────┐
│ (반투명 오버레이 bg: rgba(0,0,0,0.5))│
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │  ← 모달 카드
│  │  ┌─────────────────────┐  │  │     bg: white, rounded-t-2xl (16px)
│  │  │                     │  │  │     slide-up 300ms ease-out
│  │  │  ── 공유 카드 ──     │  │  │     하단 고정, max-h: 85vh
│  │  │                     │  │  │
│  │  │  [캡처 영역 시작]     │  │  │
│  │  │  ┌─────────────┐    │  │  │  ← 캡처 대상 div
│  │  │  │             │    │  │  │     bg: #1a1a2e (딥 네이비)
│  │  │  │  컬러 감각    │    │  │  │     rounded-lg (12px)
│  │  │  │  테스트       │    │  │  │     p-24px, 비율 4:5
│  │  │  │             │    │  │  │
│  │  │  │  ┌────┐     │    │  │  │     앱 이름: Pretendard 600, 14px
│  │  │  │  │ S  │     │    │  │  │              text white, opacity 0.7
│  │  │  │  └────┘     │    │  │  │
│  │  │  │  상위 5%    │    │  │  │     뱃지: 64x64, Space Grotesk 700
│  │  │  │             │    │  │  │     24px, bg #e63946
│  │  │  │  3,450점    │    │  │  │
│  │  │  │             │    │  │  │     퍼센타일: Pretendard 700, 28px
│  │  │  │  당신의 눈은  │    │  │  │     white
│  │  │  │  몇 등급?    │    │  │  │
│  │  │  │             │    │  │  │     점수: Space Grotesk 600, 20px
│  │  │  │  [URL]      │    │  │  │     text white, opacity 0.7
│  │  │  │             │    │  │  │
│  │  │  └─────────────┘    │  │  │     CTA: Pretendard 500, 16px, white
│  │  │  [캡처 영역 끝]      │  │  │
│  │  │                     │  │  │     URL: 12px, opacity 0.5
│  │  │  (간격 20px)         │  │  │
│  │  │                     │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │ 카카오톡 공유   │  │  │  │  ← 공유 버튼 3개 가로 배치
│  │  │  └───────────────┘  │  │  │     bg: #fee500, text: #191919
│  │  │                     │  │  │     rounded-lg, py-2.5
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │ 이미지 저장     │  │  │  │     bg: #f3f4f6, text: #374151
│  │  │  └───────────────┘  │  │  │     rounded-lg, py-2.5
│  │  │                     │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │ 링크 복사      │  │  │  │     bg: #f3f4f6, text: #374151
│  │  │  └───────────────┘  │  │  │     rounded-lg, py-2.5
│  │  │                     │  │  │
│  │  │  닫기               │  │  │  ← 텍스트 링크, #9ca3af, 14px
│  │  │                     │  │  │     중앙 정렬
│  │  └─────────────────────┘  │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### 컴포넌트

| 컴포넌트 | 스펙 |
|----------|------|
| 오버레이 | bg rgba(0,0,0,0.5), 탭 시 모달 닫기 |
| 모달 | bg white, rounded-t-2xl, pb safe-area, slide-up 300ms |
| 캡처 카드 | bg #1a1a2e, rounded-lg (12px), p-24px, 비율 4:5, 2x 해상도 렌더링 |
| 카카오톡 버튼 | bg #fee500, text #191919, Pretendard 500, 15px, rounded-lg |
| 이미지 저장 | bg #f3f4f6, text #374151, Pretendard 500, 15px, rounded-lg |
| 링크 복사 | bg #f3f4f6, text #374151, Pretendard 500, 15px, rounded-lg |
| 닫기 | 텍스트만, #9ca3af, 14px, 중앙 정렬 |
| 토스트 | "복사되었습니다" / "저장되었습니다", 하단 중앙, bg #374151, text white, rounded-lg, 2초 후 fade-out |

### 전환
- 오버레이 탭 또는 "닫기" → 모달 닫기 (slide-down, 200ms) → ResultScreen 복귀
- 공유 완료 후 → 모달 유지 (추가 공유 가능)

---

## 화면 전환 요약

| From | To | 트리거 | 전환 |
|------|----|--------|------|
| IntroScreen | GameScreen | "시작하기" 탭 | fade 200ms |
| IntroScreen | HistoryScreen | "내 기록 보기" 탭 | fade 200ms |
| GameScreen | GameScreen | 정답 탭 (다음 라운드) | 그리드만 교체, 100ms |
| GameScreen | GameOverScreen | 시간 초과 (정답 표시 1.5초 후) | fade 200ms |
| GameScreen | ResultScreen | 20라운드 완료 | fade 200ms |
| GameOverScreen | ResultScreen | "결과 보기" 탭 또는 2초 자동 | fade 200ms |
| ResultScreen | ShareCard | "공유하기" 탭 | slide-up 300ms (모달) |
| ResultScreen | GameScreen | "다시 도전" 탭 | fade 200ms |
| ResultScreen | HistoryScreen | "기록 보기" 탭 | fade 200ms |
| HistoryScreen | IntroScreen | "←" 뒤로가기 | fade 200ms |
| HistoryScreen | GameScreen | "다시 도전" 탭 | fade 200ms |
| ShareCard | ResultScreen | 오버레이/닫기 탭 | slide-down 200ms |

---

## 디자인 체크리스트 (DESIGN_RULES.md 준수)

```
[x] R1:  기존 앱과 다른 색상 팔레트 (#e63946 + #1a1a2e + #fafbfc)
[x] R2:  그라디언트 텍스트 미사용
[x] R3:  135deg 그라디언트 미사용
[x] R4:  fadeInUp 미사용 — scale, shake, fade만 사용
[x] R5:  선형 플로우, 탭바 없음
[x] R6:  backdrop-blur는 ShareCard 오버레이에서만 (1곳)
[x] R7:  장식 파티클/오브 없음
[x] R8:  Pretendard + Space Grotesk (기존 앱과 다른 조합)
[x] R9:  라이트 모드 기본
[x] R10: border-radius 위계 — 12px(카드), 8px(CTA), 4px(타일)
[x] R11: Lucide Icons 통일
[x] R12: font-weight 위계 — H1:700, Body:400, Label:600
[x] R13: 이모지 UI 미사용 (공유 텍스트에만 제한적 사용)
[x] R14: 좌측 정렬 기본 (예외: GameOverScreen, 게임 그리드, 결과 점수)
[x] R15: 카드 네스팅 없음
[x] R16: Primary/Secondary/Tertiary 버튼 위계 명확
[x] R17: 로딩 화면 없음 (즉시 표시 구조)
```
