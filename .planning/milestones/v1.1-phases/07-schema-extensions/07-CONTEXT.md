# Phase 7: Schema Extensions - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Add 6 new tables (milestone, milestone_audit, session_checkpoint, todo, debug_session, codebase_map) and extend the existing phase table with an is_inserted boolean flag. All v1.1 data structures must exist in SpacetimeDB with correct indexes, ready for CLI commands and GSD patches in phases 8-11. No CLI commands or workflow patches are built in this phase.

</domain>

<decisions>
## Implementation Decisions

### Data Granularity
- Complex/nested data stored as JSON strings — consistent with v1.0 pattern (velocity_data, success_criteria, content fields)
- Key filterable fields as dedicated columns with indexes (e.g., status, area, doc_type) — same pattern as plan table (status column + content blob)
- Codebase_map uses one row per document type (7 rows per project), not a single JSON blob — allows individual updates and type-specific queries
- Milestone accomplishments stored as JSON array string — read-once summary data, not queried individually

### Migration Strategy
- Clear database and re-seed on publish (`--clear-database` flag) — all existing data is reproducible from .planning/ files via stclaude:seed
- Full re-seed includes v1.1 phases (7-11) and their requirements — seed skill already reads from .planning/ files which contain v1.1 data
- New tables (milestone, todo, debug_session, etc.) start empty — populated by respective CLI commands in phases 8-11
- Phase table gets `is_inserted` as `t.bool()` column — clean, explicit boolean

### Reducer Patterns
- Upsert pattern for singleton tables: session_checkpoint (one per phase), codebase_map (one per project+type) — matches project_state/continue_here/config pattern
- Full CRUD (insert/update/delete) for multi-record tables: milestone, milestone_audit, todo, debug_session
- Todo completion is a status update (soft delete) — set status to 'done', list-todos filters by 'pending'. Preserves history
- Debug session closing is a status change to 'resolved' with resolution_notes — single table, no archive
- Single-record operations only — no bulk reducers except existing seed_project

### Cascade Behavior
- delete_project cascades to ALL child records: phases (which cascade to plans/tasks/etc.), milestones, todos, debug sessions, codebase maps, checkpoints — no orphaned data
- delete_phase cascades to session_checkpoint records for that phase — extends existing cascade pattern
- New tables use both project_id and phase_id where relevant: session_checkpoint gets phase_id (per-phase), todo/debug_session/milestone/codebase_map get project_id only

### Claude's Discretion
- Exact column types for new table fields (beyond the key decisions above)
- Index naming for new tables (follow existing `{table_name}_{column_name}` convention)
- Reducer parameter ordering and naming conventions
- Whether milestone_audit needs its own table or could be a JSON field on milestone

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches following v1.0 conventions.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `schema.ts` table definition pattern: `table(OPTIONS, COLUMNS)` with indexes in OPTIONS
- `index.ts` reducer pattern: insert/update/delete with SenderError validation and spread syntax for updates
- Upsert pattern: filter by project_id index, update if exists, insert if not (project_state, continue_here, config)
- `seed_project` reducer for bulk initialization with JSON parsing

### Established Patterns
- Index naming: `{table_name}_{column_name}` with accessor matching
- All string-typed flexible fields for complex data (JSON stored as strings)
- Foreign key validation: check parent exists before insert (`ctx.db.project.id.find(project_id)`)
- Timestamps: `created_at` and `updated_at` on every table, using `ctx.timestamp`
- Auto-increment IDs: `t.u64().primaryKey().autoInc()` with `id: 0n` placeholder

### Integration Points
- `schema.ts` schema export: new tables must be added to `schema({ ... })` call
- `index.ts` default re-export: `export default spacetimedb` must remain
- `delete_phase` reducer: needs extension to cascade to session_checkpoint
- `delete_project` reducer: needs major extension to cascade to all tables (currently only deletes project row)
- `seed_project` reducer: may need update if is_inserted field requires a default value during seeding

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-schema-extensions*
*Context gathered: 2026-03-04*
