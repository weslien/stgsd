import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export interface PhaseArtifacts {
  phaseDir: string | null;
  planFile: string | null;
  summaryFile: string | null;
  verificationFile: string | null;
  validationFile: string | null;
}

export interface PhaseGateIssue {
  code:
    | 'PHASE_DIR_MISSING'
    | 'SUMMARY_MISSING'
    | 'VERIFICATION_MISSING'
    | 'VERIFICATION_GAPS_FOUND'
    | 'VALIDATION_MISSING';
  message: string;
}

/**
 * Normalize a phase number to its zero-padded directory form.
 * "1" -> "01", "1.2" -> "01.2", "3A" -> "03A", "12" -> "12".
 */
export function normalizePhaseNumber(phase: string): string {
  const match = phase.match(/^(\d+)([A-Z])?((?:\.\d+)*)$/i);
  if (!match) return phase;
  const padded = match[1].padStart(2, '0');
  const letter = match[2] ? match[2].toUpperCase() : '';
  const decimal = match[3] || '';
  return padded + letter + decimal;
}

/**
 * Order phase numbers like "01", "02.1", "03A": integer-then-letter-then-decimals.
 * Mirrors the GSD `comparePhaseNum` semantics: 12 < 12A < 12A.1 < 12A.2 < 13.
 */
export function comparePhaseNumber(a: string, b: string): number {
  const pa = String(a).match(/^(\d+)([A-Z])?((?:\.\d+)*)/i);
  const pb = String(b).match(/^(\d+)([A-Z])?((?:\.\d+)*)/i);
  if (!pa || !pb) return String(a).localeCompare(String(b));
  const intDiff = parseInt(pa[1], 10) - parseInt(pb[1], 10);
  if (intDiff !== 0) return intDiff;
  const la = (pa[2] || '').toUpperCase();
  const lb = (pb[2] || '').toUpperCase();
  if (la !== lb) {
    if (!la) return -1;
    if (!lb) return 1;
    return la < lb ? -1 : 1;
  }
  const aDec = pa[3] ? pa[3].slice(1).split('.').map((p) => parseInt(p, 10)) : [];
  const bDec = pb[3] ? pb[3].slice(1).split('.').map((p) => parseInt(p, 10)) : [];
  if (aDec.length === 0 && bDec.length > 0) return -1;
  if (bDec.length === 0 && aDec.length > 0) return 1;
  const maxLen = Math.max(aDec.length, bDec.length);
  for (let i = 0; i < maxLen; i++) {
    const av = Number.isFinite(aDec[i]) ? aDec[i] : 0;
    const bv = Number.isFinite(bDec[i]) ? bDec[i] : 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

/**
 * Locate a phase directory under <cwd>/.planning/phases/ matching
 * the normalized phase number prefix (e.g. "04-" or exactly "04").
 * Returns null if .planning/phases is missing or no match.
 */
export function findPhaseDir(cwd: string, phaseNumber: string): string | null {
  const phasesDir = join(cwd, '.planning', 'phases');
  if (!existsSync(phasesDir)) return null;
  const normalized = normalizePhaseNumber(phaseNumber);
  let entries: string[];
  try {
    entries = readdirSync(phasesDir);
  } catch {
    return null;
  }
  // Prefer exact "<N>-..." match; fall back to bare "<N>" dir.
  const withSlug = entries.find((e) => e.startsWith(normalized + '-'));
  if (withSlug) {
    const full = join(phasesDir, withSlug);
    if (statSync(full).isDirectory()) return full;
  }
  const exact = entries.find((e) => e === normalized);
  if (exact) {
    const full = join(phasesDir, exact);
    if (statSync(full).isDirectory()) return full;
  }
  return null;
}

/**
 * List all phase directories under .planning/phases/ with parsed numbers.
 */
export function listPhaseDirs(
  cwd: string,
): Array<{ name: string; path: string; number: string }> {
  const phasesDir = join(cwd, '.planning', 'phases');
  if (!existsSync(phasesDir)) return [];
  let entries: string[];
  try {
    entries = readdirSync(phasesDir);
  } catch {
    return [];
  }
  const out: Array<{ name: string; path: string; number: string }> = [];
  for (const name of entries) {
    const full = join(phasesDir, name);
    try {
      if (!statSync(full).isDirectory()) continue;
    } catch {
      continue;
    }
    const m = name.match(/^(\d+[A-Z]?(?:\.\d+)*)/i);
    if (!m) continue;
    out.push({ name, path: full, number: m[1] });
  }
  return out;
}

/**
 * Find a named artifact in a phase directory. Accepts either
 * "<phase>-<slug>-<KIND>.md" or bare "<KIND>.md" (matching the
 * conventions used in the GSD workflow library).
 */
function findArtifact(phaseDir: string, kind: string): string | null {
  let entries: string[];
  try {
    entries = readdirSync(phaseDir);
  } catch {
    return null;
  }
  const upper = kind.toUpperCase();
  const tail = `-${upper}.md`;
  const exact = `${upper}.md`;
  const match =
    entries.find((e) => e === exact) ??
    entries.find((e) => e.toUpperCase().endsWith(tail));
  return match ? join(phaseDir, match) : null;
}

export function collectPhaseArtifacts(
  cwd: string,
  phaseNumber: string,
): PhaseArtifacts {
  const phaseDir = findPhaseDir(cwd, phaseNumber);
  if (!phaseDir) {
    return {
      phaseDir: null,
      planFile: null,
      summaryFile: null,
      verificationFile: null,
      validationFile: null,
    };
  }
  return {
    phaseDir,
    planFile: findArtifact(phaseDir, 'PLAN'),
    summaryFile: findArtifact(phaseDir, 'SUMMARY'),
    verificationFile: findArtifact(phaseDir, 'VERIFICATION'),
    validationFile: findArtifact(phaseDir, 'VALIDATION'),
  };
}

/**
 * Parse the YAML-ish frontmatter block at the top of a markdown file
 * into a plain string→string map. Only top-level scalar keys are
 * recognized — sufficient for `status: gaps_found`-style checks.
 */
export function parseFrontmatter(filePath: string): Record<string, string> {
  let text: string;
  try {
    text = readFileSync(filePath, 'utf-8');
  } catch {
    return {};
  }
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const out: Record<string, string> = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith('#')) continue;
    if (/^\s/.test(line)) continue; // skip nested keys
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[m[1]] = val;
  }
  return out;
}

