# Phase 10: Todo & Debug Tracking - Research

**Researched:** 2026-03-04
**Domain:** SpacetimeDB TypeScript CLI commands + GSD workflow patching
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Todo command design:**
- Title as positional argument: `stclaude add-todo "Fix auth bug"` — fastest for quick captures
- Optional flags: --area, --problem, --solution-hints, --file-refs
- Area auto-detected from context when possible
- Strict area validation against the 9 schema values (api, ui, auth, database, testing, docs, planning, tooling, general); show available areas in help text and error messages
- list-todos: simple flat list, one line per todo (ID, title, area tag, relative age), --area flag to filter, --all to include done items
- complete-todo: simple mark done by ID, no resolution notes required

**Debug session lifecycle:**
- write-debug accepts --bug as required flag; hypotheses/checkpoints/timeline via stdin or --file for complex content, or as flags for simple values
- Auto-detect create vs update: if --session-id provided, update existing; otherwise create new (matches write-plan pattern)
- get-debug renders as structured markdown sections (Bug, Hypotheses, Checkpoints, Timeline, Status, Resolution)
- close-debug requires resolution notes: `stclaude close-debug <id> --resolution "Root cause was X"` — forces documentation of learnings

**GSD workflow patching:**
- Hard cutover: patches replace file I/O with stclaude calls entirely; if DB not set up, workflow errors with setup instructions
- No migration of existing file-based todos/debug sessions — new sessions go to DB, old files stay as-is
- Direct workflow file edits (modify add-todo.md, check-todos.md, debug workflow .md files directly)
- check-todos preserves same interactive experience (list, select, offer actions) — just swaps data source from files to stclaude

**Output & display format:**
- Medium density default: one line per todo with ID, title, area tag, relative age; --verbose for full details
- All commands support --json for machine-readable output (consistent with existing CLI pattern)
- Newest first sort by default, no sort flag needed
- Debug sessions: full output by default (timeline/checkpoints shown in full)

### Claude's Discretion
- Exact relative timestamp formatting (e.g., "2h ago" vs "2 hours ago")
- Error code additions to errors.ts
- Debug get-debug truncation behavior (decided: full output)
- Sort implementation details given SpacetimeDB query capabilities

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TODO-02 | CLI command `stclaude add-todo` creates a new todo item | Reducer `insertTodo` exists in bindings; schema fields confirmed |
| TODO-03 | CLI command `stclaude list-todos` returns pending todos with relative timestamps | Index `todo_project_id` and `todo_status` available for filtering; timestamp math pattern from get-session |
| TODO-04 | CLI command `stclaude complete-todo` marks a todo as done | Reducer `updateTodo` takes `{ todoId, title, area, problem, solutionHints, fileRefs, status }` |
| TODO-05 | GSD patch for add-todo workflow replacing .planning/todos/ file writes with stclaude calls | add-todo.md identified and analyzed; patch pattern clear from Phase 9 |
| TODO-06 | GSD patch for check-todos workflow replacing .planning/todos/ file reads and moves with stclaude calls | check-todos.md identified and analyzed; hard cutover pattern established |
| DBG-02 | CLI command `stclaude write-debug` persists or updates a debug session | Reducers `insertDebugSession` and `updateDebugSession` exist; auto-detect pattern from write-plan/write-session |
| DBG-03 | CLI command `stclaude get-debug` retrieves active debug session for current project | `debug_session_project_id` index available; `debug_session_status` index for filtering active |
| DBG-04 | CLI command `stclaude close-debug` marks a debug session as resolved with resolution notes | `updateDebugSession` with status="resolved" and resolutionNotes field |
| DBG-05 | GSD patch for debug workflow replacing .planning/debug/ file I/O with stclaude calls | diagnose-issues.md and DEBUG.md template identified; no single "debug" workflow file — patches distributed across gsd-debugger agent |

</phase_requirements>

## Summary

Phase 10 adds 6 CLI commands (add-todo, list-todos, complete-todo, write-debug, get-debug, close-debug) and patches 3 GSD workflow files (add-todo.md, check-todos.md, and the debug workflow which is diagnose-issues.md). The SpacetimeDB schema for both `todo` and `debug_session` tables was already created in Phase 7 and client bindings are fully generated. All reducers (`insertTodo`, `updateTodo`, `deleteTodo`, `insertDebugSession`, `updateDebugSession`, `deleteDebugSession`) already exist in the module_bindings. This phase is purely CLI implementation + GSD patch work with no schema or reducer changes needed.

