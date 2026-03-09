---
name: stgsd:complete-phase
description: Mark a phase as complete and advance project state
allowed-tools:
  - Bash
---
Mark a phase as complete. The user should provide a phase number (e.g., `/stgsd:complete-phase 03`).

```bash
~/.claude/bin/stgsd complete-phase $ARGUMENTS
```

If no phase number was provided, ask the user which phase to complete.
