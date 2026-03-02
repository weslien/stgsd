import { Command } from 'commander';
import { registerStatusCommand } from './commands/status.js';

const program = new Command()
  .name('stclaude')
  .description('SpacetimeClaude - structured project state for Claude Code agents')
  .version('0.0.1')
  .option('--json', 'Output machine-readable JSON envelope', false);

registerStatusCommand(program);

program.parseAsync();
