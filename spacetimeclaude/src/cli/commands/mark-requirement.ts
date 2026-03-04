import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface MarkRequirementData {
  marked: string[];
  notFound: string[];
  alreadyComplete: string[];
}

function formatMarkRequirement(data: unknown): string {
  const { marked, notFound, alreadyComplete } =
    data as MarkRequirementData;
  const lines = [
    'Requirements marked complete:',
    `  Marked: ${marked.length > 0 ? marked.join(', ') : 'none'}`,
    `  Not found: ${notFound.length > 0 ? notFound.join(', ') : 'none'}`,
    `  Already complete: ${alreadyComplete.length > 0 ? alreadyComplete.join(', ') : 'none'}`,
  ];
  return lines.join('\n');
}

export function registerMarkRequirementCommand(program: Command): void {
  program
    .command('mark-requirement')
    .description('Mark one or more requirements as complete')
    .argument(
      '<ids...>',
      'Requirement IDs to mark complete (e.g., CLI-01 CLI-02)',
    )
    .action(async (ids: string[]) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Collect all requirements for this project
          const allReqs: Array<{
            id: bigint;
            category: string;
            number: string;
            description: string;
            status: string;
            phaseNumber: string;
            milestoneVersion: string | null;
          }> = [];
          for (const row of conn.db.requirement.iter()) {
            if (row.projectId === project.id) {
              allReqs.push({
                id: row.id,
                category: row.category,
                number: row.number,
                description: row.description,
                status: row.status,
                phaseNumber: row.phaseNumber,
                milestoneVersion: row.milestoneVersion ?? null,
              });
            }
          }

          const marked: string[] = [];
          const notFound: string[] = [];
          const alreadyComplete: string[] = [];

          for (const reqId of ids) {
            const req = allReqs.find((r) => r.number === reqId);
            if (!req) {
              notFound.push(reqId);
              continue;
            }

            if (
              req.status.toLowerCase() === 'complete' ||
              req.status.toLowerCase() === 'completed'
            ) {
              alreadyComplete.push(reqId);
              continue;
            }

            conn.reducers.updateRequirement({
              requirementId: req.id,
              category: req.category,
              number: req.number,
              description: req.description,
              status: 'Complete',
              phaseNumber: req.phaseNumber,
              milestoneVersion: req.milestoneVersion ?? '',
            });

            marked.push(reqId);
          }

          // Wait briefly for updates to propagate
          if (marked.length > 0) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          return { marked, notFound, alreadyComplete };
        });

        outputSuccess(result, opts, formatMarkRequirement);
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
