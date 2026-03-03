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

interface WriteResearchData {
  phaseNumber: string;
  domain: string;
  confidence: string;
}

function formatWriteResearch(data: unknown): string {
  const { phaseNumber, domain, confidence } = data as WriteResearchData;
  const lines = [
    'Research written:',
    `  Phase: ${phaseNumber}`,
    `  Domain: ${domain}`,
    `  Confidence: ${confidence}`,
  ];
  return lines.join('\n');
}

export function registerWriteResearchCommand(program: Command): void {
  program
    .command('write-research')
    .description('Persist phase research findings to SpacetimeDB')
    .requiredOption('--phase <phase>', 'Phase number')
    .requiredOption('--domain <domain>', 'Research domain')
    .requiredOption('--confidence <level>', 'Confidence level (HIGH/MEDIUM/LOW)')
    .requiredOption('--content <text>', 'Research content (prose)')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, options.phase);

          // Set up listener BEFORE calling reducer
          const insertPromise = waitForInsert(
            conn,
            conn.db.research,
            (row) => row.phaseId === phase.id,
          );

          conn.reducers.insertResearch({
            phaseId: phase.id,
            domain: options.domain,
            confidence: options.confidence,
            content: options.content,
          });

          await insertPromise;

          return {
            phaseNumber: options.phase,
            domain: options.domain,
            confidence: options.confidence,
          };
        });

        outputSuccess(result, opts, formatWriteResearch);
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
