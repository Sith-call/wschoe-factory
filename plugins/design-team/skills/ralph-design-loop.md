---
name: ralph-design-loop
description: gstack browse + /design-review로 Stitch ground truth와 React 앱의 시각적 갭을 0%로 수렴. "ralph 디자인", "디자인 루프", "갭 수렴", "design loop" 시 사용.
---

# Ralph Design Loop (gstack-integrated)

gstack browse로 Stitch 디자인과 React 앱의 시각적 갭을 반복적으로 수렴시킨다. 각 이터레이션에서 gstack의 정량 측정을 사용하여 갭의 크기를 숫자로 추적한다.

## Pre-conditions

- Ground truth PNG가 `/tmp/stitch-{name}-rendered.png`에 존재
- Stitch HTML이 `/tmp/stitch-{name}.html`에 존재
- Dev server가 실행 중 (`npx vite --port 5173`)
- `sync-criteria.md`에 합의된 성공 기준 존재
- gstack browse 바이너리 사용 가능

## gstack browse 셋업

```bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
B=""
[ -n "$_ROOT" ] && [ -x "$_ROOT/.claude/skills/gstack/browse/dist/browse" ] && B="$_ROOT/.claude/skills/gstack/browse/dist/browse"
[ -z "$B" ] && B=~/.claude/skills/gstack/browse/dist/browse
echo "BROWSE: $B"
```

## Each Iteration — 6 Steps

### 1. Screenshot (gstack browse — 100ms)
```bash
$B viewport 430x932
$B goto http://localhost:{port}
$B screenshot /tmp/app-iter{N}-{screen}.png
$B snapshot -i -a -o /tmp/app-iter{N}-{screen}-annotated.png
```

### 2. Compare (나란히 비교)
두 이미지를 Read 도구로 동시에 열어 나란히 비교:
- `/tmp/stitch-{screen}-rendered.png` (ground truth)
- `/tmp/app-iter{N}-{screen}.png` (현재 앱)

모든 시각적 차이를 리스트업.

### 3. 정량 비교 (gstack Design System Extraction)

Stitch HTML과 앱의 디자인 시스템을 정량 비교:

```bash
# Stitch HTML의 디자인 시스템
$B goto "file:///tmp/stitch-{screen}.html"
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e => getComputedStyle(e).fontFamily))])"
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== 'rgba(0, 0, 0, 0)'))])"

# 앱의 디자인 시스템
$B goto http://localhost:{port}
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e => getComputedStyle(e).fontFamily))])"
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== 'rgba(0, 0, 0, 0)'))])"
```

→ 폰트 불일치, 색상 불일치를 정확히 식별

### 4. Reference CSS
`/tmp/stitch-{screen}.html`을 Read로 열어 정확한 CSS 값 확인.
해당 HTML의 Tailwind config, inline styles, class 조합에서 구체적 px/hex 값 추출.

### 5. Fix
- **Stitch HTML의 Tailwind 클래스를 그대로 복사** (CDN 동일 보장)
- inline style은 사용 금지 (dark mode, hover state가 깨짐)
- 커스텀 CSS 클래스는 `index.html` `<style>`에 복사
- Material Symbols → Stitch와 동일한 CDN 아이콘 사용
- Google Fonts는 `index.html`에서 CDN 로딩
- 원자적 커밋: `git commit -m "fix(design-sync): {screen} — {what changed}"`

### 6. Build & Verify (gstack browse로 즉시 확인)
```bash
npm run build

# 빌드 성공 후 즉시 gstack browse로 재확인 (100ms)
$B reload
$B screenshot /tmp/app-iter{N}-{screen}-after.png
$B snapshot -D  # 이전 상태와 diff
```

빌드 실패 시 즉시 수정 후 재빌드.

## 갭 수렴 추적

각 이터레이션마다 정량 지표를 기록:
- 폰트 불일치 수: {N} → {N-1} → ...
- 색상 불일치 수: {N} → {N-1} → ...
- 시각적 차이 항목 수: {N} → {N-1} → ...

3회 연속 개선 없으면 → Stitch 스크린 재생성 (`mcp__stitch__edit_screens` 또는 `mcp__stitch__generate_variants`) 검토

## Screen Sync Order

1. **IntroScreen** — 가장 단순, 디자인 시스템 기준 확립
2. **QuestionScreen** — 인터랙션 포함, 라디오 버튼 패턴
3. **ResultScreen** — 복잡한 레이아웃, 동적 데이터
4. **LoadingScreen** — 애니메이션 (정적 비교 한계 있음)

## Stitch MCP 연계: 디자인이 병목일 때

갭이 수렴하지 않는 원인이 React 구현이 아닌 **Stitch 디자인 자체**일 때:

### 디자인 재생성 플로우
```
갭 수렴 실패 (3회 연속) → 원인 분석
├─ 구현 한계 (CSS로 표현 불가) → Stitch 수정 요청
│   └─ mcp__stitch__edit_screens(projectId, selectedScreenIds, prompt)
│   └─ 수정된 HTML 재다운로드 → ground truth 갱신 → 루프 재개
├─ 디자인 품질 문제 → Stitch 변형 탐색
│   └─ mcp__stitch__generate_variants(projectId, selectedScreenIds, prompt, {creativeRange: "EXPLORE", variantCount: 3})
│   └─ 최적 변형 선택 → ground truth 교체 → 루프 재개
└─ AI Slop 감지 (gstack 체크리스트) → 디자인 방향 전환
    └─ stitch-workflow.md의 프롬프트 가이드 v2 적용하여 재생성
```

## Completion Criteria

- 각 스크린의 ground truth PNG와 앱 스크린샷이 시각적으로 일치
- gstack Design System Extraction에서 폰트/색상 불일치 0건
- sync-criteria.md의 Must Match 항목 전체 충족
- gstack /design-review 체크리스트에서 cross-page consistency 통과
- 빌드 성공
