#!/usr/bin/env bash
# Adds stgsd integration blocks to GSD workflow files

GSD="$HOME/.claude/get-shit-done"
AGENTS="$HOME/.claude/agents"
COMMANDS="$HOME/.claude/commands"

patch_file() {
  local file="$1"
  local block="$2"

  if [ ! -f "$file" ]; then
    echo "SKIP (not found): $file"
    return
  fi

  if grep -q "stgsd-sync\|stgsd-note\|zero-pad for stgsd" "$file" 2>/dev/null; then
    echo "ALREADY PATCHED: $file"
    return
  fi

  printf "\n%s\n" "$block" >> "$file"
  echo "PATCHED: $file"
}

patch_file "$GSD/workflows/plan-phase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd get-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-context --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd write-research --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/execute-phase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd get-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd complete-phase --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd write-verification --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd read-plan --phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/transition.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd complete-phase --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd update-progress --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/execute-plan.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-summary --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd advance-plan --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd record-metric --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd mark-requirement --phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/progress.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init progress --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/map-codebase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-codebase-map --json 2>/dev/null || true
~/.claude/bin/stgsd write-codebase-map 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/verify-phase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-verification --phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/remove-phase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd remove-phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/discuss-phase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd get-codebase-map --json 2>/dev/null || true
~/.claude/bin/stgsd write-context --phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/add-todo.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd list-todos --json 2>/dev/null || true
~/.claude/bin/stgsd add-todo 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/verify-work.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/resume-project.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd get-session --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/check-todos.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd list-todos --json 2>/dev/null || true
~/.claude/bin/stgsd complete-todo 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/audit-milestone.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd write-audit 2>/dev/null || true
~/.claude/bin/stgsd get-milestones --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/quick.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/pause-work.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd write-session 2>/dev/null || true
~/.claude/bin/stgsd get-session --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/list-phase-assumptions.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/diagnose-issues.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd write-debug 2>/dev/null || true
~/.claude/bin/stgsd get-debug --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/plan-milestone-gaps.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd add-phase 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/insert-phase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd insert-phase 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/add-phase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd add-phase 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/research-phase.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-research --phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/new-milestone.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-milestones --json 2>/dev/null || true
~/.claude/bin/stgsd get-milestones --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/complete-milestone.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd write-milestone 2>/dev/null || true
~/.claude/bin/stgsd write-audit 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/workflows/health.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd health validation 2>/dev/null || true
~/.claude/bin/stgsd health 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$GSD/references/phase-argument-parsing.md" \
'<stgsd-note>
Phase numbers are passed as plain integers to stgsd: `stgsd get-phase 3` (not `stgsd get-phase 03`).
Do not zero-pad for stgsd commands; pass plain integer values.
</stgsd-note>'

patch_file "$GSD/templates/debug-subagent-prompt.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd write-debug 2>/dev/null || true
~/.claude/bin/stgsd get-debug --json 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$AGENTS/gsd-executor.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-summary --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd advance-plan --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd update-progress --json 2>/dev/null || true
~/.claude/bin/stgsd mark-requirement 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$AGENTS/gsd-planner.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-plan --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd read-plan --phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$AGENTS/gsd-verifier.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-verification --phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$AGENTS/gsd-phase-researcher.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-research --phase "$PHASE" 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$AGENTS/gsd-codebase-mapper.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd write-codebase-map --type tech 2>/dev/null || true
~/.claude/bin/stgsd write-codebase-map 2>/dev/null || true
```
</stgsd-sync>'

patch_file "$COMMANDS/gsd/debug.md" \
'<stgsd-sync>
```bash
~/.claude/bin/stgsd get-debug --json 2>/dev/null || true
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd write-debug 2>/dev/null || true
```
</stgsd-sync>'

echo "Done patching all files"
