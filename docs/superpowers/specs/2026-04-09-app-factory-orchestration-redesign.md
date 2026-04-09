# App Factory Orchestration Redesign

- **Date**: 2026-04-09
- **Status**: Draft — awaiting user review
- **Author**: brainstorming session (Claude + wschoe)
- **Scope**: `plz-survive-jay` plugin suite (pm-agent, design-team, dev-team, agent-maker, ait-team)
- **Related docs**: `CLAUDE.md`, `PRODUCT_LOOP.md`, official Claude Code docs at `/Users/wschoe/claude-code-docs/docs/{agent-teams.md,agent-sdk__subagents.md,agent-sdk__agent-loop.md}`

---

## 1. Problem Statement

### 1.1 Origin
User flagged that `PRODUCT_LOOP.md` does not clearly specify who orchestrates each Phase. Investigation revealed the issue is deeper than docs: the **entire orchestration architecture conflicts with the official Claude Code subagent model**.

### 1.2 Current state
The project defines 7 "orchestrator" subagents (`app-factory`, `pm-orchestrator`, `design-orchestrator`, `design-sync-lead`, `dev-orchestrator`, `maker-orchestrator`, `ait-orchestrator`) plus `bugfix-coordinator` (implicit orchestrator). These are intended to form a nested pipeline:

```
app-factory → pm-orchestrator → pm-executor/pm-analyst/...
            → design-orchestrator → design-screen-generator/...
            → dev-orchestrator → dev-backend/dev-frontend/...
            → ralph-persona-loop (skill) → 5 parallel evaluators
```

### 1.3 Conflict with official convention
Per `/Users/wschoe/claude-code-docs/docs/agent-sdk__subagents.md`:

> "Subagents cannot spawn their own subagents. Don't include `Agent` in a subagent's `tools` array."

Per `/Users/wschoe/claude-code-docs/docs/agent-teams.md`:

> "No nested teams: teammates cannot spawn their own teams or teammates. Only the lead can manage the team."

The 3-layer nested orchestration is structurally prohibited. Either:
- The current pipeline is technically broken (Agent tool inheritance blocked), or
- The pipeline accidentally works today but sits outside official support and will break on future Claude Code updates.

### 1.4 Additional problems
- **Text-based handoff signals** (`PM_STAGE_COMPLETE`, `DEV_STAGE_COMPLETE`, `QUALITY_STAGE_COMPLETE`) rely on final-message parsing. Per `agent-loop.md`, final messages may be summarized by compaction — signals can silently disappear.
- **Stage/Phase numbering mismatch**: CLAUDE.md uses Stage 1-5, PRODUCT_LOOP.md uses Phase 0-8, no mapping exists.
- **Orchestration logic is duplicated** across orchestrator `.md` files, CLAUDE.md, and PRODUCT_LOOP.md with no Single Source of Truth.
- **No `tools` restriction** on any worker subagent — no structural enforcement of "workers cannot dispatch".

---

## 2. Goals & Non-Goals

### Goals
1. Make orchestration 100% conformant to official Claude Code subagent/agent-teams conventions
2. Preserve the full pipeline intent: idea → completed app, 5-Stage flow, gate-based, Ralph Loop to 80%+, screenshot-mandatory evaluation
3. Eliminate the 3-tier nesting that violates official constraints
4. Replace text-signal handoff with file-system + TodoWrite based handoff
5. Establish Single Source of Truth for orchestration across CLAUDE.md, PRODUCT_LOOP.md, and skill bodies
6. Preserve all existing worker subagents (~28 files) with minimal disruption
7. Provide safe migration path with rollback capability

### Non-Goals
1. Rewriting worker subagent bodies (only frontmatter `tools` field added)
2. Changing the 5-Stage conceptual model or the Ralph Loop's quality gates
3. Moving to Agent Teams as the default runtime (experimental; Teams used only for M4 test isolation)
4. Porting to SDK-based programmatic agents (stay on filesystem-based + skills model)

---

## 3. Official Convention Basis

Core conventions extracted from official docs:

1. **Orchestrator is the main session, not a file.** Subagents cannot spawn subagents; nesting is prohibited.
2. **`description` frontmatter drives auto-routing.** Clear descriptions let Claude automatically delegate work.
3. **Coordination primitives are limited to 2:** subagents (main → workers, result-only) or agent teams (lead ↔ teammates, mailbox + shared task list). Both are 2-tier.
4. **Handoff primitives are `spawn prompt` (parent→child) and `final message` or `shared task list` (child→parent).** Hand-rolled text signals are not a supported channel.
5. **Quality gates via hooks** (`TaskCompleted`, `SubagentStop`, `Stop`), not imperative judgment in free text.
6. **Persistent rules live in `CLAUDE.md`** (re-injected every request, survives compaction).
7. **Contexts are isolated via subagents** — long subtasks go to workers so the main context stays lean.

---

## 4. Architecture Overview

### 4.1 Core principle
> **The only orchestrator is the main Claude session.** Skills are recipes loaded into the main's context; subagents are specialized workers that execute focused tasks. Skills never "run" — the main reads them and executes. Subagents never orchestrate — they work and return.

### 4.2 Three tiers

