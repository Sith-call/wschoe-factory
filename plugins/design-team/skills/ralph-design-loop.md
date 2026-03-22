---
name: ralph-design-loop
description: |
  gstack browse + /design-review로 Stitch ground truth와 React 앱의 시각적 갭을 0%로 수렴시킨다.

  Use when: "ralph 디자인", "디자인 루프", "갭 수렴", "design loop", "디자인 싱크 시작", "Stitch랑 맞춰", "시각적 차이 줄여", or when the development team needs to match React implementation to Stitch design screens pixel-by-pixel. 디자인 싱크 워크플로우의 Phase 4로, asset-download 이후 실행한다. 각 이터레이션에서 gstack의 정량 측정으로 갭의 크기를 숫자로 추적한다.
---

# Ralph Design Loop (gstack-integrated)

gstack browse로 Stitch 디자인과 React 앱의 시각적 갭을 반복적으로 수렴시킨다.

## Pre-conditions

- Ground truth PNG가 `apps/{app-name}/docs/ground-truth/{name}-rendered.png`에 존재
- Stitch HTML이 `apps/{app-name}/docs/ground-truth/{name}.html`에 존재
- Dev server가 실행 중 (`npx vite --port 5173`)
- `sync-criteria.md`에 합의된 성공 기준 존재
- gstack browse 바이너리 사용 가능 (pm-agent `references/gstack-browse-setup.md` 참조)

## Each Iteration — 6 Steps

### 1. Screenshot (100ms)
```bash
$B viewport 430x932
$B goto http://localhost:{port}
$B screenshot /tmp/app-iter{N}-{screen}.png
$B snapshot -i -a -o /tmp/app-iter{N}-{screen}-annotated.png
```

### 2. Compare
두 이미지를 Read 도구로 동시에 열어 나란히 비교:
- `apps/{app-name}/docs/ground-truth/{screen}-rendered.png` (ground truth)
- `/tmp/app-iter{N}-{screen}.png` (현재 앱)

### 3. 정량 비교 (Design System Extraction)
```bash
# Stitch HTML
$B goto "file://apps/{app-name}/docs/ground-truth/{screen}.html"
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e => getComputedStyle(e).fontFamily))])"
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== 'rgba(0, 0, 0, 0)'))])"

# 앱
$B goto http://localhost:{port}
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e => getComputedStyle(e).fontFamily))])"
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== 'rgba(0, 0, 0, 0)'))])"
```

### 4. Reference CSS
`apps/{app-name}/docs/ground-truth/{screen}.html`에서 Tailwind config, inline styles의 정확한 px/hex 값 추출.

### 5. Fix
- Stitch HTML의 Tailwind 클래스를 그대로 복사
- inline style 사용 금지
- 원자적 커밋: `git commit -m "fix(design-sync): {screen} — {what changed}"`

### 6. Build & Verify
```bash
npm run build
$B reload
$B screenshot /tmp/app-iter{N}-{screen}-after.png
$B snapshot -D  # 이전 상태와 diff
```

## 갭 수렴 추적

각 이터레이션마다 기록:
- 폰트 불일치 수: {N} → {N-1} → ...
- 색상 불일치 수: {N} → {N-1} → ...
- 시각적 차이 항목 수: {N} → {N-1} → ...

3회 연속 개선 없으면 → Stitch 스크린 재생성 검토.

## Screen Sync Order

1. **IntroScreen** — 가장 단순, 디자인 시스템 기준 확립
2. **QuestionScreen** — 인터랙션 포함
3. **ResultScreen** — 복잡한 레이아웃, 동적 데이터
4. **LoadingScreen** — 애니메이션 (정적 비교 한계)

## Stitch MCP 연계: 디자인이 병목일 때

```
갭 수렴 실패 (3회) → 원인 분석
├─ 구현 한계 (CSS 불가) → mcp__stitch__edit_screens → ground truth 갱신
├─ 디자인 품질 문제 → mcp__stitch__generate_variants(creativeRange: "EXPLORE")
└─ AI Slop 감지 → stitch-workflow.md v2 프롬프트로 재생성
```

## Completion Criteria

- ground truth PNG와 앱 스크린샷이 시각적으로 일치
- Design System Extraction에서 폰트/색상 불일치 0건
- sync-criteria.md의 Must Match 항목 전체 충족
- 빌드 성공
