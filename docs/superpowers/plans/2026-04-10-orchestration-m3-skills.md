# Orchestration Redesign — Plan 2: M3 Skills + Slash Commands

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write 12 orchestration skills and 8 slash commands that encode all pipeline execution logic in the main Claude session's recipe layer, replacing the (still-present) legacy orchestrator subagents per the 2-tier architecture defined in the spec.

**Architecture:** Additive only — no legacy files touched. Each skill is a recipe the main session loads and executes itself; skills dispatch workers via the Agent tool but never via other skills (except `app-factory` which chains other skills, and `design-sync` which inner-loops `ralph-design-loop`). Skill bodies are transformations of the legacy `*-orchestrator.md` bodies into the Skill Anatomy format (spec §7.1). Legacy orchestrator files continue to coexist as rollback fallbacks until Plan 4 (M6) deletes them.

**Tech Stack:** Markdown + YAML frontmatter, Claude Code Skills, filesystem-based workers, TodoWrite, gstack browse.

**Spec reference:** `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md`. Authoritative sections for Plan 2:
- §4 Architecture Overview (tier model, four hard rules)
- §5.1 Skills table (12 rows)
- §5.2 Slash commands table (8 rows)
- §6 Gate & Handoff Mechanism (every skill references it)
- §7 Stage-by-Stage Skill Anatomy (skill body template)
- §8 Ralph Loop Integration (ralph skills spec)
- §9.1 M3 phase definition

