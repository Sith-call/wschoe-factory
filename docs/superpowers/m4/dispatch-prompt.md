# M4 Dispatch Prompt — feed this verbatim to the teammate / session

> This is the exact prompt used when dispatching the Agent Teams teammate (primary path) or when opening a new Claude Code session in the fallback worktree. Do not paraphrase.

---

You are executing M4 of the app-factory orchestration redesign. Your job: build the test app `하루 감사 일기` end-to-end using the new skill chain, then produce a per-stage Go/No-Go report.

## Inputs

- Test app spec: read `docs/superpowers/m4/test-app-spec.md` first.
- Target output directory: `apps/haru-gratitude-diary/`
- Idea sentence to start the pipeline: `하루 감사 일기 앱 만들어줘`

## Execution

0. **Pre-flight (mandatory).** Before invoking any skill, verify and repair the environment. Run from repo root.

   **A. gstack skill** — it is a user-scoped Skill invoked via the Skill tool, NOT a CLI binary. Never probe with `command -v`.
   ```bash
   test -f ~/.claude/skills/gstack/SKILL.md
   ```
   If missing, STOP and report `NO-GO (Blocker A: gstack skill unavailable)`.

   **B. Factory plugins** — the 5 plugins (pm-agent, dev-team, design-team, agent-maker, ait-team) live under `plugins/` with a local marketplace manifest at `plugins/.claude-plugin/marketplace.json`. Register and install project-scoped so the config lives in this repo's `.claude/settings.json`:
   ```bash
   # Re-register marketplace idempotently (remove any stale registration, then add fresh)
   claude plugins marketplace remove app-factory 2>/dev/null || true
   claude plugins marketplace add ./plugins --scope project

   # Install all 5 factory plugins (install writes to .claude/settings.json enabledPlugins)
   for p in pm-agent dev-team design-team agent-maker ait-team; do
     claude plugins install "${p}@app-factory" --scope project || { echo "INSTALL FAILED: $p"; exit 1; }
   done
   ```
   If the `marketplace add` or any `install` command exits non-zero, STOP and report `NO-GO (Blocker B: plugin registration failed)` with the exact CLI output.

   **C. Per-plugin verification** — this replaces the old `grep` that collapsed installed/enabled/absent into one result. Run:
   ```bash
   claude plugins list --json | python3 -c '
   import json, sys
   data = json.load(sys.stdin)
   required = ["pm-agent@app-factory", "dev-team@app-factory", "design-team@app-factory", "agent-maker@app-factory", "ait-team@app-factory"]
   by_id = {p["id"]: p for p in data}
   bad = []
   for r in required:
       p = by_id.get(r)
       if not p:
           bad.append(r + ": NOT INSTALLED")
       elif not p.get("enabled"):
           scope = p.get("scope", "?")
           bad.append(r + ": INSTALLED BUT DISABLED (scope=" + scope + ", enable in .claude/settings.json)")
       else:
           scope = p.get("scope", "?")
           print(r + ": OK (scope=" + scope + ")")
   if bad:
       print("--- BLOCKER B ---")
       for b in bad: print(b)
       sys.exit(1)
   '
   ```
   All 5 must print `OK`. If any line reports `NOT INSTALLED` or `DISABLED`, STOP and report `NO-GO (Blocker B)` including the exact failing lines.

   **Note on `.claude/settings.json` mutation:** Step B will write `extraKnownMarketplaces.app-factory` and `enabledPlugins` into `.claude/settings.json`. `extraKnownMarketplaces` stores an **absolute path** to the marketplace, which is host-specific and must NOT be committed. When reporting M4 results, leave `.claude/settings.json` out of any commit — it is bootstrap state that Step 0 re-creates on every fresh environment.

   Only proceed to Step 1 when A and C both pass.

1. Invoke the `app-factory` skill (or run `/app-factory 하루 감사 일기 앱 만들어줘`).
2. Let the full 5-stage chain run: pm-orchestrate → stitch-generate → design-sync → dev-orchestrate → ralph-persona-loop → release-prep.
3. Do NOT skip stages. Do NOT short-circuit Ralph.
4. Ralph must run at least 1 iteration (spec §9.1 M4 Go criterion).

## Hard rules during execution

- Every Stage 2b / Stage 3 / Stage 4 evaluation MUST use `gstack browse` for real browser verification and MUST capture screenshots to `docs/superpowers/m4/screenshots/stage-N-<description>.png`.
- If any gate fails, STOP the pipeline immediately. Do not patch silently and continue. Capture the failure and report it.
- If a skill emits any `*_STAGE_COMPLETE` text signal, that is a spec violation — log it as a defect (spec §4 forbids text signals, handoff is filesystem-only).
- Worker subagents MUST NOT spawn other workers. If you observe nested Agent dispatch from a worker, log it as a defect (violates Plan 1 tools restriction).

## Reporting

After execution (or after stopping at a failed gate), write your report into `docs/superpowers/m4/report.md` by copying the schema from `docs/superpowers/m4/report-template.md` and filling in every field for every stage that ran. For stages that never started due to an earlier gate failure, mark them `Status: NOT REACHED` and leave other fields blank.

At the end of the report, write the Go/No-Go verdict:
- **GO**: all 5 stages PASS, app builds (`npm run build` succeeds), Ralph ran ≥1 iteration.
- **NO-GO**: any stage FAIL or PARTIAL, or missing Ralph iteration, or any spec violation observed.

Include a "Defects" section listing each observed issue with file path, line number if applicable, and proposed fix location (which skill body or worker file needs patching).

## What you must NOT do

- Do not merge any branches
- Do not push to origin
- Do not rewrite legacy orchestrator files (those are still live for rollback safety)
- Do not modify `CLAUDE.md` or `PRODUCT_LOOP.md`
- Do not commit `apps/haru-gratitude-diary/` itself yet — the plan-3 executor (main session) decides whether to commit the generated app in Task 6.
