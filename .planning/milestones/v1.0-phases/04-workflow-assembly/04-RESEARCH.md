# Phase 4: Workflow Assembly - Research

**Researched:** 2026-03-03
**Domain:** CLI context assembly commands + artifact persistence + project bootstrap
**Confidence:** HIGH

## Summary

Phase 4 adds the "glue" commands that GSD workflow orchestrators need: `stclaude init progress`, `stclaude init plan-phase <phase>`, `stclaude init execute-phase <phase>`, three `write-*` artifact persistence commands, and a `seed` command to bootstrap new projects. These commands don't introduce new technology -- they compose existing patterns established in Phases 2-3 (Commander.js registration, `withConnection`, `findProjectByGitRemote`, `outputSuccess/outputError`, BigInt serialization) with additional table queries against the 6 schema tables that currently have no CLI consumers (continueHere, planSummary, verification, research, phaseContext, config).

The `init` subcommands assemble rich JSON bundles from multiple tables in a single connection. The `write-*` commands call existing insert/update reducers to persist artifacts. The `seed` command calls the existing `seed_project` reducer that already handles bulk project initialization. All infrastructure is in place -- this phase is pure composition.

**Primary recommendation:** Follow the established command pattern exactly (registerXCommand, withConnection, typed interface, formatX, outputSuccess). Use Commander.js subcommand nesting (`stclaude init progress`, `stclaude init plan-phase <phase>`) matching the `stclaude roadmap analyze` precedent. For write commands, follow the mutation pattern from advance-plan.ts (waitForStateUpdate/onInsert listeners before calling reducers).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLI-03 | `stclaude init progress` assembles context for progress workflow | `init progress` command returns project state, phase overview with plan/requirement counts, recent activity -- mirrors `cmdInitProgress` from gsd-tools |
| CLI-04 | `stclaude init execute-phase <phase>` assembles context for execution | `init execute-phase` command returns phase details, plans with tasks/summaries, continue-here state, must-haves -- mirrors `cmdInitExecutePhase` from gsd-tools |
| CLI-05 | `stclaude init plan-phase <phase>` assembles context for planning | `init plan-phase` command returns phase details, requirements, existing research/context/plans -- mirrors `cmdInitPlanPhase` from gsd-tools |
| CLI-07 | `write-summary`, `write-verification`, `write-research` stores artifacts | Three write commands call existing insert reducers (insert_plan_summary, insert_verification, insert_research) with confirmation via subscription callbacks |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Commander.js | ^14.0.3 | CLI command registration | Already in use, established pattern |
| SpacetimeDB TS SDK | ^2.0.2 | Database connection and table queries | Already in use, generated bindings exist |
| esbuild | ^0.24.0 | Bundle CLI to single .mjs file | Already in use, build:cli script exists |
| Node.js | >=22 | Runtime | Already targeted in esbuild config |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | - | - | No new dependencies required |

### Alternatives Considered

None. This phase uses only existing dependencies and patterns.

**Installation:**
No new packages needed. Existing `package.json` dependencies cover everything.

## Architecture Patterns

### Recommended Project Structure

```
src/cli/
├── index.ts              # Command registration (add init, write-*, seed)
├── commands/
│   ├── init.ts           # "stclaude init" subcommand group
│   ├── write-summary.ts  # write-summary command
│   ├── write-verification.ts  # write-verification command
│   ├── write-research.ts # write-research command
│   └── seed.ts           # seed/init-project command
└── lib/
    ├── connection.ts     # withConnection (exists)
    ├── git.ts            # getGitRemoteUrl (exists)
    ├── output.ts         # outputSuccess/outputError (exists)
    ├── errors.ts         # CliError/ErrorCodes (exists)
    └── project.ts        # findProjectByGitRemote, findProjectState, etc. (exists)
```

### Pattern 1: Subcommand Nesting for `init`

**What:** Use Commander.js `.command()` with child commands, matching the existing `roadmap analyze` pattern.
**When to use:** For the `init` command group which has three subcommands.
**Example:**

```typescript
// Source: existing pattern from roadmap.ts
export function registerInitCommand(program: Command): void {
  const initCmd = program
    .command('init')
    .description('Assemble workflow context');

  initCmd
    .command('progress')
    .description('Assemble context for progress workflow')
    .action(async () => {
      // ...
    });

  initCmd
    .command('plan-phase <phase>')
    .description('Assemble context for planning workflow')
    .action(async (phaseNumber: string) => {
      // ...
    });

  initCmd
    .command('execute-phase <phase>')
    .description('Assemble context for execution workflow')
    .action(async (phaseNumber: string) => {
      // ...
    });
}
```

