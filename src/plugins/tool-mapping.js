/**
 * Tool Mapping Interface
 * 
 * This module provides a common interface for mapping OpenTrust tools
 * to platform-specific tools across OpenCode, Claude Code, Codex, and Hermes-Agent.
 * 
 * @module tool-mapping
 */

/**
 * Tool mapping configuration
 * @type {Object}
 */
const TOOL_MAPPINGS = {
  'ot-explore': {
    opencode: 'read',
    claude: 'Read',
    codex: 'read',
    hermes: 'read_file'
  },
  'ot-propose': {
    opencode: 'write',
    claude: 'Write',
    codex: 'write',
    hermes: 'write_file'
  },
  'ot-apply': {
    opencode: 'bash',
    claude: 'Bash',
    codex: 'bash',
    hermes: 'execute_command'
  },
  'ot-review': {
    opencode: 'read',
    claude: 'Read',
    codex: 'read',
    hermes: 'read_file'
  },
  'ot-ship': {
    opencode: 'bash',
    claude: 'Bash',
    codex: 'bash',
    hermes: 'execute_command'
  },
  'ot-status': {
    opencode: 'bash',
    claude: 'Bash',
    codex: 'bash',
    hermes: 'execute_command'
  },
  'ot-incident': {
    opencode: 'bash',
    claude: 'Bash',
    codex: 'bash',
    hermes: 'execute_command'
  },
  'ot-synthetize': {
    opencode: 'bash',
    claude: 'Bash',
    codex: 'bash',
    hermes: 'execute_command'
  },
  'ot-create': {
    opencode: 'bash',
    claude: 'Bash',
    codex: 'bash',
    hermes: 'execute_command'
  },
  'ot-goal': {
    opencode: 'bash',
    claude: 'Bash',
    codex: 'bash',
    hermes: 'execute_command'
  }
};

/**
 * Parameter transformations for each platform
 * @type {Object}
 */
const PARAMETER_TRANSFORMS = {
  opencode: (params) => params,
  claude: (params) => params,
  codex: (params) => params,
  hermes: (params) => {
    // Hermes uses snake_case
    return Object.fromEntries(
      Object.entries(params).map(([k, v]) => [
        k.replace(/([A-Z])/g, '_$1').toLowerCase(),
        v
      ])
    );
  }
};

/**
 * Tool Mapping class
 * 
 * Provides platform-specific tool mappings for OpenTrust tools.
 */
export class ToolMapping {
  /**
   * Create a new ToolMapping instance
   * @param {string} platform - Target platform (opencode, claude, codex, hermes)
   */
  constructor(platform) {
    if (!['opencode', 'claude', 'codex', 'hermes'].includes(platform)) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    this.platform = platform;
  }

  /**
   * Map an OpenTrust tool to platform-specific tool
   * @param {string} toolName - OpenTrust tool name
   * @returns {string} Platform-specific tool name
   */
  mapTool(toolName) {
    const mapping = TOOL_MAPPINGS[toolName];
    if (!mapping) {
      throw new Error(`Unknown tool: ${toolName}`);
    }
    return mapping[this.platform] || toolName;
  }

  /**
   * Transform parameters for platform
   * @param {string} toolName - OpenTrust tool name
   * @param {Object} params - Parameters to transform
   * @returns {Object} Transformed parameters
   */
  mapParameters(toolName, params) {
    const transform = PARAMETER_TRANSFORMS[this.platform];
    return transform(params);
  }

  /**
   * Get all mapped tools for this platform
   * @returns {Object} Map of OpenTrust tools to platform tools
   */
  getAllMappings() {
    const result = {};
    for (const [toolName, mapping] of Object.entries(TOOL_MAPPINGS)) {
      result[toolName] = mapping[this.platform];
    }
    return result;
  }

  /**
   * Check if a tool is supported on this platform
   * @param {string} toolName - OpenTrust tool name
   * @returns {boolean} True if tool is supported
   */
  isToolSupported(toolName) {
    return toolName in TOOL_MAPPINGS;
  }

  /**
   * Get supported tools for this platform
   * @returns {string[]} List of supported tool names
   */
  getSupportedTools() {
    return Object.keys(TOOL_MAPPINGS);
  }
}

/**
 * Create a tool mapping for a specific platform
 * @param {string} platform - Target platform
 * @returns {ToolMapping} ToolMapping instance
 */
export function createToolMapping(platform) {
  return new ToolMapping(platform);
}

/**
 * Get all available platforms
 * @returns {string[]} List of supported platforms
 */
export function getPlatforms() {
  return ['opencode', 'claude', 'codex', 'hermes'];
}

/**
 * Get all available tools
 * @returns {string[]} List of OpenTrust tool names
 */
export function getTools() {
  return Object.keys(TOOL_MAPPINGS);
}

export default {
  ToolMapping,
  createToolMapping,
  getPlatforms,
  getTools,
  TOOL_MAPPINGS,
  PARAMETER_TRANSFORMS
};
