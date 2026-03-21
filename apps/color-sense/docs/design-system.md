# Design System — Color Sense Test (컬러 감각 테스트)

> 색 지각 능력을 테스트하는 게임 앱.
> 핵심 원칙: **UI는 투명해야 한다.** 게임 컬러가 주인공이고, UI 크롬은 조용해야 한다.

---

## 1. Color Palette (R1 — 고유 팔레트)

기존 앱 사용 색상: amber, indigo, crimson, rose, teal, emerald.
이 앱은 **violet 액센트 + neutral monochrome** 를 사용한다.

게임 특성상 UI가 컬러풀하면 안 된다. 게임 타일의 미묘한 색 차이를 판별해야 하므로
UI 크롬은 무채색(zinc 계열)으로 최대한 비켜야 한다.

```
Token                  Value        Usage
─────────────────────  ─────────    ──────────────────────────
background             #fafafa      앱 전체 배경 (라이트, neutral white)
surface                #ffffff      카드, 모달 배경
text-primary           #18181b      본문 텍스트 (zinc-900)
text-secondary         #71717a      보조 텍스트 (zinc-500)
text-tertiary          #a1a1aa      비활성/힌트 (zinc-400)
primary                #7c3aed      유일한 액센트 (violet-600)
primary-light          #ede9fe      primary 배경/하이라이트 (violet-100)
border                 #e4e4e7      구분선, 카드 테두리 (zinc-200)
success                #22c55e      정답 피드백 (green-500)
danger                 #ef4444      오답 피드백 (red-500)
game-bg                #1e1b2e      게임 화면 배경 (deep purple-black)
```

### 왜 이 팔레트인가?
- **무채색 우선**: 게임 타일의 색상이 유일한 컬러 정보가 되어야 한다.
- **game-bg는 dark**: 컬러 타일이 밝은 배경보다 어두운 배경에서 더 선명하게 보인다.
- **violet 액센트**: 6개 기존 앱과 겹치지 않으며, 테스트/게임의 신뢰감을 준다.

---

## 2. Typography (R8 — 고유 폰트 조합)

금지 폰트: Plus Jakarta Sans, Manrope, Pretendard, IBM Plex Sans KR, Spoqa Han Sans, Noto Sans KR.

```
용도         폰트                           Fallback           Weight
───────────  ─────────────────────────────  ─────────────────  ──────────
한국어       Wanted Sans Variable (CDN)     SUIT Variable      400, 600, 700
영문/숫자    Archivo (Google Fonts)         system-ui          400, 500, 600, 700
```

### 폰트 웨이트 위계 (R12)
```
H1 (메인 점수, 결과 제목)   → bold (700)
H2 (섹션 제목)              → semibold (600)
H3 (소제목, 라벨)           → medium (500)
본문/설명                    → regular (400)
```

- H1에만 bold 허용. 나머지는 medium~semibold로 제한.
- 숫자(점수, 타이머)에는 Archivo의 tabular-nums 사용.

### CDN
```html
<!-- Archivo -->
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Wanted Sans Variable (CDN 예시) -->
<link href="https://cdn.jsdelivr.net/gh/nicepayments/wanted-sans@latest/packages/wanted-sans-variable/WantedSansVariable.min.css" rel="stylesheet">
```

---

## 3. Layout (R14 — 좌측 정렬 기본)

| 화면 | 정렬 | 이유 |
|------|------|------|
| 인트로/랜딩 | 중앙 정렬 | 랜딩 페이지 예외 허용 |
| 게임 플레이 | 중앙 그리드 | 타일 그리드는 구조적으로 중앙 필수 |
| 결과 화면 | **좌측 정렬** (점수 숫자만 중앙) | 통계/설명은 읽기 편한 좌측 정렬 |
| 히스토리 | **좌측 정렬** 리스트 | 데이터 나열은 좌측이 자연스럽다 |

### 화면 최대 너비
```
max-width: 480px (모바일 최적화)
padding-x: 20px
```

---

## 4. Border Radius (R10 — 의도적 혼합)

```
요소            Radius          Token
──────────────  ──────────────  ───────────
게임 타일       8px (lg)        rounded-lg
버튼            6px (md)        rounded-md      ← pill/full 금지
결과 카드       12px (xl)       rounded-xl
점수 뱃지       0px (none)      rounded-none    ← sharp로 대비
인풋/셀렉트     6px (md)        rounded-md
```

- 모든 요소에 동일 radius 금지. sharp(0px)를 의도적으로 섞어서 리듬감을 준다.
- 게임 타일은 약간의 radius로 부드럽되, 너무 둥글면 색 면적이 줄어 판별이 어려워진다.

---

## 5. Buttons (R16 — 3단계 위계)

```
등급         스타일                                     용도
───────────  ─────────────────────────────────────────  ─────────────────
Primary      bg-[#7c3aed] text-white rounded-md         게임 시작, 다음 레벨
Secondary    border border-zinc-300 text-zinc-700        재시도, 히스토리 보기
Tertiary     text-[#7c3aed] underline                   공유, 설정, 부가 링크
```

