import { Command } from 'commander';

export const program = new Command()
  .name('stclaude')
  .description('SpacetimeClaude - structured project state for Claude Code agents')
  .version('0.0.1')
  .option('--json', 'Output machine-readable JSON envelope', false);

// Subcommands will be registered here by future plans.
// The default action (bare `stclaude`) is added in Plan 02-02.
