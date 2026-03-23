import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface CodebaseMapItem {
  docType: string;
  content: string;
  updatedAt: string;
}

function formatGetCodebaseMap(data: unknown): string {
  const items = data as CodebaseMapItem[];
  if (items.length === 0) return 'No codebase maps found. Run: stgsd write-codebase-map --type <type> --file <path>';
  return items.map(item =>
    `## ${item.docType}\n**Updated:** ${item.updatedAt}\n\n${item.content}`
  ).join('\n\n---\n\n');
}

export function registerGetCodebaseMapCommand(program: Command): void {
  program
    .command('get-codebase-map')
    .description('Retrieve codebase mapping documents from SpacetimeDB')
    .option('--type <docType>', 'Filter by document type (stack|integrations|architecture|structure|conventions|testing|concerns)')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // ALWAYS filter by project first — never use docType index alone (cross-project leak)
          let rows = [...conn.db.codebases.codebase_map_project_id.filter(project.id)];

          if (options.type) {
            rows = rows.filter(row => row.docType === options.type);
            if (rows.length === 0) {
              throw new CliError(
                ErrorCodes.NOT_FOUND,
                `No codebase map found for type "${options.type}". Run: stgsd write-codebase-map --type ${options.type} --file <path>`,
              );
            }
          }

          // Sort alphabetically by docType for stable output
          rows.sort((a, b) => a.docType.localeCompare(b.docType));

          return rows.map(row => ({
            docType: row.docType,
            content: row.content,
            updatedAt: new Date(Number(row.updatedAt.microsSinceUnixEpoch / 1000n)).toISOString(),
          } as CodebaseMapItem));
        });

        outputSuccess(result, opts, formatGetCodebaseMap);
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
