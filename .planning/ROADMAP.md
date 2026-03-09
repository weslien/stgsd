# Roadmap: stgsd

## Milestones

- v1.0 Core Loop — Phases 1-6 (shipped 2026-03-04)
- v1.1 Full Coverage — Phases 7-12 (shipped 2026-03-09)
- v1.2 Patch Completion & Verification — Phases 13-15 (in progress)

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

<details>
<summary>v1.1 Full Coverage (Phases 7-12) — SHIPPED 2026-03-09</summary>

- [x] Phase 7: Schema Extensions (2/2 plans) — completed 2026-03-04
- [x] Phase 8: Milestone Lifecycle (2/2 plans) — completed 2026-03-04
- [x] Phase 9: Phase & Session Management (2/2 plans) — completed 2026-03-04
- [x] Phase 10: Todo & Debug Tracking (2/2 plans) — completed 2026-03-04
- [x] Phase 11: Codebase Mapping (2/2 plans) — completed 2026-03-04
- [x] Phase 12: Workflow Patch Completion (4/4 plans) — completed 2026-03-05

</details>

### v1.2 Patch Completion & Verification (In Progress)

**Milestone Goal:** Ship the remaining 8 GSD workflow patches and build automated verification that all patches survive /gsd:update.

- [ ] **Phase 13: Session & Phase Workflow Patches** - Patch pause/resume-work and add/insert/remove-phase workflows to use stclaude
- [ ] **Phase 14: Todo & Debug Workflow Patches** - Patch add-todo, check-todos, and debug workflows to use stclaude
- [ ] **Phase 15: Patch Verification Tooling** - Automated scripts to validate all stclaude patches are applied and survive updates

## Phase Details

### Phase 13: Session & Phase Workflow Patches
**Goal**: Users can pause/resume work sessions and manage phases entirely through stclaude-backed workflows
**Depends on**: Phase 12
**Requirements**: SESS-04, SESS-05, PHSE-06, PHSE-07, PHSE-08
**Success Criteria** (what must be TRUE):
  1. Running /gsd:pause-work writes session checkpoint via stclaude write-checkpoint instead of creating .continue-here.md
  2. Running /gsd:resume-work restores session state via stclaude get-checkpoint instead of reading .continue-here.md
  3. Running /gsd:add-phase creates a new phase via stclaude add-phase instead of editing ROADMAP.md directly
  4. Running /gsd:insert-phase inserts a decimal phase via stclaude insert-phase instead of editing ROADMAP.md directly
  5. Running /gsd:remove-phase removes a phase via stclaude remove-phase instead of editing ROADMAP.md and renaming directories
**Plans**: TBD

Plans:
- [ ] 13-01: TBD
- [ ] 13-02: TBD

### Phase 14: Todo & Debug Workflow Patches
**Goal**: Users can manage todos and debug sessions entirely through stclaude-backed workflows
**Depends on**: Phase 12
**Requirements**: TODO-05, TODO-06, DBG-05
**Success Criteria** (what must be TRUE):
  1. Running /gsd:add-todo creates a todo via stclaude add-todo instead of writing to .planning/todos/ files
  2. Running /gsd:check-todos lists and completes todos via stclaude list-todos/complete-todo instead of reading/moving .planning/todos/ files
  3. Running /gsd:debug starts, queries, and closes debug sessions via stclaude write-debug/get-debug/close-debug instead of .planning/debug/ file I/O
**Plans**: TBD

Plans:
- [ ] 14-01: TBD

### Phase 15: Patch Verification Tooling
**Goal**: Automated confidence that all stclaude patches are correctly applied and survive GSD updates
**Depends on**: Phase 13, Phase 14
**Requirements**: VRFY-01, VRFY-02, VRFY-03
**Success Criteria** (what must be TRUE):
  1. A hash-check script reports pass/fail for each patched workflow file against known-good hashes
  2. A content-grep script reports pass/fail for each patched workflow file by checking for expected stclaude references
  3. Running /gsd:update followed by the verification scripts confirms all patches reapply correctly with zero failures
**Plans**: TBD

Plans:
- [ ] 15-01: TBD
- [ ] 15-02: TBD

## Progress

**Execution Order:**
Phases 13 and 14 can execute in parallel (no dependency between them). Phase 15 depends on both.

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Schema & Module | v1.0 | 2/2 | Complete | 2026-03-02 |
| 2. CLI Foundation | v1.0 | 2/2 | Complete | 2026-03-02 |
| 3. State & Query Commands | v1.0 | 3/3 | Complete | 2026-03-02 |
| 4. Workflow Assembly | v1.0 | 2/2 | Complete | 2026-03-03 |
| 5. Agent Patches | v1.0 | 4/4 | Complete | 2026-03-04 |
| 6. Gap Closure & Tech Debt | v1.0 | 2/2 | Complete | 2026-03-03 |
| 7. Schema Extensions | v1.1 | 2/2 | Complete | 2026-03-04 |
| 8. Milestone Lifecycle | v1.1 | 2/2 | Complete | 2026-03-04 |
| 9. Phase & Session Management | v1.1 | 2/2 | Complete | 2026-03-04 |
| 10. Todo & Debug Tracking | v1.1 | 2/2 | Complete | 2026-03-04 |
| 11. Codebase Mapping | v1.1 | 2/2 | Complete | 2026-03-04 |
| 12. Workflow Patch Completion | v1.1 | 4/4 | Complete | 2026-03-05 |
| 13. Session & Phase Workflow Patches | v1.2 | 0/? | Not started | - |
| 14. Todo & Debug Workflow Patches | v1.2 | 0/? | Not started | - |
| 15. Patch Verification Tooling | v1.2 | 0/? | Not started | - |
