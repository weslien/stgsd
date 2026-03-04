# Phase 08: Milestone Lifecycle - Research

**Researched:** 2026-03-04
**Domain:** CLI command authoring, SpacetimeDB TypeScript client, GSD workflow patching
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MILE-04 (R04) | CLI command `stclaude write-milestone` persists milestone completion data | SpacetimeDB reducers `insert_milestone` and `insert_milestone_audit` are live; CLI pattern is write-research/write-verification; `--content-file` pattern from write-context/write-plan handles large content |
| MILE-05 (R05) | CLI command `stclaude get-milestones` returns milestone history for a project | SpacetimeDB `milestone` and `milestone_audit` tables are live; read-only query pattern established by get-phase/roadmap analyze; `conn.db.milestone.iter()` for table scan |
| MILE-06 (R06) | CLI command `stclaude write-audit` persists audit report with gap details | SpacetimeDB reducer `insert_milestone_audit` is live; content fields are string blobs — audit content stored as JSON or raw text in the appropriate columns |
| MILE-07 (R07) | GSD patch for complete-milestone workflow replacing MILESTONES.md and archive file writes with stclaude calls | complete-milestone.md writes to `.planning/milestones/` files; patch replaces `milestone complete` CLI tool call and file writes with `stclaude write-milestone` + `stclaude write-audit` (archive content) |
| MILE-08 (R08) | GSD patch for audit-milestone workflow replacing audit report file writes with stclaude calls | audit-milestone.md writes to `.planning/v{version}-MILESTONE-AUDIT.md`; patch replaces this write with `stclaude write-audit` |
| MILE-09 (R09) | GSD patch for new-milestone workflow replacing MILESTONES.md reads with stclaude calls | new-milestone.md reads MILESTONES.md to determine last version and last phase number; patch replaces read with `stclaude get-milestones --json` |
</phase_requirements>

## Summary

Phase 8 adds three CLI commands (`write-milestone`, `write-audit`, `get-milestones`) and patches three GSD workflow files (`complete-milestone.md`, `audit-milestone.md`, `new-milestone.md`). The schema work is complete from Phase 7 — all required tables (`milestone`, `milestone_audit`) and reducers (`insert_milestone`, `insert_milestone_audit`, `update_milestone`, `delete_milestone`, etc.) are already in `spacetimedb/src/index.ts`. The module has been published and bindings regenerated.

The CLI layer follows a fully established pattern: every write command wraps `withConnection`, resolves project by git remote URL, calls the appropriate reducer via `conn.reducers.{reducerName}({...})`, waits for insert confirmation via `table.onInsert`, then returns structured output. Read commands follow a simpler pattern: no `waitForInsert`, just iterate `conn.db.{table}.iter()` and collect matching rows. Both patterns are well-established in the codebase.

The GSD workflow patches are surgical edits to three markdown files. The key insight is that the workflows already use `gsd-tools milestone complete` (a gsd-tools CLI command that writes files). Phase 8 replaces those file-system operations with `stclaude` CLI calls. The GSD workflows do not need major restructuring — only specific steps that read/write MILESTONES.md or the audit file are replaced.

**Primary recommendation:** Copy the `write-research.ts` / `write-context.ts` / `write-verification.ts` command pattern verbatim for all three new CLI commands. The `--content-file` option from `write-context.ts` is needed for `write-milestone` (accomplishments can be long) and `write-audit` (audit content is large). After adding commands, regenerate bindings and patch the three GSD workflows.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| spacetimedb | ^2.0.2 | TypeScript server SDK + client bindings | Project constraint — already installed |
| commander | ^12.x | CLI argument parsing | Already in use across all command files |
| node:fs | built-in | `readFileSync` for `--content-file` | Used in write-context.ts and write-plan.ts |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| spacetime CLI | system | `spacetime generate` for client bindings | After any schema/reducer changes — but Phase 8 adds NO new schema, only new CLI commands and GSD patches |

### Alternatives Considered
None — all patterns are established in the codebase.

**Installation:**
No new packages needed. All dependencies already present.

## Architecture Patterns

