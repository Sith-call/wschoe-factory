# Design System — 아재개그 자판기 (Dad Joke Machine)

## 1. 디자인 컨셉

**레트로 자판기 (Retro Vending Machine)**

동전 넣고 레버 돌리면 "덜컹" 하고 캔이 떨어지는 90년대 자판기 감성. 촌스러움을 의도적으로 세련되게 포장한 "뉴트로" 스타일이다. UI는 극단적으로 미니멀하되, 색상과 타이포그래피에서 아재 감성이 스며 나온다.

---

## 2. 색상 팔레트

기존 앱 사용 색상: teal/amber/stone (econ-academy), violet/zinc (color-sense), dusty rose/terracotta (skin-diary).
이 앱은 **tangerine orange + cream** 계열로 차별화한다. 레트로 자판기의 주황빛 조명과 크림색 외장 패널에서 영감.

```
Token              Value       Usage
─────────────────  ─────────   ──────────────────────────────
primary            #C85A1A     차분한 탠저린 — 메인 버튼, 강조 (채도 낮춘 자판기 색)
primary-dark       #A84810     hover/active 상태
primary-light      #FDF6F0     아주 연한 크림 틴트

secondary          #3D7A50     녹색 — 보조 액션, 텍스트 포인트
secondary-light    #EDF5EF     녹색 틴트 배경

background         #F7F4EF     따뜻한 크림 — 앱 전체 배경 (눈에 편한 톤)
surface            #FFFFFF     카드, 모달 배경

text-primary       #33302B     따뜻한 다크 — 본문 텍스트
text-secondary     #6B6560     따뜻한 회갈색 — 보조 텍스트
text-tertiary      #9E9890     비활성 텍스트

accent             #C49A3A     머스터드 옐로 — 배지, 카운터 숫자
danger             #C23B3B     빨간색 — 에러 상태

border             #E8E2DA     따뜻한 베이지 구분선
```

### 왜 이 팔레트인가?
- **탠저린 오렌지**: 기존 앱에 오렌지 계열이 없다. 레트로 자판기의 따뜻한 조명, 에너지, "펀(fun)" 감성.
- **짙은 녹색 보조**: 70~90년대 한국 자판기/간판에서 흔히 보이던 초록+주황 조합. 뉴트로 감성.
- **크림 배경**: 순백이 아닌, 시간이 묻은 따뜻한 플라스틱 톤.

---

## 3. 폰트 조합

기존 앱에서 사용된 폰트: Pretendard, Space Grotesk, Wanted Sans Variable, Archivo, Gowun Batang, SUIT Variable, Crimson Pro.

### 한국어 본문: Nanum Gothic (Google Fonts)
- 둥글고 친근한 느낌이 아재개그의 "별거 아닌데 웃기는" 톤과 맞음
- 가독성 우수, 16px 이상에서 깔끔

### 영문/숫자: Sora (Google Fonts)
- 기하학적이면서 부드러운 곡선. 레트로+모던 중간 지점.
- tabular-nums 지원으로 카운터 숫자 정렬 가능

### 타이틀 전용: Black Han Sans (Google Fonts)
- 굵고 임팩트 있는 한글 서체. "아재개그 자판기" 타이틀에만 사용.
- 레트로 간판/포스터 느낌.

### CDN
```html
<!-- Nanum Gothic -->
<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap" rel="stylesheet">

<!-- Sora -->
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Black Han Sans (타이틀 전용) -->
<link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap" rel="stylesheet">
```

### 폰트 웨이트 위계 (R12)
```
H1 (앱 타이틀)          → Black Han Sans 400 (자체가 굵은 서체)
H2 (개그 텍스트)        → Nanum Gothic 700
H3 (보조 텍스트/라벨)   → Nanum Gothic 400
본문                     → Nanum Gothic 400
숫자/카운터             → Sora 600 (tabular-nums)
```

### 텍스트 크기 스케일
```
xs:   12px / 0.75rem
sm:   14px / 0.875rem
base: 16px / 1rem
lg:   20px / 1.25rem
xl:   24px / 1.5rem
2xl:  28px / 1.75rem
3xl:  36px / 2.25rem   (앱 타이틀용)
```

---

## 4. 컴포넌트 스타일

### 버튼 (R16 — 3단계 위계)

**Primary (메인 액션: "눌러봐!", "다음!")**
```css
.btn-primary {
  background: #E8651A;
  color: #FFFFFF;
  font-family: 'Nanum Gothic', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;        /* 20px — 큰 버튼 */
  padding: 16px 40px;
  border-radius: 8px;
  border: 3px solid #C4520F;  /* 레트로 자판기 버튼의 두꺼운 테두리 */
  box-shadow: 0 4px 0 #C4520F; /* 눌리는 느낌의 하단 그림자 */
  cursor: pointer;
}
.btn-primary:hover {
  background: #C4520F;
}
.btn-primary:active {
  box-shadow: 0 1px 0 #C4520F;
  transform: translateY(3px);  /* 눌리는 물리 피드백 */
}
```

