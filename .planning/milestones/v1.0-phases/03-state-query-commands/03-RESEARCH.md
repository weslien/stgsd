# Phase 3: State & Query Commands - Research

**Researched:** 2026-03-03
**Domain:** CLI command implementation — reading/writing SpacetimeDB state, querying phases/plans/roadmap
**Confidence:** HIGH

## Summary

Phase 3 adds five CLI command groups to the existing `stclaude` CLI skeleton built in Phase 2: an enhanced `get-state` (CLI-01), state mutation commands (CLI-02), `get-phase` (CLI-08), `read-plan` (CLI-06), and `roadmap analyze` (CLI-09). All infrastructure needed to implement these commands already exists: Commander.js program with `--json` flag, `withConnection()` helper, `outputSuccess()`/`outputError()` helpers, BigInt-safe JSON serialization, git remote URL resolution, and a full set of generated module bindings with reducer call types for all 13 SpacetimeDB tables.

The implementation is primarily a "wiring" exercise: each command connects via `withConnection()`, queries data from the client-side table cache (populated by `subscribeToAllTables()`), and returns structured results through the output helper. Mutation commands call reducers via `conn.reducers.reducerName({ ... })` with object syntax, then wait for the subscription to reflect the change before returning. The main technical challenge is ensuring mutation commands reliably confirm that changes propagated before returning output.

**Primary recommendation:** Follow the established pattern from `status.ts` for all read commands. For mutation commands, use SpacetimeDB's `onUpdate`/`onInsert` table callbacks to confirm writes before resolving. Add new error codes for common failure modes (PHASE_NOT_FOUND, PLAN_NOT_FOUND, INVALID_ARGUMENT).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLI-01 | `stclaude get-state` returns current project state (position, metrics, last activity) | Enhance existing default status command with velocity_data, session continuity, and richer metrics. All data already available from project_state table. |
| CLI-02 | `stclaude advance-plan` / `update-progress` / `record-metric` state mutations | Call `upsert_project_state` reducer via `conn.reducers.upsertProjectState({...})`. Use table callbacks to confirm write. |
| CLI-06 | `stclaude read-plan <phase> <plan>` returns plan content | Query phase table by number, then plan table by phase_id + plan_number. Return plan.content field plus metadata. |
| CLI-08 | `stclaude get-phase <number>` returns phase details | Query phase by number, include linked plans, requirements, success_criteria. All data in client cache after subscribeToAllTables. |
| CLI-09 | `stclaude roadmap analyze` returns phase overview with status | Iterate all phases for the project, aggregate plan counts and statuses, return structured overview. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| commander | ^14.0.3 | CLI framework, subcommand routing | Already installed in Phase 2, handles argument parsing and help |
| spacetimedb | ^2.0.2 | SpacetimeDB TypeScript SDK, client-side table cache + reducer calls | Already installed, provides DbConnection, table iteration, reducer calls |
| esbuild | ^0.24.0 | Bundle CLI to single .mjs file | Already installed, build:cli script established |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| node:child_process | built-in | Git remote URL detection | Already used by git.ts helper |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Commander.js subcommands | yargs | Commander already installed and wired; switching adds no value |
| subscribeToAllTables | Selective SQL subscriptions | Data volume is tiny (~50 rows); selective subscriptions add complexity for no performance gain |

**Installation:**
No new dependencies needed. All libraries already installed in Phase 2.

## Architecture Patterns

### Recommended Project Structure
```
spacetimeclaude/src/cli/
├── index.ts                    # Commander program, registers all commands
├── commands/
│   ├── status.ts               # Default command (existing, enhanced for CLI-01)
│   ├── get-state.ts            # get-state subcommand (CLI-01)
│   ├── advance-plan.ts         # advance-plan subcommand (CLI-02)
│   ├── update-progress.ts      # update-progress subcommand (CLI-02)
│   ├── record-metric.ts        # record-metric subcommand (CLI-02)
│   ├── get-phase.ts            # get-phase subcommand (CLI-08)
│   ├── read-plan.ts            # read-plan subcommand (CLI-06)
│   └── roadmap.ts              # roadmap analyze subcommand (CLI-09)
└── lib/
    ├── connection.ts           # withConnection() helper (existing)
    ├── errors.ts               # CliError + ErrorCodes (existing, extend)
    ├── git.ts                  # getGitRemoteUrl() (existing)
    ├── output.ts               # outputSuccess/outputError (existing)
    └── project.ts              # NEW: findProject() shared helper
```

