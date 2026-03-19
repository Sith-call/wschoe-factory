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

**프롬프트 작성 가이드:**
- 영어로 구조 설명 + 한국어 UI 텍스트는 따옴표 내 포함
- 위에서 아래 순서로 레이아웃 요소 나열
- 컬러 코드 직접 명시 (#FF6B6B 등)
- 디바이스 너비 명시 (430px)
- 레퍼런스 앱 스타일 언급 (토스, 카카오 등)

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
