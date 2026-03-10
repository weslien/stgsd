# Phase 11: Codebase Mapping - Research

**Researched:** 2026-03-04
**Domain:** SpacetimeDB TypeScript CLI commands + GSD map-codebase workflow patching
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CMAP-02 | CLI command `stclaude write-codebase-map` persists a codebase mapping document by type | `upsertCodebaseMap` reducer exists in bindings; args: `{ projectId, docType, content }`; upsert semantics (create or overwrite by docType+projectId) |
| CMAP-03 | CLI command `stclaude get-codebase-map` retrieves codebase mapping documents (all or by type) | `codebase_map_project_id` index exists for project-scoped queries; `codebase_map_doc_type` index for type filtering |
| CMAP-04 | GSD patch for map-codebase workflow replacing `.planning/codebase/` file writes with stclaude calls | `gsd-codebase-mapper` agent `write_documents` step writes directly; patch target is the `write_documents` step in the mapper agent |
| CMAP-05 | GSD patch for map-codebase workflow replacing `.planning/codebase/` file reads (freshness check) with stclaude calls | `check_existing` step in `map-codebase.md` reads `codebase_dir_exists`; also `offer_next` step references file system; GSD init currently reads filesystem |

</phase_requirements>

## Summary

Phase 11 adds 2 CLI commands (`write-codebase-map`, `get-codebase-map`) and patches 2 GSD components (the `gsd-codebase-mapper` agent and the `map-codebase.md` workflow). The SpacetimeDB schema for the `codebase_map` table was created in Phase 7 and client bindings are fully generated. The key reducer is `upsertCodebaseMap` (not insert+update), which creates or overwrites by `projectId` + `docType` — a simpler interface than the debug/todo patterns.

The codebase mapping workflow has a unique two-file patch target: (1) the `gsd-codebase-mapper` agent which currently uses the `Write` tool to create `.planning/codebase/*.md` files must instead call `stclaude write-codebase-map`, and (2) the `map-codebase.md` orchestrator which reads from the filesystem in the `check_existing` and `offer_next` steps must instead call `stclaude get-codebase-map`. The `gsd-tools.cjs` init handler for `map-codebase` also reads from the filesystem — this requires either patching the init handler or adapting the workflow to use `stclaude get-codebase-map` before the init call.

**Primary recommendation:** Implement in 2 plans — Plan 01 for the 2 CLI commands, Plan 02 for the GSD patches to `gsd-codebase-mapper.md` and `map-codebase.md`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| commander | (project dependency) | CLI option parsing | Already used in all existing 31 commands |
| spacetimedb SDK | 2.0.x | DB connection and subscription | Project standard |
| Node.js `node:fs` | built-in | Read document content from --file flag | Used in write-milestone.ts, write-plan.ts |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Node.js `node:process` | built-in | stdin reading if --file not provided | If mapper agent pipes content via stdin |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `--file` flag for content | positional arg | Long markdown content can't be passed as positional; `--file` pattern from write-milestone.ts is established |
| Multiple calls for 7 doc types | batch write command | Write-one-at-a-time is simpler; mapper agents are independent and write their own doc types |

**Installation:**
No new packages needed — everything already in project dependencies.

## Architecture Patterns

### Recommended Project Structure
```
src/cli/commands/
├── write-codebase-map.ts    # new - upsertCodebaseMap reducer
└── get-codebase-map.ts      # new - filter by project, optionally by docType
src/cli/index.ts             # register 2 new commands
~/.claude/agents/
└── gsd-codebase-mapper.md   # patch: write_documents step calls stclaude instead of Write tool
~/.claude/get-shit-done/workflows/
└── map-codebase.md          # patch: check_existing + offer_next steps call stclaude
```

### Pattern 1: Upsert Command (write-codebase-map)
**What:** The `upsertCodebaseMap` reducer creates a new row OR updates the existing row for a given `(projectId, docType)` pair. Unlike insert+update patterns, no auto-detect needed — always call upsert.
**When to use:** `write-codebase-map` command only.
**Example:**
```typescript
// Source: Verified from upsert_codebase_map_reducer.ts + write-session.ts (analogous upsert pattern)
function waitForUpsert(
  conn: DbConnection,
  projectId: bigint,
  docType: string,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Codebase map upsert timed out after 5 seconds'));
    }, timeoutMs);
    const done = () => { clearTimeout(timer); resolve(); };
    // Listen for both insert (first time) and update (refresh)
    conn.db.codebases.onInsert((_ctx: any, row: any) => {
      if (row.projectId === projectId && row.docType === docType) done();
    });
    conn.db.codebases.onUpdate((_ctx: any, _oldRow: any, newRow: any) => {
      if (newRow.projectId === projectId && newRow.docType === docType) done();
    });
  });
}

// In the action handler:
const upsertPromise = waitForUpsert(conn, project.id, docType);
conn.reducers.upsertCodebaseMap({
  projectId: project.id,
  docType,      // one of: stack|integrations|architecture|structure|conventions|testing|concerns
  content,      // full document content (read from --file or --content flag)
});
await upsertPromise;
```