### Pattern 1: Read Command Pattern (for get-state, get-phase, read-plan, roadmap)
**What:** Each read command follows the same connect-query-output flow established by `status.ts`.
**When to use:** Any command that only reads data from SpacetimeDB.
**Example:**
```typescript
// Source: existing spacetimeclaude/src/cli/commands/status.ts pattern
export function registerGetPhaseCommand(program: Command): void {
  program
    .command('get-phase <number>')
    .description('Get phase details by number')
    .action(async (phaseNumber: string) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();
        const data = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          // Query tables from client cache...
          return { /* structured result */ };
        });
        outputSuccess(data, opts, formatPhase);
        process.exit(0);
      } catch (err) {
        if (err instanceof CliError) {
          outputError(err.code, err.message, opts);
        } else {
          outputError(ErrorCodes.INTERNAL_ERROR, String(err), opts);
        }
      }
    });
}
```

### Pattern 2: Mutation Command Pattern (for advance-plan, update-progress, record-metric)
**What:** Mutation commands call a reducer then confirm the write propagated to the local cache before returning.
**When to use:** Any command that modifies SpacetimeDB state.
**Example:**
```typescript
// Source: SpacetimeDB SDK v2 patterns from CLAUDE.md
export function registerAdvancePlanCommand(program: Command): void {
  program
    .command('advance-plan')
    .description('Advance to the next plan in the current phase')
    .action(async () => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();
        const data = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const state = findProjectState(conn, project.id);

          // Compute new state values
          const newPlan = state.currentPlan + 1n;

          // Call reducer with object syntax
          conn.reducers.upsertProjectState({
            projectId: project.id,
            currentPhase: state.currentPhase,
            currentPlan: newPlan,
            currentTask: 0n,
            lastActivityDescription: `Advanced to plan ${newPlan}`,
            velocityData: state.velocityData,
            sessionLast: state.sessionLast,
            sessionStoppedAt: state.sessionStoppedAt,
            sessionResumeFile: '',
          });

          // Wait for subscription update to confirm write
          return await waitForStateUpdate(conn, project.id);
        });
        outputSuccess(data, opts, formatState);
        process.exit(0);
      } catch (err) {
        // standard error handling
      }
    });
}
```

### Pattern 3: Shared Project Resolution Helper
**What:** Extract the repeated "find project by git remote" pattern into a reusable helper.
**When to use:** Every command needs project resolution; extracting avoids duplication across 7+ command files.
**Example:**
```typescript
// Source: factored from existing status.ts
export function findProjectByGitRemote(
  conn: DbConnection,
  gitRemoteUrl: string,
): { id: bigint; name: string; /* ... */ } {
  for (const row of conn.db.project.iter()) {
    if (row.gitRemoteUrl === gitRemoteUrl) {
      return row;
    }
  }
  throw new CliError(
    ErrorCodes.PROJECT_NOT_FOUND,
    `No project found for git remote: ${gitRemoteUrl}`,
  );
}
```

