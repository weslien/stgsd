# Phase 1: Schema & Module - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deploy all SpacetimeDB tables and reducers needed to store GSD's entire core loop state. The module is published to maincloud with tables for project, phase, plan, task, requirement, verification, research, phase context, config, continue-here, plan summary, and must-have. Reducers handle all CRUD operations plus a bulk seed reducer for project initialization.

</domain>

<decisions>
## Implementation Decisions

### Prose content format
- Store rich content (plans, research, verification, phase context) as raw markdown — same format agents produce today
- No frontmatter in prose fields — metadata (status, dates, phase number) becomes typed table columns
- One text field per document; independently-tracked elements (tasks, must-haves) get their own tables with individual status tracking

### Plan summary structure
- Plan summaries (SCHM-08) use typed columns for structured fields: subsystem, tags, headline, accomplishments, deviations, files, decisions, dependency graph metadata
- Enables queries like "find summaries by subsystem" for cross-plan analysis

### Reducer integrity
- Reducers enforce referential integrity — inserting a plan for a non-existent phase throws SenderError with clear message
- Fail fast, fail loud — invalid data causes SenderError with descriptive message, transaction rolls back
- Flexible status transitions — no enforced state machine, agents manage transitions correctly

### Bulk operations
- A seed_project reducer creates the full project skeleton (project + phases + requirements) in one atomic transaction
- Simplifies the `stclaude init` flow — either everything is created or nothing is

### Cascade behavior
- Deleting a phase cascades to all its plans, tasks, requirements, etc. in one transaction
- Clean but destructive — no undo

### State modeling
- Single project_state row per project with columns for current_phase, current_plan, current_task, last_activity, session fields
- One continue_here record per project (single resume point, matching current GSD behavior)
- Velocity data stored as JSON string column on project_state — easy to extend, agents parse client-side

### Timestamps
- Use SpacetimeDB native `t.timestamp()` type everywhere
- CLI converts to ISO strings for agent-readable output

### Table visibility
- All tables `public: true` — single-user CLI tool, no secrets, subscribeToAll() works

### Schema evolution
- Clear and republish (`--clear-database -y`) freely during v1 development
- No real data to protect until v1 ships — fast iteration over data preservation

### Claude's Discretion
- Reducer granularity per table (fine-grained per-field vs coarse CRUD)
- Schema file organization (schema.ts vs split files)
- Index strategy per table (which columns need explicit btree indexes)
- Exact column types for list-like fields (JSON strings vs repeated text columns)

</decisions>

<specifics>
## Specific Ideas

- Hybrid schema: structured metadata as typed columns, prose content as text fields — both queryable metadata and rich agent-readable content
- Plan summaries are the exception: fully structured columns because cross-plan queries matter
- The seed_project reducer should feel like "initialize a GSD project" — one call sets up everything the CLI needs

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- SpacetimeDB v2 starter template at `spacetimedb/src/index.ts` — has working schema/reducer pattern with `person` table
- Module bindings generated at `src/module_bindings/` — will regenerate after schema changes
- esbuild bundling pipeline in `package.json` scripts — `spacetime:publish` and `spacetime:generate` ready to go

### Established Patterns
- Schema and reducers currently combined in `index.ts` — CLAUDE.md recommends splitting to `schema.ts` (tables) + `index.ts` (reducers)
- Table definition: `table(OPTIONS, COLUMNS)` with indexes in OPTIONS first argument
- BigInt for all u64 fields (`0n` for auto-inc placeholder)
- Index naming: `{tableName}_{columnName}` convention for global uniqueness
- Reducer naming: `export const name = spacetimedb.reducer(params, fn)` — name from export
- Object syntax for reducer params: `{ param: 'value' }` not positional

### Integration Points
- Module publishes to maincloud as `spacetimeclaude-gvhsi` (configured in `spacetime.json`)
- Client connection at `src/main.ts` uses `DbConnection.builder()` — will need updating for new tables
- SpacetimeDB SDK `^2.0.2` already installed

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-schema-module*
*Context gathered: 2026-03-02*
