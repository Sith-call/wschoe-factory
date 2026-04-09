# Argue Gym — Design System

> "혼자 하는 토론 연습장"의 디자인 언어. 차분한 독서실 + 노트북 위의 노트 같은 분위기.
> 라이트 모드 전용. 1 액센트(잉크 인디고). 카드 네스팅 금지. 좌측 정렬 기본.

---

## 1. 아이덴티티

- **은유**: "접힌 노트 위에 만년필로 적어내려간 논쟁 일지"
- **무드**: 서재의 종이, 잉크, 미세한 크래프트 질감. 게임감 배제.
- **대비**: 크림 종이 배경 vs 깊은 잉크 인디고 텍스트/버튼 1색.

---

## 2. 색상 팔레트 (hex)

라이트 모드 전용. 기존 앱(`#fbbc00`, `#111417`, `#E8651A` 탠저린, `#0D9488` 틸, `#2563eb` 블루)과 겹치지 않도록 **잉크 인디고 + 따뜻한 페이퍼** 방향.

```
--ink           #2E2A5A   깊은 잉크 인디고 — primary, 본문 텍스트, solid 버튼
--ink-soft      #4B4888   hover/pressed
--ink-faint     #EEEBFB   primary tint — 프로그레스 트랙, 선택된 칩 배경
--paper         #F7F2E8   페이지 배경 — 따뜻한 크림 종이
--paper-edge    #EDE6D2   섹션 구분, 프로그레스 배경
--surface       #FFFFFF   카드 1레이어 (네스팅 금지)
--rule          #D9D1BD   얇은 구분선 (종이 접힌 선 느낌)
--text          #1F1B3D   본문 (pure black 금지)
--text-muted    #6B6788   보조 텍스트
--text-faint    #9A96B1   placeholder, 비활성
```

근거 유형 4종 (border-left 4px 액센트 — 배경이 아닌 좌측 바로만 구분):

```
--type-data     #1E6091   데이터    (짙은 슬레이트 블루 — 사실/통계)
--type-emotion  #B24A6B   감정      (더스티 로즈 — 공감/두려움)
--type-principle #7A5C1E  원칙      (올리브 골드 — 규범/정의)
--type-case     #2F6B4F   사례      (세이지 그린 — 경험/일화)
```

시스템 컬러:

```
--success  #2F6B4F   저장 토스트
--danger   #A8322B   에러 (거의 안 씀)
```

---

## 3. 타이포그래피

**폰트 스택** (기존 앱은 Plus Jakarta/Manrope/Inter/DM Sans 사용 → 겹치지 않도록):

```
한국어: 'IBM Plex Sans KR', sans-serif
영문:   'IBM Plex Serif', Georgia, serif  ← 숫자/지표/리포트용 세리프
UI 수치: 'IBM Plex Mono', monospace       ← 글자수 카운터, 1/3 진행
```

**이유**: IBM Plex는 문서/논문 느낌이 강해 "논쟁 일지" 은유와 맞고, 기존 앱의 Jakarta/Inter 루틴과 분명히 다르다. Serif를 **숫자 지표에만** 쓰는 혼성 위계가 이 앱의 시그니처.

**스케일** (모바일 375 기준):

```
display    28 / 34   Plex Serif, weight 500   — 리포트 숫자만
h1         22 / 30   Plex Sans KR, weight 600 — 화면 제목
h2         17 / 24   Plex Sans KR, weight 600 — 카드 제목, 섹션
body       15 / 24   Plex Sans KR, weight 400 — 본문, 반론 카드 본문
small      13 / 20   Plex Sans KR, weight 400 — 메타, 보조
caption    11 / 16   Plex Mono,    weight 500 — 배지, 카운터, 1/3 진행
```

**규칙**:
- H1은 `weight 600` 까지만. `extrabold(800)` 금지 (R12).
- 그라디언트 텍스트 금지 (R2).
- 모든 제목 좌측 정렬. 중앙 정렬은 리포트 display 숫자만 허용 (R14 예외).

---

## 4. 스페이싱 & 레이아웃

8px 기반.

```
--s-1   4
--s-2   8
--s-3   12
--s-4   16   기본 인셋
--s-5   20
--s-6   24   섹션 여백
--s-8   32
--s-10  40
--s-12  48
```

- 화면 좌우 인셋: 20px
- 카드 내부 패딩: 20px
- 섹션 간격: 32px
- 컨테이너 max-width: 420px (모바일 프리뷰용)

**Radius**:
```
--r-card    2px    카드는 거의 종이처럼 (sharp)
--r-chip    999px  카테고리 칩은 pill
--r-button  6px    버튼은 살짝만
--r-badge   4px    근거 유형 배지
```
→ **의도적으로 sharp 코너 위주.** 모든 곳을 `rounded-2xl`로 바르는 AI 루틴 회피 (R10).

---

## 5. 컴포넌트 원칙

### 카드 (반론 카드)
- 배경 `--surface` 흰 종이, `--r-card 2px`, 얇은 `1px solid --rule` 테두리.
- **border-left: 4px solid {근거 유형 색}** — 유일한 컬러 액센트 위치.
- 카드 네스팅 금지. 카드 내부는 flat — 본문 + 배지 + 메타만.