**Secondary (보조 액션: "건너뛰기")**
```css
.btn-secondary {
  background: transparent;
  color: #2B5F3A;
  font-family: 'Nanum Gothic', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid #2B5F3A;
  cursor: pointer;
}
.btn-secondary:hover {
  background: #E8F5EC;
}
```

**Tertiary (부가 액션: 즐겨찾기 링크 등)**
```css
.btn-tertiary {
  background: none;
  border: none;
  color: #E8651A;
  font-family: 'Nanum Gothic', sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
}
```

### 개그 카드/컨테이너

개그 텍스트가 표시되는 영역. 카드 네스팅 금지 (R15).

```css
.joke-card {
  background: #FFFFFF;           /* surface — 깨끗한 화이트 */
  border: 1px solid #E8E2DA;     /* 얇은 베이지 보더 */
  border-radius: 16px;           /* 균일한 라운드 */
  padding: 24px 20px;
  margin: 0 16px;
}
```

카드 안에 카드를 넣지 않는다. colored left-border는 AI 안티패턴이므로 사용하지 않는다.
질문과 답은 같은 카드 내에서 여백으로 분리, 액션 버튼은 border-top으로 구분.

### 텍스트 스타일: 개그 셋업 vs 펀치라인

```css
/* 셋업 (질문) — 차분하게 */
.joke-setup {
  font-family: 'Nanum Gothic', sans-serif;
  font-weight: 400;
  font-size: 1.125rem;   /* 18px */
  line-height: 1.6;
  color: #2D2418;
}

/* 펀치라인 (답) — 강조하되 차분하게 */
.joke-punchline {
  font-family: 'Nanum Gothic', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;     /* 20px — 셋업보다 약간 크게 */
  line-height: 1.5;
  color: #33302B;         /* text-primary — 읽기 편한 다크 톤 */
  margin-top: 12px;
}
```

### 즐겨찾기 목록 아이템

```css
.favorite-item {
  padding: 16px 20px;
  border-bottom: 1px solid #E5DDD2;
  text-align: left;              /* R14 좌측 정렬 */
}
```

---

## 5. 레이아웃 규칙

### 정렬 방식 (R14)

| 화면 | 정렬 | 이유 |
|------|------|------|
| 메인 화면 (대기) | 중앙 정렬 | 버튼 하나뿐인 인트로 성격, 예외 허용 |
| 메인 화면 (개그 표시) | 좌측 정렬 | 텍스트 읽기는 좌측이 자연스럽다 |
| 즐겨찾기 목록 | 좌측 정렬 | 리스트형 데이터는 좌측 기본 |
| 50개 클리어 | 중앙 정렬 | 결과/축하 화면 예외 허용 |

### 여백/간격 시스템

```
Token    Value    Usage
───────  ──────   ─────────────────────────
xs       4px      아이콘-텍스트 인라인 간격
sm       8px      컴포넌트 내부 소간격
md       16px     좌우 패딩, 섹션 내부 여백
lg       24px     개그 카드 내부 패딩, 섹션 간 간격
xl       32px     화면 상하 패딩
2xl      48px     메인 버튼 상하 여백
3xl      64px     타이틀~버튼 간격
```

### 모바일 뷰포트 기준

```css
.app-container {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh;     /* 모바일 동적 뷰포트 */
  background: #FBF7F0;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 메인 화면은 수직 중앙 */
}

/* 데스크톱 래퍼 */
@media (min-width: 431px) {
  body {
    background: #E5DDD2;  /* 자판기 뒷벽 느낌 */
  }
}
```

### 네비게이션 (R5 — 단일 화면 앱)

이 앱은 **메인 화면 하나**에서 모든 핵심 경험이 일어나는 단일 화면 구조다.

- 바텀 탭바 **없음** (불필요)
- 즐겨찾기(P2) 진입: 우상단 작은 아이콘 (SVG)
- 즐겨찾기 화면: 좌상단 뒤로가기 아이콘으로 메인 복귀
- 화면 간 이동은 전부 아이콘/버튼 탭으로 처리

---

## 6. 애니메이션 전략

### 핵심 원칙
- **대부분은 즉시 표시** (R4)
- fadeInUp 사용 금지
- 장식 파티클/오브 금지 (R7)
- 의도적 딜레이(기대감 연출)와 팝 등장이 이 앱의 핵심 애니메이션

### 즉시 표시하는 것
- 화면 전환 (메인 <-> 즐겨찾기)
- 버튼 상태 변경
- 타이틀, 카운터 텍스트
- 즐겨찾기 목록 아이템

### 전환 효과를 쓰는 것

