# Roadmap: SpacetimeClaude

## Overview

SpacetimeClaude replaces GSD's file-based `.planning/` state with a SpacetimeDB-backed CLI. The journey starts with deploying the full schema, then builds a CLI that talks to it, layers on workflow-assembly commands, and finishes by patching GSD agents to use the new CLI instead of file I/O. Each phase delivers a verifiable capability that the next phase depends on.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Schema & Module** - All SpacetimeDB tables, reducers, and module deployed to maincloud
- [x] **Phase 2: CLI Foundation** - CLI skeleton with connection management, project identity, JSON output, and install
- [x] **Phase 3: State & Query Commands** - CLI commands for reading/writing project state, phases, plans, and roadmap overview
- [x] **Phase 4: Workflow Assembly** - CLI commands that assemble rich context for GSD workflow entry points + seed/init command (gap closure)
- [x] **Phase 5: Agent Patches** - GSD agent markdown files patched to call stclaude instead of file I/O
- [x] **Phase 6: v1.0 Gap Closure & Tech Debt** - Fix CLI-12 symlink, stale checkbox, and refactor duplicated helpers

## Phase Details

### Phase 1: Schema & Module
**Goal**: SpacetimeDB module is deployed with all tables and reducers needed to store GSD's entire core loop state
**Depends on**: Nothing (first phase)
**Requirements**: SCHM-01, SCHM-02, SCHM-03, SCHM-04, SCHM-05, SCHM-06, SCHM-07, SCHM-08, SCHM-09, SCHM-10, SCHM-11, SCHM-12, SCHM-13, SCHM-14, SCHM-15
**Success Criteria** (what must be TRUE):
  1. Running `spacetime publish` succeeds and the module is live on maincloud
  2. A project record can be created with git remote URL as identity and all prose fields populated
  3. A phase with linked plans, tasks, requirements, and success criteria can be inserted and queried back with all relationships intact
  4. Supporting tables (verification, research, phase context, config, continue-here, plan summary, must-have) accept and return data through reducers
  5. Project state table stores current position, velocity data, and session continuity and can be updated through reducers
**Plans**: 2 plans
- [x] 01-01-PLAN.md -- Define all 13 table definitions in schema.ts
- [x] 01-02-PLAN.md -- Create all CRUD reducers, seed_project, cascade delete, and publish to maincloud

