---
name: app-factory
description: Master 5-stage app-building pipeline — takes an app idea and produces a buildable app with demo mode. Chains pm-orchestrate, stitch-generate, design-sync, dev-orchestrate, ralph-persona-loop, and release-prep skills. Invoked by natural language or /app-factory slash command.
---

# App Factory

## Purpose & Scope

`app-factory` is the master orchestration recipe for building a new app end-to-end. It takes a user-supplied app idea and chains five stages (PM planning → Stitch design → design sync → development → Ralph persona loop → release prep) by invoking six stage-specific skills in sequence.

**This skill itself dispatches NO workers.** It is a pure pipeline driver. All worker (subagent) dispatch is delegated to the six stage skills it loads. The only direct actions taken in the main session by `app-factory` are:

- Step 0: `mkdir apps/{name}/` via Bash and TodoWrite seeding
- Final: single release commit via Bash (delegated to `release-prep`, main only verifies)

Handoff between stages is **dual-track** per spec §6.1:
- **Track 1 — File system** (source of truth): each stage writes well-known files, next stage's gate checks they exist.
- **Track 2 — TodoWrite**: main session always has visible progress across the 7 seeded items.

No text signals (no `STAGE_COMPLETE` strings). Gate verification is file-system + TodoWrite only.

## Prerequisites

- User has provided an app idea (natural language description).
- Repository is checked out at project root; `apps/` directory exists.
- `CLAUDE.md` and `DESIGN_RULES.md` are present at repo root.
- `gstack browse` is available for later QA stages.
- The six stage skills are installed and loadable: `pm-orchestrate`, `stitch-generate`, `design-sync`, `dev-orchestrate`, `ralph-persona-loop`, `release-prep`.

## Execution Steps

### Step 0 — Initialize  [USER DECISION POINT]

0a. **Pre-flight environment check (fail-fast).** Run the following Bash commands and halt the pipeline immediately if any fails. Do not silently degrade — every downstream QA stage depends on these prerequisites.

```bash
# gstack is a user-scoped Claude Code skill, NOT a CLI binary. Verify by SKILL.md presence.
test -f "$HOME/.claude/skills/gstack/SKILL.md" || { echo "PRE-FLIGHT FAIL: gstack skill not installed (required by CLAUDE.md QA rule and Stages 2b/3/4)"; exit 1; }

# The 5 factory plugins are loaded into the executor session at startup via --plugin-dir
# flags (see docs/superpowers/m4/dispatch.sh). We cannot probe the Skill tool catalogue
# from Bash, so verify the source trees exist on disk instead — if they do, the dispatcher
# contract guarantees the skills are live. Do NOT use `claude plugins list` here: that
# reports INSTALLED plugins, but --plugin-dir loads plugins without installing, so the
# check would false-negative (see docs/superpowers/m4/report-history/2026-04-10-03-blocker-c.md
# and 2026-04-10-05-stitch-permission.md).
for p in pm-agent dev-team design-team agent-maker ait-team; do
  test -d "plugins/$p/skills" || { echo "PRE-FLIGHT FAIL: plugin source tree missing: plugins/$p/skills (dispatcher must launch executor with --plugin-dir ./plugins/$p)"; exit 1; }
done
```

If either check fails, STOP the pipeline at Step 0 with a clear error identifying the missing prerequisite. Do not create the app directory, do not seed TodoWrite.

1. **Confirm app name with user.** Propose a kebab-case name derived from the idea. Then:
   - **If `CLAUDE_APP_FACTORY_AUTOCONFIRM=1` is set in the environment** (autonomous runs, e.g. M4 dispatcher): skip the confirmation prompt, use the derived name, and write it to `apps/{name}/docs/pm-outputs/app-name-decision.md` with a note that it was auto-confirmed. Log the decision to the TodoWrite audit trail so humans can review later.
   - **Otherwise**: ask the user to confirm or override. Do not proceed until the user explicitly confirms.
2. Create the app directory via Bash: `mkdir -p apps/{name}/docs/pm-outputs apps/{name}/src`.
3. Seed TodoWrite with the following 7 items verbatim (spec §6.6):

   ```
   [1] Stage 0: Initialize app directory          [pending]
   [2] Stage 1: PM planning                        [blocked by 1]
   [3] Stage 2a: Stitch screen generation          [blocked by 2]
   [4] Stage 2b: Design sync                       [blocked by 3]
   [5] Stage 3: Development                        [blocked by 4]
   [6] Stage 4: Ralph persona loop                 [blocked by 5]
   [7] Stage 5: Release prep                       [blocked by 6]
   ```

4. Load `CLAUDE.md` and `DESIGN_RULES.md` into context (Read).
5. Mark item [1] complete; unblock item [2].

### Step 1 — PM planning

Load and execute the `pm-orchestrate` skill. That skill handles all Stage 1 worker dispatch internally (market research, strategy, persona, PRD, user stories, screen flows) including its own USER DECISION POINT for segment / business model / MVP scope.

When `pm-orchestrate` returns, verify **Gate 1 (Stage 1 → 2)** per Gate Verification section below. On pass: mark [2] complete, unblock [3]. On fail: halt (see Error Handling).

### Step 2 — Stitch screen generation

Load and execute the `stitch-generate` skill. It handles Stage 2a worker dispatch (story→screen mapping, Stitch project creation, per-screen generation loop, consistency check).

When it returns, verify **Gate 2a (partial)**: files under `apps/{app}/docs/ground-truth/*.png` (min 3) and `apps/{app}/docs/design/stitch-project-id.txt` exist. On pass: mark [3] complete, unblock [4].

