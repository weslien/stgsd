# Phase 1: Schema & Module - Research

**Researched:** 2026-03-02
**Domain:** SpacetimeDB v2 TypeScript module schema design & deployment
**Confidence:** HIGH

## Summary

Phase 1 requires defining ~13 tables and their CRUD reducers in a SpacetimeDB v2 TypeScript module, then publishing to maincloud. The project already has a working starter template (`spacetimedb/src/index.ts`) with the SpacetimeDB SDK v2.0.2 installed, esbuild bundling pipeline configured, and maincloud publishing wired up to `spacetimeclaude-gvhsi`. The existing `person` table and two reducers prove the pipeline works end-to-end.

The core challenge is designing a schema that models GSD's planning state as a hybrid of typed metadata columns and prose text fields, with referential integrity enforced in reducers (not database constraints), globally unique index names across all tables, and a bulk `seed_project` reducer for atomic project initialization. The SDK provides all needed primitives: `t.u64().primaryKey().autoInc()` for IDs, `t.string()` for text/prose, `t.timestamp()` for times, `.optional()` for nullable fields, and `.index('btree')` for queryable columns.

**Primary recommendation:** Split into `schema.ts` (all table definitions + schema export) and `index.ts` (all reducers + lifecycle hooks), use `t.u64().primaryKey().autoInc()` for all entity IDs, `t.string()` for all prose/JSON content, enforce referential integrity via `SenderError` throws in reducers, and prefix every index name with `{tableName}_` for global uniqueness.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Store rich content (plans, research, verification, phase context) as raw markdown -- same format agents produce today
- No frontmatter in prose fields -- metadata (status, dates, phase number) becomes typed table columns
- One text field per document; independently-tracked elements (tasks, must-haves) get their own tables with individual status tracking
- Plan summaries (SCHM-08) use typed columns for structured fields: subsystem, tags, headline, accomplishments, deviations, files, decisions, dependency graph metadata
- Reducers enforce referential integrity -- inserting a plan for a non-existent phase throws SenderError with clear message
- Fail fast, fail loud -- invalid data causes SenderError with descriptive message, transaction rolls back
- Flexible status transitions -- no enforced state machine, agents manage transitions correctly
- A seed_project reducer creates the full project skeleton (project + phases + requirements) in one atomic transaction
- Deleting a phase cascades to all its plans, tasks, requirements, etc. in one transaction
- Single project_state row per project with columns for current_phase, current_plan, current_task, last_activity, session fields
- One continue_here record per project (single resume point, matching current GSD behavior)
- Velocity data stored as JSON string column on project_state -- easy to extend, agents parse client-side
- Use SpacetimeDB native `t.timestamp()` type everywhere
- All tables `public: true` -- single-user CLI tool, no secrets, subscribeToAll() works
- Clear and republish (`--clear-database -y`) freely during v1 development

