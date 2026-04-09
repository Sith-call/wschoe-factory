---
name: ralph-persona-loop
description: Stage 4 quality loop — iterates 6 parallel evaluators (3 personas, design-visionary, ux-specialist, pm-executor reviewer mode) until all satisfaction/score gates pass or max iterations reached. Screenshot-mandatory per absolute rule.
---

# Ralph Persona Loop

## Purpose & Scope

Stage 4 of the app-factory pipeline. This skill runs an iterative quality-improvement loop on a built app until every gate (persona satisfaction, design, AI slop, UX, visionary, PRD coverage) is met or the iteration limit is hit.

The loop is structured on the official 2-tier model: the main session is the orchestrator that runs the phase logic in this skill body, spawns workers via the Agent tool, reads their file-system outputs, and decides whether to iterate again. No single "integrator" agent exists — Phase 4 is multi-worker dispatch coordinated by the skill body.

**Absolute rule — screenshot evidence is mandatory.** Every evaluator in Phase 2 must produce `screenshot_evidence.count > 0` in its score YAML, with real gstack browse screenshots. Any iteration missing screenshot evidence is invalid and must be re-run. Code-only reviews are forbidden.

Handoff to Stage 5 is by file system only: the final `ralph-final-report.md` plus updated TodoWrite. There is no text handoff signal.

## Prerequisites

- Gate 3 (Stage 3 → 4) has been verified by the main orchestrator:
  - `apps/{app}/src/main.tsx`, `apps/{app}/package.json`, `apps/{app}/dist/index.html` exist
  - `cd apps/{app} && npm run build` exits 0
  - Demo/mock data available
- `apps/{app}/docs/pm-outputs/prd.md`, `user-stories.md`, `screen-flows.md` exist
- `gstack browse` binary is available; dev server can be launched
- `apps/{app}/docs/pm-outputs/ralph/` directory will be used for per-iteration artifacts

The main session receives from the caller: `app_name`, `app_dir`, `dev_server` URL, and optionally `iteration_limit` (default `5`).

## Execution Steps

The loop runs at most `iteration_limit` iterations. Each iteration N executes phases 0 through 6 in order. Iteration state is held in TodoWrite plus `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/` on disk.

Before starting iteration N, main reads `apps/{app}/docs/pm-outputs/ralph/.ralph-mode.txt` if it exists. If it contains `sequential`, Phase 2 below runs sequentially instead of in parallel (see Parallel vs Sequential below).

### Phase 0 — Flow graph validation (single spawn)

Spawn `flow-graph-validator` via the Agent tool. Spawn prompt must include:
- `app_dir`, paths to `screen-flows.md` and `src/`
- Task: verify every screen in the flow graph is reachable and wired in the running app
- Output: `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/flow-graph-report.md`
- `TASK_DONE: {path}` contract

If FAIL, skill body spawns `dev-frontend` to fix the wiring and re-runs Phase 0 before proceeding. Main re-verifies via file read.

### Phase 1 — Persona generation (single spawn)

Spawn `pm-discovery`. Spawn prompt must include:
- Target segment from `prd.md`
- Previously used personas (list from prior `iteration-*/persona.md` files) — the new persona must differ on at least one diversity axis (age / tech fluency / motivation / personality)
- Output: `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/persona.md`
- `TASK_DONE: {path}` contract

Main re-reads the persona file before dispatching Phase 2.

### Phase 1.5 — gstack /qa (single spawn)

Spawn `app-qa-tester` with instructions to run `gstack /qa` (Standard tier). Spawn prompt includes:
- `dev_server` URL, `app_dir`
- Mandate: live browser run, capture Health Score screenshot under `/tmp/ralph-iter-{N}/qa/`
- Output: `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/qa-report.md` and `.gstack/qa-reports/baseline.json`
- `TASK_DONE: {path}` contract

