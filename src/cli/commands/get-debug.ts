import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface DebugSessionData {
  id: string;
  bugDescription: string;
  hypotheses: string;
  checkpoints: string;
  timeline: string;
  status: string;
  resolutionNotes: string;
  createdAt: string;
  updatedAt: string;
}

function formatGetDebug(data: unknown): string {
  const s = data as DebugSessionData;
  return [
    `## Debug Session ${s.id}`,
    '',
    `**Bug:** ${s.bugDescription}`,
    `**Status:** ${s.status}`,
    '',
    `### Hypotheses`,
    s.hypotheses || '(none)',
    '',
    `### Checkpoints`,
    s.checkpoints || '(none)',
    '',
    `### Timeline`,
    s.timeline || '(none)',
    '',
    s.resolutionNotes ? `### Resolution\n${s.resolutionNotes}` : '',
    `Created: ${s.createdAt}  Updated: ${s.updatedAt}`,
  ].filter(line => line !== '').join('\n');
}

export function registerGetDebugCommand(program: Command): void {
  program
    .command('get-debug')
    .description('Retrieve the active debug session for the current project')
    .option('--session-id <id>', 'Specific session ID to retrieve')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          let session: any;

          if (options.sessionId) {
            if (!/^\d+$/.test(options.sessionId as string)) {
              throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Invalid session ID "${options.sessionId}": must be numeric`);
            }
            session = conn.db.debugSession.id.find(BigInt(options.sessionId as string));
            if (!session) {
              throw new CliError(ErrorCodes.DEBUG_SESSION_NOT_FOUND, `Debug session ${options.sessionId} not found`);
            }
          } else {
            // Get most recently updated non-resolved session for this project
            const sessions = [...conn.db.debugSession.debug_session_project_id.filter(project.id)]
              .filter(row => row.status !== 'resolved')
              .sort((a, b) => Number(b.updatedAt.microsSinceUnixEpoch - a.updatedAt.microsSinceUnixEpoch));

            if (sessions.length === 0) {
              throw new CliError(ErrorCodes.DEBUG_SESSION_NOT_FOUND, 'No active debug session found. Use write-debug to create one.');
            }
            session = sessions[0];
          }

          return {
            id: session.id.toString(),
            bugDescription: session.bugDescription,
            hypotheses: session.hypotheses,
            checkpoints: session.checkpoints,
            timeline: session.timeline,
            status: session.status,
            resolutionNotes: session.resolutionNotes ?? '',
            createdAt: new Date(Number(session.createdAt.microsSinceUnixEpoch / 1000n)).toISOString(),
            updatedAt: new Date(Number(session.updatedAt.microsSinceUnixEpoch / 1000n)).toISOString(),
          } as DebugSessionData;
        });

        outputSuccess(result, opts, formatGetDebug);
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
