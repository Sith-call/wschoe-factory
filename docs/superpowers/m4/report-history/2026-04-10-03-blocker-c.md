# M4 Go/No-Go Report — haru-gratitude-diary

**Execution date:** 2026-04-10 (third run — supersedes prior Blocker B report)
**Executor:** dispatched executor session (fallback worktree `/Users/wschoe/project/plz-survive-jay-m4`)
**Claude Code version:** 2.1.98 (Claude Code)
**Starting commit:** dd7134b (plan3/m4-teams-test)

## Environment snapshot

- CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: unset (0)
- tmux version: tmux 3.5a
- gstack **skill** available: **yes** (`~/.claude/skills/gstack/SKILL.md` present)
- Factory plugins registered: **yes — 5 of 5** (all `OK (scope=project)` via per-plugin verifier)
- Legacy orchestrators still present: not counted — halted before Stage 1

## Pre-flight gate results

### Step 0.A — gstack skill: PASS
`test -f ~/.claude/skills/gstack/SKILL.md` → OK. Blocker A (commit ce39f8e fix) confirmed sound.

### Step 0.B — marketplace register + 5-plugin install: PASS
```
$ claude plugins marketplace remove app-factory
✔ Successfully removed marketplace: app-factory
$ claude plugins marketplace add ./plugins --scope project
✔ Successfully added marketplace: app-factory (declared in project settings)
$ for p in pm-agent dev-team design-team agent-maker ait-team; do
    claude plugins install "${p}@app-factory" --scope project; done
✔ Successfully installed plugin: pm-agent@app-factory     (scope: project)
✔ Successfully installed plugin: dev-team@app-factory     (scope: project)
✔ Successfully installed plugin: design-team@app-factory  (scope: project)
✔ Successfully installed plugin: agent-maker@app-factory  (scope: project)
✔ Successfully installed plugin: ait-team@app-factory     (scope: project)
```
Blocker B (commits 1c82733 + a585bbc + dd7134b fix) confirmed sound.

`.claude/settings.json` mutated with `enabledPlugins` (5 entries) and
`extraKnownMarketplaces.app-factory.source.path = "/Users/wschoe/project/plz-survive-jay-m4/plugins"`
(absolute, host-specific). Per dispatch-prompt.md:64, left dirty and NOT committed.

### Step 0.C — per-plugin verifier: PASS
```
pm-agent@app-factory:     OK (scope=project)
dev-team@app-factory:     OK (scope=project)
design-team@app-factory:  OK (scope=project)
agent-maker@app-factory:  OK (scope=project)
ait-team@app-factory:     OK (scope=project)
```

---

## Step 1 gate — FAIL (Blocker C: installed-plugin skills invisible to the running executor session)

With preflight green I attempted to invoke `app-factory` per dispatch-prompt.md Step 1:

```
Skill(skill="app-factory",          args="하루 감사 일기 앱 만들어줘")  → Unknown skill: app-factory
Skill(skill="pm-agent:app-factory", args="하루 감사 일기 앱 만들어줘")  → Unknown skill: pm-agent:app-factory
Skill(skill="pm-orchestrate",       args="하루 감사 일기")              → Unknown skill: pm-orchestrate
```

None of the six pipeline skills (`app-factory`, `pm-orchestrate`, `stitch-generate`, `design-sync`, `dev-orchestrate`, `ralph-persona-loop`, `release-prep`) are callable via the Skill tool in this session, despite:
- Skill files present on disk (verified `plugins/pm-agent/skills/app-factory/SKILL.md` etc.)
- All 5 parent plugins reporting OK via `claude plugins list --json`
- `.claude/settings.json` listing all 5 under `enabledPlugins: true`

**Root cause.** The Claude Code harness builds the Skill tool catalogue **at session start**, before Step 0 runs. The executor session dispatched to run M4 began life with a pre-install catalogue and cannot hot-reload new plugin skills mid-session. Evidence: the session-start skill reminder lists 200+ skills but contains zero entries for any of the 6 pipeline skills, and the three `Skill(...)` calls above all fail with `Unknown skill`. Step 0 installs plugins it itself cannot see — a structural ordering problem inherent to running bootstrap inside the executor.

Per dispatch-prompt.md hard rule *"If any gate fails, STOP immediately — do not silently patch and continue"*, I did NOT attempt workarounds (reading skill bodies and executing them by hand would be silent patching). Pipeline halted at Step 0 → Step 1 boundary.

---

### Stage 1 — pm-orchestrate
- **Status:** NOT REACHED
- **Gate:** "4 required files present: prd.md, user-stories.md, screen-flows.md, persona.md"
- **Notes:** Halted at Step 1 invocation by Blocker C.

### Stage 2a — stitch-generate
- **Status:** NOT REACHED
- **Gate:** "Stitch project created, ≥5 screens generated"
- **Notes:** Halted by Blocker C.

### Stage 2b — design-sync
- **Status:** NOT REACHED
- **Gate:** "Design Score ≥ B+ (§8.7) / ≥ B (§6.3)"
- **Screenshots:** none
- **Notes:** Halted by Blocker C.

