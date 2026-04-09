---
name: dev-review
description: Multi-layer code review — dispatches compound-engineering reviewer agents across security, performance, architecture, quality, language-specific, data, deployment, and PR workflow layers.
---

# Dev Review

## Purpose & Scope

Full code review orchestration skill. Replaces the legacy `dev-reviewer` subagent's hidden orchestration pattern by dispatching 12+ pre-existing compound-engineering reviewer agents across 8 review layers and consolidating their findings into a single prioritized report.

Scope covers: security audit, performance analysis, architecture compliance, code quality, language-specific idioms, data safety, deployment readiness, and PR workflow resolution.

## Prerequisites

- A git diff, branch, or PR to review must exist.
- Scope argument must be specified as one of: file path, PR number, or branch name. Referred to as `{scope}` below.
- `docs/reviews/` directory exists (create with `mkdir -p docs/reviews` if missing).
- Reviewer agents listed in the Worker Dispatch Plan are installed via the `compound-engineering`, `pr-review-toolkit`, and `superpowers` plugins.

## Execution Steps

Phases run sequentially across layers; workers within a phase run in parallel.

1. **Phase 1 — Security layer.** Dispatch `compound-engineering:review:security-sentinel` via Agent tool with scope `{scope}`. Collect markdown report.
2. **Phase 2 — Performance layer.** Dispatch `compound-engineering:review:performance-oracle`. Collect report.
3. **Phase 3 — Architecture layer.** Dispatch `compound-engineering:review:architecture-strategist` and `compound-engineering:review:pattern-recognition-specialist` in parallel. Collect both reports.
4. **Phase 4 — Code quality layer.** Dispatch `compound-engineering:review:code-simplicity-reviewer`, `pr-review-toolkit:code-simplifier`, and `pr-review-toolkit:comment-analyzer` in parallel.
5. **Phase 5 — Language-specific layer.** Detect tech stack from `{scope}` files. Dispatch the matching language reviewer (`kieran-typescript-reviewer`, `kieran-python-reviewer`, `kieran-rails-reviewer`, or `julik-frontend-races-reviewer`). Skip if no match.
6. **Phase 6 — Data safety layer.** If the diff contains DB migrations or schema files, dispatch `compound-engineering:review:data-integrity-guardian` and `compound-engineering:review:schema-drift-detector` in parallel. Otherwise mark layer as N/A.
7. **Phase 7 — Deployment readiness layer.** Dispatch `compound-engineering:review:deployment-verification-agent`.
8. **Phase 8 — PR workflow layer.** Dispatch `compound-engineering:workflow:pr-comment-resolver` and `superpowers:code-reviewer` in parallel. Consolidate all layer reports into `docs/reviews/{date}-{scope}.md` with prioritized severity table.

## Worker Dispatch Plan

Parallel within layer, sequential across layers.

| Layer | Agent | Focus | Spawn Prompt Key Points |
|-------|-------|-------|-------------------------|
| 1 Security | `compound-engineering:review:security-sentinel` | OWASP Top 10, auth bypass, injection, data exposure | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 2 Performance | `compound-engineering:review:performance-oracle` | N+1 queries, memory leaks, algorithm efficiency, scalability | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 3 Architecture | `compound-engineering:review:architecture-strategist` | Design patterns, SOLID, component boundaries | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 3 Architecture | `compound-engineering:review:pattern-recognition-specialist` | Anti-patterns, code duplication, naming consistency | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 4 Quality | `compound-engineering:review:code-simplicity-reviewer` | YAGNI, unnecessary complexity, premature abstraction | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 4 Quality | `pr-review-toolkit:code-simplifier` | Simplification opportunities | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 4 Quality | `pr-review-toolkit:comment-analyzer` | Comment accuracy and maintainability | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 5 Language (TS/JS) | `compound-engineering:review:kieran-typescript-reviewer` | TypeScript/JavaScript idioms | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 5 Language (Python) | `compound-engineering:review:kieran-python-reviewer` | Python idioms and pitfalls | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 5 Language (Ruby/Rails) | `compound-engineering:review:kieran-rails-reviewer` | Rails conventions and idioms | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 5 Language (Frontend) | `compound-engineering:review:julik-frontend-races-reviewer` | Frontend race conditions, async bugs | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 6 Data | `compound-engineering:review:data-integrity-guardian` | Migration safety, constraints, transactions | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 6 Data | `compound-engineering:review:schema-drift-detector` | Unintended schema changes | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 7 Deployment | `compound-engineering:review:deployment-verification-agent` | Pre/post deploy checklist, rollback plan | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 8 PR Workflow | `compound-engineering:workflow:pr-comment-resolver` | Auto-resolve PR review comments | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |
| 8 PR Workflow | `superpowers:code-reviewer` | Plan-vs-implementation verification | scope: {scope arg}; output: markdown review report; severity labels: critical/high/medium/low |

## Gate Verification

- Confirm every non-skipped layer returned a markdown report.
- Run Grep with pattern `^severity:\s*critical|\*\*critical\*\*|CRITICAL` across `docs/reviews/{date}-{scope}.md`. Zero unresolved `critical` findings required to pass the gate.
- If any critical findings remain, block completion and surface them in the summary with file:line references.

## Error Handling

- Agent timeout or failure: skip that layer, mark it as `partial` in the final summary, and continue. Never block the entire review on a single reviewer.
- Missing language match in Phase 5: mark layer `skipped (no language match)`.
- No DB changes in Phase 6: mark layer `N/A`.
- Missing `docs/reviews/` directory: create it and retry the write.

## Final State

- Consolidated review report written to `docs/reviews/{date}-{scope}.md` with sections per layer, a severity-prioritized findings table, and a GO / NO-GO verdict.
- One-paragraph summary printed to the main session, listing blocker count, warning count, skipped/partial layers, and the report path.
