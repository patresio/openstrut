/**
 * Validation layer for the Change Execution Manifest generator.
 *
 * All validators are pure functions: they receive plain JS objects and return
 * error strings (or null / empty array). No file I/O. No side effects.
 *
 * Error strings use the canonical BLOCKED — ERROR CODE format defined in
 * docs/design/006-change-execution-manifest.md.
 */

// ─── ISO 8601 validation ─────────────────────────────────────────────────────

// Accepts the subset of ISO 8601 that includes a date and optional time.
// Full date: YYYY-MM-DD
// Date-time: YYYY-MM-DDTHH:MM:SS[.sss][Z|±HH:MM]
const ISO_8601_RE =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

function isIso8601(value) {
  if (typeof value !== 'string' || !value) return false;
  return ISO_8601_RE.test(value);
}

// ─── Task ID validation ──────────────────────────────────────────────────────

const TASK_ID_RE = /^T[0-9]{3,}$/;

// ─── validateApprovalFrontmatter ─────────────────────────────────────────────

/**
 * Validates the approval frontmatter from proposal.md.
 *
 * @param {import('./parse.js').Frontmatter} frontmatter
 * @returns {string | null} Error string, or null if valid.
 */
export function validateApprovalFrontmatter(frontmatter) {
  if (frontmatter === null || frontmatter === undefined) {
    return 'BLOCKED — CHANGE APPROVAL METADATA REQUIRED';
  }

  const { change_id, status, approved_by, approved_at } = frontmatter;

  // All four fields must be present and non-empty
  if (!change_id || !approved_by) {
    return 'BLOCKED — CHANGE APPROVAL METADATA REQUIRED';
  }

  // status must be exactly "approved"
  if (status !== 'approved') {
    if (!status) return 'BLOCKED — CHANGE APPROVAL METADATA REQUIRED';
    return 'BLOCKED — CHANGE NOT APPROVED';
  }

  // approved_at must be a valid ISO 8601 string
  if (!approved_at || !isIso8601(approved_at)) {
    if (!approved_at) return 'BLOCKED — CHANGE APPROVAL METADATA REQUIRED';
    return 'BLOCKED — INVALID APPROVAL METADATA';
  }

  return null;
}

// ─── validateTaskIds ──────────────────────────────────────────────────────────

/**
 * Validates that all tasks have unique, valid IDs.
 *
 * @param {import('./parse.js').Task[]} tasks
 * @returns {string[]} Blocking error strings.
 */
export function validateTaskIds(tasks) {
  const errors = [];
  const seen = new Set();

  for (const task of tasks) {
    const label = task.heading || '(unknown heading)';

    if (task.id === null || task.id === undefined) {
      errors.push(`BLOCKED — TASK ID REQUIRED: "${label}"`);
      continue;
    }

    if (!TASK_ID_RE.test(task.id)) {
      errors.push(`BLOCKED — INVALID TASK ID: "${task.id}" in "${label}"`);
      continue;
    }

    if (seen.has(task.id)) {
      errors.push(`BLOCKED — DUPLICATE TASK ID: "${task.id}"`);
    } else {
      seen.add(task.id);
    }
  }

  return errors;
}

// ─── validateTaskAgents ───────────────────────────────────────────────────────

/**
 * Validates that all tasks declare a known agent.
 *
 * @param {import('./parse.js').Task[]} tasks
 * @param {string[]} agentList
 * @returns {string[]} Blocking error strings.
 */
export function validateTaskAgents(tasks, agentList) {
  const errors = [];
  const validSet = new Set(agentList);

  for (const task of tasks) {
    const label = task.id ?? task.heading ?? '(unknown)';

    if (!task.agentDeclared || task.agent === null) {
      errors.push(`BLOCKED — TASK AGENT REQUIRED: task "${label}"`);
      continue;
    }

    if (!validSet.has(task.agent)) {
      errors.push(`BLOCKED — UNKNOWN AGENT: "${task.agent}" in task "${label}"`);
    }
  }

  return errors;
}

// ─── validateTaskSkills ───────────────────────────────────────────────────────

/**
 * Validates that all tasks declare skills (or none) against the inventory.
 *
 * @param {import('./parse.js').Task[]} tasks
 * @param {string[]} skillInventory
 * @returns {string[]} Blocking error strings.
 */
export function validateTaskSkills(tasks, skillInventory) {
  const errors = [];
  const validSet = new Set(skillInventory);

  for (const task of tasks) {
    const label = task.id ?? task.heading ?? '(unknown)';

    if (!task.skillsDeclared) {
      errors.push(`BLOCKED — TASK SKILLS DECLARATION REQUIRED: task "${label}"`);
      continue;
    }

    for (const skill of task.skills) {
      if (!validSet.has(skill)) {
        errors.push(`BLOCKED — UNKNOWN SKILL: "${skill}" in task "${label}"`);
      }
    }
  }

  return errors;
}

// ─── validateDependencies ─────────────────────────────────────────────────────

/**
 * Validates dependency declarations: presence, known IDs, self-deps, cycles.
 *
 * @param {import('./parse.js').Task[]} tasks
 * @returns {string[]} Blocking error strings.
 */
