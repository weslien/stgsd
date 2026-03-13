---
name: stgsd:mark-requirement
description: Mark one or more requirements as complete
allowed-tools:
  - Bash
---
Mark requirements as complete. The user should provide requirement IDs (e.g., `/stgsd:mark-requirement CLI-01 CLI-02`).

```bash
~/.claude/bin/stgsd mark-requirement $ARGUMENTS
```

If no IDs were provided, ask the user which requirements to mark complete.