### Pattern 4: Phase/Plan Lookup by Number
**What:** Query phase by its `number` string field (e.g., "3") relative to a project, and plan by `planNumber` (bigint) relative to a phase.
**When to use:** `get-phase`, `read-plan`, and internal lookups.
**Example:**
```typescript
// Phases have string numbers (support decimals like "2.1")
function findPhaseByNumber(conn: DbConnection, projectId: bigint, number: string) {
  for (const row of conn.db.phase.iter()) {
    if (row.projectId === projectId && row.number === number) {
      return row;
    }
  }
  throw new CliError(ErrorCodes.PHASE_NOT_FOUND, `Phase ${number} not found`);
}

// Plans have bigint plan_number
function findPlanByNumber(conn: DbConnection, phaseId: bigint, planNumber: bigint) {
  for (const row of conn.db.plan.iter()) {
    if (row.phaseId === phaseId && row.planNumber === planNumber) {
      return row;
    }
  }
  throw new CliError(ErrorCodes.PLAN_NOT_FOUND, `Plan ${planNumber} not found`);
}
```

### Anti-Patterns to Avoid
- **Calling reducers with positional args:** Always use `conn.reducers.reducerName({ key: value })` object syntax, never `conn.reducers.reducerName(value)`.
- **Forgetting BigInt literals:** All u64 fields use BigInt. Comparisons must use `=== 5n` not `=== 5`. Parse CLI string args with `BigInt(arg)`.
- **Hanging process after output:** Always call `process.exit(0)` after `outputSuccess()`. The SpacetimeDB SDK keeps internal handles alive that prevent natural Node.js exit.
- **Editing generated module_bindings:** These are generated artifacts from `spacetime generate`. Never modify directly.
- **Using `conn.db.table.id.find()` for non-PK lookups:** Use `.iter()` + manual filter for non-indexed lookups. The only PK lookups available are on the `id` column.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| BigInt JSON serialization | Custom JSON.stringify wrapper | Existing `bigintReplacer` in output.ts | Already solved, handles all BigInt fields |
| CLI argument parsing | Manual process.argv parsing | Commander.js `.command().argument().option()` | Handles help, validation, subcommand routing |
| SpacetimeDB connection lifecycle | Manual WebSocket management | `withConnection()` helper | Connect-subscribe-callback-disconnect pattern already proven |
| Project identity resolution | Manual config file | `getGitRemoteUrl()` + project table lookup | Already established pattern, automatic |

**Key insight:** Phase 2 already solved every infrastructure problem. Phase 3 is purely wiring commands to existing helpers and data.

## Common Pitfalls

### Pitfall 1: Reducer Calls Are Fire-and-Forget on the Client
**What goes wrong:** Calling `conn.reducers.upsertProjectState({...})` and immediately reading `conn.db.projectState.iter()` returns stale data because the reducer hasn't round-tripped through the server yet.
**Why it happens:** SpacetimeDB reducers are transactional on the server. The client sends the reducer call over WebSocket. The server processes it and pushes subscription updates. There's a delay between calling the reducer and seeing the result in the local cache.
**How to avoid:** For mutation commands, either (a) use `conn.db.projectState.onUpdate()` callback to wait for the change, or (b) construct the expected result optimistically from the inputs you sent. Option (a) is more reliable. Set a timeout to avoid hanging if the reducer fails server-side.
**Warning signs:** Mutation command returns old data, or returns null for a field that should have been updated.

### Pitfall 2: Phase Numbers Are Strings, Not Integers
**What goes wrong:** Comparing phase numbers with `===` against integer values, or trying to sort them numerically.
**Why it happens:** Phase numbers support decimals (e.g., "2.1" for inserted phases). They're stored as strings in the schema.
**How to avoid:** Always compare as strings. When sorting, parse with `parseFloat()`. When accepting from CLI args, keep as string.
**Warning signs:** Phase "2.1" not found even though it exists in the database.

### Pitfall 3: Process Hangs After Output
**What goes wrong:** The CLI appears to complete but the process never exits, blocking the calling agent.
**Why it happens:** SpacetimeDB SDK maintains WebSocket connections and internal timers. Node.js won't exit while these handles are alive.
**How to avoid:** Always call `process.exit(0)` after `outputSuccess()` in every command action. Already established in status.ts but must be replicated in every new command.
**Warning signs:** Agent hangs waiting for stclaude to exit.