/**
 * Read .planning/config.json and return whether nyquist validation is
 * enabled. Defaults to true (matches GSD audit-milestone semantics).
 */
export function isNyquistEnabled(cwd: string): boolean {
  const configPath = join(cwd, '.planning', 'config.json');
  if (!existsSync(configPath)) return true;
  try {
    const parsed = JSON.parse(readFileSync(configPath, 'utf-8'));
    const flag = parsed?.workflow?.nyquist_validation;
    if (flag === false) return false;
    return true;
  } catch {
    return true;
  }
}

/**
 * Validate that a phase has the on-disk artifacts required for it to
 * be marked Complete. Returns a list of issues — empty list means OK.
 */
export function validatePhaseCompletion(
  cwd: string,
  phaseNumber: string,
): { issues: PhaseGateIssue[]; artifacts: PhaseArtifacts } {
  const artifacts = collectPhaseArtifacts(cwd, phaseNumber);
  const issues: PhaseGateIssue[] = [];

  if (!artifacts.phaseDir) {
    issues.push({
      code: 'PHASE_DIR_MISSING',
      message: `Phase directory not found under .planning/phases/ for phase ${phaseNumber}`,
    });
    return { issues, artifacts };
  }

  if (!artifacts.summaryFile) {
    issues.push({
      code: 'SUMMARY_MISSING',
      message: `SUMMARY.md missing in ${artifacts.phaseDir}`,
    });
  }

  if (!artifacts.verificationFile) {
    issues.push({
      code: 'VERIFICATION_MISSING',
      message: `VERIFICATION.md missing in ${artifacts.phaseDir}`,
    });
  } else {
    const fm = parseFrontmatter(artifacts.verificationFile);
    if (fm.status === 'gaps_found') {
      issues.push({
        code: 'VERIFICATION_GAPS_FOUND',
        message: `VERIFICATION.md reports status: gaps_found at ${artifacts.verificationFile}`,
      });
    }
  }

  if (isNyquistEnabled(cwd) && !artifacts.validationFile) {
    issues.push({
      code: 'VALIDATION_MISSING',
      message: `VALIDATION.md missing in ${artifacts.phaseDir} (nyquist_validation enabled)`,
    });
  }

  return { issues, artifacts };
}
