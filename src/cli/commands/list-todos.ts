import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

function relativeAge(microsSinceEpoch: bigint): string {
  const diffMs = Date.now() - Number(microsSinceEpoch / 1000n);
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

interface TodoItem {
  id: string;
  title: string;
  area: string;
  status: string;
  problem: string;
  solutionHints: string;
  fileRefs: string;
  age: string;
  createdAt: string;
}

function formatListTodos(data: unknown): string {
  const todos = data as TodoItem[];
  if (todos.length === 0) return 'No todos found.';
  return todos.map(t =>
    `${t.id.padStart(4)}  ${t.title.substring(0, 40).padEnd(40)} [${t.area.padEnd(8)}]  ${t.age}`
  ).join('\n');
}

export function registerListTodosCommand(program: Command): void {
  program
    .command('list-todos')
    .description('List todo items from SpacetimeDB (pending by default)')
    .option('--area <area>', 'Filter by area (api|ui|auth|database|testing|docs|planning|tooling|general)')
    .option('--all', 'Include completed todos', false)
    .option('--verbose', 'Show full details including problem and solution hints', false)
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          const rows = [...conn.db.todo.todo_project_id.filter(project.id)]
            .filter(row => options.all ? true : row.status === 'pending')
            .filter(row => options.area ? row.area === options.area : true)
            .sort((a, b) => Number(b.createdAt.microsSinceUnixEpoch - a.createdAt.microsSinceUnixEpoch));

          return rows.map(row => ({
            id: row.id.toString(),
            title: row.title,
            area: row.area,
            status: row.status,
            problem: row.problem,
            solutionHints: row.solutionHints,
            fileRefs: row.fileRefs,
            age: relativeAge(row.createdAt.microsSinceUnixEpoch),
            createdAt: new Date(Number(row.createdAt.microsSinceUnixEpoch / 1000n)).toISOString(),
          } as TodoItem));
        });

        outputSuccess(result, opts, formatListTodos);
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
