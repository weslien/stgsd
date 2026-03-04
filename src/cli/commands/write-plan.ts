import { readFileSync } from 'node:fs';
import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findPhaseByNumber } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

function waitForInsert(
  _conn: DbConnection,
  table: { onInsert: (cb: (_ctx: any, row: any) => void) => void },
  matchFn: (row: any) => boolean,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new CliError(
          ErrorCodes.INTERNAL_ERROR,
          `Insert confirmation timed out after ${timeoutMs / 1000} seconds`,
        ),
      );
    }, timeoutMs);

    table.onInsert((_ctx: any, row: any) => {
      if (matchFn(row)) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
}

interface WritePlanData {
  phaseNumber: string;
  planNumber: string;
  objective: string;
  taskCount: number;
}

function formatWritePlan(data: unknown): string {
  const { phaseNumber, planNumber, objective, taskCount } =
    data as WritePlanData;
  const lines = [
    'Plan written:',
    `  Phase: ${phaseNumber}, Plan: ${planNumber}`,
    `  Objective: ${objective}`,
    `  Tasks: ${taskCount}`,
  ];
  return lines.join('\n');
}

export function registerWritePlanCommand(program: Command): void {
  program
    .command('write-plan')
    .description('Persist a plan to SpacetimeDB')
    .requiredOption('--phase <phase>', 'Phase number')
    .requiredOption('--plan <plan>', 'Plan number within phase')
    .requiredOption('--objective <text>', 'Plan objective')
    .option('--type <type>', 'Plan type (execute/tdd)', 'execute')
    .option('--wave <wave>', 'Execution wave number', '1')
    .option(
      '--depends-on <text>',
      'Plan dependencies (comma-separated plan IDs)',
      '',
    )
    .option('--autonomous', 'Plan is fully autonomous (no checkpoints)', true)
    .option('--no-autonomous', 'Plan has checkpoints')
    .option(
      '--requirements <text>',
      'Requirement IDs (comma-separated)',
      '',
    )
    .option('--status <status>', 'Plan status', 'pending')
    .option('--content <text>', 'Full plan content (markdown)')
    .option(
      '--content-file <path>',
      'Read plan content from file instead of --content',
    )
    .option(
      '--tasks-json <json>',
      'Tasks as JSON array: [{taskNumber, type, description}]',
      '[]',
    )
    .option(
      '--must-haves-json <json>',
      'Must-haves as JSON: {truths, artifacts, keyLinks}',
    )
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        // Resolve plan content from --content or --content-file
        let planContent = options.content ?? '';
        if (options.contentFile) {
          try {
            planContent = readFileSync(options.contentFile, 'utf-8');
          } catch (err) {
            throw new CliError(
              ErrorCodes.INVALID_ARGUMENT,
              `Could not read content file: ${options.contentFile} - ${err}`,
            );
          }
        }

        // Validate JSON options
        let tasks: Array<{
          taskNumber: number;
          type?: string;
          description: string;
          status?: string;
        }> = [];
        try {
          tasks = JSON.parse(options.tasksJson);
        } catch {
          throw new CliError(
            ErrorCodes.INVALID_ARGUMENT,
            'Invalid JSON for --tasks-json',
          );
        }

        let mustHaves: {
          truths?: string | string[];
          artifacts?: string | string[];
          keyLinks?: string | string[];
        } | null = null;
        if (options.mustHavesJson) {
          try {
            mustHaves = JSON.parse(options.mustHavesJson);
          } catch {
            throw new CliError(
              ErrorCodes.INVALID_ARGUMENT,
              'Invalid JSON for --must-haves-json',
            );
          }
        }

        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(
            conn,
            project.id,
            options.phase,
          );

          // Set up listener BEFORE calling reducer
          const insertPromise = waitForInsert(
            conn,
            conn.db.plan,
            (row) =>
              row.phaseId === phase.id &&
              row.planNumber === BigInt(options.plan),
          );

          conn.reducers.insertPlan({
            phaseId: phase.id,
            planNumber: BigInt(options.plan),
            type: options.type,
            wave: BigInt(options.wave),
            dependsOn: options.dependsOn,
            objective: options.objective,
            autonomous: options.autonomous,
            requirements: options.requirements,
            status: options.status,
            content: planContent,
          });

          await insertPromise;

          // Find the inserted plan to get its ID
          let insertedPlan = null;
          for (const row of conn.db.plan.iter()) {
            if (
              row.phaseId === phase.id &&
              row.planNumber === BigInt(options.plan)
            ) {
              insertedPlan = row;
              break;
            }
          }

          if (!insertedPlan) {
            throw new CliError(
              ErrorCodes.INTERNAL_ERROR,
              'Plan insert confirmed but row not found',
            );
          }

          // Insert tasks if provided
          if (tasks.length > 0) {
            for (const task of tasks) {
              conn.reducers.insertPlanTask({
                planId: insertedPlan.id,
                taskNumber: BigInt(task.taskNumber),
                type: task.type || 'auto',
                description: task.description,
                status: task.status || 'pending',
                commitHash: '',
              });
            }
            // Wait briefly for task inserts to propagate
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // Insert must-haves if provided
          if (mustHaves) {
            conn.reducers.insertMustHave({
              planId: insertedPlan.id,
              truths:
                typeof mustHaves.truths === 'string'
                  ? mustHaves.truths
                  : JSON.stringify(mustHaves.truths ?? []),
              artifacts:
                typeof mustHaves.artifacts === 'string'
                  ? mustHaves.artifacts
                  : JSON.stringify(mustHaves.artifacts ?? []),
              keyLinks:
                typeof mustHaves.keyLinks === 'string'
                  ? mustHaves.keyLinks
                  : JSON.stringify(mustHaves.keyLinks ?? []),
            });
          }

          return {
            phaseNumber: options.phase,
            planNumber: options.plan,
            objective: options.objective,
            taskCount: tasks.length,
          };
        });

        outputSuccess(result, opts, formatWritePlan);
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
