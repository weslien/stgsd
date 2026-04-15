import { execSync } from 'node:child_process';
import { CliError, ErrorCodes } from './errors.js';

/**
 * Quote a path for use in shell commands.
 *
 * On POSIX shells, wraps in single quotes and escapes embedded single quotes
 * so that the argument is not subject to variable or command expansion.
 *
 * On Windows (cmd.exe), wraps in double quotes, escapes embedded double quotes
 * by doubling them, and doubles '%' characters to prevent environment variable
 * expansion (e.g. %VAR%).
 */
export function shellQuote(p: string): string {
  const isWindows = process.platform === 'win32';

  if (isWindows) {
    // For cmd.exe: escape " as "" and % as %% inside a double-quoted string.
    const escaped = p.replace(/"/g, '""').replace(/%/g, '%%');
    return `"${escaped}"`;
  }

  // For POSIX shells: use single quotes and escape embedded single quotes.
  // Pattern: 'foo'\''bar' is interpreted as foo'bar.
  const escaped = p.replace(/'/g, `'\\''`);
  return `'${escaped}'`;
}

/**
 * Resolve the spacetime CLI binary path.
 * Uses `where` on Windows, `which` on Unix.
 */
export function resolveSpacetimeBin(): string {
  const isWindows = process.platform === 'win32';
  const whichCmd = isWindows ? 'where spacetime' : 'which spacetime';
  const shellOpt = isWindows ? undefined : (process.env.SHELL || '/bin/sh');

  try {
    return execSync(whichCmd, {
      encoding: 'utf-8',
      ...(shellOpt ? { shell: shellOpt } : {}),
      timeout: 5000,
    }).trim().split('\n')[0].trim();
  } catch {
    throw new CliError(
      ErrorCodes.INTERNAL_ERROR,
      'spacetime CLI not found. Install SpacetimeDB: https://spacetimedb.com/install',
    );
  }
}
