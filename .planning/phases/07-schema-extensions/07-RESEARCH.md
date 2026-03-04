# Phase 07: Schema Extensions - Research

**Researched:** 2026-03-04
**Domain:** SpacetimeDB TypeScript schema extension, table/reducer design
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Data Granularity**
- Complex/nested data stored as JSON strings — consistent with v1.0 pattern (velocity_data, success_criteria, content fields)
- Key filterable fields as dedicated columns with indexes (e.g., status, area, doc_type) — same pattern as plan table (status column + content blob)
- Codebase_map uses one row per document type (7 rows per project), not a single JSON blob — allows individual updates and type-specific queries
- Milestone accomplishments stored as JSON array string — read-once summary data, not queried individually

**Migration Strategy**
- Clear database and re-seed on publish (`--clear-database` flag) — all existing data is reproducible from .planning/ files via stclaude:seed
- Full re-seed includes v1.1 phases (7-11) and their requirements — seed skill already reads from .planning/ files which contain v1.1 data
- New tables (milestone, todo, debug_session, etc.) start empty — populated by respective CLI commands in phases 8-11
- Phase table gets `is_inserted` as `t.bool()` column — clean, explicit boolean

**Reducer Patterns**
- Upsert pattern for singleton tables: session_checkpoint (one per phase), codebase_map (one per project+type) — matches project_state/continue_here/config pattern
- Full CRUD (insert/update/delete) for multi-record tables: milestone, milestone_audit, todo, debug_session
- Todo completion is a status update (soft delete) — set status to 'done', list-todos filters by 'pending'. Preserves history
- Debug session closing is a status change to 'resolved' with resolution_notes — single table, no archive
- Single-record operations only — no bulk reducers except existing seed_project

**Cascade Behavior**
- delete_project cascades to ALL child records: phases (which cascade to plans/tasks/etc.), milestones, todos, debug sessions, codebase maps, checkpoints — no orphaned data
- delete_phase cascades to session_checkpoint records for that phase — extends existing cascade pattern
- New tables use both project_id and phase_id where relevant: session_checkpoint gets phase_id (per-phase), todo/debug_session/milestone/codebase_map get project_id only

### Claude's Discretion
- Exact column types for new table fields (beyond the key decisions above)
- Index naming for new tables (follow existing `{table_name}_{column_name}` convention)
- Reducer parameter ordering and naming conventions
- Whether milestone_audit needs its own table or could be a JSON field on milestone

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MILE-01 | Milestone table storing version, name, shipped date, phase/plan/requirement counts, accomplishments, and status | New `milestone` table with project_id FK, status index, version string — follows plan table pattern |
| MILE-02 | Milestone audit table storing audit status, requirement scores, integration scores, flow scores, and tech debt items | New `milestone_audit` table with project_id FK and milestone_id FK; all score fields as strings (JSON) or u64; status as indexed string column |
| MILE-03 | Milestone archive fields storing archived roadmap and requirements content per milestone version | Columns on `milestone_audit` table (or separate `milestone_archive` table): `roadmap_content` and `requirements_content` as t.string() blobs |
| SESS-01 | Session checkpoint table storing phase context, completed work, remaining work, decisions, blockers, next action, and mental context | New `session_checkpoint` table with project_id + phase_id FKs; upsert pattern (one per phase); all fields as t.string() |
| PHSE-01 | Phase table supports decimal numbering for inserted phases (e.g., 3.1) | Already implemented: `number` column is `t.string()` — no schema change needed, just verify seed handles decimal numbers correctly |
| PHSE-02 | Phase table supports is_inserted flag for urgent work distinction | Add `is_inserted: t.bool()` column to existing `phase` table; must update insert_phase, update_phase, seed_project reducers |
| TODO-01 | Todo table storing title, area, problem description, solution hints, file references with line numbers, and done status | New `todo` table with project_id FK; `status` as indexed string ('pending'/'done'); complex fields as t.string() JSON; `area` as indexed string column |
| DBG-01 | Debug session table storing bug description, hypotheses with status and evidence, checkpoints, and session timeline | New `debug_session` table with project_id FK; `status` as indexed string ('active'/'resolved'); complex fields (hypotheses, checkpoints, timeline) as t.string() JSON |
| CMAP-01 | Codebase map table storing document type (stack/integrations/architecture/structure/conventions/testing/concerns), content, and timestamps | New `codebase_map` table with project_id FK; `doc_type` as indexed string; upsert pattern (one per project+doc_type combination) |
</phase_requirements>