### 버튼 위계
- **Primary**: `background: --ink`, `color: white`, `font-weight: 500`, 44px 높이, `--r-button`. 하단 1px `--ink-soft` 그림자로 "잉크 눌림" 느낌.
- **Secondary**: `background: transparent`, `border: 1.5px solid --ink`, `color: --ink`. 같은 크기.
- **Tertiary (text link)**: `color: --ink`, underline on hover.

### 칩 (카테고리)
- pill, `padding: 8px 14px`, `border: 1px solid --rule`, 비활성은 투명.
- 선택: `background: --ink-faint`, `border-color: --ink`, `color: --ink`, `font-weight: 500`.

### 배지 (근거 유형)
- `--r-badge`, `padding: 2px 8px`, `Plex Mono 11px uppercase`, 배경은 해당 유형 색 `+ 12% lightness tint`, 텍스트는 해당 유형 색.
- 카드 우상단 인라인 배치.

### 프로그레스 (S3 상단)
- Plex Mono "01 / 03" 좌측 + 우측 세그먼트 3개 (12px × 4px bars).
- 완료: `--ink`, 현재: `--ink-soft`, 대기: `--paper-edge`.

### Textarea
- `background: --surface`, `border: 1px solid --rule`, focus `--ink` 2px underline (box-border 아님, 아래줄만).
- placeholder `--text-faint`, `Plex Sans KR italic`.

### Toast (저장 피드백)
- 하단 중앙, `background: --ink`, `color: white`, 16px 체크 SVG + "세션을 기록했습니다".
- 슬라이드-업 200ms, 1.6s 체류, 페이드 아웃. (R18/19: 저장 피드백 필수)

---

## 6. 애니메이션

- **기본은 즉시 표시** (R4). 대부분 요소 entrance 없음.
- 허용:
  1. **좌→우 스태거 슬라이드** (반론 카드 3장): `translateX(-12px) → 0`, opacity 0→1, 120ms 간격, 220ms duration.
  2. **종이 넘김 스케일** (S3 카드 전환): `scale(0.98) → 1` + opacity, 180ms.
  3. **토스트 슬라이드-업**.
- `fadeInUp` (translateY) **금지**. translateY 어센트 없음.

---

## 7. 아이콘

- **Lucide SVG만 사용** (1.5 stroke, 20px 기본). Material Symbols / 이모지 금지 (R11/R13).
- 뒤로가기: `arrow-left`, 저장: `bookmark`, 다시: `refresh-cw`, 스킵: `skip-forward`, 리포트: `bar-chart-2`, 로그: `notebook-pen`.

---

## 8. 네비게이션

- **바텀 탭바 금지** (선형 5화면 플로우). 
- 모든 화면 상단 `height 52px` 헤더: 좌측 뒤로가기 아이콘(44×44 터치 타겟), 중앙 화면 제목(h2), 우측 컨텍스트 액션 1개.
- S3 헤더에는 제목 대신 프로그레스 "01 / 03".

---

## 9. 금지 사항 (이 앱의 블랙리스트)

1. 다크 모드 변형 금지 — 라이트 only.
2. `#fbbc00`, `#111417`, `#E8651A`, `#0D9488` 사용 금지 (기존 앱과 충돌).
3. 그라디언트 텍스트, `linear-gradient(135deg)` 금지.
4. `fadeInUp` / `translateY` entrance 금지.
5. 바텀 탭바 금지.
6. 카드 네스팅 금지 — 카드 안에 카드 넣지 않기.
7. 이모지 아이콘 금지.
8. 중앙 정렬 금지 (예외: 리포트 display 숫자).
9. `rounded-2xl` 일괄 금지 — sharp 코너 기본.
10. `font-extrabold` 금지 — 600까지만.
11. 장식 파티클/오브/blur orb 금지.
12. `backdrop-blur` 금지 (의미 없음).
13. 스피너 + 재미 텍스트 로딩 금지 — 이 앱은 로딩 화면 자체가 없다.
14. "저장됨" 피드백 없는 저장 버튼 금지.
15. 44px 미만 터치 타겟 금지.

---

## 10. 체크리스트 적용 결과

| DESIGN_RULES 항목 | 대응 |
|---|---|
| R1 고유 팔레트 | 잉크 인디고 + 페이퍼 크림 (신규) |
| R2 그라디언트 텍스트 | 사용 안 함 |
| R4 fadeInUp | 좌→우 슬라이드 스태거 + scale |
| R5 네비게이션 | 상단 뒤로가기 only, 탭바 없음 |
| R8 폰트 | IBM Plex Sans KR + Serif + Mono (신규) |
| R9 라이트 모드 | ✅ 라이트 전용 |
| R10 radius | 2/4/6/999 혼합 |
| R11 아이콘 | Lucide SVG only |
| R13 이모지 | 사용 안 함 |
| R14 좌측 정렬 | 기본 좌측 (리포트 숫자만 예외) |
| R15 카드 네스팅 | border-left 4px로 구분 |
| R16 버튼 위계 | solid vs outline |
| R18 피드백 | 저장 토스트 |
| R21 터치 타겟 | 44×44 보장 |
