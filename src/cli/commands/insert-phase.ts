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

interface InsertPhaseData {
  phaseNumber: string;
  afterPhase: string;
  name: string;
  slug: string;
  goal: string;
}

function formatInsertPhase(data: unknown): string {
  const { phaseNumber, afterPhase, name, slug, goal } = data as InsertPhaseData;
  return [
    `Phase ${phaseNumber} inserted after phase ${afterPhase}:`,
    `  Name: ${name} (INSERTED)`,
    `  Slug: ${slug}`,
    `  Goal: ${goal}`,
    `  Status: pending`,
  ].join('\n');
}

export function registerInsertPhaseCommand(program: Command): void {
  program
    .command('insert-phase')
    .description('Insert a decimal phase (e.g. 07.1) after a given phase in SpacetimeDB')
    .requiredOption('--after <phase>', 'Integer phase number to insert after (e.g. 07)')
    .requiredOption('--name <name>', 'Phase name')
    .requiredOption('--goal <goal>', 'Phase goal statement')
    .option('--depends-on <phase>', 'Phase number this phase depends on', '')
    .option('--success-criteria <text>', 'Success criteria for this phase', '')
    .option('--slug <slug>', 'Override slug (default: derived from name)')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const afterPhase = options.after as string;

        // Validate that --after is an integer
        if (!/^\d+$/.test(afterPhase)) {
          throw new CliError(ErrorCodes.INVALID_ARGUMENT, `--after must be an integer phase number (got: ${afterPhase})`);
        }

        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Verify the target phase exists
          findPhaseByNumber(conn, project.id, afterPhase);

          // Find highest existing decimal for this parent phase
          let maxDecimal = 0;
          const prefix = `${afterPhase}.`;
          for (const row of conn.db.phase.phase_project_id.filter(project.id)) {
            if (row.number.startsWith(prefix)) {
              const decimalPart = parseInt(row.number.slice(prefix.length), 10);
              if (!isNaN(decimalPart) && decimalPart > maxDecimal) {
                maxDecimal = decimalPart;
              }
            }
          }
          const phaseNumber = `${afterPhase}.${maxDecimal + 1}`;
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
            dependsOn: options.dependsOn ?? afterPhase,
            successCriteria: options.successCriteria ?? '',
            isInserted: true,
          });

          await insertPromise;

          return { phaseNumber, afterPhase, name: options.name, slug, goal: options.goal };
        });

        outputSuccess(result, opts, formatInsertPhase);
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
