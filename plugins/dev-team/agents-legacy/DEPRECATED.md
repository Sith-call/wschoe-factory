# Deprecated Agents

These agents are from the **legacy orchestration pipeline** (pre-Plan 2).
They are preserved for rollback safety but are NOT loaded by the plugin
loader (the `agents/` directory is scanned, `agents-legacy/` is not).

## Why quarantined

1. Legacy orchestrator agents contain `*_STAGE_COMPLETE` text signal
   templates that violate spec §4 (filesystem-only handoff). When loaded
   into the session catalogue, their descriptions contaminate the new
   skill chain's output — see M4 report-history/2026-04-10-06-stitch-timeout.md.
2. The new skill chain (Plan 2 / M3) replaces these orchestrators with
   SKILL.md-based skills that use TodoWrite + file-system gates.

## Rollback

If the new chain fails catastrophically and a rollback to the legacy
pipeline is needed, move these files back to `../agents/` and remove
the corresponding SKILL.md files from `../skills/`.

## Timeline

These files will be deleted permanently after Plan 4 / M7 confirms the
new chain is stable in production for ≥2 weeks.