### Stage 3 — dev-orchestrate
- **Status:** NOT REACHED
- **Gate:** "`npm run build` exits 0; demo mode loads in gstack browse"
- **Screenshots:** none
- **Notes:** Halted by Blocker C.

### Stage 4 — ralph-persona-loop
- **Status:** NOT REACHED
- **Gate:** "All 6 evaluators score ≥ pass threshold; ≥1 full iteration (spec §9.1 M4)"
- **Screenshots:** none
- **Notes:** Halted by Blocker C. Spec §9.1 M4 hard criterion unmet by definition.

### Stage 5 — release-prep
- **Status:** NOT REACHED
- **Gate:** "Build succeeds, final commit created with RELEASE.md"
- **Notes:** Halted by Blocker C.

---

## Spec-violation observations

- Text-signal leakage (`*_STAGE_COMPLETE`): runtime not exercised — no new evidence.
- Nested worker dispatch: runtime not exercised — no new evidence.
- Missing gstack screenshots on any QA evaluation: not reached — no QA stage ran.
- `tools:` restriction bypass: runtime not exercised — no new evidence.

Static file state on disk for the 6 pipeline skills is unchanged from commit `efcda5b`, which the prior report's static sweep cleared.

## Defects

| # | Stage | File | Issue | Proposed fix |
|---|---|---|---|---|
| 1 | Dispatch boundary | `docs/superpowers/m4/dispatch-prompt.md:17-66` (Step 0) | Step 0 installs the 5 factory plugins via `claude plugins marketplace add` + 5 × `claude plugins install` **inside the executor session that is meant to consume them**. The harness fixes its Skill tool catalogue at session start; plugin skills installed mid-session remain invisible to `Skill(...)`. With 0.A + 0.B + 0.C all green, every invocation in Step 1 still fails with `Unknown skill`. Step 0 cannot bootstrap its own session — only a subsequent session. | Split protocol into two phases. **Phase 1 (bootstrap, parent/dispatcher session):** run `marketplace add` + 5 × `plugins install` so `.claude/settings.json` is written *before* any executor spawns. **Phase 2 (executor, fresh session):** dispatch M4 executor *after* bootstrap so its session-start catalogue already includes the 6 pipeline skills; executor runs a verify-only Step 0 (0.A + 0.C) and fails fast if bootstrap is missing. Move the `marketplace add` + 5 × `install` lines out of the executor's Step 0 entirely. The current executor prompt is a closed loop: it installs plugins it itself cannot see. |
| 2 | Pre-flight ergonomics | `docs/superpowers/m4/dispatch-prompt.md:17-66` | Step 0 has no self-check for "am I running in a session that predates my own installs?" — it reports 0.A+B+C as PASS then silently fails at Step 1 with bare `Unknown skill`, with no guidance that the executor must be a fresh session. Two consecutive NO-GO runs have now terminated at structurally similar Step 0 ordering issues. | Add **Step 0.D — skill liveness**: after 0.C passes, attempt a dry-run `Skill` invocation for each of the 6 pipeline skill names. If any return `Unknown skill`, fail fast: *"Blocker C: skills installed on disk but invisible to this session. Re-dispatch M4 in a fresh executor started AFTER the bootstrap."* Converts silent Step 1 failure into actionable Step 0 blocker. |
| 3 | Environment bookkeeping | `.claude/settings.json` (working tree) | Step 0.B writes a host-specific absolute path `/Users/wschoe/project/plz-survive-jay-m4/plugins` into `extraKnownMarketplaces.app-factory.source.path`. The dispatch prompt correctly leaves it uncommitted, but the dispatcher cannot pre-bake a committed settings.json fix because bootstrap is permanently host/worktree-scoped. | When splitting bootstrap from executor (Defect #1), document bootstrap is per-host and must be re-run on every worktree path change. Check whether `marketplace add` accepts a relative path or repo-rooted placeholder; if not, leave `.claude/settings.json` out of version control permanently and document explicit regeneration. |

## Verdict

**NO-GO (Blocker C: installed-plugin skills invisible to dispatched executor session).**

Step 0's three pre-flight checks all passed — confirming that the Blocker A fix (ce39f8e) and Blocker B fix (1c82733 + a585bbc + dd7134b) are both sound. However, Step 1 could not proceed: invoking `app-factory`, `pm-agent:app-factory`, and `pm-orchestrate` via the Skill tool all returned `Unknown skill`. The harness freezes its skill catalogue at session start; plugins installed mid-session by the executor's own Step 0 are visible on disk and in `.claude/settings.json` but not to the Skill tool of the session that installed them.

No stages ran. `apps/haru-gratitude-diary/` does not exist. No screenshots captured because no QA stage was reached. Spec §9.1 M4 hard criterion "Ralph ran ≥1 iteration" is by definition unmet.

**Plan 3 must land a fourth fix-up** that restructures the dispatch protocol to bootstrap plugins *before* the executor session starts (Defect #1), and adds a Step 0.D skill-liveness probe (Defect #2). Once those land, M4 can be re-dispatched from a **fresh** executor session whose session-start catalogue will already include the 6 pipeline skills.

PR #1 (Plan 1 + Plan 2) remains **NOT cleared** for merge.
