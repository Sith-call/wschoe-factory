---
name: ralph-design-loop
description: Inner visual convergence loop — iterates design-visionary evaluation and dev-ui-engineer fixes until font/color mismatches reach zero. Called by design-sync skill.
---

# Ralph Design Loop

## Purpose & Scope

Scaled-down Ralph loop focused on **visual match only** between Stitch ground-truth PNGs and the current React implementation. One evaluator (`design-visionary`) + one fixer (`dev-ui-engineer`), max 3 sequential iterations, single convergence gate: font/color mismatches = 0.

**NOT invoked directly by `app-factory`.** This is an inner loop called by the `design-sync` skill (Stage 2b). For full persona-satisfaction quality loops use `ralph-persona-loop` instead.

## Prerequisites

- Stitch ground-truth PNGs exist at `apps/{app}/docs/ground-truth/*.png` (and matching `*.html` where available).
- Initial React implementation already built by `dev-ui-engineer` and reachable via a running dev server (e.g. `npx vite --port 5173`).
- `apps/{app}/docs/design/sync-criteria.md` listing Must-Match items exists (created by `design-sync`).
- `gstack browse` binary available for screenshots and computed-style extraction.
- TodoWrite sub-task for this loop is marked `in_progress` by the caller.

## Execution Steps

Run up to **3 sequential iterations**. Each iteration = evaluate → fix → rebuild.

1. **Iteration N — Evaluate (`design-visionary`, read-only).** Dispatch one worker task asking it to:
   - Take fresh screenshots of each screen via `gstack browse`:
     ```bash
     $B viewport 430x932
     $B goto http://localhost:5173
     $B screenshot /tmp/app-iter{N}-{screen}.png
     ```
   - Read ground-truth PNG at `apps/{app}/docs/ground-truth/{screen}.png` and the fresh screenshot side-by-side.
   - Extract computed fontFamily / color / backgroundColor sets from both the Stitch HTML (`file://apps/{app}/docs/ground-truth/{screen}.html`) and the live app via `$B js` (see historical script in prior version).
   - Produce a report listing exact mismatches (font, color, spacing) with file:line targets in `apps/{app}/src/`.
   - End report with a literal line: `폰트/색상 불일치: {count}` (or `mismatches: {count}`).

2. **Iteration N — Fix (`dev-ui-engineer`).** Dispatch one worker task with the evaluator's report. Instruct it to:
   - Copy Tailwind classes directly from `apps/{app}/docs/ground-truth/{screen}.html`.
   - No inline styles.
   - Run `npm run build` in `apps/{app}` and confirm success.
   - Commit atomically: `git commit -m "fix(design-sync): {screen} — {what changed}"`.

3. **Gate check after each iteration.** If evaluator's next run reports 0 mismatches → exit loop successfully. Otherwise continue to iteration N+1 until N = 3.

4. **Write final report** to `apps/{app}/docs/design/visual-sync-report.md` summarizing per-iteration mismatch counts, final state, and remaining gaps (if any).

## Worker Dispatch Plan

| Worker | Role | Tools | Iteration |
|---|---|---|---|
| `design-visionary` | Visual evaluator — screenshot, compare, extract computed styles, count font/color mismatches against Stitch ground truth | Read, Grep, Glob, Bash (read-only: `gstack browse`, `$B screenshot`, `$B js`) | Before every fix (iterations 1..3) |
| `dev-ui-engineer` | Fixer — apply Tailwind class updates, rebuild, commit | Read, Edit, Write, Bash (`npm run build`, `git commit`) | After each evaluator report (iterations 1..3) |

Dispatch sequentially, not in parallel: evaluator → fixer → evaluator → ...

## Gate Verification

After each `dev-ui-engineer` iteration, re-run `design-visionary` and verify its report contains zero mismatches. Use Grep on the report file:

```bash
# pass condition — any of these matches on the latest evaluator report:
grep -E "불일치[: ]*0|mismatches[: ]*0" apps/{app}/docs/design/eval-iter{N}.md
```

Loop exits successfully when grep matches. Build must also succeed (`npm run build` exit 0) in the same iteration.

## Error Handling

- **Max iterations reached (N = 3) without convergence** → stop the loop. Write `apps/{app}/docs/design/visual-sync-report.md` as a **partial report** listing remaining mismatches per screen, the final mismatch counts, and a `status: PARTIAL` header. Surface this to the user via the caller (`design-sync`) with a clear message: "Visual convergence incomplete after 3 iterations — manual review required."
- **Build failure inside a fix iteration** → treat as a failed iteration; ask `dev-ui-engineer` to revert the offending commit, then count that attempt toward the 3-iteration budget.
- **`gstack browse` unavailable** → abort immediately; do not fall back to code-only review (violates the project QA rule).
- **Ground-truth PNG missing for a screen** → skip that screen, note it in the final report, continue with remaining screens.

## Final State

On successful exit:

- `apps/{app}/docs/design/visual-sync-report.md` exists with `status: CONVERGED`, per-iteration mismatch counts, and final screenshots referenced.
- Latest fix commit is on the current branch; `npm run build` passes.
- TodoWrite sub-task for this loop is marked `completed` by the caller (`design-sync`).

On partial exit: same report file exists with `status: PARTIAL` and remaining issues listed; TodoWrite sub-task stays `in_progress` and the caller decides next action.
