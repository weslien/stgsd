import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { execSync } from 'node:child_process';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { computeRepoId, databaseName, modulePath, loadConfig } from '../lib/config.js';
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

function wipeDatabase(gitRemoteUrl: string): void {
  const repoId = computeRepoId(gitRemoteUrl);
  const config = loadConfig(repoId);
  if (!config) {
    throw new CliError(
      ErrorCodes.NOT_CONFIGURED,
      'stclaude not configured for this repo. Run: stclaude setup',
    );
  }

  let spacetimeBin: string;
  try {
    spacetimeBin = execSync('which spacetime', {
      encoding: 'utf-8',
      shell: '/bin/zsh',
      timeout: 5000,
    }).trim();
  } catch {
    throw new CliError(
      ErrorCodes.INTERNAL_ERROR,
      'spacetime CLI not found. Install SpacetimeDB: https://spacetimedb.com/install',
    );
  }

  const dbName = databaseName(repoId);
  const publishCmd = `${spacetimeBin} publish ${dbName} --delete-data=always -y --module-path ${modulePath()} --server local --no-config`;
  try {
    execSync(publishCmd, { stdio: 'pipe', timeout: 60_000 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new CliError(
      ErrorCodes.INTERNAL_ERROR,
      `Failed to wipe and republish module: ${msg}`,
    );
  }
}

export function registerSeedCommand(program: Command): void {
  program
    .command('seed')
    .description('Bootstrap a new project in SpacetimeDB from current git repo')
    .option('--force', 'Delete existing project and re-seed', false)
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

        if (options.force) {
          // Wipe database before connecting — republish with --delete-data
          wipeDatabase(gitRemoteUrl);
        } else {
          // Check if project already exists (quick check via connection)
          const exists = await withConnection((conn: DbConnection) => {
            try {
              findProjectByGitRemote(conn, gitRemoteUrl);
              return true;
            } catch (err) {
              if (err instanceof CliError && err.code === ErrorCodes.PROJECT_NOT_FOUND) {
                return false;
              }
              throw err;
            }
          });

          if (exists) {
            throw new CliError(
              ErrorCodes.INVALID_ARGUMENT,
              'Project already exists for this git remote. Use --force to delete and re-seed.',
            );
          }
        }

        // Seed into clean database
        const result = await withConnection(async (conn: DbConnection) => {
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

          await insertPromise;

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