The todo commands follow the same pattern as the 27 existing CLI commands: `registerXCommand(program)`, `withConnection()`, `findProjectByGitRemote()`, then reducer call with `onInsert`/`onUpdate` listener registered first. The GSD patches follow the same surgical replacement pattern demonstrated in Phase 9: identify specific `<step>` blocks that do file I/O, replace their content with `stclaude` CLI calls, leave all other steps unchanged.

**Primary recommendation:** Implement in 2 plans — Plan 01 for the 6 CLI commands + errors.ts additions, Plan 02 for the 3 GSD workflow patches. All reducer signatures are already known from module_bindings; no schema research needed.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| commander | (project dependency) | CLI option parsing | Already used in all 27 commands |
| spacetimedb SDK | 2.0.x | DB connection and subscription | Project standard |
| Node.js `node:fs` | built-in | Read --file content for debug flags | Used in write-milestone.ts |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Node.js `node:process` | built-in | stdin reading for debug content | If --file or stdin used for hypotheses/checkpoints |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual timestamp formatting | date-fns | date-fns not in project deps; manual `Date` math is 3 lines and sufficient |

**Installation:**
No new packages needed — everything already in project dependencies.

## Architecture Patterns

### Recommended Project Structure
```
src/cli/commands/
├── add-todo.ts          # new - insertTodo reducer
├── list-todos.ts        # new - filter by project+status, format with relative timestamps
├── complete-todo.ts     # new - updateTodo with status="done"
├── write-debug.ts       # new - insertDebugSession OR updateDebugSession (auto-detect)
├── get-debug.ts         # new - filter by project, get active session
└── close-debug.ts       # new - updateDebugSession with status="resolved"
src/cli/lib/
└── errors.ts            # add TODO_NOT_FOUND, DEBUG_SESSION_NOT_FOUND
src/cli/index.ts         # register 6 new commands
~/.claude/get-shit-done/workflows/
├── add-todo.md          # patch: replace file I/O with stclaude add-todo
├── check-todos.md       # patch: replace file I/O with stclaude list-todos + stclaude complete-todo
└── diagnose-issues.md   # patch: replace .planning/debug/ creation with stclaude write-debug
```

### Pattern 1: Standard CLI Command Structure
**What:** Every command follows this exact 5-step pattern.
**When to use:** All 6 new commands.
**Example:**
```typescript
// Source: Verified from existing commands (add-phase.ts, write-session.ts, write-milestone.ts)
import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

export function registerAddTodoCommand(program: Command): void {
  program
    .command('add-todo')
    .description('Add a new todo item')
    .argument('<title>', 'Todo title')
    .option('--area <area>', 'Area (api|ui|auth|database|testing|docs|planning|tooling|general)')
    .option('--problem <text>', 'Problem description')
    .option('--solution-hints <text>', 'Solution hints')
    .option('--file-refs <refs>', 'File references')
    .action(async (title, options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();
        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Register listener BEFORE calling reducer
          const insertPromise = waitForInsert(conn, conn.db.todo,
            (row) => row.projectId === project.id && row.title === title);

          conn.reducers.insertTodo({
            projectId: project.id,
            title,
            area: options.area ?? 'general',
            problem: options.problem ?? '',
            solutionHints: options.solutionHints ?? '',
            fileRefs: options.fileRefs ?? '',
            status: 'pending',
          });

          await insertPromise;
          return { /* ... */ };
        });
        outputSuccess(result, opts, formatAddTodo);
        process.exit(0);
      } catch (err) {
        if (err instanceof CliError) outputError(err.code, err.message, opts);
        else outputError(ErrorCodes.INTERNAL_ERROR, String(err), opts);
      }
    });
}
```

### Pattern 2: Read-Only Command (no listener wait)
**What:** List/get commands don't need to wait for mutations; call synchronously inside withConnection.
**When to use:** list-todos, get-debug.
**Example:**
```typescript
// Source: Verified from get-session.ts, get-milestones.ts
const result = await withConnection((conn: DbConnection) => {
  const project = findProjectByGitRemote(conn, gitRemoteUrl);
  const rows = [...conn.db.todo.todo_project_id.filter(project.id)]
    .filter(row => row.status === 'pending')  // or 'done' if --all
    .sort((a, b) => Number(b.createdAt.microsSinceUnixEpoch - a.createdAt.microsSinceUnixEpoch));
  return rows.map(row => ({
    id: row.id.toString(),
    title: row.title,
    area: row.area,
    createdAt: new Date(Number(row.createdAt.microsSinceUnixEpoch / 1000n)).toISOString(),
  }));
});
```

