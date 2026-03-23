import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import {
  findProjectByGitRemote,
  findProjectState,
  findPhaseByNumber,
} from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';

// ---------- Shared helper ----------

function isCompletionStatus(status: string): boolean {
  const lower = status.toLowerCase();
  return lower.startsWith('complete') || lower === 'done';
}

// ---------- init progress ----------

interface InitProgressData {
  project: { id: bigint; name: string; coreValue: string; description: string };
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
    number: string;
    name: string;
    status: string;
    goal: string;
    dependsOn: string;
    plans: { total: number; completed: number };
    requirements: { total: number; completed: number };
  }>;
  recentSummaries: Array<{
    planId: bigint;
    phaseNumber: string;
    headline: string;
  }>;
}

function formatProgress(data: unknown): string {
  const { project, state, phases, recentSummaries } =
    data as InitProgressData;

  const lines = [
    `Project: ${project.name}`,
    `Core Value: ${project.coreValue}`,
    '',
  ];

  if (state) {
    const currentPhase = phases.find((p) => p.number === state.currentPhase);
    const phaseName = currentPhase ? currentPhase.name : 'Unknown';
    lines.push(
      `Current: Phase ${state.currentPhase} (${phaseName}), Plan ${state.currentPlan}, Task ${state.currentTask}`,
    );
    lines.push(`Last activity: ${state.lastActivityDescription}`);
    lines.push(`Session: ${state.sessionLast} | Stopped at: ${state.sessionStoppedAt}`);
  } else {
    lines.push('Status: No state recorded yet');
  }

  lines.push('');
  lines.push('Phases:');
  let completedPhases = 0;
  for (const phase of phases) {
    if (isCompletionStatus(phase.status)) completedPhases++;
    lines.push(`  ${phase.number}. ${phase.name} [${phase.status}]`);
    lines.push(
      `     Plans: ${phase.plans.completed}/${phase.plans.total} | Requirements: ${phase.requirements.completed}/${phase.requirements.total}`,
    );
  }
  lines.push('');
  lines.push(`Overall: ${completedPhases}/${phases.length} phases complete`);

  if (recentSummaries.length > 0) {
    lines.push('');
    lines.push('Recent summaries:');
    for (const s of recentSummaries) {
      lines.push(`  Phase ${s.phaseNumber}: ${s.headline}`);
    }
  }

  return lines.join('\n');
}

// ---------- init plan-phase ----------

interface InitPlanPhaseData {
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
  requirements: Array<{
    id: bigint;
    number: string;
    description: string;
    status: string;
    category: string;
  }>;
  existingResearch: {
    hasResearch: boolean;
    domain: string | null;
    confidence: string | null;
    content: string | null;
  };
  existingContext: { hasContext: boolean; content: string | null };
  existingPlans: Array<{
    id: bigint;
    planNumber: bigint;
    objective: string;
    status: string;
  }>;
  projectContext: {
    coreValue: string;
    constraints: string;
    keyDecisions: string;
  };
}

function formatPlanPhase(data: unknown): string {
  const { phase, requirements, existingResearch, existingPlans, projectContext } =
    data as InitPlanPhaseData;

  const lines = [
    `Phase ${phase.number}: ${phase.name} [${phase.status}]`,
    `Goal: ${phase.goal}`,
    `Depends on: ${phase.dependsOn || 'none'}`,
    '',
    `Requirements (${requirements.length}):`,
  ];

  for (const r of requirements) {
    lines.push(`  ${r.number}: ${r.description} [${r.status}]`);
  }

  lines.push('');
  lines.push(
    `Research: ${existingResearch.hasResearch ? `${existingResearch.domain} (${existingResearch.confidence})` : 'none'}`,
  );

  lines.push('');
  lines.push(`Existing plans (${existingPlans.length}):`);
  for (const p of existingPlans) {
    lines.push(`  Plan ${p.planNumber}: ${p.objective} [${p.status}]`);
  }

  lines.push('');
  lines.push(`Project context:`);
  lines.push(`  Core value: ${projectContext.coreValue}`);

  return lines.join('\n');
}

// ---------- init execute-phase ----------

