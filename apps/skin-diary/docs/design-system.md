# 피부 일지 (Skin Diary) — Design System

## 타겟 유저

**20대 여성** — 매일 스킨케어 루틴을 기록하고, 피부 변화를 추적하고 싶은 사람.

## 디자인 콘셉트

**개인 일기장 (Personal Journal)**

이 앱은 대시보드도, 게임도, 병원 차트도 아니다. 따뜻하고, 부드럽고, 내밀한 느낌의 **일기장**이다. 세리프 서체 헤딩과 따뜻한 색감이 이 앱만의 "일기장" 미학을 만든다.

---

## 색상 팔레트

기존 앱에서 사용된 팔레트: amber, indigo, crimson, rose, teal, emerald, violet.
이 앱은 **dusty rose/terracotta** 계열로 차별화한다.

```
background:     #fdf8f4   (warm cream — 일기장 종이 느낌)
surface:        #ffffff
text-primary:   #3d2c2c   (warm brown-black)
text-secondary: #8b7e7e   (warm gray)
text-tertiary:  #b5aaaa

primary:        #c2847a   (dusty rose/terracotta — 따뜻하고, 여성적이고, 피부톤)
primary-light:  #f5ebe8   (very light rose)
primary-dark:   #9b6259

accent:         #7ea5c2   (soft blue — 차분한 대비색)

success:        #7ab87a   (soft green — 좋은 피부 날)
warning:        #c9a84c   (soft gold)
danger:         #c27a7a   (soft red — 나쁜 피부 날)

score-1:        #e8a0a0   (최악 — 붉은 톤)
score-2:        #e8c4a0   (별로 — 주황 톤)
score-3:        #e8dca0   (보통 — 노란 톤)
score-4:        #a0d4a0   (좋아 — 연두 톤)
score-5:        #7ac27a   (꿀피부 — 초록 톤)

border:         #ece4df
```

### Tailwind 커스텀 설정

```javascript
// tailwind.config 또는 inline style로 적용
const skinDiaryColors = {
  'sd-bg': '#fdf8f4',
  'sd-surface': '#ffffff',
  'sd-text': '#3d2c2c',
  'sd-text-secondary': '#8b7e7e',
  'sd-text-tertiary': '#b5aaaa',
  'sd-primary': '#c2847a',
  'sd-primary-light': '#f5ebe8',
  'sd-primary-dark': '#9b6259',
  'sd-accent': '#7ea5c2',
  'sd-success': '#7ab87a',
  'sd-warning': '#c9a84c',
  'sd-danger': '#c27a7a',
  'sd-border': '#ece4df',
};
```

---

## 타이포그래피

이 앱만의 차별점: **세리프 서체 헤딩**. 기존 앱 중 세리프를 쓴 앱이 없다.

### 폰트 조합

| 용도 | 폰트 | 굵기 | 근거 |
|------|------|------|------|
| 한국어 헤딩 | **Gowun Batang** (Google Fonts) | 400, 700 | 우아한 세리프, 일기장/저널 느낌 |
| 한국어 본문 | **SUIT Variable** | 300, 400, 500, 600 | 가독성 좋은 산세리프, Pretendard와 다름 |
| 영문/숫자 | **Crimson Pro** (Google Fonts) | 400, 500, 600 | Gowun Batang과 어울리는 세리프 |

### 폰트 로딩

```html
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Crimson+Pro:wght@400;500;600&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css" rel="stylesheet">
```

### 텍스트 스타일 위계

```css
/* H1 — 페이지 제목 */
.h1 {
  font-family: 'Gowun Batang', serif;
  font-weight: 700;
  font-size: 1.5rem;    /* 24px */
  line-height: 1.4;
  color: #3d2c2c;
}

/* H2 — 섹션 제목 */
.h2 {
  font-family: 'Gowun Batang', serif;
  font-weight: 400;
  font-size: 1.125rem;  /* 18px */
  line-height: 1.5;
  color: #3d2c2c;
}

/* H3 — 카드 제목 */
.h3 {
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 500;
  font-size: 1rem;      /* 16px */
  line-height: 1.5;
  color: #3d2c2c;
}

/* Body */
.body {
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 400;
  font-size: 0.9375rem; /* 15px */
  line-height: 1.6;
  color: #3d2c2c;
}

/* Caption */
.caption {
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 300;
  font-size: 0.8125rem; /* 13px */
  line-height: 1.5;
  color: #8b7e7e;
}

/* Numbers (scores, stats) */
.number {
  font-family: 'Crimson Pro', serif;
  font-weight: 600;
  font-size: 1.25rem;   /* 20px */
  color: #3d2c2c;
}
```

