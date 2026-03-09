---
quick: 001
subsystem: stclaude-cli
tags: [bug-fix, phase-numbers, zero-padding]
key-files:
  modified:
    - /Users/gustav/.claude/bin/stclaude.mjs
    - /Users/gustav/.claude/get-shit-done/references/phase-argument-parsing.md
decisions:
  - Normalize both input and stored values in findPhaseByNumber for backward compat
  - padPhaseNumber returns plain number string (no padding)
  - Filesystem directory naming can still use zero-padding (cosmetic only)
metrics:
  completed: 2026-03-09
---

# Quick Task 001: Fix Phase Number Zero-Padding Summary

Fixed phase number zero-padding inconsistency in stclaude.mjs so plain integers (1, 2, 12) work correctly for SpacetimeDB lookups, with backward compatibility for already-stored zero-padded values.

## Completed Tasks

| Task | Name | Files |
|------|------|-------|
| 1 | Fix stclaude.mjs — remove padding, normalize lookups | /Users/gustav/.claude/bin/stclaude.mjs |
| 2 | Update phase-argument-parsing.md and workflow references | /Users/gustav/.claude/get-shit-done/references/phase-argument-parsing.md |

## Changes Made

### Task 1: stclaude.mjs

**`padPhaseNumber(n)` — removed zero-padding:**
```javascript
// Before:
function padPhaseNumber(n) {
  return n.toString().padStart(2, "0");
}

// After:
function padPhaseNumber(n) {
  return n.toString();  // No padding — plain number
}
```

**`findPhaseByNumber()` — normalize both sides for backward compat:**
```javascript
// Before:
function findPhaseByNumber(conn, projectId, number) {
  for (const row of conn.db.phase.iter()) {
    if (row.projectId === projectId && row.number === number) {

// After:
function findPhaseByNumber(conn, projectId, number) {
  const normalizedInput = number.toString().replace(/^0+/, '') || '0';
  for (const row of conn.db.phase.iter()) {
    const normalizedRow = row.number.replace(/^0+/, '') || '0';
    if (row.projectId === projectId && normalizedRow === normalizedInput) {
```

Both "01" and "1" now match a stored phase with either value — backward compatible with existing zero-padded data.

No other `padStart` usages in stclaude.mjs are phase-related (they handle timestamp formatting, hex encoding, and todo ID display).

### Task 2: phase-argument-parsing.md

Replaced "Manual Normalization (Legacy)" section that instructed zero-padding with a clear note:
- stclaude handles normalization internally
- Pass plain integers to stclaude (no zero-padding)
- Zero-padding acceptable only for filesystem directory naming (cosmetic)

### Workflow files checked:
- **add-phase.md**: stclaude call already passes plain number — no change needed. Filesystem `mkdir` uses `printf "%02d"` which is acceptable.
- **plan-phase.md**: `${PADDED_PHASE}` only used for `VALIDATION.md` filename (filesystem, cosmetic) — no change needed.
- **planning-config.md**: `PADDED_PHASE` for branch name (cosmetic) — no change needed.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- /Users/gustav/.claude/bin/stclaude.mjs: padPhaseNumber no longer zero-pads, findPhaseByNumber normalizes both sides
- /Users/gustav/.claude/get-shit-done/references/phase-argument-parsing.md: Legacy zero-padding section replaced with correct guidance
