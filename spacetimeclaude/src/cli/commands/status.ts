import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote, findProjectState } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

interface StatusData {
  project: {
    id: bigint;
    name: string;
    gitRemoteUrl: string;
    description: string;
  };
  state: {
    currentPhase: string;
    currentPlan: bigint;
    currentTask: bigint;
    lastActivity: { microsSinceUnixEpoch: bigint };
    lastActivityDescription: string;
  } | null;
  phases: Array<{
    id: bigint;
    number: string;
    name: string;
    status: string;
  }>;
  plans: Array<{
    id: bigint;
    phaseId: bigint;
    planNumber: bigint;
  }>;
}

function formatStatus(data: unknown): string {
  const { project, state, phases, plans } = data as StatusData;

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
    `Phase: ${state.currentPhase} - ${phaseName} (${phaseStatus})`,
    `Plan: ${state.currentPlan} of ${plansInPhase}`,
    `Last activity: ${lastActivityDate} - ${state.lastActivityDescription}`,
  ];

  return lines.join('\n');
}

export function registerStatusCommand(program: Command): void {
  program.action(async () => {
    const opts = program.opts<{ json: boolean }>();

    try {
      const gitRemoteUrl = getGitRemoteUrl();

      const statusData = await withConnection((conn: DbConnection) => {
        const foundProject = findProjectByGitRemote(conn, gitRemoteUrl);

        const foundState = findProjectState(conn, foundProject.id);

        // Find all phases for this project
        const projectPhases = [];
        for (const row of conn.db.phase.iter()) {
          if (row.projectId === foundProject.id) {
            projectPhases.push({
              id: row.id,
              number: row.number,
              name: row.name,
              status: row.status,
            });
          }
        }

        // Find all plans for this project's phases
        const phaseIds = new Set(projectPhases.map((p) => p.id));
        const projectPlans = [];
        for (const row of conn.db.plan.iter()) {
          if (phaseIds.has(row.phaseId)) {
            projectPlans.push({
              id: row.id,
              phaseId: row.phaseId,
              planNumber: row.planNumber,
            });
          }
        }

        return {
          project: {
            id: foundProject.id,
            name: foundProject.name,
            gitRemoteUrl: foundProject.gitRemoteUrl,
            description: foundProject.description,
          },
          state: foundState
            ? {
                currentPhase: foundState.currentPhase,
                currentPlan: foundState.currentPlan,
                currentTask: foundState.currentTask,
                lastActivity: foundState.lastActivity,
                lastActivityDescription: foundState.lastActivityDescription,
              }
            : null,
          phases: projectPhases,
          plans: projectPlans,
        };
      });

      outputSuccess(statusData, opts, formatStatus);
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
