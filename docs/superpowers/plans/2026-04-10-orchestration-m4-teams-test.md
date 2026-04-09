# Orchestration Redesign — Plan 3: M4 Agent Teams Test App (Go/No-Go Gate)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the 12 skills + 8 slash commands shipped in Plan 2 actually work end-to-end by building the test app "하루 감사 일기" via Agent Teams (primary) or a separate worktree/session (fallback), and record per-stage pass/fail to produce a Go/No-Go decision for PR #1 merge and M5 progression.

**Architecture:** This is a **verification** plan, not an implementation plan. It dispatches the existing `/app-factory` skill to build a real test app inside an isolated context, captures per-stage outputs and gate results into a structured report, then either declares Go (PR #1 ready for merge, M5 unblocked) or No-Go (catalogs defects as small follow-up commits that patch Plan 2 skills). No new skills, no new commands — the only code changes permitted in this plan are bug-fix patches to skill bodies or worker subagents that M4 execution surfaces.

**Tech Stack:** Claude Code 2.1.97+, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, tmux 3.5a, `git worktree`, gstack browse, existing Plan 2 skills.

**Spec reference:** `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md`. Authoritative sections for Plan 3:
- §9.1 M4 (lines 612–617) — test dispatch mechanism, Go/No-Go criteria
- §9.2 Rollback strategy (M4 failure → fix-forward in M3)
- §9.4 Test app "하루 감사 일기" rationale (lines 656–666)
- §11.1 Risks (Agent Teams unavailability, gstack conflicts)
- §11.2.1 Environment findings (prereqs confirmed on 2026-04-10)

**Prereqs (already met, do NOT re-verify in Plan 3 tasks — Plan 1 M1 confirmed these):**
- Claude Code 2.1.97 ≥ 2.1.32 ✅
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json` ✅
- tmux 3.5a ✅
- 12 skills exist under `plugins/*/skills/*/SKILL.md` (Plan 2 T14 final verification passed)
- 8 slash commands parse (Plan 2 commit `b7743c3`)
- 9 legacy orchestrators still present as rollback (coexistence per M3)

**Branch:** Continue on `plan3/m4-teams-test` (created from `main` after Plan 1 + Plan 2 merged).

```bash
git checkout main
git pull
git checkout -b plan3/m4-teams-test
```

**Critical execution note:** The actual `/app-factory` dispatch in Task 4 is **very token-heavy** (full 5-stage pipeline). It MUST run in an isolated Agent Teams teammate or a separate Claude Code session — never in the same session that writes this plan or the fix-up commits. The plan writer session and the verification executor session are distinct by design.

---

## File Structure

### New files (4 total, all in `docs/superpowers/m4/`)

```
docs/superpowers/m4/dispatch-prompt.md          # Canonical prompt for the teammate/session running /app-factory
docs/superpowers/m4/test-app-spec.md            # 하루 감사 일기 one-pager (idea, personas, screens) to feed the pipeline
docs/superpowers/m4/report-template.md          # Empty Go/No-Go report skeleton with per-stage sections
docs/superpowers/m4/report.md                   # Filled-in report after execution (produced in Task 5)
```

### Files potentially modified (Task 7 only, conditional)

```
plugins/*/skills/*/SKILL.md      # Fix-forward patches if any stage fails
plugins/*/agents/*.md            # Worker subagent fixes if gate failures trace to workers
```

No other files are touched in Plan 3. `CLAUDE.md`, `PRODUCT_LOOP.md`, legacy orchestrators remain untouched (those belong to Plan 4 / M7).

### Test app output location (produced by the dispatched session, outside this plan's tree)

```
apps/haru-gratitude-diary/      # Created by /app-factory during M4 execution
```

This directory's contents are *evidence* for the report, not code this plan writes. The verification executor may or may not commit this app to `plan3/m4-teams-test` — see Task 6 decision point.

---

## Shared report schema (used by Tasks 5 and 7)

Every per-stage section of `report.md` MUST contain these fields. Plan writers and executors — if the schema is incomplete, reject the report:

```markdown
### Stage N — <skill name>

- **Status:** PASS | FAIL | PARTIAL
- **Gate:** <gate condition from spec §6 / skill body, quoted verbatim>
- **Gate result:** <observed value vs required value>
- **Artifacts produced:** <list of files with paths, relative to apps/haru-gratitude-diary/>
- **Duration:** <wall clock, approximate>
- **Worker subagents invoked:** <list with count>
- **Errors / warnings:** <stderr, tool failures, gate violations — or "none">
- **Screenshots (Stage 2b, Stage 3, Stage 4 only):** <file paths under docs/superpowers/m4/screenshots/>
- **Notes:** <anything non-obvious the executor observed>
```

Stages 2b (design-sync), 3 (dev-orchestrate), and 4 (ralph-persona-loop) MUST include gstack browse screenshots per the absolute rule in `CLAUDE.md` ("스크린샷 없는 QA/평가는 무효").

---

## Task 1: Write the test app one-pager

**Files:**
- Create: `docs/superpowers/m4/test-app-spec.md`

- [ ] **Step 1: Create the m4 directory**

Run:
```bash
mkdir -p docs/superpowers/m4
```

- [ ] **Step 2: Write `test-app-spec.md`**

```markdown
# Test App — 하루 감사 일기 (Daily Gratitude Journal)

> Spec source: `docs/superpowers/specs/2026-04-09-app-factory-orchestration-redesign.md` §9.4

## One-sentence idea

매일 감사한 일 3가지를 기록하고 주간 회고로 돌아보는 최소주의 감사 일기 앱.

## Why this app (spec §9.4 rationale)

- **3 distinct personas** available for Ralph Phase 2 parallel evaluation:
  - 바쁜 직장인 (30대 IT 엔지니어, 퇴근 후 5분 내에 작성 원함)
  - 대학생 (20대, 번아웃 회복 중, 루틴 형성이 목표)
  - 40대 워킹맘 (아이 재운 후 감정 정리 용도)
- **5–6 screens** fits Stage 2 Stitch generation budget:
  1. Home / 오늘의 일기
  2. Entry / 3가지 감사 입력
  3. Calendar / 월별 뷰
  4. Detail / 특정 날짜 상세
  5. Weekly reflection / 주간 회고
  6. Settings
- **localStorage demo mode** is natural (no auth, no backend)
- NOT education / finance / medical → `domain-expert-consultant` conditional NOT triggered → tests the baseline pipeline
- Post-test usable as real app (not throwaway)

## Inputs the pipeline will receive

- App name (kebab-case): `haru-gratitude-diary`
- Korean display name: `하루 감사 일기`
- Idea sentence (the natural-language prompt used at Stage 1): `하루 감사 일기 앱 만들어줘`

## Expected artifacts per stage

| Stage | Skill | Expected outputs (paths relative to apps/haru-gratitude-diary/) |
|---|---|---|
| 1 | pm-orchestrate | docs/pm-outputs/prd.md, user-stories.md, screen-flows.md, persona.md |
| 2a | stitch-generate | docs/design/ground-truth/*.png (≥5 screens), stitch-manifest.json |
| 2b | design-sync | src/ (React scaffold), docs/design/sync-criteria.md, Design Score ≥ B+ |
| 3 | dev-orchestrate | Working `npm run build`, demo mode loads in gstack browse |
| 4 | ralph-persona-loop | docs/ralph/iteration-*.md, ralph-final-report.md, 6-evaluator scores all ≥ pass threshold |
| 5 | release-prep | RELEASE.md, final git commit |

## Absolute constraints

- Demo mode mandatory (per user feedback memory: `feedback_demo_mode.md`)
- Ralph loop must run **at least 1 iteration** — this is the Go criterion from spec §9.1 M4
- All QA evidence must include gstack screenshots (CLAUDE.md absolute rule)
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/m4/test-app-spec.md
git commit -m "plan3(m4): add haru-gratitude-diary test app one-pager"
```

---

## Task 2: Write the canonical dispatch prompt

**Files:**
- Create: `docs/superpowers/m4/dispatch-prompt.md`

- [ ] **Step 1: Write the dispatch prompt**

```markdown
# M4 Dispatch Prompt — feed this verbatim to the teammate / session

> This is the exact prompt used when dispatching the Agent Teams teammate (primary path) or when opening a new Claude Code session in the fallback worktree. Do not paraphrase.

---

You are executing M4 of the app-factory orchestration redesign. Your job: build the test app `하루 감사 일기` end-to-end using the new skill chain, then produce a per-stage Go/No-Go report.

## Inputs

- Test app spec: read `docs/superpowers/m4/test-app-spec.md` first.
- Target output directory: `apps/haru-gratitude-diary/`
- Idea sentence to start the pipeline: `하루 감사 일기 앱 만들어줘`

## Execution

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
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/m4/dispatch-prompt.md
git commit -m "plan3(m4): add canonical dispatch prompt for teammate/session"
```

---

## Task 3: Write the empty report template

**Files:**
- Create: `docs/superpowers/m4/report-template.md`

- [ ] **Step 1: Write the template**

```markdown
# M4 Go/No-Go Report — haru-gratitude-diary

**Execution date:** <YYYY-MM-DD>
**Executor:** <Agent Teams teammate | fallback worktree session>
**Claude Code version:** <output of `claude --version`>
**Starting commit:** <short SHA of plan3/m4-teams-test at dispatch time>

## Environment snapshot

- CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: <1 | 0>
- tmux version: <output of `tmux -V`>
- gstack browse available: <yes | no>
- Legacy orchestrators still present: <count, should be 9>

---

### Stage 1 — pm-orchestrate

- **Status:** PASS | FAIL | PARTIAL | NOT REACHED
- **Gate:** "4 required files present with non-empty content: prd.md, user-stories.md, screen-flows.md, persona.md"
- **Gate result:**
- **Artifacts produced:**
- **Duration:**
- **Worker subagents invoked:**
- **Errors / warnings:**
- **Screenshots:** n/a
- **Notes:**

### Stage 2a — stitch-generate

- **Status:**
- **Gate:** "Stitch project created, ≥5 screens generated, ground-truth PNGs saved"
- **Gate result:**
- **Artifacts produced:**
- **Duration:**
- **Worker subagents invoked:**
- **Errors / warnings:**
- **Screenshots:** n/a (Stage 2a uses Stitch renders, not gstack)
- **Notes:**

### Stage 2b — design-sync

- **Status:**
- **Gate:** "Design Score ≥ B+ per spec §8.7 inner gate, ≥ B per §6.3 outer gate"
- **Gate result:**
- **Artifacts produced:**
- **Duration:**
- **Worker subagents invoked:**
- **Errors / warnings:**
- **Screenshots:** docs/superpowers/m4/screenshots/stage-2b-*.png
- **Notes:**

### Stage 3 — dev-orchestrate

- **Status:**
- **Gate:** "`npm run build` exits 0; demo mode loads at app root in gstack browse"
- **Gate result:**
- **Artifacts produced:**
- **Duration:**
- **Worker subagents invoked:**
- **Errors / warnings:**
- **Screenshots:** docs/superpowers/m4/screenshots/stage-3-*.png
- **Notes:**

### Stage 4 — ralph-persona-loop

- **Status:**
- **Gate:** "All 6 evaluators score ≥ pass threshold; ≥1 full iteration completed (spec §9.1 M4 mandatory)"
- **Gate result:**
- **Artifacts produced:**
- **Duration:**
- **Worker subagents invoked:**
- **Errors / warnings:**
- **Screenshots:** docs/superpowers/m4/screenshots/stage-4-*.png
- **Notes:**

### Stage 5 — release-prep

- **Status:**
- **Gate:** "Build succeeds, final commit created with RELEASE.md"
- **Gate result:**
- **Artifacts produced:**
- **Duration:**
- **Worker subagents invoked:**
- **Errors / warnings:**
- **Screenshots:** n/a
- **Notes:**

---

## Spec-violation observations

- Text-signal leakage (`*_STAGE_COMPLETE` strings emitted at runtime): <yes/no, cite file+line if yes>
- Nested worker dispatch observed (worker calling Agent on another worker): <yes/no, cite worker if yes>
- Missing gstack screenshots on any QA evaluation: <yes/no, cite which stage if yes>
- `tools:` restriction bypass on any worker: <yes/no, cite worker if yes>

## Defects

| # | Stage | File | Issue | Proposed fix |
|---|---|---|---|---|
|   |       |      |       |              |

## Verdict

**GO** or **NO-GO** — <one sentence rationale>

If GO: PR #1 (Plan 1 + Plan 2) is cleared for merge and M5 deprecation markers may begin.
If NO-GO: list which defects block merge. Plan 3 will add fix-up commits to this branch before re-running M4.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/m4/report-template.md
git commit -m "plan3(m4): add Go/No-Go report template"
```

---

## Task 4: Dispatch the pipeline execution (manual operator step)

**Files:**
- No files created in this task. This task **dispatches** an external execution and waits for it to complete.

**Context:** This task is special — the main session running Plan 3 does NOT run `/app-factory` itself. It either spawns an Agent Teams teammate or instructs the operator to open a new Claude Code session in a separate worktree. Both paths use the canonical prompt from Task 2.

- [ ] **Step 1: Decide primary vs fallback path**

Check whether Agent Teams is usable right now:

```bash
echo "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=$CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS"
claude --version
tmux -V
```

Expected:
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- `claude` version ≥ `2.1.32`
- tmux ≥ `3.0`

If all three OK → **primary path**: use Agent Teams teammate.
If any fails → **fallback path**: use separate worktree + new Claude Code session.

- [ ] **Step 2a (primary path): Spawn Agent Teams teammate**

In the main session, use the TeamCreate tool (load its schema first via ToolSearch if not already loaded) to spawn a teammate with:

- **name:** `m4-verifier`
- **working directory:** repo root (`/Users/wschoe/project/plz-survive-jay`)
- **initial prompt:** the full contents of `docs/superpowers/m4/dispatch-prompt.md`, read with the Read tool and passed verbatim
- **isolation:** default (isolated context, separate tmux pane)

Wait for the teammate to emit its final report into `docs/superpowers/m4/report.md`. Do NOT poll — use SendMessage-style notification or wait for the teammate completion event. While waiting, you may proceed to Task 5's "verify report exists" check but not beyond.

- [ ] **Step 2b (fallback path): Instruct operator to open a separate session**

Print this block to the user and wait for them to confirm the session has finished:

```
M4 fallback path activated. Please run the following in a separate terminal:

  cd /Users/wschoe/project
  git worktree add plz-survive-jay-m4 plan3/m4-teams-test
  cd plz-survive-jay-m4
  claude

Then, in the new Claude Code session, paste the contents of:
  docs/superpowers/m4/dispatch-prompt.md

Let that session run to completion. It will write docs/superpowers/m4/report.md.
When the session finishes, type "m4 done" here so I continue Plan 3 Task 5.
```

Wait for the user to say "m4 done" (or equivalent) before proceeding to Task 5.

- [ ] **Step 3: Verify the report file exists**

```bash
test -f docs/superpowers/m4/report.md && echo "REPORT PRESENT" || echo "REPORT MISSING"
```

Expected: `REPORT PRESENT`. If missing, halt Plan 3 and ask the operator what happened.

- [ ] **Step 4: Commit whatever the dispatch produced into this branch**

The dispatch may have created files under `apps/haru-gratitude-diary/` and `docs/superpowers/m4/`. Commit the report and screenshots now; defer the `apps/` directory decision to Task 6.

```bash
git add docs/superpowers/m4/report.md docs/superpowers/m4/screenshots/ 2>/dev/null || true
git status
git commit -m "plan3(m4): capture M4 verification report and screenshots" || echo "nothing to commit"
```

---

## Task 5: Validate the report against the schema

**Files:**
- Read: `docs/superpowers/m4/report.md`
- Read: `docs/superpowers/m4/report-template.md`

- [ ] **Step 1: Schema completeness check**

Read `report.md`. For each of the 6 stage sections, confirm every field listed in the shared report schema (top of this plan) is filled. If any field is literally blank or says "TBD", the report is invalid.

Run (a human-guided check — not a shell command):
- Does every stage have a `Status:` that is one of PASS / FAIL / PARTIAL / NOT REACHED?
- Does every stage that ran have a `Gate result:` with an observed value?
- Does every PASS/FAIL/PARTIAL row have at least one artifact path?
- Do Stage 2b, 3, 4 have screenshot paths (unless status is NOT REACHED)?

Expected: all answers YES. If any NO → the dispatch result is incomplete → return to Task 4 Step 2a/b to ask the teammate/operator to complete the report.

- [ ] **Step 2: Screenshot presence check**

```bash
ls docs/superpowers/m4/screenshots/ 2>/dev/null | wc -l
```

Expected: ≥ 3 (one per screenshot-mandatory stage). If 0 and any of stages 2b/3/4 claim PASS, the report violates the absolute rule in `CLAUDE.md` → mark Stage(s) as **spec violation** in a follow-up note and downgrade to NO-GO regardless of the report's stated verdict.

- [ ] **Step 3: Spec-violation block check**

Read the "Spec-violation observations" section of `report.md`. Any "yes" in that block downgrades to NO-GO regardless of per-stage statuses. Note each one for Task 7.

- [ ] **Step 4: Commit if validation notes were added**

```bash
git add docs/superpowers/m4/report.md
git diff --cached --quiet || git commit -m "plan3(m4): validate report, note schema/screenshot/violation issues"
```

---

## Task 6: Decide disposition of `apps/haru-gratitude-diary/`

**Files:**
- Potentially modify: `.gitignore`
- Potentially add: `apps/haru-gratitude-diary/` (entire tree)

- [ ] **Step 1: Check what was produced**

```bash
test -d apps/haru-gratitude-diary && du -sh apps/haru-gratitude-diary || echo "NO APP DIR"
```

- [ ] **Step 2: Decision tree**

- If verdict is **GO** and the app built successfully → commit `apps/haru-gratitude-diary/` to this branch so Plan 4 can reuse it as smoke-test baseline. Skip to Step 3.
- If verdict is **NO-GO** but app directory is partially built → do NOT commit it; leave it on disk for the fix-forward cycle in Task 7. Add a `.gitignore` entry if necessary to stop accidental commits:
  ```bash
  grep -q '^apps/haru-gratitude-diary/$' .gitignore || echo 'apps/haru-gratitude-diary/' >> .gitignore
  git add .gitignore
  git diff --cached --quiet || git commit -m "plan3(m4): gitignore in-progress haru-gratitude-diary during fix-forward"
  ```
- If no app directory exists (pipeline failed in Stage 1) → nothing to do, go to Task 7.

- [ ] **Step 3 (GO path only): Commit the produced app**

```bash
git add apps/haru-gratitude-diary/
git commit -m "plan3(m4): add haru-gratitude-diary test app produced by M4 verification"
```

---

## Task 7: Fix-forward loop OR Go verdict finalization

**Files (conditional):** any skill body or worker subagent file surfaced by the report's Defects table.

This task is a conditional loop. It runs only if Task 5 / 6 produced a NO-GO, and it repeats per defect. If Task 5 produced a GO, skip to Step 4 directly.

- [ ] **Step 1 (NO-GO only): For each row in the Defects table, write a fix-up commit**

Read `docs/superpowers/m4/report.md` Defects table. For each row:

1. Open the file listed in the "File" column.
2. Read the surrounding context. Confirm the issue matches the report.
3. Make the minimal fix described in "Proposed fix".
4. Commit with message `plan3(m4-fixup): <one-line issue description>`.

Example skeleton:
```bash
# For a defect like "stage-2b skill emits DESIGN_STAGE_COMPLETE text signal"
# File: plugins/design-team/skills/design-sync/SKILL.md:L123
# Proposed fix: delete the emit line, rely on filesystem handoff

# ... edit the file ...

git add plugins/design-team/skills/design-sync/SKILL.md
git commit -m "plan3(m4-fixup): remove DESIGN_STAGE_COMPLETE text signal from design-sync skill"
```

Do NOT batch defects into one commit. One defect = one commit for revert safety.

- [ ] **Step 2 (NO-GO only): Re-run M4 after each batch of fix-ups**

After every ≤3 fix-up commits, return to Task 4 Step 2 and re-dispatch the pipeline. Overwrite `report.md` with the new run's output. Loop Task 5 → Task 6 → Task 7 until verdict is GO.

Hard stop: if the fix-forward loop runs **3 full re-dispatches** without reaching GO, STOP the plan and escalate to the operator. Three failed attempts means a deeper spec issue that Plan 3 cannot fix — it requires re-opening Plan 2 or the spec.

- [ ] **Step 3 (NO-GO exit): Final fix-up commit if any leftover cleanup**

```bash
git status
# If anything uncommitted that belongs in the fix-up sequence, commit it now with a plan3(m4-fixup) prefix.
```

- [ ] **Step 4 (GO verdict finalization): Write the GO marker file**

```bash
cat > docs/superpowers/m4/GO.md <<'EOF'
# M4 GO verdict

Date: <YYYY-MM-DD>
Commit: <git rev-parse HEAD>
Report: docs/superpowers/m4/report.md

All 5 pipeline stages passed their gates. Ralph persona loop ran ≥1 iteration.
App built successfully. No spec violations observed.

PR #1 (Plan 1 + Plan 2) is cleared for merge.
M5 deprecation markers on 9 legacy orchestrators may proceed in Plan 4.
EOF

git add docs/superpowers/m4/GO.md
git commit -m "plan3(m4): record GO verdict, PR #1 cleared for merge"
```

- [ ] **Step 5: Final branch status check**

```bash
git log --oneline main..plan3/m4-teams-test
git status
```

Expected:
- Commit log shows: test-app-spec, dispatch-prompt, report-template, report, (optional gitignore or app commit), (optional fix-ups), GO marker.
- `git status` is clean.

---

## Task 8: Hand-off note for the next session

**Files:**
- Modify: `docs/superpowers/RESUME-2026-04-10.md`

- [ ] **Step 1: Append a Plan 3 outcome section**

Read the current resume note, then append (do NOT rewrite the existing content):

```markdown

---

## Plan 3 outcome (appended <YYYY-MM-DD>)

- **Verdict:** <GO | NO-GO after N attempts>
- **Branch:** `plan3/m4-teams-test` (N commits on top of main)
- **Report:** `docs/superpowers/m4/report.md`
- **Test app:** `apps/haru-gratitude-diary/` (committed | gitignored | absent)
- **Defects fixed in Plan 3:** <count, or "none">
- **Blocking issues for Plan 4:** <none | list>

**Next session should:** start Plan 4 (M5 + M6 + M7) per spec §9.1.
```

- [ ] **Step 2: Commit the resume note update**

```bash
git add docs/superpowers/RESUME-2026-04-10.md
git commit -m "plan3(m4): update resume note with M4 verdict and Plan 4 handoff"
```

- [ ] **Step 3: Print final summary to operator**

Output exactly:
```
Plan 3 complete.
Branch: plan3/m4-teams-test
Verdict: <GO | NO-GO>
Next: review branch, merge to main if GO, then write Plan 4 in a fresh session.
```

---

## Execution constraints and reminders

1. **Do not execute `/app-factory` inside the Plan 3 main session.** Token cost is prohibitive and it contaminates the plan-execution context. Always use Agent Teams or a separate worktree session.
2. **Screenshots are non-negotiable** for Stages 2b, 3, 4. The CLAUDE.md absolute rule applies to M4 verification too.
3. **One defect = one commit.** Revert safety matters more than commit count.
4. **Three failed re-dispatches = escalate.** Do not loop forever.
5. **Legacy orchestrators stay untouched.** They are live rollback fallbacks until Plan 4 M6.
6. **`apps/haru-gratitude-diary/`** belongs to Plan 3 only if GO; otherwise it's transient scratch.
7. **Text-signal check** is mandatory every round: `grep -r "STAGE_COMPLETE" plugins/*/skills/*/SKILL.md` (from Plan 2 lessons learned).

---

## Self-review against spec §9.1 M4

- ✅ Dispatches `/app-factory` in an isolated context (Agent Teams primary, worktree fallback)
- ✅ Test app is "하루 감사 일기" per §9.4
- ✅ Go criteria encoded: all 5 stages pass gates + app builds + Ralph ≥1 iteration (Tasks 5, 6, 7)
- ✅ No-go handling: stop, fix-forward, re-run (Task 7)
- ✅ Fix-ups land on `plan2/m3-skills` successor (this branch was forked from merged main, so fixups that patch skills land on `plan3/m4-teams-test` and will carry forward into Plan 4)
- ✅ Plan 3 does NOT execute the dispatch in the plan-writing session (execution constraint #1)
- ✅ Every stage has a gate condition quoted or paraphrased from spec §6 / skill body
- ✅ Spec-violation observations block (text signals, nested dispatch, screenshot rule, tools bypass) explicitly encoded in the report template
