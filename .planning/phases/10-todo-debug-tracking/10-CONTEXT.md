# Phase 10: Todo & Debug Tracking - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

CLI commands for todo lifecycle (add-todo, list-todos, complete-todo) and debug session persistence (write-debug, get-debug, close-debug) via SpacetimeDB. Patch GSD workflows (add-todo, check-todos, debug) to call stclaude instead of reading/writing .planning/ files.

</domain>

<decisions>
## Implementation Decisions

### Todo command design
- Title as positional argument: `stclaude add-todo "Fix auth bug"` — fastest for quick captures
- Optional flags: --area, --problem, --solution-hints, --file-refs
- Area auto-detected from context when possible
- Strict area validation against the 9 schema values (api, ui, auth, database, testing, docs, planning, tooling, general); show available areas in help text and error messages
- list-todos: simple flat list, one line per todo (ID, title, area tag, relative age), --area flag to filter, --all to include done items
- complete-todo: simple mark done by ID, no resolution notes required

### Debug session lifecycle
- write-debug accepts --bug as required flag; hypotheses/checkpoints/timeline via stdin or --file for complex content, or as flags for simple values
- Auto-detect create vs update: if --session-id provided, update existing; otherwise create new (matches write-plan pattern)
- get-debug renders as structured markdown sections (Bug, Hypotheses, Checkpoints, Timeline, Status, Resolution)
- close-debug requires resolution notes: `stclaude close-debug <id> --resolution "Root cause was X"` — forces documentation of learnings

### GSD workflow patching
- Hard cutover: patches replace file I/O with stclaude calls entirely; if DB not set up, workflow errors with setup instructions
- No migration of existing file-based todos/debug sessions — new sessions go to DB, old files stay as-is
- Direct workflow file edits (modify add-todo.md, check-todos.md, debug workflow .md files directly)
- check-todos preserves same interactive experience (list, select, offer actions) — just swaps data source from files to stclaude

### Output & display format
- Medium density default: one line per todo with ID, title, area tag, relative age; --verbose for full details
- All commands support --json for machine-readable output (consistent with existing CLI pattern)
- Newest first sort by default, no sort flag needed
- Debug sessions: full output by default (timeline/checkpoints shown in full)

### Claude's Discretion
- Exact relative timestamp formatting (e.g., "2h ago" vs "2 hours ago")
- Error code additions to errors.ts
- Debug get-debug truncation behavior (decided: full output)
- Sort implementation details given SpacetimeDB query capabilities

</decisions>

<specifics>
## Specific Ideas

- write-debug auto-detect mirrors existing write-plan pattern for consistency
- GSD workflows should error clearly if stclaude not set up, with instructions to run setup
- check-todos interactive flow preserved: list → select → action (work on it, add to phase, create phase, brainstorm)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- All 27 existing CLI commands follow identical pattern: `registerXCommand(program)`, `withConnection()`, `getGitRemoteUrl()` + `findProjectByGitRemote()`
- Schema already defines Todo table (id, project_id, title, area, problem, solution_hints, file_refs, status, created_at, updated_at) with indexes: todo_project_id, todo_status, todo_area
- Schema already defines DebugSession table (id, project_id, bug_description, hypotheses, checkpoints, timeline, status, resolution_notes, created_at, updated_at) with indexes: debug_session_project_id, debug_session_status
- Reducers exist: insert_todo, update_todo, delete_todo, insert_debug_session, update_debug_session, delete_debug_session
- `outputSuccess()` / `CliError` / `ErrorCodes` in src/cli/lib/ for consistent output

### Established Patterns
- Commands register onInsert/onUpdate listener BEFORE calling reducer, then await confirmation
- Reducer calls use camelCase object syntax: `conn.reducers.insertTodo({ projectId, title, ... })`
- JSON output via --json flag on get/list commands
- BigInt for all u64 fields (0n, 1n, etc.)

### Integration Points
- src/cli/index.ts: register new commands alongside existing 27
- src/cli/lib/errors.ts: add TODO_NOT_FOUND, DEBUG_SESSION_NOT_FOUND error codes
- GSD workflow files: ~/.claude/get-shit-done/workflows/add-todo.md, check-todos.md, and debug workflow

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-todo-debug-tracking*
*Context gathered: 2026-03-04*
