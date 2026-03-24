import { execSync } from 'node:child_process';
import { CliError, ErrorCodes } from './errors.js';

/**
 * Quote a path for use in shell commands.
 * Wraps in double quotes to handle spaces and special characters.
 */
export function shellQuote(p: string): string {
  return `"${p}"`;
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
