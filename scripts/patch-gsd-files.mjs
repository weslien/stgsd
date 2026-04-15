#!/usr/bin/env node
/**
 * Cross-platform script to add stgsd integration blocks to GSD workflow files.
 * Replaces the bash-only patch-gsd-files.sh for Windows compatibility.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const HOME = homedir();
const GSD = join(HOME, '.claude', 'get-shit-done');
const AGENTS = join(HOME, '.claude', 'agents');
const COMMANDS = join(HOME, '.claude', 'commands');

function patchFile(filePath, block) {
  if (!existsSync(filePath)) {
    console.log(`SKIP (not found): ${filePath}`);
    return;
  }

  const content = readFileSync(filePath, 'utf-8');
  if (/stgsd-sync|stgsd-note|zero-pad for stgsd/.test(content)) {
    console.log(`ALREADY PATCHED: ${filePath}`);
    return;
  }

  writeFileSync(filePath, content + '\n' + block + '\n');
  console.log(`PATCHED: ${filePath}`);
}

// --- GSD Workflows ---

patchFile(join(GSD, 'workflows', 'plan-phase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd get-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-context --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd write-research --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'execute-phase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd get-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd complete-phase --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd write-verification --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd read-plan --phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'transition.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd complete-phase --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd update-progress --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'execute-plan.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-summary --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd advance-plan --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd record-metric --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd mark-requirement --phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'progress.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init progress --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'map-codebase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-codebase-map --json 2>/dev/null || true
~/.claude/bin/stgsd write-codebase-map 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'verify-phase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-verification --phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'remove-phase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd remove-phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'discuss-phase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd get-codebase-map --json 2>/dev/null || true
~/.claude/bin/stgsd write-context --phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'add-todo.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd list-todos --json 2>/dev/null || true
~/.claude/bin/stgsd add-todo 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'verify-work.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'resume-project.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd get-session --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'check-todos.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd list-todos --json 2>/dev/null || true
~/.claude/bin/stgsd complete-todo 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'audit-milestone.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd write-audit 2>/dev/null || true
~/.claude/bin/stgsd get-milestones --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'quick.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'pause-work.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd write-session 2>/dev/null || true
~/.claude/bin/stgsd get-session --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'list-phase-assumptions.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'diagnose-issues.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd write-debug 2>/dev/null || true
~/.claude/bin/stgsd get-debug --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'plan-milestone-gaps.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd add-phase 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'insert-phase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd insert-phase 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'add-phase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd add-phase 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'research-phase.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-research --phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'new-milestone.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-milestones --json 2>/dev/null || true
~/.claude/bin/stgsd get-milestones --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'complete-milestone.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd write-milestone 2>/dev/null || true
~/.claude/bin/stgsd write-audit 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(GSD, 'workflows', 'health.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd health validation 2>/dev/null || true
~/.claude/bin/stgsd health 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

// --- GSD References & Templates ---

patchFile(join(GSD, 'references', 'phase-argument-parsing.md'),
`<stgsd-note>
Phase numbers are passed as plain integers to stgsd: \`stgsd get-phase 3\` (not \`stgsd get-phase 03\`).
Do not zero-pad for stgsd commands; pass plain integer values.
</stgsd-note>`);

patchFile(join(GSD, 'templates', 'debug-subagent-prompt.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd write-debug 2>/dev/null || true
~/.claude/bin/stgsd get-debug --json 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

// --- Agent Files ---

patchFile(join(AGENTS, 'gsd-executor.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-summary --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd advance-plan --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd update-progress --json 2>/dev/null || true
~/.claude/bin/stgsd mark-requirement 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(AGENTS, 'gsd-planner.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-plan --phase "$PHASE" 2>/dev/null || true
~/.claude/bin/stgsd roadmap analyze --json 2>/dev/null || true
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd read-plan --phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(AGENTS, 'gsd-verifier.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd init execute-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-verification --phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(AGENTS, 'gsd-phase-researcher.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd init plan-phase "$PHASE" --json 2>/dev/null || true
~/.claude/bin/stgsd write-research --phase "$PHASE" 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

patchFile(join(AGENTS, 'gsd-codebase-mapper.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd write-codebase-map --type tech 2>/dev/null || true
~/.claude/bin/stgsd write-codebase-map 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

// --- Command Files ---

patchFile(join(COMMANDS, 'gsd', 'debug.md'),
`<stgsd-sync>
\`\`\`bash
~/.claude/bin/stgsd get-debug --json 2>/dev/null || true
~/.claude/bin/stgsd get-state --json 2>/dev/null || true
~/.claude/bin/stgsd write-debug 2>/dev/null || true
\`\`\`
</stgsd-sync>`);

console.log('Done patching all files');
