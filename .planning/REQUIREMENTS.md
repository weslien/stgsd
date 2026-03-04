# Requirements: stgsd v1.1

**Defined:** 2026-03-04
**Core Value:** GSD's planning state becomes structured, queryable data instead of flat files

## v1.1 Requirements

Requirements for full GSD workflow coverage. Each maps to roadmap phases.

### Milestone Lifecycle

- [ ] **MILE-01**: Milestone table storing version, name, shipped date, phase/plan/requirement counts, accomplishments, and status
- [ ] **MILE-02**: Milestone audit table storing audit status, requirement scores, integration scores, flow scores, and tech debt items
- [ ] **MILE-03**: Milestone archive fields storing archived roadmap and requirements content per milestone version
- [ ] **MILE-04**: CLI command `stclaude write-milestone` persists milestone completion data
- [ ] **MILE-05**: CLI command `stclaude get-milestones` returns milestone history for a project
- [ ] **MILE-06**: CLI command `stclaude write-audit` persists audit report with gap details
- [ ] **MILE-07**: GSD patch for complete-milestone workflow replacing MILESTONES.md and archive file writes with stclaude calls
- [ ] **MILE-08**: GSD patch for audit-milestone workflow replacing audit report file writes with stclaude calls
- [ ] **MILE-09**: GSD patch for new-milestone workflow replacing MILESTONES.md reads with stclaude calls

### Session Management

- [ ] **SESS-01**: Session checkpoint table storing phase context, completed work, remaining work, decisions, blockers, next action, and mental context
- [ ] **SESS-02**: CLI command `stclaude write-checkpoint` persists session handoff context
- [ ] **SESS-03**: CLI command `stclaude get-checkpoint` retrieves latest checkpoint for current phase
- [ ] **SESS-04**: GSD patch for pause-work workflow replacing .continue-here.md writes with stclaude calls
- [ ] **SESS-05**: GSD patch for resume-work workflow replacing .continue-here.md reads with stclaude calls

### Phase Management

- [ ] **PHSE-01**: Phase table supports decimal numbering for inserted phases (e.g., 3.1)
- [ ] **PHSE-02**: Phase table supports is_inserted flag for urgent work distinction
- [ ] **PHSE-03**: CLI command `stclaude add-phase` appends a new phase with auto-incrementing number
- [ ] **PHSE-04**: CLI command `stclaude insert-phase` creates a decimal-numbered phase after a target phase
- [ ] **PHSE-05**: CLI command `stclaude remove-phase` soft-deletes a future phase and renumbers subsequent phases
- [ ] **PHSE-06**: GSD patch for add-phase workflow replacing ROADMAP.md edits with stclaude calls
- [ ] **PHSE-07**: GSD patch for insert-phase workflow replacing ROADMAP.md edits with stclaude calls
- [ ] **PHSE-08**: GSD patch for remove-phase workflow replacing ROADMAP.md edits and directory renames with stclaude calls

### Todo Tracking

- [ ] **TODO-01**: Todo table storing title, area, problem description, solution hints, file references with line numbers, and done status
- [ ] **TODO-02**: CLI command `stclaude add-todo` creates a new todo item
- [ ] **TODO-03**: CLI command `stclaude list-todos` returns pending todos with relative timestamps
- [ ] **TODO-04**: CLI command `stclaude complete-todo` marks a todo as done
- [ ] **TODO-05**: GSD patch for add-todo workflow replacing .planning/todos/ file writes with stclaude calls
- [ ] **TODO-06**: GSD patch for check-todos workflow replacing .planning/todos/ file reads and moves with stclaude calls

### Debug Sessions

- [ ] **DBG-01**: Debug session table storing bug description, hypotheses with status and evidence, checkpoints, and session timeline
- [ ] **DBG-02**: CLI command `stclaude write-debug` persists or updates a debug session
- [ ] **DBG-03**: CLI command `stclaude get-debug` retrieves active debug session for current project
- [ ] **DBG-04**: CLI command `stclaude close-debug` marks a debug session as resolved with resolution notes
- [ ] **DBG-05**: GSD patch for debug workflow replacing .planning/debug/ file I/O with stclaude calls

### Codebase Mapping

- [ ] **CMAP-01**: Codebase map table storing document type (stack/integrations/architecture/structure/conventions/testing/concerns), content, and timestamps
- [ ] **CMAP-02**: CLI command `stclaude write-codebase-map` persists a codebase mapping document by type
- [ ] **CMAP-03**: CLI command `stclaude get-codebase-map` retrieves codebase mapping documents (all or by type)
- [ ] **CMAP-04**: GSD patch for map-codebase workflow replacing .planning/codebase/ file writes with stclaude calls
- [ ] **CMAP-05**: GSD patch for map-codebase workflow replacing .planning/codebase/ file reads (freshness check) with stclaude calls

## v2 Requirements

Deferred to future release.

### Cross-Project Intelligence

- **XPRJ-01**: Query patterns across multiple projects
- **XPRJ-02**: Shared learnings and decision templates

### Multi-Agent Coordination

- **MAGN-01**: Real-time subscription for multi-agent state sharing
- **MAGN-02**: Agent coordination via SpacetimeDB events

## Out of Scope

| Feature | Reason |
|---------|--------|
| File-based fallback | Clean break — dual-mode adds complexity |
| React/web UI | CLI only — SpacetimeDB dashboard for debugging |
| Migration tool for existing .planning/ data | Start fresh per project |
| Multi-user collaboration | Single Claude Code identity per project |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (populated by roadmapper) | | |

**Coverage:**
- v1.1 requirements: 38 total
- Mapped to phases: 0
- Unmapped: 38 ⚠️

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 after initial definition*