### Pattern 3: Auto-detect Create vs Update (write-debug)
**What:** Check if --session-id provided; if yes call updateDebugSession, otherwise insertDebugSession.
**When to use:** write-debug command only.
**Example:**
```typescript
// Source: Verified from write-plan.ts pattern (analogous approach)
if (options.sessionId) {
  // Update existing — register onUpdate listener
  const updatePromise = waitForUpdate(conn, conn.db.debugSession,
    (newRow) => newRow.id === BigInt(options.sessionId));
  conn.reducers.updateDebugSession({
    sessionId: BigInt(options.sessionId),
    bugDescription: options.bug,
    // ... other fields
    status: options.status ?? 'investigating',
    resolutionNotes: '',
  });
  await updatePromise;
} else {
  // Create new — register onInsert listener
  const insertPromise = waitForInsert(conn, conn.db.debugSession,
    (row) => row.projectId === project.id && row.bugDescription === options.bug);
  conn.reducers.insertDebugSession({
    projectId: project.id,
    bugDescription: options.bug,
    hypotheses: options.hypotheses ?? '',
    checkpoints: options.checkpoints ?? '',
    timeline: options.timeline ?? '',
    status: 'investigating',
    resolutionNotes: '',
  });
  await insertPromise;
}
```

### Pattern 4: Relative Timestamp Formatting
**What:** Convert SpacetimeDB Timestamp to relative age string ("2h ago", "3d ago").
**When to use:** list-todos human output, get-debug output.
**Example:**
```typescript
// Source: Claude's discretion per CONTEXT.md; simple inline approach
function relativeAge(microsSinceEpoch: bigint): string {
  const nowMs = Date.now();
  const thenMs = Number(microsSinceEpoch / 1000n);
  const diffMs = nowMs - thenMs;
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
```

### Pattern 5: GSD Workflow Surgical Patch
**What:** Replace exactly the file I/O steps in a GSD workflow .md with stclaude CLI calls. Leave all other steps unchanged.
**When to use:** add-todo.md, check-todos.md, diagnose-issues.md patches.
**Example (from Phase 9 plan 09-03):**
```
1. Read the target workflow file completely
2. Locate the specific <step name="..."> block that does file I/O
3. Replace ONLY the content of that step block
4. Verify non-patched steps are unchanged
5. Grep to confirm new command appears, old command does not
```

### Anti-Patterns to Avoid
- **waitForUpdate on read-only commands:** list-todos and get-debug don't write; don't add unnecessary listeners.
- **Storing full row in waitForInsert closure:** Only capture the match condition (projectId + discriminating field); don't capture the full row object to return — fetch after confirmation instead.
- **Direct todo.iter() for filtering:** Use `conn.db.todo.todo_project_id.filter(project.id)` then JS filter for status. The `todo_status` index exists but filtering by project AND status requires picking one index and filtering the other in JS — project_id is always the primary scope.
- **Assuming debug "active" = one session:** Multiple debug sessions per project are possible; get-debug should return the most recently updated with status != "resolved".
- **Patching too much in GSD workflows:** Only swap the data source steps; preserve all display/interaction logic.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Relative timestamps | Custom date library | Inline calculation (4 lines) | No new dependency; already clear pattern |
| Area validation | Complex validator | Simple `const VALID_AREAS = [...]` + `includes()` check | 9 fixed values, no runtime complexity |
| ID lookup | Manual iteration | `conn.db.todo.id.find(BigInt(todoId))` | `id` index exists (unique constraint) |
| Connection management | Custom pool | `withConnection()` wrapper | Already handles subscribe, timeout, disconnect |
| Output formatting | Custom serializer | `outputSuccess()` / `outputError()` with `bigintReplacer` | Already handles --json flag and BigInt |

**Key insight:** Every problem in this phase has an established solution in the existing codebase. The work is applying known patterns to new tables.

## Common Pitfalls

