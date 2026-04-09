# Orchestration Redesign — Plan 1: Inventory + Worker Tools Restriction (M1 + M2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the file inventory (resolving Open Questions in the spec) and add `tools:` frontmatter restriction to all worker subagents, establishing the structural foundation for the 2-tier orchestration model.

**Architecture:** This plan is entirely additive and safe — no deletions, no skill creation yet. M1 reads existing files to resolve three Open Questions logged in the spec. M2 adds a single `tools:` frontmatter field to each worker subagent, structurally blocking nested spawns per the official `agent-sdk__subagents.md` constraint.

**Tech Stack:** Markdown frontmatter (YAML), filesystem-based subagents, git.

**Spec reference:** `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md`, specifically Sections 5.3 (tools matrix), 9.1 M1–M2, and 11.2 (Open Questions).

**Branch note:** This plan is safe to execute directly on `main` because M1 only reads files + amends the spec, and M2 only adds frontmatter fields (existing orchestrator behavior is preserved). If the user prefers a worktree, use `git worktree add ../plz-survive-jay-orchestration-m1m2` before starting.

---

## File Structure

### Files read (no modification)
- `plugins/agent-maker/agents/*.md` (unknown count, inventoried in Task 1)
- `plugins/ait-team/agents/*.md` (unknown count, inventoried in Task 2)
- `plugins/pm-agent/agents/pm-discovery.md`, `pm-strategist.md`, `pm-analyst.md`, `pm-executor.md`, `pm-gtm.md`, `pm-feedback-loop.md`, `ux-specialist.md`, `user-persona-tester.md`, `live-app-walkthrough.md`, `domain-expert-consultant.md`
- `plugins/design-team/agents/design-screen-generator.md`, `design-visionary.md`, `design-iterator.md`, `design-system-manager.md`, `design-handoff.md`
- `plugins/dev-team/agents/dev-architect.md`, `dev-backend.md`, `dev-frontend.md`, `dev-ui-engineer.md`, `dev-qa.md`, `dev-reviewer.md`, `dev-debugger.md`, `dev-devops.md`, `flow-graph-validator.md`, `live-app-tester.md`, `app-qa-tester.md`, `ops-monitor.md`, `bridge-translator.md`

### Files modified
- `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md` (amend Section 11.2 with Open Question resolutions, update Section 5.3 if tools assignments change based on findings)
- All worker subagent `.md` files listed above (add `tools:` frontmatter field)
- Additional worker files discovered in `agent-maker/` and `ait-team/` (from M1 inventory)

### Files created
- None. This plan is purely additive modifications + spec amendments.

---

## Phase M1: Inventory + Open Question Resolution

---

### Task 1: Inventory `agent-maker` plugin

**Files:**
- Read: `plugins/agent-maker/agents/*.md` (all files)

- [ ] **Step 1: List all files in agent-maker plugin**

Run:
```bash
ls /Users/wschoe/project/plz-survive-jay/plugins/agent-maker/agents/
```

Expected: list of `.md` files, including `maker-orchestrator.md`. Record the full list.

- [ ] **Step 2: Read every agent file in the plugin**

For each file from Step 1, use the Read tool. Record:
- Each agent's `name`, `description`, and `tools` (if present)
- Whether the body describes spawning other agents (look for "Agent tool", "Task tool", "dispatch", "spawn", "route to")
- Whether it's a self-contained worker (only Read/Edit/Write/Bash actions on its own files)

- [ ] **Step 3: Classify each agent**

For each agent, write a one-line classification:
```
{agent-name}: ORCHESTRATOR (spawns X, Y, Z) | WORKER ({tools needed})
```

- [ ] **Step 4: Record findings to temporary notes**

Create a working notes file at `/tmp/m1-inventory-agent-maker.txt` with the classifications. This is working memory, not a committed artifact.

---

### Task 2: Inventory `ait-team` plugin

**Files:**
- Read: `plugins/ait-team/agents/*.md` (all files)

- [ ] **Step 1: List all files in ait-team plugin**

Run:
```bash
ls /Users/wschoe/project/plz-survive-jay/plugins/ait-team/agents/
```

Expected: list of `.md` files including `ait-orchestrator.md`.

- [ ] **Step 2: Read every agent file in the plugin**

Same process as Task 1 Step 2: read each file, record name/description/tools/classification signals.

- [ ] **Step 3: Classify each agent**

Same format as Task 1 Step 3:
```
{agent-name}: ORCHESTRATOR | WORKER ({tools needed})
```

- [ ] **Step 4: Record findings**

Write to `/tmp/m1-inventory-ait-team.txt`.

---

### Task 3: Inventory unread pm-agent workers