### Phase 2: CLI Foundation
**Goal**: The `stclaude` CLI binary exists, connects to SpacetimeDB, identifies the current project from git remote, and supports JSON output
**Depends on**: Phase 1
**Requirements**: CLI-10, CLI-11, CLI-12
**Success Criteria** (what must be TRUE):
  1. Running `stclaude` from any git repo auto-connects to SpacetimeDB maincloud and resolves the project from the repo's git remote URL
  2. All command output supports `--json` flag that returns machine-parseable JSON for agent consumption
  3. Running `~/.claude/bin/stclaude` works after install (binary is on Claude Code's PATH)
**Plans**: 2 plans
- [x] 02-01-PLAN.md -- CLI skeleton with module bindings, Commander.js, and connection/output/git helpers
- [x] 02-02-PLAN.md -- Default command (get-state) and install script

### Phase 3: State & Query Commands
**Goal**: Agents can read and mutate project state, query phases, read plans, and get roadmap overview through CLI commands
**Depends on**: Phase 2
**Requirements**: CLI-01, CLI-02, CLI-06, CLI-08, CLI-09
**Success Criteria** (what must be TRUE):
  1. `stclaude get-state` returns the current project position, metrics, and last activity in a format agents can parse
  2. `stclaude advance-plan`, `update-progress`, and `record-metric` successfully mutate state and the changes are visible in subsequent `get-state` calls
  3. `stclaude get-phase <number>` returns full phase details including goal, requirements, success criteria, and plan list
  4. `stclaude read-plan <phase> <plan>` returns the complete plan content for a given phase and plan number
  5. `stclaude roadmap analyze` returns a phase overview with statuses that matches the data in SpacetimeDB
**Plans**: 3 plans
- [x] 03-01-PLAN.md -- get-state and get-phase query commands
- [x] 03-02-PLAN.md -- read-plan and roadmap analyze commands
- [x] 03-03-PLAN.md -- State mutation commands (advance-plan, update-progress, record-metric)

### Phase 4: Workflow Assembly
**Goal**: CLI can assemble the rich context bundles that GSD workflow entry points need, store artifacts produced by agents, and bootstrap new projects
**Depends on**: Phase 3
**Requirements**: CLI-03, CLI-04, CLI-05, CLI-07
**Gap Closure:** Closes INT-01/FLOW-01 from v1.0 audit (seed_project has no CLI command)
**Success Criteria** (what must be TRUE):
  1. `stclaude init progress` returns assembled context sufficient for the progress workflow (state, roadmap overview, recent activity)
  2. `stclaude init plan-phase <phase>` returns everything the planner needs (phase details, requirements, research, existing plans, project context)
  3. `stclaude init execute-phase <phase>` returns everything the executor needs (current plan, task list, must-haves, continue-here state)
  4. `stclaude write-summary`, `write-verification`, and `write-research` persist artifacts to SpacetimeDB and are retrievable by subsequent queries
  5. `stclaude init` (or `stclaude seed`) calls `seed_project` reducer to bootstrap a new project from the current git repo, closing the PROJECT_NOT_FOUND dead-end
**Plans**: 2 plans
- [x] 04-01-PLAN.md -- Init assembly commands (progress, plan-phase, execute-phase) + write commands (summary, verification, research)
- [x] 04-02-PLAN.md -- Seed/init command for project bootstrapping

### Phase 5: Agent Patches
**Goal**: GSD core loop workflows run end-to-end using stclaude instead of file I/O, with patches that survive GSD updates
**Depends on**: Phase 4
**Requirements**: PTCH-01, PTCH-02, PTCH-03, PTCH-04, PTCH-05, PTCH-06, PTCH-07
**Success Criteria** (what must be TRUE):
  1. Running `/gsd:progress` on a stclaude-managed project reads state from SpacetimeDB (not .planning/ files) and displays correct project status
  2. Running `/gsd:plan-phase` generates plans stored in SpacetimeDB, with the planner receiving context from stclaude instead of file reads
  3. Running `/gsd:execute-phase` picks up plans from SpacetimeDB, executes tasks, and writes summaries via stclaude
  4. Running `/gsd:verify-work` reads plans and summaries from SpacetimeDB and writes verification results back
  5. All patches are minimal text replacements that do not restructure agent logic, and GSD's hash-based patch system detects and preserves them across `/gsd:update`
**Plans**: 4 plans
- [x] 05-01-PLAN.md -- CLI commands: write-plan, write-context, complete-phase, mark-requirement
- [x] 05-02-PLAN.md -- Workflow patches: progress.md, plan-phase.md, execute-phase.md
- [x] 05-03-PLAN.md -- Agent file patches: gsd-executor, gsd-planner, gsd-verifier
- [x] 05-04-PLAN.md -- Gap closure: gsd-planner.md disk I/O contradictions

### Phase 6: v1.0 Gap Closure & Tech Debt
**Goal**: Close the CLI-12 requirement gap, fix stale ROADMAP state, and eliminate code duplication identified by v1.0 audit
**Depends on**: Phase 3
**Requirements**: CLI-12
**Gap Closure:** Closes gaps from v1.0 milestone audit
**Success Criteria** (what must be TRUE):
  1. Running `stclaude` (without `.mjs` extension) from `~/.claude/bin/` resolves and executes the CLI
  2. ROADMAP.md 02-02-PLAN.md checkbox reflects actual completion state
  3. `waitForStateUpdate` exists as a single shared helper imported by all mutation commands
  4. `status.ts` uses `findProjectByGitRemote` instead of inlining project lookup
**Plans**: 2 plans
- [x] 06-01-PLAN.md -- CLI-12 symlink fix and ROADMAP checkbox update
- [x] 06-02-PLAN.md -- Shared helper extraction (waitForStateUpdate, findProjectByGitRemote)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Schema & Module | 2/2 | Complete | 2026-03-02 |
| 2. CLI Foundation | 2/2 | Complete | 2026-03-02 |
| 3. State & Query Commands | 3/3 | Complete | 2026-03-02 |
| 4. Workflow Assembly | 2/2 | Complete | 2026-03-03 |
| 5. Agent Patches | 4/4 | Complete | 2026-03-04 |
| 6. v1.0 Gap Closure & Tech Debt | 2/2 | Complete | 2026-03-03 |