```
TIER 0: User
   │
   ▼
TIER 1: Main Claude Session (the only orchestrator)
   • Loads skill chain
   • Dispatches workers via Agent tool
   • File-system gate verification
   • TodoWrite stage tracking
   • User decision points
   │
   ├── loads ──► TIER 1.5: Skills (recipes)
   │             • app-factory (master)
   │             • pm-orchestrate
   │             • stitch-generate
   │             • design-sync
   │             • dev-orchestrate
   │             • ralph-persona-loop
   │             • ralph-design-loop
   │             • release-prep
   │             • bugfix-coordinate
   │             • maker-orchestrate
   │             • ait-orchestrate
   │
   └── spawns ──► TIER 2: Worker Subagents (~28)
                  • No Agent tool (structurally blocked)
                  • Fresh context per invocation
                  • Return via final message + score.yaml files
```

### 4.3 Four hard rules

1. **Tier 2 subagents must not have `Agent` in their `tools` frontmatter.** Structural enforcement of no-nesting.
2. **All orchestration logic lives in skill bodies.** Subagent bodies describe only what the subagent does for itself.
3. **Stage-to-stage handoff is file-system + TodoWrite.** Text signals like `PM_STAGE_COMPLETE` are removed.
4. **User decision points are explicitly marked in skill bodies.** All other work is autonomous.

### 4.4 Before/After

| Axis | Before | After |
|---|---|---|
| Orchestrator | 7 `*-orchestrator.md` subagents | Main Claude session only |
| Execution recipes | Subagent bodies | Skill bodies |
| Tier count | 3 (violates official constraint) | 2 (compliant) |
| Stage handoff | Text-signal parsing | File existence + TodoWrite |
| Workers | ~28 subagents | ~28 subagents (retained) |
| Nested spawn | Implicitly attempted | Structurally blocked (tools restriction) |
| `app-factory` invocation | Task tool → subagent | description match → skill OR `/app-factory` slash |

---

## 5. Component Inventory

### 5.1 Skills (total: 12)

| Skill | Source | Location | Role |
|---|---|---|---|
| `app-factory` | `pm-agent/agents/app-factory.md` | `plugins/pm-agent/skills/app-factory/SKILL.md` | Master 5-Stage pipeline conductor |
| `pm-orchestrate` | `pm-agent/agents/pm-orchestrator.md` | `plugins/pm-agent/skills/pm-orchestrate/SKILL.md` | Stage 1 recipe |
| `stitch-generate` | `design-team/agents/design-orchestrator.md` + existing `stitch-workflow` | `plugins/design-team/skills/stitch-generate/SKILL.md` | Stage 2a: Stitch screen generation |
| `design-sync` | `design-team/agents/design-sync-lead.md` | `plugins/design-team/skills/design-sync/SKILL.md` | Stage 2b: React visual sync |
| `dev-orchestrate` | `dev-team/agents/dev-orchestrator.md` | `plugins/dev-team/skills/dev-orchestrate/SKILL.md` | Stage 3 recipe |
| `ralph-persona-loop` | existing (retained, updated) | `plugins/pm-agent/skills/ralph-persona-loop.md` | Stage 4 quality loop |
| `ralph-design-loop` | existing (retained) | `plugins/design-team/skills/ralph-design-loop.md` | Inner loop of `design-sync` |
| `release-prep` | new (extracted from app-factory Stage 5) | `plugins/pm-agent/skills/release-prep/SKILL.md` | Stage 5: commit, RELEASE.md, DESIGN_RULES update |
| `bugfix-coordinate` | `dev-team/agents/bugfix-coordinator.md` | `plugins/dev-team/skills/bugfix-coordinate/SKILL.md` | Standalone bug lifecycle workflow |
| `dev-review` | `dev-team/agents/dev-reviewer.md` | `plugins/dev-team/skills/dev-review/SKILL.md` | Multi-layer code review orchestration; dispatches 12+ compound-engineering review agents across 8 review layers (security, performance, architecture, quality, language-specific, data, deployment, PR workflow) |
| `maker-orchestrate` | `agent-maker/agents/maker-orchestrator.md` | `plugins/agent-maker/skills/maker-orchestrate/SKILL.md` | Agent-maker meta workflow |
| `ait-orchestrate` | `ait-team/agents/ait-orchestrator.md` | `plugins/ait-team/skills/ait-orchestrate/SKILL.md` | Stage 8: Apps-in-Toss deployment |

### 5.2 Slash commands (total: 7)

Thin wrappers around skills for explicit invocation:

| Command | Maps to |
|---|---|
| `/app-factory <idea>` | `app-factory` skill |
| `/pm-orchestrate <app-name>` | `pm-orchestrate` skill |
| `/stitch-generate <app-name>` | `stitch-generate` skill |
| `/design-sync <app-name>` | `design-sync` skill |
| `/dev-orchestrate <app-name>` | `dev-orchestrate` skill |
| `/ralph-loop <app-name>` | `ralph-persona-loop` skill |
| `/release-prep <app-name>` | `release-prep` skill |
| `/dev-review <scope>` | `dev-review` skill |

### 5.3 Worker subagents (retained, `tools` restriction applied)

**Tier 2 convention**: frontmatter MUST include `tools:` array, MUST NOT include `Agent`.

#### pm-agent plugin

| Subagent | `tools` |
|---|---|
| `pm-discovery` | `[Read, Grep, Glob, WebSearch, WebFetch]` |
| `pm-strategist` | `[Read, Write, Grep, Glob, WebSearch]` |
| `pm-analyst` | `[Read, Write, Grep, Glob, WebSearch]` |
| `pm-executor` | `[Read, Write, Edit, Grep, Glob]` |
| `pm-gtm` | `[Read, Write, Grep, Glob]` |
| `pm-feedback-loop` | `[Read, Write, Grep, Glob, Bash]` |
| `ux-specialist` | `[Read, Write, Bash, Grep, Glob]` |
| `user-persona-tester` | `[Read, Write, Bash, Grep, Glob]` |
| `live-app-walkthrough` | `[Read, Write, Bash, Grep, Glob]` |
| `domain-expert-consultant` | `[Read, Write, Edit, Bash, Grep, Glob]` + NotebookLM MCP [^dec] |

