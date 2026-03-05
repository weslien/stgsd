# Phase 5: Agent Patches - Research

**Researched:** 2026-03-03
**Domain:** GSD agent/workflow markdown patching for SpacetimeDB integration
**Confidence:** HIGH

## Summary

Phase 5 patches six GSD markdown files (three agents and three workflows) to replace file-based I/O with `stclaude` CLI calls. The patching domain is well-bounded: each file has specific sections where `gsd-tools.cjs` calls, `Read .planning/...` operations, and `Write .planning/...` operations must be replaced with equivalent `stclaude` commands. The stclaude CLI (built in Phases 1-4) already provides all the read/write commands needed; the work is purely textual replacement in markdown instruction files.

The most critical constraint is PTCH-07: patches must be **minimal, targeted text replacements** that don't restructure agent logic. This means each patch replaces one or a few lines at a time, not entire sections. GSD's hash-based manifest system (gsd-file-manifest.json) will detect the modifications, and the `/gsd:reapply-patches` workflow will backup and merge them across GSD updates.

**Primary recommendation:** Work file-by-file, replacing each `gsd-tools.cjs` call or `.planning/` file read/write with its `stclaude` equivalent. Use the `--json` flag on all stclaude commands since agents parse JSON output. Keep each replacement as small as possible to maximize merge compatibility when GSD updates.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PTCH-01 | gsd-executor.md patched to call stclaude for state reads/writes and summary creation | Mapping of executor state operations to stclaude commands (init execute-phase, write-summary, advance-plan, update-progress, record-metric) |
| PTCH-02 | gsd-planner.md patched to read context from stclaude and write plans via stclaude | Mapping of planner context reads to stclaude init plan-phase; plan writing requires new stclaude write-plan command or direct use of existing plan insert |
| PTCH-03 | gsd-verifier.md patched to read plans/summaries from stclaude and write verification | Mapping of verifier reads to stclaude read-plan/get-phase; write-verification already exists |
| PTCH-04 | execute-phase.md workflow patched to use stclaude init and phase queries | Replace `gsd-tools.cjs init execute-phase` with `stclaude init execute-phase`; replace `gsd-tools.cjs phase-plan-index` with stclaude equivalent |
| PTCH-05 | plan-phase.md workflow patched to use stclaude init and context assembly | Replace `gsd-tools.cjs init plan-phase` with `stclaude init plan-phase`; replace roadmap get-phase with stclaude get-phase |
| PTCH-06 | progress.md workflow patched to use stclaude for state and roadmap queries | Replace `gsd-tools.cjs init progress`, `roadmap analyze`, `state-snapshot`, `progress bar` with stclaude equivalents |
| PTCH-07 | All patches are minimal, targeted text replacements that don't restructure agent logic | Patch strategy section below documents how to keep replacements minimal |
</phase_requirements>

## Standard Stack

### Core

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| stclaude CLI | 0.0.1 (local) | SpacetimeDB-backed state read/write for GSD agents | Built in Phases 1-4 specifically for this purpose |
| GSD file manifest | gsd-file-manifest.json | SHA256 hash tracking for detecting modified files | GSD's built-in mechanism for patch detection and backup |
| `/gsd:reapply-patches` | GSD v1.22.0 | Merge local modifications after GSD updates | GSD's built-in patch reapplication workflow |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `stclaude --json` flag | Machine-parseable JSON output | Every stclaude call from agents (they parse JSON) |
| `jq` | JSON field extraction in bash | Extracting fields from stclaude JSON output in bash blocks |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Patching agent .md files | Patching gsd-tools.cjs | Agent .md files are plain text, easy diff/merge. gsd-tools.cjs is compiled/minified, fragile to patch. Decision already locked (Option B from PROJECT.md). |
| Minimal text replacements | Full rewrite of agent sections | Minimal replacements survive GSD updates better. Full rewrites conflict on every update. |

## Architecture Patterns

### Patch Structure

Each GSD file that needs patching has identifiable integration points:

