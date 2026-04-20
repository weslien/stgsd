import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface MilestoneRow {
  id: string;
  version: string;
  name: string;
  shippedDate: string;
  phaseCount: string;
  planCount: string;
  requirementCount: string;
  accomplishments: string;
  status: string;
  auditStatus?: string;
  requirementScores?: string;
  integrationScores?: string;
  flowScores?: string;
  techDebtItems?: string;
  roadmapContent?: string;
  requirementsContent?: string;
  auditUpdatedAt?: string;
}

function formatGetMilestones(data: unknown): string {
  const milestones = data as MilestoneRow[];
  if (milestones.length === 0) {
    return 'No milestones found.';
  }
  return milestones.map(m => {
    const line = `${m.version} — ${m.name} (${m.shippedDate}) [${m.status}]`;
    return m.auditStatus ? `${line} audit: ${m.auditStatus}` : line;
  }).join('\n');
}

export function registerGetMilestonesCommand(program: Command): void {
  program
    .command('get-milestones')
    .description('Retrieve milestone history for the current project')
    .action(async (_options) => {
      const opts = program.opts<{ json: boolean }>();
      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const result = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Index audits by milestoneId, keeping the most recently updated one
          const latestAuditByMilestone = new Map<bigint, {
            auditStatus: string;
            requirementScores: string;
            integrationScores: string;
            flowScores: string;
            techDebtItems: string;
            roadmapContent: string;
            requirementsContent: string;
            updatedAt: bigint;
          }>();
          for (const audit of conn.db.milestoneAudit.iter()) {
            if (audit.projectId !== project.id) continue;
            const current = latestAuditByMilestone.get(audit.milestoneId);
            const updatedAt = audit.updatedAt.microsSinceUnixEpoch;
            if (!current || updatedAt > current.updatedAt) {
              latestAuditByMilestone.set(audit.milestoneId, {
                auditStatus: audit.auditStatus,
                requirementScores: audit.requirementScores,
                integrationScores: audit.integrationScores,
                flowScores: audit.flowScores,
                techDebtItems: audit.techDebtItems,
                roadmapContent: audit.roadmapContent,
                requirementsContent: audit.requirementsContent,
                updatedAt,
              });
            }
          }

          const milestones: MilestoneRow[] = [];
          for (const row of conn.db.milestone.iter()) {
            if (row.projectId !== project.id) continue;
            const audit = latestAuditByMilestone.get(row.id);
            milestones.push({
              id: row.id.toString(),
              version: row.version,
              name: row.name,
              shippedDate: row.shippedDate,
              phaseCount: row.phaseCount.toString(),
              planCount: row.planCount.toString(),
              requirementCount: row.requirementCount.toString(),
              accomplishments: row.accomplishments,
              status: row.status,
              ...(audit && {
                auditStatus: audit.auditStatus,
                requirementScores: audit.requirementScores,
                integrationScores: audit.integrationScores,
                flowScores: audit.flowScores,
                techDebtItems: audit.techDebtItems,
                roadmapContent: audit.roadmapContent,
                requirementsContent: audit.requirementsContent,
                auditUpdatedAt: new Date(Number(audit.updatedAt / 1000n)).toISOString(),
              }),
            });
          }

          // Sort by shipped_date descending (most recent first)
          milestones.sort((a, b) => b.shippedDate.localeCompare(a.shippedDate));

          return milestones;
        });

        outputSuccess(result, opts, formatGetMilestones);
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
