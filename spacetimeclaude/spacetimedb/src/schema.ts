import { schema, table, t } from 'spacetimedb/server';

// --- Core Entity Tables ---

const project = table({
  name: 'project',
  public: true,
}, {
  id: t.u64().primaryKey().autoInc(),
  git_remote_url: t.string().unique(),
  name: t.string(),
  description: t.string(),
  core_value: t.string(),
  constraints: t.string(),
  context: t.string(),
  key_decisions: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const phase = table({
  name: 'phase',
  public: true,
  indexes: [
    { name: 'phase_project_id', algorithm: 'btree', columns: ['project_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  number: t.string(),
  name: t.string(),
  slug: t.string(),
  goal: t.string(),
  status: t.string(),
  depends_on: t.string(),
  success_criteria: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const plan = table({
  name: 'plan',
  public: true,
  indexes: [
    { name: 'plan_phase_id', algorithm: 'btree', columns: ['phase_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  phase_id: t.u64(),
  plan_number: t.u64(),
  type: t.string(),
  wave: t.u64(),
  depends_on: t.string(),
  objective: t.string(),
  autonomous: t.bool(),
  requirements: t.string(),
  status: t.string(),
  content: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const planTask = table({
  name: 'plan_task',
  public: true,
  indexes: [
    { name: 'plan_task_plan_id', algorithm: 'btree', columns: ['plan_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  plan_id: t.u64(),
  task_number: t.u64(),
  type: t.string(),
  description: t.string(),
  status: t.string(),
  commit_hash: t.string().optional(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const requirement = table({
  name: 'requirement',
  public: true,
  indexes: [
    { name: 'requirement_project_id', algorithm: 'btree', columns: ['project_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  category: t.string(),
  number: t.string(),
  description: t.string(),
  status: t.string(),
  phase_number: t.string(),
  milestone_version: t.string().optional(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

// --- Supporting Tables ---

const projectState = table({
  name: 'project_state',
  public: true,
  indexes: [
    { name: 'project_state_project_id', algorithm: 'btree', columns: ['project_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  current_phase: t.string(),
  current_plan: t.u64(),
  current_task: t.u64(),
  last_activity: t.timestamp(),
  last_activity_description: t.string(),
  velocity_data: t.string(),
  session_last: t.string(),
  session_stopped_at: t.string(),
  session_resume_file: t.string().optional(),
  updated_at: t.timestamp(),
});

const continueHere = table({
  name: 'continue_here',
  public: true,
  indexes: [
    { name: 'continue_here_project_id', algorithm: 'btree', columns: ['project_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  phase_id: t.u64(),
  task_number: t.u64(),
  current_state: t.string(),
  next_action: t.string(),
  context: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const planSummary = table({
  name: 'plan_summary',
  public: true,
  indexes: [
    { name: 'plan_summary_plan_id', algorithm: 'btree', columns: ['plan_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  plan_id: t.u64(),
  subsystem: t.string(),
  tags: t.string(),
  headline: t.string(),
  accomplishments: t.string(),
  deviations: t.string(),
  files: t.string(),
  decisions: t.string(),
  dependency_graph: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const verification = table({
  name: 'verification',
  public: true,
  indexes: [
    { name: 'verification_phase_id', algorithm: 'btree', columns: ['phase_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  phase_id: t.u64(),
  status: t.string(),
  score: t.u64(),
  content: t.string(),
  recommended_fixes: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const research = table({
  name: 'research',
  public: true,
  indexes: [
    { name: 'research_phase_id', algorithm: 'btree', columns: ['phase_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  phase_id: t.u64(),
  domain: t.string(),
  confidence: t.string(),
  content: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const phaseContext = table({
  name: 'phase_context',
  public: true,
  indexes: [
    { name: 'phase_context_phase_id', algorithm: 'btree', columns: ['phase_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  phase_id: t.u64(),
  content: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const config = table({
  name: 'config',
  public: true,
  indexes: [
    { name: 'config_project_id', algorithm: 'btree', columns: ['project_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  config: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const mustHave = table({
  name: 'must_have',
  public: true,
  indexes: [
    { name: 'must_have_plan_id', algorithm: 'btree', columns: ['plan_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  plan_id: t.u64(),
  truths: t.string(),
  artifacts: t.string(),
  key_links: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

// --- Schema Export ---

const spacetimedb = schema({
  project,
  phase,
  plan,
  planTask,
  requirement,
  projectState,
  continueHere,
  planSummary,
  verification,
  research,
  phaseContext,
  config,
  mustHave,
});

export default spacetimedb;