[^dec]: `domain-expert-consultant` Phase 5 auto-fix requires `Edit` (concepts.ts, models/*.ts) and `Bash` (build verification, atomic commit). `WebSearch`/`WebFetch` unused — source verification handled via NotebookLM MCP.

#### design-team plugin

| Subagent | `tools` |
|---|---|
| `design-screen-generator` | `[Read, Write, Bash]` + Stitch MCP |
| `design-visionary` | `[Read, Write, Bash, Grep, Glob]` |
| `design-iterator` | `[Read, Edit, Bash]` + Stitch MCP |
| `design-system-manager` | `[Read, Write, Edit, Grep, Glob]` |
| `design-handoff` | `[Read, Write, Edit, Grep, Glob]` |

#### dev-team plugin

| Subagent | `tools` |
|---|---|
| `dev-architect` | `[Read, Write, Grep, Glob]` |
| `dev-backend` | `[Read, Edit, Write, Bash, Grep, Glob]` |
| `dev-frontend` | `[Read, Edit, Write, Bash, Grep, Glob]` |
| `dev-ui-engineer` | `[Read, Edit, Write, Bash, Grep, Glob]` |
| `dev-qa` | `[Read, Edit, Write, Bash, Grep, Glob]` |
| `dev-debugger` | `[Read, Edit, Bash, Grep, Glob]` |
| `dev-devops` | `[Read, Edit, Write, Bash, Grep, Glob]` |
| `flow-graph-validator` | `[Read, Write, Grep, Glob]` (read-only for source; writes validation reports) |
| `live-app-tester` | `[Read, Write, Bash, Grep, Glob]` |
| `app-qa-tester` | `[Read, Write, Bash, Grep, Glob]` |
| `ops-monitor` | `[Read, Bash, Grep, Glob]` |
| `bridge-translator` | `[Read, Edit, Write, Grep, Glob]` |

**Note on "read-only" workers**: The term "read-only" in this matrix means "cannot modify source code" (no `Edit`), NOT "cannot write any files". Workers that generate validation reports, test reports, or QA reports still need `Write` to create those new output files. The structural protection is `Edit` omission, which prevents modifying existing source files while still allowing report generation.

#### agent-maker & ait-team plugins
Worker subagents inventoried in Migration Phase M1. Same `tools` restriction rules apply. Based on M1 inventory: `ait-feature-dev` requires `WebFetch` (for TDS/SDK docs); default ait worker tools for it are `[Read, Edit, Write, Bash, Grep, Glob, WebFetch]`. Other ait workers use the standard `[Read, Edit, Write, Bash, Grep, Glob]`.

### 5.4 Deleted files (total: 9, single commit)

```
plugins/pm-agent/agents/app-factory.md
plugins/pm-agent/agents/pm-orchestrator.md
plugins/design-team/agents/design-orchestrator.md
plugins/design-team/agents/design-sync-lead.md
plugins/dev-team/agents/dev-orchestrator.md
plugins/dev-team/agents/dev-reviewer.md
plugins/dev-team/agents/bugfix-coordinator.md
plugins/agent-maker/agents/maker-orchestrator.md
plugins/ait-team/agents/ait-orchestrator.md
```

Git history is the rollback safety net.

### 5.5 References (retained)

- `plugins/pm-agent/references/ralph-phase-details.md` — updated for 6-evaluator structure
- `plugins/pm-agent/references/gstack-browse-setup.md` — unchanged

---

## 6. Gate & Handoff Mechanism

### 6.1 Dual-track handoff

**Track 1 — File system (source of truth).** Each stage produces files at well-known paths; the next stage's precondition is "these files exist and contain required content".

**Track 2 — TodoWrite (progress tracking).** Each stage is a Todo task; sub-steps are nested tasks. Main session has always-visible progress.

Both tracks are independent but complementary: files = binary has/has-not evidence; TodoWrite = continuous where-are-we state.

### 6.2 Gate verification strictness

**Level B — keyword grep** (confirmed choice):
- File existence check via Glob
- Required header/section check via Grep
- No structural parsing (too brittle)

Rigorous content validation is pushed into the worker that produces the file (e.g., `pm-executor` validates its own PRD before returning).

### 6.3 Stage gates

#### Stage 1 → 2
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

#### Stage 2 → 3
```yaml
required_files:
  - apps/{app}/docs/design/sync-criteria.md
  - apps/{app}/docs/ground-truth/*.png  (min 3)
  - apps/{app}/src/App.tsx
  - apps/{app}/docs/design/stitch-project-id.txt
content_checks:
  - sync-criteria.md: "Design Score B+" AND "폰트/색상 불일치 0"
```

#### Stage 3 → 4
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

#### Stage 4 → 5
Ralph Loop skill's internal Phase 3 judgment is the gate. Main trusts the skill's result file.
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

#### Stage 5 → DONE
```yaml
required_files:
  - apps/{app}/docs/RELEASE.md
command_checks:
  - cd apps/{app} && npm run build → exit 0
  - git status  → clean
  - git log -1  → release commit exists
```

### 6.4 Parent → subagent spawn prompt contract

Every Agent-tool spawn must include:
1. Worker role and app name
2. Context files to read first (explicit paths)
3. Concrete task
4. Constraints (protected paths, formatting rules)
5. Output requirements: final message must include `TASK_DONE: {file_path}` and the file must exist

### 6.5 Subagent → parent final message contract

Workers return only:
1. Paths of files created/modified
2. Key decisions summary (≤3 lines)
3. Recommended next step (optional)

Main does not trust final messages alone — always re-verifies via file system.

### 6.6 TodoWrite initial structure

```
[1] Stage 0: Initialize app directory          [pending]
[2] Stage 1: PM planning                        [blocked by 1]
[3] Stage 2a: Stitch screen generation          [blocked by 2]
[4] Stage 2b: Design sync                       [blocked by 3]
[5] Stage 3: Development                        [blocked by 4]
[6] Stage 4: Ralph persona loop                 [blocked by 5]
[7] Stage 5: Release prep                       [blocked by 6]
```

---

## 7. Stage-by-Stage Skill Anatomy

### 7.1 Shared skill body structure

Every skill SKILL.md has:
1. Purpose & Scope
2. Prerequisites
3. Execution Steps
4. Worker Dispatch Plan (table: phase → worker → tools → output)
5. Gate Verification
6. Error Handling
7. Final State

### 7.2 `app-factory` skill (master)

**Principle**: `app-factory` does NOT spawn workers directly. All worker dispatch is delegated to stage-specific skills. Only exceptions: Step 0 (mkdir via Bash) and final git commit (via Bash).

**Execution steps**:
- Step 0 — Initialize: confirm app name with user, create `apps/{name}/`, seed TodoWrite with 7 stages, load CLAUDE.md + DESIGN_RULES.md
- Step 1 — Invoke `pm-orchestrate` skill, verify Gate 1
- Step 2 — Invoke `stitch-generate` skill, verify Gate 2a
- Step 3 — Invoke `design-sync` skill, verify Gate 2b
- Step 4 — Invoke `dev-orchestrate` skill, verify Gate 3
- Step 5 — Invoke `ralph-persona-loop` skill, verify Gate 4
- Step 6 — Invoke `release-prep` skill, verify Gate 5

**User decision points**: Step 0 (app name), Step 1 (target segment, business model), Step 5 (launch decision if Ralph max iterations hit).

### 7.3 `pm-orchestrate` skill (Stage 1)

**Phases**:
- 1.1 Market research (parallel): `pm-analyst`, `pm-discovery`, `pm-strategist` dispatched in a single assistant turn
- 1.2 Strategy (parallel): `pm-strategist` ×2 (business model + value proposition)
- 1.3 Persona: `pm-discovery`
- 1.4 PRD (user decision point): confirm segment/BM/scope, then `pm-executor`
- 1.5 User stories + screen flows (parallel): `pm-executor` + `ux-specialist`

### 7.4 `stitch-generate` skill (Stage 2a)

**Phases**:
- 2a.1 Story→screen mapping: `design-screen-generator`
- 2a.2 Stitch project creation (main invokes `mcp__stitch__create_project` directly)
- 2a.3 Screen generation loop: `design-screen-generator` per screen (sequential, respects Stitch rate limit)
- 2a.4 Consistency check: `design-visionary` (read-only); `design-iterator` if fixes needed

### 7.5 `design-sync` skill (Stage 2b)

**Phases**:
- 2b.1 Sync criteria: 3-team parallel review (`design-visionary`, `dev-ui-engineer`, `ux-specialist`)
- 2b.2 Initial React implementation: `dev-ui-engineer`
- 2b.3 Inner loop: invoke `ralph-design-loop` skill
- 2b.4 Final verification: `design-visionary` (read-only)

### 7.6 `dev-orchestrate` skill (Stage 3)

**Phases**:
- 3.1 Architecture (sequential): `dev-architect`
- 3.2 Implementation (parallel after API contract): `dev-backend` || `dev-frontend`
- 3.3 QA: `dev-qa` (edge cases, regression)
- 3.4 Review: `dev-reviewer` (read-only)
- 3.5 Demo mode verification: `live-app-tester` (gstack browse)

**Constraint**: Do NOT dispatch `dev-ui-engineer` in this stage — Stage 2b already set the visual layer. Spawn prompts to `dev-frontend` must include "preserve Stitch Tailwind classes, no inline styles".

### 7.7 `ralph-persona-loop` skill (Stage 4) — See Section 8 for details

### 7.8 `release-prep` skill (Stage 5)

**Steps**:
1. Final `npm run build`
2. Update `DESIGN_RULES.md` with learnings from this loop
3. Generate `apps/{app}/docs/RELEASE.md`
4. Create single release commit

---

## 8. Ralph Loop Integration

### 8.1 Mapping to official 2-tier model

The main session loads `ralph-persona-loop` skill, iterates through phases, spawns workers. Iteration state lives in TodoWrite and file system.

### 8.2 Phase structure

| Phase | Type | Actor |
|---|---|---|
| 0. Flow graph validation | Single spawn | `flow-graph-validator` |
| 1. Persona generation | Single spawn | `pm-discovery` |
| 1.5. gstack /qa | Single spawn | `app-qa-tester` |
| 1.7. /browse walkthrough | Single spawn | `live-app-walkthrough` |
| 2. 6-way parallel evaluation | 6 spawns in one turn | see 8.3 |
| 3. Gate judgment | Skill body (main) | — |
| 4. Integration implementation | Multi-worker dispatch | see 8.4 |
| 5. Commit | Skill body (main Bash) | — |
| 6. New persona transition | Skill body (main TodoWrite) | — |

### 8.3 Phase 2: Six parallel evaluators (Q1-b)

| # | Worker | Evaluation | Output file |
|---|---|---|---|
| 1 | `user-persona-tester` (persona-1) | persona 1 satisfaction (5 dims) | `persona-1.md` + `persona-1-score.yaml` |
| 2 | `user-persona-tester` (persona-2) | persona 2 satisfaction | `persona-2.md` + `persona-2-score.yaml` |
| 3 | `user-persona-tester` (persona-3) | persona 3 satisfaction | `persona-3.md` + `persona-3-score.yaml` |
| 4 | `design-visionary` | Design Score + AI Slop Score | `design-visionary.md` + `-score.yaml` |
| 5 | `ux-specialist` | UX score + Time to First Value | `ux.md` + `ux-score.yaml` |
| 6 | `pm-executor` (reviewer mode) | PRD coverage verification | `prd-verification.md` + `-score.yaml` |

**#6 reviewer mode**: `pm-executor` spawn prompt explicitly says "REVIEWER mode, do NOT modify prd.md, verify implementation matches PRD".

Optional 7th evaluator (conditional): `domain-expert-consultant` spawned only for education/info apps.

### 8.4 Phase 4: Integration implementation (not a single agent)

The skill body coordinates multi-worker dispatch, NOT a single "integrator" agent. Work types:

| Change type | Worker | Tools |
|---|---|---|
| UI component/layout | `dev-ui-engineer` | `[Read, Edit, Write, Bash, Grep, Glob]` |
| Frontend logic | `dev-frontend` | `[Read, Edit, Write, Bash, Grep, Glob]` |
| Backend/data | `dev-backend` | `[Read, Edit, Write, Bash, Grep, Glob]` |
| Design regeneration | `design-iterator` | `[Read, Edit, Bash]` + Stitch MCP |

Steps (all in skill body):
1. Main reads all 6 score.yaml files
2. Main consolidates improvements_needed, resolves conflicts (P0 > P1 > P2; PRD > design > UX)
3. Main dispatches workers in parallel when edit zones don't conflict
4. Main runs `npm run build`; on failure, spawns `dev-debugger` with root-cause mandate
5. Main spawns `live-app-tester` for verification with before/after screenshots
6. Main writes `iteration-N-fix-checklist.md`

### 8.5 Parallel vs sequential (Q2-a with safety)

**Optimistic parallel with auto fallback**: main attempts 6 parallel spawns in one assistant turn. If the SDK doesn't actually parallelize or if conflicts occur:
- File-based verification catches missing outputs
- Individual retry (sequential) for failed workers
- If N simultaneous failures, skill records `.ralph-mode.txt = sequential` and future iterations go sequential

**Screenshot isolation** ensures parallel safety even when SDK parallelism is uncertain: each worker's spawn prompt assigns a unique base path (`/tmp/ralph-iter-{N}/{role}/`).

### 8.6 Score block standard (Q3-b: separate files)

Each worker produces two outputs:
1. `{role}.md` — natural-language feedback report
2. `{role}-score.yaml` — structured score block

Score YAML schema:

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

**`owner_hint`** lets evaluators suggest which worker should handle each fix, reducing main's routing burden in Phase 4.

### 8.7 Gate judgment (Phase 3)

Main session Phase 3 logic (skill body):
1. Glob `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/*-score.yaml` → expect 6 files
2. If count < 6, mark iteration invalid, retry or fail
3. For each yaml: verify `screenshot_evidence.count > 0` (else worker must be re-spawned)
4. Aggregate scores; apply gate rules:
   - all 3 personas satisfaction ≥ 80
   - design_score ≥ B+
   - ai_slop_score ≥ B
   - visionary_score ≥ 70
   - ux_score ≥ 75
   - prd_coverage ≥ 90
5. If all pass → Phase 5 (commit); else → Phase 4 (improve) → back to Phase 1.5

### 8.8 Max iterations + termination

- `iteration_limit: 5` (default, customizable via spawn arg)
- Termination cases:
  ① All gates pass → commit + `ralph-final-report.md` generated
  ② Max iterations reached → partial-success report + user decision
  ③ Fatal failure (build broken, gstack down) → error termination, last iteration state preserved

### 8.9 `ralph-design-loop` (inner loop of `design-sync`)

Scaled-down version of persona-loop:
- 1 evaluator (`design-visionary`) + 1 verifier (`dev-ui-engineer`)
- Gate: font/color mismatches = 0
- Max iterations: 3
- Called by `design-sync` skill, not `app-factory` directly

---

## 9. Migration Path

### 9.1 Seven migration phases

**M1 — Design doc & inventory verification (no code change)**
- Save this spec (this document) + commit
- Inventory all unread files: `agent-maker/`, `ait-team/`, all worker `.md` files
- Verify Claude Code version ≥ 2.1.32 (required for Teams in M4)
- Verify `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is set (or plan to set)

**M2 — Worker `tools` restriction (low risk)**
- Add `tools:` field to ~28 worker subagents per Section 5.3 matrix
- Do NOT touch orchestrator files yet
- Single commit: `refactor(agents): add tools restriction to worker subagents per official convention`

**M3 — New skills + slash commands (no existing-file impact)**
- Write 11 skills in dependency order: release-prep → ralph loops → pm-orchestrate → stitch-generate → design-sync → dev-orchestrate → bugfix-coordinate → maker-orchestrate → ait-orchestrate → app-factory
- Write 7 slash commands
- Orchestrator files remain untouched (coexistence)
- Single commit: `feat(skills): add 11 orchestration skills + 7 slash commands`

**M4 — Test app build via Agent Teams (Go/No-Go gate)**
- Spawn a teammate via Agent Teams with prompt: "Use /app-factory skill to build '하루 감사 일기' app end-to-end. Report per-stage pass/fail and any skill errors."
- Teammate has isolated context; main session only receives final summary
- Alternatively (fallback): run the same test in a separate Claude Code session via `git worktree add ../plz-survive-jay-test`
- **Go criteria**: all 5 stages pass gates, app builds, Ralph runs at least 1 iteration
- **No-go**: stop M4, fix failing skills, re-run

**M5 — Deprecation markers on legacy orchestrators (soft)**
- Add `[DEPRECATED — use {skill} skill instead]` to description field of 8 files
- Add warning block at top of body pointing to new skill
- Files still exist (rollback safety)
- Single commit: `chore: mark orchestrator subagents as deprecated, point to new skills`
- **PR #1 ends here** (M1 through M5)

**Wait period ≥ 1 day.** Use the repo with new skills. If issues surface, old orchestrators are still live as fallback.

**M6 — Actual deletion (PR #2 begins)**
- Grep for references to 8 old orchestrators across all `.md` files
- Update any remaining references to skill names
- `git rm` the 8 files
- Re-run M4 test app to confirm still works
- Single commit: `refactor(plugins): remove legacy orchestrator subagents, replaced by skills`

**M7 — Documentation realignment**
- Rewrite CLAUDE.md pipeline section (see Section 10)
- Reposition PRODUCT_LOOP.md as philosophy doc
- Update `ralph-phase-details.md` for 6-evaluator structure
- Create `docs/ORCHESTRATION_MODEL.md` ADR
- Single commit: `docs: realign CLAUDE.md and PRODUCT_LOOP.md to new orchestration model`
- **PR #2 ends here** (M6, M7)

### 9.2 Rollback strategy

- M1–M5: single commits, `git revert` clears any one phase
- M4 failure → fix-forward in M3 before proceeding
- Worst case: revert PR #1 entirely → back to pre-redesign state, M1 spec survives as planning artifact
- M6–M7 revert → new skills removed, old orchestrators return

### 9.3 PR split rationale

PR #1 = additive (new skills, new tools field, deprecation markers). Nothing removed. Safe.
PR #2 = subtractive (delete old orchestrators). Only proceeds after real-world validation.
Benefit: any bug in PR #1 has a live fallback via the old orchestrators that still exist.

### 9.4 Test app for M4

**"하루 감사 일기" (Daily Gratitude Journal)**

Rationale:
- Stage 1: 3 distinct personas possible (busy professional, college student needing mental care, working mom in 40s)
- Stage 2: 5-6 screens (home, entry, calendar, detail, weekly reflection, settings)
- Stage 3: localStorage-based demo mode is natural
- Stage 4: persona differences meaningfully affect Ralph feedback
- NOT education/finance/medical → `domain-expert-consultant` conditional NOT triggered → baseline pipeline tested
- Usable afterward (not throwaway)

---

## 10. Documentation Realignment

### 10.1 Three-layer SSOT

| Layer | File | Responsibility | Audience |
|---|---|---|---|
| 1. Persistent rules | `CLAUDE.md` | pipeline map, plugin list, absolute rules, directory conventions | main + all workers (every request) |
| 2. Process philosophy | `PRODUCT_LOOP.md` | why this loop, v1→v2 evolution, core principles | humans, design readers |
| 3. Execution recipes | `plugins/*/skills/*/SKILL.md` | concrete execution steps, gate conditions | main session (on skill load) |
| 4. Detailed references | `ralph-phase-details.md`, `gstack-browse-setup.md` | phase commands, checklists | skills (on reference lookup) |
| 5. ADR | `docs/ORCHESTRATION_MODEL.md` | why this architecture | future maintainers |

### 10.2 CLAUDE.md rewrite (affected sections only)

Replace the current "새 앱 만들기" and "파이프라인" sections with:

```markdown
## 새 앱 만들기 — 완전 자동화

### 원커맨드 실행
`/app-factory <idea>` or natural language `"<idea> 만들어줘"`
(auto-matches the app-factory skill via description)

### 파이프라인 (skill chain)
| Stage | Skill | Output | Gate |
|---|---|---|---|
| 1 | pm-orchestrate | prd.md, user-stories.md, screen-flows.md, persona.md | 4 files + content check |
| 2a | stitch-generate | Stitch screens, ground-truth/*.png | screen count match |
| 2b | design-sync | React components, sync-criteria.md | Design Score ≥ B+ |
| 3 | dev-orchestrate | buildable src/, demo mode | npm run build success |
| 4 | ralph-persona-loop | iteration-N-*.md, ralph-final-report.md | 6 evaluators all pass |
| 5 | release-prep | RELEASE.md, git commit | build + commit success |

### Manual execution (individual stages)
/pm-orchestrate, /stitch-generate, /design-sync, /dev-orchestrate, /ralph-loop, /release-prep

### Orchestration principles
- The only orchestrator is the main Claude session
- Worker subagents MUST NOT spawn other subagents (tools restriction enforced)
- Stage transitions verified by file system + TodoWrite, not text signals
- Execution details live in skill bodies; CLAUDE.md is a map

### Apps-in-Toss deployment
`/ait-orchestrate <app-name>`
```

Keep: directory structure, plugin installation, absolute rules, conventions, session continuation.
Remove: completion-signal descriptions (text signals are gone).

### 10.3 PRODUCT_LOOP.md repositioning

Add notice at top:
```markdown
> 📖 This document describes the **philosophy and principles** of the pipeline.
> For actual execution order, commands, and concrete tasks, see each stage's skill body (`plugins/*/skills/*/SKILL.md`).
> For the Stage ↔ Skill mapping, see the pipeline table in `CLAUDE.md`.
```

- Keep: overall flow diagram, per-Phase purpose/philosophy, v1→v2 comparison, core principles
- Remove: "1 agent", "3 parallel agents" execution instructions (moved to skill bodies)
- Remove: command examples (moved to CLAUDE.md or skills)
- Add: per-Phase one-line reference to corresponding skill

### 10.4 `ralph-phase-details.md` update

- Collapse Phases 2, 2.5, 2.6, 2.7 into "Phase 2: 6-way parallel evaluation"
- Add the Score Block YAML schema
- Update worker role references (e.g., Phase 2 worker is `user-persona-tester`, not implicit)

### 10.5 New file: `docs/ORCHESTRATION_MODEL.md`

Short ADR capturing:
- Why orchestrators are skills, not subagents (official 2-tier constraint)
- Why text handoff signals were removed (compaction risk)
- Why Ralph Phase 4 is multi-worker dispatch, not a single integrator
- Why `tools` restriction is enforced on workers
- Key official-docs references

---

## 11. Risks & Open Questions

### 11.1 Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Agent Teams experimental feature unavailable in M4 | Medium | Fallback to `git worktree` + separate Claude Code session |
| Skill description matching fails to auto-route | Low | Slash commands provide explicit invocation |
| gstack browse multi-session conflicts in Ralph Phase 2 parallel spawn | Medium | Screenshot isolation via per-worker base paths; auto-fallback to sequential mode |
| Hidden orchestrator pattern in `agent-maker` or `ait-team` not yet inventoried | Low | M1 inventory phase reads all remaining files |
| Token cost increase from skill reloading on every stage | Low | Skills are cached by prompt-caching per official docs |
| `pm-executor` reviewer mode conflicts with writer mode | Low | Spawn prompt explicitly sets mode; file paths protect prd.md |

### 11.2 Resolved in M1 (2026-04-10)

1. **Q: Are `maker-orchestrator.md` and `ait-orchestrator.md` really orchestrators or self-contained workers?**
   Resolution: Both are TRUE ORCHESTRATORS.
   - `maker-orchestrator` coordinates maker-researcher, maker-architect, maker-builder, maker-validator in a 4-phase pipeline (research → design → build → validate).
   - `ait-orchestrator` coordinates ait-planner, ait-scaffolder, ait-feature-dev, ait-verifier in a 4-phase pipeline (init → scaffold → develop → verify).
   - Spec impact: both confirmed in Section 5.4 deletion list. No change.

2. **Q: Does `agent-maker` plugin have a "master" that creates other agents?**
   Resolution: Yes — `maker-orchestrator` is that master. Becomes `maker-orchestrate` skill per Section 5.1. No additional master pattern found.

3. **Q: Is `ralph-phase-details.md` reference path still valid?**
   Resolution: CONFIRMED VALID. File exists at `plugins/pm-agent/references/ralph-phase-details.md` and is correctly referenced at line 84 of `ralph-persona-loop.md` ("각 Phase의 상세 워크플로우는 `references/ralph-phase-details.md`를 참조."). No change needed.

### 11.2.1 Additional M1 Environment Findings

- Claude Code version: 2.1.97 (≥ 2.1.32 required for Agent Teams ✅)
- CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: enabled in ~/.claude/settings.json ✅
- tmux: 3.5a installed ✅
- M4 prerequisites: all met, split-pane Teams mode available.

### 11.2.2 Late-stage finding during Task 17 verification

During Task 17 global verification of the `tools` restriction, we discovered that `dev-reviewer.md` is a hidden orchestrator, not a worker. Its body contains 8 "Review Layers" tables listing 12+ compound-engineering review agents to "Launch" in parallel.

This was missed in M1 Task 5 inventory because the subagent checked frontmatter and top-level body patterns but not detailed table contents.

Corrective action taken:
- Section 5.1: Added `dev-review` skill (12 skills total now, up from 11)
- Section 5.2: Added `/dev-review` slash command
- Section 5.3: Removed `dev-reviewer` row from dev-team tools matrix
- Section 5.4: Added `dev-reviewer.md` to deletion list (9 files total now, up from 8)

Interim behavior (Plan 1–3): The tools restriction `[Read, Grep, Glob]` remains in place on `dev-reviewer.md`. This structurally blocks its nested orchestration (which was always violating the official 2-tier constraint). dev-reviewer calls will behave as a single-worker code review during the interim period until Plan 4 replaces it with the `dev-review` skill. Users of `dev-reviewer` should explicitly invoke `/dev-review` once the skill lands.

### 11.3 Non-obvious decisions logged

- **Keep `pm-executor` for both PRD writing (Stage 1) AND PRD verification (Ralph Phase 2)**: reviewer mode is set via spawn prompt. Avoids creating a new agent with duplicate context. **Structural protection**: when spawned in reviewer mode, the spawn prompt explicitly omits `Edit` from the effective tools — reviewer can only `Write` new verification files, not edit existing `prd.md`. This elevates the protection from protocol to structure.
- **6 parallel evaluators, not 5**: PRD verification separated from UX score. Stability/clarity over token savings.
- **`design-orchestrator` split into two skills** (`stitch-generate` + `design-sync`), not one: Stage 2a and 2b have different inputs/outputs and can be independently re-run.
- **`release-prep` as separate skill**, not inline in `app-factory`: enables standalone execution for existing apps.
- **2-PR migration split**, not single PR: provides real-world validation window between additive and subtractive changes.

---

## 12. Success Criteria

This redesign is considered successful when:

1. ✅ All orchestration is 2-tier (main ↔ workers); no subagent spawns another subagent
2. ✅ `/app-factory "<idea>"` produces a buildable app with demo mode in a single invocation
3. ✅ No text-based handoff signals remain; all transitions verified by file system
4. ✅ All 28 workers have explicit `tools` restriction with no `Agent`
5. ✅ CLAUDE.md, PRODUCT_LOOP.md, and `ralph-phase-details.md` are consistent with skill bodies
6. ✅ M4 test app ("하루 감사 일기") completes end-to-end via Agent Teams with main session context pollution < 5% of equivalent in-session build
7. ✅ Rollback of PR #1 or PR #2 independently returns repo to known-good state
8. ✅ Original user complaint resolved: orchestration is now explicitly specified — every question "who does X?" has exactly one answer location

---

## 13. Next Step

Upon user approval of this spec:
1. User reviews this file
2. If approved → invoke `superpowers:writing-plans` skill to produce a detailed implementation plan per migration phase (M1–M7)
3. Execute M1, commit spec update with any findings
4. Proceed through M2–M7 per plan

---

## Appendix A — Pipeline diagram (post-redesign)

```
User: "<idea> 만들어줘"
  │
  ▼
Main Claude Session
  │ loads app-factory skill (auto via description) or /app-factory
  │
  ├─ Step 0: Initialize (mkdir, TodoWrite seed)
  │    └─ user decision: app name
  │
  ├─ Step 1: Skill.load(pm-orchestrate)
  │    ├─ parallel dispatch: pm-analyst, pm-discovery, pm-strategist
  │    ├─ sequential: pm-strategist (BM/VP), pm-discovery (persona)
  │    │     └─ user decisions: segment, BM, MVP scope
  │    ├─ parallel: pm-executor (PRD, user-stories), ux-specialist (screen-flows)
  │    └─ Gate 1: 4 files + content checks
  │
  ├─ Step 2: Skill.load(stitch-generate)
  │    ├─ design-screen-generator: story→screen map
  │    ├─ mcp__stitch__create_project (main direct)
  │    ├─ loop: design-screen-generator per screen
  │    ├─ design-visionary: consistency
  │    ├─ design-iterator: conditional fixes
  │    └─ Gate 2a: ground-truth files
  │
  ├─ Step 3: Skill.load(design-sync)
  │    ├─ parallel: design-visionary, dev-ui-engineer, ux-specialist (sync criteria)
  │    ├─ dev-ui-engineer: initial React impl
  │    ├─ Skill.load(ralph-design-loop): inner iteration to visual convergence
  │    ├─ design-visionary: final verification
  │    └─ Gate 2b: Design Score ≥ B+, mismatches = 0
  │
  ├─ Step 4: Skill.load(dev-orchestrate)
  │    ├─ dev-architect
  │    ├─ parallel: dev-backend || dev-frontend
  │    ├─ dev-qa
  │    ├─ dev-reviewer
  │    ├─ live-app-tester: demo verification
  │    └─ Gate 3: npm run build success + demo mode
  │
  ├─ Step 5: Skill.load(ralph-persona-loop)
  │    ├─ iteration N:
  │    │    ├─ Phase 0: flow-graph-validator
  │    │    ├─ Phase 1: pm-discovery (persona)
  │    │    ├─ Phase 1.5: app-qa-tester
  │    │    ├─ Phase 1.7: live-app-walkthrough
  │    │    ├─ Phase 2: 6-way parallel (personas×3, design-visionary, ux-specialist, pm-executor-reviewer)
  │    │    ├─ Phase 3: gate judgment (skill body)
  │    │    ├─ Phase 4: multi-worker fix dispatch
  │    │    └─ Phase 5: commit
  │    ├─ iteration++ if gates fail, max 5
  │    └─ Gate 4: ralph-final-report.md generated
  │
  ├─ Step 6: Skill.load(release-prep)
  │    ├─ final npm run build
  │    ├─ update DESIGN_RULES.md
  │    ├─ generate RELEASE.md
  │    ├─ single release commit
  │    └─ Gate 5: release commit exists
  │
  └─ DONE: report to user
```

## Appendix B — Confirmed user decisions during brainstorming

1. Approach A (flatten to 2-tier) chosen over B (hollow middle orchestrators) and C (Agent Teams for everything)
2. `app-factory` invocation: skill + slash command (both)
3. Worker `tools` restriction: structural enforcement
4. Legacy orchestrator files: delete + move to skills
5. `design-orchestrate` split into `stitch-generate` + `design-sync` (two skills)
6. `bugfix-coordinator` is an orchestrator → converted to `bugfix-coordinate` skill
7. Ralph Phase 4 "integrator" is not a single agent → skill body dispatches dev-* workers
8. Gate strictness: Level B (keyword grep)
9. Ralph Phase 2: 6 parallel evaluators (PRD Verifier separated)
10. Score blocks: separate YAML files per worker (not inline in final message)
11. Ralph parallel mode: optimistic parallel + auto sequential fallback
12. M4 test execution: Agent Teams teammate (primary), git worktree (fallback)
13. M4 test app: "하루 감사 일기"
14. Migration: 2-PR split (PR1 = M1-M5 additive, PR2 = M6-M7 subtractive)
15. `ORCHESTRATION_MODEL.md` ADR: create as separate file
