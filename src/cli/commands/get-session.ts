import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findProjectState, findPhaseByNumber } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface SessionCheckpointData {
  id: string;
  phaseNumber: string;
  phaseContext: string;
  completedWork: string;
  remainingWork: string;
  decisions: string;
  blockers: string;
  nextAction: string;
  mentalContext: string;
  createdAt: string;
  updatedAt: string;
}

function formatGetSession(data: unknown): string {
  const s = data as SessionCheckpointData;
  return [
    `Session checkpoint for phase ${s.phaseNumber}:`,
    '',
    `Next action: ${s.nextAction}`,
    '',
    `Phase context:\n${s.phaseContext}`,
    '',
    `Completed work:\n${s.completedWork}`,
    '',
    `Remaining work:\n${s.remainingWork}`,
    '',
    `Decisions:\n${s.decisions}`,
    '',
    `Blockers:\n${s.blockers || '(none)'}`,
    '',
    `Mental context:\n${s.mentalContext}`,
  ].join('\n');
}

export function registerGetSessionCommand(program: Command): void {
  program
    .command('get-session')
    .description('Retrieve session checkpoint from SpacetimeDB')
    .option('--phase <phase>', 'Phase number to retrieve checkpoint for (defaults to current phase)')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Resolve phase number: use --phase flag or fall back to current phase from project state
          let phaseNumber = options.phase as string | undefined;
          if (!phaseNumber) {
            const state = findProjectState(conn, project.id);
            if (!state) {
              throw new CliError(ErrorCodes.SESSION_NOT_FOUND, 'No project state found. Use --phase to specify a phase number.');
            }
            phaseNumber = state.currentPhase;
          }

          const phase = findPhaseByNumber(conn, project.id, phaseNumber);

          // Use index lookup for fast retrieval
          const checkpoints = [...conn.db.sessionCheckpoint.session_checkpoint_phase_id.filter(phase.id)];
          if (checkpoints.length === 0) {
            throw new CliError(
              ErrorCodes.SESSION_NOT_FOUND,
              `No session checkpoint found for phase ${phaseNumber}. Run write-session to create one.`,
            );
          }

          // Take the most recently updated checkpoint (there should only be one per phase due to upsert)
          const checkpoint = checkpoints.sort((a, b) =>
            Number(b.updatedAt.microsSinceUnixEpoch - a.updatedAt.microsSinceUnixEpoch)
          )[0];

          return {
            id: checkpoint.id.toString(),
            phaseNumber,
            phaseContext: checkpoint.phaseContext,
            completedWork: checkpoint.completedWork,
            remainingWork: checkpoint.remainingWork,
            decisions: checkpoint.decisions,
            blockers: checkpoint.blockers,
            nextAction: checkpoint.nextAction,
            mentalContext: checkpoint.mentalContext,
            createdAt: new Date(Number(checkpoint.createdAt.microsSinceUnixEpoch / 1000n)).toISOString(),
            updatedAt: new Date(Number(checkpoint.updatedAt.microsSinceUnixEpoch / 1000n)).toISOString(),
          } as SessionCheckpointData;
        });

        outputSuccess(result, opts, formatGetSession);
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
