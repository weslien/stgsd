import spacetimedb from './schema';
import { t, SenderError } from 'spacetimedb/server';

// Re-export schema as default so the bundler finds it in the entrypoint
export default spacetimedb;

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

    // 1. Delete all phases (each cascade deletes plans, tasks, summaries, etc.)
    const phases = [...ctx.db.phase.phase_project_id.filter(project_id)];
    for (const ph of phases) {
      // Inline the phase cascade: plans and their children
      const plans = [...ctx.db.plan.plan_phase_id.filter(ph.id)];
      for (const pl of plans) {
        const tasks = [...ctx.db.planTask.plan_task_plan_id.filter(pl.id)];
        for (const task of tasks) { ctx.db.planTask.id.delete(task.id); }
        const summaries = [...ctx.db.planSummary.plan_summary_plan_id.filter(pl.id)];
        for (const summary of summaries) { ctx.db.planSummary.id.delete(summary.id); }
        const mustHaves = [...ctx.db.mustHave.must_have_plan_id.filter(pl.id)];
        for (const mh of mustHaves) { ctx.db.mustHave.id.delete(mh.id); }
        ctx.db.plan.id.delete(pl.id);
      }
      const verifications = [...ctx.db.verification.verification_phase_id.filter(ph.id)];
      for (const v of verifications) { ctx.db.verification.id.delete(v.id); }
      const researchRecords = [...ctx.db.research.research_phase_id.filter(ph.id)];
      for (const r of researchRecords) { ctx.db.research.id.delete(r.id); }
      const phaseContexts = [...ctx.db.phaseContext.phase_context_phase_id.filter(ph.id)];
      for (const pc of phaseContexts) { ctx.db.phaseContext.id.delete(pc.id); }
      const sessionCheckpoints = [...ctx.db.sessionCheckpoint.session_checkpoint_phase_id.filter(ph.id)];
      for (const sc of sessionCheckpoints) { ctx.db.sessionCheckpoint.id.delete(sc.id); }
      ctx.db.phase.id.delete(ph.id);
    }

    // 2. Delete requirements
    const requirements = [...ctx.db.requirement.requirement_project_id.filter(project_id)];
    for (const req of requirements) { ctx.db.requirement.id.delete(req.id); }

    // 3. Delete milestones and their audits
    const milestones = [...ctx.db.milestone.milestone_project_id.filter(project_id)];
    for (const m of milestones) {
      const audits = [...ctx.db.milestoneAudit.milestone_audit_milestone_id.filter(m.id)];
      for (const a of audits) { ctx.db.milestoneAudit.id.delete(a.id); }
      ctx.db.milestone.id.delete(m.id);
    }

    // 4. Delete todos
    const todos = [...ctx.db.todo.todo_project_id.filter(project_id)];
    for (const td of todos) { ctx.db.todo.id.delete(td.id); }

    // 5. Delete debug sessions
    const debugSessions = [...ctx.db.debugSession.debug_session_project_id.filter(project_id)];
    for (const ds of debugSessions) { ctx.db.debugSession.id.delete(ds.id); }

    // 6. Delete codebase maps
    const codebaseMaps = [...ctx.db.codebases.codebase_map_project_id.filter(project_id)];
    for (const cm of codebaseMaps) { ctx.db.codebases.id.delete(cm.id); }

    // 7. Delete project state
    const states = [...ctx.db.projectState.project_state_project_id.filter(project_id)];
    for (const s of states) { ctx.db.projectState.id.delete(s.id); }

    // 8. Delete continue_here
    const continueHeres = [...ctx.db.continueHere.continue_here_project_id.filter(project_id)];
    for (const ch of continueHeres) { ctx.db.continueHere.id.delete(ch.id); }

    // 9. Delete config
    const configs = [...ctx.db.config.config_project_id.filter(project_id)];
    for (const cfg of configs) { ctx.db.config.id.delete(cfg.id); }

    // 10. Delete the project itself
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
    is_inserted: t.bool(),
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
    is_inserted: t.bool(),
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

    // 5. Delete session_checkpoint records for this phase
    const sessionCheckpoints = [...ctx.db.sessionCheckpoint.session_checkpoint_phase_id.filter(phase_id)];
    for (const sc of sessionCheckpoints) {
      ctx.db.sessionCheckpoint.id.delete(sc.id);
    }

    // 6. Delete requirements that belong to this phase's project and match phase number
    const requirements = [...ctx.db.requirement.requirement_project_id.filter(phase.project_id)];
    for (const req of requirements) {
      if (req.phase_number === phase.number) {
        ctx.db.requirement.id.delete(req.id);
      }
    }

    // 7. Delete the phase itself
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