If Health Score < 70, spawn `dev-debugger` (root-cause mandate) then re-run Phase 1.5.

### Phase 1.7 — Live walkthrough (single spawn)

Spawn `live-app-walkthrough`. Spawn prompt includes:
- Complete user journey from `screen-flows.md`
- Mandate: `gstack browse` each screen, `$B screenshot` every state, Read each file to confirm
- Screenshot base path: `/tmp/ralph-iter-{N}/walkthrough/`
- Output: `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/walkthrough-evidence.md` with screenshot index
- `TASK_DONE: {path}` contract

### Phase 2 — Six parallel evaluators (6 Agent spawns in one turn)

Main dispatches **six Agent tool calls in a single assistant turn**. Each worker has an isolated screenshot base path (parallel safety per §8.5 of the spec) and must write both a markdown report and a score YAML under `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/`.

Every spawn prompt in this phase MUST include the following block verbatim (adapted for the role):

> You are evaluating a live, built app. Use `gstack browse` for every observation. Take screenshots with `$B screenshot` under the assigned base path and Read every screenshot before scoring. Code-only review is FORBIDDEN and will invalidate the iteration. Your score YAML MUST have `screenshot_evidence.count > 0` or the iteration is rejected.

Six evaluators:

1. **`user-persona-tester` — persona-1** (the just-generated persona)
   - Screenshot base: `/tmp/ralph-iter-{N}/persona-1/`
   - Outputs: `persona-1.md` + `persona-1-score.yaml`
   - Score fields: `persona_satisfaction`, `first_impression`, `usability`, `fun_engagement`, `share_desire`, `revisit_intent`
2. **`user-persona-tester` — persona-2** (carried over from prior iteration OR a second fresh persona if first iteration)
   - Screenshot base: `/tmp/ralph-iter-{N}/persona-2/`
   - Outputs: `persona-2.md` + `persona-2-score.yaml`
3. **`user-persona-tester` — persona-3**
   - Screenshot base: `/tmp/ralph-iter-{N}/persona-3/`
   - Outputs: `persona-3.md` + `persona-3-score.yaml`
4. **`design-visionary`**
   - Screenshot base: `/tmp/ralph-iter-{N}/design-visionary/`
   - Mandate: run `gstack /design-review`, evaluate 3-second impression, emotional resonance
   - Outputs: `design-visionary.md` + `design-visionary-score.yaml`
   - Score fields: `design_score` (letter grade), `ai_slop_score` (letter grade), `visionary_score` (0–100)
5. **`ux-specialist`**
   - Screenshot base: `/tmp/ralph-iter-{N}/ux/`
   - Mandate: live quantitative measurement via `$B js`, time-to-first-value, tap target audit
   - Outputs: `ux.md` + `ux-score.yaml`
   - Score fields: `ux_score`, `time_to_first_value_steps`, `time_to_first_value_seconds`
6. **`pm-executor` — REVIEWER MODE**
   - Screenshot base: `/tmp/ralph-iter-{N}/prd-verification/`
   - Outputs: `prd-verification.md` + `prd-verification-score.yaml`
   - Score fields: `prd_coverage`, `p0_stories_implemented`, `p0_stories_total`
   - **CRITICAL**: the spawn prompt MUST structurally omit `Edit` from the effective tools the worker is allowed to use. Explicit wording required in the spawn prompt:
     > You are in REVIEWER mode. Your effective tools are Read, Grep, Glob, Bash (read-only), Agent status — NO `Edit`, NO `Write`, NO modification of any file under `apps/{app}/docs/pm-outputs/prd.md` or elsewhere. Do NOT modify prd.md. Your job is to verify that the implementation matches the PRD and report gaps. Any attempt to Edit is a protocol violation.
   - Per spec §11.3, the spawn prompt must explicitly list the allowed tools and explicitly state that `Edit` and `Write` are excluded.

