import { execSync } from 'node:child_process';
import { CliError, ErrorCodes } from './errors.js';

export function getGitRemoteUrl(): string {
  try {
    return execSync('git config --get remote.origin.url', {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();
  } catch {
    throw new CliError(
      ErrorCodes.NOT_GIT_REPO,
      'Not in a git repository with a remote. Run from a git repo with an origin remote.',
    );
  }
}
