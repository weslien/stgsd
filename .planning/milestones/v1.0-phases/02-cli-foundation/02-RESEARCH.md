# Phase 2: CLI Foundation - Research

**Researched:** 2026-03-03
**Domain:** TypeScript CLI development, SpacetimeDB client SDK, esbuild bundling
**Confidence:** HIGH

## Summary

Phase 2 builds the `stclaude` CLI binary: a single-file Node.js executable bundled with esbuild that connects to SpacetimeDB maincloud, resolves the current project from the git remote URL, and supports `--json` output for agent consumption. The CLI skeleton must be extensible for Phase 3+ subcommands.

The project already has esbuild configured, the SpacetimeDB TypeScript SDK v2.0.2 installed, and the connection builder pattern demonstrated in `src/main.ts`. Node.js 22 provides native WebSocket support, so the SpacetimeDB SDK works out of the box for Node.js CLI use -- no extra dependencies needed. Commander.js v14 is the standard CLI framework choice: zero dependencies, built-in TypeScript types, global options propagation, and trivial subcommand registration.

**Primary recommendation:** Use Commander.js v14 for CLI structure, esbuild to bundle into a single `stclaude.mjs` file with a shebang, and a symlink-based install to `~/.claude/bin/stclaude`. Connect to SpacetimeDB on each invocation (connect, subscribe, read, disconnect) -- no persistent daemon or cache needed for v1.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Envelope format for all JSON output: `{ "ok": true, "data": {...} }` on success, `{ "ok": false, "error": { "code": "...", "message": "..." } }` on failure
- SpacetimeDB BigInt IDs serialized as strings in JSON (e.g., `"id": "42"`) to avoid precision loss
- Human-readable output uses minimal one-liners (e.g., `Phase 2: CLI Foundation (in_progress)`)
- `--json` flag switches any command from human to envelope JSON
- Bare `stclaude` (no subcommand) shows project status: current phase, plan, last activity. Falls back to help text if no project detected
- Agent-first, human-friendly: optimized for machine parsing, but human output is usable for debugging
- Not in a git repo: error and exit. No manual project flag or fallback

### Claude's Discretion
- JSON metadata inclusion (timing, project identity, version) -- decide what's useful
- Connection strategy (connect-per-command vs cached project identity)
- CLI framework choice
- Binary compilation/distribution approach
- Error message wording and exit code conventions
- Help text style and formatting

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLI-10 | Connection management (auto-connect to maincloud, project identity from git remote) | SpacetimeDB SDK v2.0.2 `DbConnection.builder()` with `withUri("https://maincloud.spacetimedb.com")` and `withDatabaseName("spacetimeclaude-gvhsi")`. Git remote via `git config --get remote.origin.url`. Project lookup by `project.git_remote_url` unique field after subscription. |
| CLI-11 | JSON output mode for machine consumption by agents | Commander.js global `--json` option. Envelope format `{ ok, data/error }` with BigInt-to-string serialization. Custom output helper wrapping `JSON.stringify` with BigInt replacer. |
| CLI-12 | Installable to `~/.claude/bin/stclaude` | esbuild bundles to single `.mjs` file with `#!/usr/bin/env node` shebang via `--banner:js`. Install script creates `~/.claude/bin/` directory and symlinks or copies the built file. `chmod +x` for direct execution. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| commander | ^14.0.0 | CLI framework (commands, options, help) | 500M+ weekly downloads, zero deps, built-in TS types, global option propagation, trivial subcommand extension |
| spacetimedb | ^2.0.2 | SpacetimeDB client SDK (already installed) | Required for DB connection; already in project dependencies |
| esbuild | ^0.24.0 | Bundle to single-file CLI (already installed) | Already in project devDependencies; fast, proven for this exact use case |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @commander-js/extra-typings | ^14.0.0 | Infer strong types for action handler params and `.opts()` | Optional but recommended for type-safe option access in action handlers |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| commander | yargs | More powerful validation but larger dependency tree, more complex API |
| commander | clipanion | Type-safe class-based commands but class syntax is heavier for simple CLIs |
| commander | citty/cmd-ts | Newer, TS-first but smaller ecosystems, less documentation |
| esbuild bundle + node | Node.js SEA (Single Executable Application) | True standalone binary but adds complexity, requires Node 20+, CJS-only for SEA |
| esbuild bundle + node | bun build --compile | Native binary but introduces bun runtime dependency; project uses Node.js |