```
AGENT/WORKFLOW FILES (6 files to patch):
~/.claude/agents/
  gsd-executor.md       (PTCH-01) - state reads, state writes, summary creation
  gsd-planner.md        (PTCH-02) - context reads, plan writes
  gsd-verifier.md       (PTCH-03) - plan/summary reads, verification writes

~/.claude/get-shit-done/workflows/
  execute-phase.md      (PTCH-04) - init, phase queries, plan index
  plan-phase.md         (PTCH-05) - init, context assembly, roadmap queries
  progress.md           (PTCH-06) - init, state snapshot, roadmap analyze
```

### Pattern 1: Init Command Replacement

**What:** Replace `gsd-tools.cjs init <workflow>` with `stclaude init <workflow> --json`
**When to use:** Every workflow entry point that assembles context

**Before (gsd-tools):**
```bash
INIT=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" init execute-phase "${PHASE}")
```

**After (stclaude):**
```bash
INIT=$(stclaude init execute-phase "${PHASE}" --json)
```

**Confidence:** HIGH - init commands are 1:1 replacements (CLI-03, CLI-04, CLI-05 implemented these as direct equivalents).

**Impact note:** The JSON shape from stclaude differs from gsd-tools. Fields that agents extract (e.g., `phase_dir`, `plans`, `incomplete_plans`) need to be mapped to stclaude's JSON keys (e.g., `phase.number`, `plans[].status`). Some fields like `phase_dir` (a filesystem path) don't exist in stclaude since there are no `.planning/` directories.

### Pattern 2: State Query Replacement

**What:** Replace `gsd-tools.cjs state-snapshot` / `gsd-tools.cjs roadmap analyze` with `stclaude get-state --json` / `stclaude roadmap analyze --json`
**When to use:** Any workflow that reads project state or roadmap overview

**Before:**
```bash
STATE=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state-snapshot)
ROADMAP=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" roadmap analyze)
```

**After:**
```bash
STATE=$(stclaude get-state --json)
ROADMAP=$(stclaude roadmap analyze --json)
```

**Confidence:** HIGH - CLI-01 and CLI-09 provide these exact capabilities.

### Pattern 3: State Mutation Replacement

**What:** Replace `gsd-tools.cjs state advance-plan` / `state update-progress` / `state record-metric` / `state add-decision` / `state record-session` with stclaude equivalents
**When to use:** gsd-executor after completing plans

**Before:**
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state advance-plan
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state update-progress
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state record-metric --phase "${PHASE}" --plan "${PLAN}" --duration "${DURATION}" --tasks "${TASK_COUNT}" --files "${FILE_COUNT}"
```

**After:**
```bash
stclaude advance-plan --json
stclaude update-progress --phase "${PHASE}" --plan "${PLAN}" --json
stclaude record-metric --plan-id "${PHASE}-${PLAN}" --duration "${DURATION}" --json
```

**Confidence:** HIGH - CLI-02 provides these mutations.

**Note:** `state add-decision` and `state record-session` map to `stclaude update-progress` with appropriate flags (`--activity`, `--session-last`, `--session-stopped`). The mapping is slightly different from gsd-tools but covers the same data.

### Pattern 4: Artifact Write Replacement

**What:** Replace `Write .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md` with `stclaude write-summary`
**When to use:** gsd-executor (summary), gsd-verifier (verification), gsd-phase-researcher (research)

**Before (executor summary):**
```markdown
After all tasks complete, create `{phase}-{plan}-SUMMARY.md` at `.planning/phases/XX-name/`.
**ALWAYS use the Write tool to create files**
```

**After:**
```bash
stclaude write-summary --phase "${PHASE}" --plan "${PLAN}" --headline "${HEADLINE}" --accomplishments "${ACCOMPLISHMENTS}" --deviations "${DEVIATIONS}" --files "${FILES}" --decisions "${DECISIONS}" --json
```

**Confidence:** HIGH - CLI-07 provides write-summary, write-verification, write-research.

### Pattern 5: File Read Replacement

**What:** Replace `Read .planning/STATE.md` / `Read .planning/ROADMAP.md` / `cat .planning/...` with stclaude queries
**When to use:** Any agent `<files_to_read>` block or inline file reads

**Before:**
```markdown
<files_to_read>
- .planning/STATE.md (State)
- .planning/ROADMAP.md (Roadmap)
- .planning/REQUIREMENTS.md (Requirements)
</files_to_read>
```

**After:**
```markdown
<stclaude_context>
Use stclaude CLI to load context (no .planning/ files to read):
- `stclaude get-state --json` (State)
- `stclaude roadmap analyze --json` (Roadmap)
- `stclaude init plan-phase "${PHASE}" --json` (Requirements + context assembled)
</stclaude_context>
```

**Confidence:** HIGH - All read commands exist, but requires careful mapping of which stclaude command replaces which file read.

### Pattern 6: Roadmap/Requirements Mutation Elimination

**What:** Remove `gsd-tools.cjs roadmap update-plan-progress`, `requirements mark-complete`, `phase complete` calls
**When to use:** gsd-executor state updates, execute-phase verification step

**Rationale:** In the stclaude model, plan status and requirement status are tracked in SpacetimeDB tables, not in markdown files. The stclaude `advance-plan` and `update-progress` commands handle the state mutations. There are no ROADMAP.md or REQUIREMENTS.md files to update.

**Before:**
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" roadmap update-plan-progress "${PHASE_NUMBER}"
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" requirements mark-complete ${REQ_IDS}
```

