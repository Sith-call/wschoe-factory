---
name: release-prep
description: Stage 5 release preparation — final build verification, DESIGN_RULES.md update, RELEASE.md generation, single release commit. Invoked after Ralph Loop closes.
---

# Release Prep

## Purpose & Scope

Stage 5 of the app-factory pipeline — the final stage. Invoked after the Ralph Loop (Stage 4) passes its gate (`ralph-final-report.md` generated with satisfaction scores met). Verifies the build one last time, harvests learnings from the Ralph loop into the root `DESIGN_RULES.md`, writes a per-app `RELEASE.md`, and seals everything in a single release commit.

Standalone-executable: may be invoked directly against an existing app under `apps/{app}/` that needs a re-release, as long as the prerequisites below are satisfied.

## Prerequisites

- `apps/{app}/docs/pm-outputs/ralph-final-report.md` exists.
- Ralph gate passed per spec §6.3 Stage 4 → 5 (health/design/slop/ux/visionary thresholds met with screenshot evidence).
- `apps/{app}/` builds cleanly (verified in Execution Step 1).
- Root `DESIGN_RULES.md` is writable.
- Working tree may have staged/unstaged changes from Stage 4; this skill will stage and commit them.

## Execution Steps

All steps run in the main session. No worker dispatch.

1. **Final build verification.** Run `cd apps/{app} && npm run build` via Bash. If the exit code is non-zero, abort this skill and route to Error Handling (invoke `bugfix-coordinate`). Do not proceed to step 2 on failure.

2. **Update `DESIGN_RULES.md`.** Read `apps/{app}/docs/pm-outputs/ralph-final-report.md` and extract any new AI anti-patterns, visual slop findings, or design lessons discovered during the Ralph loop. Use the Edit tool directly on the repo-root `DESIGN_RULES.md` to append these as new rules under the appropriate section. The main session performs this edit directly — do not dispatch a worker.

3. **Generate `apps/{app}/docs/RELEASE.md`.** Read the Ralph final report plus `apps/{app}/docs/pm-outputs/prd.md`, then Write the release summary directly. Required sections:
   - App name and version (`v1.0`)
   - Total Ralph iterations and satisfied personas
   - Final scores: Health, Design, AI-Slop, UX%, Visionary%
   - Tech stack
   - Demo command: `cd apps/{app} && npm run dev`
   Content synthesis is cheap — no worker dispatch.

4. **Single release commit.** Stage all changes and commit:
   ```bash
   git add apps/{app}/ DESIGN_RULES.md
   git commit -m "release({app}): v1.0"
   ```
   Exactly one commit. Do not amend prior commits.

## Worker Dispatch Plan

| Worker | Purpose | Inputs | Outputs |
|---|---|---|---|

This skill does not dispatch workers; all actions are direct main-session Bash/Edit/Write calls.

## Gate Verification

Verify the Stage 5 → DONE gate from spec §6.3:

```yaml
required_files:
  - apps/{app}/docs/RELEASE.md
command_checks:
  - cd apps/{app} && npm run build → exit 0
  - git status  → clean
  - git log -1  → release commit exists
```

Run each `command_check` via Bash. All three must pass. Confirm `apps/{app}/docs/RELEASE.md` exists via Read. If any check fails, halt and route to Error Handling.

## Error Handling

- **Build failure (Step 1 or Gate Verification `npm run build`)** → invoke the `bugfix-coordinate` skill with the failing build output and app path. Do not spawn a worker directly. After `bugfix-coordinate` returns, re-run Step 1.
- **Git working tree dirty after the release commit (`git status` not clean)** → halt immediately. Report the dirty paths to the user and request manual resolution. Do not create additional commits.
- **Missing `ralph-final-report.md`** → halt. Stage 4 must complete first; report to user.
- **`DESIGN_RULES.md` edit conflict** → halt, surface the conflict to the user.

## Final State

- Single release commit `release({app}): v1.0` on the current branch.
- `apps/{app}/docs/RELEASE.md` present and committed.
- Root `DESIGN_RULES.md` updated with Ralph-loop learnings and committed.
- `git status` clean; `npm run build` green.
- TodoWrite Stage 5 item marked complete.