### Pattern 2: Multi-Table Query Assembly (Read Commands)

**What:** Within a single `withConnection` callback, query multiple related tables and assemble a rich JSON bundle.
**When to use:** For all three `init` subcommands.
**Example:**

```typescript
// Source: established pattern from get-state.ts, extended
const result = await withConnection((conn: DbConnection) => {
  const project = findProjectByGitRemote(conn, gitRemoteUrl);
  const state = findProjectState(conn, project.id);

  // Collect phases
  const phases = [];
  for (const row of conn.db.phase.iter()) {
    if (row.projectId === project.id) {
      phases.push({ /* ... */ });
    }
  }

  // Collect plans for all phases
  const phaseIds = new Set(phases.map(p => p.id));
  const plans = [];
  for (const row of conn.db.plan.iter()) {
    if (phaseIds.has(row.phaseId)) {
      plans.push({ /* ... */ });
    }
  }

  // Collect requirements
  const requirements = [];
  for (const row of conn.db.requirement.iter()) {
    if (row.projectId === project.id) {
      requirements.push({ /* ... */ });
    }
  }

  return { project, state, phases, plans, requirements };
});
```

### Pattern 3: Reducer Call with Subscription Confirmation (Write Commands)

**What:** Register subscription listener before calling reducer, await confirmation, read back result.
**When to use:** For write-summary, write-verification, write-research commands.
**Example:**

```typescript
// Source: established pattern from advance-plan.ts
const result = await withConnection(async (conn: DbConnection) => {
  const project = findProjectByGitRemote(conn, gitRemoteUrl);
  const phase = findPhaseByNumber(conn, project.id, phaseNumber);

  // Set up listener BEFORE calling reducer
  const insertPromise = waitForInsert(conn, 'research', phase.id);

  conn.reducers.insertResearch({
    phaseId: phase.id,
    domain: options.domain,
    confidence: options.confidence,
    content: options.content,
  });

  await insertPromise;
  return { success: true, phaseId: phase.id };
});
```

### Pattern 4: Seed Project with Bulk Initialization

**What:** Gather project metadata from git repo and user args, call `seed_project` reducer which creates project + phases + requirements + initial state in one transaction.
**When to use:** For the `stclaude seed` command.
**Example:**

```typescript
// The seed_project reducer already exists and accepts:
// git_remote_url, name, description, core_value, constraints, context,
// key_decisions, phases_json (JSON array string), requirements_json (JSON array string)
conn.reducers.seedProject({
  gitRemoteUrl: gitRemoteUrl,
  name: options.name,
  description: options.description,
  coreValue: options.coreValue,
  constraints: options.constraints || '',
  context: options.context || '',
  keyDecisions: options.keyDecisions || '',
  phasesJson: options.phasesJson,
  requirementsJson: options.requirementsJson,
});
```

### Anti-Patterns to Avoid

- **Multiple connections per command:** Never open multiple `withConnection` calls. Query everything in one connection callback.
- **Inlining project/phase lookup:** Always use shared helpers from `lib/project.ts`. Phase 6 extracted these specifically to prevent duplication.
- **Forgetting BigInt serialization:** The `outputSuccess` function handles BigInt via `bigintReplacer`. Always use it for output.
- **Positional reducer args:** SpacetimeDB TS SDK requires object syntax: `conn.reducers.insertResearch({ phaseId: ... })` not `conn.reducers.insertResearch(phaseId, ...)`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Project lookup | Inline `conn.db.project.iter()` filtering | `findProjectByGitRemote(conn, url)` from lib/project.ts | Shared helper, consistent error handling |
| Phase lookup | Inline iteration + matching | `findPhaseByNumber(conn, projectId, number)` from lib/project.ts | Shared helper, consistent PHASE_NOT_FOUND error |
| State lookup | Inline iteration | `findProjectState(conn, projectId)` from lib/project.ts | Shared helper, null return |
| State update confirmation | Custom promise + timeout | `waitForStateUpdate(conn, projectId)` from lib/project.ts | Already handles onUpdate + onInsert + timeout |
| JSON BigInt serialization | Custom replacer in each command | `outputSuccess(data, opts, formatter)` from lib/output.ts | Already handles BigInt via bigintReplacer |
| Connection lifecycle | Manual builder + cleanup | `withConnection(fn)` from lib/connection.ts | Already handles connect, subscribe, timeout, disconnect |

