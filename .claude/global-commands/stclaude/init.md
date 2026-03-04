---
name: stclaude:init
description: Assemble workflow context (progress, plan-phase, execute-phase)
allowed-tools:
  - Bash
---
Assemble workflow context from SpacetimeDB. The user should specify which workflow context to assemble.

Subcommands:
- `progress` — Assemble progress workflow context
- `plan-phase <phase>` — Assemble planning workflow context for a phase
- `execute-phase <phase>` — Assemble execution workflow context for a phase

```bash
~/.claude/bin/stclaude init $ARGUMENTS
```

If no subcommand was provided, ask the user which workflow context they need.