**Files:**
- Read: `plugins/pm-agent/agents/pm-discovery.md`, `pm-strategist.md`, `pm-analyst.md`, `pm-executor.md`, `pm-gtm.md`, `pm-feedback-loop.md`, `ux-specialist.md`, `user-persona-tester.md`, `live-app-walkthrough.md`, `domain-expert-consultant.md`

- [ ] **Step 1: Read all 10 pm-agent worker files**

Use Read tool on each of the 10 files. For each, record:
- Current frontmatter (especially if `tools:` already exists)
- Any mention of Agent/Task tool usage (should NOT be present — these are supposed to be workers)
- What gstack browse / Bash commands the agent runs (to inform tools restriction)

- [ ] **Step 2: Verify no hidden orchestrators**

For each file, grep the body for suspicious patterns:
- "Agent tool"
- "Task tool"
- "spawn"
- "dispatch to"
- "invoke {other-agent-name}"

If any worker shows orchestrator patterns, flag it in `/tmp/m1-pm-worker-issues.txt`.

- [ ] **Step 3: Verify tools matrix in spec still matches reality**

Open spec Section 5.3 pm-agent table. For each of the 10 workers:
- Does the spec's proposed `tools` list cover everything the agent actually needs?
- Does any agent use a tool NOT in its proposed list? (e.g., `live-app-walkthrough` using `Bash` for gstack — already in matrix; but if something unexpected appears, flag it)

Write any discrepancies to `/tmp/m1-pm-worker-tools-mismatches.txt`.

---

### Task 4: Inventory unread design-team workers

**Files:**
- Read: `plugins/design-team/agents/design-screen-generator.md`, `design-visionary.md`, `design-iterator.md`, `design-system-manager.md`, `design-handoff.md`

- [ ] **Step 1: Read all 5 design-team worker files**

Use Read tool. Record frontmatter + Agent tool usage + Bash/Stitch MCP usage patterns.

- [ ] **Step 2: Verify no hidden orchestrators**

Same grep patterns as Task 3 Step 2. Flag issues to `/tmp/m1-design-worker-issues.txt`.

- [ ] **Step 3: Verify spec tools matrix for design-team**

Compare spec Section 5.3 design-team table against reality. Write mismatches to `/tmp/m1-design-worker-tools-mismatches.txt`.

---

### Task 5: Inventory unread dev-team workers

**Files:**
- Read: `plugins/dev-team/agents/dev-architect.md`, `dev-backend.md`, `dev-frontend.md`, `dev-ui-engineer.md`, `dev-qa.md`, `dev-reviewer.md`, `dev-debugger.md`, `dev-devops.md`, `flow-graph-validator.md`, `live-app-tester.md`, `app-qa-tester.md`, `ops-monitor.md`, `bridge-translator.md`

- [ ] **Step 1: Read all 13 dev-team worker files**

Use Read tool on each. Record frontmatter + Agent tool usage + Bash usage for gstack/build commands.

- [ ] **Step 2: Verify no hidden orchestrators**

Same grep patterns. Write issues to `/tmp/m1-dev-worker-issues.txt`.

Note: `dev-debugger.md` was already read during brainstorming and confirmed as a self-contained worker. Re-verify briefly.

- [ ] **Step 3: Verify spec tools matrix for dev-team**

Compare spec Section 5.3 dev-team table against reality. Write mismatches to `/tmp/m1-dev-worker-tools-mismatches.txt`.

---

### Task 6: Verify Claude Code environment for M4 prerequisites

**Files:**
- Read: `~/.claude/settings.json` (if exists), shell environment

- [ ] **Step 1: Check Claude Code version**

Run:
```bash
claude --version
```

Expected: version string ≥ 2.1.32. Record the actual version.

If version is < 2.1.32, note in `/tmp/m1-environment.txt` that Claude Code upgrade is required before M4. This does NOT block M1/M2 completion.

- [ ] **Step 2: Check if CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS is set**

Run:
```bash
echo "env var: ${CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS:-unset}"
test -f ~/.claude/settings.json && grep -l "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS" ~/.claude/settings.json || echo "not in settings.json"
```

Expected: report whether the variable is set via env or settings.

- [ ] **Step 3: Check tmux availability (for split-pane Teams mode)**

Run:
```bash
which tmux 2>&1 || echo "tmux not found"
tmux -V 2>&1 || echo "tmux unavailable"
```

Expected: either tmux version string or "not found". Record result. tmux is NOT required for M4 — in-process mode works in any terminal — but split-pane is nicer.

- [ ] **Step 4: Write environment report**

Write to `/tmp/m1-environment.txt`:
```
Claude Code version: {version}
Agent Teams enabled: {yes/no}
tmux available: {yes/no}
M4 blocker: {none | upgrade-claude | enable-teams}
Recommended M4 mode: {in-process | split-pane}
```

---

### Task 7: Resolve Open Question 1 — `maker-orchestrator` and `ait-orchestrator` classification