export function validateDependencies(tasks) {
  const errors = [];
  const idSet = new Set(tasks.map(t => t.id).filter(Boolean));

  for (const task of tasks) {
    const label = task.id ?? task.heading ?? '(unknown)';

    if (!task.dependsOnDeclared) {
      errors.push(`BLOCKED — DEPENDENCY DECLARATION REQUIRED: task "${label}"`);
      continue;
    }

    for (const dep of task.dependsOn) {
      if (dep === task.id) {
        errors.push(`BLOCKED — SELF DEPENDENCY: task "${label}" depends on itself`);
        continue;
      }
      if (!idSet.has(dep)) {
        errors.push(`BLOCKED — UNKNOWN TASK DEPENDENCY: "${dep}" referenced in task "${label}"`);
      }
    }
  }

  // Cycle detection via DFS (only if no structural errors so far)
  if (errors.length === 0) {
    const cycleErrors = detectCycles(tasks);
    errors.push(...cycleErrors);
  }

  return errors;
}

/**
 * Detects cycles in the dependency graph using DFS with coloring.
 *
 * @param {import('./parse.js').Task[]} tasks
 * @returns {string[]}
 */
function detectCycles(tasks) {
  const errors = [];
  const adj = new Map(tasks.map(t => [t.id, t.dependsOn ?? []]));
  // 0=unvisited, 1=in-stack, 2=done
  const color = new Map(tasks.map(t => [t.id, 0]));

  function dfs(nodeId) {
    color.set(nodeId, 1);
    for (const dep of (adj.get(nodeId) ?? [])) {
      if (color.get(dep) === 1) {
        errors.push(`BLOCKED — CYCLIC DEPENDENCY: cycle detected involving task "${nodeId}"`);
        return;
      }
      if (color.get(dep) === 0) {
        dfs(dep);
      }
    }
    color.set(nodeId, 2);
  }

  for (const task of tasks) {
    if (task.id && color.get(task.id) === 0) {
      dfs(task.id);
    }
  }

  return errors;
}

// ─── validateParallelGroups ───────────────────────────────────────────────────

/**
 * Validates that parallel group fields are declared and that no two tasks in
 * the same group have a direct or transitive dependency on each other.
 *
 * @param {import('./parse.js').Task[]} tasks
 * @returns {string[]} Blocking error strings.
 */
export function validateParallelGroups(tasks) {
  const errors = [];

  for (const task of tasks) {
    const label = task.id ?? task.heading ?? '(unknown)';
    if (!task.parallelGroupDeclared) {
      errors.push(`BLOCKED — PARALLEL GROUP DECLARATION REQUIRED: task "${label}"`);
    }
  }

  if (errors.length > 0) return errors;

  // Build reachability map: for each task, the set of all tasks it can reach
  const reachable = buildReachability(tasks);

  // Group tasks by parallel group name (exclude null/none)
  const groups = new Map();
  for (const task of tasks) {
    if (task.parallelGroup === null) continue;
    const g = task.parallelGroup;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(task.id);
  }

  // For each group, check that no member is reachable from another member
  for (const [groupName, members] of groups) {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const a = members[i];
        const b = members[j];
        if (reachable.get(a)?.has(b) || reachable.get(b)?.has(a)) {
          errors.push(
            `BLOCKED — INVALID PARALLEL GROUP: tasks "${a}" and "${b}" share group "${groupName}" but have a dependency relationship`
          );
        }
      }
    }
  }

  return errors;
}

/**
 * Computes the full transitive reachability set for each task.
 *
 * @param {import('./parse.js').Task[]} tasks
 * @returns {Map<string, Set<string>>}
 */
function buildReachability(tasks) {
  const adj = new Map(tasks.map(t => [t.id, t.dependsOn ?? []]));
  const reachable = new Map(tasks.map(t => [t.id, new Set()]));

  function reach(nodeId, visited = new Set()) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    for (const dep of (adj.get(nodeId) ?? [])) {
      reachable.get(nodeId)?.add(dep);
      reach(dep, visited);
      for (const transitive of (reachable.get(dep) ?? [])) {
        reachable.get(nodeId)?.add(transitive);
      }
    }
  }

  for (const task of tasks) {
    if (task.id) reach(task.id);
  }

  return reachable;
}

// ─── collectErrors ────────────────────────────────────────────────────────────

/**
 * Runs all validators and returns all blocking errors.
 *
 * @param {{
 *   frontmatter: import('./parse.js').Frontmatter,
 *   tasks: import('./parse.js').Task[],
 *   agentList: string[],
 *   skillInventory: string[],
 * }} opts
 * @returns {string[]}
 */
export function collectErrors({ frontmatter, tasks, agentList, skillInventory }) {
  const errors = [];

  const approvalErr = validateApprovalFrontmatter(frontmatter);
  if (approvalErr) errors.push(approvalErr);

  errors.push(...validateTaskIds(tasks));
  errors.push(...validateTaskAgents(tasks, agentList));
  errors.push(...validateTaskSkills(tasks, skillInventory));
  errors.push(...validateDependencies(tasks));
  errors.push(...validateParallelGroups(tasks));

  return errors;
}
