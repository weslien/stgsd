# Requirements: stgsd v1.2

**Defined:** 2026-03-09
**Core Value:** GSD's planning state becomes structured, queryable data instead of flat files

## v1.2 Requirements

Requirements for Patch Completion & Verification milestone. Completes the 8 remaining GSD workflow patches from v1.1 and adds automated patch verification tooling.

### Session Patches

- [ ] **SESS-04**: GSD patch for pause-work workflow replacing .continue-here.md writes with stclaude write-checkpoint calls
- [ ] **SESS-05**: GSD patch for resume-work workflow replacing .continue-here.md reads with stclaude get-checkpoint calls

### Phase Patches

- [ ] **PHSE-06**: GSD patch for add-phase workflow replacing ROADMAP.md edits with stclaude add-phase calls
- [ ] **PHSE-07**: GSD patch for insert-phase workflow replacing ROADMAP.md edits with stclaude insert-phase calls
- [ ] **PHSE-08**: GSD patch for remove-phase workflow replacing ROADMAP.md edits and directory renames with stclaude remove-phase calls

### Todo Patches

- [ ] **TODO-05**: GSD patch for add-todo workflow replacing .planning/todos/ file writes with stclaude add-todo calls
- [ ] **TODO-06**: GSD patch for check-todos workflow replacing .planning/todos/ file reads and moves with stclaude complete-todo calls

### Debug Patch

- [ ] **DBG-05**: GSD patch for debug workflow replacing .planning/debug/ file I/O with stclaude write-debug/get-debug/close-debug calls

### Patch Verification

- [ ] **VRFY-01**: Script that validates all stclaude patches are correctly applied via hash comparison against known-good state
- [ ] **VRFY-02**: Script that validates all stclaude patches are correctly applied via content grep for expected stclaude references
- [ ] **VRFY-03**: End-to-end test that runs /gsd:update and confirms all patches survive and reapply correctly

## Out of Scope

| Feature | Reason |
|---------|--------|
| Automated patch application (no human) | GSD's reapply-patches is human-guided by design |
| New stclaude CLI commands | All needed commands already exist from v1.1 |
| Schema changes | No new tables needed — only workflow patches |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SESS-04 | — | Pending |
| SESS-05 | — | Pending |
| PHSE-06 | — | Pending |
| PHSE-07 | — | Pending |
| PHSE-08 | — | Pending |
| TODO-05 | — | Pending |
| TODO-06 | — | Pending |
| DBG-05 | — | Pending |
| VRFY-01 | — | Pending |
| VRFY-02 | — | Pending |
| VRFY-03 | — | Pending |

**Coverage:**
- v1.2 requirements: 11 total
- Mapped to phases: 0
- Unmapped: 11 ⚠️

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after initial definition*
