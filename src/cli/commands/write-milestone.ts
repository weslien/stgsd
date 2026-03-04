import { readFileSync } from 'node:fs';
import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
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
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Insert confirmation timed out after 5 seconds'));
    }, timeoutMs);
    table.onInsert((_ctx: any, row: any) => {
      if (matchFn(row)) { clearTimeout(timer); resolve(); }
    });
  });
}

interface WriteMilestoneData {
  version: string;
  name: string;
  shippedDate: string;
  status: string;
}

function formatWriteMilestone(data: unknown): string {
  const { version, name, shippedDate, status } = data as WriteMilestoneData;
  return [
    'Milestone written:',
    `  Version: ${version}`,
    `  Name: ${name}`,
    `  Shipped: ${shippedDate}`,
    `  Status: ${status}`,
  ].join('\n');
}

export function registerWriteMilestoneCommand(program: Command): void {
  program
    .command('write-milestone')
    .description('Persist milestone completion data to SpacetimeDB')
    .requiredOption('--version <version>', 'Milestone version (e.g. v1.0)')
    .requiredOption('--name <name>', 'Milestone name')
    .requiredOption('--shipped-date <date>', 'Shipped date (YYYY-MM-DD)')
    .requiredOption('--phase-count <n>', 'Number of phases in milestone')
    .requiredOption('--plan-count <n>', 'Number of plans in milestone')
    .requiredOption('--requirement-count <n>', 'Number of requirements in milestone')
    .requiredOption('--status <status>', 'Milestone status (shipped|in_progress|planned)')
    .option('--accomplishments <json>', 'Accomplishments JSON array')
    .option('--accomplishments-file <path>', 'Read accomplishments from file')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        // Resolve accomplishments from --accomplishments or --accomplishments-file
        let accomplishments = options.accomplishments ?? '[]';
        if (options.accomplishmentsFile) {
          try {
            accomplishments = readFileSync(options.accomplishmentsFile, 'utf-8');
          } catch (err) {
            throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Could not read accomplishments file: ${options.accomplishmentsFile} - ${err}`);
          }
        }

        const gitRemoteUrl = getGitRemoteUrl();
        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Register onInsert BEFORE calling reducer
          const insertPromise = waitForInsert(
            conn,
            conn.db.milestone,
            (row) => row.projectId === project.id && row.version === options.version,
          );

          conn.reducers.insertMilestone({
            projectId: project.id,
            version: options.version,
            name: options.name,
            shippedDate: options.shippedDate,
            phaseCount: BigInt(options.phaseCount),
            planCount: BigInt(options.planCount),
            requirementCount: BigInt(options.requirementCount),
            accomplishments,
            status: options.status,
          });

          await insertPromise;

          return {
            version: options.version,
            name: options.name,
            shippedDate: options.shippedDate,
            status: options.status,
          };
        });

        outputSuccess(result, opts, formatWriteMilestone);
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
