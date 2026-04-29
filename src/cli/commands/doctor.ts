import type { Command } from 'commander';
import type { DbConnection } from '../../module_bindings/index.js';
import { withConnection } from '../lib/connection.js';
import { getGitRemoteUrl } from '../lib/git.js';
import { findProjectByGitRemote } from '../lib/project.js';
import { outputSuccess, outputError } from '../lib/output.js';
import { CliError, ErrorCodes } from '../lib/errors.js';
import {
  collectPhaseArtifacts,
  comparePhaseNumber,
  isNyquistEnabled,
  listPhaseDirs,
  parseFrontmatter,
} from '../lib/disk-artifacts.js';

interface PhaseFinding {
  phase: string;
  name?: string;
  source: 'stdb' | 'disk';
  issue: string;
  remediation: string;
  archivedMilestone?: string;
}

interface DoctorData {
  project: { id: string; name: string };
  ok: boolean;
  findings: PhaseFinding[];
  summary: {
    stdbPhases: number;
    diskPhases: number;
    findings: number;
  };
}

function formatDoctor(data: unknown): string {
  const { project, ok, findings, summary } = data as DoctorData;
  const lines = [
    `Doctor: ${project.name}`,
    `  STDB phases: ${summary.stdbPhases}`,
    `  Disk phases: ${summary.diskPhases}`,
    `  Findings:    ${summary.findings}`,
    '',
  ];
  if (ok) {
    lines.push('No divergences detected.');
    return lines.join('\n');
  }
  for (const f of findings) {
    const archived = f.archivedMilestone ? ` [archived under ${f.archivedMilestone}]` : '';
    lines.push(`[${f.source.toUpperCase()}] phase ${f.phase}${f.name ? ` (${f.name})` : ''}${archived}`);
    lines.push(`  Issue:   ${f.issue}`);
    lines.push(`  Suggest: ${f.remediation}`);
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

export function registerDoctorCommand(program: Command): void {
  program
    .command('doctor')
    .description(
      'Diagnose divergences between SpacetimeDB phase state and on-disk .planning/ artifacts',
    )
    .action(async () => {
      const opts = program.opts<{ json: boolean }>();

      try {
        const gitRemoteUrl = getGitRemoteUrl();
        const cwd = process.cwd();
        const nyquist = isNyquistEnabled(cwd);
        const diskDirs = listPhaseDirs(cwd);

        const result = await withConnection(async (conn: DbConnection) => {
          const project = findProjectByGitRemote(conn, gitRemoteUrl);

          const stdbPhases: Array<{
            number: string;
            name: string;
            status: string;
          }> = [];
          for (const row of conn.db.phase.iter()) {
            if (row.projectId !== project.id) continue;
            stdbPhases.push({
              number: row.number,
              name: row.name,
              status: row.status,
            });
          }
          stdbPhases.sort((a, b) => comparePhaseNumber(a.number, b.number));

          const findings: PhaseFinding[] = [];

          // 1. For each Complete phase in STDB, check disk artifacts.
          for (const p of stdbPhases) {
            if (p.status !== 'Complete') continue;
            const artifacts = collectPhaseArtifacts(cwd, p.number);
            const archived = artifacts.archivedMilestone ?? undefined;
            const archivedNote = archived
              ? ` (archived under milestone ${archived})`
              : '';
            if (!artifacts.phaseDir) {
              findings.push({
                phase: p.number,
                name: p.name,
                source: 'stdb',
                issue:
                  'Marked Complete in SpacetimeDB but phase directory missing on disk (checked .planning/phases/ and .planning/milestones/<version>-phases/)',
                remediation: `Run /gsd:verify-work to retroactively produce artifacts, or stclaude remove-phase ${p.number} to roll STDB back`,
              });
              continue;
            }
            if (!artifacts.summaryFile) {
              findings.push({
                phase: p.number,
                name: p.name,
                source: 'stdb',
                archivedMilestone: archived,
                issue: `Complete in STDB but SUMMARY.md missing in ${artifacts.phaseDir}${archivedNote}`,
                remediation: archived
                  ? `Restore SUMMARY.md in the milestone ${archived} archive, or roll STDB back with remove-phase`
                  : 'Run /gsd:verify-work to generate SUMMARY.md retroactively',
              });
            }
            if (!artifacts.verificationFile) {
              findings.push({
                phase: p.number,
                name: p.name,
                source: 'stdb',
                archivedMilestone: archived,
                issue: `Complete in STDB but VERIFICATION.md missing in ${artifacts.phaseDir}${archivedNote}`,
                remediation: archived
                  ? `Restore VERIFICATION.md in the milestone ${archived} archive, or roll STDB back with remove-phase`
                  : 'Run /gsd:verify-work to generate VERIFICATION.md retroactively',
              });
            } else {
              const fm = parseFrontmatter(artifacts.verificationFile);
              if (fm.status === 'gaps_found') {
                findings.push({
                  phase: p.number,
                  name: p.name,
                  source: 'stdb',
                  archivedMilestone: archived,
                  issue: `Complete in STDB but VERIFICATION.md status: gaps_found at ${artifacts.verificationFile}${archivedNote}`,
                  remediation: 'Resolve gaps then re-run write-verification, or roll back with remove-phase',
                });
              }
            }
            if (nyquist && !artifacts.validationFile) {
              findings.push({
                phase: p.number,
                name: p.name,
                source: 'stdb',
                archivedMilestone: archived,
                issue: `Complete in STDB but VALIDATION.md missing (nyquist_validation enabled) in ${artifacts.phaseDir}${archivedNote}`,
                remediation: archived
                  ? `Restore VALIDATION.md in the milestone ${archived} archive, or roll STDB back with remove-phase`
                  : 'Run /gsd:validate-phase to fill the Nyquist validation gap',
              });
            }
          }

          // 2. For each phase directory on disk, check it exists in STDB.
          const stdbByNumber = new Map(
            stdbPhases.map((p) => [p.number, p]),
          );
          // STDB stores numbers as the user supplied (often unpadded);
          // build a normalized lookup so "01" matches stored "1".
          const stdbByNormalized = new Map<string, string>();
          for (const p of stdbPhases) {
            stdbByNormalized.set(p.number.replace(/^0+(?=\d)/, ''), p.number);
          }
          for (const d of diskDirs) {
            const stripped = d.number.replace(/^0+(?=\d)/, '');
            if (
              !stdbByNumber.has(d.number) &&
              !stdbByNumber.has(stripped) &&
              !stdbByNormalized.has(stripped)
            ) {
              findings.push({
                phase: d.number,
                source: 'disk',
                archivedMilestone: d.archivedMilestone ?? undefined,
                issue: `Phase directory ${d.path} has no matching phase row in SpacetimeDB`,
                remediation: d.archivedMilestone
                  ? `Re-register with stclaude add-phase / insert-phase, or delete the orphan directory under .planning/milestones/${d.archivedMilestone}-phases/`
                  : 'Run stclaude add-phase / insert-phase to register it, or delete the orphan directory',
              });
            }
          }

          return {
            project: {
              id: project.id.toString(),
              name: project.name,
            },
            ok: findings.length === 0,
            findings,
            summary: {
              stdbPhases: stdbPhases.length,
              diskPhases: diskDirs.length,
              findings: findings.length,
            },
          };
        });

        outputSuccess(result, opts, formatDoctor);
        process.exit(result.ok ? 0 : 1);
      } catch (err) {
        if (err instanceof CliError) {
          outputError(err.code, err.message, opts);
        } else {
          outputError(ErrorCodes.INTERNAL_ERROR, String(err), opts);
        }
      }
    });
}