## Summary

Phase 7 is a pure schema-extension phase with no new CLI functionality. The work is entirely within `/Users/gustav/src/spacetimeclaude/spacetimedb/src/schema.ts` and `/Users/gustav/src/spacetimeclaude/spacetimedb/src/index.ts`. All patterns are directly established by the v1.0 codebase — there is nothing to research from external sources because this is an internal extension of existing code.

The six new tables (milestone, milestone_audit, session_checkpoint, todo, debug_session, codebase_map) all follow the same structural pattern: `t.u64().primaryKey().autoInc()` ID, one or more `t.u64()` FK columns with btree indexes, string columns for filterable fields, string columns for JSON blobs, and timestamp columns. The phase table extension requires adding `is_inserted: t.bool()` and updating the three reducers and seed_project that insert phase rows. PHSE-01 (decimal phase numbers) requires no schema change since `number` is already `t.string()`.

The most complex work is extending `delete_project` and `delete_phase` to cascade to the new tables. The existing cascade pattern is well-established in `delete_phase` — collect into arrays first, then delete — and must be replicated for all new child tables.

**Primary recommendation:** Copy existing table/reducer patterns verbatim. Every new table is a structural clone of an existing one. The only novel decision points are column names and JSON field groupings.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| spacetimedb | ^2.0.2 | TypeScript server SDK | Project constraint — already installed |
| spacetimedb/server | (bundled) | `schema`, `table`, `t`, `SenderError` | Only import needed for schema/reducer code |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| spacetime CLI | system | Build and publish module | `spacetime publish --clear-database -y` |

### Alternatives Considered
None — this is an extension of an established codebase. No new libraries are introduced.

**Installation:**
No new packages needed. All dependencies already present.

## Architecture Patterns

### Recommended Project Structure
```
spacetimedb/src/
├── schema.ts    — All table definitions + schema({}) export
└── index.ts     — All reducers + lifecycle hooks + export default spacetimedb
```

No new files. All additions go into the two existing source files.

### Pattern 1: Standard Table Definition
**What:** Every table uses `table(OPTIONS, COLUMNS)` with indexes in OPTIONS (first arg), never in COLUMNS.
**When to use:** All new tables.
**Example:**
```typescript
// Source: /Users/gustav/src/spacetimeclaude/spacetimedb/src/schema.ts (existing)
const todo = table({
  name: 'todo',
  public: true,
  indexes: [
    { name: 'todo_project_id', accessor: 'todo_project_id', algorithm: 'btree', columns: ['project_id'] },
    { name: 'todo_status', accessor: 'todo_status', algorithm: 'btree', columns: ['status'] },
    { name: 'todo_area', accessor: 'todo_area', algorithm: 'btree', columns: ['area'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  title: t.string(),
  area: t.string(),
  problem: t.string(),
  solution_hints: t.string(),
  file_refs: t.string(),   // JSON: [{path, line}]
  status: t.string(),      // 'pending' | 'done'
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});
```

### Pattern 2: Upsert Reducer for Singleton Tables
**What:** session_checkpoint (one per phase) and codebase_map (one per project+doc_type) use filter-then-update-or-insert.
**When to use:** Tables where only one record should exist per key combination.
**Example:**
```typescript
// Source: /Users/gustav/src/spacetimeclaude/spacetimedb/src/index.ts (existing upsert_config pattern)
export const upsert_session_checkpoint = spacetimedb.reducer(
  {
    project_id: t.u64(),
    phase_id: t.u64(),
    phase_context: t.string(),
    completed_work: t.string(),
    remaining_work: t.string(),
    decisions: t.string(),
    blockers: t.string(),
    next_action: t.string(),
    mental_context: t.string(),
  },
  (ctx, { project_id, phase_id, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);

    const existing = [...ctx.db.sessionCheckpoint.session_checkpoint_phase_id.filter(phase_id)][0];
    if (existing) {
      ctx.db.sessionCheckpoint.id.update({
        ...existing,
        ...fields,
        updated_at: ctx.timestamp,
      });
    } else {
      ctx.db.sessionCheckpoint.insert({
        id: 0n,
        project_id,
        phase_id,
        ...fields,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    }
  }
);
```