**Prereqs (from Plan 1, already met on branch `plan1/m1-m2-inventory-tools`):**
- All ~36 worker subagents have `tools:` frontmatter without `Agent`.
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` enabled; tmux 3.5a installed.
- Spec §11.2 Open Questions resolved.
- `dev-reviewer.md` interim tools restriction in place (Plan 2 adds `dev-review` skill that will replace it in Plan 4).

**Branch:** Continue on `plan1/m1-m2-inventory-tools`, OR create `plan2/m3-skills` from it. Recommended: create new branch so Plan 1 can be merged independently.

```bash
git checkout plan1/m1-m2-inventory-tools
git checkout -b plan2/m3-skills
```

---

## File Structure

### New files (19 total)

**12 skill files** — one `SKILL.md` per new skill, inside a folder named after the skill:

```
plugins/pm-agent/skills/app-factory/SKILL.md
plugins/pm-agent/skills/pm-orchestrate/SKILL.md
plugins/pm-agent/skills/release-prep/SKILL.md
plugins/design-team/skills/stitch-generate/SKILL.md
plugins/design-team/skills/design-sync/SKILL.md
plugins/dev-team/skills/dev-orchestrate/SKILL.md
plugins/dev-team/skills/bugfix-coordinate/SKILL.md
plugins/dev-team/skills/dev-review/SKILL.md
plugins/agent-maker/skills/maker-orchestrate/SKILL.md
plugins/ait-team/skills/ait-orchestrate/SKILL.md
```

**2 updated skill files** (existing flat files → moved into folders with updated content):

```
plugins/pm-agent/skills/ralph-persona-loop/SKILL.md    (was plugins/pm-agent/skills/ralph-persona-loop.md)
plugins/design-team/skills/ralph-design-loop/SKILL.md  (was plugins/design-team/skills/ralph-design-loop.md)
```

**8 slash command files** — one per command, in the most natural plugin:

```
plugins/pm-agent/commands/app-factory.md
plugins/pm-agent/commands/pm-orchestrate.md
plugins/pm-agent/commands/release-prep.md
plugins/pm-agent/commands/ralph-loop.md
plugins/design-team/commands/stitch-generate.md
plugins/design-team/commands/design-sync.md
plugins/dev-team/commands/dev-orchestrate.md
plugins/dev-team/commands/dev-review.md
```

### Files NOT touched in Plan 2

- Any legacy `plugins/*/agents/*-orchestrator.md` file → deleted in Plan 4 (M6).
- `CLAUDE.md`, `PRODUCT_LOOP.md` → rewritten in Plan 4 (M7).
- Worker subagents → frontmatter already set in Plan 1.

### Shared skill body structure (spec §7.1) — every SKILL.md must contain these sections in this exact order

1. `# {Skill Name}` (H1 heading)
2. `## Purpose & Scope` — 2-4 sentences: what this skill does, when to invoke, what it does NOT do.
3. `## Prerequisites` — bullet list: required files from prior stage, required env vars, gate from prior stage.
4. `## Execution Steps` — numbered phases matching the spec §7.x breakdown for the stage. Each phase = one paragraph + a worker dispatch directive or a direct-action directive.
5. `## Worker Dispatch Plan` — a table with columns: `Phase | Worker | Mode (parallel/sequential) | Spawn Prompt Key Points | Expected Output`.
6. `## Gate Verification` — literal Glob/Grep/Bash commands the main session must run to verify the stage's output gate (spec §6.3 or §8.7).
7. `## Error Handling` — what to do when a worker returns an error, a file is missing, a build fails. Reference to fallback workers (`dev-debugger`, sequential retry).
8. `## Final State` — what files must exist, what TodoWrite item to mark complete, what the handoff to the next skill looks like.

### Frontmatter contract (every SKILL.md)

```yaml
---
name: {skill-name}
description: {one-line trigger phrase used by Claude's skill auto-match; must include the stage number and user-facing intent, e.g., "Stage 1 PM planning — produces PRD, user stories, screen flows, persona for a new app"}
---
```

**No `tools:` field on skills.** Skills inherit main session tools. Tools restriction only applies to subagents (Plan 1).

---

## Task ordering rationale

Write skills in **dependency order** so later skills can reference earlier ones:

1. Leaf skills first (no inner skill invocations): `release-prep`, `ralph-design-loop`, `bugfix-coordinate`, `dev-review`, `maker-orchestrate`, `ait-orchestrate`.
2. Mid-tier skills: `pm-orchestrate`, `stitch-generate`, `design-sync` (inner-loops `ralph-design-loop`), `dev-orchestrate`, `ralph-persona-loop`.
3. Master skill last: `app-factory` (chains all five stage skills).
4. Slash commands last — purely mechanical wrappers, they all look the same.

Commit after each skill (or logical pair) so the git history is bisectable.

---

## Phase M3.A: Leaf skills (no inner skill invocations)

---

### Task 1: `release-prep` skill (Stage 5)

**Files:**
- Create: `plugins/pm-agent/skills/release-prep/SKILL.md`

**Source material (read first, do not copy verbatim):**
- `plugins/pm-agent/agents/app-factory.md` — locate the Stage 5 block in its body. That prose becomes the basis for this skill.
- Spec §7.8 — authoritative step list.

- [ ] **Step 1: Read source files**

Use Read on:
- `plugins/pm-agent/agents/app-factory.md` (full file)
- `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md` offset 429 limit 20 (§7.8)
- `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md` offset 321 limit 15 (§6.3 Stage 5 gate)

- [ ] **Step 2: Create `plugins/pm-agent/skills/release-prep/` directory and write `SKILL.md`**

The SKILL.md body must contain all 8 shared sections. Concrete content requirements:

- `name`: `release-prep`
- `description`: `Stage 5 release preparation — final build verification, DESIGN_RULES.md update, RELEASE.md generation, single release commit. Invoked after Ralph Loop closes.`
- **Purpose & Scope**: last stage of the app-factory pipeline; standalone-executable for existing apps that need a re-release.
- **Prerequisites**: `apps/{app}/docs/pm-outputs/ralph-final-report.md` exists; Ralph gate passed (spec §6.3 Stage 4 → 5); `apps/{app}/` builds cleanly.
- **Execution Steps** (4 numbered phases, matching spec §7.8):
  1. Run `cd apps/{app} && npm run build`; abort on non-zero exit.
  2. Read Ralph learnings and append new AI anti-patterns to `DESIGN_RULES.md` (root). Main session does this directly via Edit — no worker dispatch.
  3. Generate `apps/{app}/docs/RELEASE.md` from the Ralph final report + PRD. Main writes directly (no worker dispatch — content synthesis is cheap).
  4. Stage all changes and create a single commit `release({app}): v1.0` via Bash.
- **Worker Dispatch Plan**: empty table with a one-line note "This skill does not dispatch workers; all actions are direct main-session Bash/Edit/Write calls."
- **Gate Verification**: literal commands from spec §6.3 Stage 5 → DONE block.
- **Error Handling**: build failure → invoke `bugfix-coordinate` skill (not a worker); git dirty after commit → halt, report to user.
- **Final State**: release commit on branch; `apps/{app}/docs/RELEASE.md` present; TodoWrite Stage 5 item marked complete.

- [ ] **Step 3: Verify frontmatter YAML parses and no `tools:` field is present**

Run:
```bash
head -n 5 plugins/pm-agent/skills/release-prep/SKILL.md
```
Expected: three `---` delimited lines with `name:` and `description:` only.

- [ ] **Step 4: Commit**

```bash
git add plugins/pm-agent/skills/release-prep/SKILL.md
git commit -m "feat(skills): add release-prep skill (Stage 5)"
```

---

### Task 2: `ralph-design-loop` skill update

**Files:**
- Delete old location: `plugins/design-team/skills/ralph-design-loop.md`
- Create: `plugins/design-team/skills/ralph-design-loop/SKILL.md`

**Source material:**
- Existing `plugins/design-team/skills/ralph-design-loop.md` (read and carry forward its content)
- Spec §8.9 (`ralph-design-loop` inner loop definition)

- [ ] **Step 1: Read existing file**

Read `plugins/design-team/skills/ralph-design-loop.md` and capture its current body content.

- [ ] **Step 2: Write new SKILL.md at folder location**

Produce `plugins/design-team/skills/ralph-design-loop/SKILL.md` that:
- Has frontmatter: `name: ralph-design-loop`, `description: Inner visual convergence loop — iterates design-visionary evaluation and dev-ui-engineer fixes until font/color mismatches reach zero. Called by design-sync skill.`
- Uses the 8-section shared structure.
- **Purpose & Scope**: scaled-down Ralph loop focused on visual match only. NOT invoked directly by `app-factory`.
- **Prerequisites**: Stitch ground-truth PNGs exist at `apps/{app}/docs/ground-truth/*.png`; initial React implementation built by `dev-ui-engineer`.
- **Execution Steps**: 1 evaluator (`design-visionary`) + 1 fixer (`dev-ui-engineer`); sequential iterations; max 3.
- **Worker Dispatch Plan**: two rows (`design-visionary` read-only eval, `dev-ui-engineer` Edit/Write/Bash fix).
- **Gate Verification**: font/color mismatches = 0 per `design-visionary` final report. Use Grep for "불일치 0" or "mismatches: 0".
- **Error Handling**: after 3 iterations without convergence → return partial report + surface to user.
- **Final State**: `apps/{app}/docs/design/visual-sync-report.md` created; TodoWrite sub-task marked complete.

Preserve any actionable content from the old file that is not captured above. Discard any instructions that imply multi-tier nested orchestration.

- [ ] **Step 3: Delete old flat-file location**

```bash
git rm plugins/design-team/skills/ralph-design-loop.md
```

- [ ] **Step 4: Commit**

```bash
git add plugins/design-team/skills/ralph-design-loop/SKILL.md
git commit -m "refactor(skills): relocate ralph-design-loop to SKILL.md folder with 2-tier rewrite"
```

---

### Task 3: `bugfix-coordinate` skill

**Files:**
- Create: `plugins/dev-team/skills/bugfix-coordinate/SKILL.md`

**Source material:**
- `plugins/dev-team/agents/bugfix-coordinator.md` (full body)
- Spec §5.1 row 9

- [ ] **Step 1: Read source**

Read the full body of `plugins/dev-team/agents/bugfix-coordinator.md`. Identify the distinct phases it describes (reproduce → diagnose → fix → verify → commit is the typical shape).

- [ ] **Step 2: Write SKILL.md**

- `name`: `bugfix-coordinate`
- `description`: `Standalone bug lifecycle — reproduce, diagnose, fix, verify, commit. Invoked for any reported bug in an existing app.`
- **Execution Steps**: Translate each phase in the legacy body to a numbered phase here. Each phase either (a) dispatches one worker via Agent tool or (b) is a direct main-session action (file read, Bash command). Replace any "spawn another orchestrator" instruction with "the main session runs this step directly".
- **Worker Dispatch Plan** — likely includes:
  - `dev-debugger` for reproduce/diagnose (Read, Edit, Bash, Grep, Glob)
  - `dev-backend` or `dev-frontend` for fix (choice based on bug area)
  - `app-qa-tester` or `live-app-tester` for verification (screenshot-mandatory)
  - Main session for commit
- **Gate Verification**: bug repro test fails before fix, passes after; `npm run build` exit 0; screenshot evidence file exists.
- **Error Handling**: if fix causes regression → spawn `dev-debugger` again with the regression trace; if 3 attempts fail → user decision.
- **Final State**: bugfix commit on branch; verification screenshot committed under `.gstack/qa-reports/`.

- [ ] **Step 3: Commit**

```bash
git add plugins/dev-team/skills/bugfix-coordinate/SKILL.md
git commit -m "feat(skills): add bugfix-coordinate skill"
```

---

### Task 4: `dev-review` skill (NEW — Plan 1 late finding)

**Files:**
- Create: `plugins/dev-team/skills/dev-review/SKILL.md`

**Source material:**
- `plugins/dev-team/agents/dev-reviewer.md` — contains 8 Review Layers tables listing 12+ compound-engineering review agents.
- Spec §5.1 row 10

- [ ] **Step 1: Read source**

Read the full body of `plugins/dev-team/agents/dev-reviewer.md`. Enumerate all review layers and all compound-engineering review agents referenced (e.g., `kieran-rails-reviewer`, `pattern-recognition-specialist`, `security-sentinel`, `performance-oracle`, etc.).

- [ ] **Step 2: Write SKILL.md**

- `name`: `dev-review`
- `description`: `Multi-layer code review — dispatches compound-engineering reviewer agents across security, performance, architecture, quality, language-specific, data, deployment, and PR workflow layers.`
- **Purpose & Scope**: full code review orchestration skill; replaces the legacy `dev-reviewer` subagent's hidden orchestration pattern.
- **Prerequisites**: a git diff or branch to review; specified scope (file path, PR number, or branch name).
- **Execution Steps**: 8 numbered phases — one per review layer. Each phase dispatches 1-3 compound-engineering review agents in parallel via Agent tool (these are pre-existing agents, not workers we own; their names stay as-is).
- **Worker Dispatch Plan**: full table with all 12+ reviewer agents grouped by layer, with a "Parallel within layer, sequential across layers" note. Each row's Spawn Prompt Key Points must include "scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low".
- **Gate Verification**: all layers returned reports; no `critical` severity findings unresolved. Use Grep on collected reports.
- **Error Handling**: agent timeout → skip that layer, mark partial in final summary; never block on a single reviewer.
- **Final State**: consolidated review report at `docs/reviews/{date}-{scope}.md`; summary printed to main session.

- [ ] **Step 3: Commit**

```bash
git add plugins/dev-team/skills/dev-review/SKILL.md
git commit -m "feat(skills): add dev-review skill replacing dev-reviewer hidden orchestrator"
```

---

### Task 5: `maker-orchestrate` skill

**Files:**
- Create: `plugins/agent-maker/skills/maker-orchestrate/SKILL.md`

**Source material:**
- `plugins/agent-maker/agents/maker-orchestrator.md` (4-phase pipeline per spec §11.2 resolution)

- [ ] **Step 1: Read source**

Read the full body. Confirm the 4 phases: research → design → build → validate, with workers `maker-researcher`, `maker-architect`, `maker-builder`, `maker-validator`.

- [ ] **Step 2: Write SKILL.md**

- `name`: `maker-orchestrate`
- `description`: `Agent-maker meta workflow — research existing agents, design new agent spec, build agent .md file, validate against conventions. Invoked when user asks to create or modify a Claude Code agent.`
- **Execution Steps**: 4 numbered phases mirroring legacy phases. Each dispatches exactly one worker sequentially (dependencies are strict: design needs research output; build needs design output; validate needs build output).
- **Worker Dispatch Plan**: 4 rows, all sequential, all single-worker.
- **Gate Verification**: validator returns pass; new agent `.md` file exists with valid frontmatter (`grep '^name:'`).
- **Error Handling**: validator fail → loop back to build phase with validator feedback, max 2 retries.
- **Final State**: new/updated agent file committed; summary of changes.

- [ ] **Step 3: Commit**

```bash
git add plugins/agent-maker/skills/maker-orchestrate/SKILL.md
git commit -m "feat(skills): add maker-orchestrate skill"
```

---

### Task 6: `ait-orchestrate` skill

**Files:**
- Create: `plugins/ait-team/skills/ait-orchestrate/SKILL.md`

**Source material:**
- `plugins/ait-team/agents/ait-orchestrator.md` (4-phase pipeline: init → scaffold → develop → verify)

- [ ] **Step 1: Read source**

Read the full body. Confirm workers: `ait-planner`, `ait-scaffolder`, `ait-feature-dev`, `ait-verifier`. Note that `ait-feature-dev` has `WebFetch` in its tools (Plan 1 M1 finding).

- [ ] **Step 2: Write SKILL.md**

- `name`: `ait-orchestrate`
- `description`: `Apps-in-Toss deployment pipeline — init, scaffold, feature integration, granite build, verification. Invoked when user asks to deploy an existing app to Apps in Toss.`
- **Prerequisites**: an existing app under `apps/{app}/` that has passed Stage 5 of the main pipeline.
- **Execution Steps**: 4 numbered phases matching legacy orchestrator. Each dispatches one worker sequentially.
- **Worker Dispatch Plan**: 4 rows. `ait-feature-dev` row must note its `WebFetch` tool for TDS/SDK docs lookup.
- **Gate Verification**: `granite build` exits 0; verification screenshots exist.
- **Error Handling**: scaffold fail → halt; feature-dev fail → re-dispatch with error trace (max 2 retries); verifier fail → user decision.
- **Final State**: `apps/{app}/.ait-build/` contains deployable bundle; verification report exists.

- [ ] **Step 3: Commit**

```bash
git add plugins/ait-team/skills/ait-orchestrate/SKILL.md
git commit -m "feat(skills): add ait-orchestrate skill"
```

---

## Phase M3.B: Mid-tier skills

---

### Task 7: `pm-orchestrate` skill (Stage 1)

**Files:**
- Create: `plugins/pm-agent/skills/pm-orchestrate/SKILL.md`

**Source material:**
- `plugins/pm-agent/agents/pm-orchestrator.md`
- Spec §7.3

- [ ] **Step 1: Read source files**

Read `plugins/pm-agent/agents/pm-orchestrator.md` and spec §7.3 (offset ~391 limit 10). Enumerate the 5 phases listed in spec §7.3.

- [ ] **Step 2: Write SKILL.md**

- `name`: `pm-orchestrate`
- `description`: `Stage 1 PM planning — produces PRD, user stories, screen flows, and persona for a new app. First stage of app-factory pipeline.`
- **Prerequisites**: `apps/{app}/` directory exists (from Stage 0); user has confirmed app name; CLAUDE.md and DESIGN_RULES.md loaded.
- **Execution Steps** — exactly 5 numbered phases from spec §7.3:
  1. **1.1 Market research (parallel)**: dispatch `pm-analyst`, `pm-discovery`, `pm-strategist` in a single assistant turn (3 parallel Agent tool calls).
  2. **1.2 Strategy (parallel)**: two sequential `pm-strategist` spawns (business model + value proposition) — note: spec says parallel ×2; this means two spawns in one turn with different spawn prompts.
  3. **1.3 Persona**: single `pm-discovery` spawn.
  4. **1.4 PRD** — **USER DECISION POINT**: main session asks the user to confirm segment / business model / MVP scope. Skill MUST halt here and await user input before proceeding. After confirmation, dispatch `pm-executor` to write `prd.md`.
  5. **1.5 User stories + screen flows (parallel)**: dispatch `pm-executor` (user stories) and `ux-specialist` (screen flows) in parallel.
- **Worker Dispatch Plan**: table with ~7 rows covering all dispatches; columns as in §7.1 contract. Spawn-prompt key points must include: "output path under `apps/{app}/docs/pm-outputs/`", "read PRD template", and for pm-executor "WRITER mode — may Edit prd.md" (to distinguish from reviewer mode used in Ralph loop).
- **Gate Verification**: spec §6.3 Stage 1 → 2 block verbatim (4 required files + 3 content checks).
- **Error Handling**: any worker returns without writing its target file → single re-spawn with explicit path mandate; second failure → halt and report.
- **Final State**: 4 files in `apps/{app}/docs/pm-outputs/`; TodoWrite Stage 1 complete; Stage 2 unblocked.

- [ ] **Step 3: Commit**

```bash
git add plugins/pm-agent/skills/pm-orchestrate/SKILL.md
git commit -m "feat(skills): add pm-orchestrate skill (Stage 1)"
```

---

### Task 8: `stitch-generate` skill (Stage 2a)

**Files:**
- Create: `plugins/design-team/skills/stitch-generate/SKILL.md`

**Source material:**
- `plugins/design-team/agents/design-orchestrator.md`
- Existing `plugins/design-team/skills/stitch-workflow.md` (carries the Stitch MCP how-to)
- Spec §7.4

- [ ] **Step 1: Read source files**

Read all three. Enumerate the 4 phases from spec §7.4 (story→screen map, Stitch project creation, loop per screen, consistency check).

- [ ] **Step 2: Write SKILL.md**

- `name`: `stitch-generate`
- `description`: `Stage 2a design — generates Stitch screens from user stories. Main session calls mcp__stitch__create_project directly; design-screen-generator workers produce individual screens.`
- **Prerequisites**: Gate 1 passed; `apps/{app}/docs/pm-outputs/screen-flows.md` exists with ≥3 screens; Stitch MCP available in main session (MCP loaded from config, NOT from tools list — this is an important reminder in the skill body).
- **Execution Steps** (4 phases matching spec §7.4):
  1. **2a.1 Story→screen mapping**: dispatch `design-screen-generator` once to produce a mapping doc at `apps/{app}/docs/design/story-screen-map.md`.
  2. **2a.2 Stitch project creation**: main session invokes `mcp__stitch__create_project` directly (no worker). Save returned project ID to `apps/{app}/docs/design/stitch-project-id.txt`.
  3. **2a.3 Screen generation loop**: sequential loop — for each screen in the mapping, dispatch `design-screen-generator` (which uses Stitch MCP) to generate and download the PNG to `apps/{app}/docs/ground-truth/{screen-name}.png`. Sequential because Stitch rate-limits per project.
  4. **2a.4 Consistency check**: dispatch `design-visionary` (read-only). If it reports inconsistencies, dispatch `design-iterator` to fix via Stitch MCP edit.
- **Worker Dispatch Plan**: table with columns as in §7.1 contract.
- **Gate Verification**: spec §6.3 Stage 2 → 3 block (partial — Stage 2a produces ground-truth files and stitch-project-id.txt; Stage 2b produces sync-criteria.md and App.tsx).
- **Error Handling**: Stitch rate limit → wait + retry; Stitch MCP auth fail → halt with instructions to re-auth.
- **Final State**: ≥3 PNGs in `apps/{app}/docs/ground-truth/`, `stitch-project-id.txt` saved.

- [ ] **Step 3: Commit**

```bash
git add plugins/design-team/skills/stitch-generate/SKILL.md
git commit -m "feat(skills): add stitch-generate skill (Stage 2a)"
```

---

### Task 9: `design-sync` skill (Stage 2b) + relocate existing flat-file

**Files:**
- Delete old: `plugins/design-team/skills/design-sync.md`
- Create: `plugins/design-team/skills/design-sync/SKILL.md`

**Source material:**
- `plugins/design-team/agents/design-sync-lead.md`
- Existing `plugins/design-team/skills/design-sync.md` (carry forward any reusable content)
- Spec §7.5

- [ ] **Step 1: Read sources**

Read both `design-sync-lead.md` and the existing flat `design-sync.md`. Note any reusable recipe content.

- [ ] **Step 2: Write SKILL.md**

- `name`: `design-sync`
- `description`: `Stage 2b design — implements React components that visually match Stitch ground-truth screens. Runs inner ralph-design-loop until visual convergence.`
- **Prerequisites**: Gate 2a met; ground-truth PNGs exist; `stitch-project-id.txt` exists.
- **Execution Steps** (4 phases per spec §7.5):
  1. **2b.1 Sync criteria**: 3-way parallel dispatch of `design-visionary` + `dev-ui-engineer` + `ux-specialist` to write `apps/{app}/docs/design/sync-criteria.md`.
  2. **2b.2 Initial React implementation**: single `dev-ui-engineer` spawn to produce `apps/{app}/src/App.tsx` plus components.
  3. **2b.3 Inner loop**: main session **loads and executes `ralph-design-loop` skill** (this is the only mid-tier skill that calls another skill, by explicit spec allowance §7.5 + §8.9).
  4. **2b.4 Final verification**: `design-visionary` read-only final report.
- **Worker Dispatch Plan**: 5-6 rows.
- **Gate Verification**: spec §6.3 Stage 2 → 3 content_checks (`sync-criteria.md` contains "Design Score B+" AND "폰트/색상 불일치 0").
- **Error Handling**: ralph-design-loop exhausts iterations → return with partial report + user decision.
- **Final State**: `App.tsx` + components compile, visual parity achieved, TodoWrite Stage 2b complete.

- [ ] **Step 3: Delete old flat file**

```bash
git rm plugins/design-team/skills/design-sync.md
```

- [ ] **Step 4: Commit**

```bash
git add plugins/design-team/skills/design-sync/SKILL.md
git commit -m "refactor(skills): relocate design-sync to SKILL.md folder with Stage 2b rewrite"
```

---

### Task 10: `dev-orchestrate` skill (Stage 3)

**Files:**
- Create: `plugins/dev-team/skills/dev-orchestrate/SKILL.md`

**Source material:**
- `plugins/dev-team/agents/dev-orchestrator.md`
- Spec §7.6

- [ ] **Step 1: Read source**

Read the legacy orchestrator body. Confirm 5 phases from spec §7.6.

- [ ] **Step 2: Write SKILL.md**

- `name`: `dev-orchestrate`
- `description`: `Stage 3 development — architecture, parallel backend+frontend implementation, QA, review, demo mode verification. Preserves Stitch Tailwind classes set in Stage 2b.`
- **Prerequisites**: Gate 2b met; `App.tsx` present; Stitch sync criteria passed.
- **Execution Steps** (5 phases per spec §7.6):
  1. **3.1 Architecture**: sequential single `dev-architect` spawn.
  2. **3.2 Implementation**: parallel `dev-backend` || `dev-frontend` after the architect produces the API contract.
  3. **3.3 QA**: `dev-qa` edge cases + regression.
  4. **3.4 Review**: main session **loads `dev-review` skill** (NOT `dev-reviewer` subagent) for multi-layer review.
  5. **3.5 Demo mode verification**: `live-app-tester` via gstack browse with screenshot evidence.
- **Worker Dispatch Plan**: table with ~5 rows. Critical constraint row: `dev-frontend` spawn prompt MUST include "preserve Stitch Tailwind classes, no inline styles".
- **Constraint callout** (spec §7.6): DO NOT dispatch `dev-ui-engineer` in this stage.
- **Gate Verification**: spec §6.3 Stage 3 → 4 block (`npm run build` exit 0; demo mode wired).
- **Error Handling**: build failure → dispatch `dev-debugger` with "root cause mandate" (no band-aids); QA regression → dispatch `dev-debugger`.
- **Final State**: buildable `apps/{app}/` with demo mode, TodoWrite Stage 3 complete.

- [ ] **Step 3: Commit**

```bash
git add plugins/dev-team/skills/dev-orchestrate/SKILL.md
git commit -m "feat(skills): add dev-orchestrate skill (Stage 3)"
```

---

### Task 11: `ralph-persona-loop` skill update (Stage 4)

**Files:**
- Delete old: `plugins/pm-agent/skills/ralph-persona-loop.md`
- Create: `plugins/pm-agent/skills/ralph-persona-loop/SKILL.md`

**Source material:**
- Existing `plugins/pm-agent/skills/ralph-persona-loop.md` (preserve all actionable content)
- Spec §8 (all subsections — this is the authoritative rewrite reference)
- `plugins/pm-agent/references/ralph-phase-details.md` (remains at current path; skill body references it)

This is the most complex skill in the plan. Read the spec §8 carefully in Step 1 before writing.

- [ ] **Step 1: Read sources**

Read:
- Existing `plugins/pm-agent/skills/ralph-persona-loop.md` (full)
- Spec §8.1–§8.9 (offset ~441 limit ~150)
- `plugins/pm-agent/references/ralph-phase-details.md` (at least skim; will be referenced by path)

- [ ] **Step 2: Write SKILL.md**

- `name`: `ralph-persona-loop`
- `description`: `Stage 4 quality loop — iterates 6 parallel evaluators (3 personas, design-visionary, ux-specialist, pm-executor reviewer mode) until all satisfaction/score gates pass or max iterations reached. Screenshot-mandatory per absolute rule.`
- **Purpose & Scope**: Stage 4 of app-factory pipeline; iterative feedback loop with hard gates.
- **Prerequisites**: Gate 3 met; `npm run build` succeeds; gstack browse available.
- **Execution Steps** — use spec §8.2 phase table as the skeleton:
  - **Phase 0**: single `flow-graph-validator` spawn.
  - **Phase 1**: single `pm-discovery` spawn (generate this iteration's persona).
  - **Phase 1.5**: single `app-qa-tester` spawn (gstack /qa).
  - **Phase 1.7**: single `live-app-walkthrough` spawn.
  - **Phase 2**: **6 parallel Agent tool calls in one turn** (spec §8.3 table):
    1. `user-persona-tester` persona-1
    2. `user-persona-tester` persona-2
    3. `user-persona-tester` persona-3
    4. `design-visionary`
    5. `ux-specialist`
    6. `pm-executor` **reviewer mode** — spawn prompt MUST explicitly omit `Edit` from effective tools (per spec §11.3) and say "REVIEWER mode, do NOT modify prd.md, verify implementation matches PRD".
    - Optional 7th: `domain-expert-consultant` conditional on education/info app type.
    - Each spawn prompt must include the isolated screenshot base path `/tmp/ralph-iter-{N}/{role}/`.
    - Each worker produces `{role}.md` + `{role}-score.yaml` under `apps/{app}/docs/pm-outputs/ralph/iteration-{N}/`.
  - **Phase 3**: **Gate judgment (skill body, no worker)** — main session reads all 6 score.yaml files via Glob + Read, verifies `screenshot_evidence.count > 0` on each, aggregates scores, applies gate rules from spec §8.7 (all 3 personas ≥80; design_score ≥B+; ai_slop_score ≥B; visionary_score ≥70; ux_score ≥75; prd_coverage ≥90).
  - **Phase 4**: **Multi-worker fix dispatch** per spec §8.4 — main consolidates `improvements_needed` from all yaml files, routes fixes by `owner_hint` to `dev-ui-engineer` / `dev-frontend` / `dev-backend` / `design-iterator`, dispatches in parallel when edit zones don't conflict, runs `npm run build`, on failure spawns `dev-debugger` with root-cause mandate, then spawns `live-app-tester` for before/after verification, writes `iteration-{N}-fix-checklist.md`.
  - **Phase 5**: main session creates iteration commit via Bash.
  - **Phase 6**: main updates TodoWrite, transitions to next iteration (new persona) unless gates passed or `iteration_limit=5` reached.
- **Worker Dispatch Plan**: full table covering all phases.
- **Parallel/sequential mode**: implement optimistic parallel with auto-fallback per spec §8.5. The skill body must instruct main to check for `.ralph-mode.txt` at `apps/{app}/docs/pm-outputs/ralph/.ralph-mode.txt`; if it contains `sequential`, run Phase 2 sequentially instead of parallel.
- **Score YAML schema**: quote the schema from spec §8.6 verbatim in an Appendix of the SKILL.md body so workers' spawn prompts can point to it.
- **Termination** per spec §8.8:
  - All gates pass → Phase 5 final commit + generate `ralph-final-report.md`.
  - Max iterations → partial-success report + user decision.
  - Fatal failure (build broken, gstack down) → error termination, state preserved.
- **Gate Verification**: spec §6.3 Stage 4 → 5 block verbatim.
- **Error Handling**: worker fails to produce score.yaml → single sequential retry for that worker only; build broken → `dev-debugger`; gstack unavailable → halt.
- **Final State**: `ralph-final-report.md` exists; all gate values met or partial-report flag set.
- **Reference**: end with a line `See also: references/ralph-phase-details.md` (relative from plugin root).

- [ ] **Step 3: Delete old flat file**

```bash
git rm plugins/pm-agent/skills/ralph-persona-loop.md
```

- [ ] **Step 4: Commit**

```bash
git add plugins/pm-agent/skills/ralph-persona-loop/SKILL.md
git commit -m "refactor(skills): rewrite ralph-persona-loop for 6-evaluator 2-tier model"
```

---

## Phase M3.C: Master skill

---

### Task 12: `app-factory` skill (master)

**Files:**
- Create: `plugins/pm-agent/skills/app-factory/SKILL.md`

**Source material:**
- `plugins/pm-agent/agents/app-factory.md` (full body)
- Spec §7.2 (authoritative)

**Critical constraint (spec §7.2 + spec §11.3 "Non-obvious decisions"):** `app-factory` does NOT spawn workers directly. Its only direct actions are (a) Step 0 mkdir via Bash and (b) final git commit via Bash. All worker dispatch is delegated to stage skills.

- [ ] **Step 1: Read sources**

Read `plugins/pm-agent/agents/app-factory.md` (full) and spec §7.2 (offset ~376 limit 15). Cross-check with spec Appendix A pipeline diagram (offset ~833).

- [ ] **Step 2: Write SKILL.md**

- `name`: `app-factory`
- `description`: `Master 5-stage app-building pipeline — takes an app idea and produces a buildable app with demo mode. Chains pm-orchestrate, stitch-generate, design-sync, dev-orchestrate, ralph-persona-loop, and release-prep skills. Invoked by natural language or /app-factory slash command.`
- **Purpose & Scope**: master orchestration recipe. Chains 5 stage skills. Enforces the dual-track handoff (file system + TodoWrite) from spec §6.1.
- **Prerequisites**: a user-provided app idea; repo at project root; CLAUDE.md, DESIGN_RULES.md available; gstack browse available.
- **Execution Steps** — exactly the 7-step list from spec §7.2:
  0. **Step 0 Initialize**: confirm app name with user (USER DECISION POINT); `mkdir apps/{name}/` via Bash; seed TodoWrite with the 7 items from spec §6.6 verbatim; load CLAUDE.md and DESIGN_RULES.md into context.
  1. **Step 1**: load and execute `pm-orchestrate` skill. After skill returns, verify Gate 1 via spec §6.3 Stage 1 → 2 block.
  2. **Step 2**: load and execute `stitch-generate` skill; verify Gate 2a.
  3. **Step 3**: load and execute `design-sync` skill; verify Gate 2b.
  4. **Step 4**: load and execute `dev-orchestrate` skill; verify Gate 3.
  5. **Step 5**: load and execute `ralph-persona-loop` skill; verify Gate 4.
  6. **Step 6**: load and execute `release-prep` skill; verify Gate 5.
- **User decision points** (spec §7.2): Step 0 (app name), Step 1 (segment, business model, MVP scope), Step 5 (launch decision if Ralph max iterations hit without gate pass).
- **Worker Dispatch Plan**: **empty table with note "This skill dispatches no workers directly. All worker dispatch is delegated to the 6 stage skills it invokes. Only direct main-session actions are Bash (mkdir, git commit) and TodoWrite."**
- **Gate Verification**: between each Step, run the corresponding gate block from spec §6.3. On gate failure, halt the pipeline and report to the user with the missing artifact.
- **Error Handling**: any stage skill returns error → halt, report which stage/gate failed, preserve partial state; user may resume by invoking the specific stage slash command.
- **Final State**: release commit exists in git history; `apps/{app}/` builds; `RELEASE.md` present; all 7 TodoWrite items complete.

- [ ] **Step 3: Self-check — verify no Agent-tool dispatch in body**

Grep the new file for any text that implies a direct worker dispatch:

```bash
grep -i -E 'dispatch.*worker|agent tool.*spawn|spawn.*(dev-|pm-|ux-|design-|live-)' plugins/pm-agent/skills/app-factory/SKILL.md || echo "CLEAN"
```
Expected: `CLEAN`. If any match appears, rewrite that paragraph to delegate via a stage skill.

- [ ] **Step 4: Commit**

```bash
git add plugins/pm-agent/skills/app-factory/SKILL.md
git commit -m "feat(skills): add app-factory master skill (Stage 0-5 chain)"
```

---

## Phase M3.D: Slash commands

Slash commands are thin wrappers. Each is a single markdown file with frontmatter and a one-line body that invokes the corresponding skill. Template for all 8 commands:

```markdown
---
name: {command-name}
description: {one-line user-facing summary}
argument-hint: {expected arg shape, e.g., "<idea>" or "<app-name>"}
---

Invoke the `{skill-name}` skill with the following input: $ARGUMENTS
```

If your Claude Code version uses a different slash-command format (e.g., `.claude/commands/` rather than `plugins/*/commands/`), check `plugins/pm-agent/` first for an existing `commands/` directory to confirm the pattern; if none exists, create it.

---

### Task 13: Create all 8 slash commands in one commit

**Files:**
- Create: `plugins/pm-agent/commands/app-factory.md`
- Create: `plugins/pm-agent/commands/pm-orchestrate.md`
- Create: `plugins/pm-agent/commands/release-prep.md`
- Create: `plugins/pm-agent/commands/ralph-loop.md`
- Create: `plugins/design-team/commands/stitch-generate.md`
- Create: `plugins/design-team/commands/design-sync.md`
- Create: `plugins/dev-team/commands/dev-orchestrate.md`
- Create: `plugins/dev-team/commands/dev-review.md`

- [ ] **Step 1: Verify slash command directory convention**

```bash
find plugins -type d -name commands
```

If directories exist, use them. If not, create `plugins/{plugin}/commands/` as needed (they're standard Claude Code plugin structure).

- [ ] **Step 2: Write the 8 files**

For each file, use the template above with the following mapping (spec §5.2 table):

| File | `name` | `description` | `argument-hint` | Invoked skill |
|---|---|---|---|---|
| `plugins/pm-agent/commands/app-factory.md` | `app-factory` | `Build a new app end-to-end via the 5-stage pipeline` | `<idea>` | `app-factory` |
| `plugins/pm-agent/commands/pm-orchestrate.md` | `pm-orchestrate` | `Run Stage 1 PM planning only for an existing app` | `<app-name>` | `pm-orchestrate` |
| `plugins/pm-agent/commands/release-prep.md` | `release-prep` | `Run Stage 5 release preparation for an existing app` | `<app-name>` | `release-prep` |
| `plugins/pm-agent/commands/ralph-loop.md` | `ralph-loop` | `Run Stage 4 Ralph persona quality loop for an existing app` | `<app-name>` | `ralph-persona-loop` |
| `plugins/design-team/commands/stitch-generate.md` | `stitch-generate` | `Run Stage 2a Stitch screen generation for an existing app` | `<app-name>` | `stitch-generate` |
| `plugins/design-team/commands/design-sync.md` | `design-sync` | `Run Stage 2b React design sync for an existing app` | `<app-name>` | `design-sync` |
| `plugins/dev-team/commands/dev-orchestrate.md` | `dev-orchestrate` | `Run Stage 3 development for an existing app` | `<app-name>` | `dev-orchestrate` |
| `plugins/dev-team/commands/dev-review.md` | `dev-review` | `Run multi-layer code review on a scope (file, branch, PR)` | `<scope>` | `dev-review` |

Each file body is one line:

```
Invoke the `{skill-name}` skill with the following input: $ARGUMENTS
```

- [ ] **Step 3: Verify frontmatter parses for all 8**

```bash
for f in plugins/pm-agent/commands/{app-factory,pm-orchestrate,release-prep,ralph-loop}.md plugins/design-team/commands/{stitch-generate,design-sync}.md plugins/dev-team/commands/{dev-orchestrate,dev-review}.md; do
  echo "=== $f ==="
  head -n 6 "$f"
