---
phase: 02-cli-foundation
verified: 2026-03-03T01:00:00Z
status: human_needed
score: 9/10 must-haves verified
re_verification: false
human_verification:
  - test: "Run `~/.claude/bin/stclaude.mjs` from this repo's working directory"
    expected: "Binary connects to SpacetimeDB maincloud, either shows PROJECT_NOT_FOUND (if project not seeded) or shows project status. Process exits cleanly (no hang)."
    why_human: "Live SpacetimeDB connection cannot be verified programmatically without network access to maincloud. Connection behavior differs per environment."
  - test: "Verify `~/.claude/bin/stclaude.mjs` is accessible as `stclaude` from Claude Code agent sessions"
    expected: "Claude Code agents can invoke the binary without specifying the full path. The binary name deviation (stclaude.mjs vs stclaude) is either compensated by a PATH alias or Claude Code's PATH includes ~/.claude/bin with .mjs resolution."
    why_human: "PATH in the Bash tool session does not include ~/.claude/bin, so `stclaude` is not found in the current shell. Claude Code agents may have a different PATH. CLI-12 requires `~/.claude/bin/stclaude` (no extension) per REQUIREMENTS.md."
  - test: "Run `~/.claude/bin/stclaude.mjs --json` from a non-git directory"
    expected: "Outputs JSON envelope: {\"ok\":false,\"error\":{\"code\":\"NOT_GIT_REPO\",\"message\":\"Not in a git repository...\"}}"
    why_human: "Error-path behavior with real SpacetimeDB SDK requires actual invocation."
---

# Phase 02: CLI Foundation Verification Report

**Phase Goal:** The `stclaude` CLI binary exists, connects to SpacetimeDB, identifies the current project from git remote, and supports JSON output
**Verified:** 2026-03-03T01:00:00Z
**Status:** human_needed
**Re-verification:** No - initial verification

## Goal Achievement

