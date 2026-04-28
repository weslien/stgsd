import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import {
  findProjectByGitRemote,
  findPhaseByNumber,
  findProjectState,
  waitForStateUpdate,
} from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';
import {
  validatePhaseCompletion,
  type PhaseGateIssue,
} from '../lib/disk-artifacts.js';

interface CompletePhaseData {
  completedPhase: { number: string; name: string };
  nextPhase: { number: string; name: string } | null;
  isLastPhase: boolean;
  forced?: boolean;
  warnings?: PhaseGateIssue[];
}

function formatCompletePhase(data: unknown): string {
  const { completedPhase, nextPhase, isLastPhase, forced, warnings } =
    data as CompletePhaseData;
  const lines = [
    'Phase completed:',
    `  Phase: ${completedPhase.number} - ${completedPhase.name}`,
  ];
  if (isLastPhase) {
    lines.push('  Next: Last phase - milestone complete');
  } else if (nextPhase) {
    lines.push(`  Next: ${nextPhase.number} - ${nextPhase.name}`);
  }
  if (forced && warnings && warnings.length > 0) {
    lines.push('  Forced past gate; unmet checks:');
    for (const w of warnings) lines.push(`    - ${w.code}: ${w.message}`);
  }
  return lines.join('\n');
}

export function registerCompletePhaseCommand(program: Command): void {
  program
    .command('complete-phase <phase>')
    .description('Mark a phase as complete and advance project state')
    .option(
      '--force',
      'Skip on-disk artifact gate (SUMMARY/VERIFICATION/VALIDATION)',
      false,
    )
    .action(async (phaseArg: string, cmdOpts: { force: boolean }) => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();

        const gate = validatePhaseCompletion(process.cwd(), phaseArg);
        if (gate.issues.length > 0 && !cmdOpts.force) {
          const detail = gate.issues
            .map((i) => `  - ${i.code}: ${i.message}`)
            .join('\n');
          throw new CliError(
            ErrorCodes.PHASE_NOT_VERIFIED,
            `Phase ${phaseArg} cannot be marked Complete — missing required artifacts:\n${detail}\nRe-run with --force to override.`,
          );
        }

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);
          const phase = findPhaseByNumber(conn, project.id, phaseArg);
          const state = findProjectState(conn, project.id);

          if (!state) {
            throw new CliError(
              ErrorCodes.INTERNAL_ERROR,
              'No project state exists. Run a seed_project reducer first.',
            );
          }

          // Update phase status to Complete
          conn.reducers.updatePhase({
            phaseId: phase.id,
            number: phase.number,
            name: phase.name,
            slug: phase.slug,
            goal: phase.goal,
            status: 'Complete',
            dependsOn: phase.dependsOn,
            successCriteria: phase.successCriteria,
          });

          // Determine the next phase
          const allPhases: Array<{
            id: bigint;
            number: string;
            name: string;
          }> = [];
          for (const row of conn.db.phase.iter()) {
            if (row.projectId === project.id) {
              allPhases.push({
                id: row.id,
                number: row.number,
                name: row.name,
              });
            }
          }
          allPhases.sort(
            (a, b) => parseFloat(a.number) - parseFloat(b.number),
          );

          const currentIndex = allPhases.findIndex(
            (p) => p.number === phase.number,
          );
          const nextPhase =
            currentIndex >= 0 && currentIndex < allPhases.length - 1
              ? allPhases[currentIndex + 1]
              : null;

          // Set up listener BEFORE calling upsertProjectState
          const updatePromise = waitForStateUpdate(conn, project.id);

          conn.reducers.upsertProjectState({
            projectId: project.id,
            currentPhase: nextPhase ? nextPhase.number : state.currentPhase,
            currentPlan: nextPhase ? 1n : state.currentPlan,
            currentTask: 0n,
            lastActivityDescription: `Completed phase ${phase.number}: ${phase.name}`,
            velocityData: state.velocityData,
            sessionLast: new Date().toISOString().split('T')[0],
            sessionStoppedAt: `Completed phase ${phase.number}`,
            sessionResumeFile: state.sessionResumeFile ?? '',
          });

          await updatePromise;

          return {
            completedPhase: {
              number: phase.number,
              name: phase.name,
            },
            nextPhase: nextPhase
              ? { number: nextPhase.number, name: nextPhase.name }
              : null,
            isLastPhase: !nextPhase,
            forced: cmdOpts.force && gate.issues.length > 0,
            warnings: gate.issues,
          };
        });

        outputSuccess(result, opts, formatCompletePhase);
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