**After:** These calls are removed. The stclaude mutation commands update the corresponding database tables.

**Confidence:** MEDIUM - Need to verify that stclaude's advance-plan and update-progress fully cover the semantics of roadmap update-plan-progress and requirements mark-complete. May need to add a `mark-requirement-complete` command to stclaude if it doesn't exist.

### Anti-Patterns to Avoid

- **Restructuring agent control flow:** Do NOT rewrite entire sections. Replace individual command invocations inline.
- **Removing file-write fallbacks prematurely:** Some agents may still need to write non-state files (e.g., plan PLAN.md files for executor consumption). Only replace state-related file operations.
- **Changing agent spawning patterns:** The orchestrator-subagent model stays the same. Only the data source changes.
- **Adding new agent tools:** Do not add new tools (like a hypothetical `Stclaude` tool) to agent definitions. Use `Bash` to call `stclaude`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| State reading from SpacetimeDB | Custom SpacetimeDB client calls in agents | `stclaude get-state --json` | CLI already handles connection, auth, JSON formatting |
| JSON parsing in bash | Complex jq pipelines | Structured stclaude output + simple jq field extraction | stclaude returns well-structured JSON |
| Patch verification | Custom SHA256 checking | GSD's built-in gsd-file-manifest.json | GSD already tracks file hashes and detects modifications |
| Patch backup/restore | Custom backup scripts | `/gsd:reapply-patches` | GSD's built-in merge workflow handles version conflicts |

**Key insight:** The stclaude CLI was built precisely as the intermediary between agents and SpacetimeDB. Agents should never talk to SpacetimeDB directly.

## Common Pitfalls

### Pitfall 1: JSON Shape Mismatch Between gsd-tools and stclaude

**What goes wrong:** Agent expects gsd-tools JSON fields (e.g., `phase_dir`, `incomplete_plans`, `plan_count`) but stclaude returns different field names (e.g., `phase.number`, `plans`, no `phase_dir`).
**Why it happens:** gsd-tools was designed for file-based workflows. stclaude was designed for database-backed workflows. Field names and structure differ.
**How to avoid:** For each replaced command, document the JSON field mapping. Test each patched agent's JSON parsing against actual stclaude output.
**Warning signs:** Agent errors like "Cannot read property 'phase_dir' of undefined" or "plans is not iterable."

### Pitfall 2: Missing File-Path References in Agent Instructions