**Installation:**
```bash
cd spacetimeclaude
bun add commander
# Optional: bun add -d @commander-js/extra-typings
```

## Architecture Patterns

### Recommended Project Structure
```
spacetimeclaude/
  src/
    cli/
      index.ts          # CLI entrypoint (program definition, parse args)
      commands/
        status.ts       # Default command (bare stclaude)
      lib/
        connection.ts   # SpacetimeDB connection helper (connect, subscribe, wait, return data)
        git.ts          # Git remote URL detection
        output.ts       # JSON envelope / human output formatting
        errors.ts       # Error types and exit codes
    module_bindings/    # (regenerated) SpacetimeDB generated types
    main.ts             # Existing demo file (can be removed or kept)
  dist/
    stclaude.mjs        # Bundled CLI output
  package.json
```

### Pattern 1: Connect-Per-Command
**What:** Each CLI invocation connects to SpacetimeDB, subscribes to required tables, reads data once subscription is applied, then disconnects and exits.
**When to use:** Every CLI command. This is the only strategy for v1.
**Why:** CLI commands are short-lived. SpacetimeDB subscriptions deliver initial data in the `onApplied` callback within milliseconds. No need for persistent connections or caching.
**Example:**
```typescript
// Source: SpacetimeDB TypeScript SDK docs + existing src/main.ts pattern
import { DbConnection } from '../module_bindings/index.js';

export async function withConnection<T>(
  fn: (conn: DbConnection) => T | Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const conn = DbConnection.builder()
      .withUri('https://maincloud.spacetimedb.com')
      .withDatabaseName('spacetimeclaude-gvhsi')
      .onConnect(async (conn) => {
        try {
          conn.subscriptionBuilder()
            .onApplied(async () => {
              try {
                const result = await fn(conn);
                conn.disconnect();
                resolve(result);
              } catch (err) {
                conn.disconnect();
                reject(err);
              }
            })
            .onError((_ctx, err) => {
              conn.disconnect();
              reject(err);
            })
            .subscribe('SELECT * FROM project');
        } catch (err) {
          conn.disconnect();
          reject(err);
        }
      })
      .onConnectError((_ctx, err) => reject(err))
      .build();
  });
}
```

### Pattern 2: Git Remote Resolution
**What:** Detect git remote URL from the current working directory using `git config --get remote.origin.url`, then look up the project in SpacetimeDB by matching `project.git_remote_url`.
**When to use:** Every CLI invocation. The git remote is the project identity key.
**Example:**
```typescript
import { execSync } from 'node:child_process';

export function getGitRemoteUrl(): string {
  try {
    return execSync('git config --get remote.origin.url', {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();
  } catch {
    throw new CliError(
      'NOT_GIT_REPO',
      'Not in a git repository with a remote. Run from a git repo with an origin remote.'
    );
  }
}
```

### Pattern 3: JSON Envelope Output
**What:** All command output passes through an output helper that switches between human-readable one-liners and JSON envelope format based on the `--json` flag.
**When to use:** Every command's output path.
**Example:**
```typescript
// BigInt-safe JSON serialization
function bigintReplacer(_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value;
}

export function outputSuccess(data: unknown, opts: { json: boolean }): void {
  if (opts.json) {
    console.log(JSON.stringify({ ok: true, data }, bigintReplacer));
  } else {
    // Each command provides its own human formatter
    console.log(formatHuman(data));
  }
}

export function outputError(code: string, message: string, opts: { json: boolean }): void {
  if (opts.json) {
    console.log(JSON.stringify({ ok: false, error: { code, message } }));
  } else {
    console.error(`Error: ${message}`);
  }
  process.exit(1);
}
```

### Pattern 4: Commander Global Options
**What:** Define `--json` as a global option on the root program so all subcommands inherit it.
**When to use:** CLI program setup.
**Example:**
```typescript
import { Command } from 'commander';

const program = new Command()
  .name('stclaude')
  .description('SpacetimeClaude CLI - structured project state for Claude Code agents')
  .version('0.0.1')
  .option('--json', 'Output machine-readable JSON envelope', false);

// Subcommands inherit program-level options
// Access in action handler via program.opts().json
```