### Pattern 2: Read-Only List Command (get-codebase-map)
**What:** Filter by project, optionally by docType. No mutations, no listener wait.
**When to use:** `get-codebase-map` command.
**Example:**
```typescript
// Source: Pattern from get-milestones.ts, list-todos.ts
const result = await withConnection((conn: DbConnection) => {
  const project = findProjectByGitRemote(conn, gitRemoteUrl);

  let rows = [...conn.db.codebases.codebase_map_project_id.filter(project.id)];

  if (options.type) {
    rows = rows.filter(row => row.docType === options.type);
  }

  // Sort alphabetically by docType for stable output
  rows.sort((a, b) => a.docType.localeCompare(b.docType));

  return rows.map(row => ({
    docType: row.docType,
    content: row.content,
    updatedAt: new Date(Number(row.updatedAt.microsSinceUnixEpoch / 1000n)).toISOString(),
  }));
});
```

### Pattern 3: Content from File or Flag
**What:** Codebase map documents are long markdown files. Accept content via `--file` (path to file) or `--content` (inline string).
**When to use:** `write-codebase-map` command.
**Example:**
```typescript
// Source: write-milestone.ts uses fs.readFileSync for --file flag
import { readFileSync } from 'node:fs';

let content: string;
if (options.file) {
  content = readFileSync(options.file as string, 'utf-8');
} else if (options.content) {
  content = options.content as string;
} else {
  throw new CliError(ErrorCodes.INVALID_ARGUMENT, 'Either --file or --content is required');
}
```

### Pattern 4: GSD Agent Patch (write_documents step)
**What:** The `gsd-codebase-mapper.md` agent currently writes documents using the `Write` tool directly to `.planning/codebase/`. The `write_documents` step must be patched to call `stclaude write-codebase-map` instead.
**When to use:** CMAP-04 patch.
**Example (patched step):**
```markdown
<step name="write_documents">
Write document(s) to SpacetimeDB using the stclaude CLI.

For each document you've prepared:
```bash
stclaude write-codebase-map --type {doc_type_lowercase} --file {temp_path}
```

**Document type mapping:**
- STACK.md → `--type stack`
- INTEGRATIONS.md → `--type integrations`
- ARCHITECTURE.md → `--type architecture`
- STRUCTURE.md → `--type structure`
- CONVENTIONS.md → `--type conventions`
- TESTING.md → `--type testing`
- CONCERNS.md → `--type concerns`

Write each document content to a temp file first, then pass with --file.
</step>
```

### Pattern 5: GSD Workflow Patch (check_existing + offer_next)
**What:** `map-codebase.md` checks for existing documents via `codebase_dir_exists` from the init JSON (filesystem-based). Replace with `stclaude get-codebase-map --json` to check DB.
**When to use:** CMAP-05 patch.
**Key insight:** The `init map-codebase` handler in `gsd-tools.cjs` populates `codebase_dir_exists` and `existing_maps` by reading the filesystem. These values are used in `check_existing` step. The patch needs to either:
  - Option A: Call `stclaude get-codebase-map --json` separately in the `check_existing` step (preferred — no gsd-tools.cjs change needed)
  - Option B: Modify `gsd-tools.cjs` to call stclaude (complex — requires Node.js subprocess)

**Option A is preferred** because it keeps gsd-tools.cjs unchanged and only requires editing the workflow .md file.

**Patched check_existing step:**
```markdown
<step name="check_existing">
Check if codebase maps already exist in SpacetimeDB:

```bash
stclaude get-codebase-map --json
```

Parse the result. If maps exist (non-empty array):
[... rest of existing/refresh/update/skip logic ...]

If no maps exist (empty array or NOT_CONFIGURED error):
Continue to spawn_agents.
</step>
```

**Patched offer_next (line counts from DB):**
```markdown
<step name="offer_next">
Get existing maps for summary:

```bash
stclaude get-codebase-map --json
```

Display completion summary showing document types and their updatedAt timestamps.
[... rest of completion message ...]
</step>
```

