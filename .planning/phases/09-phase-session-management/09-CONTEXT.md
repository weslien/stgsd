# Phase 09: Phase & Session Management - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase management CLI commands (add-phase, insert-phase, remove-phase) and session checkpoint CLI commands (write-session, get-session), plus GSD workflow patches for pause-work, resume-work, add-phase, insert-phase, remove-phase. These replace gsd-tools file-based operations with SpacetimeDB persistence.

</domain>

<decisions>
## Implementation Decisions

### Phase CLI Scope
- Phase data lives in SpacetimeDB only — no dual-write to ROADMAP.md
- add-phase auto-numbers by default (appends after last phase), with --number flag to override
- insert-phase uses decimal numbering (7.1, 7.2) — no renumbering of subsequent phases. Matches current GSD convention
- remove-phase has safety checks: refuse to remove phases with completed plans unless --force flag

### Session Checkpoint Design
- write-session creates a full snapshot checkpoint row (all fields per call, not incremental)
- Session checkpoint replaces .continue-here.md entirely — no file created, consistent with "no file-based fallback" project decision
- get-session returns the most recent checkpoint for the current phase by default, with --phase flag to query specific phases
- Checkpoint includes decisions-made field for richer resume context

### Workflow Patch Strategy
- Surgical patches only — replace gsd-tools calls with stclaude equivalents, don't modernize surrounding logic. Proven approach from Phase 08
- pause-work patch replaces both .continue-here.md creation AND STATE.md update with single stclaude write-session call
- add-phase/insert-phase patches create phase in SpacetimeDB only — requirements handled separately
- remove-phase uses cascade delete (schema already supports this) — removing a phase removes all its plans, research, context

### Resume-work Fidelity
- Full reconstruction: resume-work gets completed tasks list, current task details, blockers, decisions made, files modified from checkpoint
- Verify previous commits are intact via git log before continuing (catches force-push/reset cases)
- No checkpoint expiry — checkpoints are always valid, user decides relevance
- get-session supports --phase filtering for switching between phases

### Claude's Discretion
- Exact CLI flag names and help text for new commands
- Error message wording and exit codes
- How to handle edge cases (e.g., insert-phase when no phases exist)
- Whether write-session should also update project_state.session_* fields or keep them separate

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `withConnection` + `findProjectByGitRemote` pattern: All 21 existing CLI commands use this — new commands follow same pattern
- `waitForInsert` helper: Used in write-* commands for insert confirmation — reuse for write-session
- `outputSuccess`/`outputError`: Standard output formatting — all new commands use these
- `ErrorCodes` object: Already has PHASE_NOT_FOUND — reuse for session errors
- `session_checkpoint` table: Already defined in schema.ts with project_id and phase_id indexes

### Established Patterns
- Write commands: withConnection -> findProject -> waitForInsert -> reducer call -> outputSuccess
- Read commands: withConnection -> findProject -> iter() + filter -> serialize BigInt -> outputSuccess
- Phase operations: insertPhase/updatePhase/deletePhase reducers already exist in index.ts
- Cascade deletes: Schema has deletePhase reducer that cascades to plans, research, context

### Integration Points
- `src/cli/index.ts`: Register new commands (add imports + register calls)
- `src/cli/lib/errors.ts`: May need new error codes (SESSION_NOT_FOUND)
- GSD workflows: pause-work.md, resume-work.md, add-phase.md, insert-phase.md, remove-phase.md
- SpacetimeDB reducers: insertPhase, updatePhase, deletePhase, insertSessionCheckpoint already exist

</code_context>

<specifics>
## Specific Ideas

- Follow Phase 08's proven approach: CLI commands first (Wave 1), workflow patches second (Wave 2)
- Session checkpoint should be a complete "resume packet" — enough data that resume-work can reconstruct full context without reading any .planning/ files
- Phase CLI commands should feel identical to existing stclaude commands (same flag patterns, same output format)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-phase-session-management*
*Context gathered: 2026-03-04*