### Anti-Patterns to Avoid
- **Long-lived SpacetimeDB connections:** CLI tools should connect, read, disconnect. Do not keep a background daemon or socket open.
- **Manual WebSocket management:** The SpacetimeDB SDK handles WebSocket internally. Do not import `ws` or use raw WebSocket APIs.
- **Positional reducer arguments:** Always use object syntax `{ param: value }` (project CLAUDE.md rule).
- **BigInt in JSON.stringify without replacer:** Will throw "Do not know how to serialize a BigInt". Always use a BigInt replacer.
- **Iterating tables with `.iter()` in generated bindings client-side:** Use `conn.db.tableName.iter()` which returns all cached rows. Fine for CLI reads after subscription applied.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CLI argument parsing | Custom argv parsing | Commander.js | Edge cases: help generation, option validation, error messages, subcommand routing |
| Git remote detection | Custom .git/config parser | `git config --get remote.origin.url` via `execSync` | Handles all git configurations (SSH, HTTPS, bare repos, worktrees) |
| JSON serialization with BigInt | Custom recursive serializer | `JSON.stringify` with replacer function | Standard API, handles nested objects, arrays, edge cases |
| WebSocket connection | Raw WebSocket + reconnection logic | SpacetimeDB SDK `DbConnection.builder()` | Protocol handling, BSATN deserialization, subscription management |
| Single-file bundling | Webpack, Rollup, manual concatenation | esbuild `--bundle --platform=node` | Already in project, sub-second builds, handles ESM/CJS, tree-shaking |

**Key insight:** The SpacetimeDB SDK and esbuild do the heavy lifting. The CLI is thin glue code: parse args, connect, read, format, exit.

## Common Pitfalls

### Pitfall 1: SpacetimeDB Subscription Not Applied Before Reading Data
**What goes wrong:** Code tries to read table data immediately after `.build()`, before the subscription's `onApplied` callback fires. Results in empty data.
**Why it happens:** Connection is async. `build()` returns immediately; data arrives via WebSocket later.
**How to avoid:** Always read data inside the `onApplied` callback, or wrap the connect-subscribe-read cycle in a Promise.
**Warning signs:** Commands returning empty results, intermittent missing data.

### Pitfall 2: BigInt Serialization in JSON Output
**What goes wrong:** `JSON.stringify` throws "Do not know how to serialize a BigInt" when objects contain `BigInt` values from SpacetimeDB `u64` fields.
**Why it happens:** SpacetimeDB IDs (project_id, phase_id, etc.) are `u64` which map to JavaScript `BigInt`. JSON.stringify does not handle BigInt natively.
**How to avoid:** Use a custom replacer function that converts BigInt to string. Apply it consistently through the output helper.
**Warning signs:** Unhandled exceptions when using `--json` flag.

### Pitfall 3: Git Remote URL Normalization
**What goes wrong:** The git remote URL in the repo doesn't exactly match what's stored in SpacetimeDB's `project.git_remote_url`. For example, SSH vs HTTPS formats, trailing `.git`, or different hostname casing.
**Why it happens:** Git remotes can be configured in multiple formats: `git@github.com:user/repo.git`, `https://github.com/user/repo.git`, `https://github.com/user/repo`.
**How to avoid:** Store a canonical form. Consider normalizing: lowercase hostname, strip trailing `.git`, convert SSH to HTTPS format. Or simply document that the remote URL must match exactly as seeded.
**Warning signs:** "Project not found" errors when the project exists but was seeded with a different URL format.

### Pitfall 4: esbuild ESM Output Needing CJS Shims
**What goes wrong:** Bundled ESM output (`--format=esm`) cannot use `__dirname`, `__filename`, or `require()` which some dependencies may need.
**Why it happens:** ESM modules don't have these CJS globals. The spacetimedb SDK or its transitive dependencies might use them.
**How to avoid:** Use `--format=esm --platform=node` and add a banner with `import.meta.url` based shims if needed. Alternatively, use `--format=cjs` if ESM causes issues. Test the bundled output.
**Warning signs:** Runtime errors about `__dirname is not defined` or `require is not a function`.

### Pitfall 5: Process Not Exiting After Disconnect
**What goes wrong:** The Node.js process hangs after `conn.disconnect()` because event loop has active handles (timers, sockets).
**Why it happens:** SpacetimeDB SDK may leave internal timers or handles. Node.js won't exit while the event loop has work.
**How to avoid:** Call `process.exit(0)` explicitly after getting the data. CLI tools should always exit explicitly rather than waiting for the event loop to drain.
**Warning signs:** CLI command completes output but terminal hangs, requiring Ctrl+C.

