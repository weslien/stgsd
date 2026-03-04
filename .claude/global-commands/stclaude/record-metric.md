---
name: stclaude:record-metric
description: Record a velocity metric for a completed plan
allowed-tools:
  - Bash
---
Record a velocity metric. Build the command from the user's arguments.

Required options:
- `--plan-id <id>` — Plan identifier (e.g., "02-01")
- `--duration <minutes>` — Execution duration in minutes
- `--phase <phase>` — Phase number

```bash
~/.claude/bin/stclaude record-metric $ARGUMENTS
```

If required arguments are missing, ask the user for them.