done
```
Expected: each file prints frontmatter with `name:`, `description:`, `argument-hint:`.

- [ ] **Step 4: Commit**

```bash
git add plugins/pm-agent/commands/ plugins/design-team/commands/ plugins/dev-team/commands/
git commit -m "feat(commands): add 8 slash commands for orchestration skills"
```

---

## Phase M3.E: Final verification

---

### Task 14: Skill inventory verification

**Files:**
- Read all 12 new/updated SKILL.md files
- Read all 8 new command files

- [ ] **Step 1: Verify all 12 SKILL.md files exist at the expected paths**

```bash
for p in \
  plugins/pm-agent/skills/app-factory/SKILL.md \
  plugins/pm-agent/skills/pm-orchestrate/SKILL.md \
  plugins/pm-agent/skills/release-prep/SKILL.md \
  plugins/pm-agent/skills/ralph-persona-loop/SKILL.md \
  plugins/design-team/skills/stitch-generate/SKILL.md \
  plugins/design-team/skills/design-sync/SKILL.md \
  plugins/design-team/skills/ralph-design-loop/SKILL.md \
  plugins/dev-team/skills/dev-orchestrate/SKILL.md \
  plugins/dev-team/skills/bugfix-coordinate/SKILL.md \
  plugins/dev-team/skills/dev-review/SKILL.md \
  plugins/agent-maker/skills/maker-orchestrate/SKILL.md \
  plugins/ait-team/skills/ait-orchestrate/SKILL.md; do
  test -f "$p" && echo "OK  $p" || echo "MISSING  $p"
