/**
 * OpenTrust Plugin Core — content loaders for the OpenCode plugin.
 *
 * Separated from `opentrust.js` so the plugin module exports ONLY the plugin
 * function. OpenCode's legacy plugin loader (`getLegacyPlugins`) iterates every
 * named export of the plugin module and calls each function as a plugin; any
 * non-function export makes it throw "Plugin export is not a function", and
 * loader functions exported from the plugin module would be invoked with
 * `(input, options)` and fail. Keeping loaders here (imported by the plugin)
 * keeps the plugin module a single-function module.
 *
 * @module opentrust-core
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Resolve a content directory in either the installed layout
 * (<root>/agents, <root>/skills, ...) or the repo layout
 * (<root>/global/agents, ...), preferring the installed layout.
 * @param {string} root - config root (parent of .opencode/plugins/)
 * @param {string} subdir - content directory name (agents, skills, context, commands)
 * @returns {string}
 */
export function resolveContentDir(root, subdir) {
  const installed = join(root, subdir);
  const repo = join(root, 'global', subdir);
  return existsSync(installed) ? installed : repo;
}

function contentDir(subdir) {
  return resolveContentDir(join(__dirname, '..', '..'), subdir);
}

/**
 * Load agents from global/agents/
 * @returns {Object} Agent definitions
 */
export function loadAgents() {
  const agentsDir = contentDir('agents');
  const agents = {};

  try {
    const files = readdirSync(agentsDir);

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
export function loadSkills() {
  const skillsDir = contentDir('skills');
  const skills = {};

  try {
    const entries = readdirSync(skillsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillName = entry.name;
      const skillFile = join(skillsDir, skillName, 'SKILL.md');
      if (!existsSync(skillFile)) continue;
      const content = readFileSync(skillFile, 'utf-8');
      skills[skillName] = {
        name: skillName,
        content,
        type: 'skill'
      };
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
export function loadContext() {
  const contextDir = contentDir('context');
  const context = {
    contexts: {},
    bundles: {}
  };

  try {
    // Load CTX definitions
    const contextsDir = join(contextDir, 'contexts');
    if (existsSync(contextsDir)) {
      const files = readdirSync(contextsDir);
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
    if (existsSync(bundlesDir)) {
      const files = readdirSync(bundlesDir);
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
export function loadCommands() {
  const commandsDir = contentDir('commands');
  const commands = {};

  try {
    const files = readdirSync(commandsDir);

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