- Primary와 Secondary의 시각적 차이가 명확해야 한다.
- 버튼 크기: `px-5 py-2.5` (기본), `px-4 py-2` (소형).
- hover: Primary는 violet-700, Secondary는 bg-zinc-50.

---

## 6. Animations (R4, R17 — 최소한, 의미 있는 것만)

### 금지
- fadeInUp (translateY 기반 entrance)
- 파티클, 떠다니는 오브, 별 배경
- 모든 요소에 entrance animation

### 허용 패턴

| 상황 | 애니메이션 | Duration | Easing |
|------|-----------|----------|--------|
| 게임 타일 등장 | **없음** (즉시 표시) | — | — |
| 정답 탭 | green border flash | 100ms | ease-out |
| 오답 탭 | red horizontal shake | 200ms | ease-out |
| 레벨 전환 | opacity crossfade | 200ms | ease-in-out |
| 결과 점수 | number counter (0→최종) | 800ms | ease-out |
| 화면 전환 | simple opacity fade | 150ms | ease-in-out |

### 정답/오답 피드백 CSS
```css
/* 정답: 짧은 green border flash */
@keyframes correct-flash {
  0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
  100% { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0); }
}
.tile-correct {
  animation: correct-flash 100ms ease-out;
}

/* 오답: 짧은 horizontal shake */
@keyframes wrong-shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}
.tile-wrong {
  animation: wrong-shake 200ms ease-out;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
}
```

---

## 7. Icons (R11, R13 — 커스텀 SVG, 이모지 금지)

아이콘 세트: **커스텀 inline SVG** (단일 세트로 통일).
이모지를 아이콘/장식으로 사용하지 않는다.

### 필요 아이콘 목록
```
아이콘      용도               스타일
────────    ─────────────────  ────────────────
Play        게임 시작 버튼     stroke, 24x24
Trophy      결과/랭킹          stroke, 24x24
Share       결과 공유           stroke, 20x20
Back        뒤로가기            stroke, 20x20
Clock       타이머 표시          stroke, 16x16
Eye         색 지각/관찰        stroke, 24x24
Retry       재시도              stroke, 20x20
History     기록 보기           stroke, 20x20
```

- stroke-width: 1.5px (통일)
- color: currentColor (부모 텍스트 색상 상속)
- 아이콘에 채우기(fill) 사용 금지 — stroke only.

---

## 8. Navigation (R5 — 앱 구조에 맞는 선형 플로우)

이 앱은 **선형 플로우** 구조다:
```
인트로 → 게임 플레이 → 결과 → (히스토리)
```

- 바텀 탭바 없음.
- 네비게이션: 상단 좌측 뒤로가기 버튼 + 게임 내 프로그레스 표시.
- 히스토리는 인트로 화면에서 텍스트 링크로 진입.

---

## 9. Game Screen — 특수 규칙

게임 화면은 앱의 핵심이다. 모든 디자인 결정이 **색 판별을 방해하지 않는 것**에 집중한다.