| 상황 | 애니메이션 | Duration | Easing |
|------|-----------|----------|--------|
| 화면 전환 (메인<->즐겨찾기) | opacity crossfade | 150ms | ease-in-out |
| 버튼 누름 | translateY(3px) + shadow 축소 | 100ms | ease-out |
| 즐겨찾기 하트 | scale(1 -> 1.2 -> 1) | 200ms | ease-out |

### 개그 등장 연출 (이 앱의 핵심 모션)

버튼 탭 후 0.5~1초 딜레이 → 개그 텍스트 "팝" 등장. 이것이 이 앱의 유일하고 핵심적인 애니메이션이다.

**로딩 상태 (두구두구...)**
```css
/* 점 3개가 순차적으로 나타나는 로딩 — 스피너 대신 */
.loading-dots span {
  opacity: 0;
  animation: dot-appear 1s infinite;
}
.loading-dots span:nth-child(1) { animation-delay: 0ms; }
.loading-dots span:nth-child(2) { animation-delay: 200ms; }
.loading-dots span:nth-child(3) { animation-delay: 400ms; }

@keyframes dot-appear {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
```

**팝 등장 (개그 텍스트)**
```css
/* scale 기반 팝 — fadeInUp 아님! */
@keyframes joke-pop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    opacity: 1;
    transform: scale(1.05);  /* 살짝 오버슈트 */
  }
  100% {
    transform: scale(1);
  }
}

.joke-appear {
  animation: joke-pop 300ms ease-out forwards;
}
```

**펀치라인 공개 (질문형 개그에서 답 탭 시)**
```css
/* 좌에서 슬라이드 — fadeInUp과 다른 방향 */
@keyframes punchline-reveal {
  0% {
    opacity: 0;
    transform: translateX(-12px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.punchline-appear {
  animation: punchline-reveal 250ms ease-out forwards;
}
```

**50개 클리어 축하 (S-007)**
```css
/* 기능적 의미가 있는 축하 — 간단한 confetti 허용 (R7 예외) */
/* 컨페티는 SVG 조각 5~8개를 떨어뜨리는 간단한 구현 */
```

---

## 7. 아이콘 (R11, R13)

아이콘 세트: **Phosphor Icons** (기존 앱에서 사용하지 않은 세트).
이모지를 아이콘/장식으로 사용하지 않는다 (R13).

### 필요 아이콘 목록

| 아이콘 | 용도 | 스타일 |
|--------|------|--------|
| Star (outline/fill) | 즐겨찾기 토글 | bold, 24x24 |
| ArrowLeft | 뒤로가기 | regular, 20x20 |
| TrashSimple | 즐겨찾기 삭제 (스와이프) | regular, 20x20 |
| ShareNetwork | 공유 (P2) | regular, 20x20 |
| Confetti | 50개 클리어 축하 | fill, 32x32 |

- 크기: 20px (기본), 24px (중요 액션), 32px (축하 화면)
- 색상: `currentColor` 상속
- 스트로크: bold weight (Phosphor의 굵은 변형이 레트로 느낌과 맞음)

### Phosphor Icons CDN
```html
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
```
또는 React 프로젝트:
```bash
npm install @phosphor-icons/react
```

---

## 8. Border Radius (R10 — 의도적 혼합)

```
요소                 Radius          비고
──────────────────  ──────────────  ─────────────────
메인 버튼            12px            부드럽고 모던한 라운드
개그 카드            16px            균일한 라운드 — 깨끗한 카드
즐겨찾기 아이템      0px             sharp — 리스트는 날카롭게
뒤로가기 아이콘 영역  9999px (pill)   원형 터치 영역
카운터 배지          4px             작고 단단한 느낌
```

모든 요소에 동일한 radius를 쓰지 않는다. sharp(0px)와 round를 의도적으로 섞어서 시각적 리듬을 만든다.

---

## 9. 그라디언트 (R2, R3)

- **그라디언트 텍스트 사용하지 않는다** (R2). 모든 텍스트는 단색.
- **그라디언트 배경도 사용하지 않는다.** 레트로 자판기는 단색 플라스틱 패널이다.
- `linear-gradient(135deg, ...)` 금지 (R3).

---

## 10. backdrop-blur (R6)

- 사용하지 않는다 (0곳).
- 단일 화면 앱이라 오버레이/모달이 거의 없다. 있더라도 solid background 처리.

---

## 11. 장식 요소 (R7)

- 배경 파티클, 떠다니는 오브, 별 없음.
- 빈 공간(화이트 스페이스)이 자판기의 넓은 패널 느낌을 준다.
- 유일한 장식: 50개 클리어(S-007) 축하 시 간단한 confetti (기능적 의미 있음, R7 예외).

---

## 12. 다크/라이트 테마 (R9)

