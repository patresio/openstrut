/**
 * Multi-CLI registry for OpenStrut setup (ot-setup).
 * Declarative metadata only — no filesystem side effects.
 */

export const CLIS = [
  {
    id: 'opencode',
    name: 'OpenCode',
    description: 'Agentic coding CLI for the terminal',
    configDir: '~/.config/opencode',
    configFile: 'opencode.json',
    installMethod: 'npm',
    installCommand: 'npm install -g opencode-ai',
    mcpConfigKey: 'mcp',
    agentDefinitionMechanism: 'opencode.json agent block + .opencode/agents/*.md',
    format: 'json',
  },
  {
    id: 'codex',
    name: 'Codex (OpenAI)',
    description: 'OpenAI agentic coding CLI',
    configDir: '~/.codex',
    configFile: 'config.toml',
    installMethod: 'npm',
    installCommand: 'npm install -g @openai/codex',
    mcpConfigKey: 'mcp_servers',
    agentDefinitionMechanism: '[agents] in config.toml + AGENTS.md',
    format: 'toml',
  },
  {
    id: 'hermes',
    name: 'Hermes-Agent',
    description: 'Personal AI agent with messaging gateway',
    configDir: '~/.hermes/hermes-agent',
    configFile: 'config.yaml',
    installMethod: 'curl',
    installCommand: 'curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash',
    mcpConfigKey: 'mcp',
    agentDefinitionMechanism: 'SOUL.md + toolsets',
    format: 'yaml',
  },
  {
    id: 'pi',
    name: 'Pi (earendil-works)',
    description: 'Minimal agent harness focused on coding',
    configDir: '~/.pi/agent',
    configFile: 'settings.json',
    installMethod: 'npm',
    installCommand: 'npm install -g @earendil-works/pi-coding-agent',
    mcpConfigKey: 'extensions',
    agentDefinitionMechanism: 'Extensions + skills + prompt templates',
    format: 'json',
  },
  {
    id: 'omp',
    name: 'Oh-my-Pi (omp)',
    description: 'Coding agent with IDE integration, hash-anchored edits, LSP',
    configDir: '~/.oh-my-pi',
    configFile: 'omp.config.json',
    installMethod: 'npm',
    installCommand: 'npm install -g @oh-my-pi/cli',
    mcpConfigKey: 'plugins',
    agentDefinitionMechanism: 'Plugins + subagents',
    format: 'json',
  },
  {
    id: 'antigravity',
    name: 'Antigravity (Google)',
    description: 'Google agentic development platform',
    configDir: '~/.antigravity',
    configFile: 'config.json',
    installMethod: 'binary',
    installCommand: 'Download from antigravity.google',
    mcpConfigKey: 'extensions',
    agentDefinitionMechanism: 'Context + plugins',
    format: 'json',
  },
  {
    id: 'cursor',
    name: 'Cursor (Anysphere)',
    description: 'Agentic IDE with CLI (cursor-agent / agent)',
    configDir: '~/.cursor',
    configFile: 'mcp.json',
    installMethod: 'binary',
    installCommand: 'curl https://cursor.com/install -fsS | bash',
    mcpConfigKey: 'mcpServers',
    agentDefinitionMechanism: 'Skills + rules (.cursor/rules/)',
    format: 'json',
  },
];

/**
 * @param {string} id
 * @returns {(typeof CLIS)[number]|undefined}
 */
export function getCLI(id) {
  return CLIS.find((c) => c.id === id);
}
