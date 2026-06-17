/**
 * Canonical artifact inventory for the OpenCode Engineering Harness installer.
 *
 * Each entry maps a package-relative source path to a target path relative to
 * the OpenCode global configuration root (e.g. ~/.config/opencode/).
 *
 * Rules:
 * - references/, docs/, evals/, scripts/, .opencode/, src/, bin/ are NOT installed.
 * - templates/ IS installed so the bootstrap skill can locate templates at runtime
 *   without depending on the harness repository working tree.
 */

/** @typedef {{ source: string, target: string }} ArtifactEntry */

/** @type {ArtifactEntry[]} */
export const INVENTORY = [
  // Global rules
  { source: 'global/AGENTS.md',                                              target: 'AGENTS.md' },
  { source: 'global/opencode.json',                                          target: 'opencode.json' },

  // Agents
  { source: 'global/agents/code-reviewer.md',                               target: 'agents/code-reviewer.md' },
  { source: 'global/agents/project-rules-auditor.md',                       target: 'agents/project-rules-auditor.md' },

  // Commands
  { source: 'global/commands/eng-checkpoint.md',                            target: 'commands/eng-checkpoint.md' },
  { source: 'global/commands/eng-deliver.md',                               target: 'commands/eng-deliver.md' },
  { source: 'global/commands/eng-incident.md',                              target: 'commands/eng-incident.md' },
  { source: 'global/commands/eng-init-project.md',                          target: 'commands/eng-init-project.md' },
  { source: 'global/commands/eng-plan.md',                                  target: 'commands/eng-plan.md' },
  { source: 'global/commands/eng-refresh-project-rules.md',                 target: 'commands/eng-refresh-project-rules.md' },
  { source: 'global/commands/eng-resume.md',                                target: 'commands/eng-resume.md' },
  { source: 'global/commands/eng-review.md',                                target: 'commands/eng-review.md' },
  { source: 'global/commands/eng-status.md',                                target: 'commands/eng-status.md' },

  // Skills
  { source: 'global/skills/engineering-bdd-discovery/SKILL.md',             target: 'skills/engineering-bdd-discovery/SKILL.md' },
  { source: 'global/skills/engineering-code-review/SKILL.md',               target: 'skills/engineering-code-review/SKILL.md' },
  { source: 'global/skills/engineering-delivery/SKILL.md',                  target: 'skills/engineering-delivery/SKILL.md' },
  { source: 'global/skills/engineering-incident-triage/SKILL.md',           target: 'skills/engineering-incident-triage/SKILL.md' },
  { source: 'global/skills/engineering-legacy-change/SKILL.md',             target: 'skills/engineering-legacy-change/SKILL.md' },
  { source: 'global/skills/engineering-project-bootstrap/SKILL.md',         target: 'skills/engineering-project-bootstrap/SKILL.md' },
  { source: 'global/skills/engineering-task-plan/SKILL.md',                 target: 'skills/engineering-task-plan/SKILL.md' },
  { source: 'global/skills/engineering-tdd-first/SKILL.md',                 target: 'skills/engineering-tdd-first/SKILL.md' },

  // Project bootstrap templates (installed so the bootstrap skill can locate
  // them at runtime without access to the harness repository working tree)
  { source: 'templates/project/AGENTS.md',                                  target: 'templates/project/AGENTS.md' },
  { source: 'templates/project/.opencode/task-plans/README.md',             target: 'templates/project/.opencode/task-plans/README.md' },
];

/**
 * Returns true if the source path escapes any of the allowed top-level
 * source directories. Used defensively to prevent accidental additions of
 * references, tests, or private data to the installed set.
 *
 * @param {string} sourcePath
 * @returns {boolean}
 */
export function isAllowedSource(sourcePath) {
  const allowed = ['global/', 'templates/'];
  return allowed.some(prefix => sourcePath.startsWith(prefix));
}