### Pitfall 6: Module Bindings Out of Date
**What goes wrong:** The generated `src/module_bindings/` contains types from the old demo (person table) rather than the actual schema (project, phase, plan, etc.).
**Why it happens:** Module bindings were generated against the initial demo, not after Phase 1 schema changes.
**How to avoid:** Regenerate bindings before starting Phase 2 implementation: `spacetime generate --lang typescript --out-dir src/module_bindings --module-path spacetimedb`. This must happen after the schema is published.
**Warning signs:** TypeScript compilation errors, missing table types, `conn.db.project` not found.

## Code Examples

### Full CLI Entrypoint Skeleton
```typescript
// Source: Commander.js docs + SpacetimeDB patterns from existing codebase
import { Command } from 'commander';
import { getGitRemoteUrl } from './lib/git.js';
import { withConnection } from './lib/connection.js';
import { outputSuccess, outputError } from './lib/output.js';

const program = new Command()
  .name('stclaude')
  .description('SpacetimeClaude - structured project state for Claude Code agents')
  .version('0.0.1')
  .option('--json', 'Output machine-readable JSON envelope', false);

// Default action (bare `stclaude`)
program.action(async () => {
  const opts = program.opts<{ json: boolean }>();
  try {
    const remoteUrl = getGitRemoteUrl();
    const status = await withConnection(async (conn) => {
      // Find project by git remote URL
      for (const p of conn.db.project.iter()) {
        if (p.gitRemoteUrl === remoteUrl) {
          // Found project -- get state
          const states = [...conn.db.projectState.iter()].filter(
            s => s.projectId === p.id
          );
          return { project: p, state: states[0] ?? null };
        }
      }
      return null;
    });

    if (!status) {
      outputError('PROJECT_NOT_FOUND', `No project found for remote: ${remoteUrl}`, opts);
      return;
    }

    outputSuccess(status, opts);
  } catch (err) {
    outputError('INTERNAL_ERROR', String(err), opts);
  }
});

program.parseAsync();
```

### esbuild Build Script
```bash
# Bundle CLI to single file with shebang
esbuild src/cli/index.ts \
  --bundle \
  --platform=node \
  --format=esm \
  --target=node22 \
  --outfile=dist/stclaude.mjs \
  --banner:js='#!/usr/bin/env node'

chmod +x dist/stclaude.mjs
```

### Install Script
```bash
#!/bin/bash
# Install stclaude to Claude Code's PATH
mkdir -p ~/.claude/bin
cp dist/stclaude.mjs ~/.claude/bin/stclaude
chmod +x ~/.claude/bin/stclaude
echo "Installed stclaude to ~/.claude/bin/stclaude"
```

### SpacetimeDB Table Access After Subscription (Client-Side)
```typescript
// Source: SpacetimeDB TypeScript SDK docs
// After onApplied fires, all subscribed rows are in the client cache

// Iterate all rows in a table
for (const project of conn.db.project.iter()) {
  console.log(project.name, project.gitRemoteUrl);
}

// Count rows
const count = conn.db.phase.count();

// Note: table names are auto-converted from snake_case to camelCase
// Schema: table({ name: 'project_state' }) -> conn.db.projectState
// Schema: table({ name: 'plan_task' })     -> conn.db.planTask
```

### JSON Envelope with Metadata
```typescript
// Recommended metadata fields for agent consumption
interface Envelope<T> {
  ok: true;
  data: T;
  meta?: {
    project: string;       // git remote URL
    database: string;      // SpacetimeDB database name
    timestamp: string;     // ISO 8601
    version: string;       // CLI version
    elapsed_ms: number;    // Command execution time
  };
}

interface ErrorEnvelope {
  ok: false;
  error: {
    code: string;          // Machine-readable error code
    message: string;       // Human-readable description
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@clockworklabs/spacetimedb-sdk` | `spacetimedb` (v2.0.2) | SpacetimeDB 1.4.0+ | Different import paths, package name change |
| Manual WebSocket (`ws` package) | Node.js 22 built-in `WebSocket` | Node.js 21+ (experimental), 22+ (stable) | No extra dependency needed for SpacetimeDB SDK in Node.js |
| Commander.js v12 | Commander.js v14 | Late 2024 | Better TypeScript support, ESM ready, `@commander-js/extra-typings` companion |
| `withModuleName()` | `withDatabaseName()` | SpacetimeDB SDK v2.0 | Builder API change; `withDatabaseName` is the current method |

