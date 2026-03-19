---
name: story-screen-mapping
description: PM의 유저 스토리보드와 Stitch MCP 스크린을 1:1 매핑. 누락 스크린 생성, 부적절한 스크린 수정 포함. "유저 스토리 매핑", "스크린 매핑", "스토리 맵" 시 사용.
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

## Screen Generation Prompt Template

```
Korean mobile {screen_purpose} for {app_name}.
{top-to-bottom layout description in English}
{Korean UI text in quotes}
{color codes as #hex}
{device width: 430px}
Style: {reference app style, e.g., Toss, Kakao}
```

## Output

mapping-table in user-stories.md, updated with Stitch Screen IDs.