**What goes wrong:** Agent instructions reference `.planning/phases/XX-name/` file paths that don't exist in stclaude-managed projects (no `.planning/` directory).
**Why it happens:** Many agent instructions hardcode `.planning/` paths for file reads and writes.
**How to avoid:** Audit every reference to `.planning/` in the six files. Replace file paths with stclaude command equivalents. For paths used in git commit messages or SUMMARY metadata, keep the logical path reference but note it's a virtual path.
**Warning signs:** Agent tries to `Read .planning/STATE.md` and gets "File not found."

### Pitfall 3: `phase_dir` Removal Breaking Downstream Logic

**What goes wrong:** Many agents use `phase_dir` (from init JSON) to construct file paths for reading plans, writing summaries, etc. Removing this field breaks path construction.
**Why it happens:** gsd-tools returns `phase_dir` as a real filesystem path. stclaude has no filesystem state to return.
**How to avoid:** Every use of `phase_dir` must be replaced with the appropriate stclaude command. Plans are read via `stclaude read-plan`, summaries written via `stclaude write-summary`, etc. No filesystem paths needed.
**Warning signs:** Variables like `$PHASE_DIR` used in paths after the init replacement.

### Pitfall 4: Executor Still Writes Local Files (Code, Not State)

**What goes wrong:** Confusing state files (STATE.md, SUMMARY.md) with implementation files (source code the executor writes during task execution).
**Why it happens:** The executor writes both state artifacts AND implementation code. Only state artifacts should use stclaude.
**How to avoid:** Be precise about what gets patched. `Write .planning/phases/.../SUMMARY.md` -> stclaude. `Write src/components/Chat.tsx` -> stays as file I/O. Task commits remain git-based.
**Warning signs:** Executor tries to write source code through stclaude.

### Pitfall 5: Patch Merge Conflicts on GSD Update

**What goes wrong:** GSD updates change the same lines that were patched, causing merge conflicts.
**Why it happens:** Large patches that touch many contiguous lines are more likely to conflict with upstream changes.
**How to avoid:** Keep each replacement as small as possible. One-line replacements merge cleanly. Multi-line replacements are riskier. Never reformat or restructure surrounding text.
**Warning signs:** `/gsd:reapply-patches` reports conflicts for every patched file.

### Pitfall 6: Plan Content Storage Gap

**What goes wrong:** The planner agent writes PLAN.md files to disk, but in stclaude mode there's no `.planning/` directory to write to. The executor needs to read plan content, but if plans only exist in SpacetimeDB, the `<files_to_read>` pattern breaks.
**Why it happens:** Plans in SpacetimeDB have a `content` text field, and `stclaude read-plan` returns it. But the current planner writes PLAN.md files using the `Write` tool.
**How to avoid:** The planner patch must replace `Write {phase_dir}/{plan}-PLAN.md` with a stclaude command that stores plan content in SpacetimeDB. A new `stclaude write-plan` command may be needed, or the existing `insert_plan` reducer can be called via stclaude. The executor then reads plans via `stclaude read-plan` instead of `Read {phase_dir}/{plan}-PLAN.md`.
**Warning signs:** Planner creates PLAN.md files locally that executors cannot find (or vice versa).

### Pitfall 7: Missing stclaude Commands

**What goes wrong:** Some gsd-tools commands don't have direct stclaude equivalents yet.
**Why it happens:** Phases 1-4 built the CLI for the known command set, but edge cases in agent workflows may need additional commands.
**How to avoid:** Before patching, create a complete mapping of every gsd-tools command used in the six files and verify each has a stclaude equivalent. Add missing commands first.
**Warning signs:** Agent patch references a `stclaude <command>` that doesn't exist.

## Code Examples

### Example 1: Patching gsd-executor init (PTCH-01)

**Before:**
```bash
INIT=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" init execute-phase "${PHASE}")
```

**After:**
```bash
INIT=$(stclaude init execute-phase "${PHASE}" --json)
```

**Field mapping for executor init:**

| gsd-tools field | stclaude field | Notes |
|----------------|----------------|-------|
| `executor_model` | N/A | Not in stclaude; comes from .planning/config.json which is separate |
| `commit_docs` | N/A | Not in stclaude; comes from config |
| `phase_dir` | N/A | No filesystem path; use stclaude commands instead |
| `plans` | `plans[]` | Array of plan objects with id, planNumber, objective, status, content, tasks |
| `incomplete_plans` | Compute: `plans.filter(p => !isComplete(p.status))` | Derived from plans array |

