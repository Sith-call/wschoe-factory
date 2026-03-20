---
name: stitch-workflow
description: Stitch MCP를 활용한 디자인 생성 워크플로우. PRD/유저 스토리에서 스크린 디자인을 자동 생성합니다.
---

# Stitch Design Workflow

PRD의 유저 스토리를 Google Stitch MCP를 통해 실제 UI 스크린 이미지로 변환하는 워크플로우입니다.

## 워크플로우

### 1단계: 프로젝트 생성
```
mcp__stitch__create_project(title: "앱 이름")
→ projectId 저장
```

### 2단계: 유저 스토리 → 스크린 매핑
PRD에서 스크린 단위로 유저 스토리를 추출합니다:
- 각 스크린의 목적과 핵심 요소 정의
- 스크린 간 플로우 매핑
- 디자인 시스템 (컬러, 폰트, 스타일) 결정

### 3단계: 스크린 생성
```
mcp__stitch__generate_screen_from_text(
  projectId: "{project_id}",
  prompt: "{스크린 설명 — 레이아웃, 텍스트, 스타일 포함}",
  deviceType: "MOBILE",
  modelId: "GEMINI_3_1_PRO"
)
```

**프롬프트 작성 가이드 (v2 — 감정 처방전 프로젝트에서 학습):**

이모지 사용 금지. 프롬프트는 "비주얼 디렉션 문서"처럼 작성:

1. **분위기와 메타포 먼저** — "따뜻한 동네 약국", "포르오버 커피를 내리는 과정을 지켜보는 느낌" 등 감각적 묘사를 먼저 전달
2. **레이아웃은 공간감으로** — "화면이 숨쉰다", "콘텐츠가 상단 1/3에 떠있는 느낌" 등 추상적 공간 표현
3. **컬러는 감정으로** — hex 코드 대신 "twilight sky through frosted glass", "약국 종이 느낌의 따뜻한 크림색"
4. **타이포그래피는 톤으로** — "따뜻한 다크 그레이 (순수 블랙이 아닌)", "초대하듯 가벼운 웨이트"
5. **인터랙션은 느낌으로** — "카드가 살짝 빛나는 것처럼", "탭하고 싶은 느낌"
6. **한국어 UI 텍스트는 따옴표 안에** — 정확한 텍스트 필수
7. **레퍼런스 앱** — 토스, 마인드카페, Spotify Wrapped 등 구체적 비교
8. **디바이스 너비** — 430px mobile viewport 명시
9. **전체 인상** — "이 앱을 열면 '아, 이건 나를 케어해주는구나' 느낌이 들어야 한다" 등

**잘못된 예**: "8개 카드를 2x4 그리드로 배치, #6C5CE7 보더 2px, 16px border-radius"
**올바른 예**: "8개 감정 카드가 작은 도자기 타일처럼 선반 위에 놓여있는 느낌. 선택된 카드는 살짝 빛나면서 보라색 테두리로 '선택됨'을 표현"

이 방식으로 프롬프트를 작성하면 Stitch가 자체적으로 디자인 시스템을 생성합니다 (예: "The Therapeutic Editorial" — Newsreader 세리프 + Manrope 산스, 테라코타 컬러).

### 4단계: 디자인 반복
```
# 특정 요소 수정
mcp__stitch__edit_screens(
  projectId: "{project_id}",
  selectedScreenIds: ["{screen_id}"],
  prompt: "{수정 내용}"
)

# 대안 디자인 탐색
mcp__stitch__generate_variants(
  projectId: "{project_id}",
  selectedScreenIds: ["{screen_id}"],
  prompt: "{변형 방향}",
  variantOptions: { creativeRange: "EXPLORE", variantCount: 3 }
)
```

### 5단계: 핸드오프
생성된 스크린의 screenshot URL과 HTML 코드를 개발팀에 전달합니다.

## 핵심 원칙

1. **CSS/JS 코딩 금지** — 디자인은 Stitch가 생성, 개발자는 구현에만 집중
2. **유저 스토리 기반** — 모든 스크린은 유저 스토리에서 도출
3. **반복 개선** — variants로 빠르게 대안 탐색
4. **한국어 우선** — 한국 앱 시장 타겟, 한국어 텍스트 정확성 검증

## 구현 시 100% 디자인 싱크 달성법 (2026-03-20 학습)

### Tailwind CDN 전략
React 앱에 **Tailwind CDN**을 사용해야 Stitch HTML의 Tailwind 클래스를 그대로 복사할 수 있다:
- npm Tailwind v4 사용 금지 — CDN과 클래스 해석이 다를 수 있음
- Stitch HTML의 `tailwind.config` 커스텀 색상을 앱 config에 동일하게 등록
- 커스텀 CSS 클래스 (`.paper-texture`, `.selected-card` 등)는 앱 `<style>`에 복사

### inline style 사용 금지
- Stitch HTML의 Tailwind 클래스를 React JSX `className`에 그대로 복사
- inline style은 dark mode, hover state가 깨지고 유지보수가 어려움
- 스크린별 다른 테마는 Tailwind arbitrary value 사용: `text-[#D67D61]`

### Ground Truth 확보
- Stitch HTML 소스를 다운로드하여 보관 (스크린샷만으로는 부족)
- HTML에서 정확한 클래스명, 색상값, 아이콘명을 추출
- Playwright로 430x932에서 렌더링한 PNG가 비교 기준