### Pattern 3: CRUD Reducers for Multi-Record Tables
**What:** insert/update/delete pattern for milestone, milestone_audit, todo, debug_session.
**When to use:** Tables that accumulate multiple records over time.
**Example:**
```typescript
// Source: /Users/gustav/src/spacetimeclaude/spacetimedb/src/index.ts (existing insert_plan pattern)
export const insert_milestone = spacetimedb.reducer(
  {
    project_id: t.u64(),
    version: t.string(),
    name: t.string(),
    shipped_date: t.string(),
    phase_count: t.u64(),
    plan_count: t.u64(),
    requirement_count: t.u64(),
    accomplishments: t.string(),  // JSON array string
    status: t.string(),
  },
  (ctx, { project_id, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.milestone.insert({
      id: 0n,
      project_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);
```

### Pattern 4: Cascade Delete Extension
**What:** delete_project must be extended to delete from all new tables. delete_phase must cascade to session_checkpoint.
**When to use:** When the parent entity (project/phase) is deleted.
**Example:**
```typescript
// Extending delete_project — follows existing delete_phase pattern
// CRITICAL: Always collect into arrays before deleting (never delete while iterating)
const milestones = [...ctx.db.milestone.milestone_project_id.filter(project_id)];
for (const m of milestones) {
  // delete milestone_audit records for this milestone
  const audits = [...ctx.db.milestoneAudit.milestone_audit_milestone_id.filter(m.id)];
  for (const a of audits) {
    ctx.db.milestoneAudit.id.delete(a.id);
  }
  ctx.db.milestone.id.delete(m.id);
}

const todos = [...ctx.db.todo.todo_project_id.filter(project_id)];
for (const todo of todos) {
  ctx.db.todo.id.delete(todo.id);
}
// ... repeat for debug_session, codebase_map, session_checkpoint
```

### Pattern 5: Phase Table Extension
**What:** Add `is_inserted: t.bool()` column to existing phase table definition. Update all reducers that insert/update phases.
**When to use:** When adding a new column to an existing table (requires `--clear-database` republish).
**Example:**
```typescript
// In schema.ts: add to phase table COLUMNS (second arg)
is_inserted: t.bool(),

// In index.ts: insert_phase reducer — add parameter and pass value
is_inserted: t.bool(),
// In the reducer body:
ctx.db.phase.insert({
  id: 0n,
  project_id,
  ...fields,  // now includes is_inserted
  created_at: ctx.timestamp,
  updated_at: ctx.timestamp,
});

// seed_project reducer — add is_inserted to phases JSON type and insert
// phases array now has: { number, name, slug, goal, status, depends_on, success_criteria, is_inserted }
```

### Pattern 6: codebase_map Upsert (Two-Column Uniqueness)
**What:** codebase_map is unique per (project_id, doc_type). The upsert must filter on BOTH project_id and doc_type.
**When to use:** Singleton table keyed on two columns.
**Example:**
```typescript
// No compound index needed — filter by project_id index, then find by doc_type in memory
// (Only 7 rows per project, so iteration is cheap)
const existing = [...ctx.db.codebases.codebase_map_project_id.filter(project_id)]
  .find(r => r.doc_type === doc_type);
if (existing) {
  ctx.db.codebases.id.update({ ...existing, content, updated_at: ctx.timestamp });
} else {
  ctx.db.codebases.insert({ id: 0n, project_id, doc_type, content, created_at: ctx.timestamp, updated_at: ctx.timestamp });
}
```

