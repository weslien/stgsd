# Phase 6: v1.0 Gap Closure & Tech Debt - Research

**Researched:** 2026-03-03
**Domain:** CLI installation, ROADMAP maintenance, code deduplication
**Confidence:** HIGH

## Summary

Phase 6 addresses four discrete items identified by the v1.0 milestone audit. All four are straightforward code changes with no external dependencies or new libraries. The work falls into two categories: (1) closing the CLI-12 requirement gap where the installed binary is `stclaude.mjs` but the requirement specifies `stclaude` without extension, and (2) fixing accumulated tech debt -- a stale ROADMAP checkbox, duplicated `waitForStateUpdate` helper across three mutation commands, and inlined project lookup in `status.ts`.

The codebase is small (8 command files, 4 lib files) and all changes are localized refactors. No architectural decisions needed. No new dependencies.

**Primary recommendation:** Use a symlink (`stclaude -> stclaude.mjs`) for CLI-12, extract `waitForStateUpdate` to `lib/project.ts`, and refactor `status.ts` to use existing shared helpers.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLI-12 | Installable to `~/.claude/bin/stclaude` | Symlink approach verified -- Node.js v22 follows symlinks and detects `.mjs` extension on the target. See "CLI-12 Symlink" section. |
</phase_requirements>

## Standard Stack

No new libraries needed. All changes use existing project dependencies.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | v22.22.0 | Runtime | Already installed, ESM support mature |
| esbuild | ^0.24.0 | Bundling | Already used by build:cli script |
| Commander.js | ^14.0.3 | CLI framework | Already used by all commands |

### Supporting
No additional libraries needed for this phase.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Symlink for stclaude | Shell wrapper script (`#!/bin/sh; exec node stclaude.mjs "$@"`) | Wrapper adds indirection and a second file to maintain. Symlink is simpler and verified to work. |
| Symlink for stclaude | Rename to `.mjs` and add package.json with `"type": "module"` in `~/.claude/bin/` | Fragile -- depends on package.json not being removed. Symlink is self-contained. |

## Architecture Patterns

### Pattern 1: Shared Helper Extraction

**What:** Move duplicated `waitForStateUpdate` function from three command files into `lib/project.ts` as a shared export.

**When to use:** Any function that appears identically in 2+ command files.

**Current state (duplication):**
```
src/cli/commands/advance-plan.ts   -> local waitForStateUpdate (lines 9-36)
src/cli/commands/update-progress.ts -> local waitForStateUpdate (lines 9-36)
src/cli/commands/record-metric.ts   -> local waitForStateUpdate (lines 9-36)
```

**Target state:**
```
src/cli/lib/project.ts             -> export function waitForStateUpdate(...)
src/cli/commands/advance-plan.ts   -> import { waitForStateUpdate } from '../lib/project.js'
src/cli/commands/update-progress.ts -> import { waitForStateUpdate } from '../lib/project.js'
src/cli/commands/record-metric.ts   -> import { waitForStateUpdate } from '../lib/project.js'
```

**The function signature is identical across all three files:**
```typescript
function waitForStateUpdate(
  conn: DbConnection,
  projectId: bigint,
  timeoutMs = 5000,
): Promise<void>
```

It registers `onUpdate` and `onInsert` listeners on `conn.db.projectState`, resolving when a matching `projectId` is seen, with a configurable timeout.

### Pattern 2: status.ts Refactoring to Use Shared Helpers

**What:** Replace inline `conn.db.project.iter()` loop in `status.ts` with `findProjectByGitRemote` from `lib/project.ts`. Also replace inline `conn.db.projectState.iter()` loop with `findProjectState`.

**Current state (inlined lookups in status.ts):**
```typescript
// Lines 76-81: Inline project lookup
let foundProject = null;
for (const row of conn.db.project.iter()) {
  if (row.gitRemoteUrl === gitRemoteUrl) {
    foundProject = row;
    break;
  }
}

// Lines 92-97: Inline projectState lookup
let foundState = null;
for (const row of conn.db.projectState.iter()) {
  if (row.projectId === foundProject.id) {
    foundState = row;
    break;
  }
}
```