### Recommended Project Structure
```
src/cli/
├── commands/
│   ├── write-milestone.ts   ← NEW
│   ├── write-audit.ts       ← NEW
│   └── get-milestones.ts    ← NEW
├── index.ts                 ← EDIT: add 3 new command registrations
└── lib/
    └── (no changes needed)
```

No SpacetimeDB schema changes. No new tables or reducers. The Phase 7 work is the foundation.

### Pattern 1: Write Command (insert with confirmation)
**What:** Call a reducer, wait for insert via `onInsert` callback, return structured success data.
**When to use:** `write-milestone`, `write-audit`
**Example:**
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/cli/commands/write-research.ts
function waitForInsert(
  _conn: DbConnection,
  table: { onInsert: (cb: (_ctx: any, row: any) => void) => void },
  matchFn: (row: any) => boolean,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Insert confirmation timed out after 5 seconds'));
    }, timeoutMs);
    table.onInsert((_ctx: any, row: any) => {
      if (matchFn(row)) { clearTimeout(timer); resolve(); }
    });
  });
}

// In command action:
const project = findProjectByGitRemote(conn, gitRemoteUrl);
const insertPromise = waitForInsert(conn, conn.db.milestone, (row) => row.projectId === project.id);
conn.reducers.insertMilestone({ projectId: project.id, version: options.version, ... });
await insertPromise;
```

### Pattern 2: Read Command (iterate + filter)
**What:** Iterate table rows, filter by project ID, return structured array.
**When to use:** `get-milestones`
**Example:**
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/cli/commands/get-phase.ts (adapted)
const milestones: MilestoneRow[] = [];
for (const row of conn.db.milestone.iter()) {
  if (row.projectId === project.id) {
    milestones.push({ ... });
  }
}
// Sort by shipped_date descending (or by created_at)
milestones.sort((a, b) => b.shippedDate.localeCompare(a.shippedDate));
return milestones;
```

### Pattern 3: --content-file Option
**What:** Accept large content as either inline `--content` string or a path to a file via `--content-file`.
**When to use:** `write-milestone` (accomplishments list), `write-audit` (full audit report content)
**Example:**
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/cli/commands/write-context.ts
import { readFileSync } from 'node:fs';

