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

interface WriteContextData {
  phaseNumber: string;
}

function formatWriteContext(data: unknown): string {
  const { phaseNumber } = data as WriteContextData;
  const lines = ['Context written:', `  Phase: ${phaseNumber}`];
  return lines.join('\n');
}

export function registerWriteContextCommand(program: Command): void {
  program
    .command('write-context')
    .description('Persist phase context to SpacetimeDB')
    .requiredOption('--phase <phase>', 'Phase number')
    .option('--content <text>', 'Context content (markdown)')
    .option(
      '--content-file <path>',
      'Read context content from file instead of --content',
    )
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        // Resolve content from --content or --content-file
        let contextContent = options.content ?? '';
        if (options.contentFile) {
          try {
            contextContent = readFileSync(options.contentFile, 'utf-8');
          } catch (err) {
            throw new CliError(
              ErrorCodes.INVALID_ARGUMENT,
              `Could not read content file: ${options.contentFile} - ${err}`,
            );
          }
        }

        if (!contextContent) {
          throw new CliError(
            ErrorCodes.INVALID_ARGUMENT,
            'Either --content or --content-file is required',
          );
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
            conn.db.phaseContext,
            (row) => row.phaseId === phase.id,
          );

          conn.reducers.insertPhaseContext({
            phaseId: phase.id,
            content: contextContent,
          });

          await insertPromise;

          return {
            phaseNumber: options.phase,
          };
        });

        outputSuccess(result, opts, formatWriteContext);
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