**Target state:** Import and use shared helpers:
```typescript
import { findProjectByGitRemote, findProjectState } from '../lib/project.js';

// Replace inline loops with:
const project = findProjectByGitRemote(conn, gitRemoteUrl);
const state = findProjectState(conn, project.id);
```

**Important note:** `findProjectByGitRemote` throws `CliError` on not-found, while the current inline code sets `foundProject = null` and throws manually. The behavior is equivalent -- the shared helper throws the same error. But the `status.ts` error handling try/catch already catches `CliError`, so this is a safe swap.

For `findProjectState`, the shared helper returns `null` when no state exists, which matches the current inline behavior exactly.

### Pattern 3: Symlink Installation

**What:** Add a symlink `~/.claude/bin/stclaude -> stclaude.mjs` as part of the `install:cli` npm script.

**Verified behavior:** Node.js v22.22.0 resolves symlinks and uses the target file's extension for module type detection. A symlink named `stclaude` pointing to `stclaude.mjs` correctly executes as ESM.

**Current install:cli script:**
```json
"install:cli": "bun run build:cli && mkdir -p ~/.claude/bin && cp dist/stclaude.mjs ~/.claude/bin/stclaude.mjs && chmod +x ~/.claude/bin/stclaude.mjs"
```

**Target install:cli script:**
```json
"install:cli": "bun run build:cli && mkdir -p ~/.claude/bin && cp dist/stclaude.mjs ~/.claude/bin/stclaude.mjs && chmod +x ~/.claude/bin/stclaude.mjs && ln -sf stclaude.mjs ~/.claude/bin/stclaude"
```

The `-sf` flags ensure the symlink is created (or replaced if it already exists) and uses a relative target path so it works regardless of the user's home directory.

### Anti-Patterns to Avoid
- **Renaming the .mjs file to have no extension:** Node.js needs the `.mjs` extension for ESM detection. The current decision to keep `.mjs` is correct.
- **Adding a package.json in ~/.claude/bin/:** Fragile and interferes with other tools in that directory.
- **Refactoring status.ts phase/plan iteration into shared helpers:** The phase/plan iteration in `status.ts` is specific to the status command's data shape (collecting arrays). Only the project and projectState lookups should be refactored.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Project lookup | Inline `conn.db.project.iter()` loop | `findProjectByGitRemote(conn, url)` | Already exists in `lib/project.ts`, tested in 7 other commands |
| ProjectState lookup | Inline `conn.db.projectState.iter()` loop | `findProjectState(conn, projectId)` | Already exists in `lib/project.ts`, tested in 4 other commands |
| State update waiting | Copy-paste `waitForStateUpdate` per file | Shared export from `lib/project.ts` | Identical implementation in 3 files, same signature |

**Key insight:** All "solutions" already exist in the codebase. This phase is purely about using them consistently.

## Common Pitfalls

### Pitfall 1: Symlink Target Path
**What goes wrong:** Using an absolute path in the symlink breaks for other users.
**Why it happens:** `ln -s /Users/gustav/.claude/bin/stclaude.mjs stclaude` bakes in the absolute path.
**How to avoid:** Use relative target: `ln -sf stclaude.mjs ~/.claude/bin/stclaude`. The symlink resolves relative to its directory.
**Warning signs:** Symlink works on dev machine but fails for other users.

### Pitfall 2: Removing waitForStateUpdate Import Without Adding New One
**What goes wrong:** TypeScript compilation fails with "cannot find name 'waitForStateUpdate'".
**Why it happens:** Deleting the local function but forgetting to add the import.
**How to avoid:** Add the import to the import block BEFORE removing the local function definition.
**Warning signs:** `npx tsc --noEmit` errors.

### Pitfall 3: status.ts Error Handling Difference
**What goes wrong:** `findProjectByGitRemote` throws `CliError` with `PROJECT_NOT_FOUND`, which is already caught by the existing try/catch. No pitfall here -- just verify the catch block handles `CliError`.
**Why it matters:** The current inline code has an explicit null check + throw. The shared helper throws directly. The behavior is identical.
**How to avoid:** Verify the existing catch block pattern in `status.ts` matches the other commands (it does).

