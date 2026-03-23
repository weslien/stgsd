#!/usr/bin/env node
/**
 * Cross-platform install script for stgsd CLI.
 * Replaces the Unix-only shell commands previously in package.json install:cli.
 *
 * What it does:
 * 1. Copies dist/stgsd.mjs to ~/.claude/bin/
 * 2. On Unix: chmod +x, create symlinks in ~/.claude/bin and ~/.local/bin
 * 3. On Windows: create .cmd wrapper and Git Bash wrapper
 * 4. Copies SpacetimeDB module source to ~/.stgsd/module/
 * 5. Copies patch-manifest.json to ~/.stgsd/
 * 6. Runs npm/bun install in the module directory
 */

import { homedir } from 'node:os';
import { join } from 'node:path';
import {
  mkdirSync, cpSync, writeFileSync, existsSync,
  chmodSync, symlinkSync, unlinkSync,
} from 'node:fs';
import { execSync } from 'node:child_process';

const HOME = homedir();
const CLAUDE_BIN = join(HOME, '.claude', 'bin');
const STGSD_MODULE = process.env.STGSD_HOME ? join(process.env.STGSD_HOME, 'module') : join(HOME, '.stgsd', 'module');
const isWindows = process.platform === 'win32';

// Step 1: Copy CLI binary to ~/.claude/bin/
console.log('Installing stgsd CLI...');
mkdirSync(CLAUDE_BIN, { recursive: true });
cpSync('dist/stgsd.mjs', join(CLAUDE_BIN, 'stgsd.mjs'));
console.log(`  Copied to ${join(CLAUDE_BIN, 'stgsd.mjs')}`);

if (isWindows) {
  // Create a .cmd wrapper so `stgsd` works from cmd.exe / PowerShell
  const cmdWrapper = join(CLAUDE_BIN, 'stgsd.cmd');
  writeFileSync(cmdWrapper, '@echo off\r\nnode "%~dp0stgsd.mjs" %*\r\n');
  console.log(`  Created ${cmdWrapper}`);

  // Create a shell wrapper for Git Bash / MSYS2
  const shWrapper = join(CLAUDE_BIN, 'stgsd');
  writeFileSync(shWrapper, '#!/bin/sh\nnode "$(dirname "$0")/stgsd.mjs" "$@"\n');
  console.log(`  Created ${shWrapper} (Git Bash wrapper)`);
} else {
  // Unix: make executable and create symlinks
  chmodSync(join(CLAUDE_BIN, 'stgsd.mjs'), 0o755);

  // stgsd -> stgsd.mjs in ~/.claude/bin/
  const binLink = join(CLAUDE_BIN, 'stgsd');
  try { unlinkSync(binLink); } catch { /* ignore if missing */ }
  symlinkSync('stgsd.mjs', binLink);
  console.log(`  Symlinked ${binLink} -> stgsd.mjs`);

  // ~/.local/bin/stgsd -> ~/.claude/bin/stgsd.mjs
  const localBin = join(HOME, '.local', 'bin');
  mkdirSync(localBin, { recursive: true });
  const localLink = join(localBin, 'stgsd');
  try { unlinkSync(localLink); } catch { /* ignore if missing */ }
  symlinkSync(join(CLAUDE_BIN, 'stgsd.mjs'), localLink);
  console.log(`  Symlinked ${localLink} -> ${join(CLAUDE_BIN, 'stgsd.mjs')}`);
}

// Step 2: Copy SpacetimeDB module source to ~/.stgsd/module/
console.log('Installing SpacetimeDB module source...');
mkdirSync(STGSD_MODULE, { recursive: true });

cpSync('spacetimedb/src', join(STGSD_MODULE, 'src'), { recursive: true });
for (const file of ['package.json', 'tsconfig.json']) {
  const src = join('spacetimedb', file);
  if (existsSync(src)) {
    cpSync(src, join(STGSD_MODULE, file));
  }
}
console.log(`  Installed to ${STGSD_MODULE}`);

// Step 3: Copy patch-manifest.json to ~/.stgsd/
const STGSD_DIR = process.env.STGSD_HOME || join(HOME, '.stgsd');
if (existsSync('patch-manifest.json')) {
  cpSync('patch-manifest.json', join(STGSD_DIR, 'patch-manifest.json'));
  console.log(`  Copied patch-manifest.json to ${STGSD_DIR}`);
}

// Step 4: Install module dependencies
console.log('Installing module dependencies...');
try {
  execSync('npm install', { cwd: STGSD_MODULE, stdio: 'pipe', timeout: 60_000 });
  console.log('  npm install succeeded');
} catch {
  // npm failed — try bun as fallback, ensuring it's available first
  try {
    const { ensureBun } = await import('./ensure-bun.mjs');
    const bun = await ensureBun({ minVersion: '1.0.0', quiet: true, autoInstall: true });
    execSync(`"${bun.path}" install`, { cwd: STGSD_MODULE, stdio: 'pipe', timeout: 60_000 });
    console.log(`  bun install succeeded (using bun ${bun.version})`);
  } catch (bunErr) {
    console.log('  Warning: could not install module dependencies (tried npm and bun)');
    console.log(`  ${bunErr.message || bunErr}`);
  }
}

console.log('\nDone! stgsd CLI installed successfully.');
if (isWindows) {
  console.log(`\nEnsure ${CLAUDE_BIN} is in your PATH, or run:`);
  console.log(`  node "${join(CLAUDE_BIN, 'stgsd.mjs')}" <command>`);
} else {
  console.log('\nEnsure ~/.claude/bin or ~/.local/bin is in your PATH.');
}
