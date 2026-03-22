---
name: sync-criteria
description: |
  PM·Design·Dev 에이전트 3팀이 디자인 싱크 100% 성공 기준을 합의한다.

  Use when: "싱크 기준", "성공 기준 정의", "sync criteria", "디자인 싱크 기준 잡자", "합의 기준", or before starting the Ralph Design Loop. 디자인 싱크 워크플로우의 Phase 2로, story-screen-mapping 완료 후 실행한다. 3팀이 "100% 디자인 싱크"가 무엇인지 합의해야 이후 반복 루프의 종료 조건이 명확해진다.
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
- Tailwind CDN 전략 확인 (npm Tailwind v4 호환 문제 방지)
- Google Fonts CDN 로딩 확인
- gstack browse 뷰포트 (430×932) 합의
- Material Symbols → SVG 변환 전략

## 충돌 해결

3팀 의견이 다를 때:
- **Must Match 범위**: Design Agent의 판단을 우선 (시각적 속성 전문가)
- **기술적 제약**: Dev Agent가 "불가능"이라고 하면 해당 항목을 Acceptable Deviation으로 이동
- **기능적 완전성**: PM Agent가 "필수"라고 한 Acceptance Criteria는 반드시 포함

## Output

`sync-criteria.md` 문서에 3팀 합의 결과 작성. 아래 템플릿 사용:

```markdown
# Sync Criteria — {app-name}

## Must Match 속성
| 속성 | 허용 오차 | 측정 방법 |
|------|----------|----------|
| background-color | exact hex | gstack js extraction |
| font-family | exact match | gstack js extraction |
| font-size | ±1px | computed style |
| padding/margin | ±2px | computed style |
| border-radius | exact | computed style |
| color | exact hex | gstack js extraction |
| layout structure | same hierarchy | visual comparison |

## Acceptable Deviation
| 항목 | 이유 |
|------|------|
| 이모지 렌더링 | OS별 차이 불가피 |
| 서브픽셀 차이 | 렌더링 엔진 차이 |
| hover/active 타이밍 | 정적 비교 한계 |

## PM Acceptance Criteria 반영
| 유저 스토리 | Criteria | Stitch 반영 여부 |
|------------|----------|-----------------|

## 합의 결과
- Design Score 통과 기준: ≥ {점수}
- 뷰포트: 430×932
- Tailwind 전략: CDN (npm v4 사용 금지)
- 폰트 로딩: Google Fonts CDN
```
