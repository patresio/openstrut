/**
 * Hermes Tool Mapping
 * 
 * This module provides Hermes-specific tool mappings for OpenTrust tools.
 * 
 * @module hermes-mapping
 */

import { ToolMapping } from './tool-mapping.js';

/**
 * Hermes Tool Mapping class
 * 
 * Provides Hermes-specific tool mappings for OpenTrust tools.
 */
export class HermesToolMapping extends ToolMapping {
  /**
   * Create a new HermesToolMapping instance
   */
  constructor() {
    super('hermes');
  }

  /**
   * Map an OpenTrust tool to Hermes tool
   * @param {string} toolName - OpenTrust tool name
   * @returns {string} Hermes tool name
   */
  mapTool(toolName) {
    const mappings = {
      'ot-explore': 'read_file',
      'ot-propose': 'write_file',
      'ot-apply': 'execute_command',
      'ot-review': 'read_file',
      'ot-ship': 'execute_command',
      'ot-status': 'execute_command',
      'ot-incident': 'execute_command',
      'ot-synthetize': 'execute_command',
      'ot-create': 'execute_command',
      'ot-goal': 'execute_command'
    };
    return mappings[toolName] || toolName;
  }

  /**
   * Transform parameters for Hermes
   * @param {string} toolName - OpenTrust tool name
   * @param {Object} params - Parameters to transform
   * @returns {Object} Transformed parameters
   */
  mapParameters(toolName, params) {
    // Hermes uses snake_case
    return Object.fromEntries(
      Object.entries(params).map(([k, v]) => [
        k.replace(/([A-Z])/g, '_$1').toLowerCase(),
        v
      ])
    );
  }
}

/**
 * Create a Hermes tool mapping
 * @returns {HermesToolMapping} HermesToolMapping instance
 */
export function createHermesToolMapping() {
  return new HermesToolMapping();
}

export default {
  HermesToolMapping,
  createHermesToolMapping
};
