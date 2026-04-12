#!/usr/bin/env bash
# M4 Dispatcher — launches a fresh Claude Code subprocess with the factory
# plugins loaded via --plugin-dir (bypassing the Blocker C skill-catalogue
# staleness trap). Run from the repo root (worktree root) of plz-survive-jay.
#
# Usage:
#   ./docs/superpowers/m4/dispatch.sh                 # live, foreground
#   ./docs/superpowers/m4/dispatch.sh --background    # background, logs to file
#
# Requires: claude CLI 2.1.98+, gstack skill installed at ~/.claude/skills/gstack/
#
# The executor reads docs/superpowers/m4/dispatch-prompt.md verbatim and writes
# docs/superpowers/m4/report.md at completion.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "plan3/m4-teams-test" ]]; then
  echo "ERROR: must be on branch plan3/m4-teams-test (currently: $BRANCH)" >&2
  exit 1
fi

for d in plugins/pm-agent plugins/dev-team plugins/design-team plugins/agent-maker plugins/ait-team; do
  if [[ ! -d "$d/skills" ]]; then
    echo "ERROR: missing plugin source tree: $d/skills" >&2
    exit 1
  fi
done

if [[ ! -f docs/superpowers/m4/dispatch-prompt.md ]]; then
  echo "ERROR: missing docs/superpowers/m4/dispatch-prompt.md" >&2
  exit 1
fi

PROMPT="You are the M4 Executor for the app-factory orchestration redesign in this repository. Your working directory is the current directory. The factory plugins have been loaded at startup via --plugin-dir flags; verify this in Step 0.B before proceeding.

Your task manual follows between the BEGIN/END markers. Follow it verbatim from the \"## Execution\" section onward. Begin IMMEDIATELY with Step 0 — do not ask for confirmation, do not ask clarifying questions, do not treat this as context-only. This message IS your assignment. Your final output (after all stages complete or you halt at a failed gate) must be the Go/No-Go report written to docs/superpowers/m4/report.md plus a short summary of verdict + stage outcomes in your final text response.

===BEGIN M4 DISPATCH PROMPT===
$(cat docs/superpowers/m4/dispatch-prompt.md)
===END M4 DISPATCH PROMPT===

Begin Step 0 now."

# Autoconfirm envvar — read by app-factory Step 0.1 and pm-orchestrate Phase 1.4
# to bypass USER DECISION POINT halts for autonomous M4 runs. See
# plugins/pm-agent/skills/app-factory/SKILL.md §Step 0.1 and
# plugins/pm-agent/skills/pm-orchestrate/SKILL.md §Phase 1.4 for the contract.
export CLAUDE_APP_FACTORY_AUTOCONFIRM=1

# --allowedTools: --permission-mode auto covers local actions (Bash/Read/Edit/etc.)
# but does NOT auto-allow MCP tools. Stage 2a (stitch-generate) needs the Stitch
# MCP server, and the 5th-run NO-GO confirmed that `mcp__stitch__create_project`
# is rejected without an explicit allowlist. Use wildcard for stitch (verified
# working). gstack is a shell-based skill that does NOT need MCP allowlist.
# --dangerously-skip-permissions: --permission-mode auto sandboxes Bash network
# access, blocking npm install (registry.npmjs.org 403) and Stitch PNG downloads
# (lh3.googleusercontent.com blocked). This flag lifts all permission restrictions
# including the Bash network sandbox. Safe in this context because:
# (1) executor runs in an isolated git worktree with no push access
# (2) dispatch-prompt constrains actions (no merge, no push, no CLAUDE.md edits)
# (3) executor is a non-interactive -p session that exits after completion
CMD=(claude -p "$PROMPT"
  --dangerously-skip-permissions
  --allowedTools "mcp__stitch__*"
  --plugin-dir ./plugins/pm-agent
  --plugin-dir ./plugins/dev-team
  --plugin-dir ./plugins/design-team
  --plugin-dir ./plugins/agent-maker
  --plugin-dir ./plugins/ait-team)

if [[ "${1:-}" == "--background" ]]; then
  LOG="docs/superpowers/m4/dispatch-$(date +%Y%m%d-%H%M%S).log"
  echo "Launching M4 executor in background → $LOG"
  nohup "${CMD[@]}" > "$LOG" 2>&1 &
  echo "PID: $!"
  echo "Tail with: tail -f $LOG"
else
  echo "Launching M4 executor in foreground. Ctrl+C to abort."
  "${CMD[@]}"
fi
