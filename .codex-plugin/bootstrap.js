/**
 * OpenTrust Bootstrap for Codex
 * 
 * This script bootstraps OpenTrust context at session start,
 * injecting 40 agents, 11 skills, 10 commands, and 32 CTX + 24 B context selectors.
 * 
 * Usage:
 *   Add to .codex-plugin/plugin.json:
 *   {
 *     "apps": [
 *       {
 *         "name": "opentrust-bootstrap",
 *         "entrypoint": "bootstrap.js",
 *         "description": "Inject OpenTrust context at session start"
 *       }
 *     ]
 *   }
 * 
 * @module opentrust-bootstrap
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load agents from global/agents/
 * @returns {Object} Agent definitions
 */
function loadAgents() {
  const agentsDir = join(__dirname, '..', '..', 'global', 'agents');
  const agents = {};
  
  try {
    const fs = await import('node:fs');
    const files = fs.readdirSync(agentsDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const agentName = file.replace('.md', '');
        const content = readFileSync(join(agentsDir, file), 'utf-8');
        agents[agentName] = {
          name: agentName,
          content,
          type: agentName.includes('lead') ? 'lead' : 'subagent'
        };
      }
    }
  } catch (error) {
    console.error('Failed to load agents:', error.message);
  }
  
  return agents;
}

/**
 * Load skills from global/skills/
 * @returns {Object} Skill definitions
 */
function loadSkills() {
  const skillsDir = join(__dirname, '..', '..', 'global', 'skills');
  const skills = {};
  
  try {
    const fs = await import('node:fs');
    const files = fs.readdirSync(skillsDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const skillName = file.replace('.md', '');
        const content = readFileSync(join(skillsDir, file), 'utf-8');
        skills[skillName] = {
          name: skillName,
          content,
          type: 'skill'
        };
      }
    }
  } catch (error) {
    console.error('Failed to load skills:', error.message);
  }
  
  return skills;
}

/**
 * Load context definitions from global/context/
 * @returns {Object} Context definitions (CTX + B)
 */
function loadContext() {
  const contextDir = join(__dirname, '..', '..', 'global', 'context');
  const context = {
    contexts: {},
    bundles: {}
  };
  
  try {
    const fs = await import('node:fs');
    
    // Load CTX definitions
    const contextsDir = join(contextDir, 'contexts');
    if (fs.existsSync(contextsDir)) {
      const files = fs.readdirSync(contextsDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const contextName = file.replace('.md', '');
          const content = readFileSync(join(contextsDir, file), 'utf-8');
          context.contexts[contextName] = {
            name: contextName,
            content,
            type: 'context'
          };
        }
      }
    }
    
    // Load B definitions
    const bundlesDir = join(contextDir, 'bundles');
    if (fs.existsSync(bundlesDir)) {
      const files = fs.readdirSync(bundlesDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const bundleName = file.replace('.md', '');
          const content = readFileSync(join(bundlesDir, file), 'utf-8');
          context.bundles[bundleName] = {
            name: bundleName,
            content,
            type: 'bundle'
          };
        }
      }
    }
  } catch (error) {
    console.error('Failed to load context:', error.message);
  }
  
  return context;
}

/**
 * Load commands from global/commands/
 * @returns {Object} Command definitions
 */
function loadCommands() {
  const commandsDir = join(__dirname, '..', '..', 'global', 'commands');
  const commands = {};
  
  try {
    const fs = await import('node:fs');
    const files = fs.readdirSync(commandsDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const commandName = file.replace('.md', '');
        const content = readFileSync(join(commandsDir, file), 'utf-8');
        commands[commandName] = {
          name: commandName,
          content,
          type: 'command'
        };
      }
    }
  } catch (error) {
    console.error('Failed to load commands:', error.message);
  }
  
  return commands;
}

/**
 * Bootstrap OpenTrust context
 * @param {Object} session - Codex session
 * @param {Object} project - Codex project
 */
