# TRD: 컬러 감각 테스트 (Color Sense Test)

> 색상 차이를 구별하는 능력을 20단계로 측정하는 컬러 인지 게임

---

## Overview

격자 타일 중 미세하게 다른 색 하나를 찾아내는 게임. 레벨이 올라갈수록 색 차이가 줄고 격자가 커진다. 20라운드 후 점수와 상위 퍼센타일을 보여준다.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite |
| Styling | Tailwind CSS (CDN) |
| State | React useState/useReducer |
| Storage | localStorage |
| External deps | 없음 |
| Dev server port | 5185 |

---

## Data Model

```typescript
interface GameRound {
  level: number;        // 1-20
  gridSize: number;     // 2-6
  baseColor: string;    // hex
  diffColor: string;    // hex
  diffIndex: number;    // which tile is different
  colorDiff: number;    // how different (0-100, lower = harder)
  foundInMs: number;    // reaction time
  success: boolean;
}

interface GameResult {
  id: string;
  rounds: GameRound[];
  score: number;
  maxLevel: number;
  avgReactionMs: number;
  percentile: number;   // simulated top X%
  playedAt: string;
}
```

### localStorage Schema

| Key | Type | Description |
|-----|------|-------------|
| `color-sense-results` | `GameResult[]` | 플레이 이력 (최대 50건) |
| `color-sense-best` | `number` | 역대 최고 점수 |

---

## Color Generation Algorithm

### Base Color

1. 랜덤 hue 생성: `hue = Math.random() * 360`
2. 채도/명도 범위 고정: `saturation = 60-80%`, `lightness = 45-65%`
3. Base color: `hsl(hue, saturation, lightness)`

### Different Tile Color

1. 레벨에 따른 차이값 계산:
   ```
   diff = max(3, 40 - (level * 2))
   ```
2. hue를 `diff`만큼 이동: `diffHue = hue + diff` (또는 `-diff`, 랜덤)
3. Different color: `hsl(diffHue, saturation, lightness)`

### Difficulty Curve

| Level | diff | 체감 난이도 |
|-------|------|------------|
| 1 | 38 | 매우 쉬움 — 완전히 다른 색 |
| 5 | 30 | 쉬움 |
| 10 | 20 | 보통 — 집중 필요 |
| 15 | 10 | 어려움 — 미세한 차이 |
| 18 | 4 | 극한 |
| 20 | 3 | 거의 불가능 |

---

## Grid Progression

| Level Range | Grid | Tile Count |
|-------------|------|------------|
| 1-4 | 2x2 | 4 |
| 5-8 | 3x3 | 9 |
| 9-12 | 4x4 | 16 |
| 13-16 | 5x5 | 25 |
| 17-20 | 6x6 | 36 |

`diffIndex`는 `0`부터 `tileCount - 1` 사이 랜덤 배정.

---

## Scoring

### Round Score

```
roundScore = max(0, (10 - reactionSeconds) * level * 10)
```

- 10초 이상 걸리면 0점
- 빠를수록, 높은 레벨일수록 고득점
- 실패한 라운드: 0점

### Total Score

```
totalScore = sum(roundScores)
```

### Theoretical Max

레벨 20까지 모두 1초 이내 클리어 시: `sum((10-1) * level * 10)` for level 1-20 = 약 18,900점

### Percentile Calculation

점수 기반 bell curve 시뮬레이션:

```typescript
function calculatePercentile(score: number): number {
  // 평균 3000, 표준편차 1500 기준 정규분포 근사
  const mean = 3000;
  const stdDev = 1500;
  const z = (score - mean) / stdDev;
  // 누적 정규분포 근사 (error function)
  const percentile = Math.round((1 - 0.5 * erfc(z / Math.sqrt(2))) * 100);
  return Math.min(99, Math.max(1, percentile));
}
```

---

## Screen Flow

```
[Start] → [Game (20 rounds)] → [Result] → [Start]
                                    ↓
                               [History]
```

