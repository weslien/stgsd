---
name: stclaude:setup
description: Provision a local SpacetimeDB database for the current repo. Requires stclaude CLI to be installed already.
allowed-tools:
  - Bash
---
<objective>
Provision stclaude for the current repo — publish a SpacetimeDB module and write per-repo config. Idempotent and safe to run repeatedly.

Assumes the stclaude CLI is already installed at `~/.claude/bin/stclaude`. If not, tell the user to run `/setup-stclaude` from the spacetimeclaude repo first.
</objective>

<process>

## Step 1: Verify stclaude CLI is installed

```bash
~/.claude/bin/stclaude --version
```

If this fails, stop and tell the user:
> stclaude CLI not installed. Run `/setup-stclaude` from the spacetimeclaude repo first.

## Step 2: Ensure local SpacetimeDB is running

```bash
spacetime server ping local
```

If it fails, start it:

```bash
spacetime start &
```

Wait a moment, then verify with `spacetime server ping local` again.

## Step 3: Publish module and write config

```bash
~/.claude/bin/stclaude setup --force
```

This publishes (or re-publishes) the SpacetimeDB module for the current repo's git remote and writes per-repo config to `~/.claude/stclaude/projects/<repoId>/config.json`.

## Step 4: Verify

```bash
~/.claude/bin/stclaude
```

No arguments runs the status command. If it reports `PROJECT_NOT_FOUND`, that's expected for a fresh database — the connection works but no project has been seeded yet.

Report what happened at each step (skipped / ran / failed).
</process>
