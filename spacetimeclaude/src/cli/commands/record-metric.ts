import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findProjectState } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

function waitForStateUpdate(
  conn: DbConnection,
  projectId: bigint,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new CliError(
          ErrorCodes.INTERNAL_ERROR,
          'State update timed out after 5 seconds',
        ),
      );
    }, timeoutMs);

    const done = () => {
      clearTimeout(timer);
      resolve();
    };

    conn.db.projectState.onUpdate((_ctx, _oldRow, newRow) => {
      if (newRow.projectId === projectId) done();
    });
    conn.db.projectState.onInsert((_ctx, newRow) => {
      if (newRow.projectId === projectId) done();
    });
  });
}

interface VelocityEntry {
  id: string;
  duration: number;
  phase?: string;
  recordedAt?: string;
}

interface VelocityData {
  plans: VelocityEntry[];
}

function parseVelocityData(raw: string): VelocityData {
  if (!raw || raw.trim() === '') return { plans: [] };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.plans)) return parsed;
    return { plans: [] };
  } catch {
    return { plans: [] };
  }
}

interface RecordMetricData {
  planId: string;
  duration: number;
  totalMetrics: number;
  velocityData: VelocityData;
}

function formatRecordMetric(data: unknown): string {
  const { planId, duration, totalMetrics } = data as RecordMetricData;
  const lines = [
    'Recorded metric:',
    `  Plan: ${planId}`,
    `  Duration: ${duration}min`,
    `  Total metrics: ${totalMetrics}`,
  ];
  return lines.join('\n');
}

export function registerRecordMetricCommand(program: Command): void {
  program
    .command('record-metric')
    .description('Record a velocity metric for a completed plan')
    .requiredOption(
      '--plan-id <id>',
      'Plan identifier string (e.g., "02-01")',
    )
    .requiredOption(
      '--duration <minutes>',
      'Execution duration in minutes',
    )
    .option('--phase <phase>', 'Phase number for the metric')
    .action(
      async (options: {
        planId: string;
        duration: string;
        phase?: string;
      }) => {
        const opts = program.opts<{ json: boolean }>();

        try {
          // Validate duration is a positive number
          const duration = Number(options.duration);
          if (isNaN(duration) || duration <= 0) {
            throw new CliError(
              ErrorCodes.INVALID_ARGUMENT,
              'Duration must be a positive number',
            );
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

            // Parse and append velocity data
            const velocityObj = parseVelocityData(state.velocityData);
            velocityObj.plans.push({
              id: options.planId,
              duration,
              phase: options.phase ?? state.currentPhase,
              recordedAt: new Date().toISOString().slice(0, 10),
            });
            const newVelocityData = JSON.stringify(velocityObj);

            // Set up listener BEFORE calling reducer
            const updatePromise = waitForStateUpdate(conn, project.id);

            conn.reducers.upsertProjectState({
              projectId: project.id,
              currentPhase: state.currentPhase,
              currentPlan: state.currentPlan,
              currentTask: state.currentTask,
              lastActivityDescription: `Recorded metric for plan ${options.planId} (${duration}min)`,
              velocityData: newVelocityData,
              sessionLast: state.sessionLast,
              sessionStoppedAt: state.sessionStoppedAt,
              sessionResumeFile: state.sessionResumeFile ?? '',
            });

            await updatePromise;

            return {
              planId: options.planId,
              duration,
              totalMetrics: velocityObj.plans.length,
              velocityData: velocityObj,
            };
          });

          outputSuccess(result, opts, formatRecordMetric);
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