**Optional 7th evaluator (conditional)**: If `prd.md` classifies the app as `education` or `info`, also spawn `domain-expert-consultant` with screenshot base `/tmp/ralph-iter-{N}/domain-expert/` and outputs `domain-expert.md` + `domain-expert-score.yaml`.

All six (or seven) spawns happen in the **same assistant turn** to encourage parallel execution.

### Phase 3 — Gate judgment (skill body, main session, no worker)

Main session executes the following logic itself (no Agent spawn):

1. Use Glob: `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/*-score.yaml` — expect exactly 6 files (7 if domain-expert included).
2. If file count is below the expected number: mark iteration invalid; retry the missing workers sequentially once. If still missing, record a failure note and fall through to error handling.
3. Read each score YAML. For each, verify `screenshot_evidence.count > 0`. If any worker has 0 screenshots, that worker must be re-spawned sequentially; if the retry also fails, iteration is invalid.
4. Aggregate scores and apply the gate rules:
   - all 3 personas `persona_satisfaction` ≥ 80
   - `design_score` ≥ B+
   - `ai_slop_score` ≥ B
   - `visionary_score` ≥ 70
   - `ux_score` ≥ 75
   - `prd_coverage` ≥ 90
5. If all gates pass → go to Phase 5. Otherwise → go to Phase 4.

### Phase 4 — Multi-worker fix dispatch (skill body coordinates; multiple workers)

Main is the coordinator — there is NO single "integrator" agent.

1. Main reads all score YAMLs and consolidates `improvements_needed` into a single ordered list. Conflict resolution rule: P0 > P1 > P2; within the same priority, PRD > design > UX.
2. Main routes each improvement to a worker based on `owner_hint`:
   - `dev-ui-engineer` — UI component / layout / Tailwind
   - `dev-frontend` — frontend logic / state / routing
   - `dev-backend` — backend / data / API
   - `design-iterator` — design regeneration (Stitch MCP)
3. Main dispatches workers **in parallel when their edit zones do not conflict** (different files or clearly isolated components). When two fixes touch the same file, they must run sequentially. Spawn prompts include the specific improvements, the before screenshots from `/tmp/ralph-iter-{N}/.../*.png`, and the expected after state.
4. After all fix workers finish, main runs `cd apps/{app} && npm run build` via Bash. If exit code is non-zero, main spawns `dev-debugger` with a root-cause mandate (no symptomatic patches). The loop does not proceed until `npm run build` succeeds.
5. Main spawns `live-app-tester` with instructions to gstack-browse each changed screen and capture before/after screenshots. Output: `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/live-verification.md`.
6. Main writes `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/iteration-{N}-fix-checklist.md` listing every improvement, the worker that handled it, the file(s) touched, and the before/after screenshot paths.

After Phase 4, main loops back to Phase 1.5 of the **same** iteration N to re-evaluate, OR if iteration N has already re-evaluated once (second Phase 1.5 within the same N), advances to iteration N+1 with a fresh persona. This prevents infinite inner retries while still letting a fix be re-measured.

### Phase 5 — Commit (skill body, main Bash)

Main uses Bash to create an iteration commit:

```
git add apps/{app}/
git commit -m "ralph(iteration-{N}): all gates passed

- personas: {names and scores}
- design: {grade} | ai_slop: {grade} | visionary: {score}
- ux: {score} | prd_coverage: {score}

Iteration: {N}/{limit}"
```

Then main generates `apps/{app}/docs/pm-outputs/ralph-final-report.md` summarizing all iterations, final scores, key improvements, and screenshot evidence index.

### Phase 6 — TodoWrite + iteration transition (skill body)

Main updates TodoWrite: mark Stage 4 complete if Phase 3 passed and Phase 5 committed. Otherwise, create a new persona (next iteration) unless:
- Phase 3 passed (→ terminate success)
- N == `iteration_limit` (→ terminate partial-success)
- Fatal failure was recorded (→ terminate error)

