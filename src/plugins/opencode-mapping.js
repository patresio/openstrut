/**
 * OpenCode Tool Mapping
 * 
 * This module provides OpenCode-specific tool mappings for OpenTrust tools.
 * 
 * @module opencode-mapping
 */

import { ToolMapping } from './tool-mapping.js';

/**
 * OpenCode Tool Mapping class
 * 
 * Provides OpenCode-specific tool mappings for OpenTrust tools.
 */
export class OpenCodeToolMapping extends ToolMapping {
  /**
   * Create a new OpenCodeToolMapping instance
   */
  constructor() {
    super('opencode');
  }

  /**
   * Map an OpenTrust tool to OpenCode tool
   * @param {string} toolName - OpenTrust tool name
   * @returns {string} OpenCode tool name
   */
  mapTool(toolName) {
    const mappings = {
      'ot-explore': 'read',
      'ot-propose': 'write',
      'ot-apply': 'bash',
      'ot-review': 'read',
      'ot-ship': 'bash',
      'ot-status': 'bash',
      'ot-incident': 'bash',
      'ot-synthetize': 'bash',
      'ot-create': 'bash',
      'ot-goal': 'bash'
    };
    return mappings[toolName] || toolName;
  }

  /**
   * Transform parameters for OpenCode
   * @param {string} toolName - OpenTrust tool name
   * @param {Object} params - Parameters to transform
   * @returns {Object} Transformed parameters
   */
  mapParameters(toolName, params) {
    // OpenCode uses camelCase
    return params;
  }
}

/**
 * Create an OpenCode tool mapping
 * @returns {OpenCodeToolMapping} OpenCodeToolMapping instance
 */
export function createOpenCodeToolMapping() {
  return new OpenCodeToolMapping();
}

export default {
  OpenCodeToolMapping,
  createOpenCodeToolMapping
};
