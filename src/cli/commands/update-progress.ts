import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findProjectState, waitForStateUpdate } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface UpdateProgressData {
  project: { id: bigint; name: string };
  state: {
    currentPhase: string;
    currentPlan: bigint;
    currentTask: bigint;
    lastActivityDescription: string;
    sessionLast: string;
    sessionStoppedAt: string;
  };
}

function formatUpdateProgress(data: unknown): string {
  const { state } = data as UpdateProgressData;
  const lines = [
    'Progress updated:',
    `  Phase: ${state.currentPhase}`,
    `  Plan: ${state.currentPlan}`,
    `  Task: ${state.currentTask}`,
    `  Activity: ${state.lastActivityDescription}`,
  ];
  return lines.join('\n');
}

export function registerUpdateProgressCommand(program: Command): void {
  program
    .command('update-progress')
    .description('Update project progress state')
    .option('--phase <phase>', 'Set current phase number')
    .option('--plan <plan>', 'Set current plan number')
    .option('--task <task>', 'Set current task number')
    .option('--activity <description>', 'Set last activity description')
    .option('--session-last <date>', 'Set last session date (YYYY-MM-DD)')
    .option(
      '--session-stopped <description>',
      'Set where session stopped',
    )
    .action(
      async (options: {
        phase?: string;
        plan?: string;
        task?: string;
        activity?: string;
        sessionLast?: string;
        sessionStopped?: string;
      }) => {
        const opts = program.opts<{ json: boolean }>();

        try {
          // Validate at least one option is provided
          const hasOption =
            options.phase !== undefined ||
            options.plan !== undefined ||
            options.task !== undefined ||
            options.activity !== undefined ||
            options.sessionLast !== undefined ||
            options.sessionStopped !== undefined;

          if (!hasOption) {
            throw new CliError(
              ErrorCodes.INVALID_ARGUMENT,
              'At least one option required. See --help.',
            );
          }

          // Validate numeric options
          if (options.plan !== undefined) {
            try {
              BigInt(options.plan);
            } catch {
              throw new CliError(
                ErrorCodes.INVALID_ARGUMENT,
                'Plan must be a number',
              );
            }
          }
          if (options.task !== undefined) {
            try {
              BigInt(options.task);
            } catch {
              throw new CliError(
                ErrorCodes.INVALID_ARGUMENT,
                'Task must be a number',
              );
            }
          }

          const gitRemoteUrl = getGitRemoteUrl();

          const result = await withConnection(async (conn: DbConnection) => {
            const project = findProjectByGitRemote(conn, gitRemoteUrl);
            const state = findProjectState(conn, project.id);

            if (!state) {
              throw new CliError(
                ErrorCodes.INTERNAL_ERROR,
                'No project state exists. Run a seed_project reducer first.',
              );
            }

            // Merge: use provided option or existing value
            const currentPhase = options.phase ?? state.currentPhase;
            const currentPlan =
              options.plan !== undefined
                ? BigInt(options.plan)
                : state.currentPlan;
            const currentTask =
              options.task !== undefined
                ? BigInt(options.task)
                : state.currentTask;
            const lastActivityDescription =
              options.activity ?? state.lastActivityDescription;
            const sessionLast =
              options.sessionLast ?? state.sessionLast;
            const sessionStoppedAt =
              options.sessionStopped ?? state.sessionStoppedAt;

            // Set up listener BEFORE calling reducer
            const updatePromise = waitForStateUpdate(conn, project.id);

            conn.reducers.upsertProjectState({
              projectId: project.id,
              currentPhase,
              currentPlan,
              currentTask,
              lastActivityDescription,
              velocityData: state.velocityData,
              sessionLast,
              sessionStoppedAt,
              sessionResumeFile: state.sessionResumeFile ?? '',
            });

            await updatePromise;

            const updatedState = findProjectState(conn, project.id);

            return {
              project: { id: project.id, name: project.name },
              state: {
                currentPhase: updatedState?.currentPhase ?? currentPhase,
                currentPlan: updatedState?.currentPlan ?? currentPlan,
                currentTask: updatedState?.currentTask ?? currentTask,
                lastActivityDescription:
                  updatedState?.lastActivityDescription ??
                  lastActivityDescription,
                sessionLast: updatedState?.sessionLast ?? sessionLast,
                sessionStoppedAt:
                  updatedState?.sessionStoppedAt ?? sessionStoppedAt,
              },
            };
          });

          outputSuccess(result, opts, formatUpdateProgress);
          process.exit(0);
        } catch (err) {
          if (err instanceof CliError) {
            outputError(err.code, err.message, opts);
          } else {
            outputError(ErrorCodes.INTERNAL_ERROR, String(err), opts);
          }
        }
      },
    );
}
