import type { Command } from 'commander';
import { execSync } from 'node:child_process';
import { getGitRemoteUrl } from '../lib/git.js';
import {
  computeRepoId,
  databaseName,
  loadConfig,
  writeConfig,
  modulePath,
  moduleExists,
} from '../lib/config.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface SetupResult {
  repoId: string;
  database: string;
  uri: string;
  gitRemoteUrl: string;
}

function formatSetup(data: unknown): string {
  const { repoId, database, uri, gitRemoteUrl } = data as SetupResult;
  return [
    'stclaude configured for this repo:',
    `  Repo ID:    ${repoId}`,
    `  Database:   ${database}`,
    `  Server:     ${uri}`,
    `  Git Remote: ${gitRemoteUrl}`,
    '',
    'Next: run `stclaude seed --name <name> --description <desc> --core-value <value>` to bootstrap your project.',
  ].join('\n');
}

export function registerSetupCommand(program: Command): void {
  program
    .command('setup')
    .description('Provision a local SpacetimeDB database for the current repo')
    .option('--force', 'Re-publish module even if already configured', false)
    .option('--uri <uri>', 'SpacetimeDB server URI', 'http://127.0.0.1:3000')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();
        const repoId = computeRepoId(gitRemoteUrl);
        const dbName = databaseName(repoId);

        // Check if already configured
        const existing = loadConfig(repoId);
        if (existing && !options.force) {
          outputSuccess(
            {
              repoId,
              database: existing.database,
              uri: existing.uri,
              gitRemoteUrl: existing.gitRemoteUrl,
            },
            opts,
            (data) => {
              const d = data as SetupResult;
              return [
                'Already configured:',
                `  Database: ${d.database}`,
                `  Server:   ${d.uri}`,
                '',
                'Use --force to re-publish the module.',
              ].join('\n');
            },
          );
          process.exit(0);
        }

        // Verify module source is installed
        if (!moduleExists()) {
          throw new CliError(
            ErrorCodes.NOT_CONFIGURED,
            `Module source not found at ${modulePath()}/src/index.ts. Run: cd <spacetimeclaude> && bun run install:cli`,
          );
        }

        // Resolve spacetime binary — execSync doesn't inherit full shell PATH
        let spacetimeBin: string;
        try {
          const whichCmd = process.platform === 'win32' ? 'where spacetime' : 'which spacetime';
          const shellOpt = process.platform === 'win32' ? undefined : '/bin/zsh';
          spacetimeBin = execSync(whichCmd, {
            encoding: 'utf-8',
            ...(shellOpt ? { shell: shellOpt } : {}),
            timeout: 5000,
          }).trim().split('\n')[0].trim();
        } catch {
          throw new CliError(
            ErrorCodes.INTERNAL_ERROR,
            'spacetime CLI not found. Install SpacetimeDB: https://spacetimedb.com/install',
          );
        }

        // Verify local SpacetimeDB is running
        try {
          execSync(`${spacetimeBin} server ping local`, {
            stdio: 'pipe',
            timeout: 5000,
          });
        } catch {
          throw new CliError(
            ErrorCodes.INTERNAL_ERROR,
            'Local SpacetimeDB not running. Start it with: spacetime start',
          );
        }

        // Publish module (--no-config avoids picking up spacetime.json from cwd)
        const publishCmd = `${spacetimeBin} publish ${dbName} --module-path ${modulePath()} --server local --no-config`;
        try {
          execSync(publishCmd, { stdio: 'pipe', timeout: 60_000 });
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : String(err);
          throw new CliError(
            ErrorCodes.INTERNAL_ERROR,
            `Failed to publish module: ${msg}`,
          );
        }

        // Write config
        const config = {
          uri: options.uri,
          database: dbName,
          gitRemoteUrl,
          createdAt: new Date().toISOString(),
        };
        writeConfig(config);

        outputSuccess({ repoId, ...config }, opts, formatSetup);
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
