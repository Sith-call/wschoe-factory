---
name: dev-orchestrate
description: Stage 3 development — architecture, parallel backend+frontend implementation, QA, review, demo mode verification. Preserves Stitch Tailwind classes set in Stage 2b.
---

# Dev Orchestrate

## Purpose & Scope

Stage 3 of the app-factory pipeline. Turns a PRD + visually-synced React scaffold into a buildable, demo-mode-verified app under `apps/{app}/`. Covers five phases: architecture, parallel backend/frontend implementation, QA, multi-layer review, and live demo verification.

Scope boundary: this skill does NOT touch the visual layer established in Stage 2b. The Stitch-derived Tailwind classes in `App.tsx` and child components are ground truth for visual presentation.

> **Constraint callout (spec §7.6): DO NOT dispatch `dev-ui-engineer` in this stage.** Stage 2b already set the visual layer via Stitch sync. Spawning any UI engineer here risks overwriting preserved Tailwind classes and design tokens. If visual issues surface, defer them to Stage 4 (ralph-persona-loop) or re-open Stage 2b.

## Prerequisites

- Gate 2b has been met (Stage 2b design sync passed).
- `apps/{app}/src/App.tsx` is present and contains Stitch-sourced Tailwind classes.
- `apps/{app}/docs/pm-outputs/sync-criteria.md` exists and its success criteria passed.
- `apps/{app}/docs/pm-outputs/PRD.md` exists.
- `apps/{app}/docs/ground-truth/` contains reference screenshots.
- `app_name` (kebab-case) is known.

## Execution Steps

### Phase 3.1 — Architecture (sequential)

Spawn a single `dev-architect` worker. Input: PRD, existing `App.tsx`, sync-criteria. Output: `apps/{app}/docs/ARCHITECTURE.md` and an explicit API contract (endpoints, request/response shapes, mock data schema) that both backend and frontend will consume. Wait for completion before Phase 3.2 — Phase 3.2 workers depend on the API contract.

### Phase 3.2 — Implementation (parallel)

Once the API contract is produced, dispatch `dev-backend` and `dev-frontend` in parallel (single message, two worker spawns). Both must read the API contract from Phase 3.1.

- `dev-backend`: data layer, mock data providers, business logic, optional API routes. Demo mode data source is mandatory.
- `dev-frontend`: wire screens to state and mock data. **Must preserve every Stitch Tailwind class already in the tree; must not add inline styles; must not introduce new UI component libraries.**

### Phase 3.3 — QA

Spawn `dev-qa`. Responsibilities: edge cases from user stories, regression coverage over Phase 3.2 changes, and test scenarios derived from the PRD. Produces a QA report with pass/fail per scenario.

### Phase 3.4 — Review (skill-loads-skill)

The main session **loads the `dev-review` skill** for multi-layer review (security, performance, simplicity, architecture compliance, language-specific review). This is a **skill-loads-skill invocation** — the main session invokes the `dev-review` skill directly, it does **NOT** spawn the legacy `dev-reviewer` subagent. Mark this explicitly in the orchestration log: "Phase 3.4: loading dev-review skill (not dev-reviewer subagent)."

### Phase 3.5 — Demo mode verification (absolute rule)

Spawn `live-app-tester`. The worker MUST:

1. Start the dev server for `apps/{app}/`.
2. Use `gstack browse` to navigate the running app.
3. Exercise the primary user flows in demo mode (no DB required).
4. Capture **screenshots** of each key screen and attach them to the report.

Per CLAUDE.md absolute rule: a feedback report without gstack browse evidence and screenshots is rejected. Code-only review does not satisfy Phase 3.5.

## Worker Dispatch Plan

| Phase | Worker | Parallel? | Critical constraints in spawn prompt |
|-------|--------|-----------|--------------------------------------|
| 3.1 | `dev-architect` | sequential | Must produce an explicit API contract consumable by both backend and frontend. Must not modify `App.tsx`. |
| 3.2a | `dev-backend` | parallel with 3.2b | Implement API contract from 3.1. Mock data provider for demo mode is mandatory — app must run without any DB. |
| 3.2b | `dev-frontend` | parallel with 3.2a | **Preserve Stitch Tailwind classes, no inline styles.** No new UI libraries. Wire screens to mock data from 3.2a. Do not restructure JSX produced by Stage 2b. |
| 3.3 | `dev-qa` | sequential | Edge cases + regression + PRD-derived scenarios. Report must list pass/fail per scenario. |
| 3.5 | `live-app-tester` | sequential | gstack browse live test of demo mode + screenshot evidence for every primary flow. Report without screenshots is invalid. |

Phase 3.4 is intentionally **not** a worker spawn row — it is a skill-load of `dev-review` by the main session.

## Gate Verification

Spec §6.3 Stage 3 → 4 gate:

```yaml
required_files:
  - apps/{app}/src/main.tsx
  - apps/{app}/package.json
  - apps/{app}/dist/index.html
command_checks:
  - cd apps/{app} && npm run build  → exit 0
content_checks:
  - App.tsx imports mock data OR package.json has "demo" script
```

All three blocks must pass before handing off to Stage 4. If any check fails, route to Error Handling before retrying the gate.

## Error Handling

- **Build failure (`npm run build` non-zero):** dispatch `dev-debugger` with a **root cause mandate** — fix the underlying defect, no band-aid workarounds (no `// @ts-ignore`, no stubbing broken modules, no deleting failing tests). Re-run Phase 3.2 outputs only for files `dev-debugger` touches.
- **QA regression in Phase 3.3:** dispatch `dev-debugger` with the failing scenario as repro steps. Same root-cause mandate applies. Re-run Phase 3.3 after the fix.
- **Phase 3.5 live test failure (broken flow, missing mock data, console errors):** route back to `dev-debugger`; do not mark the phase complete on a code-only fix — Phase 3.5 must be re-run with fresh gstack browse screenshots.
- **Visual regression vs ground-truth:** do not dispatch `dev-ui-engineer`. Document the delta and defer to Stage 4 (ralph-persona-loop).

## Final State

- `apps/{app}/` is buildable: `npm run build` exits 0 and produces `dist/index.html`.
- Demo mode works end-to-end without a database, verified by gstack browse with screenshot evidence.
- `apps/{app}/docs/ARCHITECTURE.md` exists and matches the implemented code.
- Stitch Tailwind classes from Stage 2b are unchanged.
- Multi-layer review via the `dev-review` skill has been completed with no blocking findings.
- TodoWrite Stage 3 item is marked complete; control returns to the main orchestrator for Stage 4 handoff.