### Claude's Discretion
- Reducer granularity per table (fine-grained per-field vs coarse CRUD)
- Schema file organization (schema.ts vs split files)
- Index strategy per table (which columns need explicit btree indexes)
- Exact column types for list-like fields (JSON strings vs repeated text columns)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCHM-01 | Project table with name, description, core_value, constraints, context, key_decisions (text), timestamps | Table definition pattern with `t.string()` for text, `t.timestamp()` for times, `t.string().unique()` for git_remote_url |
| SCHM-02 | Phase table with milestone_id, number (string for decimals), name, slug, goal, status, depends_on, success_criteria | Foreign key via `t.u64()` for project_id, `t.string()` for number/slug/status, index on `phase_project_id` for lookups |
| SCHM-03 | Plan table with phase_id, plan_number, type, wave, depends_on, objective, autonomous, requirements, status | Foreign key via `t.u64()` for phase_id, mixed typed columns + text, index on `plan_phase_id` |
| SCHM-04 | Plan task table with plan_id, task_number, type, description, status, commit_hash | Foreign key via `t.u64()` for plan_id, index on `plan_task_plan_id` |
| SCHM-05 | Requirement table with project_id, category, number, description, status, phase_number, milestone_version | Foreign key via `t.u64()` for project_id, index on `requirement_project_id` |
| SCHM-06 | Project state table replacing STATE.md | Single row per project pattern, `t.string()` for velocity_data JSON, `t.timestamp()` for last_activity |
| SCHM-07 | Continue-here table for resume state | Single row per project pattern, `t.u64()` for phase_id, text fields for state/context |
| SCHM-08 | Plan summary with structured fields | Fully typed columns: subsystem, tags, headline, accomplishments, deviations, files, decisions as `t.string()` each |
| SCHM-09 | Verification table with phase_id, status, score, content, recommended fixes | `t.u64()` for phase_id, `t.string()` for prose content, index on `verification_phase_id` |
| SCHM-10 | Research table with phase_id, domain, confidence, content | `t.u64()` for phase_id, `t.string()` for prose content, index on `research_phase_id` |
| SCHM-11 | Phase context table with phase_id, content | `t.u64()` for phase_id, `t.string()` for user decisions prose |
| SCHM-12 | Config table with project_id, config as JSON string | `t.u64()` for project_id, `t.string()` for JSON config blob |
| SCHM-13 | Must-have table (truths, artifacts, key_links) linked to plans | `t.u64()` for plan_id FK, individual typed fields, index on `must_have_plan_id` |
| SCHM-14 | Reducers for all CRUD operations on each table | CRUD reducer pattern per table using `spacetimedb.reducer()`, plus `seed_project` bulk reducer |
| SCHM-15 | Project identity derived from git remote URL | `t.string().unique()` on project table `git_remote_url` column |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| spacetimedb | ^2.0.2 | SpacetimeDB TypeScript server SDK | Already installed, provides `schema`, `table`, `t`, `SenderError` |
| spacetimedb/server | 2.0.2 | Server-side imports for table/reducer definitions | Required import path for module code |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| esbuild | ^0.24.0 | Bundling module for `spacetime publish` | Already configured in package.json scripts |
| typescript | ~5.6.2 | Type checking | Already configured with strict mode |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `t.string()` for JSON blobs | `t.object()` for typed nested data | JSON strings are simpler to extend without schema migration; objects would need schema republish for every shape change |
| Single `index.ts` | Split `schema.ts` + `index.ts` | Split avoids circular imports (schema must export `spacetimedb`, reducers import it). CLAUDE.md recommends splitting. |
| `t.u32()` for IDs | `t.u64()` for IDs | u64 is conventional for SpacetimeDB, matches existing BigInt patterns, no risk of ID exhaustion |

**Installation:**
No new packages needed. All dependencies already installed in `spacetimeclaude/spacetimedb/package.json` and `spacetimeclaude/package.json`.

## Architecture Patterns

### Recommended Project Structure
```
spacetimeclaude/spacetimedb/
  src/
    schema.ts    # All table definitions + schema({...}) export
    index.ts     # All reducers + lifecycle hooks, imports spacetimedb from ./schema
  package.json
  tsconfig.json
```

**Rationale:** The CLAUDE.md explicitly recommends `schema.ts` for tables and `index.ts` for reducers to avoid circular import issues. The `schema()` call must happen in a single file, and all reducers must import the resulting `spacetimedb` object.

### Pattern 1: Table Definition
**What:** Every table uses `table(OPTIONS, COLUMNS)` with options first, columns second.
**When to use:** Every table in the schema.
**Example:**
```typescript
// Source: Verified against spacetimedb SDK v2.0.2 source + CLAUDE.md
import { schema, table, t } from 'spacetimedb/server';

const project = table({
  name: 'project',
  public: true,
}, {
  id: t.u64().primaryKey().autoInc(),
  git_remote_url: t.string().unique(),
  name: t.string(),
  description: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});
```

### Pattern 2: Foreign Key with Index
**What:** Reference parent tables via `t.u64()` column + btree index for efficient lookups.
**When to use:** Every child table that references a parent (phase -> project, plan -> phase, etc.).
**Example:**
```typescript
// Source: Verified against CLAUDE.md index patterns + SDK type_builders.ts
const phase = table({
  name: 'phase',
  public: true,
  indexes: [
    { name: 'phase_project_id', algorithm: 'btree', columns: ['project_id'] }
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  number: t.string(),  // String to support decimals like "2.1"
  name: t.string(),
  status: t.string(),
  // ...
});
```

