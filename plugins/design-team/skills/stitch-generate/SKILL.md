---
name: stitch-generate
description: Stage 2a design — generates Stitch screens from user stories. Main session calls mcp__stitch__create_project directly; design-screen-generator workers produce individual screens.
---

# Stitch Generate

## Purpose & Scope

Stage 2a of the App Factory pipeline. Converts the PM-produced screen flows into concrete Stitch-generated UI screens (PNG ground truth) ready for Stage 2b (`design-sync` skill) to implement in React.

Scope:
- Map user stories to individual screens.
- Create a Stitch project via MCP.
- Generate one PNG per screen into `apps/{app}/docs/ground-truth/`.
- Run a single consistency pass and optionally iterate.

Out of scope (handled by `design-sync` skill in Stage 2b):
- React/Tailwind implementation (`App.tsx`)
- Sync criteria document
- Ralph design inner loop

Stage handoff is file-system + TodoWrite only. Do not emit text signals.

## Prerequisites

Before running:
1. **Gate 1 (Stage 1 → 2) passed.** PM stage complete per spec §6.2.
2. **Screen flows exist.** `apps/{app}/docs/pm-outputs/screen-flows.md` must exist and enumerate **≥3 screens**.
3. **Stitch MCP available in the main session.** The `mcp__stitch__*` tools are loaded from the MCP server configuration, **NOT** from any worker subagent's `tools:` list. Workers cannot receive MCP tools via their frontmatter — they inherit MCP access from the runtime. The main session must verify `mcp__stitch__create_project` is callable before dispatching Phase 2a.2.
4. App directory `apps/{app}/docs/design/` and `apps/{app}/docs/ground-truth/` created (or created as part of Phase 2a.1).

If any prerequisite fails, halt and report which artifact is missing.

## Execution Steps

Four phases from spec §7.4.

### Phase 2a.1 — Story → Screen mapping

Dispatch `design-screen-generator` **once** with a prompt that asks it to:
- Read `apps/{app}/docs/pm-outputs/screen-flows.md` and `prd.md`.
- Produce `apps/{app}/docs/design/story-screen-map.md` containing a table of `{screen-name, purpose, key elements, user story IDs, navigation in/out}`.
- Minimum 3 screens; use kebab-case screen names.

Verify file exists and has ≥3 screen rows before continuing.

### Phase 2a.2 — Stitch project creation (main session, direct MCP)

The **main session** invokes the MCP tool directly — do NOT dispatch a worker:

```
mcp__stitch__create_project(title: "{app-name}")
```

Save the returned project ID:

```bash
mkdir -p apps/{app}/docs/design
printf '%s\n' "{projectId}" > apps/{app}/docs/design/stitch-project-id.txt
```

Rationale: MCP tools are not routed through the Task worker boundary cleanly; calling them from the main session keeps project ownership explicit.

### Phase 2a.3 — Screen generation loop (sequential)

For each screen row in `story-screen-map.md`, dispatch `design-screen-generator` **sequentially** (not parallel). Stitch rate-limits per project; parallel calls will fail.

Worker prompt must include:
- Project ID read from `stitch-project-id.txt`
- Screen name, purpose, key elements, key copy (Korean UI text in quotes)
- Instructions to call `mcp__stitch__generate_screen_from_text` with `deviceType: MOBILE`, `modelId: GEMINI_3_1_PRO`, 430px viewport
- Prompt-writing guidance carried forward from `stitch-workflow.md`: no emojis, mood/metaphor first, spatial layout, emotional color, tonal typography, Korean UI text in quotes, reference apps, overall impression
- Instruction to download the rendered screen PNG to `apps/{app}/docs/ground-truth/{screen-name}.png`
- Save a matching HTML source file `apps/{app}/docs/ground-truth/{screen-name}.html` when available (ground-truth reference)

After each worker returns, verify the PNG exists before dispatching the next screen. On failure, see Error Handling.

### Phase 2a.4 — Consistency check

