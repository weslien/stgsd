# Roadmap: stgsd

## Milestones

- **v1.0 Core Loop** — Phases 1-6 (shipped 2026-03-04)
- **v1.1 Full Coverage** — Phases 7-11 (in progress)

## Phases

<details>
<summary>v1.0 Core Loop (Phases 1-6) — SHIPPED 2026-03-04</summary>

- [x] Phase 1: Schema & Module (2/2 plans) — completed 2026-03-02
- [x] Phase 2: CLI Foundation (2/2 plans) — completed 2026-03-02
- [x] Phase 3: State & Query Commands (3/3 plans) — completed 2026-03-02
- [x] Phase 4: Workflow Assembly (2/2 plans) — completed 2026-03-03
- [x] Phase 5: Agent Patches (4/4 plans) — completed 2026-03-04
- [x] Phase 6: v1.0 Gap Closure & Tech Debt (2/2 plans) — completed 2026-03-03

</details>

### v1.1 Full Coverage (In Progress)

**Milestone Goal:** Extend SpacetimeDB coverage from the core loop to all remaining GSD workflows — milestones, sessions, phases, todos, debug, and codebase mapping.

- [ ] **Phase 7: Schema Extensions** - Add 6 new tables and extend 2 existing tables for all v1.1 workflows
- [ ] **Phase 8: Milestone Lifecycle** - CLI commands and GSD patches for milestone complete/audit/new workflows
- [ ] **Phase 9: Phase & Session Management** - CLI commands and GSD patches for phase add/insert/remove and session pause/resume
- [ ] **Phase 10: Todo & Debug Tracking** - CLI commands and GSD patches for todo lifecycle and debug session persistence
- [ ] **Phase 11: Codebase Mapping** - CLI commands and GSD patches for codebase document storage and retrieval

## Phase Details

### Phase 7: Schema Extensions
**Goal**: All v1.1 data structures exist in SpacetimeDB, ready for CLI and patch work
**Depends on**: Phase 6 (v1.0 schema established)
**Requirements**: MILE-01, MILE-02, MILE-03, SESS-01, PHSE-01, PHSE-02, TODO-01, DBG-01, CMAP-01
**Success Criteria** (what must be TRUE):
  1. SpacetimeDB module publishes with 6 new tables (milestone, milestone_audit, session_checkpoint, todo, debug_session, codebase_map) and 0 schema errors
  2. Existing phase table rows accept decimal numbers (e.g., 3.1) and the is_inserted flag without data loss
  3. `stgsd list-projects` returns existing projects — confirming schema migration does not break v1.0 data
  4. New tables have correct indexes for querying by project and by type/status
**Plans:** 1 plan
Plans:
- [ ] 07-01-PLAN.md — Verify schema extensions and publish module with re-seed round-trip

### Phase 8: Milestone Lifecycle
**Goal**: GSD milestone workflows (complete, audit, new) run against SpacetimeDB instead of markdown files
**Depends on**: Phase 7
**Requirements**: MILE-04, MILE-05, MILE-06, MILE-07, MILE-08, MILE-09
**Success Criteria** (what must be TRUE):
  1. `stgsd write-milestone` persists a completed milestone record retrievable via `stgsd get-milestones`
  2. `stgsd write-audit` persists an audit report with gap details and scores retrievable per project
  3. GSD complete-milestone workflow calls `stgsd write-milestone` instead of writing MILESTONES.md and archive files
  4. GSD audit-milestone workflow calls `stgsd write-audit` instead of writing audit report files
  5. GSD new-milestone workflow reads prior milestone data via `stgsd get-milestones` instead of parsing MILESTONES.md
**Plans**: TBD

### Phase 9: Phase & Session Management
**Goal**: Phase mutation workflows and session pause/resume run against SpacetimeDB
**Depends on**: Phase 7
**Requirements**: PHSE-03, PHSE-04, PHSE-05, PHSE-06, PHSE-07, PHSE-08, SESS-02, SESS-03, SESS-04, SESS-05
**Success Criteria** (what must be TRUE):
  1. `stgsd add-phase` appends a new phase with auto-incremented number; `stgsd insert-phase` creates a decimal-numbered phase after a named target
  2. `stgsd remove-phase` soft-deletes a future phase and subsequent phase numbers update accordingly
  3. `stgsd write-checkpoint` persists session handoff context; `stgsd get-checkpoint` returns the latest checkpoint for the current phase
  4. GSD add-phase, insert-phase, and remove-phase workflows call `stgsd` instead of editing ROADMAP.md
  5. GSD pause-work writes checkpoint via `stgsd write-checkpoint`; GSD resume-work reads it via `stgsd get-checkpoint` instead of reading .continue-here.md
**Plans**: TBD

### Phase 10: Todo & Debug Tracking
**Goal**: Todo lifecycle and debug session persistence run against SpacetimeDB
**Depends on**: Phase 7
**Requirements**: TODO-02, TODO-03, TODO-04, TODO-05, TODO-06, DBG-02, DBG-03, DBG-04, DBG-05
**Success Criteria** (what must be TRUE):
  1. `stgsd add-todo` creates a todo with area classification and file references; `stgsd list-todos` returns pending todos with relative timestamps
  2. `stgsd complete-todo` marks a todo done and it no longer appears in `stgsd list-todos` output
  3. `stgsd write-debug` persists or updates a debug session; `stgsd get-debug` retrieves the active session; `stgsd close-debug` marks it resolved
  4. GSD add-todo and check-todos workflows call `stgsd` instead of reading/writing .planning/todos/ files
  5. GSD debug workflow calls `stgsd` instead of reading/writing .planning/debug/ files
**Plans**: TBD

### Phase 11: Codebase Mapping
**Goal**: Codebase mapping documents are stored in and retrieved from SpacetimeDB
**Depends on**: Phase 7
**Requirements**: CMAP-02, CMAP-03, CMAP-04, CMAP-05
**Success Criteria** (what must be TRUE):
  1. `stgsd write-codebase-map` persists any of the 7 document types (stack/integrations/architecture/structure/conventions/testing/concerns) and overwrites the prior version of that type
  2. `stgsd get-codebase-map` returns all documents for a project; called with a type flag it returns just that document
  3. GSD map-codebase workflow writes documents via `stgsd write-codebase-map` instead of creating .planning/codebase/ files
  4. GSD map-codebase freshness check reads timestamps via `stgsd get-codebase-map` instead of stat-ing .planning/codebase/ files
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Schema & Module | v1.0 | 2/2 | Complete | 2026-03-02 |
| 2. CLI Foundation | v1.0 | 2/2 | Complete | 2026-03-02 |
| 3. State & Query Commands | v1.0 | 3/3 | Complete | 2026-03-02 |
| 4. Workflow Assembly | v1.0 | 2/2 | Complete | 2026-03-03 |
| 5. Agent Patches | v1.0 | 4/4 | Complete | 2026-03-04 |
| 6. Gap Closure & Tech Debt | v1.0 | 2/2 | Complete | 2026-03-03 |
| 7. Schema Extensions | v1.1 | 0/1 | Not started | - |
| 8. Milestone Lifecycle | v1.1 | 0/? | Not started | - |
| 9. Phase & Session Management | v1.1 | 0/? | Not started | - |
| 10. Todo & Debug Tracking | v1.1 | 0/? | Not started | - |
| 11. Codebase Mapping | v1.1 | 0/? | Not started | - |
