import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  collectPhaseArtifacts,
  findPhaseDir,
  listPhaseDirs,
  resolvePhaseDir,
} from '../src/cli/lib/disk-artifacts';

let cwd: string;

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), 'stgsd-disk-artifacts-'));
  mkdirSync(join(cwd, '.planning'), { recursive: true });
});

afterEach(() => {
  rmSync(cwd, { recursive: true, force: true });
});

function writeFrontmatter(file: string, body: string): void {
  writeFileSync(file, body);
}

describe('findPhaseDir / resolvePhaseDir', () => {
  test('resolves an active phase directory under .planning/phases/', () => {
    const dir = join(cwd, '.planning', 'phases', '01-schema-module');
    mkdirSync(dir, { recursive: true });

    const path = findPhaseDir(cwd, '01');
    expect(path).toBe(dir);

    const resolved = resolvePhaseDir(cwd, '01');
    expect(resolved).not.toBeNull();
    expect(resolved?.location).toBe('active');
    expect(resolved?.milestoneVersion).toBeNull();
  });

  test('resolves an archived phase directory under milestones/', () => {
    const dir = join(
      cwd,
      '.planning',
      'milestones',
      'v1.0-phases',
      '01-schema-module',
    );
    mkdirSync(dir, { recursive: true });

    const path = findPhaseDir(cwd, '01');
    expect(path).toBe(dir);

    const resolved = resolvePhaseDir(cwd, '01');
    expect(resolved).not.toBeNull();
    expect(resolved?.location).toBe('archived');
    expect(resolved?.milestoneVersion).toBe('1.0');
  });

  test('prefers active over archived when both exist', () => {
    const active = join(cwd, '.planning', 'phases', '02-active');
    const archived = join(
      cwd,
      '.planning',
      'milestones',
      'v1.0-phases',
      '02-archived',
    );
    mkdirSync(active, { recursive: true });
    mkdirSync(archived, { recursive: true });

    const resolved = resolvePhaseDir(cwd, '02');
    expect(resolved?.path).toBe(active);
    expect(resolved?.location).toBe('active');
  });

  test('prefers newest milestone version when multiple archives match', () => {
    const v10 = join(
      cwd,
      '.planning',
      'milestones',
      'v1.0-phases',
      '03-old',
    );
    const v11 = join(
      cwd,
      '.planning',
      'milestones',
      'v1.1-phases',
      '03-newer',
    );
    mkdirSync(v10, { recursive: true });
    mkdirSync(v11, { recursive: true });

    const resolved = resolvePhaseDir(cwd, '03');
    expect(resolved?.path).toBe(v11);
    expect(resolved?.milestoneVersion).toBe('1.1');
  });

  test('accepts unpadded phase numbers', () => {
    const dir = join(
      cwd,
      '.planning',
      'milestones',
      'v1.0-phases',
      '04-foo',
    );
    mkdirSync(dir, { recursive: true });

    expect(findPhaseDir(cwd, '4')).toBe(dir);
  });

  test('returns null when phase is in neither location', () => {
    expect(findPhaseDir(cwd, '99')).toBeNull();
    expect(resolvePhaseDir(cwd, '99')).toBeNull();
  });

  test('ignores non-phase directories under milestones/', () => {
    mkdirSync(join(cwd, '.planning', 'milestones', 'v1.0-phases', '05-x'), {
      recursive: true,
    });
    mkdirSync(join(cwd, '.planning', 'milestones', 'v1.0-extras'), {
      recursive: true,
    });
    mkdirSync(join(cwd, '.planning', 'milestones', 'README.md'), {
      recursive: true,
    });

    expect(findPhaseDir(cwd, '05')).toBe(
      join(cwd, '.planning', 'milestones', 'v1.0-phases', '05-x'),
    );
    expect(findPhaseDir(cwd, '06')).toBeNull();
  });
});

describe('listPhaseDirs', () => {
  test('lists active and archived phases with location tags', () => {
    mkdirSync(join(cwd, '.planning', 'phases', '07-current'), {
      recursive: true,
    });
    mkdirSync(
      join(cwd, '.planning', 'milestones', 'v1.0-phases', '01-old'),
      { recursive: true },
    );
    mkdirSync(
      join(cwd, '.planning', 'milestones', 'v1.0-phases', '02-old'),
      { recursive: true },
    );

    const dirs = listPhaseDirs(cwd);
    const active = dirs.filter((d) => d.location === 'active');
    const archived = dirs.filter((d) => d.location === 'archived');

    expect(active.map((d) => d.number).sort()).toEqual(['07']);
    expect(archived.map((d) => d.number).sort()).toEqual(['01', '02']);
    for (const a of archived) {
      expect(a.milestoneVersion).toBe('1.0');
    }
  });

  test('returns empty list when neither tree exists', () => {
    expect(listPhaseDirs(cwd)).toEqual([]);
  });
});

describe('collectPhaseArtifacts', () => {
  test('collects PLAN/SUMMARY/VERIFICATION/VALIDATION from an archived phase', () => {
    const dir = join(
      cwd,
      '.planning',
      'milestones',
      'v1.0-phases',
      '08-archive-target',
    );
    mkdirSync(dir, { recursive: true });
    writeFrontmatter(join(dir, '08-PLAN.md'), '# plan\n');
    writeFrontmatter(join(dir, '08-01-SUMMARY.md'), '# summary\n');
    writeFrontmatter(
      join(dir, '08-VERIFICATION.md'),
      '---\nstatus: complete\n---\n',
    );
    writeFrontmatter(join(dir, '08-VALIDATION.md'), '# validation\n');

    const artifacts = collectPhaseArtifacts(cwd, '08');
    expect(artifacts.phaseDir).toBe(dir);
    expect(artifacts.planFile).toContain('PLAN.md');
    expect(artifacts.summaryFile).toContain('SUMMARY.md');
    expect(artifacts.verificationFile).toContain('VERIFICATION.md');
    expect(artifacts.validationFile).toContain('VALIDATION.md');
    expect(artifacts.location).toBe('archived');
    expect(artifacts.milestoneVersion).toBe('1.0');
  });

  test('returns null artifacts when phase cannot be resolved', () => {
    const artifacts = collectPhaseArtifacts(cwd, '42');
    expect(artifacts.phaseDir).toBeNull();
    expect(artifacts.location).toBeNull();
    expect(artifacts.milestoneVersion).toBeNull();
  });
});
