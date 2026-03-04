Idempotent setup of stclaude shared resources AND this repo's database. This builds, installs the CLI, installs global commands, and provisions the local SpacetimeDB. Safe to run repeatedly — it only does work that's actually needed.

Run these steps in order. For each step, check the precondition first and skip if already satisfied.

## Step 1: Build and install the CLI

Run from the `spacetimeclaude/` subdirectory of this repo:

```bash
cd spacetimeclaude && bun run install:cli
```

This builds `stclaude` and copies it to `~/.claude/bin/`, and also copies the SpacetimeDB module source to `~/.claude/stclaude/module/`.

## Step 2: Install global commands

Copy the global stclaude commands so `/stclaude:setup` works from any repo:

```bash
mkdir -p ~/.claude/commands/stclaude
cp -r .claude/global-commands/stclaude/* ~/.claude/commands/stclaude/
```

## Step 3: Ensure local SpacetimeDB is running

Check with `spacetime server ping local`. If it fails, start it with `spacetime start` (run in background).

## Step 4: Run `stclaude setup --force`

This publishes (or re-publishes) the module for the current repo's git remote. The `--force` flag ensures the module is updated if the schema changed. This is idempotent — it overwrites the existing database with the latest module code.

```bash
~/.claude/bin/stclaude setup --force
```

## Step 5: Verify

Run `~/.claude/bin/stclaude` to confirm the connection works. If it reports `PROJECT_NOT_FOUND`, that's expected for a fresh database — it means the connection is working but no project has been seeded yet.

Report what happened at each step (skipped / ran / failed).
