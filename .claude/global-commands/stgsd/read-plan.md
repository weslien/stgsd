---
name: stgsd:read-plan
description: Read plan content and metadata from SpacetimeDB
allowed-tools:
  - Bash
---
Read a plan from SpacetimeDB. The user should provide phase and plan numbers (e.g., `/stgsd:read-plan 03 01`).

```bash
~/.claude/bin/stgsd read-plan $ARGUMENTS
```

If arguments are missing, ask the user for the phase number and plan number.