**Alternative single-column index shorthand:**
```typescript
// Also valid -- .index() on the column type itself
project_id: t.u64().index('btree'),
```
However, using the shorthand does NOT let you name the index. The `indexes` array in OPTIONS is preferred because it gives explicit, globally unique names required by SpacetimeDB.

### Pattern 3: CRUD Reducer with Referential Integrity
**What:** Reducers that validate foreign keys exist before inserting, use spread-update pattern, and throw `SenderError` on violations.
**When to use:** Every insert/update reducer that references another table.
**Example:**
```typescript
// Source: Verified against CLAUDE.md reducer patterns + SDK errors.ts
import spacetimedb from './schema';
import { t, SenderError } from 'spacetimedb/server';

export const insert_plan = spacetimedb.reducer(
  { phase_id: t.u64(), plan_number: t.u64(), objective: t.string(), status: t.string() },
  (ctx, { phase_id, plan_number, objective, status }) => {
    // Referential integrity check
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);

    ctx.db.plan.insert({
      id: 0n,  // auto-inc placeholder
      phase_id,
      plan_number,
      objective,
      status,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);
```

### Pattern 4: Spread-Update Pattern
**What:** Fetch existing row, spread it, override only changed fields.
**When to use:** Every update reducer.
**Example:**
```typescript
// Source: CLAUDE.md section 4 "Update pattern (CRITICAL)"
export const update_plan_status = spacetimedb.reducer(
  { plan_id: t.u64(), status: t.string() },
  (ctx, { plan_id, status }) => {
    const existing = ctx.db.plan.id.find(plan_id);
    if (!existing) throw new SenderError(`Plan ${plan_id} not found`);
    ctx.db.plan.id.update({ ...existing, status, updated_at: ctx.timestamp });
  }
);
```

### Pattern 5: Bulk Seed Reducer
**What:** A single reducer that creates an entire project skeleton atomically.
**When to use:** The `seed_project` reducer for initializing a GSD project.
**Example:**
```typescript
export const seed_project = spacetimedb.reducer(
  { git_remote_url: t.string(), name: t.string(), description: t.string(), /* ...phase data... */ },
  (ctx, args) => {
    // Insert project, get back row with auto-generated ID
    const proj = ctx.db.project.insert({
      id: 0n,
      git_remote_url: args.git_remote_url,
      name: args.name,
      // ...
    });
    // Insert phases using proj.id
    const phase1 = ctx.db.phase.insert({
      id: 0n,
      project_id: proj.id,
      // ...
    });
    // Insert requirements using proj.id
    // ... all in one transaction
  }
);
```

### Pattern 6: Cascade Delete
**What:** Deleting a parent entity also deletes all children in the same transaction.
**When to use:** `delete_phase` reducer that removes phase + all plans, tasks, requirements, etc.
**Example:**
```typescript
export const delete_phase = spacetimedb.reducer(
  { phase_id: t.u64() },
  (ctx, { phase_id }) => {
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);

    // Delete children first (using index lookups)
    for (const plan of ctx.db.plan.plan_phase_id.filter(phase_id)) {
      // Delete plan's children
      for (const task of ctx.db.planTask.plan_task_plan_id.filter(plan.id)) {
        ctx.db.planTask.id.delete(task.id);
      }
      ctx.db.plan.id.delete(plan.id);
    }
    // ... delete other children (requirements, verification, research, etc.)
    ctx.db.phase.id.delete(phase_id);
  }
);
```

