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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 6 | 15 | Schema-first approach with layered phases |

### Top Lessons (Verified Across Milestones)

1. Schema-first design prevents rework in downstream phases
2. Agent patches via text replacement are a viable, low-friction integration strategy
