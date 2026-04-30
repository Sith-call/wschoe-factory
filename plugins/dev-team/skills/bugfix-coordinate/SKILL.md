---
name: bugfix-coordinate
description: Standalone bug lifecycle — reproduce, diagnose, fix, verify, commit. Invoked for any reported bug in an existing app.
---

# Bugfix Coordinate

## Purpose & Scope

Drive a single bug report through the full lifecycle: reproduce → diagnose → fix → verify → commit. This skill is standalone (not part of the 5-stage app-factory pipeline) and is invoked by the main session whenever a user reports a bug in an existing app under `apps/{app-name}/`. The main session executes these phases directly, dispatching one worker subagent per phase via the Agent tool. No hidden sub-orchestrators.

## Prerequisites

- Bug report text from user (symptom, steps, affected app).
- Target app path `apps/{app-name}/` exists and builds (`npm run build` exit 0 on current `HEAD`).
- Working tree clean or changes stashed; create branch `bugfix/{app-name}-{short-slug}` before Phase 1.
- `gstack browse` available for live verification.
- `.gstack/qa-reports/` directory exists (create if missing).

## Execution Steps

1. **Phase 1 — Triage (main session, direct).** Read the bug report. Classify severity (P0 critical / P1 major / P2 minor / P3 low). Identify affected app path and suspected area (frontend / backend / shared). Record a one-line summary to use as branch name and commit subject. Create branch `bugfix/{app-name}-{slug}`.

2. **Phase 2 — Reproduce + Diagnose (dispatch `dev-debugger`).** Dispatch a single `dev-debugger` worker via the Agent tool with the full bug report, app path, and suspected area. The worker must: (a) write a failing test that reproduces the bug (`apps/{app-name}/__tests__/bugfix-{slug}.test.*`), (b) run it and confirm it fails, (c) bisect to root cause, (d) return a diagnosis report naming the exact file(s) and line(s) plus a fix proposal. Worker tools: Read, Edit, Bash, Grep, Glob.

3. **Phase 3 — Fix (dispatch `dev-frontend` or `dev-backend`).** Based on the diagnosis in Phase 2, dispatch exactly one worker: `dev-frontend` if the root cause is UI/client code under `apps/{app-name}/src/` frontend files, otherwise `dev-backend`. Pass the diagnosis report, the failing test path, and the fix proposal. Worker must implement the fix, run the Phase 2 failing test until it passes, run `npm run build` and confirm exit 0, and return the patch summary. Worker tools: Read, Edit, Bash, Grep, Glob.

4. **Phase 4 — Live Verification (dispatch `live-app-tester`).** Dispatch `live-app-tester` with the app path and repro steps. Worker MUST launch the app, run `gstack browse` to walk through the repro steps in a real browser, capture a screenshot proving the bug is fixed, and save it to `.gstack/qa-reports/bugfix-{slug}-{timestamp}.png`. Worker returns the screenshot path and a pass/fail verdict. Code-only review is forbidden — no screenshot, no pass. Worker tools: Read, Bash, Grep, Glob (plus gstack browse).

5. **Phase 5 — Commit (main session, direct).** Stage the fix, the new failing-now-passing test, and the verification screenshot. Run `git commit -m "fix({app-name}): {one-line summary}"` with a body referencing the screenshot path. Main session executes this step directly — do not dispatch a worker.

## Worker Dispatch Plan

| Phase | Worker | Tools | Mandate |
|-------|--------|-------|---------|
| 1. Triage | (main session, direct) | — | Classify severity, create branch, derive slug. |
| 2. Reproduce + Diagnose | `dev-debugger` | Read, Edit, Bash, Grep, Glob | Write failing repro test; bisect; return diagnosis + fix proposal. |
| 3. Fix | `dev-frontend` OR `dev-backend` (area-dependent) | Read, Edit, Bash, Grep, Glob | Implement fix; failing test now passes; `npm run build` exit 0. |
| 4. Live Verification | `live-app-tester` | Read, Bash, Grep, Glob (+ gstack browse) | MUST use `gstack browse` for real browser test; MUST save screenshot under `.gstack/qa-reports/`. Code-only review forbidden. |
| 5. Commit | (main session, direct) | — | Stage fix + test + screenshot; create bugfix commit. |

## Gate Verification

Do not proceed past each gate unless all conditions hold:

- **Gate 2 (after Reproduce):** The new test at `apps/{app-name}/__tests__/bugfix-{slug}.test.*` exists and `npm test -- bugfix-{slug}` exits non-zero (bug reproduces). Diagnosis report names concrete file(s) + line(s).
- **Gate 3 (after Fix):** `npm test -- bugfix-{slug}` exits 0. `npm run build` in `apps/{app-name}/` exits 0. No unrelated tests regress (`npm test` full suite exits 0).
- **Gate 4 (after Live Verification):** Screenshot file exists at `.gstack/qa-reports/bugfix-{slug}-{timestamp}.png`. Worker verdict is PASS. Screenshot shows the post-fix behavior on the repro flow. No screenshot → gate fails → reject worker report.
- **Gate 5 (after Commit):** `git log -1` shows the bugfix commit on `bugfix/{app-name}-{slug}` branch. Working tree clean.

## Error Handling

- **Cannot reproduce (Phase 2 fails):** Re-dispatch `dev-debugger` once with expanded context (user's exact environment, console logs, network trace). If still not reproducible, stop and return "NEEDS_USER_REPRO" to the user with specific questions.
- **Fix causes regression (Phase 3 full suite fails):** Dispatch `dev-debugger` again with the regression trace and the failing test names. Treat as attempt 2.
- **Verification fails (Phase 4 verdict FAIL):** Dispatch `dev-debugger` again with the screenshot and worker notes. Treat as attempt 2.
- **3-attempt cap:** If Phases 2–4 have cycled 3 times without a green Gate 4, stop, revert uncommitted changes on the branch, and escalate to the user with: diagnosis history, attempted fixes, screenshots, and a decision request (accept partial fix / change approach / abandon).
- **Missing screenshot from verification worker:** Automatic fail. Re-dispatch `live-app-tester` with an explicit reminder that `gstack browse` + screenshot is mandatory per project rule.

## Final State

- Branch `bugfix/{app-name}-{slug}` exists with exactly one bugfix commit.
- Commit contains: the source fix, the new regression test (`apps/{app-name}/__tests__/bugfix-{slug}.test.*`), and the verification screenshot at `.gstack/qa-reports/bugfix-{slug}-{timestamp}.png`.
- `npm run build` and `npm test` both exit 0 on the branch HEAD.
- Working tree clean. Main session reports the commit SHA, branch name, and screenshot path back to the user.
