import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findPhaseByNumber } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

function waitForDelete(
  conn: DbConnection,
  phaseId: bigint,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Phase delete timed out after 5 seconds'));
    }, timeoutMs);
    conn.db.phase.onDelete((_ctx: any, row: any) => {
      if (row.id === phaseId) { clearTimeout(timer); resolve(); }
    });
  });
}

interface RemovePhaseData {
  phaseNumber: string;
  phaseName: string;
  force: boolean;
}

function formatRemovePhase(data: unknown): string {
  const { phaseNumber, phaseName, force } = data as RemovePhaseData;
  return [
    `Phase ${phaseNumber} (${phaseName}) removed from SpacetimeDB.`,
    force ? '  (--force used: completed plans were also deleted)' : '',
  ].filter(Boolean).join('\n');
}

export function registerRemovePhaseCommand(program: Command): void {
  program
    .command('remove-phase')
    .description('Remove a phase from SpacetimeDB (cascade deletes plans, research, context, checkpoints)')
    .requiredOption('--phase <phase>', 'Phase number to remove (integer or decimal)')
    .option('--force', 'Remove even if phase has completed plans', false)
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, options.phase);

          // Safety check: refuse to remove phases with completed plans unless --force
          if (!options.force) {
            const plans = [...conn.db.plan.plan_phase_id.filter(phase.id)];
            const completedPlans = plans.filter((p) => p.status === 'Complete');
            if (completedPlans.length > 0) {
              throw new CliError(
                ErrorCodes.INVALID_ARGUMENT,
                `Phase ${options.phase} has ${completedPlans.length} completed plan(s). Use --force to remove anyway.`,
              );
            }
          }

          // Register onDelete BEFORE calling reducer
          const deletePromise = waitForDelete(conn, phase.id);

          conn.reducers.deletePhase({
            phaseId: phase.id,
          });

          await deletePromise;

          return {
            phaseNumber: options.phase,
            phaseName: phase.name,
            force: options.force as boolean,
          };
        });

        outputSuccess(result, opts, formatRemovePhase);
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
