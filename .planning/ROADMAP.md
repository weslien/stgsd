# Roadmap: stgsd

## Milestones

- v1.0 Core Loop — Phases 1-6 (shipped 2026-03-04)
- v1.1 Full Coverage — Phases 7-12 (shipped 2026-03-09)
- v1.2 Patch Completion & Verification — Phases 13, 15 (in progress)

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

**Milestone Goal:** Complete the final debug workflow patch, verify all stclaude patches (including upstream-adopted ones) are correctly applied, and build automated verification that patches survive /gsd:update.

**Scope revision:** 7 of 8 original patch targets were adopted upstream by GSD. Only debug.md remains.

- [ ] **Phase 13: Debug Patch & Upstream Verification** - Patch debug.md command, verify upstream adoptions, mark completed requirements
- [ ] **Phase 15: Patch Verification Tooling** - Automated scripts to validate all stclaude patches are applied and survive updates

## Phase Details

### Phase 13: Debug Patch & Upstream Verification
**Goal**: Patch the debug command to use stclaude, verify all upstream-adopted workflows are correct, and mark completed requirements
**Depends on**: Phase 12
**Requirements**: SESS-04, SESS-05, PHSE-06, PHSE-07, PHSE-08, TODO-05, TODO-06, DBG-05
**Success Criteria** (what must be TRUE):
  1. /gsd:debug uses stclaude get-state instead of gsd-tools.cjs state load
  2. /gsd:debug uses stclaude get-debug instead of reading .planning/debug/*.md files
  3. Upstream-adopted workflows verified: pause-work, resume-work, add/insert/remove-phase, add-todo, check-todos all use stclaude
  4. All 8 patch requirements (SESS-04/05, PHSE-06/07/08, TODO-05/06, DBG-05) marked complete
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

### Phase 15: Patch Verification Tooling
**Goal**: Automated confidence that all stclaude patches are correctly applied and survive GSD updates
**Depends on**: Phase 13
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
Phase 13 first (patch + verify upstream), then Phase 14 (verification tooling depends on knowing what to verify).

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
| 13. Debug Patch & Upstream Verification | v1.2 | 0/? | Not started | - |
| 14. Patch Verification Tooling | v1.2 | 0/? | Not started | - |