let contentValue = options.content ?? '';
if (options.contentFile) {
  try {
    contentValue = readFileSync(options.contentFile, 'utf-8');
  } catch (err) {
    throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Could not read content file: ${options.contentFile} - ${err}`);
  }
}
if (!contentValue) {
  throw new CliError(ErrorCodes.INVALID_ARGUMENT, 'Either --content or --content-file is required');
}
```

### Pattern 4: GSD Workflow Step Replacement
**What:** Replace a `gsd-tools milestone complete` or file-write step in a GSD workflow markdown file with `stclaude` calls.
**When to use:** Patching complete-milestone.md, audit-milestone.md, new-milestone.md
**Key principle:** Replace only the specific step(s) that perform file I/O. Keep all surrounding logic, prompts, and conditional flow identical.

### Pattern 5: camelCase Reducer Parameter Names (CRITICAL)
**What:** SpacetimeDB TypeScript SDK converts snake_case server reducer params to camelCase in generated client bindings.
**When to use:** Every `conn.reducers.X({...})` call.
**Example:**
```typescript
// Server reducer: insert_milestone(project_id, version, shipped_date, ...)
// Client call: conn.reducers.insertMilestone({ projectId: ..., version: ..., shippedDate: ..., ... })

// Server reducer: insert_milestone_audit(project_id, milestone_id, audit_status, ...)
// Client call: conn.reducers.insertMilestoneAudit({ projectId: ..., milestoneId: ..., auditStatus: ..., ... })
```

### Pattern 6: BigInt for u64 Fields
**What:** All `t.u64()` schema fields use JavaScript `bigint` in the client bindings.
**When to use:** `phaseCount`, `planCount`, `requirementCount` in insert_milestone.
**Example:**
```typescript
conn.reducers.insertMilestone({
  projectId: project.id,        // bigint
  version: options.version,     // string
  phaseCount: BigInt(options.phaseCount),  // must convert from CLI string
  planCount: BigInt(options.planCount),
  requirementCount: BigInt(options.requirementCount),
  ...
});
```

### Pattern 7: Milestone-to-MilestoneAudit Linkage
**What:** `write-audit` must find the milestone row first (by project + version), then call `insertMilestoneAudit` with the milestone's ID.
**When to use:** `write-audit` command implementation.
**Example:**
```typescript
// Find milestone by version first
let targetMilestone: { id: bigint; ... } | undefined;
for (const row of conn.db.milestone.iter()) {
  if (row.projectId === project.id && row.version === options.version) {
    targetMilestone = row;
    break;
  }
}
if (!targetMilestone) throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Milestone ${options.version} not found`);

// Then insert audit with the found milestone ID
const insertPromise = waitForInsert(conn, conn.db.milestoneAudit, (row) => row.milestoneId === targetMilestone.id);
conn.reducers.insertMilestoneAudit({
  projectId: project.id,
  milestoneId: targetMilestone.id,
  ...
});
```

### Anti-Patterns to Avoid
- **positional reducer args:** `conn.reducers.insertMilestone('v1.0', 'name')` is WRONG — always use object syntax `{ version: 'v1.0', name: 'name' }`
- **Missing waitForInsert:** Don't call reducer and immediately resolve — the SpacetimeDB client is async; without the `onInsert` listener the write may not be confirmed
- **Listener after reducer call:** Register `onInsert` BEFORE calling the reducer. The response can arrive before the `.then()` chain runs
- **String instead of BigInt for u64 fields:** Phase 7 tables have `phase_count: t.u64()` etc — must use `BigInt(...)` when passing from CLI number options
- **conn.db.X.filter() not conn.db.X.iter():** The CLI uses subscribeToAllTables then iterates — using index-based filter vs iter both work, but iter() is the established pattern in existing commands
- **Forgetting to register command in index.ts:** Each new command file must be imported and registered in `src/cli/index.ts`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content too large for CLI arg | Custom base64 or split approach | `--content-file <path>` + `readFileSync` | Already established in write-context.ts and write-plan.ts |
| Finding milestone by version | Custom query API | `conn.db.milestone.iter()` + manual filter | Multi-column index filters are broken; iter + filter is the correct pattern |
| BigInt conversion from CLI options | Parse manually | `BigInt(options.someNumber)` | Simple and direct; handles both integer strings and bigint literals |
| GSD workflow integration test | Mock SpacetimeDB | Manual end-to-end test against running server | No test infrastructure in this project; verification is done live |

**Key insight:** The CLI layer is intentionally thin — all it does is validate inputs, call reducers, and format output. Business logic stays in the GSD workflow markdown files and the SpacetimeDB reducers.

## Common Pitfalls

### Pitfall 1: Module Bindings Not Regenerated
**What goes wrong:** Phase 7 added new tables and reducers but the `src/module_bindings/` directory still has the old generated bindings (confirmed: no milestone_table.ts, insert_milestone_reducer.ts etc in current bindings list).
**Why it happens:** The spacetime generate step must be run explicitly after publishing the new module.
**How to avoid:** BEFORE writing any CLI command code, run `spacetime generate --lang typescript --out-dir spacetimeclaude/src/module_bindings --module-path spacetimedb`. Verify new table files appear (milestone_table.ts, milestone_audit_table.ts, etc.)
**Warning signs:** TypeScript compilation errors referencing `conn.db.milestone` or `conn.reducers.insertMilestone` as non-existent.

### Pitfall 2: upsert vs insert for milestone_audit
**What goes wrong:** The `complete-milestone` workflow might call both `write-milestone` and `write-audit` in sequence. If `write-audit` is called twice for the same milestone (e.g., re-run), it inserts a second audit record instead of updating.
**Why it happens:** `insert_milestone_audit` always inserts. There is no upsert reducer for milestone_audit.
**How to avoid:** The `write-audit` command should check if a milestone_audit already exists for this milestone_id and either (a) fail with a clear error, or (b) call `update_milestone_audit` instead. The simpler approach: fail with "audit already exists for milestone {version}, use --force to overwrite" and implement `--force` as update.
**Warning signs:** Multiple audit rows for the same milestone_id after repeated workflow runs.

### Pitfall 3: GSD Workflow Patch Scope Creep
**What goes wrong:** When patching `complete-milestone.md`, the developer replaces too much — accidentally removing important logic like PROJECT.md evolution review, ROADMAP.md reorganization, or git tagging.
**Why it happens:** The workflow is long (740 lines) and the file-write steps are embedded inside multi-step processes.
**How to avoid:** Phase 8 ONLY replaces the specific sub-steps that write MILESTONES.md or archive files. The `gsd-tools milestone complete` call in `archive_milestone` step and the `create_milestone_entry` note are the targets. All other steps remain unchanged.
**Warning signs:** Workflow loses steps that were previously present.

### Pitfall 4: new-milestone.md Reads MILESTONES.md for Last Phase Number
**What goes wrong:** `new-milestone.md` step 10 says "Starting phase number: Read MILESTONES.md for last phase number." If MILESTONES.md is no longer written (replaced by SpacetimeDB), this read fails silently and the roadmapper starts numbering from 1.
**Why it happens:** The workflow reads MILESTONES.md in plain text to extract the last phase number from the shipped milestone section.
**How to avoid:** The patch must replace this specific read with `stclaude get-milestones --json` and parse the `phases` array from the result to find the maximum phase number from all shipped milestones.
**Warning signs:** New milestone roadmap starts with Phase 1 instead of continuing from where the last milestone left off.

### Pitfall 5: Missing MILESTONE_NOT_FOUND Error Code
**What goes wrong:** `write-audit` needs to look up a milestone by version. If not found, it should throw a clear error. Using `ErrorCodes.INTERNAL_ERROR` for this is misleading.
**Why it happens:** The existing `ErrorCodes` object doesn't have a `MILESTONE_NOT_FOUND` code.
**How to avoid:** Add `MILESTONE_NOT_FOUND: 'MILESTONE_NOT_FOUND'` to `src/cli/lib/errors.ts`. This follows the existing `PLAN_NOT_FOUND`, `PHASE_NOT_FOUND` pattern.
**Warning signs:** Error messages say "Internal error" when the real issue is a missing milestone.

### Pitfall 6: write-milestone and write-audit Called Separately vs Together
**What goes wrong:** The complete-milestone workflow currently calls `gsd-tools milestone complete` which atomically writes MILESTONES.md AND archives roadmap/requirements in one operation. Phase 8 must split this into two separate `stclaude` calls — first `write-milestone`, then `write-audit`. The milestone row must exist before `write-audit` can create a milestone_audit row (because milestone_audit.milestone_id is a FK).
**Why it happens:** Schema enforces FK: `insert_milestone_audit` validates `milestone_id` exists before inserting.
**How to avoid:** Patch `complete-milestone.md` to call `write-milestone` first, capture the milestone version from output, then call `write-audit` with that version. The order is: milestone → audit.
**Warning signs:** `write-audit` fails with "Milestone {version} not found" if called before `write-milestone`.

## Code Examples

Verified patterns from the actual codebase:

### Full Write Command Structure (from write-research.ts)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/cli/commands/write-research.ts
export function registerWriteResearchCommand(program: Command): void {
  program
    .command('write-research')
    .description('Persist phase research findings to SpacetimeDB')
    .requiredOption('--phase <phase>', 'Phase number')
    .requiredOption('--domain <domain>', 'Research domain')
    .requiredOption('--confidence <level>', 'Confidence level (HIGH/MEDIUM/LOW)')
    .requiredOption('--content <text>', 'Research content (prose)')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();
        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, options.phase);
          const insertPromise = waitForInsert(conn, conn.db.research, (row) => row.phaseId === phase.id);
          conn.reducers.insertResearch({ phaseId: phase.id, domain: options.domain, confidence: options.confidence, content: options.content });
          await insertPromise;
          return { phaseNumber: options.phase, domain: options.domain, confidence: options.confidence };
        });
        outputSuccess(result, opts, formatWriteResearch);
        process.exit(0);
      } catch (err) {
        if (err instanceof CliError) { outputError(err.code, err.message, opts); }
        else { outputError(ErrorCodes.INTERNAL_ERROR, String(err), opts); }
      }
    });
}
```

### Read Command Structure (from get-phase.ts)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/cli/commands/get-phase.ts
const phaseData = await withConnection((conn: DbConnection) => {
  const project = findProjectByGitRemote(conn, gitRemoteUrl);
  const results: ResultRow[] = [];
  for (const row of conn.db.someTable.iter()) {
    if (row.projectId === project.id) {
      results.push({ id: row.id, ... });
    }
  }
  return results;
});
outputSuccess(phaseData, opts, formatFn);
process.exit(0);
```

### Content-File Pattern (from write-context.ts)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/cli/commands/write-context.ts
import { readFileSync } from 'node:fs';
// ...
let contentValue = options.content ?? '';
if (options.contentFile) {
  try {
    contentValue = readFileSync(options.contentFile, 'utf-8');
  } catch (err) {
    throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Could not read content file: ${options.contentFile} - ${err}`);
  }
}
if (!contentValue) {
  throw new CliError(ErrorCodes.INVALID_ARGUMENT, 'Either --content or --content-file is required');
}
```

### Proposed write-milestone Command Signature
```bash
stclaude write-milestone \
  --version "v1.1" \
  --name "Full Coverage" \
  --shipped-date "2026-03-04" \
  --phase-count 5 \
  --plan-count 12 \
  --requirement-count 38 \
  --accomplishments '[{"text":"Added 6 new SpacetimeDB tables"},{"text":"CLI coverage for all v1.1 workflows"}]' \
  --status "shipped" \
  --json
