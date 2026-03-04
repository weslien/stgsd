# SpacetimeClaude

A SpacetimeDB-backed replacement for [GSD](https://github.com/get-shit-done-ai/gsd)'s file-based state management in Claude Code. Instead of reading/writing markdown files in `.planning/` directories, GSD agents call a `stclaude` CLI that stores structured state in SpacetimeDB — giving Claude Code queryable, persistent memory that lives outside the repo.

## Why Not Markdown?

GSD stores all planning state as markdown files: `STATE.md`, `ROADMAP.md`, `PLAN.md`, phase directories, verification reports, research notes. This works, but creates friction:

| Problem with Markdown Files | SpacetimeClaude Solution |
|---|---|
| **Parsing overhead** — Agents regex/grep through prose to extract state | **Typed schema** — Structured columns (u64, bool, timestamp) with JSON output |
| **File I/O bottleneck** — Every state read/write is a filesystem operation | **Single query** — SpacetimeDB returns exactly what's needed |
| **Repo pollution** — `.planning/` dirs accumulate dozens of state files | **Zero repo files** — All state lives in SpacetimeDB |
| **Fragile parsing** — Malformed YAML frontmatter or markdown breaks agents | **Schema validation** — Data validated at write time |
| **No cross-project memory** — Each repo is an island | **Shared database** — Query decisions and patterns across projects |
| **Race conditions** — Concurrent agents can clobber files | **Transactional** — SpacetimeDB reducers are atomic |
| **Manual cleanup** — Archiving completed milestones means moving files around | **Structured lifecycle** — Status fields and queries handle state transitions |

## Prerequisites

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** — Anthropic's CLI for Claude
- **[GSD](https://github.com/get-shit-done-ai/gsd)** — The planning/execution workflow that SpacetimeClaude enhances
- **[SpacetimeDB CLI](https://spacetimedb.com/install)** — `spacetime` binary
- **[Node.js 22+](https://nodejs.org/)** — Runtime for the CLI tool
- **Git** — Working repository with an `origin` remote
- **SpacetimeDB account** — Free account on [maincloud](https://spacetimedb.com) (or a local server)

## Quick Start (Inside Claude Code)

There are two steps: **install** (once, in this repo) and **use** (in any project repo).

### Step 1: Install — run in this repo

Clone this repo, open Claude Code inside it, and run:

```
/setup-stclaude
```

This is the only command you run in the spacetimeclaude repo. It's idempotent and handles everything:
- Builds and installs the `stclaude` CLI to `~/.claude/bin/`
- Copies the `/stclaude:*` slash commands so they're available globally
- Ensures SpacetimeDB is running and the module is published
- Verifies the connection works

After this, you're done with the spacetimeclaude repo. Everything below happens in your **project repos**.

### Step 2: Use — run in your project repo

Open Claude Code in any git repo where you want SpacetimeDB-backed planning.

**For an existing GSD project** (has `.planning/` files):

```
/stclaude:setup
/stclaude:seed
```

`/stclaude:setup` provisions a SpacetimeDB database for this repo. `/stclaude:seed` reads your existing `PROJECT.md` and `ROADMAP.md` and imports all project metadata, phases, and requirements into SpacetimeDB.

**For a new project** (no existing `.planning/` files):

```
/stclaude:setup
```

That's it. When you start planning with `/gsd:new-project` or `/gsd:plan-phase`, the patched GSD agents will write state directly to SpacetimeDB — no seed needed.

### Day-to-day workflow

Once set up, you use GSD exactly as before. The patched agents handle SpacetimeDB automatically:

| GSD Command | What happens under the hood |
|---|---|
| `/gsd:progress` | Reads state from SpacetimeDB via `stclaude` |
| `/gsd:plan-phase` | Planner gets context from `stclaude init plan-phase`, writes plans via `stclaude write-plan` |
| `/gsd:execute-phase` | Executor loads plans from SpacetimeDB, writes summaries via `stclaude write-summary` |
| `/gsd:verify-work` | Verifier reads plans/summaries from SpacetimeDB, writes results via `stclaude write-verification` |

You can also query state directly with the `/stclaude:*` commands:

```
/stclaude:status                   # Current phase, plan, last activity
/stclaude:get-state                # Full project state with velocity data
/stclaude:roadmap                  # Phase overview with completion states
/stclaude:get-phase 3              # Phase details with requirements and plans
/stclaude:read-plan 3 1            # Read a specific plan's content
```

## Manual Installation

If you prefer to install without Claude Code, or need to customize the setup:

### 1. Clone and install dependencies

```bash
git clone https://github.com/weslien/stgsd.git
cd stgsd
npm install
```

### 2. Set up SpacetimeDB

```bash
# Option A: Use maincloud (recommended, free)
spacetime login

# Option B: Run locally
spacetime start
```

### 3. Publish the module

```bash
# To maincloud (uses default server)
spacetime publish spacetimeclaude --module-path spacetimedb

# Or to local server
spacetime publish spacetimeclaude --module-path spacetimedb --server local
```

### 4. Generate client bindings

```bash
npm run spacetime:generate
```

### 5. Build and install the CLI

```bash
npm run install:cli
```

Installs `stclaude` to `~/.claude/bin/` (already on Claude Code's PATH) and copies the SpacetimeDB module source for per-repo database provisioning.

### 6. Install slash commands

```bash
cp -r .claude/global-commands/stclaude ~/.claude/global-commands/stclaude
```

### 7. Set up a project repo

From any git repo you want to manage:

```bash
stclaude setup
stclaude seed --name "My Project" --description "..." --core-value "..." \
  --phases-json '[...]' --requirements-json '[...]'
```

## Slash Command Reference

All `/stclaude:*` commands are used in your **project repos**, not in this repo.

**Status & Queries**
| Command | Description |
|---|---|
| `/stclaude:status` | Show current project status (phase, plan, last activity) |
| `/stclaude:get-state` | Full project state with velocity and session data |
| `/stclaude:get-phase` | Phase details with linked plans and requirements |
| `/stclaude:read-plan` | Read plan content and metadata |
| `/stclaude:roadmap` | Phase overview with completion states |

**Workflow Assembly**
| Command | Description |
|---|---|
| `/stclaude:init` | Assemble workflow context (progress, plan-phase, execute-phase) |

**Write Operations**
| Command | Description |
|---|---|
| `/stclaude:write-plan` | Persist a plan to SpacetimeDB |
| `/stclaude:write-summary` | Persist plan execution summary |
| `/stclaude:write-verification` | Persist phase verification result |
| `/stclaude:write-research` | Persist phase research findings |
| `/stclaude:write-context` | Persist phase context (user decisions) |

**State Mutations**
| Command | Description |
|---|---|
| `/stclaude:update-progress` | Update current phase/plan/task position |
| `/stclaude:advance-plan` | Advance to next plan in current phase |
| `/stclaude:complete-phase` | Mark phase complete, advance project state |
| `/stclaude:record-metric` | Record a velocity metric |
| `/stclaude:mark-requirement` | Mark requirements as complete |

**Setup** (run once per project repo)
| Command | Description |
|---|---|
| `/stclaude:setup` | Provision a SpacetimeDB database for this repo |
| `/stclaude:seed` | Bootstrap project data from existing `.planning/` files |

### CLI Direct Usage

The `stclaude` CLI can also be called directly from the terminal in any project repo:

```bash
stclaude status
stclaude get-state --json
stclaude roadmap
stclaude get-phase 3
stclaude read-plan 3 1
```

All commands support `--json` for machine-readable output.

## How It Works

### Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────────┐
│  GSD Agents     │     │  stclaude    │     │  SpacetimeDB     │
│  (patched .md)  │────▶│  CLI         │────▶│  (maincloud)     │
│                 │     │              │     │                  │
│  - executor     │     │  17 commands │     │  13 tables       │
│  - planner      │     │  JSON output │     │  CRUD reducers   │
│  - verifier     │     │  git identity│     │  seed_project    │
└─────────────────┘     └──────────────┘     └──────────────────┘
```

1. **SpacetimeDB module** defines 13 tables (project, phase, plan, task, requirement, state, verification, research, etc.) with CRUD reducers
2. **`stclaude` CLI** auto-detects the current project via git remote URL, connects to SpacetimeDB, and executes queries/mutations
3. **GSD agent patches** replace file I/O calls in `gsd-executor.md`, `gsd-planner.md`, and `gsd-verifier.md` with `stclaude` commands
4. **Slash commands** provide the interface for Claude Code, calling the CLI with proper context

### Project Identity

Projects are identified by git remote URL — no manual configuration needed. When you run `stclaude` in any git repo, it reads the `origin` remote and looks up (or creates) the matching project in SpacetimeDB.

### Per-Repo Configuration

Each repo's config is stored at `~/.claude/stclaude/{repoId}/config.json`:

```json
{
  "uri": "wss://maincloud.spacetimedb.com",
  "database": "spacetimeclaude-abc123",
  "module-path": "~/.claude/stclaude/module"
}
```

## Managing GSD Updates

SpacetimeClaude patches three GSD agent files to use `stclaude` instead of file I/O. These patches are designed to survive GSD updates.

### How patches work

1. Patches are minimal, targeted text replacements (not full file rewrites)
2. GSD tracks file hashes in `gsd-file-manifest.json`
3. When you run `/gsd:update`, GSD detects modified files and backs them up to `~/.claude/gsd-local-patches/`

### After a GSD update

```
/gsd:reapply-patches
```

GSD detects your patches and backs them up automatically. Run the above to reapply after updating.

If a patch fails to merge cleanly (due to major GSD restructuring), you'll need to manually re-apply the changes. The patches are small — they replace specific `gsd-tools.cjs` calls with `stclaude` equivalents.

### Patched files

| File | What Changed |
|---|---|
| `gsd-executor.md` | State reads/writes and summary creation use `stclaude` |
| `gsd-planner.md` | Context loaded from `stclaude init plan-phase`, plans written via `stclaude write-plan` |
| `gsd-verifier.md` | Plans/summaries read from `stclaude`, verification results written back |

## Project Structure

```
spacetimeclaude/
├── spacetimedb/              # SpacetimeDB module (backend)
│   └── src/
│       ├── schema.ts         # 13 table definitions
│       └── index.ts          # Reducers and lifecycle hooks
├── src/                      # CLI tool
│   └── cli/
│       ├── index.ts          # Commander.js entry point
│       ├── commands/         # 17 command implementations
│       └── lib/              # Connection, git, output helpers
├── .claude/
│   ├── commands/
│   │   └── setup-stclaude.md # Bootstrap command (run in this repo)
│   └── global-commands/
│       └── stclaude/         # 18 slash commands (installed globally)
└── .planning/                # GSD roadmap (for this project itself)
```

## Troubleshooting

**`stclaude: command not found`**
- Run `npm run install:cli` to install to `~/.claude/bin/`
- Ensure `~/.claude/bin` is on your PATH

**`PROJECT_NOT_FOUND`**
- Run `/stclaude:seed` or `stclaude seed` to bootstrap the project
- Verify your repo has an `origin` remote: `git remote -v`

**Connection timeout**
- Check SpacetimeDB is running: `spacetime start` (local) or verify maincloud status
- Check your config: `cat ~/.claude/stclaude/*/config.json`

**Slash commands not available**
- Run `/setup-stclaude` in this repo, or manually copy: `cp -r .claude/global-commands/stclaude ~/.claude/global-commands/stclaude`

**SpacetimeDB module errors**
- Check logs: `spacetime logs spacetimeclaude`
- Republish: `spacetime publish spacetimeclaude --clear-database -y --module-path spacetimedb`

## License

MIT
