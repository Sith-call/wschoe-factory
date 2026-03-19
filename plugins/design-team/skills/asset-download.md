---
name: asset-download
description: Stitch MCP에서 모든 스크린의 HTML, 스크린샷, 폰트를 다운로드하고 Playwright로 ground truth PNG를 생성. "asset 다운로드", "ground truth 생성", "stitch asset" 시 사용.
---

# Asset Download & Ground Truth

Stitch의 모든 asset을 다운로드하여 비교 기준(ground truth)을 확보한다.

## Process

1. `mcp__stitch__list_screens(projectId)` — 전체 스크린 목록
2. 각 스크린에 대해:
   ```bash
   # Get details via MCP
   mcp__stitch__get_screen(name, projectId, screenId)

   # Download HTML
   curl -sL -o /tmp/stitch-{name}.html "{htmlCode.downloadUrl}"

   # Render ground truth at exact viewport
   npx -p playwright playwright screenshot \
     --viewport-size="430,932" \
     --wait-for-timeout=2000 \
     "file:///tmp/stitch-{name}.html" \
     /tmp/stitch-{name}-rendered.png
   ```
3. HTML에서 Google Fonts `<link>` 추출 → 앱 `index.html`에 추가
4. HTML에서 Tailwind config의 커스텀 색상 추출 → 디자인 토큰으로 기록

## Output

- `/tmp/stitch-{name}.html` — CSS 참조용 원본 HTML
- `/tmp/stitch-{name}-rendered.png` — 시각 비교용 ground truth
- 앱 `index.html`에 Google Fonts 링크 추가됨
