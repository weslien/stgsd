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

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/your-org/spacetimeclaude.git
cd spacetimeclaude
npm install
```

### 2. Set up SpacetimeDB

Log in to maincloud (or start a local server):

```bash
# Option A: Use maincloud (recommended, free)
spacetime login

# Option B: Run locally
spacetime start
```

### 3. Publish the SpacetimeDB module

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

This builds `stclaude` and installs it to `~/.claude/bin/`, which is already on Claude Code's PATH. It also copies the SpacetimeDB module source for per-repo database provisioning.

### 6. Install slash commands

Copy the global commands into your Claude Code config:

```bash
cp -r .claude/global-commands/stclaude ~/.claude/global-commands/stclaude
```

This registers all `/stclaude:*` slash commands globally so they work in any repo.

### 7. Set up your first project

From any git repo you want to manage with SpacetimeClaude:

```bash
# Configure stclaude for this repo (creates per-repo config)
stclaude setup

# Seed the project from existing .planning/ files
# (or use /stclaude:seed in Claude Code)
stclaude seed --name "My Project" --description "..." --core-value "..." \
  --phases-json '[...]' --requirements-json '[...]'
```

Or use the slash command in Claude Code — `/stclaude:seed` reads your `.planning/PROJECT.md` and `ROADMAP.md` automatically.

## Usage

### Slash Commands

SpacetimeClaude integrates with Claude Code through 18 slash commands:

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

**Setup**
| Command | Description |
|---|---|
| `/stclaude:setup` | Provision a local SpacetimeDB database for this repo |
| `/stclaude:seed` | Bootstrap project data from `.planning/` files |

### CLI Direct Usage

The `stclaude` CLI can also be called directly from the terminal:

```bash
# Check project status
stclaude status

# Get full state as JSON (for scripting)
stclaude get-state --json

# View roadmap
stclaude roadmap

# Get phase details
stclaude get-phase 3

# Read a specific plan
stclaude read-plan 3 1
```

All commands support `--json` for machine-readable output.

## Using SpacetimeClaude from Inside Claude Code

The fastest way to get started in a repo is the `/setup-stclaude` custom command. Open Claude Code in this repo and run:

```
/setup-stclaude
```

This is idempotent — it builds and installs the CLI, copies the global slash commands, ensures SpacetimeDB is running, publishes the module for the current repo, and verifies the connection. Safe to run repeatedly.

Once set up, you interact with SpacetimeClaude entirely through slash commands in Claude Code. Here's a typical workflow:

### Seeding a new project

After `/setup-stclaude`, your database is empty. Seed it from your existing `.planning/` files:

```
/stclaude:seed
```

Claude reads your `PROJECT.md` and `ROADMAP.md`, extracts project metadata, phases, and requirements, and calls `stclaude seed` to bootstrap everything into SpacetimeDB.

### Checking project status

```
/stclaude:status
```

Returns current phase, active plan, last activity, and a quick overview — all pulled from SpacetimeDB instead of parsing markdown files.

### Planning a phase

```
/stclaude:init plan-phase 3
```

Assembles the full context bundle the planner agent needs: phase details, requirements, prior research, existing plans, and project-wide context. The patched `gsd-planner` agent calls this automatically when you run `/gsd:plan-phase`.

### Executing work

```
/stclaude:init execute-phase 3
```

Loads the current plan, task list, must-haves, and resume state for the executor. The patched `gsd-executor` agent calls this automatically during `/gsd:execute-phase`.

### Writing results back

After execution, agents write artifacts back to SpacetimeDB:

```
/stclaude:write-summary 3 1      # Plan execution summary
/stclaude:write-verification 3   # Phase verification result
/stclaude:advance-plan 3 1       # Move to next plan
/stclaude:complete-phase 3       # Mark phase done
```

These are called automatically by the patched GSD agents — you typically don't need to invoke them manually.

### The GSD integration

With the agent patches installed, the standard GSD commands work seamlessly with SpacetimeDB:

| GSD Command | What happens under the hood |
|---|---|
| `/gsd:progress` | Reads state from SpacetimeDB via `stclaude` |
| `/gsd:plan-phase` | Planner gets context from `stclaude init plan-phase`, writes plans via `stclaude write-plan` |
| `/gsd:execute-phase` | Executor loads plans from SpacetimeDB, writes summaries via `stclaude write-summary` |
| `/gsd:verify-work` | Verifier reads plans/summaries from SpacetimeDB, writes results via `stclaude write-verification` |

You use GSD exactly as before — the storage backend is just SpacetimeDB instead of markdown files.

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

SpacetimeClaude patches three GSD agent files to use `stclaude` instead of file I/O. These patches are designed to survive GSD updates:

### How patches work

1. Patches are minimal, targeted text replacements (not full file rewrites)
2. GSD tracks file hashes in `gsd-file-manifest.json`
3. When you run `/gsd:update`, GSD detects modified files and backs them up to `~/.claude/gsd-local-patches/`

### After a GSD update

```bash
# GSD will detect your patches and back them up automatically.
# Reapply them after updating:
/gsd:reapply-patches
```

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
│   └── global-commands/
│       └── stclaude/         # 18 slash command definitions
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
- Copy global commands: `cp -r .claude/global-commands/stclaude ~/.claude/global-commands/stclaude`

**SpacetimeDB module errors**
- Check logs: `spacetime logs spacetimeclaude`
- Republish: `spacetime publish spacetimeclaude --clear-database -y --module-path spacetimedb`

## License

MIT
