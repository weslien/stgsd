import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

function waitForUpdate(
  conn: DbConnection,
  todoId: bigint,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Todo update timed out after 5 seconds'));
    }, timeoutMs);
    conn.db.todo.onUpdate((_ctx: any, _oldRow: any, newRow: any) => {
      if (newRow.id === todoId) { clearTimeout(timer); resolve(); }
    });
  });
}

interface CompleteTodoData {
  id: string;
  title: string;
}

function formatCompleteTodo(data: unknown): string {
  const { id, title } = data as CompleteTodoData;
  return `Todo completed:\n  ID: ${id}\n  Title: ${title}`;
}

export function registerCompleteTodoCommand(program: Command): void {
  program
    .command('complete-todo')
    .description('Mark a todo as done in SpacetimeDB')
    .argument('<id>', 'Todo ID to mark as done')
    .action(async (id, _options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        // Validate id is numeric before BigInt conversion
        if (!/^\d+$/.test(id)) {
          throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Invalid todo ID "${id}": must be a numeric value`);
        }
        const todoId = BigInt(id);

        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Find existing row — MUST spread all fields in updateTodo
          const existing = conn.db.todo.id.find(todoId);
          if (!existing) {
            throw new CliError(ErrorCodes.TODO_NOT_FOUND, `Todo ${id} not found`);
          }
          if (existing.projectId !== project.id) {
            throw new CliError(ErrorCodes.TODO_NOT_FOUND, `Todo ${id} not found in this project`);
          }

          // Register onUpdate BEFORE calling reducer
          const updatePromise = waitForUpdate(conn, todoId);

          // updateTodo requires ALL fields — spread existing row, override only status
          conn.reducers.updateTodo({
            todoId: existing.id,
            title: existing.title,
            area: existing.area,
            problem: existing.problem,
            solutionHints: existing.solutionHints,
            fileRefs: existing.fileRefs,
            status: 'done',
          });

          await updatePromise;

          return { id, title: existing.title } as CompleteTodoData;
        });

        outputSuccess(result, opts, formatCompleteTodo);
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
