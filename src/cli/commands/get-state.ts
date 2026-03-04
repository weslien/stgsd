import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findProjectState } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface GetStateData {
  project: {
    id: bigint;
    name: string;
    gitRemoteUrl: string;
    coreValue: string;
  };
  state: {
    currentPhase: string;
    currentPlan: bigint;
    currentTask: bigint;
    lastActivity: { microsSinceUnixEpoch: bigint };
    lastActivityDescription: string;
    velocityData: string;
    sessionLast: string;
    sessionStoppedAt: string;
    sessionResumeFile: string | undefined;
  } | null;
  phases: Array<{
    id: bigint;
    number: string;
    name: string;
    status: string;
    goal: string;
  }>;
  plans: Array<{
    id: bigint;
    phaseId: bigint;
    planNumber: bigint;
    status: string;
  }>;
}

function formatGetState(data: unknown): string {
  const { project, state, phases, plans } = data as GetStateData;

  if (!state) {
    return `Project: ${project.name}\nStatus: No state recorded yet`;
  }

  const currentPhase = phases.find((p) => p.number === state.currentPhase);
  const phaseName = currentPhase ? currentPhase.name : 'Unknown';
  const phaseStatus = currentPhase ? currentPhase.status : 'unknown';

  // Count plans in the current phase
  const currentPhaseId = currentPhase?.id;
  const plansInPhase = currentPhaseId
    ? plans.filter((p) => p.phaseId === currentPhaseId).length
    : 0;

  // Format lastActivity timestamp
  const lastActivityMs = Number(state.lastActivity.microsSinceUnixEpoch / 1000n);
  const lastActivityDate = new Date(lastActivityMs).toISOString().slice(0, 10);

  const lines = [
    `Project: ${project.name}`,
    `Core Value: ${project.coreValue}`,
    '',
    `Phase: ${state.currentPhase} - ${phaseName} (${phaseStatus})`,
    `Plan: ${state.currentPlan} of ${plansInPhase}`,
    `Task: ${state.currentTask}`,
    `Last activity: ${lastActivityDate} - ${state.lastActivityDescription}`,
    '',
    `Session: ${state.sessionLast}`,
    `Stopped at: ${state.sessionStoppedAt}`,
    '',
    `Phases:`,
  ];

  for (const phase of phases) {
    const planCount = plans.filter((p) => p.phaseId === phase.id).length;
    lines.push(`  ${phase.number}. ${phase.name} (${phase.status}) - ${planCount} plans`);
  }

  return lines.join('\n');
}

export function registerGetStateCommand(program: Command): void {
  program
    .command('get-state')
    .description('Get full project state with velocity and session data')
    .action(async () => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const stateData = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const state = findProjectState(conn, project.id);

          // Collect all phases for this project
          const projectPhases: GetStateData['phases'] = [];
          for (const row of conn.db.phase.iter()) {
            if (row.projectId === project.id) {
              projectPhases.push({
                id: row.id,
                number: row.number,
                name: row.name,
                status: row.status,
                goal: row.goal,
              });
            }
          }

          // Collect all plans for this project's phases
          const phaseIds = new Set(projectPhases.map((p) => p.id));
          const projectPlans: GetStateData['plans'] = [];
          for (const row of conn.db.plan.iter()) {
            if (phaseIds.has(row.phaseId)) {
              projectPlans.push({
                id: row.id,
                phaseId: row.phaseId,
                planNumber: row.planNumber,
                status: row.status,
              });
            }
          }

          return {
            project: {
              id: project.id,
              name: project.name,
              gitRemoteUrl: project.gitRemoteUrl,
              coreValue: project.coreValue,
            },
            state: state
              ? {
                  currentPhase: state.currentPhase,
                  currentPlan: state.currentPlan,
                  currentTask: state.currentTask,
                  lastActivity: state.lastActivity,
                  lastActivityDescription: state.lastActivityDescription,
                  velocityData: state.velocityData,
                  sessionLast: state.sessionLast,
                  sessionStoppedAt: state.sessionStoppedAt,
                  sessionResumeFile: state.sessionResumeFile,
                }
              : null,
            phases: projectPhases,
            plans: projectPlans,
          };
        });

        outputSuccess(stateData, opts, formatGetState);
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