**Key insight:** Phase 4 is composition of existing infrastructure. Every building block exists. The only new pattern is `waitForInsert` for write commands (similar to `waitForStateUpdate` but listening on different tables).

## Common Pitfalls

### Pitfall 1: Forgetting to Register Commands in index.ts

**What goes wrong:** Command file is created but never imported/registered in `src/cli/index.ts`, so it doesn't appear in the CLI.
**Why it happens:** Easy to forget after creating the command module.
**How to avoid:** Treat `index.ts` as a checklist. Every new command module needs an import and a `register*Command(program)` call.
**Warning signs:** `stclaude init --help` doesn't show subcommands.

### Pitfall 2: Missing process.exit(0) After Successful Output

**What goes wrong:** CLI hangs after output because the SpacetimeDB connection keeps the event loop alive.
**Why it happens:** The connection disconnect in `withConnection` may not fully close all handles.
**How to avoid:** Every command action must call `process.exit(0)` after `outputSuccess`, matching the established pattern in all existing commands.
**Warning signs:** Command outputs correctly but shell prompt never returns.

### Pitfall 3: Write Commands Without Subscription Confirmation

**What goes wrong:** Reducer is called but command exits before the write is confirmed, leaving the user uncertain if the artifact was persisted.
**Why it happens:** Reducers are fire-and-forget from the client side. Without subscription callbacks, the client doesn't know when the server has processed the write.
**How to avoid:** For write commands, set up an `onInsert` or `onUpdate` listener on the target table before calling the reducer, then await the promise. Follow the `waitForStateUpdate` pattern but generalized for other tables.
**Warning signs:** Command returns immediately with no confirmation, data occasionally missing on next read.

### Pitfall 4: seed_project Unique Constraint Violation

**What goes wrong:** Calling `stclaude seed` on an already-seeded project fails because `git_remote_url` has a unique constraint.
**Why it happens:** The `seed_project` reducer does an `insert` on the project table, which will fail if the git remote URL already exists.
**How to avoid:** Before calling `seed_project`, check if a project already exists for this git remote URL. If it does, either error with a clear message ("Project already exists, use update commands") or offer to re-seed.
**Warning signs:** `SenderError: Failed to insert row` after running seed on existing project.

### Pitfall 5: Confusing Phase Number Formats

**What goes wrong:** Phase lookup fails because the number is formatted differently in the CLI argument vs the database (e.g., "4" vs "04").
**Why it happens:** Phase numbers are stored as strings to support decimals. The `findPhaseByNumber` helper does exact string comparison.
**How to avoid:** Already handled: `findPhaseByNumber` in lib/project.ts does exact string match against `row.number`. The caller should pass the number as the user provides it. The ROADMAP and seed_project store numbers as-is (e.g., "1", "2", "3", not "01", "02", "03").
**Warning signs:** `PHASE_NOT_FOUND` when the phase clearly exists but with different number formatting.

### Pitfall 6: init Commands Returning File Paths Instead of Data

**What goes wrong:** `stclaude init progress` returns file paths (like gsd-tools does) instead of the actual data.
**Why it happens:** Copying the gsd-tools pattern too literally. gsd-tools returns paths because agents read files. stclaude should return the actual data since it's stored in SpacetimeDB.
**How to avoid:** The init commands should assemble and return the complete data, not paths. The consuming workflows (progress.md, plan-phase.md, execute-phase.md) will be patched in Phase 5 to consume this data directly instead of reading files.
**Warning signs:** Agents patched in Phase 5 can't get the data they need because init only returned pointers, not content.

## Code Examples

### init progress Output Shape

The `stclaude init progress` command should return a JSON envelope containing everything the progress workflow needs. Based on analysis of `progress.md` and `cmdInitProgress`:

```typescript
// Source: analysis of ~/.claude/get-shit-done/bin/lib/init.cjs cmdInitProgress
// and ~/.claude/get-shit-done/workflows/progress.md
interface InitProgressData {
  project: {
    id: bigint;
    name: string;
    coreValue: string;
    description: string;
  };
  state: {
    currentPhase: string;
    currentPlan: bigint;
    currentTask: bigint;
    lastActivity: { microsSinceUnixEpoch: bigint };
    lastActivityDescription: string;
    velocityData: string;
    sessionLast: string;
    sessionStoppedAt: string;
    sessionResumeFile: string | undefined;
  } | null;
  phases: Array<{
    number: string;
    name: string;
    status: string;
    goal: string;
    dependsOn: string;
    plans: { total: number; completed: number };
    requirements: { total: number; completed: number };
  }>;
  recentSummaries: Array<{
    planId: bigint;
    phaseNumber: string;
    headline: string;
  }>;
}
```

