# Phase 2: CLI Foundation - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

The `stclaude` CLI binary exists, connects to SpacetimeDB maincloud, identifies the current project from the repo's git remote URL, and supports JSON output for agent consumption. Installable to `~/.claude/bin/stclaude`. This phase delivers the CLI skeleton and connection plumbing — actual commands (get-state, read-plan, etc.) are Phase 3+.

</domain>

<decisions>
## Implementation Decisions

### Output design
- Envelope format for all JSON output: `{ "ok": true, "data": {...} }` on success, `{ "ok": false, "error": { "code": "...", "message": "..." } }` on failure
- SpacetimeDB BigInt IDs serialized as strings in JSON (e.g., `"id": "42"`) to avoid precision loss
- Human-readable output uses minimal one-liners (e.g., `Phase 2: CLI Foundation (in_progress)`)
- `--json` flag switches any command from human to envelope JSON

### Default experience
- Bare `stclaude` (no subcommand) shows project status: current phase, plan, last activity. Falls back to help text if no project detected
- Agent-first, human-friendly: optimized for machine parsing, but human output is usable for debugging
- Not in a git repo: error and exit. No manual project flag or fallback

### Claude's Discretion
- JSON metadata inclusion (timing, project identity, version) — decide what's useful
- Connection strategy (connect-per-command vs cached project identity)
- CLI framework choice
- Binary compilation/distribution approach
- Error message wording and exit code conventions
- Help text style and formatting

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/module_bindings/`: Generated SpacetimeDB TypeScript client bindings (DbConnection, tables, reducers)
- `spacetimedb` SDK v2.0: Connection builder pattern already demonstrated in `src/main.ts`
- `esbuild` bundling already configured for ESM + Node platform

### Established Patterns
- SpacetimeDB connection: `DbConnection.builder().withUri().withDatabaseName().onConnect().build()`
- Database name: `spacetimeclaude-gvhsi` on maincloud
- Project identity: `git_remote_url` is the unique field on the project table (SCHM-15)
- All table data is public (no auth needed for reads via subscriptions)

### Integration Points
- `~/.claude/bin/stclaude`: Target install path (must be on Claude Code's PATH)
- `spacetime.json`: Contains server (`maincloud`) and database name config
- Git remote URL: Used to resolve project identity — must match `project.git_remote_url` in SpacetimeDB
- Future phases (3-5) will add subcommands to this CLI skeleton

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-cli-foundation*
*Context gathered: 2026-03-02*
