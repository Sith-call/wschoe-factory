---
name: asset-download
description: |
  Stitch MCP에서 모든 스크린의 HTML, 스크린샷, 폰트를 다운로드하고 gstack browse로 ground truth PNG를 생성한다.

  Use when: "asset 다운로드", "ground truth 생성", "stitch asset", "디자인 에셋 받아", "HTML 다운로드", "Stitch 스크린 다운로드", or when preparing design assets for the Ralph Design Loop. 디자인 싱크 워크플로우의 Phase 3으로, sync-criteria 합의 후 실행한다.
---

# Asset Download & Ground Truth (gstack-integrated)

Stitch의 모든 asset을 다운로드하고, gstack browse로 ground truth PNG를 생성하여 비교 기준을 확보한다.

## 전제 조건

- Stitch 프로젝트 ID가 알려진 상태
- gstack browse 바이너리 설치 (pm-agent `references/gstack-browse-setup.md` 참조)

## gstack 가용성 체크 (첫 단계)

```bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
B=""
[ -n "$_ROOT" ] && [ -x "$_ROOT/.claude/skills/gstack/browse/dist/browse" ] && B="$_ROOT/.claude/skills/gstack/browse/dist/browse"
[ -z "$B" ] && B=~/.claude/skills/gstack/browse/dist/browse
if [ ! -x "$B" ]; then
  echo "ERROR: gstack browse not found. Ground truth PNG 생성 불가."
  echo "FALLBACK: Stitch 썸네일을 대체 기준으로 사용합니다."
  # → gstack 없이도 HTML 다운로드 + 폰트/색상 추출은 가능
fi
```

## Process

### Step 1: 스크린 목록 확보

`mcp__stitch__list_screens(projectId: "{projectId}")` 호출.

응답에서 각 스크린의 `name` 필드를 추출한다.
- name 형식: `projects/{projectId}/screens/{screenId}`

### Step 2: 각 스크린 상세 정보 + HTML 다운로드

```python
# 의사코드 — 에이전트가 MCP 도구 + bash로 실행
for screen in screens:
    # 1. 상세 정보 조회
    details = mcp__stitch__get_screen(
        name=screen.name,
        projectId=projectId,
        screenId=screenId
    )

    # 2. HTML 다운로드
    # get_screen 응답에서 HTML 다운로드 URL을 찾는다.
    # 응답 구조가 확실하지 않으면 응답을 먼저 출력하여 확인:
    #   - htmlCode.downloadUrl
    #   - htmlCode.download_url
    #   - html.downloadUrl
    # 확인 후 올바른 필드로 curl 실행
```

**중요**: `get_screen` 응답의 정확한 필드명은 **첫 번째 호출의 응답을 확인**하여 결정한다. 응답 구조를 가정하지 말고, 실제 응답을 읽은 후 HTML 다운로드 URL을 추출한다.

```bash
# HTML 다운로드 (확인된 URL 사용)
curl -sL -o apps/{app-name}/docs/ground-truth/{screenName}.html "{verified_download_url}"

# 다운로드 검증
if [ ! -s apps/{app-name}/docs/ground-truth/{screenName}.html ]; then
  echo "ERROR: HTML 다운로드 실패 — {screenName}"
  echo "URL: {verified_download_url}"
  # 재시도 1회
  curl -sL -o apps/{app-name}/docs/ground-truth/{screenName}.html "{verified_download_url}"
fi
```

### Step 3: Ground Truth PNG 생성 (gstack browse)

gstack browse가 사용 가능한 경우에만 실행:

```bash
$B viewport 430x932
$B goto "file://apps/{app-name}/docs/ground-truth/{screenName}.html"
$B screenshot apps/{app-name}/docs/ground-truth/{screenName}-rendered.png

# 주석 스크린샷
$B snapshot -i -a -o apps/{app-name}/docs/ground-truth/{screenName}-annotated.png
```

gstack 불가 시: HTML 파일만 보관하고, 비교는 수동으로 진행.

### Step 4: 디자인 시스템 추출

HTML에서 폰트, 색상, 커스텀 CSS를 추출:

```bash
# 폰트 추출
$B goto "file://apps/{app-name}/docs/ground-truth/{screenName}.html"
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e => getComputedStyle(e).fontFamily))])"

# 색상 추출
$B js "JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]).filter(c => c !== 'rgba(0, 0, 0, 0)'))])"
```

gstack 불가 시: HTML 파일을 Read 도구로 열어 `<link>` 태그에서 Google Fonts URL을 grep, `<script>` 내 tailwind.config에서 커스텀 색상을 추출.

### Step 5: 앱에 디자인 토큰 반영

- Google Fonts `<link>` → 앱 `index.html`의 `<head>`에 추가
- Tailwind 커스텀 색상 → 앱 `index.html`의 tailwind.config에 추가
- 커스텀 CSS 클래스 → 앱 `index.html`의 `<style>`에 추가

## Output

- `apps/{app-name}/docs/ground-truth/{screenName}.html` — CSS 참조용 원본 HTML
- `apps/{app-name}/docs/ground-truth/{screenName}-rendered.png` — 시각 비교용 ground truth (gstack browse)
- `apps/{app-name}/docs/ground-truth/{screenName}-annotated.png` — 인터랙티브 요소 주석 스크린샷
- 앱 `index.html`에 Google Fonts + Tailwind config + 커스텀 CSS 추가됨
- 디자인 시스템 정량 데이터 (폰트 목록, 색상 팔레트)

## 에러 핸들링

| 실패 | 복구 |
|------|------|
| `list_screens` 빈 결과 | 에러 리포트. Stitch 프로젝트 ID 확인 요청 |
| `get_screen` 실패 | screenId 확인 후 1회 재시도 |
| curl 다운로드 실패 | URL 확인 + 1회 재시도. 2회 실패 시 해당 스크린 스킵 + 리포트 |
| gstack browse 불가 | HTML 파일만 보관. ground truth는 수동 비교로 대체 |
| 빈 HTML 파일 | 다운로드 URL 재확인. Stitch에서 스크린 재생성 권고 |
