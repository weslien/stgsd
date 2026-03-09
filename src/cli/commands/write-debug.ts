import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

function waitForInsert(
  conn: DbConnection,
  matchFn: (row: any) => boolean,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Debug session insert timed out after 5 seconds'));
    }, timeoutMs);
    conn.db.debugSession.onInsert((_ctx: any, row: any) => {
      if (matchFn(row)) { clearTimeout(timer); resolve(); }
    });
  });
}

function waitForUpdate(
  conn: DbConnection,
  sessionId: bigint,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Debug session update timed out after 5 seconds'));
    }, timeoutMs);
    conn.db.debugSession.onUpdate((_ctx: any, _oldRow: any, newRow: any) => {
      if (newRow.id === sessionId) { clearTimeout(timer); resolve(); }
    });
  });
}

interface WriteDebugData {
  id: string;
  bugDescription: string;
  action: 'created' | 'updated';
}

function formatWriteDebug(data: unknown): string {
  const { id, bugDescription, action } = data as WriteDebugData;
  return `Debug session ${action}:\n  ID: ${id}\n  Bug: ${bugDescription}`;
}

export function registerWriteDebugCommand(program: Command): void {
  program
    .command('write-debug')
    .description('Create or update a debug session in SpacetimeDB')
    .requiredOption('--bug <text>', 'Bug description (required)')
    .option('--session-id <id>', 'Existing session ID to update (omit to create new)')
    .option('--hypotheses <text>', 'Current hypotheses', '')
    .option('--checkpoints <text>', 'Investigation checkpoints', '')
    .option('--timeline <text>', 'Timeline of events', '')
    .option('--status <status>', 'Session status (investigating|resolved)', 'investigating')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          if (options.sessionId) {
            // UPDATE existing session
            if (!/^\d+$/.test(options.sessionId as string)) {
              throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Invalid session ID "${options.sessionId}": must be numeric`);
            }
            const sessionId = BigInt(options.sessionId as string);

            const existing = conn.db.debugSession.id.find(sessionId);
            if (!existing) {
              throw new CliError(ErrorCodes.DEBUG_SESSION_NOT_FOUND, `Debug session ${options.sessionId} not found`);
            }

            const updatePromise = waitForUpdate(conn, sessionId);

            // updateDebugSession requires ALL fields — spread existing, override with provided options
            conn.reducers.updateDebugSession({
              sessionId,
              bugDescription: options.bug as string,
              hypotheses: (options.hypotheses as string) || existing.hypotheses,
              checkpoints: (options.checkpoints as string) || existing.checkpoints,
              timeline: (options.timeline as string) || existing.timeline,
              status: (options.status as string) || existing.status,
              resolutionNotes: existing.resolutionNotes ?? '',
            });

            await updatePromise;
            return { id: sessionId.toString(), bugDescription: options.bug as string, action: 'updated' as const };
          } else {
            // CREATE new session
            let insertedId: bigint | undefined;
            const bugDescription = options.bug as string;
            const insertPromise = waitForInsert(conn, (row) => {
              if (row.projectId === project.id && row.bugDescription === bugDescription) {
                insertedId = row.id;
                return true;
              }
              return false;
            });

            conn.reducers.insertDebugSession({
              projectId: project.id,
              bugDescription,
              hypotheses: options.hypotheses as string,
              checkpoints: options.checkpoints as string,
              timeline: options.timeline as string,
              status: 'investigating',
              resolutionNotes: '',
            });

            await insertPromise;
            return { id: (insertedId ?? 0n).toString(), bugDescription, action: 'created' as const };
          }
        });

        outputSuccess(result, opts, formatWriteDebug);
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