// --- ProjectState Reducers (SCHM-06) ---

export const upsert_project_state = spacetimedb.reducer(
  {
    project_id: t.u64(),
    current_phase: t.string(),
    current_plan: t.u64(),
    current_task: t.u64(),
    last_activity_description: t.string(),
    velocity_data: t.string(),
    session_last: t.string(),
    session_stopped_at: t.string(),
    session_resume_file: t.string(),
  },
  (ctx, { project_id, session_resume_file, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);

    const existing = [...ctx.db.projectState.project_state_project_id.filter(project_id)][0];
    if (existing) {
      ctx.db.projectState.id.update({
        ...existing,
        ...fields,
        session_resume_file: session_resume_file || undefined,
        last_activity: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    } else {
      ctx.db.projectState.insert({
        id: 0n,
        project_id,
        ...fields,
        session_resume_file: session_resume_file || undefined,
        last_activity: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    }
  }
);

export const delete_project_state = spacetimedb.reducer(
  { state_id: t.u64() },
  (ctx, { state_id }) => {
    const existing = ctx.db.projectState.id.find(state_id);
    if (!existing) throw new SenderError(`ProjectState ${state_id} not found`);
    ctx.db.projectState.id.delete(state_id);
  }
);

// --- ContinueHere Reducers (SCHM-07) ---

export const upsert_continue_here = spacetimedb.reducer(
  {
    project_id: t.u64(),
    phase_id: t.u64(),
    task_number: t.u64(),
    current_state: t.string(),
    next_action: t.string(),
    context: t.string(),
  },
  (ctx, { project_id, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    const phase = ctx.db.phase.id.find(fields.phase_id);
    if (!phase) throw new SenderError(`Phase ${fields.phase_id} not found`);

    const existing = [...ctx.db.continueHere.continue_here_project_id.filter(project_id)][0];
    if (existing) {
      ctx.db.continueHere.id.update({
        ...existing,
        ...fields,
        updated_at: ctx.timestamp,
      });
    } else {
      ctx.db.continueHere.insert({
        id: 0n,
        project_id,
        ...fields,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    }
  }
);

export const delete_continue_here = spacetimedb.reducer(
  { continue_here_id: t.u64() },
  (ctx, { continue_here_id }) => {
    const existing = ctx.db.continueHere.id.find(continue_here_id);
    if (!existing) throw new SenderError(`ContinueHere ${continue_here_id} not found`);
    ctx.db.continueHere.id.delete(continue_here_id);
  }
);

// --- PlanSummary Reducers (SCHM-08) ---

export const insert_plan_summary = spacetimedb.reducer(
  {
    plan_id: t.u64(),
    subsystem: t.string(),
    tags: t.string(),
    headline: t.string(),
    accomplishments: t.string(),
    deviations: t.string(),
    files: t.string(),
    decisions: t.string(),
    dependency_graph: t.string(),
  },
  (ctx, { plan_id, ...fields }) => {
    const plan = ctx.db.plan.id.find(plan_id);
    if (!plan) throw new SenderError(`Plan ${plan_id} not found`);
    ctx.db.planSummary.insert({
      id: 0n,
      plan_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_plan_summary = spacetimedb.reducer(
  {
    summary_id: t.u64(),
    subsystem: t.string(),
    tags: t.string(),
    headline: t.string(),
    accomplishments: t.string(),
    deviations: t.string(),
    files: t.string(),
    decisions: t.string(),
    dependency_graph: t.string(),
  },
  (ctx, { summary_id, ...fields }) => {
    const existing = ctx.db.planSummary.id.find(summary_id);
    if (!existing) throw new SenderError(`PlanSummary ${summary_id} not found`);
    ctx.db.planSummary.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_plan_summary = spacetimedb.reducer(
  { summary_id: t.u64() },
  (ctx, { summary_id }) => {
    const existing = ctx.db.planSummary.id.find(summary_id);
    if (!existing) throw new SenderError(`PlanSummary ${summary_id} not found`);
    ctx.db.planSummary.id.delete(summary_id);
  }
);

// --- Verification Reducers (SCHM-09) ---

export const insert_verification = spacetimedb.reducer(
  {
    phase_id: t.u64(),
    status: t.string(),
    score: t.u64(),
    content: t.string(),
    recommended_fixes: t.string(),
  },
  (ctx, { phase_id, ...fields }) => {
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);
    ctx.db.verification.insert({
      id: 0n,
      phase_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_verification = spacetimedb.reducer(
  {
    verification_id: t.u64(),
    status: t.string(),
    score: t.u64(),
    content: t.string(),
    recommended_fixes: t.string(),
  },
  (ctx, { verification_id, ...fields }) => {
    const existing = ctx.db.verification.id.find(verification_id);
    if (!existing) throw new SenderError(`Verification ${verification_id} not found`);
    ctx.db.verification.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_verification = spacetimedb.reducer(
  { verification_id: t.u64() },
  (ctx, { verification_id }) => {
    const existing = ctx.db.verification.id.find(verification_id);
    if (!existing) throw new SenderError(`Verification ${verification_id} not found`);
    ctx.db.verification.id.delete(verification_id);
  }
);

// --- Research Reducers (SCHM-10) ---

export const insert_research = spacetimedb.reducer(
  {
    phase_id: t.u64(),
    domain: t.string(),
    confidence: t.string(),
    content: t.string(),
  },
  (ctx, { phase_id, ...fields }) => {
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);
    ctx.db.research.insert({
      id: 0n,
      phase_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_research = spacetimedb.reducer(
  {
    research_id: t.u64(),
    domain: t.string(),
    confidence: t.string(),
    content: t.string(),
  },
  (ctx, { research_id, ...fields }) => {
    const existing = ctx.db.research.id.find(research_id);
    if (!existing) throw new SenderError(`Research ${research_id} not found`);
    ctx.db.research.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_research = spacetimedb.reducer(
  { research_id: t.u64() },
  (ctx, { research_id }) => {
    const existing = ctx.db.research.id.find(research_id);
    if (!existing) throw new SenderError(`Research ${research_id} not found`);
    ctx.db.research.id.delete(research_id);
  }
);

// --- PhaseContext Reducers (SCHM-11) ---

export const insert_phase_context = spacetimedb.reducer(
  {
    phase_id: t.u64(),
    content: t.string(),
  },
  (ctx, { phase_id, ...fields }) => {
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);
    ctx.db.phaseContext.insert({
      id: 0n,
      phase_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_phase_context = spacetimedb.reducer(
  {
    phase_context_id: t.u64(),
    content: t.string(),
  },
  (ctx, { phase_context_id, ...fields }) => {
    const existing = ctx.db.phaseContext.id.find(phase_context_id);
    if (!existing) throw new SenderError(`PhaseContext ${phase_context_id} not found`);
    ctx.db.phaseContext.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_phase_context = spacetimedb.reducer(
  { phase_context_id: t.u64() },
  (ctx, { phase_context_id }) => {
    const existing = ctx.db.phaseContext.id.find(phase_context_id);
    if (!existing) throw new SenderError(`PhaseContext ${phase_context_id} not found`);
    ctx.db.phaseContext.id.delete(phase_context_id);
  }
);

// --- Config Reducers (SCHM-12) ---

export const upsert_config = spacetimedb.reducer(
  {
    project_id: t.u64(),
    config: t.string(),
  },
  (ctx, { project_id, config }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);

    const existing = [...ctx.db.config.config_project_id.filter(project_id)][0];
    if (existing) {
      ctx.db.config.id.update({
        ...existing,
        config,
        updated_at: ctx.timestamp,
      });
    } else {
      ctx.db.config.insert({
        id: 0n,
        project_id,
        config,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    }
  }
);

export const delete_config = spacetimedb.reducer(
  { config_id: t.u64() },
  (ctx, { config_id }) => {
    const existing = ctx.db.config.id.find(config_id);
    if (!existing) throw new SenderError(`Config ${config_id} not found`);
    ctx.db.config.id.delete(config_id);
  }
);

// --- MustHave Reducers (SCHM-13) ---

export const insert_must_have = spacetimedb.reducer(
  {
    plan_id: t.u64(),
    truths: t.string(),
    artifacts: t.string(),
    key_links: t.string(),
  },
  (ctx, { plan_id, ...fields }) => {
    const plan = ctx.db.plan.id.find(plan_id);
    if (!plan) throw new SenderError(`Plan ${plan_id} not found`);
    ctx.db.mustHave.insert({
      id: 0n,
      plan_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_must_have = spacetimedb.reducer(
  {
    must_have_id: t.u64(),
    truths: t.string(),
    artifacts: t.string(),
    key_links: t.string(),
  },
  (ctx, { must_have_id, ...fields }) => {
    const existing = ctx.db.mustHave.id.find(must_have_id);
    if (!existing) throw new SenderError(`MustHave ${must_have_id} not found`);
    ctx.db.mustHave.id.update({
      ...existing,
      ...fields,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_must_have = spacetimedb.reducer(
  { must_have_id: t.u64() },
  (ctx, { must_have_id }) => {
    const existing = ctx.db.mustHave.id.find(must_have_id);
    if (!existing) throw new SenderError(`MustHave ${must_have_id} not found`);
    ctx.db.mustHave.id.delete(must_have_id);
  }
);

// --- Milestone Reducers (MILE-01) ---

export const insert_milestone = spacetimedb.reducer(
  {
    project_id: t.u64(),
    version: t.string(),
    name: t.string(),
    shipped_date: t.string(),
    phase_count: t.u64(),
    plan_count: t.u64(),
    requirement_count: t.u64(),
    accomplishments: t.string(),
    status: t.string(),
  },
  (ctx, { project_id, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.milestone.insert({
      id: 0n,
      project_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_milestone = spacetimedb.reducer(
  {
    milestone_id: t.u64(),
    version: t.string(),
    name: t.string(),
    shipped_date: t.string(),
    phase_count: t.u64(),
    plan_count: t.u64(),
    requirement_count: t.u64(),
    accomplishments: t.string(),
    status: t.string(),
  },
  (ctx, { milestone_id, ...fields }) => {
    const existing = ctx.db.milestone.id.find(milestone_id);
    if (!existing) throw new SenderError(`Milestone ${milestone_id} not found`);
    ctx.db.milestone.id.update({ ...existing, ...fields, updated_at: ctx.timestamp });
  }
);

export const delete_milestone = spacetimedb.reducer(
  { milestone_id: t.u64() },
  (ctx, { milestone_id }) => {
    const existing = ctx.db.milestone.id.find(milestone_id);
    if (!existing) throw new SenderError(`Milestone ${milestone_id} not found`);
    const audits = [...ctx.db.milestoneAudit.milestone_audit_milestone_id.filter(milestone_id)];
    for (const a of audits) { ctx.db.milestoneAudit.id.delete(a.id); }
    ctx.db.milestone.id.delete(milestone_id);
  }
);

// --- MilestoneAudit Reducers (MILE-02, MILE-03) ---

export const insert_milestone_audit = spacetimedb.reducer(
  {
    project_id: t.u64(),
    milestone_id: t.u64(),
    audit_status: t.string(),
    requirement_scores: t.string(),
    integration_scores: t.string(),
    flow_scores: t.string(),
    tech_debt_items: t.string(),
    roadmap_content: t.string(),
    requirements_content: t.string(),
  },
  (ctx, { project_id, milestone_id, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    const milestone = ctx.db.milestone.id.find(milestone_id);
    if (!milestone) throw new SenderError(`Milestone ${milestone_id} not found`);
    ctx.db.milestoneAudit.insert({
      id: 0n,
      project_id,
      milestone_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_milestone_audit = spacetimedb.reducer(
  {
    audit_id: t.u64(),
    audit_status: t.string(),
    requirement_scores: t.string(),
    integration_scores: t.string(),
    flow_scores: t.string(),
    tech_debt_items: t.string(),
    roadmap_content: t.string(),
    requirements_content: t.string(),
  },
  (ctx, { audit_id, ...fields }) => {
    const existing = ctx.db.milestoneAudit.id.find(audit_id);
    if (!existing) throw new SenderError(`MilestoneAudit ${audit_id} not found`);
    ctx.db.milestoneAudit.id.update({ ...existing, ...fields, updated_at: ctx.timestamp });
  }
);

export const delete_milestone_audit = spacetimedb.reducer(
  { audit_id: t.u64() },
  (ctx, { audit_id }) => {
    const existing = ctx.db.milestoneAudit.id.find(audit_id);
    if (!existing) throw new SenderError(`MilestoneAudit ${audit_id} not found`);
    ctx.db.milestoneAudit.id.delete(audit_id);
  }
);

// --- SessionCheckpoint Reducers (SESS-01) ---

export const upsert_session_checkpoint = spacetimedb.reducer(
  {
    project_id: t.u64(),
    phase_id: t.u64(),
    phase_context: t.string(),
    completed_work: t.string(),
    remaining_work: t.string(),
    decisions: t.string(),
    blockers: t.string(),
    next_action: t.string(),
    mental_context: t.string(),
  },
  (ctx, { project_id, phase_id, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    const phase = ctx.db.phase.id.find(phase_id);
    if (!phase) throw new SenderError(`Phase ${phase_id} not found`);
    const existing = [...ctx.db.sessionCheckpoint.session_checkpoint_phase_id.filter(phase_id)][0];
    if (existing) {
      ctx.db.sessionCheckpoint.id.update({ ...existing, ...fields, updated_at: ctx.timestamp });
    } else {
      ctx.db.sessionCheckpoint.insert({
        id: 0n,
        project_id,
        phase_id,
        ...fields,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    }
  }
);

export const delete_session_checkpoint = spacetimedb.reducer(
  { checkpoint_id: t.u64() },
  (ctx, { checkpoint_id }) => {
    const existing = ctx.db.sessionCheckpoint.id.find(checkpoint_id);
    if (!existing) throw new SenderError(`SessionCheckpoint ${checkpoint_id} not found`);
    ctx.db.sessionCheckpoint.id.delete(checkpoint_id);
  }
);

// --- Todo Reducers (TODO-01) ---

export const insert_todo = spacetimedb.reducer(
  {
    project_id: t.u64(),
    title: t.string(),
    area: t.string(),
    problem: t.string(),
    solution_hints: t.string(),
    file_refs: t.string(),
    status: t.string(),
  },
  (ctx, { project_id, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.todo.insert({
      id: 0n,
      project_id,
      ...fields,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_todo = spacetimedb.reducer(
  {
    todo_id: t.u64(),
    title: t.string(),
    area: t.string(),
    problem: t.string(),
    solution_hints: t.string(),
    file_refs: t.string(),
    status: t.string(),
  },
  (ctx, { todo_id, ...fields }) => {
    const existing = ctx.db.todo.id.find(todo_id);
    if (!existing) throw new SenderError(`Todo ${todo_id} not found`);
    ctx.db.todo.id.update({ ...existing, ...fields, updated_at: ctx.timestamp });
  }
);

export const delete_todo = spacetimedb.reducer(
  { todo_id: t.u64() },
  (ctx, { todo_id }) => {
    const existing = ctx.db.todo.id.find(todo_id);
    if (!existing) throw new SenderError(`Todo ${todo_id} not found`);
    ctx.db.todo.id.delete(todo_id);
  }
);

// --- DebugSession Reducers (DBG-01) ---

export const insert_debug_session = spacetimedb.reducer(
  {
    project_id: t.u64(),
    bug_description: t.string(),
    hypotheses: t.string(),
    checkpoints: t.string(),
    timeline: t.string(),
    status: t.string(),
    resolution_notes: t.string(),
  },
  (ctx, { project_id, resolution_notes, ...fields }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    ctx.db.debugSession.insert({
      id: 0n,
      project_id,
      ...fields,
      resolution_notes: resolution_notes || undefined,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });
  }
);

export const update_debug_session = spacetimedb.reducer(
  {
    session_id: t.u64(),
    bug_description: t.string(),
    hypotheses: t.string(),
    checkpoints: t.string(),
    timeline: t.string(),
    status: t.string(),
    resolution_notes: t.string(),
  },
  (ctx, { session_id, resolution_notes, ...fields }) => {
    const existing = ctx.db.debugSession.id.find(session_id);
    if (!existing) throw new SenderError(`DebugSession ${session_id} not found`);
    ctx.db.debugSession.id.update({
      ...existing,
      ...fields,
      resolution_notes: resolution_notes || undefined,
      updated_at: ctx.timestamp,
    });
  }
);

export const delete_debug_session = spacetimedb.reducer(
  { session_id: t.u64() },
  (ctx, { session_id }) => {
    const existing = ctx.db.debugSession.id.find(session_id);
    if (!existing) throw new SenderError(`DebugSession ${session_id} not found`);
    ctx.db.debugSession.id.delete(session_id);
  }
);

// --- CodebaseMap Reducers (CMAP-01) ---

export const upsert_codebase_map = spacetimedb.reducer(
  {
    project_id: t.u64(),
    doc_type: t.string(),
    content: t.string(),
  },
  (ctx, { project_id, doc_type, content }) => {
    const project = ctx.db.project.id.find(project_id);
    if (!project) throw new SenderError(`Project ${project_id} not found`);
    const existing = [...ctx.db.codebases.codebase_map_project_id.filter(project_id)]
      .find(r => r.doc_type === doc_type);
    if (existing) {
      ctx.db.codebases.id.update({ ...existing, content, updated_at: ctx.timestamp });
    } else {
      ctx.db.codebases.insert({
        id: 0n,
        project_id,
        doc_type,
        content,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    }
  }
);

export const delete_codebase_map = spacetimedb.reducer(
  { codebase_map_id: t.u64() },
  (ctx, { codebase_map_id }) => {
    const existing = ctx.db.codebases.id.find(codebase_map_id);
    if (!existing) throw new SenderError(`CodebaseMap ${codebase_map_id} not found`);
    ctx.db.codebases.id.delete(codebase_map_id);
  }
);

// --- Seed Project Reducer (Bulk Initialization) ---

export const seed_project = spacetimedb.reducer(
  {
    git_remote_url: t.string(),
    name: t.string(),
    description: t.string(),
    core_value: t.string(),
    constraints: t.string(),
    context: t.string(),
    key_decisions: t.string(),
    phases_json: t.string(),
    requirements_json: t.string(),
  },
  (ctx, args) => {
    // 1. Insert project
    const proj = ctx.db.project.insert({
      id: 0n,
      git_remote_url: args.git_remote_url,
      name: args.name,
      description: args.description,
      core_value: args.core_value,
      constraints: args.constraints,
      context: args.context,
      key_decisions: args.key_decisions,
      created_at: ctx.timestamp,
      updated_at: ctx.timestamp,
    });

    // 2. Parse and insert phases
    let phases: Array<{
      number: string;
      name: string;
      slug: string;
      goal: string;
      status: string;
      depends_on: string;
      success_criteria: string;
      is_inserted?: boolean;
    }>;
    try {
      phases = JSON.parse(args.phases_json);
    } catch {
      throw new SenderError(`Invalid phases_json: failed to parse JSON`);
    }

    let firstPhaseNumber = '';
    for (let i = 0; i < phases.length; i++) {
      const p = phases[i];
      if (i === 0) firstPhaseNumber = p.number;
      ctx.db.phase.insert({
        id: 0n,
        project_id: proj.id,
        number: p.number,
        name: p.name,
        slug: p.slug,
        goal: p.goal,
        status: p.status,
        depends_on: p.depends_on,
        success_criteria: p.success_criteria,
        is_inserted: p.is_inserted ?? false,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    }

    // 3. Parse and insert requirements
    let requirements: Array<{
      category: string;
      number: string;
      description: string;
      status: string;
      phase_number: string;
      milestone_version?: string;
    }>;
    try {
      requirements = JSON.parse(args.requirements_json);
    } catch {
      throw new SenderError(`Invalid requirements_json: failed to parse JSON`);
    }

    for (const req of requirements) {
      ctx.db.requirement.insert({
        id: 0n,
        project_id: proj.id,
        category: req.category,
        number: req.number,
        description: req.description,
        status: req.status,
        phase_number: req.phase_number,
        milestone_version: req.milestone_version || undefined,
        created_at: ctx.timestamp,
        updated_at: ctx.timestamp,
      });
    }

    // 4. Insert initial project_state
    ctx.db.projectState.insert({
      id: 0n,
      project_id: proj.id,
      current_phase: firstPhaseNumber,
      current_plan: 0n,
      current_task: 0n,
      last_activity: ctx.timestamp,
      last_activity_description: 'Project initialized via seed_project',
      velocity_data: '',
      session_last: '',
      session_stopped_at: '',
      session_resume_file: undefined,
      updated_at: ctx.timestamp,
    });
  }
);
