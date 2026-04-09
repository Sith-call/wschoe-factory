---
name: design-sync
description: Stage 2b design — implements React components that visually match Stitch ground-truth screens. Runs inner ralph-design-loop until visual convergence.
---

# Design Sync

## Purpose & Scope

Stage 2b of the app-factory pipeline. Bridges Stitch ground-truth screen images (produced in Stage 2a via the `stitch-generate` skill) to a working React implementation whose rendered output visually matches those ground-truth PNGs.

**Scope — in:**
- Define sync success criteria (3-team agreement: Design / Dev / UX).
- Produce an initial `App.tsx` + components implementation that references Stitch HTML/Tailwind classes.
- Drive an inner visual-convergence loop by loading and executing the `ralph-design-loop` skill until parity is reached.
- Final read-only visual verification.

**Scope — out:**
- Generating new Stitch screens (Stage 2a responsibility).
- Business logic, state management, or backend wiring (Stage 3 `dev-build` responsibility).
- PM planning artifacts (Stage 1).

**Philosophy:** Code is the tool, design is the goal. Stitch ground-truth PNGs are the single source of truth; all divergence is a defect to be closed.

## Prerequisites

Before execution, verify ALL of the following via Bash/Read (halt with clear error if any missing):

1. **Gate 2a met** — Stage 2a `stitch-generate` TodoWrite marked complete.
2. **Ground-truth PNGs exist** — `apps/{app}/docs/ground-truth/*.png` contains **≥3** PNG files. Verify with `ls apps/{app}/docs/ground-truth/*.png | wc -l`.
3. **Stitch project reference exists** — `apps/{app}/docs/ground-truth/stitch-project-id.txt` is present and non-empty.
4. **PM outputs exist** — `apps/{app}/docs/pm-outputs/user-stories.md` and `apps/{app}/docs/pm-outputs/screen-flow.md` (from Stage 1) are readable.
5. **React scaffold exists** — `apps/{app}/package.json` and `apps/{app}/src/` directory exist (otherwise the initial implementation worker must scaffold before writing `App.tsx`).

If any prerequisite fails, halt and surface the missing item; do not proceed to Phase 2b.1.

## Execution Steps

This skill runs in the **main session**. It dispatches workers for phases 2b.1 and 2b.2, loads another skill for 2b.3, and dispatches a read-only worker for 2b.4. The main session never edits source files directly.

### Phase 2b.1 — Sync Criteria (parallel 3-way dispatch)

Dispatch **three workers in parallel** (single message, three Task calls) to independently analyze the ground-truth screens and user stories, then write their findings into a shared criteria doc:

- **design-visionary** — visual attributes: color palette, typography scale, spacing rhythm, shadow/border/gradient usage, iconography, layout grid.
- **dev-ui-engineer** — technical feasibility: Tailwind CDN strategy, custom CSS classes to carry over, Google Fonts/Material Symbols links, arbitrary-value color usage, inline-style avoidance.
- **ux-specialist** — user-story ↔ screen mapping completeness, acceptance-criteria coverage, interaction affordances.

All three workers write to **`apps/{app}/docs/design/sync-criteria.md`** (create the `docs/design/` dir first). Each worker appends a clearly delimited section; the main session ensures the file contains, as an agreed pass bar, the literal strings **"Design Score B+"** and **"폰트/색상 불일치 0"**.

TodoWrite: mark `2b.1 sync-criteria` complete.

### Phase 2b.2 — Initial React Implementation (single worker)

Spawn **one `dev-ui-engineer` worker** with inputs:
- `apps/{app}/docs/design/sync-criteria.md`
- `apps/{app}/docs/ground-truth/*.png` + matching Stitch HTML (if downloaded)
- `apps/{app}/docs/pm-outputs/user-stories.md` + `screen-flow.md`

Deliverables (worker writes, not main session):
- `apps/{app}/src/App.tsx` (router/screen switcher, demo/mock mode enabled).
- Per-screen components under `apps/{app}/src/components/` or `apps/{app}/src/screens/`.
- `apps/{app}/index.html` updated with Tailwind CDN, Google Fonts, Material Symbols, and any custom `<style>` classes lifted from Stitch HTML.
- `apps/{app}/tailwind.config.js` extended with Stitch custom colors if applicable.

Worker must run `npm run build` (or equivalent) and return only after a clean build.

TodoWrite: mark `2b.2 initial-implementation` complete.

### Phase 2b.3 — Inner Visual-Convergence Loop (skill-loads-skill)

**Main session loads and executes the `ralph-design-loop` skill.** This is the only mid-tier skill in the app-factory pipeline that explicitly invokes another skill, permitted by spec §7.5 and §8.9.

Main session behavior:
1. Read `plugins/design-team/skills/ralph-design-loop/SKILL.md`.
2. Execute its instructions in-session, passing:
   - `app_name`
   - ground-truth directory: `apps/{app}/docs/ground-truth/`
   - sync criteria: `apps/{app}/docs/design/sync-criteria.md`
   - app source root: `apps/{app}/src/`
