# Resume

## Branch: `feature/windows`

PR: https://github.com/weslien/stgsd/pull/6

---

## Work Completed

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

### Fixed `verify-patches` (33/33 passing)
- Updated `patch-manifest.json`: replaced all `stclaude` → `stgsd` pattern strings
- Added `scripts/patch-gsd-files.sh` — patches 33 GSD workflow/agent/command files
- Ran script to add `<stgsd-sync>` / `<stgsd-note>` integration blocks to each file
- `stgsd verify-patches` now reports **33/33 passed**

---

## Current State

| Item | State |
|------|-------|
| Branch | `feature/windows` |
| Latest commit | `63d4b64` |
| Local SpacetimeDB | Running at `http://127.0.0.1:3000` |
| Configured DB | `stgsd-f97f9b27d674` |
| `stgsd --version` | `0.0.1` ✓ |
| `stgsd verify-patches` | **33/33 passed** ✓ |

---

## Next Steps

The branch is feature-complete and verified. Options:
1. **Push and update PR** — `git push origin feature/windows` to update PR #6
2. **Review and merge** — the PR at https://github.com/weslien/stgsd/pull/6 is ready for review
