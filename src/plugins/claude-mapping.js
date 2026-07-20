/**
 * Claude Code Tool Mapping
 * 
 * This module provides Claude Code-specific tool mappings for OpenTrust tools.
 * 
 * @module claude-mapping
 */

import { ToolMapping } from './tool-mapping.js';

/**
 * Claude Code Tool Mapping class
 * 
 * Provides Claude Code-specific tool mappings for OpenTrust tools.
 */
export class ClaudeToolMapping extends ToolMapping {
  /**
   * Create a new ClaudeToolMapping instance
   */
  constructor() {
    super('claude');
  }

  /**
   * Map an OpenTrust tool to Claude Code tool
   * @param {string} toolName - OpenTrust tool name
   * @returns {string} Claude Code tool name
   */
  mapTool(toolName) {
    const mappings = {
      'ot-explore': 'Read',
      'ot-propose': 'Write',
      'ot-apply': 'Bash',
      'ot-review': 'Read',
      'ot-ship': 'Bash',
      'ot-status': 'Bash',
      'ot-incident': 'Bash',
      'ot-synthetize': 'Bash',
      'ot-create': 'Bash',
      'ot-goal': 'Bash'
    };
    return mappings[toolName] || toolName;
  }

  /**
   * Transform parameters for Claude Code
   * @param {string} toolName - OpenTrust tool name
   * @param {Object} params - Parameters to transform
   * @returns {Object} Transformed parameters
   */
  mapParameters(toolName, params) {
    // Claude Code uses PascalCase
    return params;
  }
}

/**
 * Create a Claude Code tool mapping
 * @returns {ClaudeToolMapping} ClaudeToolMapping instance
 */
export function createClaudeToolMapping() {
  return new ClaudeToolMapping();
}

export default {
  ClaudeToolMapping,
  createClaudeToolMapping
};
