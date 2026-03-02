import spacetimedb from './schema';
import { t, SenderError } from 'spacetimedb/server';

// --- Lifecycle Hooks ---

export const init = spacetimedb.init(_ctx => {
  // Called when the module is initially published
});

export const onConnect = spacetimedb.clientConnected(_ctx => {
  // Called every time a new client connects
});

export const onDisconnect = spacetimedb.clientDisconnected(_ctx => {
  // Called every time a client disconnects
});

// --- Project Reducers (SCHM-01) ---

export const insert_project = spacetimedb.reducer(
  {
    git_remote_url: t.string(),
    name: t.string(),
    description: t.string(),
    core_value: t.string(),
    constraints: t.string(),
    context: t.string(),
    key_decisions: t.string(),
  },
  (ctx, args) => {
    ctx.db.project.insert({
      id: 0n,
      ...args,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_project = spacetimedb.reducer(
  {
    project_id: t.u64(),
    name: t.string(),
    description: t.string(),
    core_value: t.string(),
    constraints: t.string(),
    context: t.string(),
    key_decisions: t.string(),
  },
  (ctx, { project_id, ...fields }) => {
    const existing = ctx.db.project.id.find(project_id);
    if (!existing) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.project.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_project = spacetimedb.reducer(
  { project_id: t.u64() },
  (ctx, { project_id }) => {
    const existing = ctx.db.project.id.find(project_id);
    if (!existing) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.project.id.delete(project_id);
  }
);

// --- Phase Reducers (SCHM-02) ---

export const insert_phase = spacetimedb.reducer(
  {
    project_id: t.u64(),
    number: t.string(),
    name: t.string(),
    slug: t.string(),
    goal: t.string(),
    status: t.string(),
    depends_on: t.string(),
    success_criteria: t.string(),
  },
  (ctx, { project_id, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.phase.insert({
      id: 0n,
      project_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_phase = spacetimedb.reducer(
  {
    phase_id: t.u64(),
    number: t.string(),
    name: t.string(),
    slug: t.string(),
    goal: t.string(),
    status: t.string(),
    depends_on: t.string(),
    success_criteria: t.string(),
  },
  (ctx, { phase_id, ...fields }) => {
    const existing = ctx.db.phase.id.find(phase_id);
    if (!existing) throw new SenderError(`Phase ${phase_id} not found`);
    ctx.db.phase.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_phase = spacetimedb.reducer(
  { phase_id: t.u64() },
  (ctx, { phase_id }) => {
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);

    // CASCADE DELETE: collect all children into arrays first, then delete
    // (never delete while iterating)

    // 1. Delete all plans and their children
    const plans = [...ctx.db.plan.plan_phase_id.filter(phase_id)];
    for (const plan of plans) {
      const tasks = [...ctx.db.planTask.plan_task_plan_id.filter(plan.id)];
      for (const task of tasks) {
        ctx.db.planTask.id.delete(task.id);
      }

      const summaries = [...ctx.db.planSummary.plan_summary_plan_id.filter(plan.id)];
      for (const summary of summaries) {
        ctx.db.planSummary.id.delete(summary.id);
      }

      const mustHaves = [...ctx.db.mustHave.must_have_plan_id.filter(plan.id)];
      for (const mustHave of mustHaves) {
        ctx.db.mustHave.id.delete(mustHave.id);
      }

      ctx.db.plan.id.delete(plan.id);
    }

    // 2. Delete verification records for this phase
    const verifications = [...ctx.db.verification.verification_phase_id.filter(phase_id)];
    for (const v of verifications) {
      ctx.db.verification.id.delete(v.id);
    }

    // 3. Delete research records for this phase
    const researchRecords = [...ctx.db.research.research_phase_id.filter(phase_id)];
    for (const r of researchRecords) {
      ctx.db.research.id.delete(r.id);
    }

    // 4. Delete phase context records for this phase
    const phaseContexts = [...ctx.db.phaseContext.phase_context_phase_id.filter(phase_id)];
    for (const pc of phaseContexts) {
      ctx.db.phaseContext.id.delete(pc.id);
    }

    // 5. Delete requirements that belong to this phase's project and match phase number
    const requirements = [...ctx.db.requirement.requirement_project_id.filter(phase.project_id)];
    for (const req of requirements) {
      if (req.phase_number === phase.number) {
        ctx.db.requirement.id.delete(req.id);
      }
    }

    // 6. Delete the phase itself
    ctx.db.phase.id.delete(phase_id);
  }
);

// --- Plan Reducers (SCHM-03) ---

export const insert_plan = spacetimedb.reducer(
  {
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
  },
  (ctx, { phase_id, ...fields }) => {
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);
    ctx.db.plan.insert({
      id: 0n,
      phase_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_plan = spacetimedb.reducer(
  {
    plan_id: t.u64(),
    plan_number: t.u64(),
    type: t.string(),
    wave: t.u64(),
    depends_on: t.string(),
    objective: t.string(),
    autonomous: t.bool(),
    requirements: t.string(),
    status: t.string(),
    content: t.string(),
  },
  (ctx, { plan_id, ...fields }) => {
    const existing = ctx.db.plan.id.find(plan_id);
    if (!existing) throw new SenderError(`Plan ${plan_id} not found`);
    ctx.db.plan.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_plan = spacetimedb.reducer(
  { plan_id: t.u64() },
  (ctx, { plan_id }) => {
    const existing = ctx.db.plan.id.find(plan_id);
    if (!existing) throw new SenderError(`Plan ${plan_id} not found`);

    // Delete plan's children first
    const tasks = [...ctx.db.planTask.plan_task_plan_id.filter(plan_id)];
    for (const task of tasks) {
      ctx.db.planTask.id.delete(task.id);
    }

    const summaries = [...ctx.db.planSummary.plan_summary_plan_id.filter(plan_id)];
    for (const summary of summaries) {
      ctx.db.planSummary.id.delete(summary.id);
    }

    const mustHaves = [...ctx.db.mustHave.must_have_plan_id.filter(plan_id)];
    for (const mustHave of mustHaves) {
      ctx.db.mustHave.id.delete(mustHave.id);
    }

    ctx.db.plan.id.delete(plan_id);
  }
);

// --- PlanTask Reducers (SCHM-04) ---

export const insert_plan_task = spacetimedb.reducer(
  {
    plan_id: t.u64(),
    task_number: t.u64(),
    type: t.string(),
    description: t.string(),
    status: t.string(),
    commit_hash: t.string(),
  },
  (ctx, { plan_id, commit_hash, ...fields }) => {
    const plan = ctx.db.plan.id.find(plan_id);
    if (!plan) throw new SenderError(`Plan ${plan_id} not found`);
    ctx.db.planTask.insert({
      id: 0n,
      plan_id,
      ...fields,
      commit_hash: commit_hash || undefined,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_plan_task = spacetimedb.reducer(
  {
    task_id: t.u64(),
    task_number: t.u64(),
    type: t.string(),
    description: t.string(),
    status: t.string(),
    commit_hash: t.string(),
  },
  (ctx, { task_id, commit_hash, ...fields }) => {
    const existing = ctx.db.planTask.id.find(task_id);
    if (!existing) throw new SenderError(`PlanTask ${task_id} not found`);
    ctx.db.planTask.id.update({
      ...existing,
      ...fields,
      commit_hash: commit_hash || undefined,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_plan_task = spacetimedb.reducer(
  { task_id: t.u64() },
  (ctx, { task_id }) => {
    const existing = ctx.db.planTask.id.find(task_id);
    if (!existing) throw new SenderError(`PlanTask ${task_id} not found`);
    ctx.db.planTask.id.delete(task_id);
  }
);

// --- Requirement Reducers (SCHM-05) ---

export const insert_requirement = spacetimedb.reducer(
  {
    project_id: t.u64(),
    category: t.string(),
    number: t.string(),
    description: t.string(),
    status: t.string(),
    phase_number: t.string(),
    milestone_version: t.string(),
  },
  (ctx, { project_id, milestone_version, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.requirement.insert({
      id: 0n,
      project_id,
      ...fields,
      milestone_version: milestone_version || undefined,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_requirement = spacetimedb.reducer(
  {
    requirement_id: t.u64(),
    category: t.string(),
    number: t.string(),
    description: t.string(),
    status: t.string(),
    phase_number: t.string(),
    milestone_version: t.string(),
  },
  (ctx, { requirement_id, milestone_version, ...fields }) => {
    const existing = ctx.db.requirement.id.find(requirement_id);
    if (!existing) throw new SenderError(`Requirement ${requirement_id} not found`);
    ctx.db.requirement.id.update({
      ...existing,
      ...fields,
      milestone_version: milestone_version || undefined,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_requirement = spacetimedb.reducer(
  { requirement_id: t.u64() },
  (ctx, { requirement_id }) => {
    const existing = ctx.db.requirement.id.find(requirement_id);
    if (!existing) throw new SenderError(`Requirement ${requirement_id} not found`);
    ctx.db.requirement.id.delete(requirement_id);
  }
);