Transition back to Phase 0 of iteration N+1.

## Worker Dispatch Plan

| Phase | Worker | Mode | Spawn Prompt Key Points | Expected Output |
|---|---|---|---|---|
| 0 | `flow-graph-validator` | single | app_dir, screen-flows.md, verify reachability | `iteration-{N}/flow-graph-report.md` |
| 1 | `pm-discovery` | single | segment from prd, prior personas list, diversity axis | `iteration-{N}/persona.md` |
| 1.5 | `app-qa-tester` | single | dev_server URL, run gstack /qa Standard, live browser, screenshots | `iteration-{N}/qa-report.md`, `.gstack/qa-reports/baseline.json` |
| 1.7 | `live-app-walkthrough` | single | full journey, `$B screenshot` every state, Read every png | `iteration-{N}/walkthrough-evidence.md` |
| 2 | `user-persona-tester` ×3 | parallel | persona context, isolated screenshot base, 5-dim scoring, mandatory screenshots | `persona-{1,2,3}.md` + `-score.yaml` |
| 2 | `design-visionary` | parallel | gstack /design-review, 3s impression, AI slop | `design-visionary.md` + `-score.yaml` |
| 2 | `ux-specialist` | parallel | live quant via `$B js`, TTFV, tap targets | `ux.md` + `ux-score.yaml` |
| 2 | `pm-executor` | parallel, REVIEWER | **no Edit, no Write**, verify PRD vs implementation | `prd-verification.md` + `-score.yaml` |
| 2 (opt) | `domain-expert-consultant` | parallel conditional | education/info app only, source-based fact-check | `domain-expert.md` + `-score.yaml` |
| 3 | — | skill body | Glob + Read 6 yaml, gate checks | — |
| 4 | `dev-ui-engineer` / `dev-frontend` / `dev-backend` / `design-iterator` | multi (parallel when zones disjoint) | routed by `owner_hint`, before/after screenshots referenced | source edits |
| 4 | `dev-debugger` | single conditional | only if `npm run build` fails, root-cause mandate | fix commit |
| 4 | `live-app-tester` | single | before/after gstack browse verification | `iteration-{N}/live-verification.md` |
| 5 | — | skill body Bash | git commit, generate `ralph-final-report.md` | commit + final report |
| 6 | — | skill body TodoWrite | transition decision | TodoWrite update |

### Parallel vs Sequential (with auto-fallback)

Phase 2 defaults to **optimistic parallel**: six Agent spawns in one assistant turn. Parallel safety is guaranteed by unique screenshot base paths (`/tmp/ralph-iter-{N}/{role}/`) and non-overlapping output files.

Before starting Phase 2, the skill body reads `apps/{app}/docs/pm-outputs/ralph/.ralph-mode.txt`. If the file exists and contains `sequential`, Phase 2 runs sequentially (one spawn per turn, same prompts).

If Phase 3 finds multiple workers missing outputs (≥2 failed in the same iteration), the skill body writes `sequential` to `.ralph-mode.txt` so future iterations degrade to sequential mode automatically. A single failure triggers only per-worker retry, not mode downgrade.

## Gate Verification

This skill is itself the gate for Stage 4 → 5. The main orchestrator upstream trusts the file system output of this skill. The gate contract (from the spec) is:

```yaml
required_files:
  - apps/{app}/docs/pm-outputs/ralph-final-report.md
  - .gstack/qa-reports/baseline.json
gate_values_from_report:
  - health_score ≥ 70
  - design_score ≥ B
  - ai_slop_score ≥ B
  - ux_score ≥ 75
  - visionary_score ≥ 70
  - prd_coverage ≥ 90
  - all 3 personas satisfaction ≥ 80
```

The skill exits successfully only when `ralph-final-report.md` is present with these values met, OR with an explicit `partial_success: true` flag if the iteration limit was reached.

## Error Handling

