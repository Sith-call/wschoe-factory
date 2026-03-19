---
name: sync-criteria
description: PM·Design·Dev 에이전트 3팀이 디자인 싱크 100% 성공 기준을 합의. "싱크 기준", "성공 기준 정의", "sync criteria" 시 사용.
---

# Sync Criteria Agreement

Ralph Loop 시작 전, 3팀 에이전트가 "100% 디자인 싱크"의 성공 기준을 합의한다.

## 3 Agent Reviews (병렬 spawn)

### PM Agent
- 모든 유저 스토리의 Acceptance Criteria가 Stitch 스크린에 반영되었는가
- 스크린 플로우가 유저 스토리 순서와 일치하는가

### Design Agent (design-orchestrator)
- **Must Match 속성**: background, font-family, font-size, font-weight, color, padding, margin, border-radius, box-shadow, border, gradient, icon-style, layout-structure, element-dimensions
- **Acceptable Deviation**: 이모지 렌더링, 서브픽셀 차이, hover/active 타이밍
- **Scoring**: 스크린별 0-100, 전체 평균 95 이상이면 통과

### Dev Agent (dev-frontend)
- inline style 전략 확인 (Tailwind v4 호환 문제 방지)
- Google Fonts CDN 로딩 확인
- Playwright 뷰포트 (430×932) 합의
- Material Symbols → SVG 변환 전략

## Output

`sync-criteria.md` 문서에 3팀 합의 결과 작성.
