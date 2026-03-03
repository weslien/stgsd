import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findProjectState, waitForStateUpdate } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface AdvancePlanData {
  project: { id: bigint; name: string };
  previousPlan: bigint;
  newPlan: bigint;
  state: {
    currentPhase: string;
    currentPlan: bigint;
    currentTask: bigint;
    lastActivityDescription: string;
  } | null;
}

function formatAdvancePlan(data: unknown): string {
  const { previousPlan, newPlan, state } = data as AdvancePlanData;
  const lines = [
    `Advanced plan: ${previousPlan} -> ${newPlan}`,
    `Phase: ${state?.currentPhase ?? 'unknown'}`,
  ];
  return lines.join('\n');
}

export function registerAdvancePlanCommand(program: Command): void {
  program
    .command('advance-plan')
    .description('Advance to the next plan in the current phase')
    .action(async () => {
      const opts = program.opts<{ json: boolean }>();

      try {
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

          // Set up listener BEFORE calling reducer
          const updatePromise = waitForStateUpdate(conn, project.id);

          conn.reducers.upsertProjectState({
            projectId: project.id,
            currentPhase: state.currentPhase,
            currentPlan: state.currentPlan + 1n,
            currentTask: 0n,
            lastActivityDescription: `Advanced to plan ${state.currentPlan + 1n}`,
            velocityData: state.velocityData,
            sessionLast: state.sessionLast,
            sessionStoppedAt: state.sessionStoppedAt,
            sessionResumeFile: state.sessionResumeFile ?? '',
          });

          await updatePromise;

          const updatedState = findProjectState(conn, project.id);

          return {
            project: { id: project.id, name: project.name },
            previousPlan: state.currentPlan,
            newPlan: state.currentPlan + 1n,
            state: updatedState
              ? {
                  currentPhase: updatedState.currentPhase,
                  currentPlan: updatedState.currentPlan,
                  currentTask: updatedState.currentTask,
                  lastActivityDescription:
                    updatedState.lastActivityDescription,
                }
              : null,
          };
        });

        outputSuccess(result, opts, formatAdvancePlan);
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
