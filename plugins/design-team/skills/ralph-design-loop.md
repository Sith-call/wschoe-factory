---
name: ralph-design-loop
description: Ralph Loop로 Stitch ground truth와 React 앱의 시각적 갭을 0%로 수렴. "ralph 디자인", "디자인 루프", "갭 수렴", "design loop" 시 사용.
---

# Ralph Design Loop

Ralph Loop로 Stitch 디자인과 React 앱의 시각적 갭을 반복적으로 수렴시킨다.

## Pre-conditions

- Ground truth PNG가 `/tmp/stitch-{name}-rendered.png`에 존재
- Stitch HTML이 `/tmp/stitch-{name}.html`에 존재
- Dev server가 실행 중 (`npx vite --port 5173`)
- `sync-criteria.md`에 합의된 성공 기준 존재

## Ralph Loop Setup

```
/ralph-loop:ralph-loop
Stitch ground truth와 React 앱의 시각적 갭을 0%로 수렴.
스크린별 순차 진행: {screen_order}
--max-iterations 10
```

## Each Iteration — 5 Steps

### 1. Screenshot
```bash
npx -p playwright playwright screenshot \
  --viewport-size="430,932" \
  --wait-for-timeout=2000 \
  http://localhost:5173/ \
  /tmp/app-iter{N}-{screen}.png
```

### 2. Compare
두 이미지를 Read 도구로 동시에 열어 나란히 비교:
- `/tmp/stitch-{screen}-rendered.png` (ground truth)
- `/tmp/app-iter{N}-{screen}.png` (현재 앱)

모든 시각적 차이를 리스트업.

### 3. Reference CSS
`/tmp/stitch-{screen}.html`을 Read로 열어 정확한 CSS 값 확인.
해당 HTML의 Tailwind config, inline styles, class 조합에서 구체적 px/hex 값 추출.

### 4. Fix
- **모든 시각 속성은 inline style** (`style={{}}`)
- Tailwind 클래스는 레이아웃 유틸리티만 (`flex`, `grid`, `relative`)
- Material Symbols → filled SVG path로 변환
- Google Fonts는 `index.html`에서 로딩

### 5. Build & Verify
```bash
npm run build
```
빌드 실패 시 즉시 수정 후 재빌드.

## Screen Sync Order

1. **IntroScreen** — 가장 단순, 디자인 시스템 기준 확립
2. **QuestionScreen** — 인터랙션 포함, 라디오 버튼 패턴
3. **ResultScreen** — 복잡한 레이아웃, 동적 데이터
4. **LoadingScreen** — 애니메이션 (정적 비교 한계 있음)

## Completion Criteria

- 각 스크린의 ground truth PNG와 앱 스크린샷이 시각적으로 일치
- sync-criteria.md의 Must Match 항목 전체 충족
- 빌드 성공