### 배경
- `background: #1e1b2e` (deep purple-black)
- 게임 화면만 dark. 나머지 화면은 light (#fafafa).

### 타일 그리드
```css
.game-grid {
  display: grid;
  gap: 4px;                /* 타이트한 간격 — 실제 색각 검사처럼 */
  padding: 0;
}

/* 레벨별 그리드 크기 */
.grid-2x2 { grid-template-columns: repeat(2, 1fr); }
.grid-3x3 { grid-template-columns: repeat(3, 1fr); }
.grid-4x4 { grid-template-columns: repeat(4, 1fr); }
.grid-5x5 { grid-template-columns: repeat(5, 1fr); }
```

### 타일 스타일
```css
.game-tile {
  aspect-ratio: 1;
  border-radius: 8px;
  border: none;              /* 테두리 없음 — 색상만 보여야 한다 */
  cursor: pointer;
  transition: transform 50ms ease;
}
.game-tile:active {
  transform: scale(0.95);   /* 탭 피드백 */
}
```

### 타이머
- 위치: 상단 우측, 작게.
- 스타일: `text-zinc-400 text-sm font-mono` (Archivo tabular-nums).
- 주의를 끌면 안 된다.

### 레벨 표시
- 위치: 상단 좌측.
- 스타일: `text-zinc-400 text-sm`.
- 형식: `Lv.3` 또는 `3 / 20`.

---

## 10. 화면별 레이아웃

### 인트로 화면
```
[중앙 정렬]
Eye 아이콘 (SVG, 48px, violet-600)
"컬러 감각 테스트" (H1, bold, zinc-900)
"다른 색 하나를 찾아보세요" (body, zinc-500)

[Primary 버튼] 시작하기
[Tertiary 링크] 기록 보기
```

### 게임 화면
```
[dark bg: #1e1b2e]
상단: Lv.3 (좌측)  |  12.4s (우측, Clock 아이콘)
중앙: 타일 그리드 (gap 4px, no border)
하단: 없음 (깔끔하게)
```

### 결과 화면
```
[light bg: #fafafa]
Trophy 아이콘 (violet-600)
점수: "85" (H1, 중앙, Archivo bold, 48px, violet-600, 카운터 애니메이션)
라벨: "/ 100" (text-secondary)

[좌측 정렬 통계]
정확도    92%
평균 반응    1.2초
클리어 레벨    Lv.15

[Primary 버튼] 다시 도전
[Secondary 버튼] 결과 공유
```

### 히스토리 화면
```
[light bg: #fafafa]
Back 아이콘 (좌측 상단)
"기록" (H2, 좌측, semibold)

[좌측 정렬 리스트]
border-bottom 구분선 (zinc-200)
날짜 | 점수 | 레벨 (좌측 정렬, 행마다)
```

---

## 11. Spacing Scale

```
Token    Value    Usage
───────  ──────   ─────────────
xs       4px      타일 gap, 인라인 간격
sm       8px      아이콘-텍스트 간격
md       16px     섹션 내부 여백
lg       24px     섹션 간 간격
xl       32px     화면 상하 패딩
2xl      48px     히어로 영역 여백
```

---

## 12. 그라디언트 사용 (R3)

이 앱에서는 **그라디언트를 사용하지 않는다.**
- 게임 특성상 단색(solid color)만 사용해야 색 판별이 정확하다.
- 버튼, 배경, 카드 전부 단색.
- `-webkit-background-clip: text` 금지 (R2).

---

## 13. backdrop-blur (R6)

- 사용하지 않는다. 0곳.
- 이 앱에는 오버레이/모달이 거의 없고, 있더라도 solid bg로 처리한다.

---

## 14. 장식 요소 (R7)

- 배경 파티클, 떠다니는 오브, 별 없음.
- 빈 공간(화이트 스페이스)을 적극 활용.
- 유일한 장식: 결과 화면에서 높은 점수 시 간단한 confetti (기능적 의미 있음).

---

## 15. 카드 (R15 — 네스팅 금지)

- 카드 안에 카드를 넣지 않는다.
- 통계 항목은 카드 없이 border-bottom 구분선으로 나열.
- 결과 카드는 1단계만 (surface 위에 바로 콘텐츠).

---

## 16. 로딩 (R17 — 목적감)

게임 앱이므로 로딩이 거의 없다. 만약 필요하다면:
- 스피너 + 재미 텍스트 로테이션 금지.
- 단순 프로그레스 바 (violet-600) + "레벨 준비 중..." 텍스트.

---

## 17. 다크/라이트 테마 (R9)

- 기본 테마: **라이트** (#fafafa 배경).
- 게임 화면만 dark (#1e1b2e) — 기능적 이유 (타일 색 대비).
- 앱 전체가 dark가 아니므로 R9 충족.

---

## DESIGN_RULES.md 체크리스트 검증

```
[x] 기존 앱과 다른 색상 팔레트인가?
    → violet-600 + zinc monochrome. 기존 amber/indigo/crimson/rose/teal/emerald과 겹치지 않음.

[x] 기존 앱과 다른 폰트 조합인가?
    → Wanted Sans Variable + Archivo. 기존 앱의 폰트 조합과 다름.

[x] 그라디언트 텍스트를 안 쓰는가?
    → 그라디언트 자체를 사용하지 않음. -webkit-background-clip: text 금지.

[x] 네비게이션 패턴이 앱 구조에 맞는가?
    → 선형 플로우 (인트로 → 게임 → 결과). 바텀 탭바 없음.

[x] fadeInUp 외에 다른 (또는 없는) 애니메이션을 쓰는가?
    → 게임 타일: 즉시 표시. 정답/오답: flash/shake. 결과: counter. fadeInUp 없음.

[x] 불필요한 장식 요소(파티클, 오브)가 없는가?
    → 없음. 화이트 스페이스 활용.

[x] backdrop-blur를 의미 있는 곳에만 쓰는가?
    → 사용하지 않음 (0곳).

[x] 다크/라이트 테마 비율이 균형 잡혀 있는가?
    → 기본 라이트. 게임 화면만 dark (기능적 이유).

[x] 이모지를 아이콘/장식으로 쓰지 않았는가?
    → 커스텀 inline SVG만 사용. 이모지 금지.

[x] 콘텐츠가 좌측 정렬 기본인가? (중앙 정렬 남용 X)
    → 결과 통계, 히스토리 모두 좌측 정렬. 중앙은 인트로, 게임 그리드, 점수 숫자만.

[x] 카드 안에 카드를 넣지 않았는가?
    → 1단계 카드만. 통계는 구분선으로 나열.

[x] Primary/Secondary 버튼 스타일이 구분되는가?
    → Primary: solid violet. Secondary: outlined zinc. Tertiary: text link.

[x] 로딩 화면이 목적감 있는가? (스피너+텍스트 X)
    → 프로그레스 바 + 상태 텍스트. 스피너 로테이션 금지.
```

**17개 규칙 전부 충족.**