### init plan-phase Output Shape

Based on analysis of `plan-phase.md` and `cmdInitPlanPhase`:

```typescript
// Source: analysis of plan-phase.md workflow steps and cmdInitPlanPhase
interface InitPlanPhaseData {
  phase: {
    id: bigint;
    number: string;
    name: string;
    slug: string;
    goal: string;
    status: string;
    dependsOn: string;
    successCriteria: string;
  };
  requirements: Array<{
    id: bigint;
    number: string;
    description: string;
    status: string;
    category: string;
  }>;
  existingResearch: {
    hasResearch: boolean;
    domain: string | null;
    confidence: string | null;
    content: string | null;
  };
  existingContext: {
    hasContext: boolean;
    content: string | null;
  };
  existingPlans: Array<{
    id: bigint;
    planNumber: bigint;
    objective: string;
    status: string;
  }>;
  projectContext: {
    coreValue: string;
    constraints: string;
    keyDecisions: string;
  };
}
```

### init execute-phase Output Shape

Based on analysis of `execute-phase.md` and `cmdInitExecutePhase`:

```typescript
// Source: analysis of execute-phase.md workflow steps and cmdInitExecutePhase
interface InitExecutePhaseData {
  phase: {
    id: bigint;
    number: string;
    name: string;
    slug: string;
    goal: string;
    status: string;
    successCriteria: string;
  };
  plans: Array<{
    id: bigint;
    planNumber: bigint;
    type: string;
    wave: bigint;
    objective: string;
    autonomous: boolean;
    requirements: string;
    dependsOn: string;
    status: string;
    content: string;
    tasks: Array<{
      id: bigint;
      taskNumber: bigint;
      type: string;
      description: string;
      status: string;
    }>;
    hasSummary: boolean;
    mustHaves: Array<{
      truths: string;
      artifacts: string;
      keyLinks: string;
    }>;
  }>;
  continueHere: {
    taskNumber: bigint;
    currentState: string;
    nextAction: string;
    context: string;
  } | null;
  requirements: Array<{
    number: string;
    description: string;
    status: string;
  }>;
}
```

### write-summary Command Pattern

```typescript
// Source: established pattern from advance-plan.ts + insert_plan_summary reducer
export function registerWriteSummaryCommand(program: Command): void {
  program
    .command('write-summary')
    .description('Persist a plan execution summary to SpacetimeDB')
    .requiredOption('--phase <phase>', 'Phase number')
    .requiredOption('--plan <plan>', 'Plan number')
    .requiredOption('--headline <text>', 'One-line summary')
    .option('--subsystem <text>', 'Subsystem affected', '')
    .option('--tags <text>', 'Comma-separated tags', '')
    .option('--accomplishments <text>', 'What was accomplished', '')
    .option('--deviations <text>', 'Deviations from plan', '')
    .option('--files <text>', 'Files modified', '')
    .option('--decisions <text>', 'Decisions made', '')
    .option('--dependency-graph <text>', 'Dependency info', '')
    .action(async (options) => {
      // 1. Resolve project + phase + plan
      // 2. Register onInsert listener on planSummary table
      // 3. Call conn.reducers.insertPlanSummary({ planId, ... })
      // 4. Await confirmation
      // 5. outputSuccess
    });
}
```

### seed Command Pattern

```typescript
// Source: seed_project reducer in spacetimedb/src/index.ts
export function registerSeedCommand(program: Command): void {
  program
    .command('seed')
    .description('Bootstrap a new project in SpacetimeDB from current git repo')
    .requiredOption('--name <name>', 'Project name')
    .requiredOption('--description <text>', 'Project description')
    .requiredOption('--core-value <text>', 'Core value statement')
    .option('--constraints <text>', 'Project constraints', '')
    .option('--context <text>', 'Project context', '')
    .option('--key-decisions <text>', 'Key decisions', '')
    .option('--phases-json <json>', 'Phases as JSON array', '[]')
    .option('--requirements-json <json>', 'Requirements as JSON array', '[]')
    .action(async (options) => {
      // 1. Get git remote URL
      // 2. Check if project already exists (graceful error)
      // 3. Register onInsert listener on project table
      // 4. Call conn.reducers.seedProject({ gitRemoteUrl, ... })
      // 5. Await confirmation
      // 6. outputSuccess with created project summary
    });
}
```