### Anti-Patterns to Avoid
- **Indexes in COLUMNS (2nd arg):** Causes "reading 'tag'" error at publish time. Always put indexes in OPTIONS (1st arg).
- **Multi-column indexes:** Broken in SpacetimeDB v2 -- causes PANIC or silent empty results. Use single-column index + manual filter instead.
- **Same index name across tables:** Index names are globally unique. Always prefix with `{tableName}_`.
- **Partial updates without spread:** `ctx.db.table.id.update({ id, changedField })` nulls out all other fields. Always spread existing row first.
- **Positional reducer arguments:** Client calls use object syntax `{ param: 'value' }`, not positional args.
- **Importing spacetimedb from index.ts:** Causes "Cannot access before initialization". Always import from schema.ts.
- **Index on `.primaryKey()` column:** Already indexed automatically. Adding explicit index causes "name is used for multiple entities" error.
- **Index on `.unique()` column:** Already indexed automatically. Same conflict error.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auto-increment IDs | Custom sequence counters | `t.u64().primaryKey().autoInc()` with `0n` placeholder | SpacetimeDB handles atomicity, gaps are normal |
| Referential integrity | Pre-query validation middleware | `SenderError` throws in each reducer | Transaction rollback is automatic on throw |
| Current timestamp | `Date.now()` or similar | `ctx.timestamp` | Reducers must be deterministic, no `Date` |
| JSON serialization of BigInt | Custom serializer | Convert to string before JSON.stringify: `row.id.toString()` | BigInt is not JSON-serializable natively |
| Status enum validation | Switch/case in every reducer | `t.string()` with clear conventions | User decision: no enforced state machine |

**Key insight:** SpacetimeDB reducers are transactional and deterministic. Every mutation either succeeds completely or rolls back completely. Throwing `SenderError` at any point aborts the entire transaction cleanly -- this IS the error handling pattern, not a workaround.

## Common Pitfalls

### Pitfall 1: BigInt Literals
**What goes wrong:** Using `0` instead of `0n` for auto-inc placeholders or ID comparisons.
**Why it happens:** JavaScript habit. SpacetimeDB u64 fields are BigInt.
**How to avoid:** Always use `0n` for auto-inc insert placeholders, `===` comparisons with `BigInt` values (e.g., `row.id === 5n`).
**Warning signs:** TypeScript compile errors about number vs bigint.

### Pitfall 2: Index Name Collisions
**What goes wrong:** Two tables with index named `by_status` -- publish fails with "name is used for multiple entities."
**Why it happens:** Index names are globally unique across the entire module, not scoped to tables.
**How to avoid:** Prefix every index name with table name: `phase_status`, `plan_status`, `task_status`.
**Warning signs:** Publish error mentioning duplicate names.

### Pitfall 3: Circular Import Between schema.ts and index.ts
**What goes wrong:** "Cannot access before initialization" error at publish time.
**Why it happens:** schema.ts defines tables AND exports `spacetimedb`. If index.ts also defines tables that schema.ts imports, circular dependency occurs.
**How to avoid:** ALL table definitions go in schema.ts. index.ts ONLY imports `spacetimedb` from schema.ts and defines reducers.
**Warning signs:** Runtime initialization errors during publish.

### Pitfall 4: Forgetting ctx.timestamp for Timestamps
**What goes wrong:** Using `new Date()` or `Date.now()` in a reducer.
**Why it happens:** Habit from Node.js code. SpacetimeDB reducers must be deterministic.
**How to avoid:** Always use `ctx.timestamp` for the current time inside reducers.
**Warning signs:** Reducer might actually work but produce non-deterministic results, breaking SpacetimeDB's replay guarantees.

### Pitfall 5: Update Without Spread
**What goes wrong:** Updating a row with `{ id: rowId, status: 'done' }` nulls out all other columns.
**Why it happens:** SpacetimeDB update replaces the entire row, not just the specified fields.
**How to avoid:** Always: `ctx.db.table.pk.update({ ...existing, status: 'done' })`.
**Warning signs:** Data disappearing after updates.

### Pitfall 6: Seed Reducer Parameter Limits
**What goes wrong:** A bulk seed reducer with many parameters becomes unwieldy or hits type complexity limits.
**Why it happens:** Each reducer parameter must be a SpacetimeDB-typed value, and deeply nested structures need `t.object()` definitions.
**How to avoid:** For `seed_project`, use JSON strings for complex data that varies (e.g., phase definitions as a JSON string that gets parsed in the reducer). Simple top-level fields (project name, git URL) as typed params.
**Warning signs:** TypeScript errors about excessively deep type instantiation. Note: reducers must be deterministic so `JSON.parse()` is fine (pure function on its input).

