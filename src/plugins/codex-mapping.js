/**
 * Codex Tool Mapping
 * 
 * This module provides Codex-specific tool mappings for OpenTrust tools.
 * 
 * @module codex-mapping
 */

import { ToolMapping } from './tool-mapping.js';

/**
 * Codex Tool Mapping class
 * 
 * Provides Codex-specific tool mappings for OpenTrust tools.
 */
export class CodexToolMapping extends ToolMapping {
  /**
   * Create a new CodexToolMapping instance
   */
  constructor() {
    super('codex');
  }

  /**
   * Map an OpenTrust tool to Codex tool
   * @param {string} toolName - OpenTrust tool name
   * @returns {string} Codex tool name
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
   * Transform parameters for Codex
   * @param {string} toolName - OpenTrust tool name
   * @param {Object} params - Parameters to transform
   * @returns {Object} Transformed parameters
   */
  mapParameters(toolName, params) {
    // Codex uses camelCase
    return params;
  }
}

/**
 * Create a Codex tool mapping
 * @returns {CodexToolMapping} CodexToolMapping instance
 */
export function createCodexToolMapping() {
  return new CodexToolMapping();
}

export default {
  CodexToolMapping,
  createCodexToolMapping
};