interface InitExecutePhaseData {
  phase: {
    id: bigint;
    number: string;
    name: string;
    slug: string;
    goal: string;
    status: string;
    successCriteria: string;
  };
  plans: Array<{
    id: bigint;
    planNumber: bigint;
    type: string;
    wave: bigint;
    objective: string;
    autonomous: boolean;
    requirements: string;
    dependsOn: string;
    status: string;
    content: string;
    tasks: Array<{
      id: bigint;
      taskNumber: bigint;
      type: string;
      description: string;
      status: string;
    }>;
    hasSummary: boolean;
    mustHaves: Array<{ truths: string; artifacts: string; keyLinks: string }>;
  }>;
  continueHere: {
    taskNumber: bigint;
    currentState: string;
    nextAction: string;
    context: string;
  } | null;
  requirements: Array<{
    number: string;
    description: string;
    status: string;
  }>;
}

function formatExecutePhase(data: unknown): string {
  const { phase, plans, continueHere, requirements } =
    data as InitExecutePhaseData;

  const lines = [
    `Phase ${phase.number}: ${phase.name} [${phase.status}]`,
    `Goal: ${phase.goal}`,
    '',
    `Plans (${plans.length}):`,
  ];

  for (const p of plans) {
    const taskCount = p.tasks.length;
    const completedTasks = p.tasks.filter((t) =>
      isCompletionStatus(t.status),
    ).length;
    lines.push(
      `  Plan ${p.planNumber}: ${p.objective} [${p.status}] (${completedTasks}/${taskCount} tasks)${p.hasSummary ? ' [has summary]' : ''}`,
    );
  }

  if (continueHere) {
    lines.push('');
    lines.push(`Continue here: Task ${continueHere.taskNumber}`);
    lines.push(`  State: ${continueHere.currentState}`);
    lines.push(`  Next: ${continueHere.nextAction}`);
  }

  lines.push('');
  lines.push(`Requirements (${requirements.length}):`);
  for (const r of requirements) {
    lines.push(`  ${r.number}: ${r.description} [${r.status}]`);
  }

  return lines.join('\n');
}

// ---------- Registration ----------

