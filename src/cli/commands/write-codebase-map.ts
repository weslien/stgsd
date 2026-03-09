import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { readFileSync } from 'node:fs';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

const VALID_DOC_TYPES = ['stack', 'integrations', 'architecture', 'structure', 'conventions', 'testing', 'concerns'] as const;
type DocType = typeof VALID_DOC_TYPES[number];

function waitForUpsert(
  conn: DbConnection,
  projectId: bigint,
  docType: string,
  timeoutMs = 5000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Codebase map upsert timed out after 5 seconds'));
    }, timeoutMs);

    const done = () => { clearTimeout(timer); resolve(); };

    // Listen for BOTH insert (first time) AND update (refresh) — upsertCodebaseMap may trigger either
    conn.db.codebases.onInsert((_ctx: any, row: any) => {
      if (row.projectId === projectId && row.docType === docType) done();
    });
    conn.db.codebases.onUpdate((_ctx: any, _oldRow: any, newRow: any) => {
      if (newRow.projectId === projectId && newRow.docType === docType) done();
    });
  });
}

interface WriteCodebaseMapData {
  docType: string;
  action: 'created' | 'updated';
}

function formatWriteCodebaseMap(data: unknown): string {
  const { docType, action } = data as WriteCodebaseMapData;
  return `Codebase map ${action}:\n  Type: ${docType}`;
}

export function registerWriteCodebaseMapCommand(program: Command): void {
  program
    .command('write-codebase-map')
    .description('Persist a codebase mapping document to SpacetimeDB (creates or updates)')
    .requiredOption('--type <docType>', `Document type: ${VALID_DOC_TYPES.join('|')}`)
    .option('--file <path>', 'Path to markdown file to read content from')
    .option('--content <text>', 'Document content as inline string')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const docType = options.type as string;
        if (!VALID_DOC_TYPES.includes(docType as DocType)) {
          throw new CliError(
            ErrorCodes.INVALID_ARGUMENT,
            `Invalid doc type "${docType}". Valid types: ${VALID_DOC_TYPES.join(', ')}`,
          );
        }

        let content: string;
        if (options.file) {
          content = readFileSync(options.file as string, 'utf-8');
        } else if (options.content) {
          content = options.content as string;
        } else {
          throw new CliError(ErrorCodes.INVALID_ARGUMENT, 'Either --file or --content is required');
        }

        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Check if this docType already exists for the project (to report action)
          const existing = [...conn.db.codebases.codebase_map_project_id.filter(project.id)]
            .find(row => row.docType === docType);

          // Register listener BEFORE calling reducer
          const upsertPromise = waitForUpsert(conn, project.id, docType);

          conn.reducers.upsertCodebaseMap({
            projectId: project.id,
            docType,
            content,
          });

          await upsertPromise;

          return {
            docType,
            action: existing ? 'updated' : 'created',
          } as WriteCodebaseMapData;
        });

        outputSuccess(result, opts, formatWriteCodebaseMap);
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