### Pitfall 7: Table Name vs Access Name
**What goes wrong:** Defining `table({ name: 'project_state' })` but accessing as `ctx.db.project_state` instead of `ctx.db.projectState`.
**Why it happens:** SpacetimeDB auto-converts snake_case table names to camelCase for `ctx.db` access.
**How to avoid:** Use camelCase in table name definitions (e.g., `name: 'projectState'`) OR remember the conversion. Index names are NOT converted -- they are used verbatim.
**Warning signs:** "Cannot read properties of undefined" on `ctx.db`.

## Code Examples

Verified patterns from project's CLAUDE.md and SDK source code (v2.0.2):

### Schema File Structure (schema.ts)
```typescript
// Source: CLAUDE.md section 10 + existing index.ts template
import { schema, table, t } from 'spacetimedb/server';

// --- Table Definitions ---

const project = table({
  name: 'project',
  public: true,
}, {
  id: t.u64().primaryKey().autoInc(),
  git_remote_url: t.string().unique(),
  name: t.string(),
  description: t.string(),
  core_value: t.string(),
  constraints: t.string(),
  context: t.string(),
  key_decisions: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const phase = table({
  name: 'phase',
  public: true,
  indexes: [
    { name: 'phase_project_id', algorithm: 'btree', columns: ['project_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  number: t.string(),
  name: t.string(),
  slug: t.string(),
  goal: t.string(),
  status: t.string(),
  depends_on: t.string(),       // JSON string of phase numbers
  success_criteria: t.string(), // Prose markdown
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

// ... remaining tables follow same pattern ...

const spacetimedb = schema({
  project,
  phase,
  // ... all tables listed here
});

export default spacetimedb;
```

### Reducer File Structure (index.ts)
```typescript
// Source: CLAUDE.md section 4 + existing index.ts template
import spacetimedb from './schema';
import { t, SenderError } from 'spacetimedb/server';

// --- Lifecycle ---
export const init = spacetimedb.init((_ctx) => {
  // Called when module is first published
});

export const onConnect = spacetimedb.clientConnected((_ctx) => {});
export const onDisconnect = spacetimedb.clientDisconnected((_ctx) => {});

// --- Project Reducers ---
export const insert_project = spacetimedb.reducer(
  {
    git_remote_url: t.string(),
    name: t.string(),
    description: t.string(),
    core_value: t.string(),
    constraints: t.string(),
    context: t.string(),
    key_decisions: t.string(),
  },
  (ctx, args) => {
    ctx.db.project.insert({
      id: 0n,
      ...args,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_project = spacetimedb.reducer(
  {
    project_id: t.u64(),
    name: t.string(),
    description: t.string(),
    core_value: t.string(),
    constraints: t.string(),
    context: t.string(),
    key_decisions: t.string(),
  },
  (ctx, { project_id, ...fields }) => {
    const existing = ctx.db.project.id.find(project_id);
    if (!existing) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.project.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_project = spacetimedb.reducer(
  { project_id: t.u64() },
  (ctx, { project_id }) => {
    const existing = ctx.db.project.id.find(project_id);
    if (!existing) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.project.id.delete(project_id);
  }
);
```

### Insert with Auto-Inc ID Capture
```typescript
// Source: CLAUDE.md section 2 "Insert returns ROW, not ID"
const row = ctx.db.project.insert({
  id: 0n,  // placeholder for auto-inc
  git_remote_url: 'git@github.com:user/repo.git',
  name: 'My Project',
  // ...
  created_at: ctx.timestamp,
  updated_at: ctx.timestamp,
});
// row.id is the actual generated ID (BigInt)
```

