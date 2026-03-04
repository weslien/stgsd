import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findPhaseByNumber } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

function waitForUpsert(
  conn: DbConnection,
  phaseId: bigint,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Session checkpoint upsert timed out after 5 seconds'));
    }, timeoutMs);

    const done = () => { clearTimeout(timer); resolve(); };

    conn.db.sessionCheckpoint.onInsert((_ctx: any, row: any) => {
      if (row.phaseId === phaseId) done();
    });
    conn.db.sessionCheckpoint.onUpdate((_ctx: any, _oldRow: any, newRow: any) => {
      if (newRow.phaseId === phaseId) done();
    });
  });
}

interface WriteSessionData {
  phaseNumber: string;
  nextAction: string;
}

function formatWriteSession(data: unknown): string {
  const { phaseNumber, nextAction } = data as WriteSessionData;
  return [
    'Session checkpoint written:',
    `  Phase: ${phaseNumber}`,
    `  Next action: ${nextAction}`,
  ].join('\n');
}

export function registerWriteSessionCommand(program: Command): void {
  program
    .command('write-session')
    .description('Persist session checkpoint to SpacetimeDB (replaces .continue-here.md)')
    .requiredOption('--phase <phase>', 'Phase number (e.g. 09)')
    .requiredOption('--phase-context <text>', 'Current phase context and position')
    .requiredOption('--completed-work <text>', 'Work completed this session')
    .requiredOption('--remaining-work <text>', 'Work still remaining')
    .requiredOption('--decisions <text>', 'Key decisions made this session')
    .requiredOption('--blockers <text>', 'Current blockers or issues (empty string if none)')
    .requiredOption('--next-action <text>', 'Specific first action when resuming')
    .requiredOption('--mental-context <text>', 'Mental state, approach, the "vibe"')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, options.phase);

          // Register listeners BEFORE calling reducer (handles both insert and update)
          const upsertPromise = waitForUpsert(conn, phase.id);

          conn.reducers.upsertSessionCheckpoint({
            projectId: project.id,
            phaseId: phase.id,
            phaseContext: options.phaseContext,
            completedWork: options.completedWork,
            remainingWork: options.remainingWork,
            decisions: options.decisions,
            blockers: options.blockers,
            nextAction: options.nextAction,
            mentalContext: options.mentalContext,
          });

          await upsertPromise;

          return {
            phaseNumber: options.phase,
            nextAction: options.nextAction,
          };
        });

        outputSuccess(result, opts, formatWriteSession);
        process.exit(0);
      } catch (err) {
        if (err instanceof CliError) {
          outputError(err.code, err.message, opts);
        } else {
          outputError(ErrorCodes.INTERNAL_ERROR, String(err), opts);
        }
      }
    });
}
