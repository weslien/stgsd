import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface SeedData {
  project: { id: bigint; name: string; gitRemoteUrl: string };
}

function formatSeed(data: unknown): string {
  const { project } = data as SeedData;
  const lines = [
    'Project seeded:',
    `  Name: ${project.name}`,
    `  Git Remote: ${project.gitRemoteUrl}`,
    `  ID: ${project.id}`,
  ];
  return lines.join('\n');
}

export function registerSeedCommand(program: Command): void {
  program
    .command('seed')
    .description('Bootstrap a new project in SpacetimeDB from current git repo')
    .requiredOption('--name <name>', 'Project name')
    .requiredOption('--description <text>', 'Project description')
    .requiredOption('--core-value <text>', 'Core value statement')
    .option('--constraints <text>', 'Project constraints', '')
    .option('--context <text>', 'Project context', '')
    .option('--key-decisions <text>', 'Key decisions', '')
    .option('--phases-json <json>', 'Phases as JSON array string', '[]')
    .option('--requirements-json <json>', 'Requirements as JSON array string', '[]')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        // Validate JSON inputs before connecting
        try {
          JSON.parse(options.phasesJson);
        } catch {
          throw new CliError(
            ErrorCodes.INVALID_ARGUMENT,
            `Invalid JSON for --phases-json: ${options.phasesJson}`,
          );
        }
        try {
          JSON.parse(options.requirementsJson);
        } catch {
          throw new CliError(
            ErrorCodes.INVALID_ARGUMENT,
            `Invalid JSON for --requirements-json: ${options.requirementsJson}`,
          );
        }

        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          // Check if project already exists
          try {
            findProjectByGitRemote(conn, gitRemoteUrl);
            // If we get here, the project exists -- error
            throw new CliError(
              ErrorCodes.INVALID_ARGUMENT,
              'Project already exists for this git remote. Use update commands instead.',
            );
          } catch (err) {
            if (err instanceof CliError && err.code === ErrorCodes.PROJECT_NOT_FOUND) {
              // Good -- project doesn't exist yet, proceed
            } else {
              throw err;
            }
          }

          // Set up onInsert listener for confirmation
          const insertPromise = new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => {
              reject(
                new CliError(
                  ErrorCodes.INTERNAL_ERROR,
                  'Seed confirmation timed out after 10 seconds',
                ),
              );
            }, 10_000);
            conn.db.project.onInsert((_ctx, row) => {
              if (row.gitRemoteUrl === gitRemoteUrl) {
                clearTimeout(timer);
                resolve();
              }
            });
          });

          // Call the seed_project reducer
          conn.reducers.seedProject({
            gitRemoteUrl,
            name: options.name,
            description: options.description,
            coreValue: options.coreValue,
            constraints: options.constraints,
            context: options.context,
            keyDecisions: options.keyDecisions,
            phasesJson: options.phasesJson,
            requirementsJson: options.requirementsJson,
          });

          // Wait for confirmation
          await insertPromise;

          // Read back the created project
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          return {
            project: {
              id: project.id,
              name: project.name,
              gitRemoteUrl: project.gitRemoteUrl,
            },
          };
        });

        outputSuccess(result, opts, formatSeed);
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