done
```
Expected: 12 × `OK`. Zero `MISSING`.

- [ ] **Step 2: Verify each SKILL.md has all 8 required sections**

For each file, grep for the required headings:

```bash
for p in $(find plugins -path '*/skills/*/SKILL.md'); do
  missing=""
  for h in "Purpose & Scope" "Prerequisites" "Execution Steps" "Worker Dispatch Plan" "Gate Verification" "Error Handling" "Final State"; do
    grep -q "## $h" "$p" || missing="$missing [$h]"
  done
  if [ -z "$missing" ]; then echo "OK  $p"; else echo "MISSING$missing  $p"; fi
done
```
Expected: 12 × `OK`.

- [ ] **Step 3: Verify no SKILL.md has `tools:` in frontmatter**

```bash
for p in $(find plugins -path '*/skills/*/SKILL.md'); do
  if head -n 10 "$p" | grep -q '^tools:'; then
    echo "VIOLATION: $p has tools: in frontmatter (only workers should)"
  fi
done
```
Expected: no output.

- [ ] **Step 4: Verify `app-factory` does not dispatch workers directly**

```bash
grep -i -E 'dispatch.*worker|spawn.*(dev-|pm-|ux-|design-|live-)' plugins/pm-agent/skills/app-factory/SKILL.md || echo "CLEAN"
```
Expected: `CLEAN`.

- [ ] **Step 5: Verify old flat skill files were deleted**

```bash
for p in \
  plugins/pm-agent/skills/ralph-persona-loop.md \
  plugins/design-team/skills/ralph-design-loop.md \
  plugins/design-team/skills/design-sync.md; do
  test -f "$p" && echo "STILL EXISTS $p" || echo "DELETED $p"