### Pitfall 4: Optional Fields and BigInt Zero
**What goes wrong:** Passing `0n` for optional BigInt fields or empty string for optional string fields, accidentally overwriting real values.
**Why it happens:** The upsert_project_state reducer replaces ALL fields. If you pass empty/zero for fields you don't intend to change, you wipe the existing values.
**How to avoid:** For upsert-pattern mutations, always read the current state first, spread existing values, then override only the changed fields. This is the same update pattern used server-side (`{ ...existing, ...newFields }`).
**Warning signs:** Running `advance-plan` zeroes out velocity_data because it wasn't passed through.

### Pitfall 5: Error Code Consistency
**What goes wrong:** New commands use different error code formats or missing error codes, making agent error handling unreliable.
**Why it happens:** Each command file implements its own error handling without referencing the central ErrorCodes object.
**How to avoid:** Extend ErrorCodes in errors.ts with new codes (PHASE_NOT_FOUND, PLAN_NOT_FOUND, INVALID_ARGUMENT) before implementing commands. All commands reference ErrorCodes constants.
**Warning signs:** Agent receives error without a parseable code, can't determine failure mode.

## Code Examples

Verified patterns from the existing codebase:

### Commander.js Subcommand Registration
```typescript
// Source: Commander.js v14 API, verified in existing cli/index.ts
program
  .command('get-state')
  .description('Get current project state')
  .action(async () => { /* ... */ });

// With required argument
program
  .command('get-phase <number>')
  .description('Get phase details by number')
  .action(async (number: string) => { /* ... */ });

// With two required arguments
program
  .command('read-plan <phase> <plan>')
  .description('Read plan content')
  .action(async (phase: string, plan: string) => { /* ... */ });

// Nested subcommand group
const roadmapCmd = program
  .command('roadmap')
  .description('Roadmap operations');
roadmapCmd
  .command('analyze')
  .description('Analyze roadmap status')
  .action(async () => { /* ... */ });
```

### Reading Data from SpacetimeDB Client Cache
```typescript
// Source: existing status.ts pattern
// After subscribeToAllTables() onApplied fires, all data is in conn.db

// Iterate all rows (small dataset, no performance concern)
for (const row of conn.db.phase.iter()) {
  if (row.projectId === projectId) {
    // row.id (bigint), row.number (string), row.name (string), etc.
  }
}

// Collect into array
const plans = [];
for (const row of conn.db.plan.iter()) {
  if (row.phaseId === phaseId) {
    plans.push(row);
  }
}
```

### Calling Reducers (Mutation)
```typescript
// Source: SpacetimeDB SDK v2 CLAUDE.md - object syntax required
conn.reducers.upsertProjectState({
  projectId: project.id,          // bigint
  currentPhase: '3',              // string
  currentPlan: 2n,                // bigint
  currentTask: 0n,                // bigint
  lastActivityDescription: 'Advanced to plan 2',
  velocityData: existingState.velocityData,
  sessionLast: new Date().toISOString().slice(0, 10),
  sessionStoppedAt: existingState.sessionStoppedAt,
  sessionResumeFile: '',          // empty string for no resume
});
```

### Waiting for Reducer Confirmation
```typescript
// Source: SpacetimeDB SDK v2 subscription callback pattern
function waitForStateUpdate(
  conn: DbConnection,
  projectId: bigint,
  timeoutMs = 5000,
): Promise<ProjectStateRow> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'State update timed out'));
    }, timeoutMs);

    conn.db.projectState.onUpdate((_ctx, _oldRow, newRow) => {
      if (newRow.projectId === projectId) {
        clearTimeout(timer);
        resolve(newRow);
      }
    });
  });
}
```