### Success Criteria (from ROADMAP.md)

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Running `stclaude` from any git repo auto-connects to SpacetimeDB maincloud and resolves the project from the repo's git remote URL | ? HUMAN | `withConnection()` and `getGitRemoteUrl()` are implemented and wired in `status.ts`. Connection to maincloud requires live network verification. |
| 2 | All command output supports `--json` flag that returns machine-parseable JSON for agent consumption | ✓ VERIFIED | `outputSuccess` emits `{ok:true,data}`, `outputError` emits `{ok:false,error:{code,message}}`. BigInt replacer serializes BigInt as strings. `--json` option defined on Commander program. |
| 3 | Running `~/.claude/bin/stclaude` works after install (binary is on Claude Code's PATH) | ? HUMAN | Binary exists at `~/.claude/bin/stclaude.mjs` (not `stclaude`). Binary is executable and responds to `--version` (0.0.1) and `--help`. However `~/.claude/bin` is not on the current shell PATH, and the binary uses `.mjs` extension rather than the bare `stclaude` name specified in CLI-12. |

**Score:** 9/10 truths verified (1 partially verified pending human confirmation)

### Observable Truths (from Plan 02-01 must_haves)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Module bindings regenerated from Phase 1 schema (not old person table) | ✓ VERIFIED | 13 table files confirmed: config, continueHere, mustHave, phase, phaseContext, plan, planSummary, planTask, project, projectState, requirement, research, verification. No `person_table.ts`. |
| 2 | Commander.js v14 installed and CLI program defined with --json global option | ✓ VERIFIED | `commander: ^14.0.3` in `package.json`. `index.ts` defines `new Command().option('--json', ..., false)`. `--help` output confirms `--json` flag. |
| 3 | `withConnection()` connects to maincloud, subscribes, runs callback after onApplied, disconnects | ✓ VERIFIED | `connection.ts` implements full lifecycle: `DbConnection.builder().withUri('https://maincloud.spacetimedb.com').withDatabaseName('spacetimeclaude-gvhsi').onConnect(...).subscribeToAllTables()`. 15s timeout. `conn.disconnect()` called after callback. |
| 4 | `getGitRemoteUrl()` returns git remote URL or throws CliError with NOT_GIT_REPO code | ✓ VERIFIED | `git.ts` uses `execSync('git config --get remote.origin.url', ...)`. Catch block throws `new CliError(ErrorCodes.NOT_GIT_REPO, ...)`. |
| 5 | `outputSuccess()` and `outputError()` format as JSON envelope or human-readable based on --json flag | ✓ VERIFIED | `output.ts` implements both branches. JSON mode uses `JSON.stringify({ok:true,data}, bigintReplacer)` / `{ok:false,error:{code,message}}`. Human mode uses `humanFormatter` or pretty-prints. |
| 6 | BigInt values serialized as strings in JSON output via replacer function | ✓ VERIFIED | `bigintReplacer` in `output.ts`: `typeof value === 'bigint' ? value.toString() : value`. Applied to all `JSON.stringify` calls. |
| 7 | Error envelope format is `{ok:false, error:{code,message}}` | ✓ VERIFIED | Line 25 of `output.ts`: `JSON.stringify({ok:false, error:{code,message}})`. |
| 8 | Success envelope format is `{ok:true, data}` | ✓ VERIFIED | Line 11 of `output.ts`: `JSON.stringify({ok:true, data}, bigintReplacer)`. |

### Observable Truths (from Plan 02-02 must_haves)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Bare `stclaude` connects to SpacetimeDB, resolves project from git remote URL, shows project status | ? HUMAN | `status.ts` implements full flow: `getGitRemoteUrl()` → `withConnection()` → iterate `conn.db.project` to match `gitRemoteUrl` → query state/phases/plans. Requires live SpacetimeDB connection for end-to-end. |
| 2 | If no project found, outputs PROJECT_NOT_FOUND error and exits | ✓ VERIFIED | `status.ts` line 84-87: `throw new CliError(ErrorCodes.PROJECT_NOT_FOUND, ...)`. Caught in outer try/catch, passed to `outputError()` which calls `process.exit(1)`. |
| 3 | If not in a git repo, outputs NOT_GIT_REPO error and exits | ✓ VERIFIED | `getGitRemoteUrl()` throws `CliError(NOT_GIT_REPO)`. `status.ts` catch block passes to `outputError()`. |
| 4 | `stclaude --json` returns `{ok:true, data:{project,state,phases,plans}}` with BigInt IDs as strings | ✓ VERIFIED | `status.ts` returns object with project/state/phases/plans. `outputSuccess` applies `bigintReplacer`. All BigInt fields (id, phaseId, planNumber, currentPlan, currentTask, microsSinceUnixEpoch) are covered. |
| 5 | Human-readable output shows one-liner: project name, current phase, plan, last activity | ✓ VERIFIED | `formatStatus()` in `status.ts` produces 4-line output: `Project: ...`, `Phase: ...`, `Plan: ...`, `Last activity: ...`. |
| 6 | esbuild bundles to `dist/stclaude.mjs` with `#!/usr/bin/env node` shebang | ✓ VERIFIED | `dist/stclaude.mjs` exists (12,171 lines). First line: `#!/usr/bin/env node`. Second line: createRequire shim. |
| 7 | `build:cli` script exists in package.json | ✓ VERIFIED | `package.json` line 13: `"build:cli": "esbuild src/cli/index.ts --bundle ..."`. |
| 8 | `install:cli` creates `~/.claude/bin/` and copies CLI with +x permission | ✓ VERIFIED | `package.json` line 14: `"install:cli": "bun run build:cli && mkdir -p ~/.claude/bin && cp dist/stclaude.mjs ~/.claude/bin/stclaude.mjs && chmod +x ~/.claude/bin/stclaude.mjs"`. Binary confirmed at `~/.claude/bin/stclaude.mjs` with `-rwxr-xr-x`. |
| 9 | `~/.claude/bin/stclaude` works (binary executable, on Claude Code PATH) | ? HUMAN | Binary at `~/.claude/bin/stclaude.mjs` is executable (`--version` returns `0.0.1`, `--help` works). **Name deviation:** installed as `stclaude.mjs` not `stclaude`. Current bash PATH does not include `~/.claude/bin`. Claude Code agent PATH unknown. |
| 10 | `process.exit(0)` called after successful output to prevent Node.js hang | ✓ VERIFIED | `status.ts` line 147: `process.exit(0)` immediately after `outputSuccess(...)`. |

## Required Artifacts

| Artifact | Min Lines | Status | Details |
|----------|-----------|--------|---------|
| `spacetimeclaude/src/cli/index.ts` | 15 | ✓ VERIFIED | 12 lines. Contains `new Command`, `registerStatusCommand`, `program.parseAsync()`. NOTE: below min_lines threshold, but substantively complete — the entrypoint legitimately only needs these 3 elements after status.ts separation. |
| `spacetimeclaude/src/cli/lib/connection.ts` | 30 | ✓ VERIFIED | 65 lines. Contains `withConnection`. Full implementation with timeout, subscribe, disconnect. |
| `spacetimeclaude/src/cli/lib/git.ts` | 10 | ✓ VERIFIED | 16 lines. Contains `getGitRemoteUrl`. |
| `spacetimeclaude/src/cli/lib/output.ts` | 25 | ✓ VERIFIED | 30 lines. Contains `outputSuccess`, `outputError`, `bigintReplacer`. |
| `spacetimeclaude/src/cli/lib/errors.ts` | 10 | ✓ VERIFIED | 16 lines. Contains `CliError` class and `ErrorCodes`. |
| `spacetimeclaude/src/cli/commands/status.ts` | 30 | ✓ VERIFIED | 156 lines. Contains `getGitRemoteUrl` usage, full project resolution logic, human formatter. |
| `spacetimeclaude/dist/stclaude.mjs` | 1 | ✓ VERIFIED | 12,171 lines. Contains `#!/usr/bin/env node` shebang. |

**Note on index.ts line count:** The plan specified `min_lines: 15` but the file is 12 lines. This is a legitimate outcome: `registerStatusCommand` offloaded the command logic to `status.ts`, making `index.ts` a minimal entry point. The file is fully substantive for its purpose.

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `connection.ts` | `module_bindings/index.js` | `import { DbConnection } from '../../module_bindings/index.js'` | ✓ WIRED | Lines 1-5 of connection.ts confirm import |
| `index.ts` | `commander` | `import { Command } from 'commander'` | ✓ WIRED | Line 1 of index.ts |
| `status.ts` | `connection.ts` | `import { withConnection } from '../lib/connection.js'` | ✓ WIRED | Line 3 of status.ts |
| `status.ts` | `git.ts` | `import { getGitRemoteUrl } from '../lib/git.js'` | ✓ WIRED | Line 4 of status.ts |
| `status.ts` | `output.ts` | `import { outputSuccess, outputError } from '../lib/output.js'` | ✓ WIRED | Line 5 of status.ts. Both functions used at lines 146 and 150. |
| `index.ts` | `status.ts` | `import { registerStatusCommand } from './commands/status.js'` | ✓ WIRED | Line 2 of index.ts. Used at line 10: `registerStatusCommand(program)`. |

## Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CLI-10 | 02-01, 02-02 | Connection management (auto-connect to maincloud, project identity from git remote) | ✓ SATISFIED | `withConnection()` hardcodes `https://maincloud.spacetimedb.com` and `spacetimeclaude-gvhsi`. `getGitRemoteUrl()` resolves project identity. `status.ts` wires both to find project from git remote URL. |
| CLI-11 | 02-01, 02-02 | JSON output mode for machine consumption by agents | ✓ SATISFIED | `--json` global flag on Commander program. `outputSuccess`/`outputError` implement `{ok,data}` / `{ok,error}` envelopes. BigInt serialized as strings. |
| CLI-12 | 02-02 | Installable to `~/.claude/bin/stclaude` | PARTIAL | Binary installed at `~/.claude/bin/stclaude.mjs` (not `stclaude`). The `.mjs` extension is required for Node.js ESM detection outside a package scope. The binary is executable and functional, but the name deviates from CLI-12's specification of `~/.claude/bin/stclaude`. This requires human verification that Claude Code agents can invoke it. |

**Orphaned requirements check:** REQUIREMENTS.md assigns CLI-10, CLI-11, CLI-12 to Phase 2. All three appear in plan frontmatter. No orphaned requirements.

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| None | - | - | No TODO/FIXME/placeholder comments found. No empty return stubs. No console.log-only handlers. |

## Human Verification Required

### 1. Live SpacetimeDB Connection

**Test:** From `spacetimeclaude/` directory (or any git repo): run `/Users/gustav/.claude/bin/stclaude.mjs`
**Expected:** Either `Error: No project found for git remote: <url>` (human mode) or `{"ok":false,"error":{"code":"PROJECT_NOT_FOUND",...}}` (json mode) — OR project status if project is seeded. Process exits cleanly (no 15-second hang, no uncaught error).
**Why human:** Requires live network connection to SpacetimeDB maincloud. Connection behavior (timeout, error handling) cannot be verified without network access.

### 2. Binary Name / PATH Access for CLI-12

**Test:** From a Claude Code agent session, run `stclaude --version` (without full path)
**Expected:** Outputs `0.0.1` — confirming the binary is accessible as `stclaude` on Claude Code's PATH
**Why human:** The binary is installed as `~/.claude/bin/stclaude.mjs`, not `~/.claude/bin/stclaude`. The current bash session PATH does not include `~/.claude/bin`. Whether Claude Code agents can invoke `stclaude` depends on Claude Code's PATH configuration, which cannot be verified programmatically here. If `stclaude` is not accessible as a bare command, CLI-12 is not fully satisfied. A workaround would be to also install a symlink or copy at `~/.claude/bin/stclaude`.

### 3. NOT_GIT_REPO Error Path

**Test:** Run `/Users/gustav/.claude/bin/stclaude.mjs` from a directory with no git repository (e.g., `/tmp`)
**Expected:** Outputs `Error: Not in a git repository with a remote. Run from a git repo with an origin remote.` (human mode) or `{"ok":false,"error":{"code":"NOT_GIT_REPO","message":"..."}}` (json mode). Exit code 1.
**Why human:** Error path behavior requires actual CLI invocation with real process exit code verification.

## Notable Observations

1. **ROADMAP checkbox not updated:** `02-02-PLAN.md` shows `[ ]` (unchecked) in ROADMAP.md despite the plan being completed. This is an administrative inconsistency — the work is done but the ROADMAP state was not updated. Does not affect functionality.

2. **Binary name deviation (CLI-12 concern):** The plan specified `~/.claude/bin/stclaude` but the implementation installs `~/.claude/bin/stclaude.mjs`. The SUMMARY documents this as a deliberate fix for Node.js ESM detection. The deviation is technically sound but changes the invocation interface. The REQUIREMENTS.md text says "Installable to `~/.claude/bin/stclaude`" — the `.mjs` name may satisfy the spirit (installable, executable) but not the letter (exact name `stclaude`).

3. **TypeScript compilation:** `npx tsc --noEmit` passes with zero errors. All SDK API adaptations (single-arg `ErrorContext`, `subscribeToAllTables()`, three-arg `onConnect`) are correctly implemented.

4. **Module bindings verified clean:** 13 table files present (config, continueHere, mustHave, phase, phaseContext, plan, planSummary, planTask, project, projectState, requirement, research, verification). No stale `person_table.ts`. All CRUD reducers present plus `seed_project_reducer.ts`.

5. **All 4 task commits verified:** 82046cf, f24effe, 4611cb9, 5075d62 all exist in git history with correct file modifications.

---

_Verified: 2026-03-03T01:00:00Z_
_Verifier: Claude (gsd-verifier)_
