---
name: stgsd:write-plan
description: Persist a plan to SpacetimeDB
allowed-tools:
  - Bash
  - Read
---
Persist a plan to SpacetimeDB. Build the command from the user's arguments or conversation context.

Required options:
- `--phase <phase>` — Phase number
- `--plan <plan>` — Plan number within phase
- `--objective <text>` — Plan objective

Optional:
- `--type <type>` — Plan type: execute or tdd (default: execute)
- `--wave <wave>` — Execution wave number (default: 1)
- `--depends-on <text>` — Comma-separated plan IDs
- `--autonomous` / `--no-autonomous` — Whether plan has checkpoints
- `--requirements <text>` — Comma-separated requirement IDs
- `--status <status>` — Plan status (default: pending)
- `--content <text>` — Full plan content (markdown)
- `--content-file <path>` — Read plan content from file
- `--tasks-json <json>` — Tasks as JSON array: `[{taskNumber, type, description}]`
- `--must-haves-json <json>` — Must-haves: `{truths, artifacts, keyLinks}`

```bash
~/.claude/bin/stgsd write-plan [options]
```

If required arguments are missing, ask the user for them.
