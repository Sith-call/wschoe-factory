# 꿈 공장 — Iteration 3 디자인 통일성 리뷰

**평가일**: 2026-03-20
**검토 대상**: 9개 디자인 통일성 수정사항
**검토 방법**: 실제 컴포넌트 소스코드 직접 확인

---

## Fix 1: 배경색이 모든 스크린에서 bg-surface로 통일됐는지

### 결과: **Pass (조건부)**

각 스크린의 최상위 div 배경색:

| 스크린 | 클래스 | 판정 |
|--------|--------|------|
| IntroScreen | `bg-surface-dim` | 의도적 예외 (홈 화면 어두운 분위기) |
| SceneBuilderScreen | `bg-surface` | Pass |
| EmotionScreen | `bg-surface` | Pass |
| AnalysisScreen | `mystic-gradient` | 의도적 예외 (로딩 연출 화면) |
| InterpretationScreen | `bg-surface` | Pass |
| ShareScreen | `bg-surface` | Pass |
| GalleryScreen | `bg-surface` | Pass |
| PatternScreen | `bg-surface` | Pass |

IntroScreen(`bg-surface-dim`)과 AnalysisScreen(`mystic-gradient`)은 화면 성격상 의도적인 차별화로 판단. 나머지 6개 스크린은 모두 `bg-surface`로 통일됨.

---

## Fix 2: CTA 버튼이 모두 rounded-full인지

### 결과: **Pass**

모든 주요 CTA 버튼 확인:

| 위치 | 클래스 | 판정 |
|------|--------|------|
| IntroScreen "꿈 기록하기" | `rounded-full` | Pass |
| SceneBuilderScreen "다음 단계로" | `rounded-full` | Pass |
| EmotionScreen "꿈 해석받기" | `rounded-full` | Pass |
| InterpretationScreen "저장하기" | `rounded-full` | Pass |
| InterpretationScreen "공유하기" | `rounded-full` | Pass |
| InterpretationScreen "메모 수정" | `rounded-full` | Pass |
| InterpretationScreen 메모 "저장" | `rounded-full` | Pass |
| GalleryScreen "꿈 기록하기" (빈 상태) | `rounded-full` | Pass |
| GalleryScreen 필터 칩 | `rounded-full` | Pass |

모든 CTA 버튼이 pill(rounded-full) 형태로 통일됨.

---

## Fix 3: 헤더 폰트 크기가 모두 text-lg인지

### 결과: **Pass**

모든 스크린의 `<h1>` 헤더 확인:

| 스크린 | 텍스트 | 클래스 | 판정 |
|--------|--------|--------|------|
| IntroScreen | "꿈 공장" | `text-lg font-headline` | Pass |
| SceneBuilderScreen | "꿈의 조각가" | `font-headline text-lg` | Pass |
| EmotionScreen | "감정 선택" | `font-headline text-lg` | Pass |
| InterpretationScreen | "꿈 해석" | `font-headline text-lg` | Pass |
| ShareScreen | "꿈 공유하기" | `font-headline text-lg` | Pass |
| GalleryScreen | "꿈 갤러리" | `font-headline text-lg` | Pass |
| PatternScreen | "패턴 분석" | `text-lg font-headline` | Pass |

모든 헤더가 `text-lg`로 통일됨.

---

## Fix 4: 하드코딩 hex 색상이 토큰으로 교체됐는지

### 결과: **Fail (부분적)**

하드코딩 hex 값이 여전히 다수 존재:

**잔존 하드코딩 목록:**