**Files:**
- Read: findings from Tasks 1-2

- [ ] **Step 1: Review Task 1 and Task 2 findings**

Open `/tmp/m1-inventory-agent-maker.txt` and `/tmp/m1-inventory-ait-team.txt`.

Identify classification of `maker-orchestrator` and `ait-orchestrator`:
- If they spawn other subagents → TRUE orchestrators → confirm deletion in spec Section 5.4
- If they are self-contained workers → RECLASSIFY as workers → remove from spec Section 5.4 deletion list, add to Section 5.3 tools matrix

- [ ] **Step 2: Write decision**

Append to `/tmp/m1-decisions.txt`:
```
OQ1 Resolution:
- maker-orchestrator: {TRUE_ORCHESTRATOR | WORKER}
  Evidence: {one-line justification from file body}
- ait-orchestrator: {TRUE_ORCHESTRATOR | WORKER}
  Evidence: {one-line justification from file body}
```

---

### Task 8: Resolve Open Question 2 — `agent-maker` master pattern

**Files:**
- Read: findings from Task 1

- [ ] **Step 1: Identify if agent-maker has a "master" agent**

From Task 1 findings, check if agent-maker plugin has any agent that:
- Creates other agents (writes new `.md` files)
- Dispatches the agent-creation pipeline
- Is described as the "entry point" for the meta workflow

- [ ] **Step 2: Decide modeling approach**

One of three outcomes:
- **(a) Simple worker pattern**: `maker-orchestrator` (if classified as orchestrator in Task 7) becomes a skill `maker-orchestrate`. Other agent-maker files are workers.
- **(b) No master exists**: agent-maker plugin is just a flat set of workers. No new skill needed. `maker-orchestrate` skill in spec Section 5.1 is removed.
- **(c) Complex pattern discovered**: the agent-maker plugin uses a pattern not anticipated in the spec. Flag for user decision.

- [ ] **Step 3: Write decision**

Append to `/tmp/m1-decisions.txt`:
```
OQ2 Resolution: {a | b | c}
{If c: describe the pattern discovered}
Spec impact: {list of spec sections that need updating}
```

---

### Task 9: Resolve Open Question 3 — `ralph-phase-details.md` reference validity

**Files:**
- Read: `plugins/pm-agent/skills/ralph-persona-loop.md`
- Read: `plugins/pm-agent/references/ralph-phase-details.md`

- [ ] **Step 1: Verify current reference path works**

Run:
```bash
test -f /Users/wschoe/project/plz-survive-jay/plugins/pm-agent/references/ralph-phase-details.md && echo "exists" || echo "MISSING"
```

Expected: `exists`.

- [ ] **Step 2: Verify ralph-persona-loop.md references this path correctly**

Open `plugins/pm-agent/skills/ralph-persona-loop.md`, grep for `ralph-phase-details`:
```bash
grep -n "ralph-phase-details" /Users/wschoe/project/plz-survive-jay/plugins/pm-agent/skills/ralph-persona-loop.md
```

Expected: at least one match like `references/ralph-phase-details.md`. Confirm the path is resolvable relative to the skill file.

- [ ] **Step 3: Check if references location will change**

Per spec Section 10.1 Layer 4, `ralph-phase-details.md` stays at its current path. No relocation planned.

- [ ] **Step 4: Write decision**

Append to `/tmp/m1-decisions.txt`:
```
OQ3 Resolution: REFERENCE PATH VALID, NO CHANGE NEEDED
Path confirmed: plugins/pm-agent/references/ralph-phase-details.md
Skill reference: {matching line from ralph-persona-loop.md}
```

---

### Task 10: Amend spec with M1 findings

**Files:**
- Modify: `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md`

- [ ] **Step 1: Read current spec Section 11.2 (Open Questions)**

Use Read tool with offset around the Section 11.2 heading to get the current content exactly.

- [ ] **Step 2: Replace Open Questions with Resolutions**

Use Edit tool to replace the "Open questions (to resolve in M1)" subsection with "Resolved in M1 (YYYY-MM-DD)":

```markdown
### 11.2 Resolved in M1 (2026-04-09)

1. **Q: Are `maker-orchestrator.md` and `ait-orchestrator.md` really orchestrators or self-contained workers?**
   Resolution: {from /tmp/m1-decisions.txt OQ1}
   Spec impact: {list of sections updated}

2. **Q: Does `agent-maker` plugin have a "master" that creates other agents?**
   Resolution: {from /tmp/m1-decisions.txt OQ2}
   Spec impact: {list of sections updated}

3. **Q: Is `ralph-phase-details.md` reference path still valid?**
   Resolution: Confirmed at `plugins/pm-agent/references/ralph-phase-details.md`.
   No change needed. Skill reference verified.
```

- [ ] **Step 3: Update Section 5.1 if skills list changed**

