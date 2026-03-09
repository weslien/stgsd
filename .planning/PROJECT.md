# stgsd

## What This Is

A SpacetimeDB-backed replacement for GSD's file-based state management in Claude Code. GSD agents call a `stgsd` CLI that stores structured state in SpacetimeDB — giving Claude Code queryable, persistent memory that lives outside the repo.

## Core Value

GSD's planning state becomes structured, queryable data instead of flat files — eliminating the parsing overhead, file I/O bottlenecks, and repo pollution that slow down GSD workflows.

## Current Milestone: v1.2 Patch Completion & Verification

**Goal:** Ship the 4 remaining GSD workflow patches and build automated verification that all patches survive `/gsd:update`.

**Target features:**
- Patch pause-work/resume-work workflows to use stclaude session commands
- Patch add-phase/insert-phase/remove-phase workflows to use stclaude phase commands
- Patch add-todo/check-todos workflows to use stclaude todo commands
- Patch debug workflow to use stclaude debug commands
- Automated patch verification script (hash + content checks)

## Requirements

### Validated

- SpacetimeDB module with 13 tables covering GSD core loop state — v1.0
- Hybrid schema: structured metadata as typed columns, prose content as text fields — v1.0
- `stgsd` CLI tool with 17 commands backed by SpacetimeDB — v1.0
- Project identity derived from git remote URL (automatic, no manual config) — v1.0
- GSD agent local patches replacing file I/O with `stgsd` calls for core loop workflows — v1.0
- Patches survive `/gsd:update` via GSD's hash-based local patch system — v1.0
- Core loop coverage: progress, plan-phase, execute-phase, verify-work — v1.0
- CLI installed to `~/.claude/bin/` alongside existing gsd-tools — v1.0
- 6 new tables (milestone, milestone_audit, session_checkpoint, todo, debug_session, codebase_map) — v1.1
- Milestone lifecycle CLI (write-milestone, get-milestones, write-audit) — v1.1
- Phase management CLI (add-phase, insert-phase, remove-phase) with decimal numbering — v1.1
- Session checkpoint CLI (write-session, get-session) — v1.1
- Todo tracking CLI (add-todo, list-todos, complete-todo) — v1.1
- Debug session CLI (write-debug, get-debug, close-debug) — v1.1
- Codebase mapping CLI (write-codebase-map, get-codebase-map) and GSD patches — v1.1
- All 10 remaining GSD workflow files patched to use stclaude instead of gsd-tools.cjs — v1.1

### Active

- GSD patch for pause-work/resume-work workflows (SESS-04, SESS-05)
- GSD patch for add-phase/insert-phase/remove-phase workflows (PHSE-06, PHSE-07, PHSE-08)
- GSD patch for add-todo/check-todos workflows (TODO-05, TODO-06)
- GSD patch for debug workflow (DBG-05)
- Automated patch verification script with hash + content checks

### Out of Scope

- File-based fallback — clean break, dual-mode adds complexity
- React/web UI — CLI only, SpacetimeDB dashboard available for debugging
- Migration tool for existing .planning/ data — start fresh
- Multi-user collaboration — single Claude Code identity per project
- Cross-project intelligence — future v2+
- Multi-agent coordination via subscriptions — future v2+

## Context

**Current state:** v1.1 shipped (2026-03-09). 13,115 lines of TypeScript across 19 SpacetimeDB tables, 27+ CLI commands, and patches to 16+ GSD workflow files. Core loop and extended workflows (milestones, sessions, phases, todos, debug, codebase mapping) run on SpacetimeDB. 8 GSD workflow patches remain incomplete (session pause/resume, phase management workflows, todo workflows, debug workflow).

**Tech stack:** SpacetimeDB v2 TypeScript SDK, Commander.js, esbuild, Node.js 22+.

**Architecture:** `stclaude` CLI auto-detects project from git remote URL, connects to SpacetimeDB (local or maincloud), executes query/mutation, returns JSON. GSD agent `.md` files patched with targeted text replacements to call `stclaude` instead of `gsd-tools.cjs`.

## Constraints

- **Tech stack**: SpacetimeDB v2 TypeScript SDK, esbuild bundling
- **Hosting**: SpacetimeDB maincloud (free tier)
- **CLI runtime**: Node.js (must work in Claude Code's shell environment)
- **Patch compatibility**: Agent patches must be minimal text replacements that merge across GSD updates
- **No repo state**: All GSD state lives in SpacetimeDB for stgsd-managed projects

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| Option B: patch at agent layer | Agent .md files are plain text, easy diff/merge. Patching compiled .cjs is fragile. | Good — patches merge cleanly |
| Hybrid schema (structured + prose) | Full normalization loses prose value. Pure blobs lose queryability. | Good — best of both |
| Git remote URL for project identity | Automatic, no config needed. Same project across machines. | Good — zero friction |
| No file-based fallback | Clean break forces commitment, simplifies implementation. | Good — no dual-mode bugs |
| Core loop only for v1 | Hot path covers 90% of GSD usage. | Good — shipped in 3 days |
| CLI in ~/.claude/bin/ | Already on Claude's PATH, alongside gsd-tools.cjs. | Good — no install friction |
| snake_case table names | SpacetimeDB convention, auto-converted to camelCase for ctx.db. | Good |
| JSON string params for seed_project | Avoids nested SpacetimeDB type definitions. | Good — pragmatic |
| subscribeToAllTables() for CLI | Data volume is small per project. | Good — simple |
| Per-repo SpacetimeDB databases | Isolation between projects, independent lifecycle. | Good |
| Feature-area grouping for v1.1 | Schema+CLI+patch per phase, architecture already established | Good — parallel phases possible |
| Phase 12 added for workflow patch completion | Patching spanned feature phases, needed dedicated phase | Good — clean separation |
| Commander.js `-V` for CLI version flag | Avoids conflict with `--version` subcommand option | Good — write-milestone works |

---
*Last updated: 2026-03-09 after v1.2 milestone start*
