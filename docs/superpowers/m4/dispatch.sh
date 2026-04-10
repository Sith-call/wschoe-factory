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

CMD=(claude -p "$PROMPT"
  --permission-mode auto
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