### Step 3 — Design sync

Load and execute the `design-sync` skill. It handles Stage 2b worker dispatch (sync-criteria 3-team review, initial React implementation, inner `ralph-design-loop`, final verification).

When it returns, verify **Gate 2b (full Stage 2 → 3 gate)** per Gate Verification below. On pass: mark [4] complete, unblock [5].

### Step 4 — Development

Load and execute the `dev-orchestrate` skill. It handles Stage 3 worker dispatch (architecture, parallel backend/frontend implementation, QA, review, demo-mode live verification).

When it returns, verify **Gate 3 (Stage 3 → 4)** per Gate Verification below. On pass: mark [5] complete, unblock [6].

### Step 5 — Ralph persona loop  [USER DECISION POINT if max iterations hit]

Load and execute the `ralph-persona-loop` skill. It handles Stage 4 phases (flow graph, persona gen, gstack /qa, /browse walkthrough, 6-way parallel evaluation, gate judgment, integration implementation, per-iteration commit, new-persona transition).

When it returns, verify **Gate 4 (Stage 4 → 5)** per Gate Verification below. If the skill hit its max iteration budget without passing the gate, **halt and ask the user** whether to (a) launch anyway with current scores, (b) run additional iterations, or (c) abort. This is the Step 5 user decision point.

On pass: mark [6] complete, unblock [7].

### Step 6 — Release prep

Load and execute the `release-prep` skill. It handles Stage 5 steps (final `npm run build`, `DESIGN_RULES.md` learnings update, `RELEASE.md` generation, single release commit).

When it returns, verify **Gate 5 (Stage 5 → DONE)** per Gate Verification below. On pass: mark [7] complete. Pipeline complete.

## Worker Dispatch Plan

| Phase | Worker | Tools | Output |
|---|---|---|---|
| *(none)* | *(none)* | *(none)* | *(none)* |

**Note:** This skill dispatches no workers directly. All worker dispatch is delegated to the 6 stage skills it invokes. The only direct main-session actions are Bash (mkdir, git status/log verification) and TodoWrite.

## Gate Verification

Between each Step, the main session runs the corresponding gate block from spec §6.3. Verification is Level B (keyword grep + file existence via Glob/Grep). On any gate failure, halt the pipeline and report the missing artifact to the user.

### Gate 1 — Stage 1 → 2
Required files (all must exist):
- `apps/{app}/docs/pm-outputs/prd.md`
- `apps/{app}/docs/pm-outputs/user-stories.md`
- `apps/{app}/docs/pm-outputs/screen-flows.md`
- `apps/{app}/docs/pm-outputs/persona.md`

Content checks:
- `prd.md` contains `# {app}` AND `## 문제 정의` AND `## 페르소나`
- `user-stories.md` has at least 10 P0 stories (grep count)
- `screen-flows.md` defines at least 3 screens

### Gate 2a — partial (post `stitch-generate`)
Required files:
- `apps/{app}/docs/ground-truth/*.png` (min 3)
- `apps/{app}/docs/design/stitch-project-id.txt`

### Gate 2b — Stage 2 → 3 (post `design-sync`)
Required files:
- `apps/{app}/docs/design/sync-criteria.md`
- `apps/{app}/docs/ground-truth/*.png` (min 3)
- `apps/{app}/src/App.tsx`
- `apps/{app}/docs/design/stitch-project-id.txt`

Content checks:
- `sync-criteria.md` contains `Design Score B+` AND `폰트/색상 불일치 0`

### Gate 3 — Stage 3 → 4
Required files:
- `apps/{app}/src/main.tsx`
- `apps/{app}/package.json`
- `apps/{app}/dist/index.html`

Command checks:
- `cd apps/{app} && npm run build` → exit 0

Content checks:
- `App.tsx` imports mock data OR `package.json` has a `demo` script

### Gate 4 — Stage 4 → 5
Trust the Ralph skill's final report.
Required files:
- `apps/{app}/docs/pm-outputs/ralph-final-report.md`
- `.gstack/qa-reports/baseline.json`

Gate values (from report):
- `health_score ≥ 70`
- `design_score ≥ B`
- `ai_slop_score ≥ B`
- `ux_score ≥ 75`
- `visionary_score ≥ 70`
- `prd_coverage ≥ 90`
- all 3 personas satisfaction ≥ 80

### Gate 5 — Stage 5 → DONE
Required files:
- `apps/{app}/docs/RELEASE.md`

Command checks:
- `cd apps/{app} && npm run build` → exit 0
- `git status` → clean
- `git log -1` → release commit exists

## Error Handling

- If any stage skill returns an error or its gate check fails, **halt the pipeline immediately**.
- Report to the user: which Step failed, which stage skill, which specific gate artifact is missing or which content check failed.
- Preserve partial state: do NOT roll back files written by earlier stages. TodoWrite items completed so far remain complete; the failing item stays `in_progress` so the user can resume.
- The user may resume by invoking the specific stage skill (e.g., `/pm-orchestrate`, `/design-sync`, `/dev-orchestrate`, `/ralph-persona-loop`, `/release-prep`) directly, then re-invoking `app-factory` from the next step — or by simply re-running the failed stage skill which will pick up from the file-system state.
- Never skip a gate or fabricate a pass; file-system evidence is the sole source of truth.

## Final State

On successful completion:
- `apps/{app}/` builds cleanly (`npm run build` exit 0).
- `apps/{app}/docs/RELEASE.md` exists.
- A single release commit is present in `git log`.
- All 7 TodoWrite items are complete.
- All five stage gates passed via file-system verification.