| 파일 | 코드 | 유형 |
|------|------|------|
| InterpretationScreen.tsx:29 | `bg-[#120e31]` | 헤더 배경 |
| InterpretationScreen.tsx:30,34 | `text-[#c3c0ff]`, `hover:text-[#ffb95f]` | 텍스트 색상 |
| InterpretationScreen.tsx:40 | `bg-[radial-gradient(...#4f46e5...)]` | 배경 그라데이션 |
| InterpretationScreen.tsx:45 | `from-[#ffb95f]/30` | 카드 테두리 |
| InterpretationScreen.tsx:48 | `#1a1739`, `#120e31` (inline style) | 카드 배경 |
| SceneBuilderScreen.tsx:95 | `bg-[#120e31]/60` | 헤더 배경 |
| SceneBuilderScreen.tsx:111 | `shadow-[0_0_12px_#4f46e5]` | 프로그레스 바 |
| SceneBuilderScreen.tsx:123-124 | `text-[#c3c0ff]`, `bg-[#4f46e5]/20`, `text-[#e4dfff]/40` | 탭 색상 |
| SceneBuilderScreen.tsx:186 | `from-[#120e31]` | 푸터 배경 |
| EmotionScreen.tsx:44 | `bg-[#120e31]/40` | 헤더 배경 |
| GalleryScreen.tsx:48 | `from-[#120e31]` | 헤더 배경 |
| ShareScreen.tsx:42 | `#1a1739` (inline style) | 카드 배경 |
| ShareScreen.tsx:57 | `from-[#120e31]`, `via-[#1a1739]` | 컨텐츠 오버레이 |
| AnalysisScreen.tsx:90,96 | `bg-[#ffb95f]/30`, `text-[#ffb95f]` | 장식 요소 |
| PatternScreen.tsx:67 | `['#a88cfb', '#0d082c', '#ff6e84', '#4f46e5', '#1c00a0']` | 도넛 차트 색상 |
| PatternScreen.tsx:152 | `from-[#4F46E5] to-[#A78BFA]` | 바 차트 그라데이션 |
| PatternScreen.tsx:188 | `['#a88cfb', '#0d082c', '#ff6e84', '#4f46e5']` | 범례 색상 |
| PatternScreen.tsx:221 | `stroke="#4f46e5"` | 라인 차트 |
| DreamIconComposition.tsx:24 | `['#7C3AED', '#3B82F6']` (fallback) | 감정 그라데이션 |

총 **20곳 이상**에서 하드코딩 hex 값 잔존. `#120e31`(앱 다크 배경), `#1a1739`(중간 다크), `#c3c0ff`(밝은 인디고), `#ffb95f`(앰버 악센트), `#4f46e5`(프라이머리) 등이 디자인 토큰 대신 직접 사용되고 있음.

**참고**: 이 중 일부(DreamIconComposition의 감정별 gradient, 인라인 스타일 linear-gradient 등)는 Tailwind 유틸리티 클래스로 대체가 어려운 케이스이므로, CSS 커스텀 프로퍼티로 정의해야 완전한 토큰화가 가능.

---

## Fix 5: ShareScreen에 하단 탭바가 추가됐는지

### 결과: **Pass**

ShareScreen.tsx 126-139행에 `<nav>` 요소로 하단 탭바 확인:
- 기록 / 갤러리 / 통계 3탭 구성
- 다른 스크린과 동일한 스타일 (bg-indigo-950/60, backdrop-blur-xl, rounded-t-[40px])
- 동일한 아이콘 (edit_note, auto_stories, insights)

---

## Fix 6: PatternScreen 헤더가 fixed이고 "패턴 분석"으로 한국어화됐는지

### 결과: **Pass**

PatternScreen.tsx 두 곳 (빈 상태 86행, 일반 상태 103행) 모두:
- `fixed top-0 z-50` 적용
- `<h1>` 텍스트: "패턴 분석" (한국어)

---

## Fix 7: 카드 border-radius가 card-radius/card-radius-sm으로 통일됐는지

### 결과: **Pass (부분적)**

| 위치 | 클래스 | 판정 |
|------|--------|------|
| IntroScreen 최근 기록 카드 | `card-radius` | Pass |
| InterpretationScreen 타로 카드 | `card-radius` (2곳) | Pass |
| GalleryScreen 갤러리 카드 | `card-radius` | Pass |

`card-radius` 커스텀 클래스가 주요 카드 컴포넌트에서 사용됨. 다만 일부 비카드 요소(섹션 컨테이너 등)에서는 `rounded-xl`, `rounded-2xl`, `rounded-lg` 등 표준 Tailwind 유틸리티가 혼재.

**참고**: 카드형 UI에는 `card-radius`가 적용됐으나, 섹션/컨테이너에 대한 radius 토큰은 별도 정의 필요.

---

## Fix 8: glass-panel이 glass-card-subtle로 교체됐는지

### 결과: **Pass**

코드 전체에서 `glass-panel` 검색 결과: **0건** (완전 제거됨)

현재 glassmorphism 클래스 사용 현황:
- `glass-card-subtle`: SceneBuilderScreen (미리보기 아이콘, 선택 카드), GalleryScreen (갤러리 카드)
- `glass-card`: IntroScreen (오빗 별, 최근 기록 카드), EmotionScreen (감정 버튼)

