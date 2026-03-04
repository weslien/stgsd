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
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Phase insert timed out after 5 seconds'));
    }, timeoutMs);
    table.onInsert((_ctx: any, row: any) => {
      if (matchFn(row)) { clearTimeout(timer); resolve(); }
    });
  });
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function padPhaseNumber(n: number): string {
  return n.toString().padStart(2, '0');
}

interface AddPhaseData {
  phaseNumber: string;
  name: string;
  slug: string;
  goal: string;
}

function formatAddPhase(data: unknown): string {
  const { phaseNumber, name, slug, goal } = data as AddPhaseData;
  return [
    `Phase ${phaseNumber} added:`,
    `  Name: ${name}`,
    `  Slug: ${slug}`,
    `  Goal: ${goal}`,
    `  Status: pending`,
  ].join('\n');
}

export function registerAddPhaseCommand(program: Command): void {
  program
    .command('add-phase')
    .description('Add a new phase to the project in SpacetimeDB')
    .requiredOption('--name <name>', 'Phase name')
    .requiredOption('--goal <goal>', 'Phase goal statement')
    .option('--number <n>', 'Override phase number (default: auto-increment from last phase)')
    .option('--depends-on <phase>', 'Phase number this phase depends on', '')
    .option('--success-criteria <text>', 'Success criteria for this phase', '')
    .option('--slug <slug>', 'Override slug (default: derived from name)')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Auto-number: find highest integer phase number and add 1
          let phaseNumber: string;
          if (options.number) {
            phaseNumber = options.number;
          } else {
            let maxInt = 0;
            for (const row of conn.db.phase.phase_project_id.filter(project.id)) {
              const parsed = parseInt(row.number, 10);
              if (!isNaN(parsed) && parsed > maxInt) {
                maxInt = parsed;
              }
            }
            phaseNumber = padPhaseNumber(maxInt + 1);
          }

          const slug = options.slug ?? toSlug(options.name);

          // Register onInsert BEFORE calling reducer
          const insertPromise = waitForInsert(
            conn,
            conn.db.phase,
            (row) => row.projectId === project.id && row.number === phaseNumber,
          );

          conn.reducers.insertPhase({
            projectId: project.id,
            number: phaseNumber,
            name: options.name,
            slug,
            goal: options.goal,
            status: 'pending',
            dependsOn: options.dependsOn ?? '',
            successCriteria: options.successCriteria ?? '',
            isInserted: false,
          });

          await insertPromise;

          return { phaseNumber, name: options.name, slug, goal: options.goal };
        });

        outputSuccess(result, opts, formatAddPhase);
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