3. `ralph-design-loop` is responsible for iterative visual diffing (gstack browse), dispatching fix workers, and determining convergence. It returns control when convergence is reached OR its iteration budget is exhausted.

TodoWrite: mark `2b.3 ralph-design-loop` complete (only on convergence; see Error Handling otherwise).

### Phase 2b.4 — Final Verification (read-only worker)

Spawn **one `design-visionary` worker in read-only mode** (Read + Bash for gstack browse only; no Edit/Write). Worker must:
1. `gstack browse` each screen of the running app, capture screenshots into `apps/{app}/docs/design/final/`.
2. Compare each screenshot to the matching ground-truth PNG.
3. Extract computed fonts/colors via gstack JS eval, compare to sync-criteria.
4. Produce `apps/{app}/docs/design/final-report.md` with:
   - Design Score (letter grade).
   - Font mismatches count.
   - Color mismatches count.
   - Per-screen parity notes + attached screenshot paths.

TodoWrite: mark `2b.4 final-verification` complete and Stage 2b complete.

## Worker Dispatch Plan

| # | Phase | Worker(s) | Parallelism | Inputs | Outputs | Mode |
|---|-------|-----------|-------------|--------|---------|------|
| 1 | 2b.1 | design-visionary | Parallel (3-way) | ground-truth PNGs, user-stories.md | `docs/design/sync-criteria.md` (visual section) | Read+Write |
| 2 | 2b.1 | dev-ui-engineer | Parallel (3-way) | ground-truth PNGs + Stitch HTML | `docs/design/sync-criteria.md` (tech section) | Read+Write |
| 3 | 2b.1 | ux-specialist | Parallel (3-way) | user-stories.md, screen-flow.md, PNGs | `docs/design/sync-criteria.md` (UX section) | Read+Write |
| 4 | 2b.2 | dev-ui-engineer | Single | sync-criteria.md, PNGs, Stitch HTML | `src/App.tsx`, components, `index.html`, tailwind config; clean build | Read+Write+Bash |
| 5 | 2b.3 | (skill load) | N/A — main session loads `ralph-design-loop` skill | app source, ground-truth, criteria | Converged visual parity | Skill execution |
| 6 | 2b.4 | design-visionary | Single | running app + ground-truth | `docs/design/final-report.md` + screenshots | **Read-only** (Read + gstack Bash only) |

## Gate Verification

Stage 2 → Stage 3 gate per spec §6.3. Main session performs **content_checks** before marking Stage 2b complete:

1. **File existence:**
   - `apps/{app}/docs/design/sync-criteria.md` exists.
   - `apps/{app}/src/App.tsx` exists.
   - `apps/{app}/docs/design/final-report.md` exists.

2. **Content checks on `sync-criteria.md`:**
   - Contains the literal string **`Design Score B+`**.
   - Contains the literal string **`폰트/색상 불일치 0`**.

3. **Build check:**
   - `cd apps/{app} && npm run build` exits 0.

4. **Final report check:**
   - `final-report.md` reports font mismatches == 0 AND color mismatches == 0.

If any check fails, do NOT mark Stage 2b complete; route to Error Handling.

## Error Handling

- **Prerequisite missing** → halt, surface the specific missing path/condition, do not dispatch any worker.
- **Phase 2b.1 worker writes conflicting criteria** → main session reads the merged file; if the required literals are absent, re-dispatch only the missing-section worker once. If still absent, halt with a clear diff.
- **Phase 2b.2 build fails** → re-dispatch `dev-ui-engineer` once with the build error log attached. If second attempt fails, halt.
- **Phase 2b.3 `ralph-design-loop` exhausts its iteration budget without convergence** → do NOT mark Stage 2b complete. Collect the loop's partial report (last iteration's diff summary + remaining mismatches) and return to the caller with:
  - Partial report path.
  - Remaining mismatch counts.
  - A clear **user decision request**: (a) extend iteration budget, (b) regenerate specific screens in Stage 2a via `stitch-generate` / `mcp__stitch__edit_screens`, or (c) accept current state and proceed.
- **Phase 2b.4 final report shows non-zero mismatches** → re-enter Phase 2b.3 once; on second failure, surface to user with partial report and decision request as above.
- **Gate content_check fails** → surface the exact failing check; do not mark complete.

## Final State

On successful completion:

- `apps/{app}/src/App.tsx` and per-screen components exist and compile cleanly (`npm run build` exit 0).
- Visual parity with Stitch ground-truth is achieved: final report records 0 font mismatches and 0 color mismatches, Design Score ≥ B.
- `apps/{app}/docs/design/sync-criteria.md` contains the agreed pass-bar literals.
- `apps/{app}/docs/design/final-report.md` exists with screenshots and per-screen parity notes.
- TodoWrite marks all four phases (2b.1, 2b.2, 2b.3, 2b.4) and **Stage 2b** complete.
- No text handoff signal is emitted; downstream Stage 3 `dev-build` detects readiness via file-system state and TodoWrite only.