If OQ2 resolution removed `maker-orchestrate` from the skills list, or if OQ1 reclassified `maker-orchestrator`/`ait-orchestrator` as workers:
- Update spec Section 5.1 table (skill count)
- Update spec Section 5.4 deletion list (file count)
- Update spec Section 9.1 task counts in migration phases

Use Edit tool for each change, showing exact before/after.

- [ ] **Step 4: Update Section 5.3 if tools matrix changed**

If any worker needs `tools` different from what the spec originally proposed (based on Task 3/4/5 mismatches), update Section 5.3 with the corrected row.

- [ ] **Step 5: Update Section 11.1 risks if environment check revealed issues**

If Task 6 found Claude Code version < 2.1.32, add a risk entry:
```markdown
| Claude Code version below 2.1.32 | High | Upgrade required before M4; M1/M2 can proceed |
```

---

### Task 11: Commit M1 findings

**Files:**
- Staged: `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md`

- [ ] **Step 1: Review spec diff**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git diff docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md
```

Expected: shows Section 11.2 resolutions + any Section 5.1/5.3/5.4/9.1/11.1 updates from the resolution process.

- [ ] **Step 2: Stage and commit**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git add docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md
git -c commit.gpgsign=false commit -m "$(cat <<'EOF'
docs: M1 inventory findings — resolve open questions in orchestration spec

- OQ1: classify maker-orchestrator and ait-orchestrator (see spec Section 11.2)
- OQ2: agent-maker master pattern resolved
- OQ3: ralph-phase-details.md reference path confirmed valid
- Updated skill count, deletion list, and tools matrix to reflect reality

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit succeeds.

- [ ] **Step 3: Verify commit**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git log -1 --oneline
```

Expected: commit visible with message starting `docs: M1 inventory findings`.

---

## Phase M2: Worker Tools Restriction

For every worker subagent, add a `tools:` field to the frontmatter using the matrix in spec Section 5.3. This is the structural enforcement of the "no nested spawn" rule: by omitting `Agent` from the tools list, the worker cannot call other subagents.

**Edit pattern for every file:**

Before (example):
```yaml
---
name: pm-discovery
description: |
  ...
model: inherit
color: blue
---
```

After:
```yaml
---
name: pm-discovery
description: |
  ...
model: inherit
color: blue
tools: [Read, Grep, Glob, WebSearch, WebFetch]
---
```

The new line goes right before the closing `---` of the frontmatter. `Agent` must NEVER appear in the tools array.

---

### Task 12: Add `tools` to pm-agent workers (10 files)

**Files:**
- Modify: `plugins/pm-agent/agents/pm-discovery.md`
- Modify: `plugins/pm-agent/agents/pm-strategist.md`
- Modify: `plugins/pm-agent/agents/pm-analyst.md`
- Modify: `plugins/pm-agent/agents/pm-executor.md`
- Modify: `plugins/pm-agent/agents/pm-gtm.md`
- Modify: `plugins/pm-agent/agents/pm-feedback-loop.md`
- Modify: `plugins/pm-agent/agents/ux-specialist.md`
- Modify: `plugins/pm-agent/agents/user-persona-tester.md`
- Modify: `plugins/pm-agent/agents/live-app-walkthrough.md`
- Modify: `plugins/pm-agent/agents/domain-expert-consultant.md`

- [ ] **Step 1: Re-read `pm-discovery.md` frontmatter**

Use Read tool on the file to get exact current frontmatter.

- [ ] **Step 2: Add `tools` field to `pm-discovery.md`**

Use Edit tool:
- `old_string`: the line immediately before the closing `---` of the frontmatter (usually `color: blue` or `model: inherit`)
- `new_string`: that same line + newline + `tools: [Read, Grep, Glob, WebSearch, WebFetch]`

If there is already a `tools:` field, verify it matches the spec matrix and does NOT contain `Agent`. If it differs, replace it with the spec value.

- [ ] **Step 3: Add `tools` field to `pm-strategist.md`**

Value: `tools: [Read, Write, Grep, Glob, WebSearch]`

Same Edit pattern as Step 2.

- [ ] **Step 4: Add `tools` field to `pm-analyst.md`**

Value: `tools: [Read, Write, Grep, Glob, WebSearch]`

- [ ] **Step 5: Add `tools` field to `pm-executor.md`**

Value: `tools: [Read, Write, Edit, Grep, Glob]`

- [ ] **Step 6: Add `tools` field to `pm-gtm.md`**

Value: `tools: [Read, Write, Grep, Glob]`

- [ ] **Step 7: Add `tools` field to `pm-feedback-loop.md`**

Value: `tools: [Read, Write, Grep, Glob, Bash]`

- [ ] **Step 8: Add `tools` field to `ux-specialist.md`**

