import { Command } from 'commander';
import { registerStatusCommand } from './commands/status.js';
import { registerGetStateCommand } from './commands/get-state.js';
import { registerGetPhaseCommand } from './commands/get-phase.js';

const program = new Command()
  .name('stclaude')
  .description('SpacetimeClaude - structured project state for Claude Code agents')
  .version('0.0.1')
  .option('--json', 'Output machine-readable JSON envelope', false);

registerStatusCommand(program);
registerGetStateCommand(program);
registerGetPhaseCommand(program);

program.parseAsync();
