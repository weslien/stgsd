import type { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { fileURLToPath } from 'node:url';
import { outputSuccess, outputError } from '../lib/output.js';
import { ErrorCodes } from '../lib/errors.js';

interface ManifestEntry {
  file: string;
  expected: string[];
  forbidden: string[];
}

interface PatchManifest {
  version: string;
  generated: string;
  gsdPaths: ManifestEntry[];
  agentPaths: ManifestEntry[];
  commandPaths: ManifestEntry[];
}

interface FileResult {
  file: string;
  status: 'pass' | 'fail' | 'missing';
  missingExpected: string[];
  presentForbidden: string[];
}

interface VerifyResults {
  passed: number;
  failed: number;
  total: number;
  results: FileResult[];
}

function resolveManifestPath(): string {
  // Check installed location first
  const installedManifest = path.join(
    os.homedir(),
    '.claude',
    'stclaude',
    'patch-manifest.json',
  );
  if (fs.existsSync(installedManifest)) {
    return installedManifest;
  }

  // Dev mode fallback: walk up from CLI location to find repo root
  const __filename = fileURLToPath(import.meta.url);
  let dir = path.dirname(__filename);
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, 'patch-manifest.json');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error('MANIFEST_NOT_FOUND');
}

function resolveGsdDir(): string | null {
  // Check local project first
  const localGsd = path.join(process.cwd(), '.claude', 'get-shit-done');
  const localVersion = path.join(localGsd, 'VERSION');
  if (fs.existsSync(localVersion)) {
    return localGsd;
  }

  // Check global
  const globalGsd = path.join(os.homedir(), '.claude', 'get-shit-done');
  const globalVersion = path.join(globalGsd, 'VERSION');
  if (fs.existsSync(globalVersion)) {
    return globalGsd;
  }

  return null;
}

function checkFile(
  baseDir: string | null,
  entry: ManifestEntry,
): FileResult {
  if (!baseDir) {
    return {
      file: entry.file,
      status: 'missing',
      missingExpected: entry.expected,
      presentForbidden: [],
    };
  }

  const fullPath = path.join(baseDir, entry.file);
  if (!fs.existsSync(fullPath)) {
    return {
      file: entry.file,
      status: 'missing',
      missingExpected: entry.expected,
      presentForbidden: [],
    };
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const missingExpected: string[] = [];
  const presentForbidden: string[] = [];

  for (const pattern of entry.expected) {
    if (!content.includes(pattern)) {
      missingExpected.push(pattern);
    }
  }

  for (const pattern of entry.forbidden) {
    if (content.includes(pattern)) {
      presentForbidden.push(pattern);
    }
  }

  const status =
    missingExpected.length === 0 && presentForbidden.length === 0
      ? 'pass'
      : 'fail';

  return { file: entry.file, status, missingExpected, presentForbidden };
}

function formatResults(data: unknown): string {
  const { passed, failed, total, results } = data as VerifyResults;
  const lines: string[] = [];

  lines.push('Patch Verification Results');
  lines.push('==========================');
  lines.push('');

  // Find max file path length for alignment
  const maxLen = Math.max(...results.map((r) => r.file.length));

  for (const result of results) {
    const padding = ' '.repeat(maxLen - result.file.length + 4);
    const statusLabel = result.status.toUpperCase();
    lines.push(`${result.file}${padding}${statusLabel}`);

    if (result.status === 'fail' || result.status === 'missing') {
      for (const pattern of result.missingExpected) {
        lines.push(`  MISSING: ${pattern}`);
      }
      for (const pattern of result.presentForbidden) {
        lines.push(`  FORBIDDEN PRESENT: ${pattern}`);
      }
    }
  }

  lines.push('');
  lines.push(`Results: ${passed}/${total} passed, ${failed} failed`);

  if (failed > 0) {
    lines.push('');
    lines.push('Run /gsd:reapply-patches to restore missing patches.');
  }

  return lines.join('\n');
}

export function registerVerifyPatchesCommand(program: Command): void {
  program
    .command('verify-patches')
    .description(
      'Verify all expected patches are present in GSD, agent, and command files',
    )
    .action(async () => {
      const opts = program.opts<{ json: boolean }>();

      // Resolve manifest
      let manifestPath: string;
      try {
        manifestPath = resolveManifestPath();
      } catch {
        outputError(
          ErrorCodes.MANIFEST_NOT_FOUND,
          'Could not find patch-manifest.json. Checked ~/.claude/stclaude/ and repo root.',
          opts,
        );
        return; // unreachable — outputError calls process.exit(1)
      }

      let manifest: PatchManifest;
      try {
        const raw = fs.readFileSync(manifestPath, 'utf-8');
        manifest = JSON.parse(raw) as PatchManifest;
      } catch (err) {
        outputError(
          ErrorCodes.INTERNAL_ERROR,
          `Failed to parse patch-manifest.json: ${String(err)}`,
          opts,
        );
        return;
      }

      // Resolve base directories
      const gsdDir = resolveGsdDir();
      const agentDir = path.join(os.homedir(), '.claude', 'agents');
      const commandDir = path.join(os.homedir(), '.claude', 'commands');

      // Check all files
      const results: FileResult[] = [];

      for (const entry of manifest.gsdPaths ?? []) {
        results.push(checkFile(gsdDir, entry));
      }

      for (const entry of manifest.agentPaths ?? []) {
        results.push(checkFile(agentDir, entry));
      }

      for (const entry of manifest.commandPaths ?? []) {
        results.push(checkFile(commandDir, entry));
      }

      const passed = results.filter((r) => r.status === 'pass').length;
      const failed = results.filter((r) => r.status !== 'pass').length;
      const total = results.length;

      const verifyResults: VerifyResults = { passed, failed, total, results };

      outputSuccess(verifyResults, opts, formatResults);

      if (failed > 0) {
        process.exit(1);
      }

      process.exit(0);
    });
}
