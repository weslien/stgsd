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
          'Insert confirmation timed out after 5 seconds',
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

interface WriteSummaryData {
  planId: bigint;
  phaseNumber: string;
  planNumber: string;
  headline: string;
}

function formatWriteSummary(data: unknown): string {
  const { phaseNumber, planNumber, headline } = data as WriteSummaryData;
  const lines = [
    'Summary written:',
    `  Phase: ${phaseNumber}, Plan: ${planNumber}`,
    `  Headline: ${headline}`,
  ];
  return lines.join('\n');
}

export function registerWriteSummaryCommand(program: Command): void {
  program
    .command('write-summary')
    .description('Persist a plan execution summary to SpacetimeDB')
    .requiredOption('--phase <phase>', 'Phase number')
    .requiredOption('--plan <plan>', 'Plan number within phase')
    .requiredOption('--headline <text>', 'One-line summary headline')
    .option('--subsystem <text>', 'Subsystem affected', '')
    .option('--tags <text>', 'Comma-separated tags', '')
    .option('--accomplishments <text>', 'What was accomplished', '')
    .option('--deviations <text>', 'Deviations from plan', '')
    .option('--files <text>', 'Files modified (comma-separated)', '')
    .option('--decisions <text>', 'Decisions made during execution', '')
    .option('--dependency-graph <text>', 'Dependency graph metadata', '')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, options.phase);

          // Resolve plan by phase ID and plan number
          let targetPlan = null;
          for (const row of conn.db.plan.iter()) {
            if (
              row.phaseId === phase.id &&
              row.planNumber === BigInt(options.plan)
            ) {
              targetPlan = row;
              break;
            }
          }
          if (!targetPlan) {
            throw new CliError(
              ErrorCodes.PLAN_NOT_FOUND,
              `No plan ${options.plan} in phase ${options.phase}`,
            );
          }

          // Set up listener BEFORE calling reducer
          const insertPromise = waitForInsert(
            conn,
            conn.db.planSummary,
            (row) => row.planId === targetPlan!.id,
          );

          conn.reducers.insertPlanSummary({
            planId: targetPlan.id,
            subsystem: options.subsystem,
            tags: options.tags,
            headline: options.headline,
            accomplishments: options.accomplishments,
            deviations: options.deviations,
            files: options.files,
            decisions: options.decisions,
            dependencyGraph: options.dependencyGraph,
          });

          await insertPromise;

          return {
            planId: targetPlan.id,
            phaseNumber: options.phase,
            planNumber: options.plan,
            headline: options.headline,
          };
        });

        outputSuccess(result, opts, formatWriteSummary);
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
