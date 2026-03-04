# Requirements: SpacetimeClaude

**Defined:** 2026-03-02
**Core Value:** GSD's planning state becomes structured, queryable data instead of flat files

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Schema

- [x] **SCHM-01**: Project table with name, description, core_value, constraints, context, key_decisions (text), timestamps
- [x] **SCHM-02**: Phase table with project_id, number (string for decimals), name, slug, goal, status, depends_on, success_criteria
- [x] **SCHM-03**: Plan table with phase_id, plan_number, type, wave, depends_on, objective, autonomous, requirements, status
- [x] **SCHM-04**: Plan task table with plan_id, task_number, type, description, status, commit_hash
- [x] **SCHM-05**: Requirement table with project_id, category, number, description, status, phase_number, milestone_version
- [x] **SCHM-06**: Project state table replacing STATE.md (current phase, current plan, last activity, velocity data, session continuity)
- [x] **SCHM-07**: Continue-here table for resume state (phase_id, task_number, current_state, next_action, context)
- [x] **SCHM-08**: Plan summary table with subsystem, tags, headline, accomplishments, deviations, files, decisions, dependency graph metadata
- [x] **SCHM-09**: Verification table with phase_id, status, score, content (prose), recommended fixes
- [x] **SCHM-10**: Research table with phase_id, domain, confidence, content (prose)
- [x] **SCHM-11**: Phase context table with phase_id, content (user decisions prose)
- [x] **SCHM-12**: Config table with project_id, config as JSON string
- [x] **SCHM-13**: Must-have table (truths, artifacts, key_links) linked to plans
- [x] **SCHM-14**: Reducers for all CRUD operations on each table
- [x] **SCHM-15**: Project identity derived from git remote URL, stored as unique field on project table

### CLI

- [x] **CLI-01**: `stclaude get-state` returns current project state (position, metrics, last activity)
- [x] **CLI-02**: `stclaude advance-plan` / `update-progress` / `record-metric` state mutations
- [x] **CLI-03**: `stclaude init progress` assembles context for progress workflow
- [x] **CLI-04**: `stclaude init execute-phase <phase>` assembles context for execution
- [x] **CLI-05**: `stclaude init plan-phase <phase>` assembles context for planning
- [x] **CLI-06**: `stclaude read-plan <phase> <plan>` returns plan content
- [x] **CLI-07**: `stclaude write-summary` / `write-verification` / `write-research` stores artifacts
- [x] **CLI-08**: `stclaude get-phase <number>` returns phase details
- [x] **CLI-09**: `stclaude roadmap analyze` returns phase overview with status
- [x] **CLI-10**: Connection management (auto-connect to maincloud, project identity from git remote)
- [x] **CLI-11**: JSON output mode for machine consumption by agents
- [x] **CLI-12**: Installable to `~/.claude/bin/stclaude`

### Patches

- [x] **PTCH-01**: gsd-executor.md patched to call stclaude for state reads/writes and summary creation
- [x] **PTCH-02**: gsd-planner.md patched to read context from stclaude and write plans via stclaude
- [x] **PTCH-03**: gsd-verifier.md patched to read plans/summaries from stclaude and write verification
- [x] **PTCH-04**: execute-phase.md workflow patched to use stclaude init and phase queries
- [ ] **PTCH-05**: plan-phase.md workflow patched to use stclaude init and context assembly
- [ ] **PTCH-06**: progress.md workflow patched to use stclaude for state and roadmap queries
- [x] **PTCH-07**: All patches are minimal, targeted text replacements that don't restructure agent logic

## v2 Requirements

### Extended Workflows

- **EXT-01**: Todo tracking via SpacetimeDB (replaces .planning/todos/)
- **EXT-02**: Debug session persistence (replaces .planning/debug/)
- **EXT-03**: Codebase mapping storage (replaces .planning/codebase/)
- **EXT-04**: New-project workflow via stclaude
- **EXT-05**: Milestone management and archival
- **EXT-06**: Audit and cleanup workflows

### Cross-Project Intelligence

- **XPRJ-01**: Cross-project memory and pattern retrieval
- **XPRJ-02**: Decision history searchable across all projects
- **XPRJ-03**: Technology stack recommendations from prior projects

### Multi-Agent

- **MAGT-01**: Real-time subscriptions for concurrent agent coordination
- **MAGT-02**: Team state management via SpacetimeDB instead of file-based task lists

## Out of Scope

| Feature | Reason |
|---------|--------|
| File-based fallback mode | Clean break, dual-mode adds complexity |
| Web UI / dashboard | CLI-only for v1, SpacetimeDB dashboard available for debugging |
| Migration from existing .planning/ data | Start fresh, old projects keep file-based GSD |
| Multi-user / shared projects | Single Claude Code identity per project for now |
| React client | No browser component needed, purely CLI |
| Modifying gsd-tools.cjs directly | Fragile, compiled .cjs files don't merge cleanly |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCHM-01 | Phase 1 | Complete |
| SCHM-02 | Phase 1 | Complete |
| SCHM-03 | Phase 1 | Complete |
| SCHM-04 | Phase 1 | Complete |
| SCHM-05 | Phase 1 | Complete |
| SCHM-06 | Phase 1 | Complete |
| SCHM-07 | Phase 1 | Complete |
| SCHM-08 | Phase 1 | Complete |
| SCHM-09 | Phase 1 | Complete |
| SCHM-10 | Phase 1 | Complete |
| SCHM-11 | Phase 1 | Complete |
| SCHM-12 | Phase 1 | Complete |
| SCHM-13 | Phase 1 | Complete |
| SCHM-14 | Phase 1 | Complete |
| SCHM-15 | Phase 1 | Complete |
| CLI-01 | Phase 3 | Complete |
| CLI-02 | Phase 3 | Complete |
| CLI-03 | Phase 4 | Complete |
| CLI-04 | Phase 4 | Complete |
| CLI-05 | Phase 4 | Complete |
| CLI-06 | Phase 3 | Complete |
| CLI-07 | Phase 4 | Complete |
| CLI-08 | Phase 3 | Complete |
| CLI-09 | Phase 3 | Complete |
| CLI-10 | Phase 2 | Complete |
| CLI-11 | Phase 2 | Complete |
| CLI-12 | Phase 6 | Complete |
| PTCH-01 | Phase 5 | Complete |
| PTCH-02 | Phase 5 | Complete |
| PTCH-03 | Phase 5 | Complete |
| PTCH-04 | Phase 5 | Complete |
| PTCH-05 | Phase 5 | Pending |
| PTCH-06 | Phase 5 | Pending |
| PTCH-07 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 after roadmap creation*