1. Dispatch `design-visionary` in **read-only** mode (no Edit/Write tools). Prompt: "Review all PNGs in `apps/{app}/docs/ground-truth/` for visual consistency — color palette, typography, spacing, component style, brand tone. Output `apps/{app}/docs/design/consistency-report.md` listing any inconsistencies with severity P0/P1/P2."
2. Read the report. If P0/P1 inconsistencies exist, dispatch `design-iterator` with the list of screens to fix via `mcp__stitch__edit_screens`. `design-iterator` must re-download corrected PNGs to the same ground-truth paths.
3. Re-dispatch `design-visionary` once more to confirm. If still P0, halt and escalate.

## Worker Dispatch Plan

Per spec §7.1 contract. `tools:` lists describe the worker subagent's own frontmatter; MCP tool access is runtime-inherited, not frontmatter-declared.

| Phase | Worker | Mode | Invocations | tools (non-MCP) | MCP access needed |
|---|---|---|---|---|---|
| 2a.1 | `design-screen-generator` | write | 1 | `[Read, Write, Glob]` | no |
| 2a.2 | — (main session) | direct MCP | 1 | n/a | `mcp__stitch__create_project` |
| 2a.3 | `design-screen-generator` | write | N (sequential, N = screen count) | `[Read, Write, Bash]` | `mcp__stitch__generate_screen_from_text`, `mcp__stitch__get_screen` |
| 2a.4a | `design-visionary` | read-only | 1 | `[Read, Glob, Grep]` | no |
| 2a.4b | `design-iterator` | write (conditional) | 0-1 | `[Read, Write, Bash]` | `mcp__stitch__edit_screens`, `mcp__stitch__get_screen` |
| 2a.4c | `design-visionary` | read-only | 1 (if 2a.4b ran) | `[Read, Glob, Grep]` | no |

Every dispatch must include the absolute app path and the project ID.

## Gate Verification

This skill enforces a **partial Stage 2 gate (sub-gate 2a)**. The full Stage 2 → 3 gate (spec §6.3) additionally requires `sync-criteria.md` and `App.tsx`, which are produced by the Stage 2b `design-sync` skill — **NOT this skill**. The full gate is verified only after `design-sync` completes.

Sub-gate 2a checks (all must pass):

```bash
# 1. Ground-truth PNGs: at least 3
test "$(ls apps/{app}/docs/ground-truth/*.png 2>/dev/null | wc -l)" -ge 3

# 2. Stitch project ID persisted
test -s apps/{app}/docs/design/stitch-project-id.txt

# 3. Story-screen map present
test -s apps/{app}/docs/design/story-screen-map.md

# 4. Consistency report present and free of unresolved P0s
test -f apps/{app}/docs/design/consistency-report.md
```

If any check fails, do not mark the Stage 2a TodoWrite sub-task complete.

## Error Handling

- **Stitch rate limit** (HTTP 429 or MCP rate-limit error): wait 60 seconds then retry the failing worker dispatch once. On second failure, wait 180 seconds and retry. On third failure, halt and report the screen name that failed.
- **Stitch MCP auth failure** (401/unauthenticated): halt immediately. Instruct the user to re-authenticate the Stitch MCP server (per MCP server config) and re-run the skill. Do not attempt further dispatches.
- **Missing PNG after worker returns**: treat as dispatch failure; retry the same screen worker once with a stricter prompt. If still missing, halt.
- **`design-visionary` still reports P0 after one iterator pass**: halt and escalate to the user — do not loop indefinitely here (the Ralph design loop in Stage 2b handles deep iteration).
- **Prerequisite missing** (screen-flows.md absent, <3 screens): halt before Phase 2a.1.

## Final State

On successful completion:
- `apps/{app}/docs/ground-truth/*.png` — ≥3 PNG screens, one per row in the story-screen map
- `apps/{app}/docs/ground-truth/*.html` — matching HTML source files (when provided by Stitch)
- `apps/{app}/docs/design/stitch-project-id.txt` — single line containing the Stitch project ID
- `apps/{app}/docs/design/story-screen-map.md` — story → screen mapping
- `apps/{app}/docs/design/consistency-report.md` — visionary review, P0-free
- TodoWrite: Stage 2a sub-task marked complete. The parent Stage 2 todo remains open until `design-sync` (Stage 2b) also completes.

No text completion signal is emitted. The next skill (`design-sync`) detects readiness by reading the files above.