### Anti-Patterns to Avoid
- **Indexes in COLUMNS argument:** Putting `indexes: [...]` in the second arg of `table()` causes runtime error. Indexes MUST go in OPTIONS (first arg).
- **Deleting while iterating:** Always spread to array first: `[...ctx.db.table.index.filter(id)]`. Then iterate the array.
- **Multi-column indexes:** Multi-column index filter is broken in SpacetimeDB TypeScript SDK. Use single-column index + in-memory filter for compound uniqueness (e.g., codebase_map project_id + doc_type).
- **Forgetting accessor field:** The `accessor` field on index definitions must match the index name. Omitting it causes "Cannot read properties of undefined" when using the index in reducers.
- **Partial update spread omission:** Always spread `...existing` before overriding fields. Omitting it nulls out other columns.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON validation in reducers | Custom schema validation | Store as `t.string()`, validate in CLI layer | Reducers run server-side, keep them simple |
| Compound unique enforcement | Custom uniqueness check reducer | Filter by one index + in-memory check | Multi-column indexes broken; manual check is correct |
| Status enum validation | String union type checking | Convention: document valid values in comments | SpacetimeDB has no enum column type |

**Key insight:** SpacetimeDB reducers are the enforcement layer. Keep them minimal: validate parent exists, insert/update/delete. Business logic belongs in the CLI layer (stclaude).

## Common Pitfalls

### Pitfall 1: Forgetting to Add New Tables to schema({}) Export
**What goes wrong:** Table is defined but not exported in the `schema({...})` call at the bottom of schema.ts. Module publishes without the table.
**Why it happens:** schema.ts defines tables as `const` variables then exports them all in one object. Easy to add a table definition but forget the export object.
**How to avoid:** After adding each table definition, immediately add it to the `schema({...})` export.
**Warning signs:** `spacetime publish` succeeds but the table doesn't appear in SpacetimeDB dashboard.

### Pitfall 2: Forgetting to Extend delete_project Cascade
**What goes wrong:** Project is deleted but orphaned milestone/todo/debug_session/codebase_map/session_checkpoint records remain in the database.
**Why it happens:** delete_project currently only deletes the project row (not even phases — those are deleted separately via delete_phase). The cascade is incomplete.
**How to avoid:** The delete_project reducer must be extended to cascade to ALL new tables. Follow the collect-then-delete pattern from delete_phase.
**Warning signs:** After delete_project, querying new tables by project_id still returns rows.

### Pitfall 3: seed_project Not Updated for is_inserted Field
**What goes wrong:** seed_project inserts phases without `is_inserted` field. If SpacetimeDB requires all non-optional fields, this causes a runtime error during re-seed.
**Why it happens:** seed_project builds phase rows from JSON. Adding a new column to the phase table requires updating the JSON type AND the insert statement inside seed_project.
**How to avoid:** Add `is_inserted: boolean` to the phases array type in seed_project. Default to `false` for all seeded phases. Also update the `insert_phase` reducer to accept the new parameter.
**Warning signs:** `stclaude seed` fails with a type error or missing property error.

### Pitfall 4: Index Name Collisions Across Tables
**What goes wrong:** Two tables define an index with the same name (e.g., both use `by_status`). The module fails to publish with "name is used for multiple entities" error.
**Why it happens:** Index names are global across the entire module in SpacetimeDB.
**How to avoid:** Use `{table_name}_{column_name}` naming convention (already established). E.g., `todo_status`, `milestone_status`, `debug_session_status` — never just `by_status`.
**Warning signs:** Build/publish fails with duplicate name error.

### Pitfall 5: milestone_audit FK to milestone
**What goes wrong:** milestone_audit references milestone by `milestone_id`, but the milestone cascade delete must also delete milestone_audit records. Forgetting this creates orphaned audit records.
**Why it happens:** milestone_audit is a child of milestone (not directly of project). The cascade must be two-level: delete_project → delete milestones → delete each milestone's audits.
**How to avoid:** In delete_project, when iterating milestones to delete, also delete their milestone_audit children first.
**Warning signs:** After delete_project, milestone_audit table still has rows.