### waitForInsert Helper Pattern

```typescript
// Source: adapted from waitForStateUpdate in lib/project.ts
export function waitForInsert<T>(
  conn: DbConnection,
  table: { onInsert: (cb: (ctx: any, row: T) => void) => void },
  matchFn: (row: T) => boolean,
  timeoutMs = 5000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Insert confirmation timed out'));
    }, timeoutMs);

    table.onInsert((_ctx, row) => {
      if (matchFn(row)) {
        clearTimeout(timer);
        resolve(row);
      }
    });
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| gsd-tools returns file paths, agents read files | stclaude returns data directly from SpacetimeDB | Phase 4 (this phase) | Agents get structured data instead of parsing markdown files |
| No project bootstrap CLI path | `stclaude seed` calls `seed_project` reducer | Phase 4 (this phase) | Closes INT-01/FLOW-01 gap -- new repos can self-bootstrap |
| 6 tables without CLI consumers | init + write commands consume all tables | Phase 4 (this phase) | Full schema utilization |

**Deprecated/outdated:**
- Nothing in the stack is deprecated. SpacetimeDB SDK v2.0.2, Commander.js v14, esbuild v0.24 are all current.

## Open Questions

1. **Should `stclaude seed` read from stdin for large JSON payloads?**
   - What we know: `phases_json` and `requirements_json` can be large. Commander.js options have no size limit but shell argument limits vary by OS (typically 256KB+ on macOS).
   - What's unclear: Whether agents will hit argument length limits in practice.
   - Recommendation: Start with CLI options (matching existing pattern). If size becomes an issue, add `--phases-json-file` / `--requirements-json-file` options later. Phase 5 patches will control how agents call the command.

2. **Should write commands support upsert (update-or-insert) semantics?**
   - What we know: The server has separate `insert_*` and `update_*` reducers. The `write-summary` might be called on the same plan twice (e.g., re-execution).
   - What's unclear: Whether GSD agents ever re-write artifacts for the same plan/phase.
   - Recommendation: Start with insert-only. If duplicate inserts fail, the error message will be clear. Add upsert logic if Phase 5 testing reveals re-write scenarios.

3. **How much of the gsd-tools init JSON contract should stclaude match?**
   - What we know: gsd-tools init returns config flags (researcher_model, planner_model, etc.) and file existence flags that are specific to file-based GSD.
   - What's unclear: Whether Phase 5 patches will need model resolution or config flags from stclaude.
   - Recommendation: Focus on data assembly (the actual content agents need). Config/model resolution stays in gsd-tools for now -- Phase 5 patches will only replace the data-fetching parts, not the config parts. This keeps the stclaude surface area clean.

## Sources

### Primary (HIGH confidence)

- **Existing codebase** `/Users/gustav/src/spacetimeclaude/spacetimeclaude/src/cli/` -- all 8 existing commands analyzed for patterns
- **SpacetimeDB schema** `/Users/gustav/src/spacetimeclaude/spacetimeclaude/spacetimedb/src/schema.ts` -- 13 tables, all column types verified
- **SpacetimeDB reducers** `/Users/gustav/src/spacetimeclaude/spacetimeclaude/spacetimedb/src/index.ts` -- all CRUD reducers including seed_project analyzed
- **Module bindings** `/Users/gustav/src/spacetimeclaude/spacetimeclaude/src/module_bindings/index.ts` -- generated client types verified
- **GSD workflow files** `~/.claude/get-shit-done/workflows/progress.md`, `plan-phase.md`, `execute-phase.md` -- consumer requirements analyzed
- **GSD init library** `~/.claude/get-shit-done/bin/lib/init.cjs` -- cmdInitProgress, cmdInitPlanPhase, cmdInitExecutePhase output shapes documented

### Secondary (MEDIUM confidence)

- **v1.0 Milestone Audit** `/Users/gustav/src/spacetimeclaude/.planning/v1.0-MILESTONE-AUDIT.md` -- INT-01/FLOW-01 gap descriptions and severity

### Tertiary (LOW confidence)

- None. All findings are from primary codebase analysis.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new dependencies, all patterns established in Phases 2-3
- Architecture: HIGH -- subcommand nesting, multi-table queries, and reducer confirmation are all proven patterns in the existing codebase
- Pitfalls: HIGH -- every pitfall identified from actual codebase analysis and established conventions
- Data shapes: MEDIUM -- init output shapes are inferred from GSD workflow consumer analysis; Phase 5 patches may reveal additional fields needed

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (stable -- no external dependency changes expected)