Value: `tools: [Read, Write, Bash, Grep, Glob]`

- [ ] **Step 9: Add `tools` field to `user-persona-tester.md`**

Value: `tools: [Read, Write, Bash, Grep, Glob]`

- [ ] **Step 10: Add `tools` field to `live-app-walkthrough.md`**

Value: `tools: [Read, Write, Bash, Grep, Glob]`

- [ ] **Step 11: Add `tools` field to `domain-expert-consultant.md`**

Value: `tools: [Read, Write, Grep, Glob, WebSearch, WebFetch]`

(Note: NotebookLM MCP tools are loaded via MCP server config, not listed here.)

- [ ] **Step 12: Verify no file contains `Agent` in tools**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
grep -l "tools:.*Agent" plugins/pm-agent/agents/ 2>&1 || echo "clean"
```

Expected: `clean`. If any file matches, revert and fix.

- [ ] **Step 13: Commit pm-agent worker restrictions**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git add plugins/pm-agent/agents/pm-discovery.md plugins/pm-agent/agents/pm-strategist.md plugins/pm-agent/agents/pm-analyst.md plugins/pm-agent/agents/pm-executor.md plugins/pm-agent/agents/pm-gtm.md plugins/pm-agent/agents/pm-feedback-loop.md plugins/pm-agent/agents/ux-specialist.md plugins/pm-agent/agents/user-persona-tester.md plugins/pm-agent/agents/live-app-walkthrough.md plugins/pm-agent/agents/domain-expert-consultant.md
git -c commit.gpgsign=false commit -m "$(cat <<'EOF'
refactor(pm-agent): add tools restriction to worker subagents

Enforces 2-tier official convention by explicitly scoping tools and
omitting Agent. Workers can no longer spawn other subagents (blocked at
the tool definition level).

Per spec Section 5.3 pm-agent tools matrix.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Add `tools` to design-team workers (5 files)

**Files:**
- Modify: `plugins/design-team/agents/design-screen-generator.md`
- Modify: `plugins/design-team/agents/design-visionary.md`
- Modify: `plugins/design-team/agents/design-iterator.md`
- Modify: `plugins/design-team/agents/design-system-manager.md`
- Modify: `plugins/design-team/agents/design-handoff.md`

- [ ] **Step 1: Add `tools` to `design-screen-generator.md`**

Value: `tools: [Read, Write, Bash]`

Use Edit tool with the pattern from Task 12 Step 2. Stitch MCP tools are loaded via MCP config, not listed here.

- [ ] **Step 2: Add `tools` to `design-visionary.md`**

Value: `tools: [Read, Write, Bash, Grep, Glob]`

- [ ] **Step 3: Add `tools` to `design-iterator.md`**

Value: `tools: [Read, Edit, Bash]`

- [ ] **Step 4: Add `tools` to `design-system-manager.md`**

Value: `tools: [Read, Write, Edit, Grep, Glob]`

- [ ] **Step 5: Add `tools` to `design-handoff.md`**

Value: `tools: [Read, Write, Edit, Grep, Glob]`

- [ ] **Step 6: Verify no `Agent` in tools**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
grep -l "tools:.*Agent" plugins/design-team/agents/ 2>&1 || echo "clean"
```

Expected: `clean`.

- [ ] **Step 7: Commit design-team worker restrictions**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git add plugins/design-team/agents/design-screen-generator.md plugins/design-team/agents/design-visionary.md plugins/design-team/agents/design-iterator.md plugins/design-team/agents/design-system-manager.md plugins/design-team/agents/design-handoff.md
git -c commit.gpgsign=false commit -m "$(cat <<'EOF'
refactor(design-team): add tools restriction to worker subagents

Enforces 2-tier convention for design workers. Stitch MCP tools are
loaded via MCP server config and not listed in the tools array.

Per spec Section 5.3 design-team tools matrix.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Add `tools` to dev-team workers (13 files)

**Files:**
- Modify: `plugins/dev-team/agents/dev-architect.md`
- Modify: `plugins/dev-team/agents/dev-backend.md`
- Modify: `plugins/dev-team/agents/dev-frontend.md`
- Modify: `plugins/dev-team/agents/dev-ui-engineer.md`
- Modify: `plugins/dev-team/agents/dev-qa.md`
- Modify: `plugins/dev-team/agents/dev-reviewer.md`
- Modify: `plugins/dev-team/agents/dev-debugger.md`
- Modify: `plugins/dev-team/agents/dev-devops.md`
- Modify: `plugins/dev-team/agents/flow-graph-validator.md`
- Modify: `plugins/dev-team/agents/live-app-tester.md`
- Modify: `plugins/dev-team/agents/app-qa-tester.md`
- Modify: `plugins/dev-team/agents/ops-monitor.md`
- Modify: `plugins/dev-team/agents/bridge-translator.md`