- **Worker fails to produce score.yaml (or Phase 2 worker missing output)**: main retries that worker once, sequentially, with the exact same prompt. If the retry also fails, the iteration is marked invalid; advance to iteration N+1 if this was the first such failure in this iteration, otherwise mark fatal.
- **Score YAML has `screenshot_evidence.count == 0`**: treat identically to missing output — re-spawn the worker once with an extra reminder that screenshots are mandatory.
- **`npm run build` fails in Phase 4**: spawn `dev-debugger` with root-cause mandate. Do not proceed until build is green. If three consecutive `dev-debugger` attempts fail, halt with fatal error.
- **gstack browse unavailable**: halt immediately. Do not fake screenshots. Record `.ralph-halt.txt` with the reason. The main orchestrator must surface this to the user.
- **Parallel dispatch degrades**: record `sequential` to `.ralph-mode.txt` as described above.
- **Iteration limit reached without passing**: generate `ralph-final-report.md` with `partial_success: true`, list outstanding gaps, and stop. The main orchestrator escalates to the user decision point.
- **Protocol violation (pm-executor attempted Edit)**: reject the worker output, log the violation in `iteration-{N}/violations.log`, re-spawn with a stronger reviewer-mode preamble.

## Final State

On successful termination:
- `apps/{app}/docs/pm-outputs/ralph-final-report.md` exists with all gate values met
- `apps/{app}/docs/pm-outputs/ralph/iteration-*/` contains full history (reports, score YAMLs, screenshots index)
- `.gstack/qa-reports/baseline.json` exists and reflects the final iteration
- An iteration commit exists on the current branch
- TodoWrite shows Stage 4 as complete

On partial-success termination (iteration limit reached):
- `ralph-final-report.md` exists with `partial_success: true` and the list of still-failing gates
- All iteration artifacts preserved for the user's decision

On fatal termination:
- `.ralph-halt.txt` exists with the failure reason
- Last iteration's state is preserved under `iteration-{N}/`
- TodoWrite shows Stage 4 as blocked

No text handoff signal is emitted. Stage 5 handoff is by file system (`ralph-final-report.md`) plus TodoWrite only.

## Appendix — Score YAML schema (verbatim from spec §8.6)

Every worker in Phase 2 MUST emit a score YAML matching this schema. Spawn prompts should link to this appendix.

```yaml
ralph_score_block_version: 1
worker_role: user-persona-tester  # or design-visionary, ux-specialist, pm-executor
worker_name: persona-1
iteration: 2
timestamp: "2026-04-09T14:32:00Z"

screenshot_evidence:
  count: 12  # MUST be > 0
  base_path: /tmp/ralph-iter-2/persona-1/
  key_screenshots:
    - /tmp/ralph-iter-2/persona-1/home.png

scores:
  # persona-tester fields
  persona_satisfaction: 82
  first_impression: 85
  usability: 78
  fun_engagement: 80
  share_desire: 70
  revisit_intent: 90
  # OR design-visionary fields
  # design_score: "B+"
  # ai_slop_score: "B"
  # visionary_score: 72
  # OR ux-specialist fields
  # ux_score: 78
  # time_to_first_value_steps: 3
  # time_to_first_value_seconds: 8
  # OR pm-executor reviewer fields
  # prd_coverage: 91
  # p0_stories_implemented: 14
  # p0_stories_total: 15

top_findings:
  - severity: high
    description: "카테고리별 금액 표시 누락"
    evidence: /tmp/ralph-iter-2/persona-1/result-screen.png

improvements_needed:
  - priority: P0
    description: "카테고리별 금액을 결과 화면에 추가"
    expected_impact: "페르소나 만족도 +5~8%"
    owner_hint: dev-frontend
```

`owner_hint` values must be one of: `dev-ui-engineer`, `dev-frontend`, `dev-backend`, `design-iterator`.

See also: references/ralph-phase-details.md
