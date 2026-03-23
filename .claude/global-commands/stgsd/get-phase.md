---
name: stgsd:get-phase
description: Get full phase details with linked plans and requirements
allowed-tools:
  - Bash
---
Get phase details from SpacetimeDB. The user should provide a phase number as the argument to this command (e.g., `/stgsd:get-phase 03`).

```bash
~/.claude/bin/stgsd get-phase $ARGUMENTS
```

If no phase number was provided, ask the user which phase they want to inspect.
