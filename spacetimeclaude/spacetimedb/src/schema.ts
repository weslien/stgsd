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

// --- Schema Export (temporary, will be expanded in Task 2) ---

const spacetimedb = schema({
  project,
  phase,
  plan,
  planTask,
  requirement,
});

export default spacetimedb;