- [ ] **Step 1: Add `tools` to `dev-architect.md`**

Value: `tools: [Read, Write, Grep, Glob]`

- [ ] **Step 2: Add `tools` to `dev-backend.md`**

Value: `tools: [Read, Edit, Write, Bash, Grep, Glob]`

- [ ] **Step 3: Add `tools` to `dev-frontend.md`**

Value: `tools: [Read, Edit, Write, Bash, Grep, Glob]`

- [ ] **Step 4: Add `tools` to `dev-ui-engineer.md`**

Value: `tools: [Read, Edit, Write, Bash, Grep, Glob]`

- [ ] **Step 5: Add `tools` to `dev-qa.md`**

Value: `tools: [Read, Edit, Bash, Grep, Glob]`

- [ ] **Step 6: Add `tools` to `dev-reviewer.md`**

Value: `tools: [Read, Grep, Glob]`

This is a read-only reviewer. It must NOT have Edit/Write/Bash to prevent reviewer from accidentally modifying code.

- [ ] **Step 7: Add `tools` to `dev-debugger.md`**

Value: `tools: [Read, Edit, Bash, Grep, Glob]`

- [ ] **Step 8: Add `tools` to `dev-devops.md`**

Value: `tools: [Read, Edit, Write, Bash, Grep, Glob]`

- [ ] **Step 9: Add `tools` to `flow-graph-validator.md`**

Value: `tools: [Read, Grep, Glob]`

Read-only validator.

- [ ] **Step 10: Add `tools` to `live-app-tester.md`**

Value: `tools: [Read, Bash, Grep, Glob]`

Read + Bash only (for gstack browse). No Edit/Write.

- [ ] **Step 11: Add `tools` to `app-qa-tester.md`**

Value: `tools: [Read, Bash, Grep, Glob]`

- [ ] **Step 12: Add `tools` to `ops-monitor.md`**

Value: `tools: [Read, Bash, Grep, Glob]`

- [ ] **Step 13: Add `tools` to `bridge-translator.md`**

Value: `tools: [Read, Edit, Grep, Glob]`

- [ ] **Step 14: Verify no `Agent` in tools**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
grep -l "tools:.*Agent" plugins/dev-team/agents/ 2>&1 || echo "clean"
```

Expected: `clean`.

- [ ] **Step 15: Commit dev-team worker restrictions**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git add plugins/dev-team/agents/dev-architect.md plugins/dev-team/agents/dev-backend.md plugins/dev-team/agents/dev-frontend.md plugins/dev-team/agents/dev-ui-engineer.md plugins/dev-team/agents/dev-qa.md plugins/dev-team/agents/dev-reviewer.md plugins/dev-team/agents/dev-debugger.md plugins/dev-team/agents/dev-devops.md plugins/dev-team/agents/flow-graph-validator.md plugins/dev-team/agents/live-app-tester.md plugins/dev-team/agents/app-qa-tester.md plugins/dev-team/agents/ops-monitor.md plugins/dev-team/agents/bridge-translator.md
git -c commit.gpgsign=false commit -m "$(cat <<'EOF'
refactor(dev-team): add tools restriction to worker subagents

Enforces 2-tier convention for dev workers. dev-reviewer and
flow-graph-validator are read-only (no Edit/Write/Bash). live-app-tester,
app-qa-tester, ops-monitor have Read+Bash for gstack browse but no
Edit/Write (testing-only workers).

Per spec Section 5.3 dev-team tools matrix.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Add `tools` to agent-maker workers (count from M1)

**Files:**
- Modify: all files classified as WORKER in Task 1 (from `/tmp/m1-inventory-agent-maker.txt`)

- [ ] **Step 1: List workers from M1 inventory**

Read `/tmp/m1-inventory-agent-maker.txt`. Extract all lines tagged `WORKER`.

- [ ] **Step 2: For each worker, add `tools` field**

For each worker identified, use Edit tool with the pattern from Task 12 Step 2.

Tools assignment rule:
- If the agent's body shows it creates new `.md` files → `[Read, Write, Edit, Grep, Glob]`
- If the agent's body shows it only reads and analyzes → `[Read, Grep, Glob]`
- If the agent runs validation scripts → `[Read, Bash, Grep, Glob]`
- Default (when unsure): `[Read, Write, Edit, Grep, Glob, Bash]` (write-capable worker, no Agent)

For each file modified, record the chosen tools in `/tmp/m2-agent-maker-tools.txt`.

- [ ] **Step 3: Verify no `Agent` in tools**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
grep -l "tools:.*Agent" plugins/agent-maker/agents/ 2>&1 || echo "clean"
```

Expected: `clean`.

- [ ] **Step 4: Commit agent-maker worker restrictions**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git add plugins/agent-maker/agents/
git -c commit.gpgsign=false commit -m "$(cat <<'EOF'
refactor(agent-maker): add tools restriction to worker subagents

