import { Command } from 'commander';
import { registerStatusCommand } from './commands/status.js';
import { registerGetStateCommand } from './commands/get-state.js';
import { registerGetPhaseCommand } from './commands/get-phase.js';
import { registerReadPlanCommand } from './commands/read-plan.js';
import { registerRoadmapCommand } from './commands/roadmap.js';
import { registerAdvancePlanCommand } from './commands/advance-plan.js';
import { registerUpdateProgressCommand } from './commands/update-progress.js';
import { registerRecordMetricCommand } from './commands/record-metric.js';
import { registerWriteSummaryCommand } from './commands/write-summary.js';
import { registerWriteVerificationCommand } from './commands/write-verification.js';
import { registerWriteResearchCommand } from './commands/write-research.js';
import { registerInitCommand } from './commands/init.js';
import { registerSeedCommand } from './commands/seed.js';
import { registerWritePlanCommand } from './commands/write-plan.js';
import { registerWriteContextCommand } from './commands/write-context.js';
import { registerCompletePhaseCommand } from './commands/complete-phase.js';
import { registerMarkRequirementCommand } from './commands/mark-requirement.js';
import { registerSetupCommand } from './commands/setup.js';

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
registerWriteSummaryCommand(program);
registerWriteVerificationCommand(program);
registerWriteResearchCommand(program);
registerInitCommand(program);
registerSeedCommand(program);
registerWritePlanCommand(program);
registerWriteContextCommand(program);
registerCompletePhaseCommand(program);
registerMarkRequirementCommand(program);
registerSetupCommand(program);

program.parseAsync();
