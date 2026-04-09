---
name: pm-orchestrate
description: Stage 1 PM planning — produces PRD, user stories, screen flows, and persona for a new app. First stage of app-factory pipeline.
---

# PM Orchestrate

## Purpose & Scope

Execute Stage 1 of the app-factory pipeline: produce the PM deliverables
required to unblock Stage 2 (design). Output is four files under
`apps/{app}/docs/pm-outputs/`: `prd.md`, `user-stories.md`, `screen-flows.md`,
`persona.md`. This skill coordinates worker subagents (`pm-analyst`,
`pm-discovery`, `pm-strategist`, `pm-executor`, `ux-specialist`) and halts at a
user decision point before PRD writing.

## Prerequisites

- `apps/{app}/` directory exists (created in Stage 0).
- User has confirmed the kebab-case app name.
- `CLAUDE.md` and `DESIGN_RULES.md` have been loaded into main session context.
- `apps/{app}/docs/pm-outputs/` directory exists (create it if missing).
- Main session has TodoWrite tracking Stage 1.

## Execution Steps

### Phase 1.1 — Market Research (parallel)

In a SINGLE assistant turn, dispatch three Agent tool calls in parallel:

1. `pm-analyst` — market sizing + competitor landscape.
2. `pm-discovery` — user problem signals + JTBD hypotheses.
3. `pm-strategist` — positioning + macro trends (PESTLE/Porter).

Wait for all three to return before Phase 1.2.

### Phase 1.2 — Strategy (parallel)

In a SINGLE assistant turn, dispatch two `pm-strategist` spawns in parallel:

1. Business model exploration (Lean Canvas / BMC).
2. Value proposition (6-part JTBD template).

### Phase 1.3 — Persona

Dispatch a single `pm-discovery` spawn to write `persona.md`. Must consume
Phase 1.1 and 1.2 outputs.

### Phase 1.4 — PRD (USER DECISION POINT — HALT)

**STOP. DO NOT SPAWN ANYTHING YET.**

Main session MUST present the user with a concise summary of:

1. Candidate target segment(s) from Phase 1.1/1.3.
2. Candidate business model(s) from Phase 1.2.
3. Proposed MVP scope (narrowest wedge).

Main session MUST then ask the user to confirm:

> "Please confirm: (1) target segment, (2) business model, (3) MVP scope.
> I will not write the PRD until you reply."

**HALT and await user input.** Do not proceed to the `pm-executor` dispatch
until the user responds with explicit confirmation or edits.

After confirmation, dispatch `pm-executor` in **WRITER mode** to write
`apps/{app}/docs/pm-outputs/prd.md`.

### Phase 1.5 — User Stories + Screen Flows (parallel)

In a SINGLE assistant turn, dispatch two Agent tool calls in parallel:

1. `pm-executor` — write `user-stories.md` (≥10 P0 stories, INVEST format).
2. `ux-specialist` — write `screen-flows.md` (≥3 screens with transitions).

## Worker Dispatch Plan

| Phase | Worker         | Mode    | Spawn Prompt Key Points                                                                                                                          | Expected Output                                         |
|-------|----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| 1.1   | pm-analyst     | writer  | App idea; output path `apps/{app}/docs/pm-outputs/market-research.md`; read PRD template if exists; TAM/SAM/SOM + competitors.                   | `market-research.md`                                    |
| 1.1   | pm-discovery   | writer  | App idea; output path `apps/{app}/docs/pm-outputs/problem-signals.md`; JTBD hypotheses + desperate specificity.                                  | `problem-signals.md`                                    |
| 1.1   | pm-strategist  | writer  | App idea; output path `apps/{app}/docs/pm-outputs/macro-scan.md`; PESTLE + Porter's Five Forces.                                                 | `macro-scan.md`                                         |
| 1.2   | pm-strategist  | writer  | Consume Phase 1.1; output `apps/{app}/docs/pm-outputs/business-model.md`; Lean Canvas + recommended model.                                       | `business-model.md`                                     |
| 1.2   | pm-strategist  | writer  | Consume Phase 1.1; output `apps/{app}/docs/pm-outputs/value-prop.md`; 6-part JTBD template.                                                      | `value-prop.md`                                         |
| 1.3   | pm-discovery   | writer  | Consume 1.1+1.2; output `apps/{app}/docs/pm-outputs/persona.md`; read PRD template if exists; 1 primary persona w/ JTBD, pains, gains.            | `persona.md`                                            |
| 1.4   | pm-executor    | **WRITER mode — may Edit prd.md** (distinct from reviewer mode used in Ralph loop Phase 2) | After user confirmation only; output `apps/{app}/docs/pm-outputs/prd.md`; read PRD template if exists; MUST contain `# {app}`, `## 문제 정의`, `## 페르소나`. | `prd.md`                                                |
| 1.5   | pm-executor    | writer  | Output `apps/{app}/docs/pm-outputs/user-stories.md`; read PRD; ≥10 P0 stories, INVEST format, acceptance criteria.                                | `user-stories.md`                                       |
| 1.5   | ux-specialist  | writer  | Output `apps/{app}/docs/pm-outputs/screen-flows.md`; read PRD + user-stories; ≥3 screens with transitions and states.                             | `screen-flows.md`                                       |

## Gate Verification

After Phase 1.5, verify the Stage 1 → 2 gate (spec §6.3):

```yaml
required_files:
  - apps/{app}/docs/pm-outputs/prd.md
  - apps/{app}/docs/pm-outputs/user-stories.md
  - apps/{app}/docs/pm-outputs/screen-flows.md
  - apps/{app}/docs/pm-outputs/persona.md
content_checks:
  - prd.md: contains "# {app}" AND "## 문제 정의" AND "## 페르소나"
  - user-stories.md: at least 10 P0 stories (grep count)
  - screen-flows.md: at least 3 screens defined
```

Use Bash + Grep to verify existence and content checks. If any check fails,
proceed to Error Handling.

## Error Handling

- **Worker returns without writing its target file**: re-spawn the SAME worker
  ONCE with an explicit mandate stating the exact absolute output path and the
  required content headings. Example: "You must write
  `apps/{app}/docs/pm-outputs/prd.md` containing `# {app}`, `## 문제 정의`,
  `## 페르소나`. Do not return until the file exists."
- **Second failure on the same file**: HALT Stage 1. Emit a status report
  listing (a) the failing file, (b) the worker, (c) the worker's last response,
  (d) suggested next action. Do not proceed to Stage 2.
- **Gate content check fails** (file exists but missing header / too few
  stories): treat as a worker failure and apply the same re-spawn rule.
- **User does not confirm in Phase 1.4**: remain halted indefinitely; do not
  auto-proceed.

## Final State

- 4 files present in `apps/{app}/docs/pm-outputs/`: `prd.md`, `user-stories.md`,
  `screen-flows.md`, `persona.md` (plus supporting research docs from
  Phases 1.1–1.2).
- All gate `content_checks` pass.
- TodoWrite Stage 1 marked complete.
- Stage 2 (`stitch-generate`) unblocked.
- Main session emits the `PM_STAGE_COMPLETE` handoff block for the
  app-factory orchestrator to auto-transition.
