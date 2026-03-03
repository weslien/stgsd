import type { DbConnection } from '../../module_bindings/index.js';
import { CliError, ErrorCodes } from './errors.js';

/**
 * Find a project by its git remote URL.
 * Iterates all project rows and matches on gitRemoteUrl.
 * Throws PROEJCT_NOT_FOUND if no match.
 */
export function findProjectByGitRemote(
  conn: DbConnection,
  gitRemoteUrl: string,
) {
  for (const row of conn.db.project.iter()) {
    if (row.gitRemoteUrl === gitRemoteUrl) {
      return row;
    }
  }
  throw new CliError(
    ErrorCodes.PROJECT_NOT_FOUND,
    `No project found for git remote: ${gitRemoteUrl}`,
  );
}

/**
 * Find the project state row for a given project ID.
 * Returns null if no state exists yet (fresh project).
 */
export function findProjectState(conn: DbConnection, projectId: bigint) {
  for (const row of conn.db.projectState.iter()) {
    if (row.projectId === projectId) {
      return row;
    }
  }
  return null;
}

/**
 * Find a phase by project ID and phase number string.
 * Phase numbers are strings (support decimals like "2.1").
 * Throws PHASE_NOT_FOUND if no match.
 */
export function findPhaseByNumber(
  conn: DbConnection,
  projectId: bigint,
  number: string,
) {
  for (const row of conn.db.phase.iter()) {
    if (row.projectId === projectId && row.number === number) {
      return row;
    }
  }
  throw new CliError(
    ErrorCodes.PHASE_NOT_FOUND,
    `No phase found with number "${number}"`,
  );
}
