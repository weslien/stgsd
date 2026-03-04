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
    { name: 'phase_project_id', accessor: 'phase_project_id', algorithm: 'btree', columns: ['project_id'] },
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
  is_inserted: t.bool(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const plan = table({
  name: 'plan',
  public: true,
  indexes: [
    { name: 'plan_phase_id', accessor: 'plan_phase_id', algorithm: 'btree', columns: ['phase_id'] },
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
    { name: 'plan_task_plan_id', accessor: 'plan_task_plan_id', algorithm: 'btree', columns: ['plan_id'] },
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
    { name: 'requirement_project_id', accessor: 'requirement_project_id', algorithm: 'btree', columns: ['project_id'] },
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
    { name: 'project_state_project_id', accessor: 'project_state_project_id', algorithm: 'btree', columns: ['project_id'] },
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
    { name: 'continue_here_project_id', accessor: 'continue_here_project_id', algorithm: 'btree', columns: ['project_id'] },
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
    { name: 'plan_summary_plan_id', accessor: 'plan_summary_plan_id', algorithm: 'btree', columns: ['plan_id'] },
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
    { name: 'verification_phase_id', accessor: 'verification_phase_id', algorithm: 'btree', columns: ['phase_id'] },
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
    { name: 'research_phase_id', accessor: 'research_phase_id', algorithm: 'btree', columns: ['phase_id'] },
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
    { name: 'phase_context_phase_id', accessor: 'phase_context_phase_id', algorithm: 'btree', columns: ['phase_id'] },
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
    { name: 'config_project_id', accessor: 'config_project_id', algorithm: 'btree', columns: ['project_id'] },
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
    { name: 'must_have_plan_id', accessor: 'must_have_plan_id', algorithm: 'btree', columns: ['plan_id'] },
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

const milestone = table({
  name: 'milestone',
  public: true,
  indexes: [
    { name: 'milestone_project_id', accessor: 'milestone_project_id', algorithm: 'btree', columns: ['project_id'] },
    { name: 'milestone_status', accessor: 'milestone_status', algorithm: 'btree', columns: ['status'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  version: t.string(),
  name: t.string(),
  shipped_date: t.string(),
  phase_count: t.u64(),
  plan_count: t.u64(),
  requirement_count: t.u64(),
  accomplishments: t.string(),
  status: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const milestoneAudit = table({
  name: 'milestone_audit',
  public: true,
  indexes: [
    { name: 'milestone_audit_project_id', accessor: 'milestone_audit_project_id', algorithm: 'btree', columns: ['project_id'] },
    { name: 'milestone_audit_milestone_id', accessor: 'milestone_audit_milestone_id', algorithm: 'btree', columns: ['milestone_id'] },
    { name: 'milestone_audit_status', accessor: 'milestone_audit_status', algorithm: 'btree', columns: ['audit_status'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  milestone_id: t.u64(),
  audit_status: t.string(),
  requirement_scores: t.string(),
  integration_scores: t.string(),
  flow_scores: t.string(),
  tech_debt_items: t.string(),
  roadmap_content: t.string(),
  requirements_content: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const sessionCheckpoint = table({
  name: 'session_checkpoint',
  public: true,
  indexes: [
    { name: 'session_checkpoint_project_id', accessor: 'session_checkpoint_project_id', algorithm: 'btree', columns: ['project_id'] },
    { name: 'session_checkpoint_phase_id', accessor: 'session_checkpoint_phase_id', algorithm: 'btree', columns: ['phase_id'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  phase_id: t.u64(),
  phase_context: t.string(),
  completed_work: t.string(),
  remaining_work: t.string(),
  decisions: t.string(),
  blockers: t.string(),
  next_action: t.string(),
  mental_context: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const todo = table({
  name: 'todo',
  public: true,
  indexes: [
    { name: 'todo_project_id', accessor: 'todo_project_id', algorithm: 'btree', columns: ['project_id'] },
    { name: 'todo_status', accessor: 'todo_status', algorithm: 'btree', columns: ['status'] },
    { name: 'todo_area', accessor: 'todo_area', algorithm: 'btree', columns: ['area'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  title: t.string(),
  area: t.string(),
  problem: t.string(),
  solution_hints: t.string(),
  file_refs: t.string(),
  status: t.string(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const debugSession = table({
  name: 'debug_session',
  public: true,
  indexes: [
    { name: 'debug_session_project_id', accessor: 'debug_session_project_id', algorithm: 'btree', columns: ['project_id'] },
    { name: 'debug_session_status', accessor: 'debug_session_status', algorithm: 'btree', columns: ['status'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  bug_description: t.string(),
  hypotheses: t.string(),
  checkpoints: t.string(),
  timeline: t.string(),
  status: t.string(),
  resolution_notes: t.string().optional(),
  created_at: t.timestamp(),
  updated_at: t.timestamp(),
});

const codebases = table({
  name: 'codebase_map',
  public: true,
  indexes: [
    { name: 'codebase_map_project_id', accessor: 'codebase_map_project_id', algorithm: 'btree', columns: ['project_id'] },
    { name: 'codebase_map_doc_type', accessor: 'codebase_map_doc_type', algorithm: 'btree', columns: ['doc_type'] },
  ],
}, {
  id: t.u64().primaryKey().autoInc(),
  project_id: t.u64(),
  doc_type: t.string(),
  content: t.string(),
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
  milestone,
  milestoneAudit,
  sessionCheckpoint,
  todo,
  debugSession,
  codebases,
});

export default spacetimedb;