**Deprecated/outdated:**
- `@clockworklabs/spacetimedb-sdk`: Replaced by `spacetimedb` package. Do not use.
- `ws` npm package for WebSocket: Not needed on Node.js 22+. The SpacetimeDB SDK uses native WebSocket.
- Commander.js v15 (ESM-only): Planned for May 2026. Stick with v14 which supports both CJS and ESM.

## Open Questions

1. **Module bindings regeneration timing**
   - What we know: Current `src/module_bindings/` has demo types (person table), not the Phase 1 schema.
   - What's unclear: Has the module been published to maincloud yet? If not, `spacetime generate` needs a published module or local server.
   - Recommendation: Before Phase 2 implementation begins, ensure the module is published and bindings are regenerated. This may be a Wave 0 / pre-task.

2. **`~/.claude/bin` on PATH**
   - What we know: `~/.claude/bin/` does not currently exist on this system. Claude Code's own binary lives at `~/.local/bin/claude`.
   - What's unclear: Does Claude Code automatically add `~/.claude/bin/` to its PATH when running agents? Or does the user need to add it to their shell profile?
   - Recommendation: The install script should create the directory and log instructions. If `~/.claude/bin` is not on PATH, add a note to the user's shell profile. Investigate whether Claude Code's agent runner already includes it.

3. **Subscription scope for CLI commands**
   - What we know: `subscribeToAll()` subscribes to every public table. Individual table subscriptions are possible with SQL.
   - What's unclear: For a status command, do we need all tables or just `project` + `project_state`? Subscribing to all tables is simpler but sends more data over the wire.
   - Recommendation: Start with `subscribeToAll()` for simplicity. Optimize to per-command subscription lists in Phase 3+ if latency becomes an issue. For maincloud, the data volume is small (single project, ~20 rows total).

4. **Exit codes**
   - What we know: The user wants error and exit when not in a git repo.
   - What's unclear: What specific exit codes to use for different error types.
   - Recommendation: Use standard conventions: 0 = success, 1 = general error, 2 = usage error (bad args). Map error codes: `NOT_GIT_REPO` -> 1, `PROJECT_NOT_FOUND` -> 1, `CONNECTION_FAILED` -> 1, usage errors -> 2.

## Sources

### Primary (HIGH confidence)
- SpacetimeDB TypeScript SDK v2.0.2 `package.json` -- inspected locally, verified exports, dependencies, version
- SpacetimeDB [TypeScript Reference](https://spacetimedb.com/docs/sdks/typescript/) -- DbConnection builder API, subscription patterns, table access
- SpacetimeDB [Connection docs](https://spacetimedb.com/docs/clients/connection/) -- maincloud URI `https://maincloud.spacetimedb.com`, `withDatabaseName()` API
- Existing codebase `src/main.ts`, `spacetimedb/src/schema.ts`, `spacetimedb/src/index.ts` -- established patterns, table definitions, reducer signatures
- `spacetime.json` -- database name `spacetimeclaude-gvhsi`, server `maincloud`
- Node.js 22 built-in WebSocket -- verified via `typeof globalThis.WebSocket === 'function'`
- Commander.js [npm](https://www.npmjs.com/package/commander) -- v14.0.3 latest, zero deps, built-in TS types

### Secondary (MEDIUM confidence)
- esbuild [API docs](https://esbuild.github.io/api/) -- `--banner:js`, `--platform=node`, `--format=esm` flags for CLI bundling
- [SpacetimeDB TypeScript Quickstart](https://spacetimedb.com/docs/sdks/typescript/quickstart/) -- `withModuleName` shown but `withDatabaseName` confirmed in SDK type definitions
- Commander.js [GitHub](https://github.com/tj/commander.js) -- global options propagation, subcommand patterns

### Tertiary (LOW confidence)
- `~/.claude/bin` PATH behavior -- no official documentation found; based on web search of Claude Code GitHub issues. Needs validation during implementation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Commander.js and esbuild are well-established; SpacetimeDB SDK verified locally
- Architecture: HIGH -- Connect-per-command pattern is standard for CLI tools; esbuild bundling already proven in this project
- Pitfalls: HIGH -- All pitfalls verified against actual SDK types, Node.js behavior, and SpacetimeDB documentation
- Open questions: MEDIUM -- Module binding regeneration and `~/.claude/bin` PATH need practical validation

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (stable domain, low churn)