### Pitfall 4: ROADMAP Checkbox Only for 02-02
**What goes wrong:** Over-editing the ROADMAP and changing phase-level checkboxes (Phase 2, Phase 3) that should remain unchecked until all plans in those phases are complete.
**Why it happens:** Phase 2 still has overall `[ ]` because CLI-12 was partial. Phase 3 plans show `0/?` in progress table. The success criterion only mentions "02-02-PLAN.md checkbox."
**How to avoid:** Only change the specific line `- [ ] 02-02-PLAN.md` to `- [x] 02-02-PLAN.md`. Do not touch phase-level checkboxes or progress table.
**Warning signs:** Diff shows changes to lines other than the 02-02 plan checkbox.

## Code Examples

### Shared waitForStateUpdate (to be added to lib/project.ts)
```typescript
// Source: Extracted from spacetimeclaude/src/cli/commands/advance-plan.ts (lines 9-36)
// Identical copies exist in update-progress.ts and record-metric.ts

/**
 * Wait for a project state update via subscription callback.
 * Registers onUpdate and onInsert listeners, resolves when matching projectId seen.
 * Rejects after timeoutMs (default 5000ms).
 */
export function waitForStateUpdate(
  conn: DbConnection,
  projectId: bigint,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new CliError(
          ErrorCodes.INTERNAL_ERROR,
          'State update timed out after 5 seconds',
        ),
      );
    }, timeoutMs);

    const done = () => {
      clearTimeout(timer);
      resolve();
    };

    conn.db.projectState.onUpdate((_ctx, _oldRow, newRow) => {
      if (newRow.projectId === projectId) done();
    });
    conn.db.projectState.onInsert((_ctx, newRow) => {
      if (newRow.projectId === projectId) done();
    });
  });
}
```

### Updated status.ts project/state lookup
```typescript
// Source: Pattern from all other commands (get-state.ts, advance-plan.ts, etc.)

import { findProjectByGitRemote, findProjectState } from '../lib/project.js';

// Replace lines 73-97 with:
const project = findProjectByGitRemote(conn, gitRemoteUrl);
const state = findProjectState(conn, project.id);
```

### Updated install:cli script
```json
"install:cli": "bun run build:cli && mkdir -p ~/.claude/bin && cp dist/stclaude.mjs ~/.claude/bin/stclaude.mjs && chmod +x ~/.claude/bin/stclaude.mjs && ln -sf stclaude.mjs ~/.claude/bin/stclaude"
```

### ROADMAP.md fix (single line)
```diff
-  - [ ] 02-02-PLAN.md -- Default command (get-state) and install script
+  - [x] 02-02-PLAN.md -- Default command (get-state) and install script
```

## State of the Art

Not applicable -- this phase involves no external libraries or evolving APIs. All changes are internal refactors using established patterns already present in the codebase.

## Open Questions

None. All four success criteria are well-defined and have clear implementation paths verified by code inspection and runtime testing.

## Sources

### Primary (HIGH confidence)
- **Codebase inspection** -- All source files read directly: `status.ts`, `advance-plan.ts`, `update-progress.ts`, `record-metric.ts`, `project.ts`, `connection.ts`, `errors.ts`, `output.ts`, `package.json`, `cli/index.ts`
- **v1.0 Milestone Audit** (`.planning/v1.0-MILESTONE-AUDIT.md`) -- Identified all four tech debt items
- **Runtime verification** -- Symlink approach tested on actual `~/.claude/bin/stclaude.mjs` with Node.js v22.22.0: `ln -sf stclaude.mjs stclaude && ./stclaude --version` outputs `0.0.1`

### Secondary (MEDIUM confidence)
None needed -- all findings verified against actual codebase and runtime.

### Tertiary (LOW confidence)
None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, all existing dependencies
- Architecture: HIGH -- all patterns already established in codebase, verified by reading 12 source files
- Pitfalls: HIGH -- all edge cases identified and verified by runtime testing (symlink) and code inspection (refactoring safety)

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (30 days -- stable, no external dependencies)
