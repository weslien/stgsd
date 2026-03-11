# Requirements: stgsd v1.2

**Defined:** 2026-03-09
**Core Value:** GSD's planning state becomes structured, queryable data instead of flat files

## v1.2 Requirements

Requirements for Patch Completion & Verification milestone. Completes the last remaining GSD workflow patch and verifies all patches (including upstream-adopted) survive updates.

**Scope note:** 7 of 8 original patch targets were adopted upstream by GSD v1.22.0. These are marked complete (adopted upstream) — only DBG-05 requires a local patch.

### Session Patches (Adopted Upstream)

- [x] **SESS-04**: GSD patch for pause-work workflow replacing .continue-here.md writes with stclaude write-checkpoint calls *(adopted upstream)*
- [x] **SESS-05**: GSD patch for resume-work workflow replacing .continue-here.md reads with stclaude get-checkpoint calls *(adopted upstream)*

### Phase Patches (Adopted Upstream)

- [x] **PHSE-06**: GSD patch for add-phase workflow replacing ROADMAP.md edits with stclaude add-phase calls *(adopted upstream)*
- [x] **PHSE-07**: GSD patch for insert-phase workflow replacing ROADMAP.md edits with stclaude insert-phase calls *(adopted upstream)*
- [x] **PHSE-08**: GSD patch for remove-phase workflow replacing ROADMAP.md edits and directory renames with stclaude remove-phase calls *(adopted upstream)*

### Todo Patches (Adopted Upstream)

- [x] **TODO-05**: GSD patch for add-todo workflow replacing .planning/todos/ file writes with stclaude add-todo calls *(adopted upstream)*
- [x] **TODO-06**: GSD patch for check-todos workflow replacing .planning/todos/ file reads and moves with stclaude complete-todo calls *(adopted upstream)*

### Debug Patch

- [x] **DBG-05**: GSD patch for debug workflow replacing gsd-tools.cjs state load and .planning/debug/ file reads with stgsd get-state/get-debug calls *(completed 2026-03-09, verified 15/15)*

### Patch Verification

- [x] **VRFY-01**: `stgsd verify-patches` + `patch-manifest.json` — content-grep validates all stgsd patches across 33 files *(hash-based approach superseded by more robust content-grep; implemented 2026-03-09, extended to 33 files 2026-03-11)*
- [x] **VRFY-02**: `stgsd verify-patches` reports pass/fail per file for expected stgsd references — 33/33 passing *(completed 2026-03-11)*
- [x] **VRFY-03**: `scripts/patch-gsd-files.sh` reapplies all stgsd integration blocks; `stgsd verify-patches` confirms result — run after any GSD update *(tooling complete 2026-03-11)*

## Out of Scope

| Feature | Reason |
|---------|--------|
| Automated patch application (no human) | GSD's reapply-patches is human-guided by design |
| New stgsd CLI commands | All needed commands already exist from v1.1 |
| Schema changes | No new tables needed — only workflow patches |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SESS-04 | Phase 13 | Complete (upstream) |
| SESS-05 | Phase 13 | Complete (upstream) |
| PHSE-06 | Phase 13 | Complete (upstream) |
| PHSE-07 | Phase 13 | Complete (upstream) |
| PHSE-08 | Phase 13 | Complete (upstream) |
| TODO-05 | Phase 13 | Complete (upstream) |
| TODO-06 | Phase 13 | Complete (upstream) |
| DBG-05 | Phase 13 | Complete 2026-03-09 |
| VRFY-01 | Phase 15 | Complete 2026-03-11 |
| VRFY-02 | Phase 15 | Complete 2026-03-11 |
| VRFY-03 | Phase 15 | Complete 2026-03-11 |

**Coverage:**
- v1.2 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0
- Complete: 11
- Remaining: 0

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-11 — all requirements complete, v1.2 shipped*
