---
name: design-sync
description: |
  Stitch MCP 디자인과 React 앱의 100% 시각 동기화를 위한 오케스트레이션 워크플로우.
  design-sync-lead 에이전트를 통해 4개 원자적 스킬을 순서대로 실행한다.

  Use when: "디자인 싱크", "design sync", "Stitch 디자인이랑 맞춰", "디자인 100% 동기화", "디자인 구현 시작", or when the user wants to synchronize Stitch designs with a React app end-to-end. 전체 디자인 싱크 프로세스를 시작할 때 이 스킬을 먼저 참조하여 흐름을 파악한 후, design-sync-lead 에이전트를 실행한다.
---

# Design Sync — Orchestration

Stitch MCP 디자인 ↔ React 앱 100% 시각 동기화 워크플로우.

## Agent

**design-sync-lead** 에이전트가 전체 워크플로우를 오케스트레이션한다.

## Phase Flow

```
Phase 1: story-screen-mapping (유저 스토리 ↔ 스크린 매핑)
  ↓
Phase 2: sync-criteria (PM + Design + Dev 합의)
  ↓
Phase 3: asset-download (ground truth 확보)
  ↓
Phase 4: ralph-design-loop (반복 수렴)
  ↓
Phase 5: design-implementation-reviewer (최종 검증)
```

## 각 Phase의 역할

| Phase | 스킬 | 핵심 질문 |
|-------|------|----------|
| 1 | `story-screen-mapping` | 유저 스토리에 대응하는 스크린이 모두 존재하는가? |
| 2 | `sync-criteria` | "100% 싱크"란 구체적으로 무엇인가? |
| 3 | `asset-download` | 비교 기준(ground truth)이 확보되었는가? |
| 4 | `ralph-design-loop` | 시각적 갭이 0으로 수렴했는가? |
| 5 | (agent) | 최종 검증 통과했는가? |

## Orchestration Logic

각 Phase는 **순차 실행** — 이전 Phase의 완료 조건이 충족되어야 다음으로 진행:

```
Phase 1 완료 → 모든 유저 스토리에 Screen ID 할당됨?
  YES → Phase 2
  NO → story-screen-mapping 재실행 (누락 스크린 생성)

Phase 2 완료 → sync-criteria.md 문서 존재?
  YES → Phase 3
  NO → 3팀 리뷰 재실행

Phase 3 완료 → 모든 스크린의 HTML + PNG 존재?
  YES → Phase 4
  NO → asset-download 실패 스크린만 재시도

Phase 4 완료 → 폰트/색상 불일치 0건?
  YES → Phase 5
  NO → ralph-design-loop 계속 (또는 Stitch 재생성)

Phase 5 완료 → Design Score B+ AND AI Slop Score B+?
  YES → DESIGN_STAGE_COMPLETE 출력
  NO → Phase 4 재진입 (finding 기반 수정)
```

**실행 주체**: `design-sync-lead` 에이전트가 각 스킬을 직접 실행(delegate가 아닌 execute). 스킬의 내용을 읽고 단계별로 수행한다.

## Philosophy

코드는 도구, 디자인이 목표.
Stitch가 생성한 시각적 요소의 100% 반영이 유일한 성공 기준.
