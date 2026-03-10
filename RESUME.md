# Resume

## Branch: `feature/windows`

PR: https://github.com/weslien/stgsd/pull/6

---

## Work Completed This Session

### Windows Compatibility
- Replaced Unix-only build/install shell pipeline with cross-platform Node.js scripts
- `scripts/build.mjs` — esbuild JS API with correct `createRequire` banner (fixes Node.js v25 runtime error)
- `scripts/install.mjs` — creates `.cmd` + Git Bash wrappers on Windows, symlinks on Unix
- `scripts/ensure-bun.mjs` — cross-platform bun version checker / auto-installer
- Fixed hardcoded `/bin/zsh` → `process.env.SHELL || '/bin/sh'` in `setup.ts` and `seed.ts`
- `spacetime.json` `bun run dev` → `npm run dev`

### Rename: `stclaude` → `stgsd`
- CLI binary, DB prefix (`stgsd-`), config home (`~/.stgsd/`), error messages, help text
- Global commands: `.claude/global-commands/stclaude/` → `.claude/global-commands/stgsd/`
- Setup command: `.claude/commands/setup-stclaude.md` → `.claude/commands/setup-stgsd.md`
- All 18 `stgsd:*` skills updated
- `verify-patches.ts` manifest path: `~/.claude/stclaude/` → `~/.stgsd/` (with `STGSD_HOME` support)
- `VERIFICATION.md` and `.planning/PROJECT.md` updated

### Merged `main`
- Integrated `verify-patches` command, `patch-manifest.json`, v1.2 planning docs
- Resolved 6 merge conflicts

### Local Install Verified
- `npm run install:cli` — builds `dist/stgsd.mjs`, installs to `~/.claude/bin/`
- `stgsd setup --force` — DB `stgsd-f97f9b27d674` on local SpacetimeDB
- 18 `stgsd:*` skills installed to `~/.claude/commands/stgsd/`

---

## Current State

| Item | State |
|------|-------|
| Branch | `feature/windows` |
| Latest commit | `36387db` |
| Local SpacetimeDB | Running at `http://127.0.0.1:3000` |
| Configured DB | `stgsd-f97f9b27d674` |
| `stgsd --version` | `0.0.1` ✓ |
| `stgsd verify-patches` | **33 failures** (see next task) |

---

## Next Task: Fix `verify-patches` Failures

Running `stgsd verify-patches` reports 33 failures across all GSD workflow files. The root cause is that `patch-manifest.json` checks for `stclaude` command strings in the GSD workflow files at `~/.claude/get-shit-done/`, but the binary was renamed to `stgsd` — those external files haven't been updated yet.

### What needs doing

1. **Update `patch-manifest.json`** — replace all `stclaude` pattern strings with `stgsd` throughout the `expected` and `forbidden` arrays for all 33 entries

2. **Update the GSD workflow patches** — the GSD files at `~/.claude/get-shit-done/workflows/`, `~/.claude/get-shit-done/references/`, `~/.claude/get-shit-done/templates/`, and `~/.claude/agents/` contain `stclaude` command invocations that need updating to `stgsd`

3. **Rebuild and reinstall** — `npm run install:cli` to deploy updated `patch-manifest.json` to `~/.stgsd/`

4. **Verify** — `stgsd verify-patches` should report 33/33 passed

### Files affected (33 total)
```
workflows/plan-phase.md          workflows/execute-phase.md
workflows/transition.md          workflows/execute-plan.md
workflows/progress.md            workflows/map-codebase.md
workflows/verify-phase.md        workflows/remove-phase.md
workflows/discuss-phase.md       workflows/add-todo.md
workflows/verify-work.md         workflows/resume-project.md
workflows/check-todos.md         workflows/audit-milestone.md
workflows/quick.md               workflows/pause-work.md
workflows/list-phase-assumptions.md  workflows/diagnose-issues.md
workflows/plan-milestone-gaps.md     workflows/insert-phase.md
workflows/add-phase.md           workflows/research-phase.md
workflows/new-milestone.md       workflows/complete-milestone.md
workflows/health.md
references/phase-argument-parsing.md
templates/debug-subagent-prompt.md
gsd-executor.md   gsd-planner.md   gsd-verifier.md
gsd-phase-researcher.md   gsd-codebase-mapper.md
gsd/debug.md
```

> **Note:** These files live outside the repo (`~/.claude/get-shit-done/` and `~/.claude/agents/`). Check whether `/gsd:reapply-patches` can be used to reapply the patches with the new `stgsd` binary name, or whether each file needs manual updating.
