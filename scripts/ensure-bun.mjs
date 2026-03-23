#!/usr/bin/env node
/**
 * Cross-platform bun version checker and auto-installer.
 *
 * Usage:
 *   node scripts/ensure-bun.mjs              # Check/install bun (any version)
 *   node scripts/ensure-bun.mjs --min 1.2.0  # Require minimum version
 *   node scripts/ensure-bun.mjs --quiet      # Suppress non-error output
 *
 * Can also be imported:
 *   import { ensureBun } from './ensure-bun.mjs';
 *   const bunPath = await ensureBun({ minVersion: '1.2.0' });
 */

import { execSync } from 'node:child_process';

const MIN_BUN_VERSION_DEFAULT = '1.0.0';

/**
 * Parse a semver string into [major, minor, patch].
 */
function parseSemver(version) {
  const match = version.trim().match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

/**
 * Compare two semver arrays. Returns -1, 0, or 1.
 */
function compareSemver(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
}

/**
 * Try to find bun and return its path and version.
 * Returns { path, version } or null if not found.
 */
function detectBun() {
  const isWindows = process.platform === 'win32';
  const whichCmd = isWindows ? 'where bun' : 'which bun';

  try {
    const bunPath = execSync(whichCmd, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000,
    }).trim().split('\n')[0].trim();

    const versionOutput = execSync(`"${bunPath}" --version`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000,
    }).trim();

    return { path: bunPath, version: versionOutput };
  } catch {
    return null;
  }
}

/**
 * Install bun using the official installer.
 * Returns the installed bun path or throws.
 */
function installBun(quiet) {
  const isWindows = process.platform === 'win32';

  if (!quiet) console.log('Installing bun...');

  try {
    if (isWindows) {
      // Use npm to install bun globally on Windows (most reliable cross-platform method)
      execSync('npm install -g bun', {
        stdio: quiet ? 'pipe' : 'inherit',
        timeout: 120_000,
      });
    } else {
      // Use the official installer on Unix
      execSync('curl -fsSL https://bun.sh/install | bash', {
        stdio: quiet ? 'pipe' : 'inherit',
        timeout: 120_000,
        shell: process.env.SHELL || '/bin/sh',
      });
    }

    // Verify installation
    const result = detectBun();
    if (!result) {
      throw new Error('bun installed but not found in PATH. You may need to restart your shell.');
    }
    return result;
  } catch (err) {
    throw new Error(`Failed to install bun: ${err.message}`);
  }
}

/**
 * Ensure bun is installed and meets the minimum version requirement.
 *
 * @param {Object} options
 * @param {string} [options.minVersion] - Minimum required semver (default: '1.0.0')
 * @param {boolean} [options.quiet] - Suppress non-error output
 * @param {boolean} [options.autoInstall] - Auto-install if missing (default: true)
 * @returns {{ path: string, version: string }} bun info
 * @throws if bun cannot be ensured
 */
export async function ensureBun(options = {}) {
  const minVersion = options.minVersion || MIN_BUN_VERSION_DEFAULT;
  const quiet = options.quiet || false;
  const autoInstall = options.autoInstall !== false;

  const minParsed = parseSemver(minVersion);
  if (!minParsed) {
    throw new Error(`Invalid minimum version: ${minVersion}`);
  }

  // Check if bun is already installed
  let bun = detectBun();

  if (bun) {
    const currentParsed = parseSemver(bun.version);
    if (currentParsed && compareSemver(currentParsed, minParsed) >= 0) {
      if (!quiet) console.log(`bun ${bun.version} found at ${bun.path} (meets >= ${minVersion})`);
      return bun;
    }

    // Version too old
    if (!quiet) console.log(`bun ${bun.version} found but requires >= ${minVersion}`);

    if (!autoInstall) {
      throw new Error(`bun ${bun.version} is below minimum ${minVersion}. Update with: bun upgrade`);
    }

    // Try to upgrade
    if (!quiet) console.log('Upgrading bun...');
    try {
      execSync(`"${bun.path}" upgrade`, {
        stdio: quiet ? 'pipe' : 'inherit',
        timeout: 120_000,
      });
      bun = detectBun();
      if (bun) {
        const upgraded = parseSemver(bun.version);
        if (upgraded && compareSemver(upgraded, minParsed) >= 0) {
          if (!quiet) console.log(`bun upgraded to ${bun.version}`);
          return bun;
        }
      }
    } catch {
      if (!quiet) console.log('bun upgrade failed, attempting fresh install...');
    }
  } else {
    if (!quiet) console.log('bun not found');
  }

  // Not installed or upgrade failed — install fresh
  if (!autoInstall) {
    throw new Error(`bun not found. Install from https://bun.sh or run: npm install -g bun`);
  }

  const installed = installBun(quiet);
  const installedParsed = parseSemver(installed.version);
  if (!installedParsed || compareSemver(installedParsed, minParsed) < 0) {
    throw new Error(`Installed bun ${installed.version} but requires >= ${minVersion}`);
  }

  if (!quiet) console.log(`bun ${installed.version} installed at ${installed.path}`);
  return installed;
}

// CLI entry point
if (process.argv[1] && (process.argv[1].endsWith('ensure-bun.mjs') || process.argv[1].endsWith('ensure-bun'))) {
  const args = process.argv.slice(2);
  const minIdx = args.indexOf('--min');
  const minVersion = minIdx !== -1 ? args[minIdx + 1] : undefined;
  const quiet = args.includes('--quiet');

  try {
    const result = await ensureBun({ minVersion, quiet });
    if (!quiet) console.log(`OK: bun ${result.version}`);
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}