선형 플로우이므로 바텀 탭바 없음. 상단 프로그레스 바 + 뒤로가기만 사용 (DESIGN_RULES R5).

### Screens

1. **Start** — 게임 설명, 시작 버튼, 최고 기록 표시
2. **Game** — 격자 타일 표시, 레벨/타이머 HUD, 다른 색 타일 탭하면 다음 라운드
3. **Result** — 총점, 최고 레벨, 평균 반응시간, 상위 퍼센타일, 다시하기/공유
4. **History** — 과거 플레이 목록 (localStorage)

---

## Project Structure

```
apps/color-sense/
├── docs/
│   └── trd.md                 # 이 문서
├── src/
│   ├── index.html
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── StartScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── hooks/
│   │   ├── useGame.ts         # 게임 상태 머신
│   │   └── useStorage.ts      # localStorage wrapper
│   ├── utils/
│   │   ├── color.ts           # 색상 생성 알고리즘
│   │   ├── score.ts           # 점수/퍼센타일 계산
│   │   └── grid.ts            # 그리드 사이즈 결정
│   └── styles/
│       └── index.css          # Tailwind directives + 커스텀 스타일
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Game State Machine

```
IDLE → PLAYING → ROUND_RESULT → PLAYING → ... → GAME_OVER
                     (correct)
              → GAME_OVER
                (wrong — 틀리면 즉시 종료)
```

### State

```typescript
type GameState =
  | { phase: 'idle' }
  | { phase: 'playing'; round: number; rounds: GameRound[]; roundStartTime: number }
  | { phase: 'roundResult'; lastRound: GameRound; rounds: GameRound[] }
  | { phase: 'gameOver'; result: GameResult };
```

- 정답 클릭 시: `roundResult` 1초 표시 후 다음 라운드
- 오답 클릭 시: 즉시 `gameOver` (해당 라운드 `success: false`)
- 20라운드 완료 시: `gameOver`

---

## Design Spec

DESIGN_RULES.md 준수 사항:

| Rule | 적용 |
|------|------|
| R1 색상 | 라이트 모드 기반. 배경 `#fafafa`, surface `#ffffff`, primary `#0ea5e9` (sky-500). 게임 중에는 배경색도 타일에 맞춰 neutral gray로 통일하여 색 인지에 집중 |
| R2 그라디언트 텍스트 | 사용 안 함 |
| R3 그라디언트 | 결과 화면 배경 1회만 (180deg) |
| R4 애니메이션 | 타일 등장: scale(0.95→1), 라운드 전환: 즉시. fadeInUp 미사용 |
| R5 네비게이션 | 선형 플로우 — 상단 프로그레스 바만 |
| R6 backdrop-blur | 미사용 |
| R7 장식 요소 | 없음. 타일 격자 자체가 비주얼 |
| R8 폰트 | Pretendard (한글) + Space Grotesk (영문/숫자) |
| R9 테마 | 라이트 모드 |
| R10 border-radius | 타일: 8px, 카드: 16px, 버튼: pill (rounded-full) |
| R11 아이콘 | Lucide React |
| R12 font-weight | H1: bold, H2: semibold, body: normal |
| R13 이모지 | 미사용 |
| R14 정렬 | 좌측 정렬 기본, 결과 점수만 중앙 |
| R15 카드 네스팅 | 없음 |
| R16 버튼 위계 | Primary: solid sky-500, Secondary: outline |
| R17 로딩 | 해당 없음 (로딩 상태 없음) |

---

## Key Implementation Notes

1. **HSL → Hex 변환**: 색상 생성은 HSL로 하되 렌더링은 hex로 변환하여 사용
2. **타이머 정밀도**: `performance.now()` 사용 (ms 단위 정확도)
3. **모바일 터치**: 타일은 최소 44x44px 터치 영역 확보
4. **데모 모드**: DB 없이 localStorage만으로 완전한 플레이 가능 (외부 의존 없음)
5. **색맹 고려**: 향후 hue 대신 saturation/lightness 차이 모드 추가 가능 (v2)
