/**
 * Valid agent inventory for HARNESS-011.
 *
 * Hardcoded for this increment. Filesystem-derived inventory is a follow-up.
 * Matches exactly what docs/design/006-change-execution-manifest.md declares.
 */

/** @type {string[]} */
export const VALID_AGENTS = [
  'build',
  'code-reviewer',
  'project-rules-auditor',
];
