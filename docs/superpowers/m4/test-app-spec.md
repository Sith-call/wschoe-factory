# Test App — 하루 감사 일기 (Daily Gratitude Journal)

> Spec source: `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md` §9.4

## One-sentence idea

매일 감사한 일 3가지를 기록하고 주간 회고로 돌아보는 최소주의 감사 일기 앱.

## Why this app (spec §9.4 rationale)

- **3 distinct personas** available for Ralph Phase 2 parallel evaluation:
  - 바쁜 직장인 (30대 IT 엔지니어, 퇴근 후 5분 내에 작성 원함)
  - 대학생 (20대, 번아웃 회복 중, 루틴 형성이 목표)
  - 40대 워킹맘 (아이 재운 후 감정 정리 용도)
- **5–6 screens** fits Stage 2 Stitch generation budget:
  1. Home / 오늘의 일기
  2. Entry / 3가지 감사 입력
  3. Calendar / 월별 뷰
  4. Detail / 특정 날짜 상세
  5. Weekly reflection / 주간 회고
  6. Settings
- **localStorage demo mode** is natural (no auth, no backend)
- NOT education / finance / medical → `domain-expert-consultant` conditional NOT triggered → tests the baseline pipeline
- Post-test usable as real app (not throwaway)

## Inputs the pipeline will receive

- App name (kebab-case): `haru-gratitude-diary`
- Korean display name: `하루 감사 일기`
- Idea sentence (the natural-language prompt used at Stage 1): `하루 감사 일기 앱 만들어줘`

## Expected artifacts per stage

| Stage | Skill | Expected outputs (paths relative to apps/haru-gratitude-diary/) |
|---|---|---|
| 1 | pm-orchestrate | docs/pm-outputs/prd.md, user-stories.md, screen-flows.md, persona.md |
| 2a | stitch-generate | docs/design/ground-truth/*.png (≥5 screens), stitch-manifest.json |
| 2b | design-sync | src/ (React scaffold), docs/design/sync-criteria.md, Design Score ≥ B+ |
| 3 | dev-orchestrate | Working `npm run build`, demo mode loads in gstack browse |
| 4 | ralph-persona-loop | docs/ralph/iteration-*.md, ralph-final-report.md, 6-evaluator scores all ≥ pass threshold |
| 5 | release-prep | RELEASE.md, final git commit |

## Absolute constraints

- Demo mode mandatory (per user feedback memory: `feedback_demo_mode.md`)
- Ralph loop must run **at least 1 iteration** — this is the Go criterion from spec §9.1 M4
- All QA evidence must include gstack screenshots (CLAUDE.md absolute rule)
