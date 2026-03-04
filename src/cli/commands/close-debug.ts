import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

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

interface CloseDebugData {
  id: string;
  bugDescription: string;
  resolution: string;
}

function formatCloseDebug(data: unknown): string {
  const { id, bugDescription, resolution } = data as CloseDebugData;
  return [
    `Debug session closed:`,
    `  ID: ${id}`,
    `  Bug: ${bugDescription}`,
    `  Resolution: ${resolution}`,
  ].join('\n');
}

export function registerCloseDebugCommand(program: Command): void {
  program
    .command('close-debug')
    .description('Mark a debug session as resolved with resolution notes')
    .argument('<id>', 'Debug session ID to close')
    .requiredOption('--resolution <text>', 'Resolution notes (root cause and fix)')
    .action(async (id, options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        if (!/^\d+$/.test(id)) {
          throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Invalid session ID "${id}": must be numeric`);
        }
        const sessionId = BigInt(id);

        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          const existing = conn.db.debugSession.id.find(sessionId);
          if (!existing) {
            throw new CliError(ErrorCodes.DEBUG_SESSION_NOT_FOUND, `Debug session ${id} not found`);
          }
          if (existing.projectId !== project.id) {
            throw new CliError(ErrorCodes.DEBUG_SESSION_NOT_FOUND, `Debug session ${id} not found in this project`);
          }

          const updatePromise = waitForUpdate(conn, sessionId);

          // updateDebugSession requires ALL fields — spread existing, override status + resolutionNotes
          conn.reducers.updateDebugSession({
            sessionId,
            bugDescription: existing.bugDescription,
            hypotheses: existing.hypotheses,
            checkpoints: existing.checkpoints,
            timeline: existing.timeline,
            status: 'resolved',
            resolutionNotes: options.resolution as string,
          });

          await updatePromise;

          return {
            id,
            bugDescription: existing.bugDescription,
            resolution: options.resolution as string,
          } as CloseDebugData;
        });

        outputSuccess(result, opts, formatCloseDebug);
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
