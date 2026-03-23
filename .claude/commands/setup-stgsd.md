Idempotent setup of stgsd shared resources AND this repo's database. This builds, installs the CLI, installs global commands, and provisions the local SpacetimeDB. Safe to run repeatedly — it only does work that's actually needed.

Run these steps in order. For each step, check the precondition first and skip if already satisfied.

## Step 0: Ensure prerequisites

Verify Node.js and npm are available:

```bash
node --version && npm --version
```

Ensure bun is installed and up to date (used as a fallback package manager). Run from the repo root:

```bash
node scripts/ensure-bun.mjs --min 1.0.0
```

If bun is missing or outdated, this will auto-install/upgrade it. If auto-install fails, install manually from https://bun.sh or run `npm install -g bun`.

## Step 1: Build and install the CLI

Run from the repo root:

```bash
npm run install:cli
```

This builds `stgsd` and copies it to `~/.claude/bin/`, creates platform-appropriate wrappers (`.cmd` on Windows, symlinks on Unix), and copies the SpacetimeDB module source to `~/.stgsd/module/`.

## Step 2: Install global commands

Copy the global stgsd commands so `/stgsd:setup` works from any repo.

**Unix/macOS:**
```bash
mkdir -p ~/.claude/commands/stgsd
cp -r .claude/global-commands/stgsd/* ~/.claude/commands/stgsd/
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\commands\stgsd"
Copy-Item -Recurse -Force .claude\global-commands\stgsd\* "$env:USERPROFILE\.claude\commands\stgsd\"
```

**Windows (Git Bash):**
```bash
mkdir -p ~/.claude/commands/stgsd
cp -r .claude/global-commands/stgsd/* ~/.claude/commands/stgsd/
```

## Step 3: Ensure local SpacetimeDB is running

Check with `spacetime server ping local`. If it fails, start it with `spacetime start` (run in background).

## Step 4: Run `stgsd setup --force`

This publishes (or re-publishes) the module for the current repo's git remote. The `--force` flag ensures the module is updated if the schema changed. This is idempotent — it overwrites the existing database with the latest module code.

**Unix/macOS:**
```bash
~/.claude/bin/stgsd setup --force
```

**Windows (cmd/PowerShell):**
```
%USERPROFILE%\.claude\bin\stgsd setup --force
```

**Windows (Git Bash):**
```bash
~/.claude/bin/stgsd setup --force
```

## Step 5: Verify

Run `stgsd` (if in PATH) or the full path to confirm the connection works. If it reports `PROJECT_NOT_FOUND`, that's expected for a fresh database — it means the connection is working but no project has been seeded yet.

Report what happened at each step (skipped / ran / failed).
