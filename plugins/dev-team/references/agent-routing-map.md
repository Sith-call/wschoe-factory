# Dev Team — Agent & Skill Routing Map

This reference maps each development phase to existing agents and skills that should be leveraged.

## Phase 1: Architecture & Design

| Task | Agent/Skill | Source |
|------|-------------|--------|
| Feature architecture design | `feature-dev:code-architect` | feature-dev plugin |
| Codebase exploration | `feature-dev:code-explorer` | feature-dev plugin |
| Framework docs research | `compound-engineering:research:framework-docs-researcher` | compound-engineering |
| Best practices research | `compound-engineering:research:best-practices-researcher` | compound-engineering |
| Spec flow analysis | `compound-engineering:workflow:spec-flow-analyzer` | compound-engineering |

## Phase 2: Backend Development

| Task | Agent/Skill | Source |
|------|-------------|--------|
| Implementation | `general-purpose` agent | built-in |
| Data integrity check | `compound-engineering:review:data-integrity-guardian` | compound-engineering |
| Schema drift detection | `compound-engineering:review:schema-drift-detector` | compound-engineering |
| Data migration review | `compound-engineering:review:data-migration-expert` | compound-engineering |
| SQL query generation | `pm-data-analytics:write-query` | pm-data-analytics |

## Phase 3: Frontend Development

| Task | Agent/Skill | Source |
|------|-------------|--------|
| Implementation | `general-purpose` agent | built-in |
| Frontend design | `compound-engineering:design:frontend-design` skill | compound-engineering |
| Figma sync | `compound-engineering:design:figma-design-sync` | compound-engineering |
| Design review | `compound-engineering:design:design-implementation-reviewer` | compound-engineering |
| Design iteration | `compound-engineering:design:design-iterator` | compound-engineering |
| Race condition review | `compound-engineering:review:julik-frontend-races-reviewer` | compound-engineering |

## Phase 4: Testing & QA

| Task | Agent/Skill | Source |
|------|-------------|--------|
| Test coverage analysis | `pr-review-toolkit:pr-test-analyzer` | pr-review-toolkit |
| Silent failure hunting | `pr-review-toolkit:silent-failure-hunter` | pr-review-toolkit |
| Type design analysis | `pr-review-toolkit:type-design-analyzer` | pr-review-toolkit |
| Bug reproduction | `compound-engineering:workflow:bug-reproduction-validator` | compound-engineering |
| Test scenario generation | `pm-execution:test-scenarios` | pm-execution |
| Browser testing | `compound-engineering:test-browser` skill | compound-engineering |

## Phase 5: Code Review

| Task | Agent/Skill | Source |
|------|-------------|--------|
| General code review | `feature-dev:code-reviewer` | feature-dev |
| PR review (comprehensive) | `pr-review-toolkit:code-reviewer` | pr-review-toolkit |
| Security audit | `compound-engineering:review:security-sentinel` | compound-engineering |
| Performance analysis | `compound-engineering:review:performance-oracle` | compound-engineering |
| Code simplicity | `compound-engineering:review:code-simplicity-reviewer` | compound-engineering |
| Architecture review | `compound-engineering:review:architecture-strategist` | compound-engineering |
| Pattern recognition | `compound-engineering:review:pattern-recognition-specialist` | compound-engineering |
| Comment quality | `pr-review-toolkit:comment-analyzer` | pr-review-toolkit |
| Code simplification | `pr-review-toolkit:code-simplifier` | pr-review-toolkit |

## Phase 5.1: Language-Specific Review

| Language | Agent | Source |
|----------|-------|--------|
| TypeScript | `compound-engineering:review:kieran-typescript-reviewer` | compound-engineering |
| Python | `compound-engineering:review:kieran-python-reviewer` | compound-engineering |
| Rails/Ruby | `compound-engineering:review:kieran-rails-reviewer` | compound-engineering |
| Rails (DHH style) | `compound-engineering:review:dhh-rails-reviewer` | compound-engineering |

## Phase 6: Deployment & Release

| Task | Agent/Skill | Source |
|------|-------------|--------|
| Deployment checklist | `compound-engineering:review:deployment-verification-agent` | compound-engineering |
| Pre-mortem | `pm-execution:pre-mortem` | pm-execution |
| Release notes | `pm-execution:release-notes` | pm-execution |
| Commit & PR | `commit-commands:commit-push-pr` skill | commit-commands |
| PR review | `code-review:code-review` skill | code-review |
