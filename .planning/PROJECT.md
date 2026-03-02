# SpacetimeClaude

## What This Is

A SpacetimeDB-backed replacement for GSD's file-based state management in Claude Code. Instead of reading/writing markdown files in `.planning/` directories, GSD agents call a `stclaude` CLI that stores structured state in SpacetimeDB — giving Claude Code queryable, cross-project, real-time persistent memory that lives outside the repo.

## Core Value

GSD's planning state becomes structured, queryable data instead of flat files — eliminating the parsing overhead, file I/O bottlenecks, and repo pollution that slow down GSD workflows.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] SpacetimeDB module with tables covering GSD core loop state (project, phase, plan, task, requirement, verification, state)
- [ ] Hybrid schema: structured metadata as typed columns, prose content as text fields
- [ ] `stclaude` CLI tool that provides gsd-tools-compatible commands backed by SpacetimeDB
- [ ] Project identity derived from git remote URL (automatic, no manual config)
- [ ] GSD agent local patches replacing file I/O with `stclaude` calls for core loop workflows
- [ ] Patches survive `/gsd:update` via GSD's hash-based local patch system
- [ ] Core loop coverage: progress, plan-phase, execute-phase, verify-work
- [ ] CLI installed to `~/.claude/bin/` alongside existing gsd-tools

### Out of Scope

- File-based fallback — going all-in on SpacetimeDB, no dual-mode
- Non-core GSD workflows (new-project, milestones, audit, cleanup, todos, debug, codebase mapping) — defer to v2
- React/web UI for viewing state — CLI only for v1
- Multi-user collaboration — single-user (single Claude Code identity) for now
- Migration tool for existing .planning/ data — start fresh

## Context

**Existing codebase**: SpacetimeDB v2 starter template with a `person` table, TS client connecting to maincloud (`spacetimeclaude-gvhsi`). Generated module bindings already in place.

**GSD architecture**: Agents (gsd-executor, gsd-planner, gsd-verifier, gsd-phase-researcher) call `gsd-tools.cjs` for state operations and use Read/Write/Edit tools for .planning/ files. The `gsd-tools.cjs` binary wraps file I/O in `lib/*.cjs` modules (state.cjs, phase.cjs, roadmap.cjs, frontmatter.cjs, init.cjs, verify.cjs).

**Integration approach (Option B)**: Build separate `stclaude` CLI in this repo. Patch GSD agent `.md` files to call `stclaude` instead of `gsd-tools` for state operations, and replace `Read .planning/...` / `Write .planning/...` with `stclaude` commands. Patches are plain text diffs on markdown files — easy to merge when GSD updates.

**Local patch system**: GSD tracks all its files via SHA256 hashes in `gsd-file-manifest.json`. Modified files are detected during `/gsd:update`, backed up to `~/.claude/gsd-local-patches/`, and reapplied via `/gsd:reapply-patches` with intelligent merge.

**SpacetimeDB constraints**:
- Reducers are transactional and deterministic (no filesystem, network, timers)
- Tables use `t.u64().primaryKey().autoInc()` for IDs (BigInt, pass `0n` on insert)
- Index names must be globally unique across all tables (use `{table}_{column}` convention)
- Multi-column indexes are broken — use single-column + manual filter
- Reducer calls use object syntax, not positional args
- Server entry point must be `src/index.ts`, schema in `src/schema.ts`

## Constraints

- **Tech stack**: SpacetimeDB v2 TypeScript SDK, esbuild bundling, bun for package management
- **Hosting**: SpacetimeDB maincloud (free tier, already configured)
- **CLI runtime**: Node.js (must work in Claude Code's shell environment)
- **Patch compatibility**: Agent patches must be minimal, targeted text replacements that merge cleanly across GSD version updates
- **No repo state**: All GSD state lives in SpacetimeDB — repos should have zero `.planning/` files for stclaude-managed projects

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Option B: patch at agent layer, not gsd-tools layer | Agent .md files are plain text, easy diff/merge for patch system. Patching compiled .cjs is fragile. | — Pending |
| Hybrid schema (structured + prose) | Full normalization loses the value of rich prose. Pure blobs lose queryability. Hybrid gives both. | — Pending |
| Git remote URL for project identity | Automatic, no config needed. Same project across machines if same remote. | — Pending |
| No file-based fallback | Dual-mode adds complexity. Clean break forces commitment and simplifies implementation. | — Pending |
| Core loop only for v1 | Focus on the hot path. progress/plan/execute/verify cover 90% of GSD usage. | — Pending |
| CLI in ~/.claude/bin/ | Already on Claude's PATH, alongside gsd-tools.cjs. No global install needed. | — Pending |

---
*Last updated: 2026-03-02 after initialization*
