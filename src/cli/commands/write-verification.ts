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

interface WriteVerificationData {
  phaseNumber: string;
  status: string;
  score: number;
}

function formatWriteVerification(data: unknown): string {
  const { phaseNumber, status, score } = data as WriteVerificationData;
  const lines = [
    'Verification written:',
    `  Phase: ${phaseNumber}`,
    `  Status: ${status}`,
    `  Score: ${score}`,
  ];
  return lines.join('\n');
}

export function registerWriteVerificationCommand(program: Command): void {
  program
    .command('write-verification')
    .description('Persist a phase verification result to SpacetimeDB')
    .requiredOption('--phase <phase>', 'Phase number')
    .requiredOption('--status <status>', 'Verification status (pass/fail/partial)')
    .requiredOption('--score <score>', 'Score (0-100)')
    .option('--content <text>', 'Verification content (prose)', '')
    .option('--recommended-fixes <text>', 'Recommended fixes', '')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        // Validate score
        const scoreNum = Number(options.score);
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
          throw new CliError(
            ErrorCodes.INVALID_ARGUMENT,
            'Score must be a number 0-100',
          );
        }
        const score = BigInt(Math.floor(scoreNum));

        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, options.phase);

          // Set up listener BEFORE calling reducer
          const insertPromise = waitForInsert(
            conn,
            conn.db.verification,
            (row) => row.phaseId === phase.id,
          );

          conn.reducers.insertVerification({
            phaseId: phase.id,
            status: options.status,
            score: score,
            content: options.content,
            recommendedFixes: options.recommendedFixes,
          });

          await insertPromise;

          return {
            phaseNumber: options.phase,
            status: options.status,
            score: Number(score),
          };
        });

        outputSuccess(result, opts, formatWriteVerification);
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