### Anti-Patterns to Avoid
- **Patching gsd-tools.cjs init handler:** The `cmdInitMapCodebase` function reads the filesystem for `existing_maps`. Do NOT modify gsd-tools.cjs — instead, call `stclaude get-codebase-map` directly in the workflow step, ignoring the filesystem-based init values.
- **Using `conn.db.codebases.codebase_map_doc_type.filter(docType)` alone:** This returns docs across ALL projects. Always filter by `codebase_map_project_id` first (project scope), then apply docType filter in JS.
- **Expecting a unique constraint on (projectId, docType):** The schema has a unique constraint on `id` but NOT a composite unique on `(projectId, docType)`. The upsert reducer handles the "one doc per type per project" invariant server-side. Do not try to find existing by (projectId, docType) and branch — just call upsert.
- **Having gsd-codebase-mapper write to filesystem first then upload:** Write directly to SpacetimeDB. No intermediate file needed (mapper can use `--content` flag with here-doc, or write to a temp file then `--file`).
- **Missing `db.codebases` accessor name:** The table is named `codebase_map` in the schema but accessed as `conn.db.codebases` (the TypeScript export name from `codebases_table.ts`). Confirmed from module_bindings/index.ts.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Upsert vs insert/update logic | Manual find-then-insert-or-update | `conn.reducers.upsertCodebaseMap()` | Server-side upsert reducer already handles the create-or-overwrite logic |
| Connection management | Custom pool | `withConnection()` wrapper | Already handles subscribe, timeout, disconnect |
| Output formatting | Custom serializer | `outputSuccess()` / `outputError()` | Already handles --json flag and BigInt |
| DocType validation | Runtime check optional | Simple enum validation in CLI | 7 fixed values; schema stores as string, CLI should guard |
| Content reading | Custom reader | `node:fs readFileSync` | 1 line; no new dependency |

**Key insight:** The `upsertCodebaseMap` reducer is the simplest of the mutation patterns across all phases — no ID tracking needed, no find-before-update, just call upsert with content and docType.

## Common Pitfalls

### Pitfall 1: Table accessor name is `codebases`, not `codebases_map` or `codbeaseMaps`
**What goes wrong:** Accessing `conn.db.codbeaseMaps` or `conn.db.codebaseMaps` throws runtime error.
**Why it happens:** The TypeScript export is named `CodebasesRow` and the table accessor is `conn.db.codebases` (from `codebases_table.ts`). The table's DB name is `codebase_map` but the TS accessor is `codebases`.
**How to avoid:** Use `conn.db.codebases` (no "Map" suffix). Confirmed from `index.ts` which imports `CodebasesRow` and registers the table as `codebases`.
**Warning signs:** `TypeError: Cannot read properties of undefined (reading 'codebase_map_project_id')`.

### Pitfall 2: Index names are verbatim, not camelCase-transformed
**What goes wrong:** Accessing `conn.db.codebases.codebaseMapProjectId` throws error.
**Why it happens:** Index names are NOT transformed (unlike table names). Must use exact index name as defined.
**How to avoid:** Use exact names: `conn.db.codebases.codebase_map_project_id.filter(projectId)` and `conn.db.codebases.codebase_map_doc_type.filter(docType)`.
**Warning signs:** `TypeError: Cannot read properties of undefined (reading 'filter')`.

### Pitfall 3: Filtering by docType only (cross-project data leak)
**What goes wrong:** `conn.db.codebases.codebase_map_doc_type.filter('stack')` returns stack documents from ALL projects.
**Why it happens:** The docType index is global across all projects.
**How to avoid:** Always filter by project first: `[...conn.db.codebases.codebase_map_project_id.filter(project.id)].filter(row => row.docType === options.type)`.
**Warning signs:** `get-codebase-map --type stack` returns documents from other repos.

### Pitfall 4: gsd-codebase-mapper agent still has Write tool in its tool list
**What goes wrong:** Patching the `write_documents` step but forgetting the agent still has `Write` tool access — confusing but functional.
**Why it happens:** Agent metadata header lists `tools: Read, Bash, Grep, Glob, Write`. After patching to use Bash+stclaude, the `Write` tool is unused but harmless.
**How to avoid:** Optionally remove `Write` from tools list in agent header to reflect new behavior. Not strictly required but makes the agent definition accurate.
**Warning signs:** N/A — functional but confusing.

