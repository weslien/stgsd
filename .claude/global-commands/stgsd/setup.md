---
name: stgsd:setup
description: Provision a local SpacetimeDB database for the current repo. Requires stgsd CLI to be installed already.
allowed-tools:
  - Bash
---
<objective>
Provision stgsd for the current repo — publish a SpacetimeDB module and write per-repo config. Idempotent and safe to run repeatedly.

Assumes the stgsd CLI is already installed at `~/.claude/bin/stgsd`. If not, tell the user to run `/setup-stgsd` from the stgsd repo first.
</objective>

<process>

## Step 1: Verify stgsd CLI is installed

```bash
~/.claude/bin/stgsd --version
```

If this fails, stop and tell the user:
> stgsd CLI not installed. Run `/setup-stgsd` from the stgsd repo first.

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
~/.claude/bin/stgsd setup --force
```

This publishes (or re-publishes) the SpacetimeDB module for the current repo's git remote and writes per-repo config to `~/.stgsd/projects/<repoId>/config.json`.

## Step 4: Verify

```bash
~/.claude/bin/stgsd
```

No arguments runs the status command. If it reports `PROJECT_NOT_FOUND`, that's expected for a fresh database — the connection works but no project has been seeded yet.

Report what happened at each step (skipped / ran / failed).
</process>
