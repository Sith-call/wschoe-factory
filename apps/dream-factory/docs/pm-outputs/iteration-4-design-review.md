# 꿈 공장 — Iteration 4 디자인 통일성 리뷰 (Final)

**평가일**: 2026-03-20
**이전 점수**: 78/100 (주요 감점: hex 하드코딩 20곳 이상)
**이번 변경**: 20+ hex 색상을 Tailwind 토큰 클래스로 교체 (7개 파일)

---

## hex 하드코딩 교체 검증

### 이전 상태 (Iteration 3): 20곳 이상 hex 잔존

주요 위반 파일: InterpretationScreen, SceneBuilderScreen, EmotionScreen, GalleryScreen, ShareScreen, AnalysisScreen, PatternScreen

### 현재 상태 (Iteration 4): 대폭 감소

코드 전체 hex grep 결과:

| 파일 | 잔존 hex | 유형 | 판정 |
|------|----------|------|------|
| SceneBuilderScreen.tsx | **0** | - | Clean |
| EmotionScreen.tsx | **0** | - | Clean |
| GalleryScreen.tsx | **0** | - | Clean |
| AnalysisScreen.tsx | **0** | - | Clean |
| InterpretationScreen.tsx | 1 | inline gradient (`#1a1739`, `#120e31`) | 허용 (CSS gradient은 토큰 대체 어려움) |
| ShareScreen.tsx | 1 | inline gradient (`#1a1739`) | 허용 (동일 사유) |
| PatternScreen.tsx | 4 | 차트 라이브러리 색상 배열 | 허용 (SVG/canvas 차트는 Tailwind 미적용) |
| DreamIconComposition.tsx | 1 | fallback gradient | 허용 (null-safe 기본값) |
| data.ts | 8 | 감정별 gradient 정의 | 데이터 레이어 — 디자인 토큰 범위 밖 |

**교체된 파일 확인 (샘플):**
- `SceneBuilderScreen`: 헤더 `bg-[#120e31]/60` → `bg-surface-dim/60`, 프로그레스 바 shadow hex → 제거, 탭 색상 hex → 시맨틱 토큰
- `EmotionScreen`: 헤더 `bg-[#120e31]/40` → `bg-surface-dim/40`
- `GalleryScreen`: 헤더 `from-[#120e31]` → `from-surface-dim`
- `IntroScreen`: hex 0건 (이미 토큰 사용 중 + 새 온보딩도 토큰만 사용)

**판정: Pass** — 컴포넌트 레벨 hex가 20곳 → 7곳(모두 허용 사유 있음)으로 감소. Tailwind 클래스로 대체 가능한 hex는 모두 교체됨.

---

## 온보딩 UI 디자인 일관성

새로 추가된 온보딩 오버레이 검증:
- 배경: `bg-surface-dim/95` — 기존 IntroScreen 배경 토큰과 일치
- 아이콘 컨테이너: `bg-primary-container/20` — 시맨틱 토큰
- 텍스트: `text-on-background`, `text-on-surface-variant/80` — 시맨틱 토큰
- CTA 버튼: `bg-primary-container text-on-primary-container rounded-full` — 기존 CTA와 동일
- Dot indicator: `bg-primary` / `bg-on-surface-variant/30` — 시맨틱 토큰
- **hex 하드코딩: 0건**

**판정: Pass** — 온보딩 UI가 기존 디자인 시스템과 완벽히 일관됨.

---

## 업데이트된 디자인 통일성 점수

### 이전: 78/100 → 현재: **84/100** (+6)

**감점 해소:**
- hex 하드코딩: -12점 → **-4점** (잔존 7곳은 기술적 제약으로 허용)

**잔존 감점:**
- glassmorphism 변형 2종 용도 규칙 미문서화 (-3점)
- 섹션 컨테이너 radius 미통일 (-4점)
- IntroScreen/AnalysisScreen 예외 배경 (-3점)
- 잔존 inline gradient hex (-4점)
- PatternScreen 차트 hex (-2점)

---

## 최종 판정

### 결과: PASS — 84/100으로 80% 달성

핵심 이슈였던 hex 하드코딩이 컴포넌트 레벨에서 실질적으로 해소됨. 잔존 hex는 모두 inline CSS gradient 또는 차트 라이브러리 등 Tailwind 토큰 대체가 기술적으로 어려운 케이스. 새로 추가된 온보딩 UI도 hex 없이 시맨틱 토큰만 사용하여 디자인 시스템 준수.
