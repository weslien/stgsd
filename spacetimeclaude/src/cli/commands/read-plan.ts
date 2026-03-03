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

interface ReadPlanData {
  phase: {
    number: string;
    name: string;
  };
  plan: {
    id: bigint;
    planNumber: bigint;
    type: string;
    wave: bigint;
    dependsOn: string;
    objective: string;
    autonomous: boolean;
    requirements: string;
    status: string;
    content: string;
  };
  tasks: Array<{
    id: bigint;
    taskNumber: bigint;
    type: string;
    description: string;
    status: string;
    commitHash: string | undefined;
  }>;
  mustHaves: Array<{
    id: bigint;
    truths: string;
    artifacts: string;
    keyLinks: string;
  }>;
}

function formatReadPlan(data: unknown): string {
  const { phase, plan, tasks, mustHaves } = data as ReadPlanData;

  const lines = [
    `Phase ${phase.number}: ${phase.name}`,
    `Plan ${plan.planNumber}: ${plan.objective}`,
    `Type: ${plan.type} | Wave: ${plan.wave} | Status: ${plan.status}`,
    `Autonomous: ${plan.autonomous}`,
    `Requirements: ${plan.requirements}`,
    `Depends on: ${plan.dependsOn || 'Nothing'}`,
    '',
    'Content:',
    plan.content ? plan.content : '(empty)',
    '',
    `Tasks (${tasks.length}):`,
  ];

  for (const task of tasks) {
    lines.push(`  ${task.taskNumber}. [${task.status}] ${task.description}`);
  }

  if (mustHaves.length > 0) {
    lines.push('');
    lines.push('Must-Haves:');
    for (const mh of mustHaves) {
      lines.push(`  Truths: ${mh.truths}`);
      lines.push(`  Artifacts: ${mh.artifacts}`);
      lines.push(`  Key Links: ${mh.keyLinks}`);
    }
  }

  return lines.join('\n');
}

export function registerReadPlanCommand(program: Command): void {
  program
    .command('read-plan <phase> <plan>')
    .description('Read plan content and metadata')
    .action(async (phaseArg: string, planArg: string) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const planData = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, phaseArg);

          // Parse plan number to BigInt
          let planNumberBigInt: bigint;
          try {
            planNumberBigInt = BigInt(planArg);
            if (planNumberBigInt <= 0n) {
              throw new Error('not positive');
            }
          } catch {
            throw new CliError(
              ErrorCodes.INVALID_ARGUMENT,
              'Plan number must be a positive integer',
            );
          }

          // Find the plan by phase ID and plan number
          let foundPlan = null;
          for (const row of conn.db.plan.iter()) {
            if (
              row.phaseId === phase.id &&
              row.planNumber === planNumberBigInt
            ) {
              foundPlan = row;
              break;
            }
          }

          if (!foundPlan) {
            throw new CliError(
              ErrorCodes.PLAN_NOT_FOUND,
              `No plan found with number ${planArg} in phase ${phaseArg}`,
            );
          }

          // Collect tasks for this plan
          const planTasks: ReadPlanData['tasks'] = [];
          for (const row of conn.db.planTask.iter()) {
            if (row.planId === foundPlan.id) {
              planTasks.push({
                id: row.id,
                taskNumber: row.taskNumber,
                type: row.type,
                description: row.description,
                status: row.status,
                commitHash: row.commitHash,
              });
            }
          }

          // Collect must-haves for this plan
          const planMustHaves: ReadPlanData['mustHaves'] = [];
          for (const row of conn.db.mustHave.iter()) {
            if (row.planId === foundPlan.id) {
              planMustHaves.push({
                id: row.id,
                truths: row.truths,
                artifacts: row.artifacts,
                keyLinks: row.keyLinks,
              });
            }
          }

          return {
            phase: {
              number: phase.number,
              name: phase.name,
            },
            plan: {
              id: foundPlan.id,
              planNumber: foundPlan.planNumber,
              type: foundPlan.type,
              wave: foundPlan.wave,
              dependsOn: foundPlan.dependsOn,
              objective: foundPlan.objective,
              autonomous: foundPlan.autonomous,
              requirements: foundPlan.requirements,
              status: foundPlan.status,
              content: foundPlan.content,
            },
            tasks: planTasks,
            mustHaves: planMustHaves,
          };
        });

        outputSuccess(planData, opts, formatReadPlan);
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
