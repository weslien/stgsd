import { Command } from 'commander';
import { registerStatusCommand } from './commands/status.js';
import { registerGetStateCommand } from './commands/get-state.js';
import { registerGetPhaseCommand } from './commands/get-phase.js';
import { registerReadPlanCommand } from './commands/read-plan.js';
import { registerRoadmapCommand } from './commands/roadmap.js';
import { registerAdvancePlanCommand } from './commands/advance-plan.js';
import { registerUpdateProgressCommand } from './commands/update-progress.js';
import { registerRecordMetricCommand } from './commands/record-metric.js';

const program = new Command()
  .name('stclaude')
  .description('SpacetimeClaude - structured project state for Claude Code agents')
  .version('0.0.1')
  .option('--json', 'Output machine-readable JSON envelope', false);

registerStatusCommand(program);
registerGetStateCommand(program);
registerGetPhaseCommand(program);
registerReadPlanCommand(program);
registerRoadmapCommand(program);
registerAdvancePlanCommand(program);
registerUpdateProgressCommand(program);
registerRecordMetricCommand(program);

program.parseAsync();
