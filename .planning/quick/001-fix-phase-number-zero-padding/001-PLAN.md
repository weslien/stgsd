---
phase: quick
plan: 001
type: execute
autonomous: true
files_modified:
  - /Users/gustav/.claude/bin/stclaude.mjs
  - /Users/gustav/.claude/get-shit-done/references/phase-argument-parsing.md
  - /Users/gustav/.claude/get-shit-done/workflows/add-phase.md
  - /Users/gustav/.claude/get-shit-done/workflows/plan-phase.md
---

<objective>
Fix phase number zero-padding inconsistency. Phase numbers passed to stclaude should be plain integers (1, 2, 12) not zero-padded strings ("01", "02", "12"). The SpacetimeDB column is typed — padding causes lookup mismatches.

Root cause: `padPhaseNumber()` in stclaude.mjs zero-pads numbers before storage, and `findPhaseByNumber()` does exact string matching.
</objective>

<tasks>

<task type="auto">
  <name>Task 1: Fix stclaude.mjs — remove padding, normalize lookups</name>
  <files>/Users/gustav/.claude/bin/stclaude.mjs</files>
  <action>
1. Find `padPhaseNumber()` function and change it to return plain number strings (no padding):
   ```javascript
   function padPhaseNumber(n) {
     return n.toString();  // No padding — plain number
   }
   ```
   Or inline the calls and remove the function entirely.

2. Find `findPhaseByNumber()` and make it normalize both the input and stored values by stripping leading zeros before comparison:
   ```javascript
   // Normalize: strip leading zeros for comparison
   const normalizedInput = number.replace(/^0+/, '') || '0';
   // Compare against stored value also normalized
   row.number.replace(/^0+/, '') === normalizedInput
   ```
   This ensures both "01" and "1" match existing data, providing backward compatibility with already-stored zero-padded values.

3. Check if there are any other places in stclaude.mjs that zero-pad phase numbers (search for `padStart`, `padPhaseNumber`, `printf "%02d"`). Fix all of them.
  </action>
  <verify>
    <automated>grep -n "padStart" /Users/gustav/.claude/bin/stclaude.mjs | grep -v "node_modules"</automated>
  </verify>
  <done>stclaude.mjs no longer zero-pads phase numbers for new phases. findPhaseByNumber normalizes both sides of comparison. Existing zero-padded data still works.</done>
</task>

<task type="auto">
  <name>Task 2: Update phase-argument-parsing.md and workflow references</name>
  <files>
    /Users/gustav/.claude/get-shit-done/references/phase-argument-parsing.md
    /Users/gustav/.claude/get-shit-done/workflows/add-phase.md
    /Users/gustav/.claude/get-shit-done/workflows/plan-phase.md
  </files>
  <action>
1. In phase-argument-parsing.md: Remove the "Manual Normalization (Legacy)" section that instructs `printf "%02d"` zero-padding. Replace with a note that stclaude handles normalization internally — callers should pass phase numbers as-is (plain integers).

2. In add-phase.md: The `printf "%02d"` for directory naming can stay (filesystem directories are cosmetic). But ensure the phase number passed to `stclaude add-phase` is NOT zero-padded.

3. In plan-phase.md: Check if `$PADDED_PHASE` is used for stclaude calls — if so, use plain `$PHASE` instead. Keep `$PADDED_PHASE` only for filesystem directory naming.

4. Search across all recently-patched workflows for any remaining `printf "%02d"` applied to phase numbers before stclaude calls. The filesystem directory naming can keep padding, but stclaude arguments must be plain numbers.
  </action>
  <verify>
    <automated>grep -rn 'printf.*%02d.*PHASE' /Users/gustav/.claude/get-shit-done/workflows/ /Users/gustav/.claude/get-shit-done/references/phase-argument-parsing.md</automated>
  </verify>
  <done>phase-argument-parsing.md no longer instructs zero-padding for stclaude calls. Workflow files pass plain phase numbers to stclaude. Filesystem directory naming may still use padding (cosmetic only).</done>
</task>

</tasks>
