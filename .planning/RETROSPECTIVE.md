# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Core Loop

**Shipped:** 2026-03-04
**Phases:** 6 | **Plans:** 15

### What Was Built
- 13-table SpacetimeDB schema with CRUD reducers, cascade deletes, and atomic seed_project
- 17-command CLI tool (`stgsd`) with auto project identity from git remote URL and JSON output
- Full workflow assembly (init progress/plan-phase/execute-phase) replacing file-based context loading
- 6 GSD agent files patched (~30 targeted text replacements) surviving `/gsd:update`
- Gap closure: CLI symlink, shared helpers extraction, ROADMAP checkbox fixes

### What Worked
- **Schema-first approach**: Defining all 13 tables before any CLI work gave a stable foundation. Zero schema changes needed during phases 2-6.
- **Phase ordering (schema → CLI → workflow → patches)**: Each phase built cleanly on the previous one. No circular dependencies or rework.
- **Hybrid schema design**: Structured metadata as typed columns + prose as text fields balanced queryability with content preservation.
- **Auto project identity from git remote**: Zero-config project detection eliminated a whole class of setup friction.
- **Speed**: 15 plans completed in ~44 minutes total execution time (2.93 min avg). 4,771 LOC in 3 days.

### What Was Inefficient
- **Audit revealed CLI seed gap late**: The `seed_project` reducer existed but no CLI command exposed it. Caught by audit, fixed in Phase 6 — but could have been caught in Phase 2 planning.
- **Some tech debt deferred without tracking**: Human verification items (connection test, error paths, PATH resolution) never got a formal tracking mechanism.
- **ROADMAP progress table went stale**: Phase completion wasn't updating the progress table consistently. Fixed in Phase 6 but was misleading during development.

### Patterns Established
- `table(OPTIONS, COLUMNS)` with indexes in OPTIONS (first arg), `{tableName}_{columnName}` index naming
- `withConnection` + `findProjectByGitRemote` + `findProjectState` as the standard CLI command pattern
- `waitForStateUpdate`/`waitForInsert` for mutation confirmation via SpacetimeDB subscriptions
- Agent patches as targeted text replacements in `.md` files, compatible with GSD's hash-based local patch system
- `outputSuccess`/`outputError` JSON envelope formatting with BigInt serialization

### Key Lessons
1. **Plan CLI commands at the same time as schema tables** — don't leave reducers without CLI consumers. The seed_project gap could have been avoided.
2. **Keep ROADMAP progress table updated automatically** — manual checkbox updates drift. Phase completion should auto-update the table.
3. **Agent patches are surprisingly stable** — targeted text replacement in markdown files is a viable integration strategy. 30 patches across 6 files survived without conflicts.
4. **SpacetimeDB subscription-based confirmation works well** — the `waitForInsert`/`waitForStateUpdate` pattern provides reliable mutation confirmation without polling.
5. **Commander.js `--version` flag conflicts with subcommand options** — program-level `.version()` intercepts `--version` before subcommands parse it. Use `=` syntax as workaround.

### Cost Observations
- Model mix: ~80% opus, ~20% sonnet (planner/executor agents)
- Sessions: ~6 sessions over 3 days
- Notable: 2.93 min/plan average — fast execution enabled by clear schema-first architecture

---

## Milestone: v1.1 — Full Coverage

**Shipped:** 2026-03-09
**Phases:** 6 | **Plans:** ~14

### What Was Built
- 6 new SpacetimeDB tables (milestone, milestone_audit, session_checkpoint, todo, debug_session, codebase_map)
- Milestone lifecycle CLI (write-milestone, get-milestones, write-audit) with GSD workflow patches
- Phase management CLI (add-phase, insert-phase, remove-phase) with decimal numbering support
- Session checkpoint CLI (write-session, get-session) for pause/resume context
- Todo tracking CLI (add-todo, list-todos, complete-todo) and debug session CLI (write/get/close-debug)
- Codebase mapping CLI (write/get-codebase-map) with GSD map-codebase workflow patches
- All 10 remaining GSD workflow files patched to use stclaude instead of gsd-tools.cjs

### What Worked
- **Feature-area grouping**: Schema+CLI+patch per phase enabled parallel development and clear ownership
- **Established architecture carried forward**: No architectural decisions needed in v1.1 — patterns from v1.0 applied directly
- **Speed**: 6 phases completed primarily in 1 day (2026-03-04), with patch cleanup through 2026-03-05

### What Was Inefficient
- **Requirements tracking fell behind**: 0/38 requirements formally checked during execution. CLI commands exist but REQUIREMENTS.md wasn't maintained
- **No SUMMARY.md files created for phases 7-11**: Phase summaries weren't written, reducing archival quality
- **Plan counts in SpacetimeDB show 0**: Phase execution wasn't tracked through SpacetimeDB for most phases
- **8 GSD workflow patches not created**: Session pause/resume, phase add/insert/remove, todo add/check, and debug workflows not patched

### Patterns Established
- `build:cli` vs `build` distinction in package.json for CLI bundling with shebang and createRequire
- Commander.js `-V` for program version to avoid `--version` subcommand conflicts
- Feature-area phase grouping works when architecture is already established

### Key Lessons
1. **Maintain requirements tracking during execution** — letting it slip to 0/38 means the milestone ships with unclear coverage
2. **Write SUMMARY.md files as phases complete** — skipping summaries degrades archival and retrospective quality
3. **Track plan execution in SpacetimeDB even for quick phases** — 0/0 plan counts make milestone stats unreliable
4. **The shebang `#!/usr/bin/env node` gets escaped by zsh** — use heredocs or Python to write shebangs, never shell echo/printf

### Cost Observations
- Model mix: ~70% opus, ~30% sonnet
- Sessions: ~4 sessions over 5 days
- Notable: Bulk of implementation done in single day; remainder was patch refinement

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 6 | 15 | Schema-first approach with layered phases |
| v1.1 | 6 | ~14 | Feature-area grouping (schema+CLI+patch per phase) |

### Top Lessons (Verified Across Milestones)

1. Schema-first design prevents rework in downstream phases
2. Agent patches via text replacement are a viable, low-friction integration strategy
3. Established architecture accelerates subsequent milestones — v1.1 needed zero architectural decisions
4. Requirements tracking must be maintained during execution, not deferred to completion