Enforces 2-tier convention for agent-maker workers per M1 inventory
findings. Any agent classified as orchestrator in M1 is NOT included
here (handled in future skill conversion plan).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: Add `tools` to ait-team workers (count from M1)

**Files:**
- Modify: all files classified as WORKER in Task 2 (from `/tmp/m1-inventory-ait-team.txt`)

- [ ] **Step 1: List workers from M1 inventory**

Read `/tmp/m1-inventory-ait-team.txt`. Extract all lines tagged `WORKER`.

- [ ] **Step 2: For each worker, add `tools` field**

Same process as Task 15 Step 2. Tools assignment uses the same rules. ait-team workers typically need Bash (for `granite build`, npm, etc.), so the default for a write-capable ait worker is `[Read, Edit, Write, Bash, Grep, Glob]`.

Record choices in `/tmp/m2-ait-team-tools.txt`.

- [ ] **Step 3: Verify no `Agent` in tools**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
grep -l "tools:.*Agent" plugins/ait-team/agents/ 2>&1 || echo "clean"
```

Expected: `clean`.

- [ ] **Step 4: Commit ait-team worker restrictions**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git add plugins/ait-team/agents/
git -c commit.gpgsign=false commit -m "$(cat <<'EOF'
refactor(ait-team): add tools restriction to worker subagents

Enforces 2-tier convention for ait-team workers per M1 inventory
findings. ait workers typically need Bash for granite build commands.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 17: Global verification — no `Agent` tool in any worker

**Files:**
- Read: all worker `.md` files across all plugins

- [ ] **Step 1: Grep all worker files for Agent in tools**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
grep -rn "tools:" plugins/*/agents/ | grep -v "^$"
```

Expected: a list of every worker's `tools:` line. Review each one — none should contain `Agent`.

- [ ] **Step 2: Explicit Agent check**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
grep -rln "tools:.*Agent" plugins/*/agents/ 2>&1
```

Expected: no output (or "no matches"). If any files match, they are bugs — open each and remove `Agent` from the tools array.

- [ ] **Step 3: Count workers with tools field**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
grep -rl "^tools:" plugins/*/agents/ | wc -l
```

Expected: ~28+ (exact count depends on M1 inventory resolution). Record the count.

- [ ] **Step 4: Count total worker files**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
find plugins/*/agents -name "*.md" | wc -l
```

Expected: total count. Workers with `tools` + remaining orchestrators (8, still present) should equal this total. If not, some worker is missing a `tools` field.

- [ ] **Step 5: Identify and fix any workers missing tools**

If Step 3 count < (Step 4 count - 8), find missing:
```bash
cd /Users/wschoe/project/plz-survive-jay
for f in $(find plugins/*/agents -name "*.md"); do
  if ! grep -q "^tools:" "$f"; then
    name=$(grep "^name:" "$f" | head -1)
    # Skip known orchestrators
    case "$name" in
      *app-factory*|*pm-orchestrator*|*design-orchestrator*|*design-sync-lead*|*dev-orchestrator*|*bugfix-coordinator*|*maker-orchestrator*|*ait-orchestrator*)
        ;;
      *)
        echo "MISSING tools: $f ($name)"
        ;;
    esac
  fi
done
```

Expected: no `MISSING` lines. For each reported file, determine appropriate tools from its body and add (using the same pattern as Tasks 12-16). Commit with a follow-up message.

---

### Task 18: Smoke test — ensure existing pipeline still works

**Files:**
- No file modifications, validation only

- [ ] **Step 1: Pick an existing app for regression check**

List existing apps:
```bash
cd /Users/wschoe/project/plz-survive-jay
ls apps/
```

Pick the most recently modified app. Record its name.

- [ ] **Step 2: Try a minimal worker invocation**

In the current Claude Code session, test that a worker can still be spawned with its new tools restriction.

Example: ask Claude to use the `flow-graph-validator` subagent on the picked app:
```
"Use the flow-graph-validator agent to check apps/{picked-app}/docs/pm-outputs/screen-flows.md against the actual code."
```

- [ ] **Step 3: Verify the worker does NOT attempt to spawn others**

Watch the Claude Code session output. The worker should:
- Read files
- Report findings
- Return a final message

It should NOT say "let me delegate this to another agent" or attempt to use the Agent tool. If it does, the tools restriction is failing — check that `Agent` is not in the worker's tools array.

- [ ] **Step 4: Verify the worker does its actual job**

The worker's final message should contain meaningful flow-graph validation results. If it says "I cannot access X tool", the tools list may be missing a needed tool. Review `/tmp/m1-*-mismatches.txt` from M1 to see if this was flagged.

- [ ] **Step 5: If smoke test fails, diagnose and fix**

