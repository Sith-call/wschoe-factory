---
name: asset-download
description: Stitch MCP에서 모든 스크린의 HTML, 스크린샷, 폰트를 다운로드하고 gstack browse로 ground truth PNG를 생성. "asset 다운로드", "ground truth 생성", "stitch asset" 시 사용.
---

# Asset Download & Ground Truth (gstack-integrated)

Stitch의 모든 asset을 다운로드하고, gstack browse로 ground truth PNG를 생성하여 비교 기준을 확보한다.

## gstack browse 셋업

```bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
B=""
[ -n "$_ROOT" ] && [ -x "$_ROOT/.claude/skills/gstack/browse/dist/browse" ] && B="$_ROOT/.claude/skills/gstack/browse/dist/browse"
[ -z "$B" ] && B=~/.claude/skills/gstack/browse/dist/browse
echo "BROWSE: $B"
```

## Process

1. `mcp__stitch__list_screens(projectId)` — 전체 스크린 목록
2. 각 스크린에 대해:
   ```bash
   # Get details via MCP
   mcp__stitch__get_screen(name, projectId, screenId)

   # Download HTML
   curl -sL -o /tmp/stitch-{name}.html "{htmlCode.downloadUrl}"

   # Render ground truth with gstack browse (100ms, 상주 브라우저)
   $B viewport 430x932
   $B goto "file:///tmp/stitch-{name}.html"
   $B screenshot /tmp/stitch-{name}-rendered.png

   # 추가: 주석 스크린샷으로 인터랙티브 요소 확인
   $B snapshot -i -a -o /tmp/stitch-{name}-annotated.png
   ```
3. HTML에서 Google Fonts `<link>` 추출 → 앱 `index.html`에 추가
4. HTML에서 Tailwind config의 커스텀 색상 추출 → 디자인 토큰으로 기록
5. gstack /design-review의 Design System Extraction으로 Stitch의 디자인 시스템 정량 분석:
   ```bash
   # Stitch HTML의 디자인 시스템 추출
   $B goto "file:///tmp/stitch-{name}.html"
   $B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e => getComputedStyle(e).fontFamily))])"
   $B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== 'rgba(0, 0, 0, 0)'))])"
   ```

## 왜 gstack browse인가

이전 Playwright CLI 방식 (`npx -p playwright playwright screenshot`)은:
- 매번 브라우저를 새로 시작 → 3-5초/스크린
- 10스크린 = 30-50초 기다림
- 상태가 유지되지 않아 로그인/쿠키 초기화

gstack browse는:
- 상주 브라우저로 100ms/명령
- 10스크린 = 1-2초
- 쿠키/localStorage 유지

## Output

- `/tmp/stitch-{name}.html` — CSS 참조용 원본 HTML
- `/tmp/stitch-{name}-rendered.png` — 시각 비교용 ground truth (gstack browse 렌더링)
- `/tmp/stitch-{name}-annotated.png` — 인터랙티브 요소 주석 스크린샷
- 앱 `index.html`에 Google Fonts 링크 추가됨
- 디자인 시스템 정량 데이터 (폰트 목록, 색상 팔레트)