- **라이트 모드 전용.** 크림색 배경(#FBF7F0)이 이 앱의 핵심 아이덴티티.
- 다크 모드 지원은 P1에서 시스템 설정 연동으로 추가 가능하나, 기본은 라이트.

---

## 13. 로딩 (R17)

- 스피너 + 재미 텍스트 로테이션 **금지.**
- 개그 로딩 대기(0.5~1초)는 점 3개 순차 등장("...")으로 기대감을 연출.
- 이는 "자판기에서 캔이 나올 때까지 기다리는" 물리적 경험을 디지털로 옮긴 것.

---

## 14. 빈 상태 (R21)

**즐겨찾기가 비어있을 때:**
```
[좌측 정렬]
Star 아이콘 (outline, secondary 색상, 32px)

"아직 저장한 개그가 없어요"
"마음에 드는 개그를 발견하면 별표를 눌러보세요"

[Primary 버튼] 개그 뽑으러 가기
```

빈 상태에 행동 유도(CTA)를 반드시 포함한다.

---

## 15. DESIGN_RULES.md 체크리스트 통과 확인

```
[x] R1  — 기존 앱과 다른 색상 팔레트 (tangerine orange + cream + forest green)
         기존: teal/amber, violet/zinc, dusty rose. 오렌지+녹색 조합은 최초.
[x] R2  — 그라디언트 텍스트 미사용. 모든 텍스트 단색.
[x] R3  — 135deg 그라디언트 미사용. 그라디언트 자체를 쓰지 않음.
[x] R4  — fadeInUp 미사용. scale 기반 팝(joke-pop) + 좌측 슬라이드(punchline-reveal) + 즉시 표시.
[x] R5  — 단일 화면 앱이므로 바텀 탭바 없음. 아이콘 탭으로 즐겨찾기 진입/복귀.
[x] R6  — backdrop-blur 사용하지 않음 (0곳).
[x] R7  — 장식 파티클/오브 없음. 50개 클리어 confetti만 예외 (기능적 의미).
[x] R8  — Nanum Gothic + Sora + Black Han Sans 고유 조합. 기존 앱 폰트와 겹치지 않음.
[x] R9  — 라이트 모드 전용. 크림색 배경이 핵심 아이덴티티.
[x] R10 — border-radius 혼합: 8px(버튼), 0+12px(카드), 0px(리스트), pill(아이콘), 4px(배지).
[x] R11 — Phosphor Icons 통일. Material Symbols 미사용.
[x] R12 — font-weight 위계: 타이틀=Black Han Sans, H2=700, 본문=400.
[x] R13 — 이모지 아이콘 미사용. 모두 Phosphor SVG 아이콘.
[x] R14 — 좌측 정렬 기본. 중앙 정렬은 대기 상태 버튼, 50개 클리어 화면만.
[x] R15 — 카드 네스팅 금지. 개그 카드 1단계만. 질문/답은 같은 카드 내 여백 분리.
[x] R16 — Primary(솔리드 오렌지)/Secondary(아웃라인 녹색)/Tertiary(텍스트 링크) 3단계 위계.
[x] R17 — 스피너+텍스트 로테이션 금지. 점 3개 순차 등장으로 대기 연출.
[x] R18 — 해당 없음 (반복 카드 구조 없음).
[x] R19 — 즐겨찾기 저장 시 별 아이콘 채움(fill) + scale 피드백.
[x] R20 — 해당 없음 (인과관계 데이터 없음).
[x] R21 — 즐겨찾기 빈 상태에 "개그 뽑으러 가기" CTA 포함.
```

**17개 규칙 + 추가 규칙 전부 충족.**

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-31 | Tangerine Orange + Forest Green + Cream 팔레트 | 레트로 자판기의 주황 조명 + 녹색 바디. 기존 앱과 겹치지 않음. |
| 2026-03-31 | Nanum Gothic + Sora + Black Han Sans | 둥글고 친근한 한글 + 기하학적 영문 + 임팩트 타이틀. 전부 기존 미사용. |
| 2026-03-31 | 라이트 모드 전용 | R9 준수 + 크림색 배경이 레트로 자판기 외장 패널 느낌. |
| 2026-03-31 | Phosphor Icons | R11 다양화. 기존 앱은 Lucide/커스텀 SVG 사용. bold weight가 레트로 느낌과 맞음. |
| 2026-03-31 | 단일 화면 + 네비게이션 없음 | R5 준수. 원터치 미니멀 UX에 탭바 불필요. |
| 2026-03-31 | scale 기반 팝 애니메이션 | fadeInUp 대신. 자판기에서 "팝!" 하고 나오는 물리 감성. |
| 2026-03-31 | 버튼에 box-shadow 하단 그림자 | 레트로 물리 버튼의 입체감. 누르면 그림자가 줄며 "눌리는" 피드백. |