---

## 레이아웃

- **좌측 정렬 기본** (R14)
- 단일 컬럼 레이아웃 — 일기장처럼 세로로 읽는 구조
- 카드 배경: `#fdf8f4` (warm cream) 또는 `#f5ebe8` (primary-light), NOT white-on-white
- 카드 네스팅 금지 (R15)
- 최대 너비: 430px (모바일 우선)
- 좌우 패딩: 20px
- 섹션 간 간격: 24px
- 카드 내 패딩: 20px

---

## Border Radius

요소마다 의도적으로 다른 radius를 사용한다 (R10).

| 요소 | Radius | Tailwind |
|------|--------|----------|
| 기록 카드 (Night/Morning Log) | 16px | `rounded-2xl` |
| 키워드/변수 칩 | 9999px (pill) | `rounded-full` |
| 버튼 | 12px | `rounded-xl` |
| 캘린더 셀 | 8px | `rounded-lg` |
| 입력 필드 | 8px | `rounded-lg` |
| 인사이트 카드 | 12px | `rounded-xl` |

---

## 버튼 (R16)

3단계 위계를 명확히 구분한다.

### Primary

```html
<button class="bg-[#c2847a] text-white rounded-xl px-5 py-2.5 font-medium">
  기록하기
</button>
```

### Secondary

```html
<button class="border border-[#c2847a] text-[#c2847a] rounded-xl px-5 py-2.5 font-medium">
  수정하기
</button>
```

### Tertiary

```html
<button class="text-[#c2847a] underline text-sm">
  건너뛰기
</button>
```

---

## 칩 (Chips)

키워드와 변수 선택에 사용.

### 미선택 상태

```html
<button class="rounded-full px-3.5 py-1.5 text-sm border border-[#ece4df] text-[#8b7e7e] bg-white">
  촉촉
</button>
```

### 선택 상태

```html
<button class="rounded-full px-3.5 py-1.5 text-sm border border-[#c2847a] text-white bg-[#c2847a]">
  촉촉
</button>
```

선택 시 애니메이션: **없음** (즉시 배경색 변경). 과도한 트랜지션은 일기장 느낌을 해친다.

---

## 점수 선택기 (Score Selector)

1~5 원형 버튼. 선택 시 `scale(1.05)` + score 색상 배경 적용 (100ms transition).

```
미선택: border-[#ece4df] bg-white text-[#8b7e7e] w-12 h-12 rounded-full
선택됨: bg-[score-N] text-white w-12 h-12 rounded-full scale-105
```

라벨은 버튼 아래에 caption 텍스트로 표시: 최악, 별로, 보통, 좋아, 꿀피부.

---

## 애니메이션 (R4)

최소한의 애니메이션만 사용. fadeInUp 금지.

| 상황 | 애니메이션 | 지속 시간 |
|------|-----------|----------|
| 화면 전환 | opacity 0 → 1 | 200ms |
| 칩 선택 | 즉시 (애니메이션 없음) | 0ms |
| 점수 선택 | scale(1.05) | 100ms |
| 카드 표시 | 즉시 (애니메이션 없음) | 0ms |
| 모달 진입 | opacity 0 → 1 | 150ms |
| 토스트 메시지 | 하단에서 슬라이드 | 200ms |

대부분의 요소는 **즉시 표시**한다.

---

## 아이콘 (R11, R13)

커스텀 인라인 SVG만 사용. 이모지 사용 금지.

### 아이콘 목록

| 이름 | 용도 | 스타일 |
|------|------|--------|
| Moon | 밤 기록 | 초승달, stroke 1.5px, 20x20 |
| Sun | 아침 기록 | 원 + 방사선, stroke 1.5px, 20x20 |
| Droplet | 수분/촉촉 | 물방울, stroke 1.5px, 18x18 |
| Leaf | 제품/스킨케어 | 잎사귀, stroke 1.5px, 18x18 |
| Calendar | 캘린더 탭 | 달력, stroke 1.5px, 20x20 |
| Chart | 인사이트 탭 | 막대 그래프, stroke 1.5px, 20x20 |
| Star | 점수/평점 | 별, stroke 1.5px, 18x18 |
| Settings | 설정/제품관리 | 톱니바퀴, stroke 1.5px, 20x20 |
| Plus | 추가 | +, stroke 2px, 16x16 |
| ChevronLeft | 뒤로가기 | <, stroke 2px, 20x20 |
| ChevronRight | 다음 | >, stroke 2px, 20x20 |