done
```
Expected: 3 × `DELETED`.

- [ ] **Step 6: Verify all 8 slash commands parse**

```bash
for f in plugins/pm-agent/commands/{app-factory,pm-orchestrate,release-prep,ralph-loop}.md plugins/design-team/commands/{stitch-generate,design-sync}.md plugins/dev-team/commands/{dev-orchestrate,dev-review}.md; do
  test -f "$f" && grep -q '^name:' "$f" && echo "OK  $f" || echo "FAIL  $f"
done
```
Expected: 8 × `OK`.

- [ ] **Step 7: Verify legacy orchestrator files still exist (coexistence per M3 rule)**

```bash
for p in \
  plugins/pm-agent/agents/app-factory.md \
  plugins/pm-agent/agents/pm-orchestrator.md \
  plugins/design-team/agents/design-orchestrator.md \
  plugins/design-team/agents/design-sync-lead.md \
  plugins/dev-team/agents/dev-orchestrator.md \
  plugins/dev-team/agents/dev-reviewer.md \
  plugins/dev-team/agents/bugfix-coordinator.md \
  plugins/agent-maker/agents/maker-orchestrator.md \
  plugins/ait-team/agents/ait-orchestrator.md; do
  test -f "$p" && echo "OK (still exists) $p" || echo "UNEXPECTED DELETE $p"
