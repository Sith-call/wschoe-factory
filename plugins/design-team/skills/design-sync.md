---
name: design-sync
description: |
  Stitch MCP 디자인과 React 앱의 100% 시각 동기화를 위한 오케스트레이션 워크플로우 개요.
  실제 실행은 design-sync-lead 에이전트가 담당하며, 이 스킬은 전체 흐름 참조용.
  구체적 Phase별 실행은 원자적 스킬 4개를 참조:
  - story-screen-mapping: 유저 스토리 ↔ Stitch 스크린 매핑
  - sync-criteria: 3팀 합의 성공 기준
  - asset-download: Stitch asset + ground truth 확보
  - ralph-design-loop: Ralph Loop 반복 수렴
---

# Design Sync — Overview

Stitch MCP 디자인 ↔ React 앱 100% 시각 동기화 워크플로우.

## Agent

**design-sync-lead** 에이전트가 전체 워크플로우를 오케스트레이션한다.

## Phase Flow

```
Phase 1: story-screen-mapping
  ↓
Phase 2: sync-criteria (PM + Design + Dev 합의)
  ↓
Phase 3: asset-download (ground truth 확보)
  ↓
Phase 4: ralph-design-loop (반복 수렴)
  ↓
Phase 5: design-implementation-reviewer (최종 검증)
```

## Philosophy

코드는 도구, 디자인이 목표.
Stitch가 생성한 시각적 요소의 100% 반영이 유일한 성공 기준.
