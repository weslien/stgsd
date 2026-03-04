---
name: stclaude:write-verification
description: Persist a phase verification result to SpacetimeDB
allowed-tools:
  - Bash
---
Persist a verification result. Build the command from context.

Required options:
- `--phase <phase>` — Phase number
- `--status <status>` — Verification status: pass, fail, or partial
- `--score <score>` — Score (0-100)

Optional:
- `--content <text>` — Verification content (prose)
- `--recommended-fixes <text>` — Recommended fixes

```bash
~/.claude/bin/stclaude write-verification [options]
```

If required arguments are missing, ask the user for them.
