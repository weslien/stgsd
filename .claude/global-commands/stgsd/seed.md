---
name: stgsd:seed
description: Bootstrap project data into SpacetimeDB for the current repo. Reads .planning/PROJECT.md and ROADMAP.md to derive seed parameters.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---
<objective>
Seed a new project in SpacetimeDB for the current repo by reading the GSD planning files and calling `stgsd seed`. Requires `/stgsd:setup` to have been run first.
</objective>

<process>

## Step 1: Verify stgsd is configured for this repo

```bash
~/.claude/bin/stgsd setup
```

If it reports `NOT_CONFIGURED`, tell the user to run `/stgsd:setup` first. If it reports `Already configured`, proceed.

## Step 2: Gather project metadata

Read the GSD planning files to derive seed parameters:

1. Read `.planning/PROJECT.md` — extract:
   - **name**: from the `# Title` heading
   - **description**: from the "What This Is" section
   - **core-value**: from the "Core Value" section
   - **constraints**: from the "Constraints" section
   - **context**: from the "Context" section
   - **key-decisions**: from the "Key Decisions" section (if present)

2. Read `.planning/ROADMAP.md` — extract phases and requirements:
   - **phases**: each phase as `{ "number": "01", "name": "...", "slug": "...", "goal": "...", "status": "pending|complete", "depends_on": "", "success_criteria": "..." }`
   - **requirements**: each requirement as `{ "category": "SCHM", "number": "01", "description": "...", "status": "pending|complete", "phase_number": "01" }`

If `.planning/PROJECT.md` doesn't exist, ask the user for the project name, description, and core value interactively.

## Step 3: Build and run the seed command

Construct the `stgsd seed` command with the gathered data:

```bash
~/.claude/bin/stgsd seed \
  --name "<project name>" \
  --description "<description>" \
  --core-value "<core value>" \
  --constraints "<constraints>" \
  --context "<context>" \
  --key-decisions "<key decisions>" \
  --phases-json '<phases array>' \
  --requirements-json '<requirements array>'
```

**CRITICAL — use exact field names (snake_case) or data will silently be lost:**

Phases JSON fields (all required):
```json
[{"number":"01","name":"...","slug":"...","goal":"...","status":"pending","depends_on":"","success_criteria":"..."}]
```

Requirements JSON fields (all required):
```json
[{"category":"SCHM","number":"01","description":"...","status":"pending","phase_number":"01"}]
```

The requirement ID that `mark-requirement` uses is `{category}-{number}` (e.g. `SCHM-01`).

Other notes:
- Escape quotes and special characters in values
- Keep description and core-value concise (1-2 sentences)
- If no phases or requirements are found, omit those flags (defaults to `[]`)

## Step 4: Verify

Run `~/.claude/bin/stgsd` to confirm the project shows up with correct data.

Report the project name, ID, and number of phases/requirements seeded.
</process>