### Pitfall 1: update_todo reducer requires ALL fields
**What goes wrong:** Calling `conn.reducers.updateTodo({ todoId, status: 'done' })` results in TypeScript error or overwrites other fields with empty strings.
**Why it happens:** The `UpdateTodoReducer` schema requires `{ todoId, title, area, problem, solutionHints, fileRefs, status }` — all fields. It's a full-row replacement, not a partial patch.
**How to avoid:** In `complete-todo`, first find the existing row with `conn.db.todo.id.find(BigInt(todoId))`, then spread + override: `conn.reducers.updateTodo({ ...existingRow, todoId: existingRow.id, status: 'done' })`.
**Warning signs:** TypeScript type error on `updateTodo` call, or field values becoming empty strings after update.

### Pitfall 2: update_debug_session reducer requires ALL fields including resolutionNotes
**What goes wrong:** `UpdateDebugSessionReducer` has `resolutionNotes: __t.string()` (not optional in the reducer args even though the table column is optional). Passing `undefined` causes an error.
**Why it happens:** The reducer was defined with non-optional `resolutionNotes`. The table has `resolutionNotes: __t.option(__t.string())` but the reducer takes a plain string.
**How to avoid:** Always pass `resolutionNotes: options.resolution ?? ''` in updateDebugSession calls. For `close-debug`, pass the actual resolution text. For `write-debug` updates, pass `resolutionNotes: ''` as default.
**Warning signs:** Runtime error or type error on updateDebugSession call.

### Pitfall 3: BigInt ID from CLI string argument
**What goes wrong:** User passes `--session-id 42` (string), code does `BigInt(options.sessionId)` on undefined or non-numeric string → runtime error.
**Why it happens:** Commander options are strings; BigInt conversion throws on non-numeric input.
**How to avoid:** Validate options.sessionId is defined and numeric before converting. Throw `CliError(ErrorCodes.INVALID_ARGUMENT, ...)` with clear message if invalid.
**Warning signs:** `SyntaxError: Cannot convert ... to a BigInt` at runtime.

### Pitfall 4: debug workflow patch target is not a single file
**What goes wrong:** Expecting a `/gsd:debug` workflow file that doesn't exist as a standalone workflow.
**Why it happens:** The debug system uses the `gsd-debugger` agent (spawned by `diagnose-issues.md`) and the `DEBUG.md` template. There is no `debug.md` workflow file in `~/.claude/get-shit-done/workflows/`.
**How to avoid:** The patch target for DBG-05 is `diagnose-issues.md` — specifically the `spawn_agents` step that creates `.planning/debug/{slug}.md` files. Replace that file creation with `stclaude write-debug` calls.
**Warning signs:** Looking for a `debug.md` or `start-debug.md` file that doesn't exist.

### Pitfall 5: Area validation — 9 exact values
**What goes wrong:** Accepting arbitrary area strings, leading to data inconsistency that can't be queried by index.
**Why it happens:** Schema stores area as `t.string()`, not an enum, so the DB won't validate.
**How to avoid:** Validate in the CLI: `const VALID_AREAS = ['api', 'ui', 'auth', 'database', 'testing', 'docs', 'planning', 'tooling', 'general']`. Throw `CliError(ErrorCodes.INVALID_ARGUMENT, ...)` with the available areas listed if invalid.
**Warning signs:** list-todos --area api returns no results even though todos were added with area="API".

### Pitfall 6: get-debug returns wrong session when multiple exist
**What goes wrong:** Returning the first session for a project instead of the active/most recent one.
**Why it happens:** `filter(project.id)` may return multiple sessions in any order.
**How to avoid:** Filter for `status !== 'resolved'` first, then sort by `updatedAt` descending to get most recently active session. If none active, either return an error or the most recent resolved one (design choice: error with "no active debug session").
**Warning signs:** get-debug returns a resolved session when a newer active one exists.

## Code Examples

Verified patterns from existing codebase:

### Insert Todo (reducer signature confirmed from insert_todo_reducer.ts)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/module_bindings/insert_todo_reducer.ts
conn.reducers.insertTodo({
  projectId: project.id,          // bigint
  title: 'Fix auth bug',          // string
  area: 'auth',                   // string (validated as one of 9 values)
  problem: 'Token refresh fails', // string ('' if not provided)
  solutionHints: 'Check expiry',  // string ('' if not provided)
  fileRefs: 'src/auth.ts:42',     // string ('' if not provided)
  status: 'pending',              // string
});
```

### Update Todo to Done (reducer signature confirmed from update_todo_reducer.ts)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/module_bindings/update_todo_reducer.ts
// MUST include ALL fields — find existing row first
const existing = conn.db.todo.id.find(BigInt(todoId));
if (!existing) throw new CliError(ErrorCodes.TODO_NOT_FOUND, `Todo ${todoId} not found`);
conn.reducers.updateTodo({
  todoId: existing.id,
  title: existing.title,
  area: existing.area,
  problem: existing.problem,
  solutionHints: existing.solutionHints,
  fileRefs: existing.fileRefs,
  status: 'done',                 // the only field changing
});
```

