import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import {
  findProjectByGitRemote,
  findPhaseByNumber,
} from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface GetPhaseData {
  phase: {
    id: bigint;
    number: string;
    name: string;
    slug: string;
    goal: string;
    status: string;
    dependsOn: string;
    successCriteria: string;
  };
  plans: Array<{
    id: bigint;
    planNumber: bigint;
    type: string;
    wave: bigint;
    objective: string;
    status: string;
    requirements: string;
    dependsOn: string;
    autonomous: boolean;
  }>;
  requirements: Array<{
    id: bigint;
    number: string;
    description: string;
    status: string;
    category: string;
  }>;
}

function formatGetPhase(data: unknown): string {
  const { phase, plans, requirements } = data as GetPhaseData;

  const lines = [
    `Phase ${phase.number}: ${phase.name}`,
    `Goal: ${phase.goal}`,
    `Status: ${phase.status}`,
    `Depends on: ${phase.dependsOn || 'Nothing'}`,
    '',
    'Success Criteria:',
    phase.successCriteria,
    '',
    `Plans (${plans.length}):`,
  ];

  for (const plan of plans) {
    lines.push(`  ${plan.planNumber}. ${plan.objective} [${plan.status}]`);
  }

  lines.push('');
  lines.push(`Requirements (${requirements.length}):`);

  for (const req of requirements) {
    lines.push(`  ${req.number}: ${req.description} [${req.status}]`);
  }

  return lines.join('\n');
}

export function registerGetPhaseCommand(program: Command): void {
  program
    .command('get-phase <number>')
    .description('Get full phase details with linked plans and requirements')
    .action(async (phaseNumber: string) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const phaseData = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, phaseNumber);

          // Collect all plans for this phase
          const phasePlans: GetPhaseData['plans'] = [];
          for (const row of conn.db.plan.iter()) {
            if (row.phaseId === phase.id) {
              phasePlans.push({
                id: row.id,
                planNumber: row.planNumber,
                type: row.type,
                wave: row.wave,
                objective: row.objective,
                status: row.status,
                requirements: row.requirements,
                dependsOn: row.dependsOn,
                autonomous: row.autonomous,
              });
            }
          }

          // Collect requirements linked to this phase
          const phaseRequirements: GetPhaseData['requirements'] = [];
          for (const row of conn.db.requirement.iter()) {
            if (
              row.projectId === project.id &&
              row.phaseNumber === phase.number
            ) {
              phaseRequirements.push({
                id: row.id,
                number: row.number,
                description: row.description,
                status: row.status,
                category: row.category,
              });
            }
          }

          return {
            phase: {
              id: phase.id,
              number: phase.number,
              name: phase.name,
              slug: phase.slug,
              goal: phase.goal,
              status: phase.status,
              dependsOn: phase.dependsOn,
              successCriteria: phase.successCriteria,
            },
            plans: phasePlans,
            requirements: phaseRequirements,
          };
        });

        outputSuccess(phaseData, opts, formatGetPhase);
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