done
```
Expected: 9 × `OK`. Any `UNEXPECTED DELETE` means Plan 2 crossed into Plan 4's scope — revert.

- [ ] **Step 8: Commit verification log if anything noteworthy**

If all verifications pass, no commit needed. If any fix was made during verification, commit with `fix(skills): address M3 verification findings`.

---

## Self-Review (run by the plan author after writing — checklist)

1. **Spec coverage**:
   - §5.1 12 skills → Tasks 1-12 ✓
   - §5.2 8 slash commands → Task 13 ✓
   - §7.2 app-factory "no direct worker dispatch" → Task 12 constraint + Task 14 Step 4 grep ✓
   - §7.3-§7.8 stage skill anatomies → Tasks 7-12 individually ✓
   - §8 Ralph loop 6-evaluator + score YAML + parallel-fallback → Task 11 ✓
   - §8.9 ralph-design-loop called by design-sync → Task 2 + Task 9 Step 2 phase 2b.3 ✓
   - §6.3 gate blocks → referenced by every stage skill's Gate Verification section ✓
   - §11.3 pm-executor reviewer mode structural Edit omission → Task 11 Phase 2 evaluator #6 ✓
   - §11.3 dev-reviewer hidden orchestrator → Task 4 ✓

2. **Placeholder scan**: no "TBD", "add error handling", "similar to Task N", "write tests for the above". Every task either quotes a concrete heading, provides a literal Bash/Grep command, or points at a specific spec section by number.

3. **Type/name consistency**:
   - Skill names match spec §5.1 exactly (lowercase kebab).
   - `ralph-persona-loop` (not `ralph-persona`) — consistent across Tasks 11, 13.
   - `bugfix-coordinate` (not `bugfix-coordinator`) — the skill drops the trailing `or`.
   - `dev-review` (not `dev-reviewer`) — the skill replaces the subagent.
   - `design-sync` (skill) vs `design-sync-lead` (legacy subagent source) — consistent.

4. **Constraint coverage**:
   - Hard rule 1 (no `Agent` in workers) → enforced in Plan 1, not touched here.
   - Hard rule 2 (skills hold orchestration) → Tasks 1-12 all write recipe content, not subagent bodies.
   - Hard rule 3 (file-system + TodoWrite handoff) → each stage skill Gate Verification section.
   - Hard rule 4 (user decision points marked) → Task 7 phase 1.4, Task 12 Step 0 + Step 1 + Step 5.

5. **Legacy files untouched**: Task 14 Step 7 explicitly verifies all 9 legacy orchestrators still exist. Plan 2 is purely additive per M3 definition.

---

## Execution Handoff

**Plan 2 complete and saved to `docs/superpowers/plans/2026-04-10-orchestration-m3-skills.md`.**

**Two execution options:**

1. **Subagent-Driven (recommended)** — Dispatch a fresh subagent per Task (14 total). Review between each Task. Writing SKILL.md files is token-heavy; isolating each task in its own subagent keeps main context lean and lets you review the skill body before moving on.

2. **Inline Execution** — Execute all 14 Tasks in the current session using `superpowers:executing-plans`. Batch in M3.A (Tasks 1-6), M3.B (Tasks 7-11), M3.C (Task 12), M3.D (Task 13), M3.E (Task 14) with a user checkpoint between phases.

**Which approach? The resume note recommends NOT executing Plan 2 in the same session as plan writing unless context budget is generous — skill authoring alone will consume substantial tokens.**

---

## Post-execution next steps (not part of Plan 2)

- Plan 3 (M4): Agent Teams test app build — "하루 감사 일기" end-to-end via `/app-factory`. Requires Plan 2 merged.
- Plan 4 (M5+M6+M7): deprecation markers, legacy orchestrator deletion, CLAUDE.md/PRODUCT_LOOP.md rewrite, ORCHESTRATION_MODEL.md ADR.
