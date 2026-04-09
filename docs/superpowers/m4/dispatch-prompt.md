# M4 Dispatch Prompt — feed this verbatim to the teammate / session

> This is the exact prompt used when dispatching the Agent Teams teammate (primary path) or when opening a new Claude Code session in the fallback worktree. Do not paraphrase.

---

You are executing M4 of the app-factory orchestration redesign. Your job: build the test app `하루 감사 일기` end-to-end using the new skill chain, then produce a per-stage Go/No-Go report.

## Inputs

- Test app spec: read `docs/superpowers/m4/test-app-spec.md` first.
- Target output directory: `apps/haru-gratitude-diary/`
- Idea sentence to start the pipeline: `하루 감사 일기 앱 만들어줘`

## Execution

0. **Pre-flight (mandatory).** Before invoking any skill, verify and repair the environment:
   - `test -f ~/.claude/skills/gstack/SKILL.md` — the gstack **skill** (NOT a CLI binary; invoked via the Skill tool) must be present. If missing, STOP and report `NO-GO (Blocker A: gstack skill unavailable)`. Note: earlier M4 runs misdiagnosed this as a missing CLI — gstack is a user-scoped skill, always invoked via Skill, never via shell `command -v`.
   - `claude plugins list | grep -E "pm-agent|dev-team|design-team|agent-maker|ait-team"` — all 5 factory plugins must be registered. If any are missing, run from repo root:
     ```bash
     claude plugins add ./plugins/pm-agent ./plugins/dev-team ./plugins/design-team ./plugins/agent-maker ./plugins/ait-team
     ```
     then re-verify. If registration fails, STOP and report `NO-GO (Blocker B: plugin registration failed)`.
   - Only proceed to Step 1 when both checks pass.

1. Invoke the `app-factory` skill (or run `/app-factory 하루 감사 일기 앱 만들어줘`).
2. Let the full 5-stage chain run: pm-orchestrate → stitch-generate → design-sync → dev-orchestrate → ralph-persona-loop → release-prep.
3. Do NOT skip stages. Do NOT short-circuit Ralph.
4. Ralph must run at least 1 iteration (spec §9.1 M4 Go criterion).

## Hard rules during execution

- Every Stage 2b / Stage 3 / Stage 4 evaluation MUST use `gstack browse` for real browser verification and MUST capture screenshots to `docs/superpowers/m4/screenshots/stage-N-<description>.png`.
- If any gate fails, STOP the pipeline immediately. Do not patch silently and continue. Capture the failure and report it.
- If a skill emits any `*_STAGE_COMPLETE` text signal, that is a spec violation — log it as a defect (spec §4 forbids text signals, handoff is filesystem-only).
- Worker subagents MUST NOT spawn other workers. If you observe nested Agent dispatch from a worker, log it as a defect (violates Plan 1 tools restriction).

## Reporting

After execution (or after stopping at a failed gate), write your report into `docs/superpowers/m4/report.md` by copying the schema from `docs/superpowers/m4/report-template.md` and filling in every field for every stage that ran. For stages that never started due to an earlier gate failure, mark them `Status: NOT REACHED` and leave other fields blank.

At the end of the report, write the Go/No-Go verdict:
- **GO**: all 5 stages PASS, app builds (`npm run build` succeeds), Ralph ran ≥1 iteration.
- **NO-GO**: any stage FAIL or PARTIAL, or missing Ralph iteration, or any spec violation observed.

Include a "Defects" section listing each observed issue with file path, line number if applicable, and proposed fix location (which skill body or worker file needs patching).

## What you must NOT do

- Do not merge any branches
- Do not push to origin
- Do not rewrite legacy orchestrator files (those are still live for rollback safety)
- Do not modify `CLAUDE.md` or `PRODUCT_LOOP.md`
- Do not commit `apps/haru-gratitude-diary/` itself yet — the plan-3 executor (main session) decides whether to commit the generated app in Task 6.