### Pitfall 5: map-codebase workflow commit step tries to commit .planning/codebase/*.md
**What goes wrong:** `commit_codebase_map` step runs `gsd-tools.cjs commit ... --files .planning/codebase/*.md` which fails if those files don't exist.
**Why it happens:** After patching to DB storage, no files are written to filesystem.
**How to avoid:** Patch the `commit_codebase_map` step to either skip (DB storage doesn't need git commit) or write a note to the user that docs are in SpacetimeDB, not files.
**Warning signs:** `git add .planning/codebase/*.md` fails with "pathspec did not match any files".

### Pitfall 6: scan_for_secrets step scans .planning/codebase/ which no longer exists
**What goes wrong:** `scan_for_secrets` step tries to grep `.planning/codebase/*.md` which doesn't exist, making the step fail or silently skip.
**Why it happens:** Secret scanning was designed for filesystem-based storage.
**How to avoid:** The `scan_for_secrets` step should be removed or adapted when patching `map-codebase.md`, since content goes to SpacetimeDB directly. Security concern is now: does SpacetimeDB data include secrets? The mapper agent should still follow the `<forbidden_files>` rules to avoid capturing secrets in the content it generates.
**Warning signs:** Grep fails with "No such file or directory" on `scan_for_secrets` step.

### Pitfall 7: get-codebase-map with --type flag returns empty but no error
**What goes wrong:** User runs `stclaude get-codebase-map --type stack` when no maps exist; command returns empty array without a helpful error message.
**Why it happens:** Zero results is not an error in the query, but may be confusing for workflows checking for existence.
**How to avoid:** When `--type` is specified and result is empty, return a `CODEBASE_MAP_NOT_FOUND` error (or `NOT_FOUND`). When no `--type` and result is empty, return empty array (user sees "No codebase maps found").
**Warning signs:** Workflow silently continues as if maps exist when they don't.

## Code Examples

Verified patterns from official codebase sources:

### upsertCodebaseMap reducer signature (from upsert_codebase_map_reducer.ts)
```typescript
// Source: /src/module_bindings/upsert_codebase_map_reducer.ts
// Args: { projectId: u64, docType: string, content: string }
conn.reducers.upsertCodebaseMap({
  projectId: project.id,    // bigint
  docType: 'stack',         // one of 7 values (validated in CLI)
  content: markdownContent, // full document text
});
```

### Access pattern for codebases table (from module_bindings/index.ts)
```typescript
// Table accessor: conn.db.codebases (NOT codebases_map, NOT codbeaseMaps)
// Indexes (verbatim names):
//   codebase_map_project_id → filter by projectId
//   codebase_map_doc_type   → filter by docType (avoid without project scope)
//   id                      → filter by id (unique constraint)

// Get all maps for a project:
const rows = [...conn.db.codebases.codebase_map_project_id.filter(project.id)];

// Get specific type for a project:
const rows = [...conn.db.codebases.codebase_map_project_id.filter(project.id)]
  .filter(row => row.docType === 'stack');
```

### waitForUpsert pattern (from write-session.ts — analogous upsert)
```typescript
// Source: Verified from write-session.ts (upsertSessionCheckpoint same pattern)
function waitForUpsert(
  conn: DbConnection,
  projectId: bigint,
  docType: string,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Codebase map upsert timed out'));
    }, timeoutMs);
    const done = () => { clearTimeout(timer); resolve(); };
    conn.db.codebases.onInsert((_ctx: any, row: any) => {
      if (row.projectId === projectId && row.docType === docType) done();
    });
    conn.db.codebases.onUpdate((_ctx: any, _oldRow: any, newRow: any) => {
      if (newRow.projectId === projectId && newRow.docType === docType) done();
    });
  });
}
```

### read-codebase-content from file (from write-milestone.ts pattern)
```typescript
// Source: Verified from write-milestone.ts and write-plan.ts
import { readFileSync } from 'node:fs';

let content: string;
if (options.file) {
  content = readFileSync(options.file as string, 'utf-8');
} else if (options.content) {
  content = options.content as string;
} else {
  throw new CliError(ErrorCodes.INVALID_ARGUMENT, 'Either --file or --content is required');
}
```

### Validate docType (7 fixed values)
```typescript
const VALID_DOC_TYPES = ['stack', 'integrations', 'architecture', 'structure', 'conventions', 'testing', 'concerns'] as const;
type DocType = typeof VALID_DOC_TYPES[number];

if (!VALID_DOC_TYPES.includes(options.type as DocType)) {
  throw new CliError(
    ErrorCodes.INVALID_ARGUMENT,
    `Invalid doc type "${options.type}". Valid types: ${VALID_DOC_TYPES.join(', ')}`
  );
}
```

### GSD mapper agent: write_documents step (patched version)
```bash
# Agent writes content to temp file then calls stclaude
# For STACK.md content:
cat > /tmp/codebase-stack.md << 'EOF'
[document content]
EOF
stclaude write-codebase-map --type stack --file /tmp/codebase-stack.md

# For INTEGRATIONS.md:
cat > /tmp/codebase-integrations.md << 'EOF'
[document content]
EOF
stclaude write-codebase-map --type integrations --file /tmp/codebase-integrations.md
```

### GSD map-codebase.md: check_existing step (patched version)
```bash
# Instead of: checking codebase_dir_exists from init JSON
# Use:
EXISTING=$(stclaude get-codebase-map --json 2>/dev/null)
# Parse JSON to check if maps exist; empty array [] = no maps, error = NOT_CONFIGURED
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Write .planning/codebase/*.md files | Store in SpacetimeDB codebase_map table | Phase 11 | No more file-based codebase docs; timestamps from DB; accessible without filesystem |
| init map-codebase reads filesystem for existing_maps | Workflow calls stclaude get-codebase-map directly | Phase 11 | gsd-tools.cjs unchanged; existing_maps from init JSON is filesystem-based and ignored after patch |

**Deprecated/outdated after Phase 11:**
- `.planning/codebase/` directory creation in map-codebase workflow
- `commit_codebase_map` step (no files to commit)
- `scan_for_secrets` step (content goes to DB, not files)
- `codebase_dir_exists` and `existing_maps` from init JSON (replaced by stclaude query)

## Open Questions

1. **How should gsd-codebase-mapper agent handle stclaude not configured?**
   - What we know: If SpacetimeDB not set up, stclaude commands fail with NOT_CONFIGURED error
   - What's unclear: Should mapper agent detect this and fail fast, or just let stclaude error?
   - Recommendation: Let stclaude error propagate; mapper returns partial confirmation noting the failure. Consistent with Phase 10 approach.

2. **Should write-codebase-map support stdin for content?**
   - What we know: `--file` and `--content` flags are the established pattern; stdin adds complexity
   - What's unclear: Mapper agents may need a convenient way to pipe heredoc content
   - Recommendation: Support `--file` and `--content`; mapper agent uses temp file approach with heredoc. Stdin not needed.

3. **What happens to existing .planning/codebase/ files?**
   - What we know: Project constraint says "No file-based fallback"
   - What's unclear: Do we delete .planning/codebase/ after migration?
   - Recommendation: Leave existing files untouched (consistent with Phase 10 approach for todos/debug). New runs go to DB.

4. **Should map-codebase.md still create_structure step (mkdir .planning/codebase)?**
   - What we know: After patch, no files go there
   - What's unclear: Is the directory needed for anything else?
   - Recommendation: Remove `create_structure` step entirely; directory no longer needed.

## Validation Architecture

No `nyquist_validation` in config.json (default: standard depth without explicit validation gate). Phase implements CLI commands following the same patterns verified in Phase 10.

## Sources

### Primary (HIGH confidence)
- `/src/module_bindings/upsert_codebase_map_reducer.ts` — Confirmed reducer args: `{ projectId: u64, docType: string, content: string }`
- `/src/module_bindings/codebases_table.ts` — Confirmed row shape: `{ id, projectId, docType, content, createdAt, updatedAt }`
- `/src/module_bindings/index.ts` — Confirmed table accessor `conn.db.codebases`, index names `codebase_map_project_id` and `codebase_map_doc_type`
- `/src/cli/commands/write-session.ts` — Verified upsert pattern (waitForUpsert with onInsert+onUpdate)
- `/src/cli/commands/get-debug.ts`, `list-todos.ts` — Verified read-only query pattern
- `~/.claude/get-shit-done/workflows/map-codebase.md` — Confirmed patch targets: `check_existing`, `create_structure`, `commit_codebase_map`, `scan_for_secrets`, `offer_next` steps
- `~/.claude/agents/gsd-codebase-mapper.md` — Confirmed patch target: `write_documents` step (currently uses Write tool)
- `~/.claude/get-shit-done/bin/lib/init.cjs:cmdInitMapCodebase` — Confirmed filesystem-based init; NOT to be modified

### Secondary (MEDIUM confidence)
- Phase 10 research patterns for GSD surgical patch approach (verified against Phase 9 plan pattern)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all patterns verified in existing code
- Architecture: HIGH — reducer signatures, table accessors, and index names all verified from module_bindings
- Pitfalls: HIGH — derived from confirmed binding names and workflow file analysis
- GSD patch approach: HIGH — map-codebase.md and gsd-codebase-mapper.md both read and analyzed

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable — SpacetimeDB bindings don't change without regeneration)