export function registerInitCommand(program: Command): void {
  const initCmd = program
    .command('init')
    .description('Assemble workflow context');

  // Subcommand: progress
  initCmd
    .command('progress')
    .description('Assemble progress workflow context')
    .action(async () => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const data = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const state = findProjectState(conn, project.id);

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
          projectPhases.sort(
            (a, b) => parseFloat(a.number) - parseFloat(b.number),
          );

          // Build phase-to-plans map, deduplicated by planNumber (keep latest id)
          const plansByPhase = new Map<
            bigint,
            Map<bigint, { planNumber: bigint; status: string; id: bigint }>
          >();
          for (const row of conn.db.plan.iter()) {
            let phaseMap = plansByPhase.get(row.phaseId);
            if (!phaseMap) {
              phaseMap = new Map();
              plansByPhase.set(row.phaseId, phaseMap);
            }
            const existing = phaseMap.get(row.planNumber);
            if (!existing || row.id > existing.id) {
              phaseMap.set(row.planNumber, {
                planNumber: row.planNumber,
                status: row.status,
                id: row.id,
              });
            }
          }

          // Build phaseNumber-to-requirements map
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

          // Build phases result with computed counts
          const phases: InitProgressData['phases'] = projectPhases.map(
            (phase) => {
              const plans = [...(plansByPhase.get(phase.id)?.values() || [])];
              const reqs = reqsByPhaseNumber.get(phase.number) || [];

              return {
                number: phase.number,
                name: phase.name,
                status: phase.status,
                goal: phase.goal,
                dependsOn: phase.dependsOn,
                plans: {
                  total: plans.length,
                  completed: plans.filter((p) =>
                    isCompletionStatus(p.status),
                  ).length,
                },
                requirements: {
                  total: reqs.length,
                  completed: reqs.filter((r) =>
                    isCompletionStatus(r.status),
                  ).length,
                },
              };
            },
          );

          // Collect recent summaries (up to 5, sorted by planId descending)
          // Build a planId -> phaseNumber lookup
          const planIdToPhaseNumber = new Map<bigint, string>();
          for (const phase of projectPhases) {
            for (const planRow of conn.db.plan.iter()) {
              if (planRow.phaseId === phase.id) {
                planIdToPhaseNumber.set(planRow.id, phase.number);
              }
            }
          }

          const allSummaries: Array<{
            planId: bigint;
            phaseNumber: string;
            headline: string;
          }> = [];
          for (const row of conn.db.planSummary.iter()) {
            const phaseNumber = planIdToPhaseNumber.get(row.planId);
            if (phaseNumber !== undefined) {
              allSummaries.push({
                planId: row.planId,
                phaseNumber,
                headline: row.headline,
              });
            }
          }
          // Sort by planId descending and take up to 5
          allSummaries.sort((a, b) =>
            a.planId > b.planId ? -1 : a.planId < b.planId ? 1 : 0,
          );
          const recentSummaries = allSummaries.slice(0, 5);

          return {
            project: {
              id: project.id,
              name: project.name,
              coreValue: project.coreValue,
              description: project.description,
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
            phases,
            recentSummaries,
          };
        });

        outputSuccess(data, opts, formatProgress);
        process.exit(0);
      } catch (err) {
        if (err instanceof CliError) {
          outputError(err.code, err.message, opts);
        } else {
          outputError(ErrorCodes.INTERNAL_ERROR, String(err), opts);
        }
      }
    });

  // Subcommand: plan-phase
  initCmd
    .command('plan-phase <phase>')
    .description('Assemble planning workflow context for a phase')
    .action(async (phaseNumber: string) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const data = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, phaseNumber);

          // Collect requirements linked to this phase
          const requirements: InitPlanPhaseData['requirements'] = [];
          for (const row of conn.db.requirement.iter()) {
            if (
              row.projectId === project.id &&
              row.phaseNumber === phase.number
            ) {
              requirements.push({
                id: row.id,
                number: row.number,
                description: row.description,
                status: row.status,
                category: row.category,
              });
            }
          }

          // Find existing research for this phase
          let existingResearch: InitPlanPhaseData['existingResearch'] = {
            hasResearch: false,
            domain: null,
            confidence: null,
            content: null,
          };
          for (const row of conn.db.research.iter()) {
            if (row.phaseId === phase.id) {
              existingResearch = {
                hasResearch: true,
                domain: row.domain,
                confidence: row.confidence,
                content: row.content,
              };
              break;
            }
          }

          // Find existing phase context
          let existingContext: InitPlanPhaseData['existingContext'] = {
            hasContext: false,
            content: null,
          };
          for (const row of conn.db.phaseContext.iter()) {
            if (row.phaseId === phase.id) {
              existingContext = {
                hasContext: true,
                content: row.content,
              };
              break;
            }
          }

          // Collect existing plans for this phase, deduplicated by planNumber (keep latest id)
          const existingPlanMap = new Map<bigint, InitPlanPhaseData['existingPlans'][0]>();
          for (const row of conn.db.plan.iter()) {
            if (row.phaseId === phase.id) {
              const existing = existingPlanMap.get(row.planNumber);
              if (!existing || row.id > existing.id) {
                existingPlanMap.set(row.planNumber, {
                  id: row.id,
                  planNumber: row.planNumber,
                  objective: row.objective,
                  status: row.status,
                });
              }
            }
          }
          const existingPlans = [...existingPlanMap.values()];

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
            requirements,
            existingResearch,
            existingContext,
            existingPlans,
            projectContext: {
              coreValue: project.coreValue,
              constraints: project.constraints,
              keyDecisions: project.keyDecisions,
            },
          };
        });

        outputSuccess(data, opts, formatPlanPhase);
        process.exit(0);
      } catch (err) {
        if (err instanceof CliError) {
          outputError(err.code, err.message, opts);
        } else {
          outputError(ErrorCodes.INTERNAL_ERROR, String(err), opts);
        }
      }
    });

  // Subcommand: execute-phase
  initCmd
    .command('execute-phase <phase>')
    .description('Assemble execution workflow context for a phase')
    .option('--slim', 'Omit plan content from output', false)
    .action(async (phaseNumber: string, cmdOpts: { slim: boolean }) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const data = await withConnection((conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, phaseNumber);

          // Collect all plans for this phase, deduplicated by planNumber (keep latest id)
          const planByNumber = new Map<bigint, {
            id: bigint;
            planNumber: bigint;
            type: string;
            wave: bigint;
            objective: string;
            autonomous: boolean;
            requirements: string;
            dependsOn: string;
            status: string;
            content: string;
          }>();
          for (const row of conn.db.plan.iter()) {
            if (row.phaseId === phase.id) {
              const existing = planByNumber.get(row.planNumber);
              if (!existing || row.id > existing.id) {
                planByNumber.set(row.planNumber, {
                  id: row.id,
                  planNumber: row.planNumber,
                  type: row.type,
                  wave: row.wave,
                  objective: row.objective,
                  autonomous: row.autonomous,
                  requirements: row.requirements,
                  dependsOn: row.dependsOn,
                  status: row.status,
                  content: row.content,
                });
              }
            }
          }
          const phasePlans = [...planByNumber.values()];
          phasePlans.sort((a, b) =>
            a.planNumber < b.planNumber ? -1 : a.planNumber > b.planNumber ? 1 : 0,
          );

          // Build planId -> tasks map
          const tasksByPlan = new Map<
            bigint,
            Array<{
              id: bigint;
              taskNumber: bigint;
              type: string;
              description: string;
              status: string;
            }>
          >();
          for (const row of conn.db.planTask.iter()) {
            const existing = tasksByPlan.get(row.planId);
            const entry = {
              id: row.id,
              taskNumber: row.taskNumber,
              type: row.type,
              description: row.description,
              status: row.status,
            };
            if (existing) {
              existing.push(entry);
            } else {
              tasksByPlan.set(row.planId, [entry]);
            }
          }

          // Build planId -> hasSummary map
          const summaryByPlan = new Set<bigint>();
          for (const row of conn.db.planSummary.iter()) {
            summaryByPlan.add(row.planId);
          }

          // Build planId -> mustHaves map
          const mustHavesByPlan = new Map<
            bigint,
            Array<{ truths: string; artifacts: string; keyLinks: string }>
          >();
          for (const row of conn.db.mustHave.iter()) {
            const existing = mustHavesByPlan.get(row.planId);
            const entry = {
              truths: row.truths,
              artifacts: row.artifacts,
              keyLinks: row.keyLinks,
            };
            if (existing) {
              existing.push(entry);
            } else {
              mustHavesByPlan.set(row.planId, [entry]);
            }
          }

          // Assemble plans with nested data
          const plans: InitExecutePhaseData['plans'] = phasePlans.map((p) => {
            const tasks = tasksByPlan.get(p.id) || [];
            tasks.sort((a, b) =>
              a.taskNumber < b.taskNumber
                ? -1
                : a.taskNumber > b.taskNumber
                  ? 1
                  : 0,
            );

            return {
              id: p.id,
              planNumber: p.planNumber,
              type: p.type,
              wave: p.wave,
              objective: p.objective,
              autonomous: p.autonomous,
              requirements: p.requirements,
              dependsOn: p.dependsOn,
              status: p.status,
              content: cmdOpts.slim ? '' : p.content,
              tasks,
              hasSummary: summaryByPlan.has(p.id),
              mustHaves: mustHavesByPlan.get(p.id) || [],
            };
          });

          // Find continue-here state for this phase
          let continueHere: InitExecutePhaseData['continueHere'] = null;
          for (const row of conn.db.continueHere.iter()) {
            if (
              row.projectId === project.id &&
              row.phaseId === phase.id
            ) {
              continueHere = {
                taskNumber: row.taskNumber,
                currentState: row.currentState,
                nextAction: row.nextAction,
                context: row.context,
              };
              break;
            }
          }

          // Collect requirements for this phase
          const requirements: InitExecutePhaseData['requirements'] = [];
          for (const row of conn.db.requirement.iter()) {
            if (
              row.projectId === project.id &&
              row.phaseNumber === phase.number
            ) {
              requirements.push({
                number: row.number,
                description: row.description,
                status: row.status,
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
              successCriteria: phase.successCriteria,
            },
            plans,
            continueHere,
            requirements,
          };
        });

        outputSuccess(data, opts, formatExecutePhase);
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
