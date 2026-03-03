import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface RoadmapAnalyzeData {
  project: {
    name: string;
    coreValue: string;
  };
  phases: Array<{
    number: string;
    name: string;
    status: string;
    goal: string;
    dependsOn: string;
    plans: {
      total: number;
      completed: number;
    };
    requirements: {
      total: number;
      completed: number;
    };
  }>;
}

function isCompletionStatus(status: string): boolean {
  const lower = status.toLowerCase();
  return lower.startsWith('complete') || lower === 'done';
}

function formatRoadmapAnalyze(data: unknown): string {
  const { project, phases } = data as RoadmapAnalyzeData;

  const lines = [
    `Roadmap: ${project.name}`,
    project.coreValue,
    '',
    'Phases:',
  ];

  let completedPhases = 0;
  for (const phase of phases) {
    if (isCompletionStatus(phase.status)) {
      completedPhases++;
    }
    lines.push(`  ${phase.number}. ${phase.name}`);
    lines.push(`     Status: ${phase.status}`);
    lines.push(
      `     Plans: ${phase.plans.completed}/${phase.plans.total} complete`,
    );
    lines.push(
      `     Requirements: ${phase.requirements.completed}/${phase.requirements.total} complete`,
    );
  }

  lines.push('');
  lines.push(
    `Overall: ${completedPhases}/${phases.length} phases complete`,
  );

  return lines.join('\n');
}

export function registerRoadmapCommand(program: Command): void {
  const roadmapCmd = program
    .command('roadmap')
    .description('Roadmap operations');

  roadmapCmd
    .command('analyze')
    .description('Analyze roadmap status')
    .action(async () => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const analyzeData = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          // Collect all phases for this project
          const projectPhases: Array<{
            id: bigint;
            number: string;
            name: string;
            status: string;
            goal: string;
            dependsOn: string;
          }> = [];
          for (const row of conn.db.phase.iter()) {
            if (row.projectId === project.id) {
              projectPhases.push({
                id: row.id,
                number: row.number,
                name: row.name,
                status: row.status,
                goal: row.goal,
                dependsOn: row.dependsOn,
              });
            }
          }

          // Sort phases by number (numeric ordering, handles decimals)
          projectPhases.sort(
            (a, b) => parseFloat(a.number) - parseFloat(b.number),
          );

          // Build map of phaseId -> plans
          const plansByPhase = new Map<
            bigint,
            Array<{ planNumber: bigint; status: string }>
          >();
          for (const row of conn.db.plan.iter()) {
            const existing = plansByPhase.get(row.phaseId);
            const entry = {
              planNumber: row.planNumber,
              status: row.status,
            };
            if (existing) {
              existing.push(entry);
            } else {
              plansByPhase.set(row.phaseId, [entry]);
            }
          }

          // Build map of phaseNumber -> requirements
          const reqsByPhaseNumber = new Map<
            string,
            Array<{ number: string; status: string }>
          >();
          for (const row of conn.db.requirement.iter()) {
            if (row.projectId === project.id) {
              const existing = reqsByPhaseNumber.get(row.phaseNumber);
              const entry = { number: row.number, status: row.status };
              if (existing) {
                existing.push(entry);
              } else {
                reqsByPhaseNumber.set(row.phaseNumber, [entry]);
              }
            }
          }

          // Build result with computed counts
          const phasesResult: RoadmapAnalyzeData['phases'] = projectPhases.map(
            (phase) => {
              const plans = plansByPhase.get(phase.id) || [];
              const reqs = reqsByPhaseNumber.get(phase.number) || [];

              return {
                number: phase.number,
                name: phase.name,
                status: phase.status,
                goal: phase.goal,
                dependsOn: phase.dependsOn,
                plans: {
                  total: plans.length,
                  completed: plans.filter((p) => isCompletionStatus(p.status))
                    .length,
                },
                requirements: {
                  total: reqs.length,
                  completed: reqs.filter((r) => isCompletionStatus(r.status))
                    .length,
                },
              };
            },
          );

          return {
            project: {
              name: project.name,
              coreValue: project.coreValue,
            },
            phases: phasesResult,
          };
        });

        outputSuccess(analyzeData, opts, formatRoadmapAnalyze);
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