### Example 2: Patching executor state updates (PTCH-01)

**Before:**
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state advance-plan
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state update-progress
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state record-metric \
  --phase "${PHASE}" --plan "${PLAN}" --duration "${DURATION}" \
  --tasks "${TASK_COUNT}" --files "${FILE_COUNT}"
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state record-session \
  --stopped-at "Completed ${PHASE}-${PLAN}-PLAN.md"
```

**After:**
```bash
stclaude advance-plan --json
stclaude record-metric --plan-id "${PHASE}-${PLAN}" --duration "${DURATION}" --json
stclaude update-progress --activity "Completed ${PHASE}-${PLAN}" --session-last "$(date +%Y-%m-%d)" --session-stopped "Completed ${PHASE}-${PLAN}-PLAN.md" --json
```

### Example 3: Patching executor summary creation (PTCH-01)

**Before:**
```markdown
After all tasks complete, create `{phase}-{plan}-SUMMARY.md` at `.planning/phases/XX-name/`.
**ALWAYS use the Write tool to create files**
**Use template:** @/Users/gustav/.claude/get-shit-done/templates/summary.md
```

**After:**
```markdown
After all tasks complete, store the summary via stclaude:
```bash
stclaude write-summary --phase "${PHASE}" --plan "${PLAN}" \
  --headline "${ONE_LINER}" \
  --subsystem "${SUBSYSTEM}" --tags "${TAGS}" \
  --accomplishments "${ACCOMPLISHMENTS}" \
  --deviations "${DEVIATIONS}" \
  --files "${FILES}" --decisions "${DECISIONS}" --json
```

### Example 4: Patching progress workflow (PTCH-06)

**Before:**
```bash
INIT=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" init progress)
ROADMAP=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" roadmap analyze)
STATE=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" state-snapshot)
PROGRESS_BAR=$(node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" progress bar --raw)
```

**After:**
```bash
INIT=$(stclaude init progress --json)
ROADMAP=$(stclaude roadmap analyze --json)
STATE=$(stclaude get-state --json)
# Progress bar computed from INIT/ROADMAP JSON data (phases completed/total)
```

## State of the Art