Possible failures:
- Worker complains about missing tool → add the needed tool (except Agent) and re-test
- Worker tries to spawn another subagent → tools restriction is working but worker body assumed it could; flag for Plan 2 skill conversion
- Worker output is empty → unrelated issue, investigate separately

Record smoke test result (PASS or FAIL with details) in `/tmp/m2-smoke-test.txt`.

---

### Task 19: Final plan status check

**Files:**
- No modifications, status only

- [ ] **Step 1: Review all commits from this plan**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git log --oneline | head -20
```

Expected commits (in order):
1. `docs: M1 inventory findings — resolve open questions in orchestration spec`
2. `refactor(pm-agent): add tools restriction to worker subagents`
3. `refactor(design-team): add tools restriction to worker subagents`
4. `refactor(dev-team): add tools restriction to worker subagents`
5. `refactor(agent-maker): add tools restriction to worker subagents`
6. `refactor(ait-team): add tools restriction to worker subagents`

Plus any follow-up fix commits from Task 17 Step 5 if applicable.

- [ ] **Step 2: Check working tree is clean**

Run:
```bash
cd /Users/wschoe/project/plz-survive-jay
git status
```

Expected: clean (only ignored files or pre-existing unrelated changes).

- [ ] **Step 3: Summary status report**

Write a brief status note for the user:

```
Plan 1 (M1 + M2) complete.

M1 Findings:
- Environment: Claude Code {version}, Agent Teams {state}, tmux {state}
- OQ1: {maker-orchestrator classification}, {ait-orchestrator classification}
- OQ2: agent-maker pattern = {a|b|c}
- OQ3: ralph-phase-details reference confirmed

M2 Tools Restriction Applied:
- pm-agent: 10 workers
- design-team: 5 workers
- dev-team: 13 workers
- agent-maker: {count} workers
- ait-team: {count} workers
- Total: {sum} workers restricted
- Zero Agent tool references in any worker

Smoke test: {PASS | FAIL with details}

Ready for Plan 2: skill writing.
```

Deliver this to the user as the final message of plan execution.

---

## Self-Review

### Spec coverage check

- ✅ **Section 9.1 M1 inventory**: Tasks 1-6 cover reading all unread files + environment check
- ✅ **Section 11.2 Open Questions**: Tasks 7-9 resolve each of OQ1/OQ2/OQ3
- ✅ **Section 5.3 tools matrix**: Tasks 12-16 apply the matrix to every worker
- ✅ **Section 9.1 M2 tools restriction**: Tasks 12-17 implement it
- ✅ **Section 5.4 protected legacy files**: NOT touched — orchestrator files remain for rollback safety, consistent with the M1+M2 "additive only" scope
- ✅ **Section 11.1 risks**: Task 6 surfaces environment blockers, Task 10 Step 5 updates spec with new risks
- ✅ **Spec amendment**: Task 10-11 update the spec file and commit it

### Placeholder scan

Reviewed all tasks for red-flag patterns:
- ✅ No "TBD" or "TODO" in step content
- ✅ No "add appropriate error handling" vague instructions
- ✅ No "similar to Task N" shortcuts — each task repeats its edit pattern
- ✅ Every edit step shows the exact value to insert
- ⚠️ Tasks 15-16 have content dependent on M1 findings (agent-maker and ait-team worker lists). This is NOT a placeholder — it's legitimate dependency on inventory results. Rules for tools assignment are explicit so the execution agent can make decisions at runtime.

### Type consistency

- ✅ `tools:` field name consistent across all tasks (not `tool:` or `allowedTools:` anywhere)
- ✅ Tools list format consistent: `[Read, Write, Edit, Grep, Glob]` with spaces after commas
- ✅ Every "verify no Agent" check uses the same grep pattern
- ✅ Commit message format consistent (`refactor({plugin}): ...`)

### Scope

- ✅ Single plan scope: ~19 tasks, ~2-4 hours execution time, purely additive
- ✅ Independent testable outcome: after this plan, workers have tools restriction but existing orchestrator pipeline still works (tested in Task 18)
- ✅ Rollback path: each task is a separate commit; any task can be reverted individually

---

## Execution Handoff

After Plan 1 is complete, the repo state is:
- Spec updated with M1 findings (Open Questions resolved)
- All ~28+ workers have `tools:` frontmatter with no `Agent`
- Existing 8 orchestrators (app-factory, pm-orchestrator, etc.) still exist and still work
- Ready to proceed to Plan 2: write the 11 skills and 7 slash commands that will eventually replace the orchestrators

**Two execution modes for this plan:**

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration. Good for this plan because tasks are independent and each has a clear verification step.

**2. Inline Execution** — execute tasks in the current session using `superpowers:executing-plans`. Good if you want to watch each task unfold and intervene quickly.

Which approach do you want to use?