### Timestamp Formatting (Client-Side)
```typescript
// Source: existing status.ts and SpacetimeDB SDK docs
// Timestamp objects have .microsSinceUnixEpoch (bigint)
const lastActivityMs = Number(state.lastActivity.microsSinceUnixEpoch / 1000n);
const lastActivityDate = new Date(lastActivityMs).toISOString().slice(0, 10);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| File-based STATE.md | SpacetimeDB project_state table | Phase 1 (this project) | State mutations become atomic, queryable |
| `gsd-tools.cjs` state operations | `stclaude` CLI commands | Phase 3 (this phase) | Agents get structured JSON instead of parsing markdown |
| Parsing ROADMAP.md for phase info | Querying phase/plan tables | Phase 3 (this phase) | No more markdown parsing, structured data |

**Deprecated/outdated:**
- SpacetimeDB SDK v1 patterns (name-based reducers, positional args): v2 uses export-named reducers + object syntax
- `subscribeToAll()` without args: v2.0.2 uses `subscribeToAllTables()` method name

## Open Questions

1. **How should `advance-plan` determine the "next" plan?**
   - What we know: Plans have `planNumber` (bigint) field. Advancing means incrementing currentPlan in project_state. But we need to know the max plan count for the current phase to detect phase completion.
   - What's unclear: Should advance-plan also handle phase transitions (e.g., if all plans in phase N are done, advance to phase N+1)? Or is that a separate concern for the orchestration layer?
   - Recommendation: Keep `advance-plan` focused on incrementing the plan number. Phase transitions can be handled by agents calling `update-progress` to change the current_phase field. Document the separation of concerns.

2. **What does `update-progress` do vs `advance-plan`?**
   - What we know: The success criteria says "advance-plan, update-progress, and record-metric successfully mutate state." These seem like three distinct mutation operations.
   - What's unclear: The exact semantics of `update-progress` vs `advance-plan`. One advances the plan pointer; what does the other update?
   - Recommendation: `advance-plan` increments current_plan (and optionally current_phase). `update-progress` is a more general upsert that can set any combination of project_state fields (current_phase, current_plan, current_task, last_activity_description, session fields). `record-metric` specifically updates velocity_data JSON.

3. **Should `get-state` be a separate subcommand or keep enhancing the default action?**
   - What we know: CLI-01 specifies `stclaude get-state`. The existing default (bare `stclaude`) already shows basic status.
   - What's unclear: Should the default command AND `get-state` subcommand coexist?
   - Recommendation: Create `get-state` as an explicit subcommand with richer output (velocity data, session info). Keep the bare `stclaude` default as a simplified status view. Both read the same data but format differently. Alternatively, the bare command could just alias to get-state.

4. **How should `roadmap analyze` compute phase statuses?**
   - What we know: Phase records have a `status` field. Plan records have a `status` field. Requirements have a `status` field.
   - What's unclear: Should the roadmap command compute status from actual plan completion counts, or just read the stored status string?
   - Recommendation: Return both the stored status AND computed plan completion metrics. This lets agents verify consistency. Format: `{ phases: [{ number, name, status, plans: { total, completed }, requirements: { total, completed } }] }`.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new libraries, everything already installed and proven in Phase 2
- Architecture: HIGH - patterns established in status.ts, straightforward extension
- Pitfalls: HIGH - based on direct observation of the codebase and SpacetimeDB SDK v2 behavior documented in CLAUDE.md

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (stable — no external dependencies changing)

## Sources

### Primary (HIGH confidence)
- Existing codebase: `spacetimeclaude/src/cli/` — established patterns for connection, output, error handling
- Existing codebase: `spacetimeclaude/src/module_bindings/` — generated types confirming exact field names and types
- Existing codebase: `spacetimeclaude/spacetimedb/src/schema.ts` — server-side table definitions
- Existing codebase: `spacetimeclaude/spacetimedb/src/index.ts` — all reducer signatures and parameter types
- `spacetimeclaude/CLAUDE.md` — SpacetimeDB SDK v2 patterns, common mistakes, correct usage

### Secondary (MEDIUM confidence)
- Commander.js v14 API — subcommand registration, argument handling (well-documented, stable API)

### Tertiary (LOW confidence)
- None — all findings are from primary codebase inspection
