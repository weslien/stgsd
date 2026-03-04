# stgsd

## What This Is

A SpacetimeDB-backed replacement for GSD's file-based state management in Claude Code. GSD agents call a `stgsd` CLI that stores structured state in SpacetimeDB — giving Claude Code queryable, persistent memory that lives outside the repo.

## Core Value

GSD's planning state becomes structured, queryable data instead of flat files — eliminating the parsing overhead, file I/O bottlenecks, and repo pollution that slow down GSD workflows.

## Current Milestone: v1.1 Full Coverage

**Goal:** Extend SpacetimeDB coverage from core loop to all remaining GSD workflows — milestones, sessions, phases, todos, debug, and codebase mapping.

**Target features:**
- Milestone lifecycle (new, complete, audit) fully on SpacetimeDB
- Session management (pause/resume) with persistent handoff context
- Phase management (add/insert/remove) with decimal numbering
- Todo tracking with area classification and lifecycle
- Debug session persistence across context resets
- Codebase mapping storage (7 document types)

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

### Active

- Milestone table with version history, stats, and accomplishments
- Milestone audit table with gap tracking and tech debt
- Session checkpoint table for pause/resume handoff context
- Todo table with area classification and file references
- Debug session table for persistent state across context resets
- Codebase map table for 7 document types (stack, integrations, architecture, structure, conventions, testing, concerns)
- Phase table extension: decimal numbering, inserted flag
- Requirement table extension: validated_version tracking
- CLI commands for all new tables (milestone, todo, session, debug, codebase-map)
- GSD workflow patches: milestone lifecycle (new, complete, audit)
- GSD workflow patches: session management (pause, resume)
- GSD workflow patches: phase management (add, insert, remove)
- GSD workflow patches: todo tracking (add, check)
- GSD workflow patches: codebase mapping (map-codebase)
- GSD workflow patches: debug sessions

### Out of Scope

- File-based fallback — clean break, dual-mode adds complexity
- React/web UI — CLI only, SpacetimeDB dashboard available for debugging
- Migration tool for existing .planning/ data — start fresh
- Multi-user collaboration — single Claude Code identity per project
- Cross-project intelligence — future v2+
- Multi-agent coordination via subscriptions — future v2+

## Context

**Current state:** v1.0 shipped (2026-03-04). 4,771 lines of TypeScript across 13 SpacetimeDB tables, 17 CLI commands, and patches to 6 GSD files. Core loop (progress/plan/execute/verify) runs entirely on SpacetimeDB. v1.1 in progress — extending coverage to all remaining GSD workflows.

**Tech stack:** SpacetimeDB v2 TypeScript SDK, Commander.js, esbuild, Node.js 22+.

**Architecture:** `stgsd` CLI auto-detects project from git remote URL, connects to SpacetimeDB maincloud, executes query/mutation, returns JSON. GSD agent `.md` files patched with targeted text replacements to call `stgsd` instead of `gsd-tools.cjs`.

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

---
*Last updated: 2026-03-04 after v1.1 milestone start*
