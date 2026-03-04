import { createHash } from 'node:crypto';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { CliError, ErrorCodes } from './errors.js';

export interface RepoConfig {
  uri: string;
  database: string;
  gitRemoteUrl: string;
  createdAt: string;
}

const STCLAUDE_DIR = join(homedir(), '.claude', 'stclaude');
const PROJECTS_DIR = join(STCLAUDE_DIR, 'projects');
const MODULE_DIR = join(STCLAUDE_DIR, 'module');

/**
 * Normalize a git remote URL for consistent hashing.
 * Strips trailing `.git`, lowercases, removes trailing slashes.
 */
function normalizeUrl(url: string): string {
  return url.trim().toLowerCase().replace(/\.git$/, '').replace(/\/+$/, '');
}

/**
 * Compute a repo ID from a git remote URL.
 * First 12 hex chars of SHA-256 of normalized URL.
 */
export function computeRepoId(gitRemoteUrl: string): string {
  const normalized = normalizeUrl(gitRemoteUrl);
  return createHash('sha256').update(normalized).digest('hex').slice(0, 12);
}

/**
 * Path to the config file for a given repo ID.
 */
function configPath(repoId: string): string {
  return join(PROJECTS_DIR, repoId, 'config.json');
}

/**
 * Generate a database name from a repo ID.
 */
export function databaseName(repoId: string): string {
  return `stclaude-${repoId}`;
}

/**
 * Load config for a repo ID. Returns null if not found.
 */
export function loadConfig(repoId: string): RepoConfig | null {
  const path = configPath(repoId);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

/**
 * Require config for a git remote URL.
 * Fails instantly (filesystem check only, no network) with NOT_CONFIGURED if missing.
 */
export function requireConfig(gitRemoteUrl: string): RepoConfig {
  const repoId = computeRepoId(gitRemoteUrl);
  const config = loadConfig(repoId);
  if (!config) {
    throw new CliError(
      ErrorCodes.NOT_CONFIGURED,
      `stclaude not configured for this repo. Run: stclaude setup`,
    );
  }
  return config;
}

/**
 * Write config for a repo.
 */
export function writeConfig(config: RepoConfig): void {
  const repoId = computeRepoId(config.gitRemoteUrl);
  const dir = join(PROJECTS_DIR, repoId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(configPath(repoId), JSON.stringify(config, null, 2) + '\n');
}

/**
 * Path to the stclaude module source directory.
 */
export function modulePath(): string {
  return MODULE_DIR;
}

/**
 * Check if the module source has been installed.
 */
export function moduleExists(): boolean {
  return existsSync(join(MODULE_DIR, 'src', 'index.ts'));
}