두 가지 glassmorphism 변형(`glass-card`, `glass-card-subtle`)이 용도에 따라 구분 사용되며, 구 `glass-panel`은 완전히 제거됨.

---

## 종합 점수

| Fix | 항목 | 판정 | 비고 |
|-----|------|------|------|
| 1 | 배경색 bg-surface 통일 | **Pass** | IntroScreen/AnalysisScreen은 의도적 예외 |
| 2 | CTA 버튼 rounded-full | **Pass** | 모든 CTA 일관 |
| 3 | 헤더 폰트 text-lg | **Pass** | 8개 스크린 모두 일치 |
| 4 | 하드코딩 hex→토큰 | **Fail** | 20곳 이상 잔존 |
| 5 | ShareScreen 하단 탭바 | **Pass** | 3탭 동일 구조 |
| 6 | PatternScreen fixed+한국어 | **Pass** | 두 상태 모두 적용 |
| 7 | 카드 card-radius 통일 | **Pass** | 주요 카드에 적용 |
| 8 | glass-panel→glass-card-subtle | **Pass** | glass-panel 0건 |

**Pass: 7/8, Fail: 1/8**

---

## 디자인 통일성 점수

### 이전 점수: 미측정 (Iteration 2에서 "통일성 부족" 지적)
### 현재 점수: **78/100**

**감점 요인:**

1. **하드코딩 hex 잔존 (-12점)**: 20곳 이상의 하드코딩 색상은 디자인 시스템 관점에서 큰 기술 부채. 테마 변경이나 다크/라이트 모드 전환 시 일괄 수정이 불가능. 특히 `#120e31`, `#1a1739`, `#c3c0ff`, `#ffb95f`, `#4f46e5`는 핵심 색상인데 토큰화되지 않음.

2. **glassmorphism 변형 2종 혼재 (-3점)**: `glass-card`와 `glass-card-subtle` 두 가지가 있는 건 괜찮지만, 어떤 상황에서 어느 것을 쓰는지 규칙이 명확하지 않음. IntroScreen은 `glass-card`이고 GalleryScreen은 `glass-card-subtle`인데, 두 화면 모두 카드형 UI를 표시.

3. **섹션 컨테이너 radius 미통일 (-4점)**: `rounded-xl`, `rounded-2xl`, `rounded-lg`가 혼재. 카드에는 `card-radius`가 적용됐지만 PatternScreen 섹션들은 `rounded-xl`, ShareScreen 공유 버튼은 `rounded-2xl` 등.

4. **IntroScreen과 AnalysisScreen 예외 (-3점)**: 의도적인 차별화라 해도, 앱 전체의 일관된 기조에서 벗어나는 것은 사실. 특히 AnalysisScreen은 `mystic-gradient`라는 독자적 클래스를 사용.

**가점 요인:**

- 탭바 구조가 모든 화면에서 완벽히 일치 (기록/갤러리/통계, 같은 아이콘, 같은 스타일)
- 헤더 폰트/크기가 완벽히 일치
- CTA 버튼 스타일이 완벽히 일치
- glass-panel이 완전히 제거됨
- 한국어화가 UI 전반에 걸쳐 일관됨

---

## 남은 이슈 (우선순위순)

### 1. hex 하드코딩 토큰화 (High Priority)

앱 전체에서 반복 사용되는 5개 핵심 색상을 CSS 커스텀 프로퍼티 또는 Tailwind 확장으로 토큰화해야 함:

| 현재 hex | 용도 | 제안 토큰명 |
|----------|------|-------------|
| `#120e31` | 앱 최하단 다크 배경 | `--color-surface-lowest` |
| `#1a1739` | 중간 다크 배경 | `--color-surface-dim-alt` |
| `#c3c0ff` | 밝은 인디고 텍스트 | `--color-primary-light` |
| `#ffb95f` | 앰버 악센트 (hover, 장식) | `--color-accent-warm` |
| `#4f46e5` | 프라이머리 (그라데이션 등) | 기존 `--color-primary` 재사용 |

### 2. 섹션 컨테이너 radius 통일 (Medium Priority)

`rounded-xl`을 모든 섹션 컨테이너의 기본으로 정하거나, `section-radius` 토큰을 새로 정의.

### 3. glass-card vs glass-card-subtle 용도 명확화 (Low Priority)

문서화 또는 코멘트로 사용 기준 명시. 예: `glass-card`는 인터랙티브 카드, `glass-card-subtle`은 정보 표시 카드.