### Pitfall 6: update_phase Not Updated for is_inserted
**What goes wrong:** update_phase reducer doesn't accept or pass through is_inserted. Calling update_phase on an inserted phase resets is_inserted to undefined/false.
**Why it happens:** update_phase uses spread `...fields` — if is_inserted is not in the params, it won't be preserved.
**How to avoid:** Update_phase should either (a) accept is_inserted as a parameter, or (b) use `...existing` spread first so the existing value is preserved. The v1.0 pattern already uses `...existing` spread, so this is naturally handled if is_inserted is excluded from update params — but verify.
**Warning signs:** Phases lose their is_inserted flag after any update operation.

## Code Examples

Verified patterns from the actual codebase:

### Complete Table Definition with Index and Accessor
```typescript
// Source: /Users/gustav/src/spacetimeclaude/spacetimedb/src/schema.ts
const phase = table({
  name: 'phase',
  public: true,
  indexes: [
    { name: 'phase_project_id', accessor: 'phase_project_id', algorithm: 'btree', columns: ['project_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  number: t.string(),
  // ...other fields
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});
```

### Upsert Pattern (singleton table)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/spacetimedb/src/index.ts (upsert_config)
const existing = [...ctx.db.config.config_project_id.filter(project_id)][0];
if (existing) {
  ctx.db.config.id.update({ ...existing, config, updated_at: ctx.timestamp });
} else {
  ctx.db.config.insert({ id: 0n, project_id, config, created_at: ctx.timestamp, updated_at: ctx.timestamp });
}
```

### Collect-Then-Delete Pattern (cascade)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/spacetimedb/src/index.ts (delete_phase)
const plans = [...ctx.db.plan.plan_phase_id.filter(phase_id)];
for (const plan of plans) {
  ctx.db.plan.id.delete(plan.id);
}
```

### FK Validation Before Insert
```typescript
// Source: /Users/gustav/src/spacetimeclaude/spacetimedb/src/index.ts
const project = ctx.db.project.id.find(project_id);
if (!project) throw new SenderError(`Project ${project_id} not found`);
```

### Publishing with Database Clear
```bash
# Source: CLAUDE.md project instructions
spacetime publish <db-name> --clear-database -y --module-path <module-path>
```

## Column Design Recommendations

### milestone table
```
id: t.u64().primaryKey().autoInc()
project_id: t.u64()         — indexed: milestone_project_id
version: t.string()          — e.g., 'v1.0', 'v1.1'
name: t.string()
shipped_date: t.string()     — ISO date string, empty if not shipped
phase_count: t.u64()
plan_count: t.u64()
requirement_count: t.u64()
accomplishments: t.string()  — JSON array string
status: t.string()           — indexed: milestone_status ('active'|'shipped')
created_at: t.timestamp()
updated_at: t.timestamp()
```

### milestone_audit table
```
id: t.u64().primaryKey().autoInc()
project_id: t.u64()           — indexed: milestone_audit_project_id
milestone_id: t.u64()         — indexed: milestone_audit_milestone_id
audit_status: t.string()      — indexed: milestone_audit_status ('pending'|'complete')
requirement_scores: t.string() — JSON string
integration_scores: t.string() — JSON string
flow_scores: t.string()        — JSON string
tech_debt_items: t.string()    — JSON array string
roadmap_content: t.string()    — archived roadmap (MILE-03)
requirements_content: t.string() — archived requirements (MILE-03)
created_at: t.timestamp()
updated_at: t.timestamp()
```

Note on MILE-03: The CONTEXT.md says "milestone archive fields storing archived roadmap and requirements content per milestone version." This fits naturally as columns on milestone_audit (since audits happen at milestone completion time). No separate archive table needed.

### session_checkpoint table
```
id: t.u64().primaryKey().autoInc()
project_id: t.u64()         — indexed: session_checkpoint_project_id
phase_id: t.u64()           — indexed: session_checkpoint_phase_id (PRIMARY lookup key)
phase_context: t.string()
completed_work: t.string()
remaining_work: t.string()
decisions: t.string()
blockers: t.string()
next_action: t.string()
mental_context: t.string()
created_at: t.timestamp()
updated_at: t.timestamp()
```

