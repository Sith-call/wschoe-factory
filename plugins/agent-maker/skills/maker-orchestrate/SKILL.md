---
name: maker-orchestrate
description: Agent-maker meta workflow — research existing agents, design new agent spec, build agent .md file, validate against conventions. Invoked when user asks to create or modify a Claude Code agent.
---

# Maker Orchestrate

## Purpose & Scope

Run the 4-phase agent-maker pipeline to create or modify a Claude Code agent: research existing agents and capability gaps, design the new agent specification, build the agent `.md` file, and validate it against conventions. This is a standalone meta-workflow, not part of the app-factory app pipeline. Use when the user asks to add a new agent to a team, fill a capability gap, or improve an existing agent.

Scope is limited to authoring agent definition files under `plugins/<team>/agents/` and any associated plugin metadata. Do not implement product features inside this workflow.

## Prerequisites

- Working directory is the repo root (contains `plugins/` and `CLAUDE.md`).
- The target plugin directory exists (e.g. `plugins/dev-team/agents/`). If the user requests a brand-new team, create the plugin directory before dispatching workers.
- The user has provided the target team and a description of the desired agent, or has asked for gap analysis.
- Workers available: `maker-researcher`, `maker-architect`, `maker-builder`, `maker-validator`.

## Execution Steps

1. **Phase 1 — Research.** Dispatch `maker-researcher` to audit the target team's existing agents under `plugins/<team>/agents/`, map coverage against the intended workflow, identify gaps, and assess viability of the requested agent. Output: research report containing gap list, viability rating, and recommended agent role.
2. **Phase 2 — Design.** Dispatch `maker-architect` with the Phase 1 research report. Architect defines the agent's name, role, responsibilities, boundaries, tools, triggering conditions, and drafts the frontmatter `description` examples and system prompt outline. Output: agent design spec (markdown). Depends strictly on Phase 1 output.
3. **Phase 3 — Build.** Dispatch `maker-builder` with the Phase 2 design spec. Builder writes the agent file to `plugins/<team>/agents/<agent-name>.md` with full frontmatter (`name`, `description`, `model`, `color`) and system prompt body, and updates `plugins/<team>/plugin.json` if required. Output: path to new/updated agent file. Depends strictly on Phase 2 output.
4. **Phase 4 — Validate.** Dispatch `maker-validator` with the Phase 3 file path. Validator checks frontmatter format, required fields, triggering example clarity, system prompt completeness, and overlap with existing agents in the same team. Output: pass/fail verdict with itemized feedback. Depends strictly on Phase 3 output.

## Worker Dispatch Plan

| Phase | Worker | Mode | Depends On | Input | Output |
|-------|--------|------|------------|-------|--------|
| 1 | `maker-researcher` | sequential (single) | — | target team, user request | gap + viability report |
| 2 | `maker-architect` | sequential (single) | Phase 1 | research report | agent design spec |
| 3 | `maker-builder` | sequential (single) | Phase 2 | design spec | agent `.md` file path |
| 4 | `maker-validator` | sequential (single) | Phase 3 | agent file path | pass/fail + feedback |

All phases are strictly sequential; each worker receives only the immediately preceding phase's output plus the original user request.

## Gate Verification

Before declaring the workflow complete, verify all of the following:

1. `maker-validator` returned an explicit **pass** verdict.
2. The new/updated agent file exists: `test -f plugins/<team>/agents/<agent-name>.md`.
3. The file has valid frontmatter with a `name:` field: `grep '^name:' plugins/<team>/agents/<agent-name>.md` returns a non-empty line matching the intended agent name.
4. If the file is new, `plugins/<team>/plugin.json` (if present) references it correctly.

If any check fails, do not mark the workflow complete — fall through to Error Handling.

## Error Handling

- **Validator fail (Phase 4).** Loop back to Phase 3 (`maker-builder`) passing the validator's feedback. Re-run validator. Maximum **2 retries**. If still failing after retry 2, stop, surface the validator feedback to the user, and request guidance.
- **Builder cannot write file** (path invalid, plugin dir missing). Stop and report to user; do not silently create directories outside the intended plugin.
- **Researcher flags viability as low.** Stop after Phase 1 and present findings to the user for a go/no-go decision before proceeding to Phase 2.
- **Architect output missing required fields** (name, description, system prompt). Re-dispatch architect once with explicit field checklist; if still incomplete, stop and report.
- Never skip phases or run workers in parallel.

## Final State

- New or updated agent file committed at `plugins/<team>/agents/<agent-name>.md` with valid frontmatter and system prompt.
- `plugins/<team>/plugin.json` updated if the plugin manifest tracks agents explicitly.
- Summary delivered to user containing: agent name, target team, file path, validator verdict, and a short changelog of what was added or modified.
