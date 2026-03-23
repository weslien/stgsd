# Roadmap: stgsd

## Milestones

- v1.0 Core Loop — Phases 1-6 (shipped 2026-03-04)
- v1.1 Full Coverage — Phases 7-12 (shipped 2026-03-09)
- v1.2 Patch Completion & Verification — Phases 13, 15 (shipped 2026-03-11)

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

### v1.2 Patch Completion & Verification — SHIPPED 2026-03-11

**Milestone Goal:** Complete the final debug workflow patch, verify all stgsd patches (including upstream-adopted ones) are correctly applied, and build automated verification that patches survive /gsd:update.

**Scope revision:** 7 of 8 original patch targets were adopted upstream by GSD. Only debug.md required a local patch.

- [x] **Phase 13: Debug Patch & Upstream Verification** — completed 2026-03-09
- [x] **Phase 15: Patch Verification Tooling** — completed 2026-03-11

## Phase Details

### Phase 13: Debug Patch & Upstream Verification — COMPLETE 2026-03-09
**Goal**: Patch the debug command to use stgsd, verify all upstream-adopted workflows are correct, and mark completed requirements
**Depends on**: Phase 12
**Requirements**: SESS-04, SESS-05, PHSE-06, PHSE-07, PHSE-08, TODO-05, TODO-06, DBG-05
**Verification**: VERIFICATION.md — 15/15 must-haves verified 2026-03-09

Plans:
- [x] 13-01: Debug patch + upstream verification (completed 2026-03-09)
- [x] 13-02: Gap closure — resume-project.md + pause-work.md (completed 2026-03-09)

### Phase 15: Patch Verification Tooling — COMPLETE 2026-03-11
**Goal**: Automated confidence that all stgsd patches are correctly applied and survive GSD updates
**Depends on**: Phase 13
**Requirements**: VRFY-01, VRFY-02, VRFY-03
**Delivered**:
  - `stgsd verify-patches` command — content-grep check across 33 GSD workflow/agent/command files
  - `patch-manifest.json` — defines expected stgsd patterns per file
  - `scripts/patch-gsd-files.sh` — reapplies all stgsd integration blocks after GSD update
  - Result: 33/33 files pass verification

Plans:
- [x] 15-01: verify-patches CLI command + patch-manifest.json (completed 2026-03-09)
- [x] 15-02: Rename stclaude→stgsd + Windows compat + patch all 33 GSD files (completed 2026-03-11)

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
| 13. Debug Patch & Upstream Verification | v1.2 | 2/2 | Complete | 2026-03-09 |
| 15. Patch Verification Tooling | v1.2 | 2/2 | Complete | 2026-03-11 |