### Filter Todos by Project + Status
```typescript
// Source: Pattern from get-session.ts index lookup + get-milestones.ts filtering
const todos = [...conn.db.todo.todo_project_id.filter(project.id)]
  .filter(row => options.all ? true : row.status === 'pending')
  .filter(row => options.area ? row.area === options.area : true)
  .sort((a, b) => Number(b.createdAt.microsSinceUnixEpoch - a.createdAt.microsSinceUnixEpoch));
```

### Insert Debug Session (reducer signature confirmed from insert_debug_session_reducer.ts)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/module_bindings/insert_debug_session_reducer.ts
conn.reducers.insertDebugSession({
  projectId: project.id,
  bugDescription: options.bug,    // required flag
  hypotheses: options.hypotheses ?? '',
  checkpoints: options.checkpoints ?? '',
  timeline: options.timeline ?? '',
  status: 'investigating',
  resolutionNotes: '',
});
```

### Update Debug Session (reducer signature confirmed from update_debug_session_reducer.ts)
```typescript
// Source: /Users/gustav/src/spacetimeclaude/src/module_bindings/update_debug_session_reducer.ts
conn.reducers.updateDebugSession({
  sessionId: BigInt(options.sessionId),
  bugDescription: options.bug ?? existing.bugDescription,
  hypotheses: options.hypotheses ?? existing.hypotheses,
  checkpoints: options.checkpoints ?? existing.checkpoints,
  timeline: options.timeline ?? existing.timeline,
  status: options.status ?? existing.status,
  resolutionNotes: options.resolution ?? existing.resolutionNotes ?? '',
});
```

### Close Debug Session
```typescript
// Source: Same update_debug_session_reducer.ts + pattern from complete-phase
conn.reducers.updateDebugSession({
  sessionId: BigInt(sessionId),
  bugDescription: existing.bugDescription,
  hypotheses: existing.hypotheses,
  checkpoints: existing.checkpoints,
  timeline: existing.timeline,
  status: 'resolved',
  resolutionNotes: options.resolution,  // required flag for close-debug
});
```

### GSD Workflow Patch Pattern
```markdown
// Source: Phase 9 plan 09-03-PLAN.md — verified working pattern
// 1. Read target workflow file
// 2. Find the step block doing file I/O:
<step name="create_file">
  // Old: writes .planning/todos/pending/${date}-${slug}.md