| Old Approach (GSD file-based) | New Approach (stclaude) | Impact |
|-------------------------------|-------------------------|--------|
| Read STATE.md via `cat` or `Read` tool | `stclaude get-state --json` | No filesystem dependency; works across machines with same DB |
| Write SUMMARY.md via `Write` tool | `stclaude write-summary --json` | Summary persisted to SpacetimeDB, queryable across sessions |
| Parse ROADMAP.md via `gsd-tools.cjs roadmap analyze` | `stclaude roadmap analyze --json` | Same data, different source |
| gsd-tools.cjs with file-backed lib/*.cjs | stclaude with SpacetimeDB-backed connection | Breaking change; no fallback (per project decision) |

## Detailed Patch Mapping

### PTCH-01: gsd-executor.md

**File:** `~/.claude/agents/gsd-executor.md`
**Integration points to patch:**

| Section | Current (gsd-tools/file) | Replacement (stclaude) |
|---------|--------------------------|------------------------|
| `<step name="load_project_state">` init call | `gsd-tools.cjs init execute-phase` | `stclaude init execute-phase --json` |
| `<step name="load_project_state">` STATE.md read | `cat .planning/STATE.md` | Data comes from stclaude init output (embedded in JSON) |
| `<summary_creation>` | Write tool to create SUMMARY.md | `stclaude write-summary` with structured fields |
| `<state_updates>` advance-plan | `gsd-tools.cjs state advance-plan` | `stclaude advance-plan --json` |
| `<state_updates>` update-progress | `gsd-tools.cjs state update-progress` | `stclaude update-progress --json` |
| `<state_updates>` record-metric | `gsd-tools.cjs state record-metric` | `stclaude record-metric --json` |
| `<state_updates>` add-decision | `gsd-tools.cjs state add-decision` | `stclaude update-progress --activity` (decisions embedded in activity) |
| `<state_updates>` record-session | `gsd-tools.cjs state record-session` | `stclaude update-progress --session-last --session-stopped` |
| `<state_updates>` roadmap update-plan-progress | `gsd-tools.cjs roadmap update-plan-progress` | Remove (status tracked in DB) |
| `<state_updates>` requirements mark-complete | `gsd-tools.cjs requirements mark-complete` | **GAP: Need stclaude command or remove** |
| `<final_commit>` gsd-tools commit | `gsd-tools.cjs commit` | Remove (no .planning/ files to commit for state artifacts) |
| `<self_check>` file existence checks | `[ -f "path/to/file" ]` checks | Verify via stclaude queries instead of filesystem checks |

### PTCH-02: gsd-planner.md

**File:** `~/.claude/agents/gsd-planner.md`
**Integration points to patch:**

| Section | Current | Replacement |
|---------|---------|-------------|
| Init call | `gsd-tools.cjs init plan-phase` | `stclaude init plan-phase --json` |
| Read STATE.md | `Read .planning/STATE.md` | Data from stclaude init JSON |
| Read ROADMAP.md | `Read .planning/ROADMAP.md` | Data from stclaude init JSON (phase details) |
| Read REQUIREMENTS.md | `Read .planning/REQUIREMENTS.md` | Requirements in stclaude init JSON |
| Read CONTEXT.md | `Read .planning/phases/.../CONTEXT.md` | Context in stclaude init JSON (existingContext) |
| Read RESEARCH.md | `Read .planning/phases/.../RESEARCH.md` | Research in stclaude init JSON (existingResearch) |
| Write PLAN.md files | `Write` tool to create PLAN.md | **GAP: Need stclaude write-plan or insert-plan command** |
| Commit plans | `gsd-tools.cjs commit` | Remove or keep for non-state files |

### PTCH-03: gsd-verifier.md

**File:** `~/.claude/agents/gsd-verifier.md`
**Integration points to patch:**

| Section | Current | Replacement |
|---------|---------|-------------|
| Load context (Step 1) | `ls $PHASE_DIR/*-PLAN.md`, `ls $PHASE_DIR/*-SUMMARY.md` | `stclaude init execute-phase --json` (has plans with hasSummary flag) |
| Roadmap get-phase | `gsd-tools.cjs roadmap get-phase` | `stclaude get-phase --json` |
| Requirements grep | `grep .planning/REQUIREMENTS.md` | Requirements from stclaude init JSON |
| Read PLAN frontmatter | Parse PLAN.md for must_haves | `stclaude read-plan --json` (includes must_haves) |
| Summary extract | `gsd-tools.cjs summary-extract` | Summary data from stclaude init JSON |
| Verify artifacts/key-links | `gsd-tools.cjs verify artifacts/key-links` | **Keep as-is** (verifies actual code files, not state) |
| Write VERIFICATION.md | `Write` tool | `stclaude write-verification --json` |
| Previous VERIFICATION.md check | `cat $PHASE_DIR/*-VERIFICATION.md` | Query stclaude for existing verification |

### PTCH-04: execute-phase.md

**File:** `~/.claude/get-shit-done/workflows/execute-phase.md`
**Integration points to patch:**

| Section | Current | Replacement |
|---------|---------|-------------|
| Initialize step | `gsd-tools.cjs init execute-phase` | `stclaude init execute-phase --json` |
| Phase plan index | `gsd-tools.cjs phase-plan-index` | Compute from stclaude init JSON (plans already grouped) |
| Config reads | `gsd-tools.cjs config-get` | Read from stclaude or keep config.json local |
| Executor spawn `<files_to_read>` | References to .planning/ files | Replace with stclaude command instructions |
| Spot-check SUMMARYs | `grep` on SUMMARY.md files | Query stclaude for summary existence |
| Phase complete | `gsd-tools.cjs phase complete` | `stclaude update-progress --phase` + phase status update |
| Final commit | `gsd-tools.cjs commit` | Remove (no .planning/ files to commit) |

### PTCH-05: plan-phase.md

**File:** `~/.claude/get-shit-done/workflows/plan-phase.md`
**Integration points to patch:**

| Section | Current | Replacement |
|---------|---------|-------------|
| Initialize | `gsd-tools.cjs init plan-phase` | `stclaude init plan-phase --json` |
| Validate phase | `gsd-tools.cjs roadmap get-phase` | `stclaude get-phase --json` |
| CONTEXT.md check | `context_path` from init | `existingContext.hasContext` from stclaude init JSON |
| Research spawn file paths | `state_path`, `roadmap_path`, etc. | Replace with stclaude command instructions |
| Phase description | `gsd-tools.cjs roadmap get-phase \| jq -r '.section'` | `stclaude get-phase --json` |
| Planner spawn `<files_to_read>` | References to .planning/ files | Replace with stclaude command instructions |
| Commit research/plans | `gsd-tools.cjs commit-docs` | Remove (artifacts stored in SpacetimeDB) |

### PTCH-06: progress.md

**File:** `~/.claude/get-shit-done/workflows/progress.md`
**Integration points to patch:**

| Section | Current | Replacement |
|---------|---------|-------------|
| init_context step | `gsd-tools.cjs init progress` | `stclaude init progress --json` |
| load step | `gsd-tools.cjs roadmap analyze` / `state-snapshot` | `stclaude roadmap analyze --json` / `stclaude get-state --json` |
| analyze_roadmap step | `gsd-tools.cjs roadmap analyze` | `stclaude roadmap analyze --json` |
| recent step | `gsd-tools.cjs summary-extract` | Recent summaries in stclaude init progress JSON |
| position step | References to `$ROADMAP`, `$STATE` | Use stclaude JSON outputs |
| report step | `gsd-tools.cjs progress bar --raw` | Compute progress bar from stclaude data |
| route step | `ls .planning/phases/[dir]/*-PLAN.md` | Compute from stclaude init JSON |
| .planning/ directory checks | `project_exists`, `.planning/` detection | `stclaude` (project existence from DB query) |

## Implementation Gaps to Address Before Patching

### Gap 1: `stclaude write-plan` Command Missing

**Problem:** The planner needs to store plan content in SpacetimeDB. The `insert_plan` reducer exists, but there's no CLI command wrapping it.
**Solution:** Add a `write-plan` command to stclaude that accepts plan metadata (phase, plan number, type, wave, objective, requirements, content) and calls `insertPlan` reducer.
**Priority:** HIGH - blocks PTCH-02

### Gap 2: `stclaude mark-requirement-complete` Command Missing

**Problem:** The executor marks requirements complete after plan execution. `requirements mark-complete` has no stclaude equivalent.
**Solution:** Add a `mark-requirement-complete` command that updates requirement status in SpacetimeDB.
**Priority:** MEDIUM - needed for PTCH-01 (executor state updates), but could be deferred if requirements tracking is optional for v1

### Gap 3: Phase Status Update Command

**Problem:** `execute-phase.md` calls `gsd-tools.cjs phase complete` to mark a phase done. stclaude has `update-progress` for project state but no direct phase status mutation.
**Solution:** Either extend `update-progress` to accept `--phase-status` or add a `complete-phase` command.
**Priority:** HIGH - blocks PTCH-04

### Gap 4: `stclaude write-context` Command Missing

**Problem:** `plan-phase.md` PRD express path writes CONTEXT.md. Need stclaude equivalent.
**Solution:** Add `write-context` command that calls `insertPhaseContext` reducer.
**Priority:** LOW - PRD express path is an edge case; can be deferred

### Gap 5: Config Read from SpacetimeDB

**Problem:** Several workflows read config via `gsd-tools.cjs config-get`. Config is stored in SpacetimeDB (SCHM-12) but there's no `stclaude config-get` command.
**Solution:** Add `config-get` command, or keep config reads from local `.planning/config.json` as a hybrid approach.
**Priority:** MEDIUM - config reads are used for model profiles and workflow toggles

### Gap 6: Progress Bar Computation

**Problem:** `progress.md` uses `gsd-tools.cjs progress bar --raw` to get a formatted progress bar. stclaude doesn't generate formatted text displays.
**Solution:** Compute progress bar in the workflow from the phase data in stclaude JSON (count completed/total phases). Simple bash arithmetic, not a new command.
**Priority:** LOW - trivial to compute inline

### Gap 7: `stclaude write-must-have` Command Missing

**Problem:** The planner creates must_haves in PLAN frontmatter. The `insert_must_have` reducer exists but no CLI command wraps it.
**Solution:** Either bundle must_haves with `write-plan` command or add separate `write-must-have` command.
**Priority:** MEDIUM - needed for PTCH-02 if plans include must_haves

## Open Questions

1. **How to handle `add-decision` semantics?**
   - What we know: gsd-tools has a dedicated `state add-decision` that appends to a decisions list. stclaude's `update-progress --activity` only sets the last activity description, not a list of decisions.
   - What's unclear: Whether decisions should be stored as a list in SpacetimeDB (new table?) or concatenated into velocityData/activity.
   - Recommendation: For v1, concatenate key decisions into the `lastActivityDescription` field or append to `velocityData` JSON. Not ideal but avoids schema changes. Can be improved in v2.

2. **Should the executor still write PLAN.md files locally?**
   - What we know: The executor reads plan content from its prompt (passed by the orchestrator). In the stclaude model, the orchestrator gets plan content from `stclaude read-plan` and passes it to the executor.
   - What's unclear: Does the executor need local PLAN.md files, or can it work entirely from the content passed in its prompt?
   - Recommendation: The executor already receives plan content in its prompt. It does NOT need to read PLAN.md files from disk. The orchestrator (execute-phase.md) is responsible for fetching plan content from stclaude and passing it to the executor.

3. **Config: SpacetimeDB or local?**
   - What we know: Config is stored in SpacetimeDB (config table). But config is also used by gsd-tools for non-core workflows (model profiles, etc.).
   - What's unclear: Whether to read config from stclaude or keep a local config.json for backwards compatibility.
   - Recommendation: Keep `stclaude` config for stclaude-specific settings. For GSD workflow config (model profiles, auto_advance), continue reading from local `.planning/config.json` since those settings are shared with non-patched workflows. This avoids patching config reads.

4. **Phase directory creation (`mkdir -p`)?**
   - What we know: `plan-phase.md` creates phase directories on disk. In stclaude mode, there are no phase directories.
   - What's unclear: Whether any non-state files still need a phase directory (e.g., CONTEXT.md from discuss-phase, RESEARCH.md from researcher).
   - Recommendation: Since all artifacts go to SpacetimeDB, remove `mkdir -p` calls and `.planning/` directory references. If edge cases arise, address per-patch.

## Sources

### Primary (HIGH confidence)

- Direct file analysis of gsd-executor.md, gsd-planner.md, gsd-verifier.md (agent source files)
- Direct file analysis of execute-phase.md, plan-phase.md, progress.md (workflow source files)
- Direct source code analysis of stclaude CLI commands (src/cli/commands/*.ts)
- GSD file manifest (gsd-file-manifest.json) - confirms hash-based tracking
- `/gsd:reapply-patches` command source - confirms merge workflow

### Secondary (MEDIUM confidence)

- PROJECT.md key decisions (Option B: patch at agent layer confirmed)
- REQUIREMENTS.md traceability (PTCH-01 through PTCH-07 mapped to Phase 5)
- STATE.md accumulated decisions (patch strategy decisions documented)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - stclaude CLI is built and working, gsd-tools commands are well-understood
- Architecture: HIGH - all six files analyzed, every integration point identified
- Pitfalls: HIGH - file-based to database-backed migration pitfalls are well-known from Phase 4 experience
- Gap analysis: HIGH - missing commands identified by comparing gsd-tools usage against stclaude command list

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (stable domain, changes only if GSD or stclaude CLI change)
