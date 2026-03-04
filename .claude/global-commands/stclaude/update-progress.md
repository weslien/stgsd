---
name: stclaude:update-progress
description: Update project progress state (phase, plan, task, activity)
allowed-tools:
  - Bash
---
Update project progress state. Build the command from the user's arguments or conversation context.

Available options:
- `--phase <phase>` — Set current phase number
- `--plan <plan>` — Set current plan number
- `--task <task>` — Set current task number
- `--activity <description>` — Set last activity description
- `--session-last <date>` — Set last session date (YYYY-MM-DD)
- `--session-stopped <description>` — Set where session stopped

```bash
~/.claude/bin/stclaude update-progress $ARGUMENTS
```

If no arguments are provided, ask the user what they want to update.
