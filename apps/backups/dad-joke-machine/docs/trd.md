# 아재개그 자판기 (Dad Joke Machine) — Technical Requirements Document

## 1. 개요

버튼 하나로 랜덤 아재 개그를 뽑아보는 자판기 앱. 50개의 개그가 로컬에 내장되어 있으며, 백엔드 없이 완전 오프라인으로 동작한다. 웹과 Android APK 두 가지 형태로 배포한다.

**핵심 가치**: 심플함. 버튼 하나 누르면 개그 하나 나온다. 그게 전부다.

---

## 2. 기술 스택

| 항목 | 선택 | 근거 |
|------|------|------|
| 프레임워크 | Vanilla TypeScript | React 도입 시 오버헤드가 앱 복잡도 대비 과도. 화면 1개, 상태 2~3개뿐이므로 Vanilla TS가 최적 |
| 빌드 도구 | Vite | 빠른 HMR, TypeScript 네이티브 지원 |
| 스타일링 | Vanilla CSS (CSS Variables) | 의존성 최소화, 오프라인 동작 보장 |
| 네이티브 래퍼 | Capacitor 6 | 웹 코드 그대로 Android APK 생성 |
| 상태 관리 | 모듈 스코프 변수 | 프레임워크 없이 모듈 패턴으로 충분 |
| 데이터 저장 | JSON import (빌드 타임) + localStorage (히스토리) |
| 포트 | 5190 |

### 프레임워크 미사용 근거

이 앱의 전체 UI는 다음과 같다:
- 개그 텍스트 표시 영역 1개
- 버튼 1개
- 선택적으로 카운터/카테고리 표시

React, Vue 등 프레임워크가 제공하는 가상 DOM, 컴포넌트 라이프사이클, 라우팅은 전혀 필요하지 않다. `document.querySelector`와 `textContent` 변경만으로 모든 UI 업데이트가 가능하다. 번들 사이즈도 최소화되어 Capacitor APK 크기에 유리하다.

---

## 3. 데이터 모델

```typescript
// === Core Types ===

/** 개그 카테고리 */
type JokeCategory =
  | 'pun'        // 말장난 (예: "소가 웃으면? 우유")
  | 'wordplay'   // 동음이의어 (예: "세상에서 가장 뜨거운 바다? 열바다")
  | 'question'   // 수수께끼형 (예: "가장 게으른 왕? 누워왕")
  | 'situation'   // 상황극 (예: "의사가 싫어하는 약? 약속")
  | 'misc';       // 기타

/** 개그 데이터 */
interface Joke {
  id: number;                // 1~50, 고유 식별자
  setup: string;             // 질문/도입부 (예: "소가 웃으면?")
  punchline: string;         // 정답/펀치라인 (예: "우유")
  category: JokeCategory;    // 분류
}

/** 최근 본 개그 추적 (localStorage) */
interface ViewHistory {
  recentIds: number[];       // 최근 본 개그 ID 목록 (최대 40개)
  lastUpdated: string;       // ISO 8601
}
```

### 데이터 저장 전략

| 데이터 | 저장 방식 | 이유 |
|--------|-----------|------|
| 50개 개그 | `src/data/jokes.ts`에 배열로 하드코딩 | 빌드 타임에 번들링, 네트워크 불필요, tree-shaking 가능 |
| 최근 본 히스토리 | `localStorage` (`djm-history` 키) | 세션 간 유지 필요, 용량 극소 |

**JSON import 대신 TS 파일 선택 근거**: JSON import도 가능하지만, TypeScript 파일로 작성하면 타입 안전성이 빌드 타임에 보장되고, 카테고리 enum 검증이 자동으로 이루어진다.

### 중복 방지 로직

```
전체 50개 개그 → recentIds에 없는 개그만 후보 풀 구성
                 → 후보 풀에서 Math.random()으로 1개 선택
                 → 선택된 ID를 recentIds에 push
                 → recentIds가 40개 초과 시 앞에서 제거 (FIFO)
                 → 후보 풀이 0개면 recentIds 초기화 (전체 리셋)
```

40개까지 추적하므로 최소 10개의 새 개그가 항상 후보에 남는다. 사용자가 "또 이거야"라는 느낌을 받지 않으면서도 완전히 소진되지 않는 균형점이다.

---

## 4. 프로젝트 구조