```

### Proposed write-audit Command Signature
```bash
stclaude write-audit \
  --version "v1.1" \
  --audit-status "passed" \
  --requirement-scores '{"satisfied":38,"total":38}' \
  --integration-scores '{"passed":5,"total":5}' \
  --flow-scores '{"passed":3,"total":3}' \
  --tech-debt-items '[]' \
  --roadmap-content-file /tmp/v1.1-ROADMAP.md \
  --requirements-content-file /tmp/v1.1-REQUIREMENTS.md \
  --json
```

### Proposed get-milestones Command Signature
```bash
# Returns all milestones for current project
stclaude get-milestones --json

# Returns output like:
# {"ok":true,"data":[{"version":"v1.0","name":"Core Loop","shippedDate":"2026-03-04","phaseCount":"6","planCount":"15","status":"shipped","accomplishments":"[...]"},{"version":"v1.1",...}]}
```

### GSD Workflow Patch: audit-milestone.md (Step 6)
Before:
```markdown
## 6. Aggregate into v{version}-MILESTONE-AUDIT.md

Create `.planning/v{version}-v{version}-MILESTONE-AUDIT.md` with: ...
```

After:
```markdown
## 6. Persist Audit to SpacetimeDB

Write audit results to SpacetimeDB via stclaude:

