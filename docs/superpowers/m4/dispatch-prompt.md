# M4 Dispatch Prompt — feed this verbatim to the executor session

> This is the exact prompt used when dispatching a fresh `claude -p` subprocess (primary path) or when opening a new Claude Code session manually in the fallback worktree. Do not paraphrase.

## Architecture note (read me before anything else)

This prompt assumes the **executor session was started with `--plugin-dir` flags loading the 5 factory plugins at startup**, NOT with in-session `claude plugins install` calls. The earlier design had Step 0 install plugins inside the executor session itself, which failed Blocker C: Claude Code freezes the Skill tool catalogue at session start, so mid-session `claude plugins install` succeeds on disk but the running session's `Skill(...)` tool still sees "Unknown skill" (see `docs/superpowers/m4/report-history/2026-04-10-03-blocker-c.md`).

The dispatcher (parent process, human or automation) is responsible for launching the executor via:

```bash
cd <worktree root>
claude -p "$(cat docs/superpowers/m4/dispatch-prompt.md)" \
  --permission-mode auto \
  --plugin-dir ./plugins/pm-agent \
  --plugin-dir ./plugins/dev-team \
  --plugin-dir ./plugins/design-team \
  --plugin-dir ./plugins/agent-maker \
  --plugin-dir ./plugins/ait-team
```

Verified working: with these flags, `Skill(app-factory)`, `Skill(pm-orchestrate)`, `Skill(stitch-generate)`, `Skill(design-sync)`, `Skill(dev-orchestrate)`, `Skill(ralph-persona-loop)`, and `Skill(release-prep)` are all present in the catalogue at startup. No install, no marketplace registration, no `.claude/settings.json` mutation, no catch-22. If you are the executor and any of those skills is missing at startup, STOP and report `NO-GO (Blocker C: executor not launched with --plugin-dir flags — check dispatcher command)`.

---

You are executing M4 of the app-factory orchestration redesign. Your job: build the test app `하루 감사 일기` end-to-end using the new skill chain, then produce a per-stage Go/No-Go report.

## Inputs

- Test app spec: read `docs/superpowers/m4/test-app-spec.md` first.
- Target output directory: `apps/haru-gratitude-diary/`
- Idea sentence to start the pipeline: `하루 감사 일기 앱 만들어줘`

## Execution

0. **Pre-flight (mandatory, verify-only).** Install/registration happens at dispatcher level via `--plugin-dir`. Your job here is pure verification — if any check fails, STOP. Do not attempt to install anything.

   **A. gstack skill** — it is a user-scoped Skill invoked via the Skill tool, NOT a CLI binary. Never probe with `command -v`.
   ```bash
   test -f ~/.claude/skills/gstack/SKILL.md
   ```
   If missing, STOP and report `NO-GO (Blocker A: gstack skill unavailable)`.

   **B. Skill-liveness probe** — verify all 7 chain skills are actually in the Skill tool catalogue (not just on disk). The only reliable way is to attempt to resolve each. Use the Skill tool with a deliberately harmless no-op / help request on each of these skill names, in order:
   - `app-factory`
   - `pm-orchestrate`
   - `stitch-generate`
   - `design-sync`
   - `dev-orchestrate`
   - `ralph-persona-loop`
   - `release-prep`

   If any returns "Unknown skill" or an equivalent catalogue miss, STOP and report `NO-GO (Blocker C: skill not in catalogue — <skill-name>)`. Do NOT try to install it mid-session — that is the failure mode this check exists to catch. The dispatcher must relaunch the executor with the correct `--plugin-dir` flags.

   **C. Source tree sanity** — confirm the five plugin source directories exist on disk at the expected paths (they are what `--plugin-dir` pointed at):
   ```bash
   for d in plugins/pm-agent plugins/dev-team plugins/design-team plugins/agent-maker plugins/ait-team; do
     test -d "$d/skills" || { echo "MISSING: $d/skills"; exit 1; }
   done
   ```
   If any directory is missing, STOP and report `NO-GO (Blocker D: plugin source tree corrupted — <path>)`.

   Only proceed to Step 1 when A, B, and C all pass.

1. Invoke the `app-factory` skill (via the Skill tool or the `/app-factory` command) with the idea sentence `하루 감사 일기 앱 만들어줘`.
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
- Do not commit `apps/haru-gratitude-diary/` itself yet — the plan-3 executor (dispatcher session) decides whether to commit the generated app in Task 6.
- Do not run `claude plugins install` or `claude plugins marketplace add` inside your session. Plugins are loaded via `--plugin-dir` at dispatcher level; in-session install cannot repair a missing skill (Blocker C).
- Do not commit `.claude/settings.json` if it becomes dirty during your run — it is host-specific bootstrap state from prior runs and must be reverted or left untracked.