```
apps/dad-joke-machine/
├── docs/
│   ├── trd.md                    # 이 문서
│   └── pm-outputs/               # PM 산출물
├── src/
│   ├── main.ts                   # 앱 진입점, DOM 이벤트 바인딩
│   ├── data/
│   │   └── jokes.ts              # 50개 개그 데이터 (타입 포함)
│   ├── engine/
│   │   ├── joke-picker.ts        # 랜덤 선택 엔진 (중복 방지)
│   │   └── history.ts            # localStorage 히스토리 관리
│   ├── ui/
│   │   ├── renderer.ts           # DOM 업데이트 로직
│   │   └── animations.ts         # 전환 애니메이션
│   ├── types.ts                  # 공유 타입 정의
│   └── style.css                 # 전체 스타일
├── index.html                    # SPA 엔트리
├── android/                      # Capacitor 자동 생성
├── capacitor.config.ts           # Capacitor 설정
├── vite.config.ts                # Vite 설정
├── package.json
└── tsconfig.json
```

---

## 5. 핵심 모듈 설계

### 5.1 데이터 모듈 — `src/data/jokes.ts`

```typescript
// 50개 개그를 타입 안전하게 정의
export const jokes: readonly Joke[] = [
  { id: 1, setup: "소가 웃으면?", punchline: "우유", category: "pun" },
  { id: 2, setup: "세상에서 가장 뜨거운 바다는?", punchline: "열바다", category: "wordplay" },
  // ... 48개 더
] as const;
```

- `readonly` + `as const`로 런타임 변경 방지
- 빌드 타임에 모든 개그의 타입 검증 완료

### 5.2 랜덤 선택 엔진 — `src/engine/joke-picker.ts`

```typescript
export function pickRandomJoke(allJokes: readonly Joke[]): Joke {
  const history = loadHistory();
  let candidates = allJokes.filter(j => !history.recentIds.includes(j.id));

  if (candidates.length === 0) {
    clearHistory();
    candidates = [...allJokes];
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  addToHistory(picked.id);
  return picked;
}
```

**설계 원칙**:
- 순수 함수에 가깝게 설계 (히스토리 I/O만 사이드 이펙트)
- 후보 풀 소진 시 자동 리셋 → 무한 루프 불가
- `allJokes`를 외부에서 주입받아 테스트 용이

### 5.3 히스토리 관리 — `src/engine/history.ts`

```typescript
const STORAGE_KEY = "djm-history";
const MAX_HISTORY = 40;

export function loadHistory(): ViewHistory { /* localStorage 읽기 */ }
export function addToHistory(jokeId: number): void { /* push + trim */ }
export function clearHistory(): void { /* localStorage 삭제 */ }
```

- localStorage 접근을 이 모듈에 캡슐화
- JSON 파싱 실패 시 빈 히스토리로 fallback (앱 크래시 방지)
- Capacitor 환경에서도 localStorage 정상 동작 (WebView 기반)

### 5.4 UI 렌더러 — `src/ui/renderer.ts`

```typescript
export function renderJoke(joke: Joke): void {
  // 1. setup 텍스트 표시
  // 2. 짧은 딜레이 후 punchline 표시 (또는 탭하여 공개)
  // 3. 카테고리 뱃지 표시
}

export function renderLoading(): void {
  // 버튼 클릭 직후 짧은 전환 상태
}
```

**펀치라인 공개 방식**: setup을 먼저 보여주고, 사용자가 화면을 탭하거나 1.5초 후 자동으로 punchline을 공개한다. 이 "기다림"이 아재 개그의 핵심 재미 요소다.

### 5.5 애니메이션 — `src/ui/animations.ts`

```typescript
export function animateJokeIn(element: HTMLElement): void {
  // CSS class 토글 방식, JS 애니메이션 아님
  // 개그 교체 시: fade-out → 텍스트 변경 → fade-in
}

export function animateButtonPress(button: HTMLElement): void {
  // 자판기 버튼 누르는 촉감 표현
  // Capacitor Haptics와 연동
}
```

- CSS `transition` + `opacity`/`transform` 기반
- `requestAnimationFrame` 사용하지 않음 (GPU 가속 CSS로 충분)
- 60fps 유지를 위해 `transform`과 `opacity`만 애니메이트

---

## 6. UI 상태 관리

프레임워크 없이 간단한 상태 머신으로 관리한다.

```typescript
type AppState =
  | { phase: "idle" }                              // 초기 상태, "뽑기" 버튼 대기
  | { phase: "revealing-setup"; joke: Joke }       // setup 표시 중
  | { phase: "revealing-punchline"; joke: Joke }   // punchline 공개
  | { phase: "transitioning" };                    // 다음 개그로 전환 중

let currentState: AppState = { phase: "idle" };
```

상태 전이:
```
idle → (버튼 클릭) → revealing-setup
revealing-setup → (탭 또는 1.5초) → revealing-punchline
revealing-punchline → (버튼 클릭) → transitioning
transitioning → (애니메이션 완료) → revealing-setup (새 개그)
```

---

## 7. Capacitor 설정

### 7.1 capacitor.config.ts