\`\`\`bash
# Write roadmap and requirements content to temp files first
cat .planning/ROADMAP.md > /tmp/audit-roadmap.md
cat .planning/REQUIREMENTS.md > /tmp/audit-requirements.md

stclaude write-audit \
  --version "{version}" \
  --audit-status "{passed|gaps_found|tech_debt}" \
  --requirement-scores '{...}' \
  --integration-scores '{...}' \
  --flow-scores '{...}' \
  --tech-debt-items '[...]' \
  --roadmap-content-file /tmp/audit-roadmap.md \
  --requirements-content-file /tmp/audit-requirements.md \
  --json
\`\`\`

Verify: ok: true in output.
```

### GSD Workflow Patch: new-milestone.md (Step 10 — Starting Phase Number)
Before:
```markdown
**Starting phase number:** Read MILESTONES.md for last phase number.
```

After:
```markdown
**Starting phase number:** Query SpacetimeDB for last shipped milestone:

\`\`\`bash
MILESTONES=$(stclaude get-milestones --json)
# Parse last_phase_number from milestones array:
# Extract max phaseCount or find phase numbers from last milestone
\`\`\`

If no milestones exist (first milestone), start at phase 1.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Write MILESTONES.md via gsd-tools CLI | `stclaude write-milestone` → SpacetimeDB | Phase 8 | MILESTONES.md becomes optional / deprecated |
| Write audit to `.planning/v{X.Y}-MILESTONE-AUDIT.md` | `stclaude write-audit` → SpacetimeDB | Phase 8 | Audit file becomes optional / deprecated |
| Read MILESTONES.md for phase continuity | `stclaude get-milestones --json` | Phase 8 | Machine-readable, no parsing |
| SpacetimeDB 1.0 reducer callbacks | Event tables (2.0) | v2.0 SDK | Not relevant — all code already uses v2.0 |

**Note on MILESTONES.md:** The Phase 8 patch does NOT delete MILESTONES.md or stop writing it. The patch replaces the `gsd-tools milestone complete` call with `stclaude` calls. Whether to also write the file is a decision for the planner — the simplest approach is to use SpacetimeDB only (no file), aligned with the project decision "No file-based fallback."

## Open Questions

1. **Should write-milestone also update an existing milestone (upsert) or only insert?**
   - What we know: The milestone table has both `insert_milestone` and `update_milestone` reducers. The `complete-milestone` workflow runs once per version.
   - What's unclear: Whether the workflow might be re-run (e.g., to add accomplishments after the fact).
   - Recommendation: Write command performs insert. If milestone already exists for this version, fail with `MILESTONE_NOT_FOUND`-style error (actually `DUPLICATE_MILESTONE` or `ALREADY_EXISTS`). A `--force` flag can trigger update. Keep it simple for now — insert only.

2. **Does get-milestones need to return audit data inline?**
   - What we know: The requirement says "returns milestone history for a project." The `new-milestone.md` patch only needs phase count / last phase number from the milestone row itself.
   - What's unclear: Whether the GSD agent also needs audit scores when reading milestones.
   - Recommendation: Return milestones array only (not joined with audit). A separate `get-milestone-audit --version <v>` command can be added later if needed. Keep get-milestones focused on the use case: new-milestone needs version, shipped_date, phase_count, name.

3. **Does write-audit need to also write/update the milestone status to "shipped"?**
   - What we know: The milestone table has a `status` field. `write-milestone` would be called with whatever status is provided.
   - What's unclear: The workflow calls write-audit at milestone audit time (before complete), and write-milestone at complete time. Order may vary.
   - Recommendation: `write-milestone` accepts `status` as a required param. The GSD workflow sets it to "shipped" when calling write-milestone at completion. `write-audit` does not touch the milestone row's status.

## Validation Architecture

> workflow.nyquist_validation is not in config.json — skip this section.

## Sources

### Primary (HIGH confidence)
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/write-research.ts` — write command pattern
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/write-context.ts` — --content-file pattern
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/write-verification.ts` — BigInt handling pattern
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/get-phase.ts` — read command pattern
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/complete-phase.ts` — reducer call patterns
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/roadmap.ts` — multi-row read pattern
- `/Users/gustav/src/spacetimeclaude/src/cli/index.ts` — command registration pattern
- `/Users/gustav/src/spacetimeclaude/src/cli/lib/` — connection, project, output, errors helpers
- `/Users/gustav/src/spacetimeclaude/spacetimedb/src/index.ts` — all milestone/audit reducers (insert, update, delete — live in Phase 7)
- `/Users/gustav/src/spacetimeclaude/spacetimedb/src/schema.ts` — milestone + milestone_audit table definitions (live in Phase 7)
- `/Users/gustav/.claude/get-shit-done/workflows/complete-milestone.md` — GSD workflow to patch (MILE-07)
- `/Users/gustav/.claude/get-shit-done/workflows/audit-milestone.md` — GSD workflow to patch (MILE-08)
- `/Users/gustav/.claude/get-shit-done/workflows/new-milestone.md` — GSD workflow to patch (MILE-09)
- `/Users/gustav/src/spacetimeclaude/.planning/REQUIREMENTS.md` — requirement descriptions
- `/Users/gustav/src/spacetimeclaude/.planning/ROADMAP.md` — phase goals and success criteria

### Secondary (MEDIUM confidence)
- Project CLAUDE.md SpacetimeDB TypeScript SDK rules — verified against actual codebase patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all patterns directly readable from existing CLI source files
- Architecture: HIGH — no new patterns needed; all established in phases 1-7
- Pitfalls: HIGH — derived from code inspection + SpacetimeDB SDK constraints in CLAUDE.md
- GSD workflow patches: HIGH — all three workflows read directly, targeted step replacements identified

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable codebase, SpacetimeDB SDK won't change within month)