### Index Lookup in Reducers
```typescript
// Source: CLAUDE.md section 3 "TypeScript Query Patterns"

// Primary key lookup (already indexed)
const project = ctx.db.project.id.find(projectId);

// Unique column lookup
const project = ctx.db.project.git_remote_url.find(url);

// Explicit btree index lookup (returns iterator)
const phases = [...ctx.db.phase.phase_project_id.filter(projectId)];

// No index -- iterate + manual filter
for (const state of ctx.db.projectState.iter()) {
  if (state.project_id === projectId) { /* found it */ }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SpacetimeDB 1.0 `@clockworklabs/spacetimedb-sdk` | SpacetimeDB 2.0 `spacetimedb` package | v2.0.0 (2025) | New import paths, new table/reducer syntax, 100k+ TPS for TS modules |
| `schema(table1, table2)` spread args | `schema({ table1, table2 })` object arg | v2.0 | Single object argument required |
| Reducer callbacks (`on_reducer_X`) | Event tables | v2.0 | Breaking change from 1.0 migration |
| `name` property on table | `accessor` property (client SDK) | v2.0 | Table access name changed on client side |

**Deprecated/outdated:**
- `@clockworklabs/spacetimedb-sdk`: Old v1 package name. Use `spacetimedb` instead.
- `SpacetimeDBClient.connect()`: Does not exist in v2. Use `DbConnection.builder()`.
- Row Level Security (RLS): Deprecated. Use views instead.
- `t.struct()`: Does not exist. Use `t.object()` for nested types.
- `t.sum()`: Does not exist. Use `t.enum()` for tagged unions.

## Open Questions

1. **Seed reducer parameter complexity**
   - What we know: The `seed_project` reducer needs to accept project + N phases + M requirements in one call. Reducer params must be SpacetimeDB-typed.
   - What's unclear: Whether passing a JSON string param (parsed inside reducer) is cleaner than deeply nested `t.object()` / `t.array()` params.
   - Recommendation: Use `t.string()` for the phases/requirements data (JSON), parse inside reducer. This avoids complex nested type definitions and is easy to extend. JSON.parse is deterministic.

2. **Column-level `.index()` vs `indexes` array naming**
   - What we know: Both `t.string().index('btree')` and `indexes: [{ name: '...', algorithm: 'btree', columns: [...] }]` work. The shorthand does not allow naming the index.
   - What's unclear: Whether unnamed indexes (from `.index()`) get auto-generated names that could conflict.
   - Recommendation: Use the explicit `indexes` array in table OPTIONS for all indexes. This gives full control over naming and avoids potential auto-name collisions. The shorthand is convenient but risky for a module with 13+ tables.

3. **Table name casing convention**
   - What we know: Table names defined as `snake_case` (e.g., `project_state`) are auto-converted to `camelCase` for `ctx.db` access (e.g., `ctx.db.projectState`). Index names are NOT converted.
   - What's unclear: Whether it's cleaner to define table names as already-camelCase to avoid confusion.
   - Recommendation: Use `snake_case` for table names (matches database convention), accept the auto-conversion for `ctx.db` access. Document the mapping clearly in code comments.

## Sources

### Primary (HIGH confidence)
- SpacetimeDB SDK v2.0.2 source code at `spacetimeclaude/node_modules/spacetimedb/src/` -- verified `SenderError`, `type_builders.ts`, `schema`, `table`, `t` exports
- Project CLAUDE.md at `spacetimeclaude/CLAUDE.md` -- comprehensive TypeScript SDK rules with verified patterns
- Existing starter template at `spacetimeclaude/spacetimedb/src/index.ts` -- working schema/reducer pattern
- [SpacetimeDB TypeScript Module Reference](https://spacetimedb.com/docs/modules/typescript/) -- official docs
- [SpacetimeDB Cheat Sheet](https://spacetimedb.com/docs/databases/cheat-sheet/) -- official reference

### Secondary (MEDIUM confidence)
- [SpacetimeDB Column Types](https://spacetimedb.com/docs/tables/columns/) -- verified column constraints and type builders
- [SpacetimeDB TypeScript Quickstart](https://spacetimedb.com/docs/quickstarts/typescript/) -- verified schema() object syntax
- [SpacetimeDB GitHub Releases](https://github.com/clockworklabs/SpacetimeDB/releases) -- v2.0.1 release notes for known fixes

### Tertiary (LOW confidence)
- None -- all critical claims verified against SDK source or official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- SDK already installed, patterns verified against source code and CLAUDE.md
- Architecture: HIGH -- split schema.ts/index.ts pattern confirmed by CLAUDE.md and official docs, circular import avoidance is well-documented
- Pitfalls: HIGH -- all pitfalls verified against CLAUDE.md common mistakes table and SDK source code; multi-column index BROKEN status confirmed

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (stable -- SpacetimeDB v2 is GA, TypeScript SDK is out of beta)
