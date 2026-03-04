---
name: stclaude:write-summary
description: Persist a plan execution summary to SpacetimeDB
allowed-tools:
  - Bash
---
Persist a plan execution summary. Build the command from context.

Required options:
- `--phase <phase>` — Phase number
- `--plan <plan>` — Plan number
- `--headline <text>` — One-line summary

Optional:
- `--subsystem <text>` — Subsystem affected
- `--tags <text>` — Comma-separated tags
- `--accomplishments <text>` — What was accomplished
- `--deviations <text>` — Deviations from plan
- `--files <text>` — Files modified (comma-separated)
- `--decisions <text>` — Decisions made
- `--dependency-graph <text>` — Dependency graph metadata

```bash
~/.claude/bin/stclaude write-summary [options]
```

If required arguments are missing, ask the user for them.