```typescript
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dadjokemachine.app",
  appName: "아재개그 자판기",
  webDir: "dist",
  server: {
    // 오프라인 전용이므로 외부 URL 없음
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1000,
      backgroundColor: "#FFFFFF", // 디자인 시스템에 따라 변경
    },
    Haptics: {
      // 기본 설정 사용
    },
  },
};

export default config;
```

### 7.2 사용할 Capacitor 플러그인

| 플러그인 | 용도 | 필수 여부 |
|----------|------|-----------|
| `@capacitor/haptics` | 버튼 클릭 시 진동 피드백 | 선택 (있으면 좋음) |
| `@capacitor/splash-screen` | 앱 로딩 스플래시 | 선택 |
| `@capacitor/status-bar` | 상태바 스타일 통일 | 선택 |

**사용하지 않는 플러그인**: Share, Camera, Filesystem, Network 등 — 이 앱에는 불필요.

### 7.3 Android 빌드 파이프라인

```bash
# 1. 웹 빌드
npm run build            # → dist/ 생성

# 2. Capacitor 동기화
npx cap sync android     # dist/ → android/app/src/main/assets/

# 3. Android 빌드
npx cap open android     # Android Studio에서 열기
# 또는 CLI로 직접:
cd android && ./gradlew assembleDebug   # → app-debug.apk

# 4. 디버그 APK 위치
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 7.4 Android 최소 요구사항

| 항목 | 값 |
|------|-----|
| minSdkVersion | 22 (Android 5.1) |
| targetSdkVersion | 34 (Android 14) |
| compileSdkVersion | 34 |

---

## 8. 빌드 설정

### 8.1 vite.config.ts

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    target: "es2020",
    minify: "terser",
  },
  server: {
    port: 5190,
  },
});
```

### 8.2 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "outDir": "dist",
    "rootDir": "src",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### 8.3 package.json 핵심 스크립트

```json
{
  "scripts": {
    "dev": "vite --port 5190",
    "build": "tsc && vite build",
    "preview": "vite preview --port 5190",
    "cap:sync": "npx cap sync",
    "cap:android": "npx cap open android",
    "cap:build": "npm run build && npx cap sync android"
  }
}
```

### 8.4 의존성

```json
{
  "devDependencies": {
    "vite": "^6.0.0",
    "typescript": "^5.5.0",
    "@capacitor/cli": "^6.0.0"
  },
  "dependencies": {
    "@capacitor/core": "^6.0.0",
    "@capacitor/haptics": "^6.0.0",
    "@capacitor/splash-screen": "^6.0.0",
    "@capacitor/status-bar": "^6.0.0"
  }
}
```

---

## 9. 배포 계획

### 9.1 웹 (정적 호스팅)

`npm run build` → `dist/` 디렉토리를 아무 정적 호스팅에 업로드.

적합한 호스팅:
- **Vercel**: `vercel --prod` 한 줄
- **Netlify**: `dist/` 드래그 앤 드롭
- **GitHub Pages**: Actions로 자동 배포

빌드 결과물 예상 크기: ~50KB 이하 (HTML + CSS + JS + 개그 데이터).

### 9.2 Android (APK 사이드로딩)

```
npm run cap:build
cd android && ./gradlew assembleDebug
```

생성된 `app-debug.apk`를 직접 공유하여 사이드로딩. Google Play 등록은 현재 범위 밖.

**APK 예상 크기**: ~3~5MB (Capacitor WebView 런타임 포함).

---

## 10. 성능 목표

| 지표 | 목표 | 근거 |
|------|------|------|
| 첫 로딩 (웹) | < 500ms | 번들 50KB 이하, 외부 요청 0건 |
| 개그 전환 | < 200ms | DOM 업데이트 + CSS 트랜지션 |
| 번들 크기 | < 50KB gzipped | Vanilla TS, 외부 라이브러리 없음 |
| 오프라인 동작 | 100% | 모든 데이터 로컬 내장 |
| Lighthouse 점수 | 95+ (모든 항목) | 정적 콘텐츠, 최소 DOM |

---

## 11. 엣지 케이스 및 에러 처리

| 상황 | 처리 |
|------|------|
| localStorage 사용 불가 (프라이빗 모드 등) | 히스토리 없이 순수 랜덤으로 동작 |
| localStorage 데이터 손상 | try-catch로 감지, 히스토리 초기화 |
| 모든 개그 소진 (50개 다 봄) | 40개 히스토리 유지이므로 발생하지 않음. 만약 히스토리 max를 50으로 설정 시 자동 리셋 |
| 빠른 연속 클릭 | 상태 머신의 `transitioning` 상태에서 버튼 비활성화 |
| 화면 회전 (모바일) | CSS 반응형 레이아웃, 세로/가로 모두 대응 |