모든 아이콘: `stroke="#3d2c2c"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
활성 상태: `stroke="#c2847a"`.

---

## 네비게이션 (R5)

하단 3-탭, 단 다른 앱과 차별화된 디자인: **텍스트 전용 + 언더라인 인디케이터**.

```
┌────────────────────────────┐
│    홈      캘린더     인사이트  │
│   ────                      │  ← active tab: primary color underline
└────────────────────────────┘
```

### 스펙

```css
.tab-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 0 calc(12px + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1px solid #ece4df;
}

.tab-item {
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 400;
  font-size: 0.9375rem;
  color: #b5aaaa;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.tab-item.active {
  color: #c2847a;
  font-weight: 500;
  border-bottom: 2px solid #c2847a;
}
```

아이콘 없이 텍스트만으로 탭을 구성하는 것은 이 앱의 일기장/미니멀 콘셉트에 맞는 의도적 선택이다.

---

## 캘린더 셀

```
┌───────┐
│  21   │  ← Crimson Pro, 15px
│  ●●●  │  ← score 색상 도트 (있으면)
└───────┘

기록 있음: 배경 score-N 색상 10% opacity, 하단에 작은 도트
기록 없음: 배경 투명
오늘: border 2px solid #c2847a
```

---

## 카드 스타일

### 기록 카드 (Night Log / Morning Log)

```css
.log-card {
  background: #f5ebe8;       /* primary-light */
  border-radius: 16px;
  padding: 20px;
  border: none;              /* border 없이 배경색으로 구분 */
}
```

### 인사이트 카드

```css
.insight-card {
  background: #ffffff;
  border: 1px solid #ece4df;
  border-radius: 12px;
  padding: 16px;
}
```

### 영향도 표시

```
양수 (좋은 영향): text-[#7ab87a], 앞에 ▲ 표시
음수 (나쁜 영향): text-[#c27a7a], 앞에 ▼ 표시
영향 없음 (±0.1 이내): text-[#8b7e7e], — 표시
```

---

## 반응형

```css
/* 모바일 기본 */
.app-container {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: #fdf8f4;
}

/* 데스크톱에서는 중앙 정렬 + 양옆 여백 */
@media (min-width: 431px) {
  body {
    background: #f0ebe7;
  }
}
```

---

## 그라디언트 사용

이 앱에서 그라디언트는 **사용하지 않는다**. 단색 배경만으로 따뜻하고 깨끗한 느낌을 유지한다.

---

## 다크 모드

이 앱은 **라이트 모드 전용**이다 (R9). 일기장의 따뜻한 크림색 배경이 핵심 아이덴티티이므로 다크 모드는 제공하지 않는다.

---

## DESIGN_RULES.md 17-Rule Checklist

```
[✓] R1.  기존 앱과 다른 색상 팔레트 — dusty rose/terracotta (#c2847a) 계열, 기존에 없음
[✓] R2.  그라디언트 텍스트 미사용 — 모든 텍스트 단색
[✓] R3.  135deg 그라디언트 남용 없음 — 그라디언트 자체를 사용하지 않음
[✓] R4.  fadeInUp 미사용 — opacity fade + 즉시 표시 위주
[✓] R5.  네비게이션 차별화 — 텍스트 전용 탭 + 언더라인 (아이콘 없음)
[✓] R6.  backdrop-blur 미사용 — 불필요한 곳에 사용하지 않음
[✓] R7.  장식 파티클/오브 없음 — 화이트 스페이스로 여백 활용
[✓] R8.  고유 폰트 조합 — Gowun Batang(세리프) + SUIT Variable + Crimson Pro (최초 세리프 헤딩)
[✓] R9.  라이트 모드 — warm cream 배경의 라이트 전용
[✓] R10. 다양한 border-radius — 카드 16px, 칩 pill, 버튼 12px, 셀 8px
[✓] R11. 커스텀 SVG 아이콘 — Material Symbols 미사용, 인라인 SVG 통일
[✓] R12. font-extrabold 도배 없음 — H1만 700, H2는 400, H3는 500, body는 400, caption은 300
[✓] R13. 이모지 미사용 — 모든 아이콘은 SVG로 구현
[✓] R14. 좌측 정렬 기본 — 일기장 레이아웃, 중앙 정렬 최소화
[✓] R15. 카드 네스팅 없음 — 단일 레벨 카드만 사용
[✓] R16. 버튼 위계 구분 — Primary(솔리드), Secondary(아웃라인), Tertiary(텍스트 언더라인)
[✓] R17. 로딩 화면 해당 없음 — localStorage 기반으로 로딩 시간 거의 없음, 필요 시 프로그레스 바 사용
```
