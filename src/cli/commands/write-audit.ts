import { readFileSync } from 'node:fs';
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
      reject(new CliError(ErrorCodes.INTERNAL_ERROR, 'Insert confirmation timed out after 5 seconds'));
    }, timeoutMs);
    table.onInsert((_ctx: any, row: any) => {
      if (matchFn(row)) { clearTimeout(timer); resolve(); }
    });
  });
}

function readContentOption(inline: string | undefined, filePath: string | undefined, fieldName: string): string {
  if (filePath) {
    try {
      return readFileSync(filePath, 'utf-8');
    } catch (err) {
      throw new CliError(ErrorCodes.INVALID_ARGUMENT, `Could not read ${fieldName} file: ${filePath} - ${err}`);
    }
  }
  return inline ?? '';
}

interface WriteAuditData {
  version: string;
  milestoneId: string;
  auditStatus: string;
}

function formatWriteAudit(data: unknown): string {
  const { version, milestoneId, auditStatus } = data as WriteAuditData;
  return [
    'Audit written:',
    `  Milestone: ${version} (id: ${milestoneId})`,
    `  Status: ${auditStatus}`,
  ].join('\n');
}

export function registerWriteAuditCommand(program: Command): void {
  program
    .command('write-audit')
    .description('Persist milestone audit report to SpacetimeDB')
    .requiredOption('--version <version>', 'Milestone version to audit (e.g. v1.0)')
    .requiredOption('--audit-status <status>', 'Audit status (passed|gaps_found|tech_debt)')
    .requiredOption('--requirement-scores <json>', 'Requirement scores JSON object')
    .requiredOption('--integration-scores <json>', 'Integration scores JSON object')
    .requiredOption('--flow-scores <json>', 'Flow scores JSON object')
    .requiredOption('--tech-debt-items <json>', 'Tech debt items JSON array')
    .option('--roadmap-content <text>', 'Roadmap archive content (inline)')
    .option('--roadmap-content-file <path>', 'Read roadmap content from file')
    .option('--requirements-content <text>', 'Requirements archive content (inline)')
    .option('--requirements-content-file <path>', 'Read requirements content from file')
    .action(async (options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const roadmapContent = readContentOption(options.roadmapContent, options.roadmapContentFile, 'roadmap-content');
        const requirementsContent = readContentOption(options.requirementsContent, options.requirementsContentFile, 'requirements-content');

        const gitRemoteUrl = getGitRemoteUrl();
        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Find milestone by version (must exist before audit can be created)
          let targetMilestoneId: bigint | undefined;
          for (const row of conn.db.milestone.iter()) {
            if (row.projectId === project.id && row.version === options.version) {
              targetMilestoneId = row.id;
              break;
            }
          }
          if (targetMilestoneId === undefined) {
            throw new CliError(
              ErrorCodes.MILESTONE_NOT_FOUND,
              `Milestone ${options.version} not found. Run write-milestone first.`,
            );
          }

          // Register onInsert BEFORE calling reducer
          const insertPromise = waitForInsert(
            conn,
            conn.db.milestoneAudit,
            (row) => row.milestoneId === targetMilestoneId,
          );

          conn.reducers.insertMilestoneAudit({
            projectId: project.id,
            milestoneId: targetMilestoneId,
            auditStatus: options.auditStatus,
            requirementScores: options.requirementScores,
            integrationScores: options.integrationScores,
            flowScores: options.flowScores,
            techDebtItems: options.techDebtItems,
            roadmapContent,
            requirementsContent,
          });

          await insertPromise;

          return {
            version: options.version,
            milestoneId: targetMilestoneId.toString(),
            auditStatus: options.auditStatus,
          };
        });

        outputSuccess(result, opts, formatWriteAudit);
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
