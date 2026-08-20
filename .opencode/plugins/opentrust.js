/**
 * OpenTrust Plugin for OpenCode
 *
 * Registers the 10 ot-* phase tools (ot-explore, ot-propose, ot-apply,
 * ot-review, ot-ship, ot-status, ot-incident, ot-synthetize, ot-create,
 * ot-goal) using the current OpenCode plugin API: a named export function
 * `(input, options?) => Promise<Hooks>` returning a `tool` registry.
 *
 * Usage:
 *   Add to opencode.json:
 *   {
 *     "plugin": [".opencode/plugins/opentrust.js"]
 *   }
 *
 * The plugin module exports ONLY the plugin function. OpenCode's legacy
 * plugin loader iterates every named export and calls each function as a
 * plugin; content loaders live in `opentrust-core.js` (imported here) so they
 * are not invoked as plugins. The core lives OUTSIDE `.opencode/plugins/`
 * (in `.opencode/lib/`) because OpenCode auto-loads every `*.{ts,js}` file
 * under `{plugin,plugins}/` as a plugin.
 *
 * @module opentrust
 */

import { loadAgents, loadSkills, loadContext, loadCommands } from '../lib/opentrust-core.js';

/**
 * Shared tool arguments (plain JSON-schema objects; zod is optional).
 * `task` and `project` are provided by the model when it calls a tool.
 */
const TOOL_ARGS = {
  task: { type: 'string', description: 'Task name or identifier' },
  project: { type: 'string', description: 'Project name or identifier' },
};

/**
 * Handle ot-explore tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtExplore(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  // Load OpenTrust context
  const agents = loadAgents();
  const skills = loadSkills();
  const context = loadContext();
  const commands = loadCommands();

  const synthesis = {
    agents: Object.keys(agents).length,
    skills: Object.keys(skills).length,
    commands: Object.keys(commands).length,
    contexts: Object.keys(context.contexts).length,
    bundles: Object.keys(context.bundles).length,
    task,
    project
  };

  return `OpenTrust Context Loaded:\n` +
    `• ${synthesis.agents} agents\n` +
    `• ${synthesis.skills} skills\n` +
    `• ${synthesis.commands} commands\n` +
    `• ${synthesis.contexts} contexts\n` +
    `• ${synthesis.bundles} bundles\n` +
    `• Task: ${synthesis.task}\n` +
    `• Project: ${synthesis.project}`;
}

/**
 * Handle ot-propose tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtPropose(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Propose Phase:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Phase: Propose (Read Only)\n` +
    `• Allowed: writing proposal documents, comparing alternatives\n` +
    `• Forbidden: implementation, file creation outside proposal\n` +
    `• Output: Approved plan with Acceptance Criteria`;
}

/**
 * Handle ot-apply tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtApply(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Apply Phase:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Phase: Apply (Mutation)\n` +
    `• Allowed: implementation within approved scope\n` +
    `• Required: Task Plan, TDD-First gate for behavioral changes\n` +
    `• Rule: One microincrement at a time, validate after each`;
}

/**
 * Handle ot-review tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtReview(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Review Phase:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Phase: Review (Read Only)\n` +
    `• Allowed: reading diff, running tests, inspecting evidence\n` +
    `• Forbidden: editing code during review\n` +
    `• Output: Review report with findings or approval`;
}

/**
 * Handle ot-ship tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtShip(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Ship Phase:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Phase: Ship (Delivery)\n` +
    `• Allowed: archive, commit, push, PR\n` +
    `• Required: all tests pass, review approved, diff inspected\n` +
    `• Retrieval: Must not include private retrieval content in commits`;
}

/**
 * Handle ot-status tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtStatus(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Status:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Status: Active\n` +
    `• Phase: Unknown\n` +
    `• Next Action: Check task plan`;
}

/**
 * Handle ot-incident tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtIncident(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Incident Response:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Phase: Incident\n` +
    `• Priority: diagnosis, containment, recovery\n` +
    `• Rule: smallest safe change`;
}

/**
 * Handle ot-synthetize tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtSynthetize(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Synthetize:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Mode: 4-round Grilling + gap analysis + task contract\n` +
    `• Output: Task contract with retrieval context`;
}

/**
 * Handle ot-create tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtCreate(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Create:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Mode: stack analysis → gap detection → recommendations\n` +
    `• Output: Creation recommendations (recommend-only)`;
}

/**
 * Handle ot-goal tool call
 * @param {Object} args - Tool arguments
 * @returns {Promise<string>} Tool result
 */
async function handleOtGoal(args) {
  const task = args?.task || 'unknown';
  const project = args?.project || 'unknown';

  return `OpenTrust Goal:\n` +
    `• Task: ${task}\n` +
    `• Project: ${project}\n` +
    `• Mode: multi-task autonomous loop\n` +
    `• Limits: max 5 tasks, 3 worktrees, 4h runtime, 3 retries\n` +
    `• Rule: human gates preserved`;
}

/**
 * Tool registry exposed through the `tool` hook.
 */
const TOOLS = {
  'ot-explore': {
    description: 'Synthesize OpenTrust context for exploration',
    args: TOOL_ARGS,
    execute: handleOtExplore
  },
  'ot-propose': {
    description: 'OpenTrust Propose phase guidance',
    args: TOOL_ARGS,
    execute: handleOtPropose
  },
  'ot-apply': {
    description: 'OpenTrust Apply phase guidance',
    args: TOOL_ARGS,
    execute: handleOtApply
  },
  'ot-review': {
    description: 'OpenTrust Review phase guidance',
    args: TOOL_ARGS,
    execute: handleOtReview
  },
  'ot-ship': {
    description: 'OpenTrust Ship phase guidance',
    args: TOOL_ARGS,
    execute: handleOtShip
  },
  'ot-status': {
    description: 'OpenTrust status check',
    args: TOOL_ARGS,
    execute: handleOtStatus
  },
  'ot-incident': {
    description: 'OpenTrust incident response',
    args: TOOL_ARGS,
    execute: handleOtIncident
  },
  'ot-synthetize': {
    description: 'OpenTrust synthetize mode',
    args: TOOL_ARGS,
    execute: handleOtSynthetize
  },
  'ot-create': {
    description: 'OpenTrust create mode',
    args: TOOL_ARGS,
    execute: handleOtCreate
  },
  'ot-goal': {
    description: 'OpenTrust goal mode',
    args: TOOL_ARGS,
    execute: handleOtGoal
  }
};

/**
 * OpenTrust plugin entry point (current OpenCode plugin API).
 * @param {Object} input - Plugin input (directory, worktree, sessionID)
 * @returns {Promise<Object>} Hooks object with a `tool` registry
 */
export const OpenTrustPlugin = async (input) => {
  const agents = loadAgents();
  const skills = loadSkills();
  const context = loadContext();
  const commands = loadCommands();

  console.log('OpenTrust Plugin: Bootstrapped successfully');
  console.log(`  • ${Object.keys(agents).length} agents loaded`);
  console.log(`  • ${Object.keys(skills).length} skills loaded`);
  console.log(`  • ${Object.keys(context.contexts).length} contexts loaded`);
  console.log(`  • ${Object.keys(context.bundles).length} bundles loaded`);
  console.log(`  • ${Object.keys(commands).length} commands loaded`);
  console.log(`  • 10 tools registered`);

  return { tool: TOOLS };
};