### todo table
```
id: t.u64().primaryKey().autoInc()
project_id: t.u64()         — indexed: todo_project_id
title: t.string()
area: t.string()            — indexed: todo_area (for filtering by area)
problem: t.string()
solution_hints: t.string()
file_refs: t.string()       — JSON: [{path: string, line: number}]
status: t.string()          — indexed: todo_status ('pending'|'done')
created_at: t.timestamp()
updated_at: t.timestamp()
```

### debug_session table
```
id: t.u64().primaryKey().autoInc()
project_id: t.u64()         — indexed: debug_session_project_id
bug_description: t.string()
hypotheses: t.string()      — JSON: [{description, status, evidence}]
checkpoints: t.string()     — JSON array of checkpoint strings
timeline: t.string()        — JSON array of timeline entries
status: t.string()          — indexed: debug_session_status ('active'|'resolved')
resolution_notes: t.string().optional()
created_at: t.timestamp()
updated_at: t.timestamp()
```

### codebase_map table
```
id: t.u64().primaryKey().autoInc()
project_id: t.u64()         — indexed: codebase_map_project_id
doc_type: t.string()        — indexed: codebase_map_doc_type ('stack'|'integrations'|'architecture'|'structure'|'conventions'|'testing'|'concerns')
content: t.string()
created_at: t.timestamp()
updated_at: t.timestamp()
```

### phase table additions
```
// Add to existing phase column definition:
is_inserted: t.bool()
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SpacetimeDB 1.0 reducer callbacks | Event tables (2.0) | v2.0 SDK | Not relevant to this phase — no client-side code |
| `name` field on indexes | `accessor` field required | Current SDK (^2.0.2) | Must include both `name` and `accessor` in index definitions |

## Open Questions

1. **Should milestone_audit be separate table or columns on milestone?**
   - What we know: CONTEXT.md says "Claude's Discretion" for this. The data (audit status, scores, archive content) is logically one record per milestone, written once at audit time.
   - What's unclear: Whether any phase 8+ CLI commands need to query audit separately from milestone, or always fetch together.
   - Recommendation: Keep as separate table (`milestone_audit`). Separates write concerns (write-milestone vs write-audit), avoids nullable columns on milestone, and follows the existing plan/plan_summary separation pattern.

2. **Does is_inserted need a default value for existing phase rows during re-seed?**
   - What we know: `--clear-database` clears all data, then re-seed inserts fresh. seed_project builds phases from JSON.
   - What's unclear: Whether the stclaude seed command's phases JSON will include `is_inserted: false` for all v1.0 phases.
   - Recommendation: Add `is_inserted: boolean` to the seed_project phases array type, default `false`. The stclaude CLI seed command must be updated (phase 8) or the seed skill must be updated to pass this field. Check if seed_project is called by stclaude CLI source.

3. **update_phase and is_inserted — full update or preserve?**
   - What we know: Current update_phase accepts all mutable phase fields and spreads `...existing` first, then overrides with `...fields`.
   - What's unclear: Should update_phase accept is_inserted as an updatable field? Or should it be read-only after insert?
   - Recommendation: Accept is_inserted in update_phase (makes it explicit and avoids implicit state). The CLI layer decides when to set it.

## Validation Architecture

> workflow.nyquist_validation is NOT present in config.json — no validation architecture section needed.

## Sources

### Primary (HIGH confidence)
- `/Users/gustav/src/spacetimeclaude/spacetimedb/src/schema.ts` — complete v1.0 table definitions
- `/Users/gustav/src/spacetimeclaude/spacetimedb/src/index.ts` — complete v1.0 reducer implementations
- `/Users/gustav/src/spacetimeclaude/.planning/phases/07-schema-extensions/07-CONTEXT.md` — locked decisions and implementation approach
- `/Users/gustav/src/spacetimeclaude/.planning/REQUIREMENTS.md` — all requirement descriptions

### Secondary (MEDIUM confidence)
- Project CLAUDE.md and spacetimedb SDK docs in system prompt — TypeScript SDK v2 patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from actual installed package.json and source files
- Architecture: HIGH — all patterns directly readable from v1.0 implementation
- Pitfalls: HIGH — derived from known SpacetimeDB SDK constraints documented in system prompt CLAUDE.md + direct code inspection

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable codebase, SpacetimeDB SDK won't change within month)
