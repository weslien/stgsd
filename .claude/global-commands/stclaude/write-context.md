---
name: stclaude:write-context
description: Persist phase context (user decisions) to SpacetimeDB
allowed-tools:
  - Bash
  - Read
---
Persist phase context. Build the command from the user's arguments.

Required options:
- `--phase <phase>` — Phase number
- `--content <text>` or `--content-file <path>` — Context content (markdown)

```bash
~/.claude/bin/stclaude write-context [options]
```

If required arguments are missing, ask the user for them.
