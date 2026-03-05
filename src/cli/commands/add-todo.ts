import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

const VALID_AREAS = ['api', 'ui', 'auth', 'database', 'testing', 'docs', 'planning', 'tooling', 'general'] as const;

function waitForInsert(
  conn: DbConnection,
  matchFn: (row: any) => boolean,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Todo insert timed out after 5 seconds'));
    }, timeoutMs);
    conn.db.todo.onInsert((_ctx: any, row: any) => {
      if (matchFn(row)) { clearTimeout(timer); resolve(); }
    });
  });
}

interface AddTodoData {
  id: string;
  title: string;
  area: string;
}

function formatAddTodo(data: unknown): string {
  const { id, title, area } = data as AddTodoData;
  return `Todo added:\n  ID: ${id}\n  Title: ${title}\n  Area: [${area}]`;
}

export function registerAddTodoCommand(program: Command): void {
  program
    .command('add-todo')
    .description('Add a new todo item to SpacetimeDB')
    .argument('<title>', 'Todo title (3-10 word action phrase)')
    .option('--area <area>', 'Area: api|ui|auth|database|testing|docs|planning|tooling|general', 'general')
    .option('--problem <text>', 'Problem description', '')
    .option('--solution-hints <text>', 'Solution hints', '')
    .option('--file-refs <refs>', 'File references (comma-separated paths)', '')
    .action(async (title, options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const area = options.area as string;
        if (!VALID_AREAS.includes(area as any)) {
          throw new CliError(
            ErrorCodes.INVALID_ARGUMENT,
            `Invalid area "${area}". Valid areas: ${VALID_AREAS.join(', ')}`,
          );
        }

        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Register onInsert BEFORE calling reducer
          let insertedId: bigint | undefined;
          const insertPromise = waitForInsert(conn, (row) => {
            if (row.projectId === project.id && row.title === title) {
              insertedId = row.id;
              return true;
            }
            return false;
          });

          conn.reducers.insertTodo({
            projectId: project.id,
            title,
            area,
            problem: options.problem as string,
            solutionHints: options.solutionHints as string,
            fileRefs: options.fileRefs as string,
            status: 'pending',
          });

          await insertPromise;

          return { id: (insertedId ?? 0n).toString(), title, area } as AddTodoData;
        });

        outputSuccess(result, opts, formatAddTodo);
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