</step>
// 3. Replace ONLY that block's content with stclaude call:
<step name="create_file">
**Persist todo to SpacetimeDB via stclaude:**
```bash
RESULT=$(~/.claude/bin/stclaude add-todo "${title}" \
  --area "${area}" \
  --problem "${problem}" \
  --solution-hints "${solution}" \
  --file-refs "${files}" \
  --json)
```
Extract from result: `data.id`, `data.title`, `data.area`.
</step>
```

### list-todos Human Output Format
```typescript
// Source: Design from CONTEXT.md — "one line per todo with ID, title, area tag, relative age"
// Example output:
// 42  Fix auth bug                        [auth]   2h ago
// 37  Add input validation to signup form [ui]     1d ago
// 31  Write integration tests for API     [testing] 3d ago
function formatListTodos(data: unknown): string {
  const todos = data as TodoRow[];
  if (todos.length === 0) return 'No pending todos.';
  return todos.map(t =>
    `${t.id.padStart(4)}  ${t.title.padEnd(40)} [${t.area}]   ${t.age}`
  ).join('\n');
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| .planning/todos/pending/*.md | SpacetimeDB todo table | Phase 10 | Queryable, no file management |
| .planning/debug/{slug}.md | SpacetimeDB debug_session table | Phase 10 | Persistent across context resets automatically |
| grep for duplicates | DB query by title similarity | Phase 10 | check-todos no longer needs grep |

**Deprecated/outdated:**
- `init todos` gsd-tools call: Will no longer be needed in add-todo.md after patch; stclaude handles all data.
- `.planning/todos/pending/` directory: Existing files remain; new todos go to DB only.
- `.planning/debug/` directory: Existing files remain; new debug sessions go to DB only.

## Open Questions

1. **write-debug file reading behavior**
   - What we know: Decision says "hypotheses/checkpoints/timeline via stdin or --file for complex content, or as flags for simple values"
   - What's unclear: Should --file reading use `readFileSync` (like write-milestone) or read stdin? Both paths need implementing.
   - Recommendation: Implement both patterns — `--hypotheses-file <path>` for file reading (analogous to `--accomplishments-file` in write-milestone.ts), and `--hypotheses <text>` for inline. Stdin reading adds complexity; file approach is sufficient.

2. **get-debug: project-scoped vs. global active session**
   - What we know: "get-debug retrieves active debug session for current project"
   - What's unclear: If there are multiple active (non-resolved) sessions, which one to return?
   - Recommendation: Return the most recently updated non-resolved session. Add a note in the output if multiple active sessions exist ("Note: 2 other active debug sessions exist for this project").

3. **check-todos patch: duplicate detection step**
   - What we know: Current check-todos.md has a duplicate detection step using `grep -l -i` on .planning/todos/pending/*.md
   - What's unclear: Should the patched version check for title similarity in the DB?
   - Recommendation: Remove the duplicate detection step entirely in the patched version — the DB approach makes duplicates less problematic (they're visible in list-todos), and the complexity of DB-based title matching isn't worth the benefit for a workflow patch.

4. **diagnose-issues.md patch scope**
   - What we know: The `spawn_agents` step creates `.planning/debug/{slug}.md` files; each debug subagent writes to that file
   - What's unclear: The debug subagent prompt template (`debug-subagent-prompt.md`) instructs agents to create `.planning/debug/{slug}.md` — should that also be patched?
   - Recommendation: Patch `diagnose-issues.md` spawn_agents step to call `stclaude write-debug --bug "{truth}" --json` to create the session, then pass the session ID to the agent. The subagent prompt template should also be updated to call `stclaude write-debug --session-id {id}` for updates instead of writing to files. This is a broader patch but necessary for DBG-05 to be complete.

## Sources

### Primary (HIGH confidence)
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/todo_table.ts` — confirmed schema fields
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/debug_session_table.ts` — confirmed schema fields
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/insert_todo_reducer.ts` — confirmed reducer signature
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/update_todo_reducer.ts` — confirmed reducer signature (ALL fields required)
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/insert_debug_session_reducer.ts` — confirmed reducer signature
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/update_debug_session_reducer.ts` — confirmed reducer signature (ALL fields required, resolutionNotes is string not optional)
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/delete_todo_reducer.ts` — `{ todoId: u64 }`
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/delete_debug_session_reducer.ts` — `{ sessionId: u64 }`
- `/Users/gustav/src/spacetimeclaude/src/module_bindings/index.ts` — confirmed indexes: `todo_project_id`, `todo_status`, `todo_area`, `debug_session_project_id`, `debug_session_status`
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/write-session.ts` — verified waitForUpsert pattern
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/get-session.ts` — verified read-only pattern with index lookup
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/add-phase.ts` — verified waitForInsert pattern
- `/Users/gustav/src/spacetimeclaude/src/cli/commands/write-milestone.ts` — verified --file reading pattern
- `/Users/gustav/src/spacetimeclaude/.planning/phases/09-phase-session-management/09-03-PLAN.md` — verified GSD surgical patch plan structure
- `/Users/gustav/.claude/get-shit-done/workflows/add-todo.md` — analyzed for patch target
- `/Users/gustav/.claude/get-shit-done/workflows/check-todos.md` — analyzed for patch target
- `/Users/gustav/.claude/get-shit-done/workflows/diagnose-issues.md` — analyzed for patch target (DBG-05)
- `/Users/gustav/.claude/get-shit-done/templates/DEBUG.md` — analyzed debug session template (informs write-debug field design)
- `/Users/gustav/.claude/get-shit-done/templates/debug-subagent-prompt.md` — analyzed for DBG-05 patch scope

### Secondary (MEDIUM confidence)
- N/A — all findings from direct codebase inspection

### Tertiary (LOW confidence)
- N/A — no WebSearch findings used

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; all tools verified in existing commands
- Architecture: HIGH — all 6 command patterns have direct analogs in existing codebase
- Pitfalls: HIGH — reducer signatures confirmed from actual generated bindings; gotchas verified
- GSD patch targets: HIGH — all 3 target files read and analyzed; patch pattern proven in Phase 9

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (schema/bindings stable; workflow files could be edited but unlikely)