export async function bootstrap(session, project) {
  console.log('OpenTrust Bootstrap: Starting...');
  
  // Load OpenTrust content
  const agents = loadAgents();
  const skills = loadSkills();
  const context = loadContext();
  const commands = loadCommands();
  
  // Inject context into session
  session.context.agents = agents;
  session.context.skills = skills;
  session.context.context = context;
  session.context.commands = commands;
  
  // Register tools
  session.registerTool('ot-explore', {
    description: 'Synthesize OpenTrust context for exploration',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtExplore
  });
  
  session.registerTool('ot-propose', {
    description: 'OpenTrust Propose phase guidance',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtPropose
  });
  
  session.registerTool('ot-apply', {
    description: 'OpenTrust Apply phase guidance',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtApply
  });
  
  session.registerTool('ot-review', {
    description: 'OpenTrust Review phase guidance',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtReview
  });
  
  session.registerTool('ot-ship', {
    description: 'OpenTrust Ship phase guidance',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtShip
  });
  
  session.registerTool('ot-status', {
    description: 'OpenTrust status check',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtStatus
  });
  
  session.registerTool('ot-incident', {
    description: 'OpenTrust incident response',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtIncident
  });
  
  session.registerTool('ot-synthetize', {
    description: 'OpenTrust synthetize mode',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtSynthetize
  });
  
  session.registerTool('ot-create', {
    description: 'OpenTrust create mode',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtCreate
  });
  
  session.registerTool('ot-goal', {
    description: 'OpenTrust goal mode',
    parameters: {
      session: { type: 'object', required: true },
      task: { type: 'object', required: true },
      project: { type: 'object', required: true }
    },
    handler: handleOtGoal
  });
  
  console.log('OpenTrust Bootstrap: Completed successfully');
  console.log(`  • ${Object.keys(agents).length} agents loaded`);
  console.log(`  • ${Object.keys(skills).length} skills loaded`);
  console.log(`  • ${Object.keys(context.contexts).length} contexts loaded`);
  console.log(`  • ${Object.keys(context.bundles).length} bundles loaded`);
  console.log(`  • ${Object.keys(commands).length} commands loaded`);
  console.log(`  • 10 tools registered`);
}

/**
 * Handle ot-explore tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtExplore(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Context Loaded:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Agents: ${Object.keys(session.context.agents).length}\n` +
              `• Skills: ${Object.keys(session.context.skills).length}\n` +
              `• Contexts: ${Object.keys(session.context.context.contexts).length}\n` +
              `• Bundles: ${Object.keys(session.context.context.bundles).length}`
      }
    ]
  };
}

/**
 * Handle ot-propose tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtPropose(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Propose Phase:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Phase: Propose (Read Only)\n` +
              `• Allowed: writing proposal documents, comparing alternatives\n` +
              `• Forbidden: implementation, file creation outside proposal\n` +
              `• Output: Approved plan with Acceptance Criteria`
      }
    ]
  };
}

/**
 * Handle ot-apply tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtApply(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Apply Phase:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Phase: Apply (Mutation)\n` +
              `• Allowed: implementation within approved scope\n` +
              `• Required: Task Plan, TDD-First gate for behavioral changes\n` +
              `• Rule: One microincrement at a time, validate after each`
      }
    ]
  };
}

/**
 * Handle ot-review tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtReview(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Review Phase:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Phase: Review (Read Only)\n` +
              `• Allowed: reading diff, running tests, inspecting evidence\n` +
              `• Forbidden: editing code during review\n` +
              `• Output: Review report with findings or approval`
      }
    ]
  };
}

/**
 * Handle ot-ship tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtShip(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Ship Phase:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Phase: Ship (Delivery)\n` +
              `• Allowed: archive, commit, push, PR\n` +
              `• Required: all tests pass, review approved, diff inspected\n` +
              `• Retrieval: Must not include private retrieval content in commits`
      }
    ]
  };
}

/**
 * Handle ot-status tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtStatus(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Status:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Status: Active\n` +
              `• Phase: Unknown\n` +
              `• Next Action: Check task plan`
      }
    ]
  };
}

/**
 * Handle ot-incident tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtIncident(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Incident Response:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Phase: Incident\n` +
              `• Priority: diagnosis, containment, recovery\n` +
              `• Rule: smallest safe change`
      }
    ]
  };
}

/**
 * Handle ot-synthetize tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtSynthetize(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Synthetize:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Mode: 4-round Grilling + gap analysis + task contract\n` +
              `• Output: Task contract with retrieval context`
      }
    ]
  };
}

/**
 * Handle ot-create tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtCreate(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Create:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Mode: stack analysis → gap detection → recommendations\n` +
              `• Output: Creation recommendations (recommend-only)`
      }
    ]
  };
}

/**
 * Handle ot-goal tool call
 * @param {Object} params - Tool parameters
 * @returns {Object} Tool result
 */
async function handleOtGoal(params) {
  const { session, task, project } = params;
  
  return {
    content: [
      {
        type: 'text',
        text: `OpenTrust Goal:\n` +
              `• Task: ${task.name || 'unknown'}\n` +
              `• Project: ${project.name || 'unknown'}\n` +
              `• Mode: multi-task autonomous loop\n` +
              `• Limits: max 5 tasks, 3 worktrees, 4h runtime, 3 retries\n` +
              `• Rule: human gates preserved`
      }
    ]
  };
}
