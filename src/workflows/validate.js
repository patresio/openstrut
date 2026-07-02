/**
 * Validation layer for workflow definitions.
 *
 * All validators are pure functions: they receive plain JS objects and return
 * error strings (or empty array). No file I/O. No side effects.
 *
 * Error strings use the canonical BLOCKED — ERROR CODE format.
 */

/**
 * Validates workflow shape: name, steps array, unique step names, command presence.
 *
 * @param {any} workflow
 * @returns {string[]} Blocking error strings.
 */
export function validateWorkflowShape(workflow) {
  const errors = [];

  if (!workflow || typeof workflow !== 'object') {
    errors.push('BLOCKED — INVALID WORKFLOW: not an object');
    return errors;
  }

  if (!workflow.name || typeof workflow.name !== 'string') {
    errors.push('BLOCKED — WORKFLOW NAME REQUIRED');
  }

  if (!Array.isArray(workflow.steps) || workflow.steps.length === 0) {
    errors.push('BLOCKED — WORKFLOW STEPS REQUIRED: at least one step must be defined');
  }

  const stepNames = new Set();
  if (Array.isArray(workflow.steps)) {
    for (const step of workflow.steps) {
      if (!step.name || typeof step.name !== 'string') {
        errors.push('BLOCKED — WORKFLOW STEP NAME REQUIRED');
      }

      if (step.name && stepNames.has(step.name)) {
        errors.push(`BLOCKED — DUPLICATE WORKFLOW STEP NAME: "${step.name}"`);
      } else if (step.name) {
        stepNames.add(step.name);
      }

      if (!step.command || typeof step.command !== 'string') {
        const label = step.name || '(unnamed)';
        errors.push(`BLOCKED — WORKFLOW STEP COMMAND REQUIRED: step "${label}"`);
      }
    }
  }

  return errors;
}

/**
 * Validates that all workflow steps declare known agents.
 *
 * @param {any} workflow
 * @param {string[]} agentList
 * @returns {string[]} Blocking error strings.
 */
export function validateWorkflowAgents(workflow, agentList) {
  const errors = [];
  const validSet = new Set(agentList);

  if (!Array.isArray(workflow.steps)) return errors;

  for (const step of workflow.steps) {
    const label = step.name || '(unnamed)';

    if (step.agent === undefined || step.agent === null) {
      errors.push(`BLOCKED — WORKFLOW STEP AGENT REQUIRED: step "${label}"`);
      continue;
    }

    if (!validSet.has(step.agent)) {
      errors.push(`BLOCKED — UNKNOWN WORKFLOW AGENT: "${step.agent}" in step "${label}"`);
    }
  }

  return errors;
}

/**
 * Validates that all workflow steps declare known skills (or empty array).
 *
 * @param {any} workflow
 * @param {string[]} skillList
 * @returns {string[]} Blocking error strings.
 */
export function validateWorkflowSkills(workflow, skillList) {
  const errors = [];
  const validSet = new Set(skillList);

  if (!Array.isArray(workflow.steps)) return errors;

  for (const step of workflow.steps) {
    const label = step.name || '(unnamed)';

    if (!Array.isArray(step.skills)) {
      errors.push(`BLOCKED — WORKFLOW STEP SKILLS DECLARATION REQUIRED: step "${label}"`);
      continue;
    }

    for (const skill of step.skills) {
      if (!validSet.has(skill)) {
        errors.push(`BLOCKED — UNKNOWN WORKFLOW SKILL: "${skill}" in step "${label}"`);
      }
    }
  }

  return errors;
}

/**
 * Collects all validation errors in one pass.
 *
 * @param {any} workflow
 * @param {{ agents: string[], skills: string[] }} inventory
 * @returns {string[]} All blocking error strings.
 */
export function collectWorkflowErrors(workflow, inventory) {
  const errors = [];

  errors.push(...validateWorkflowShape(workflow));
  errors.push(...validateWorkflowAgents(workflow, inventory.agents || []));
  errors.push(...validateWorkflowSkills(workflow, inventory.skills || []));

  return errors;
}
