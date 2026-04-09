---
name: ait-orchestrate
description: Apps-in-Toss deployment pipeline — init, scaffold, feature integration, granite build, verification. Invoked when user asks to deploy an existing app to Apps in Toss.
---

# Ait Orchestrate

## Purpose & Scope

Standalone skill that deploys a finished App Factory app to the Apps in Toss (앱인토스) WebView platform. Coordinates the 4-phase AIT pipeline (init → scaffold → develop → verify) by dispatching specialist workers sequentially.

This skill is NOT part of the main 5-stage App Factory pipeline. It is invoked on demand after Stage 5 (release prep) has completed for an app under `apps/{app}/`.

Scope:
- Parse app metadata (name, TDS usage, modules) from the existing app.
- Scaffold a Toss mini-app project using the Vite + Toss SDK template.
- Integrate required native modules (payments, ads, auth, etc.) into the scaffold.
- Run `npx granite build` and verify platform constraints.

Out of scope: product ideation, UX design, core feature implementation — those belong to the main pipeline.

## Prerequisites

- An existing app at `apps/{app}/` that has passed Stage 5 of the main App Factory pipeline.
- `apps/{app}/docs/` contains PRD/TRD (for planner context).
- `npx` available; `granite` runs only via `npx` (platform rule).
- User has specified which app to deploy (e.g., "apps/toss-fortune").
- User has confirmed TDS usage (`USE_TDS=true|false`) and Korean/English display names.

Platform rules enforced throughout:
1. `granite` runs only via `npx`.
2. TDS components previewed only in sandbox.
3. `brand.icon` must be empty string `''`.
4. If `USE_TDS=false`, TDS imports are forbidden.
5. English name: no emoji, only `:∙?` specials, Title Case.

## Execution Steps

Phase 1 — Init (planner)
1. Dispatch `ait-planner` with the source app path. Planner reads PRD/TRD, decides `APP_NAME`, `DISPLAY_NAME_KO`, `DISPLAY_NAME_EN`, `USE_TDS`, target module list, and writes `apps/{app}/.ait-build/plan.json`.

Phase 2 — Scaffold (scaffolder)
2. Dispatch `ait-scaffolder` with the plan. Scaffolder creates the Vite + Toss SDK project at `apps/{app}/.ait-build/`, generates `granite.config.ts` (with `brand.icon: ''`), wires package.json, and initializes the base app shell.

Phase 3 — Develop (feature-dev)
3. Dispatch `ait-feature-dev` with the plan + scaffold path. Worker ports the existing app's features into the Toss shell and integrates each selected native module. Worker may use its `WebFetch` tool to look up current Toss TDS component docs and native module SDK references on demand.

Phase 4 — Verify (verifier)
4. Dispatch `ait-verifier` with the built project. Verifier runs `npx granite build`, checks platform constraints (rules 1–5 above), captures verification screenshots of the built preview, and writes `apps/{app}/.ait-build/verification-report.md`.

Signal `AIT_DEPLOY_READY` on success.

## Worker Dispatch Plan

| # | Worker | Phase | Inputs | Outputs |
|---|---|---|---|---|
| 1 | `ait-planner` | Init | `apps/{app}/docs/` PRD+TRD, user preferences | `.ait-build/plan.json` (APP_NAME, names, USE_TDS, modules) |
| 2 | `ait-scaffolder` | Scaffold | `plan.json` | `.ait-build/` (Vite+SDK project, `granite.config.ts`, package.json) |
| 3 | `ait-feature-dev` | Develop | `plan.json`, scaffold path, source `apps/{app}/src/` | Integrated features + native modules in `.ait-build/src/`. **Uses `WebFetch` to retrieve current Toss TDS component docs and native module SDK references during integration (M1 finding: only AIT worker with `WebFetch`).** |
| 4 | `ait-verifier` | Verify | `.ait-build/` project | `granite build` artifacts, verification screenshots, `.ait-build/verification-report.md` |

Workers run strictly sequentially. Do not parallelize — each phase depends on the previous phase's output.

## Gate Verification

Before declaring success, confirm:
- [ ] `.ait-build/plan.json` exists and has all required shared variables.
- [ ] `.ait-build/granite.config.ts` exists with `brand.icon: ''`.
- [ ] If `USE_TDS=false`, no TDS imports exist anywhere under `.ait-build/src/`.
- [ ] `npx granite build` exits with code `0`.
- [ ] Verification screenshots exist under `.ait-build/verification/` (at least one screen per selected module).
- [ ] `.ait-build/verification-report.md` exists and marks all platform rules PASS.
- [ ] English display name matches `^[A-Z][A-Za-z0-9 :∙?]*$` (no emoji).

Any unchecked item blocks `AIT_DEPLOY_READY`.

## Error Handling

- **Planner fail**: report missing inputs to user, halt. User must supply PRD/TRD or metadata.
- **Scaffolder fail**: halt immediately. Scaffold is foundational; do not retry blindly. Surface the error and wait for user guidance (likely a platform/template issue).
- **Feature-dev fail**: re-dispatch `ait-feature-dev` with the captured error trace appended to its context. Maximum **2 retries**. If still failing, halt and report the last error trace to the user.
- **Verifier fail** (granite build non-zero OR platform rule violation OR missing screenshots): do NOT auto-retry. Surface the full verification report and the specific failing gate to the user, and await user decision (fix-and-retry vs. abort).
- **WebFetch unavailable** during feature-dev: worker proceeds with cached knowledge; log a warning in the dispatch result but do not fail.

## Final State

On success:
- `apps/{app}/.ait-build/` contains a deployable Toss mini-app bundle (Vite + SDK project, built granite artifacts).
- `apps/{app}/.ait-build/verification-report.md` documents all gate checks, screenshots, and `granite build` output.
- `apps/{app}/.ait-build/plan.json` captures the shared variables used for this deploy.
- Signal `AIT_DEPLOY_READY` emitted; user can proceed to Toss developer console submission.

On halt: partial `.ait-build/` is left in place for inspection; no signal emitted.
