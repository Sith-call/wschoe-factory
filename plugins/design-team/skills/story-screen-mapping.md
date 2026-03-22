---
name: story-screen-mapping
description: |
  PM의 유저 스토리보드와 Stitch MCP 스크린을 1:1 매핑. 누락 스크린 생성, 부적절한 스크린 수정 포함.

  Use when: "유저 스토리 매핑", "스크린 매핑", "스토리 맵", "story screen mapping", "스토리보드 스크린 연결", or when connecting PRD user stories to Stitch design screens. 디자인 싱크 워크플로우의 첫 단계로, Stitch 프로젝트가 생성된 후 실행한다.
---

# Story-Screen Mapping

유저 스토리보드의 각 항목을 Stitch MCP 스크린과 1:1로 매핑한다.

## Process

1. **Read user stories**: `apps/{app-name}/docs/pm-outputs/user-stories.md`
2. **List Stitch screens**: `mcp__stitch__list_screens(projectId)`
3. **Match by title/purpose**: 유저 스토리의 Screen 필드 ↔ Stitch screen title
4. **Handle gaps**:
   - 스토리 있지만 스크린 없음 → `generate_screen_from_text`로 생성
   - 스크린 내용 부적절 → `edit_screens`로 수정
   - 스크린 있지만 스토리 없음 → 무시 (추가 스크린)

## 누락 스크린 생성

스크린 생성 시 `stitch-workflow.md`의 **프롬프트 작성 가이드 v2**를 따른다. hex 코드나 px 단위 대신 감정/분위기/메타포 중심으로 프롬프트를 작성해야 Stitch가 자체적으로 디자인 시스템을 생성한다.

## Output

mapping-table in user-stories.md, updated with Stitch Screen IDs.
