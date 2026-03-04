---
name: stclaude:write-research
description: Persist phase research findings to SpacetimeDB
allowed-tools:
  - Bash
---
Persist research findings. Build the command from context.

Required options:
- `--phase <phase>` — Phase number
- `--domain <domain>` — Research domain
- `--confidence <level>` — Confidence level: HIGH, MEDIUM, or LOW
- `--content <text>` — Research content (prose)

```bash
~/.claude/bin/stclaude write-research [options]
```

If required arguments are missing, ask the user for them.
