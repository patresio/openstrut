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
 * - workflows/ IS installed so the workflow CLI can discover packaged workflow definitions.
 */

/** @typedef {{ source: string, target: string }} ArtifactEntry */

/** @type {ArtifactEntry[]} */
export const INVENTORY = [
  // Global rules
  { source: 'global/AGENTS.md',                                              target: 'AGENTS.md' },
  { source: 'global/opencode.json',                                          target: 'opencode.json' },

  // Agents
  { source: 'global/agents/ai-rag-agent-architect.md',                       target: 'agents/ai-rag-agent-architect.md' },
  { source: 'global/agents/backend-data-reviewer.md',                        target: 'agents/backend-data-reviewer.md' },
  { source: 'global/agents/business-product-strategist.md',                  target: 'agents/business-product-strategist.md' },
  { source: 'global/agents/career-communication-advisor.md',                 target: 'agents/career-communication-advisor.md' },
  { source: 'global/agents/code-quality-testing-reviewer.md',                target: 'agents/code-quality-testing-reviewer.md' },
  { source: 'global/agents/code-reviewer.md',                                target: 'agents/code-reviewer.md' },
  { source: 'global/agents/devops-sre-advisor.md',                           target: 'agents/devops-sre-advisor.md' },
  { source: 'global/agents/frontend-ux-reviewer.md',                         target: 'agents/frontend-ux-reviewer.md' },
  { source: 'global/agents/health-exercise-nutrition-researcher.md',         target: 'agents/health-exercise-nutrition-researcher.md' },
  { source: 'global/agents/knowledge-system-designer.md',                    target: 'agents/knowledge-system-designer.md' },
  { source: 'global/agents/personal-operating-system-advisor.md',            target: 'agents/personal-operating-system-advisor.md' },
  { source: 'global/agents/project-rules-auditor.md',                        target: 'agents/project-rules-auditor.md' },
  { source: 'global/agents/sdd.md',                                          target: 'agents/sdd.md' },
  { source: 'global/agents/security-infrastructure-reviewer.md',             target: 'agents/security-infrastructure-reviewer.md' },
  { source: 'global/agents/software-architect.md',                           target: 'agents/software-architect.md' },

  // Commands
  { source: 'global/commands/eng-checkpoint.md',                             target: 'commands/eng-checkpoint.md' },
  { source: 'global/commands/eng-deliver.md',                                target: 'commands/eng-deliver.md' },
  { source: 'global/commands/eng-incident.md',                               target: 'commands/eng-incident.md' },
  { source: 'global/commands/eng-init-project.md',                           target: 'commands/eng-init-project.md' },
  { source: 'global/commands/eng-plan.md',                                   target: 'commands/eng-plan.md' },
  { source: 'global/commands/eng-refresh-project-rules.md',                  target: 'commands/eng-refresh-project-rules.md' },
  { source: 'global/commands/eng-resume.md',                                 target: 'commands/eng-resume.md' },
  { source: 'global/commands/eng-review.md',                                 target: 'commands/eng-review.md' },
  { source: 'global/commands/eng-spec-change.md',                            target: 'commands/eng-spec-change.md' },
  { source: 'global/commands/eng-status.md',                                 target: 'commands/eng-status.md' },

  // Skills
  { source: 'global/skills/api-data-design/SKILL.md',                        target: 'skills/api-data-design/SKILL.md' },
  { source: 'global/skills/architecture-decision/SKILL.md',                  target: 'skills/architecture-decision/SKILL.md' },
  { source: 'global/skills/career-positioning/SKILL.md',                     target: 'skills/career-positioning/SKILL.md' },
  { source: 'global/skills/code-refactoring/SKILL.md',                       target: 'skills/code-refactoring/SKILL.md' },
  { source: 'global/skills/devops-sre-diagnostics/SKILL.md',                 target: 'skills/devops-sre-diagnostics/SKILL.md' },
  { source: 'global/skills/distributed-systems-review/SKILL.md',             target: 'skills/distributed-systems-review/SKILL.md' },
  { source: 'global/skills/domain-modeling/SKILL.md',                        target: 'skills/domain-modeling/SKILL.md' },
  { source: 'global/skills/engineering-bdd-discovery/SKILL.md',              target: 'skills/engineering-bdd-discovery/SKILL.md' },
  { source: 'global/skills/engineering-code-review/SKILL.md',                target: 'skills/engineering-code-review/SKILL.md' },
  { source: 'global/skills/engineering-delivery/SKILL.md',                   target: 'skills/engineering-delivery/SKILL.md' },
  { source: 'global/skills/engineering-incident-triage/SKILL.md',            target: 'skills/engineering-incident-triage/SKILL.md' },
  { source: 'global/skills/engineering-legacy-change/SKILL.md',              target: 'skills/engineering-legacy-change/SKILL.md' },
  { source: 'global/skills/engineering-project-bootstrap/SKILL.md',          target: 'skills/engineering-project-bootstrap/SKILL.md' },
  { source: 'global/skills/engineering-sdd-change/SKILL.md',                 target: 'skills/engineering-sdd-change/SKILL.md' },
  { source: 'global/skills/engineering-task-plan/SKILL.md',                  target: 'skills/engineering-task-plan/SKILL.md' },
  { source: 'global/skills/engineering-tdd-first/SKILL.md',                  target: 'skills/engineering-tdd-first/SKILL.md' },
  { source: 'global/skills/financial-organization/SKILL.md',                 target: 'skills/financial-organization/SKILL.md' },
  { source: 'global/skills/frontend-ux-review/SKILL.md',                    target: 'skills/frontend-ux-review/SKILL.md' },
  { source: 'global/skills/health-planning/SKILL.md',                        target: 'skills/health-planning/SKILL.md' },
  { source: 'global/skills/knowledge-system-design/SKILL.md',                target: 'skills/knowledge-system-design/SKILL.md' },
  { source: 'global/skills/leadership-feedback/SKILL.md',                    target: 'skills/leadership-feedback/SKILL.md' },
  { source: 'global/skills/learning-plan-design/SKILL.md',                   target: 'skills/learning-plan-design/SKILL.md' },
  { source: 'global/skills/personal-execution-system/SKILL.md',              target: 'skills/personal-execution-system/SKILL.md' },
  { source: 'global/skills/product-discovery/SKILL.md',                      target: 'skills/product-discovery/SKILL.md' },
  { source: 'global/skills/rag-agent-design/SKILL.md',                       target: 'skills/rag-agent-design/SKILL.md' },
  { source: 'global/skills/security-review/SKILL.md',                        target: 'skills/security-review/SKILL.md' },
  { source: 'global/skills/team-cowork-orchestration/SKILL.md',              target: 'skills/team-cowork-orchestration/SKILL.md' },
  { source: 'global/skills/testing-strategy/SKILL.md',                       target: 'skills/testing-strategy/SKILL.md' },

  // Workflows
  { source: 'workflows/backend-safe-change.yaml',                            target: 'workflows/backend-safe-change.yaml' },
  { source: 'workflows/feature-spec-to-build.yaml',                          target: 'workflows/feature-spec-to-build.yaml' },
  { source: 'workflows/product-to-implementation.yaml',                      target: 'workflows/product-to-implementation.yaml' },
  { source: 'workflows/rag-feature-sequential.yaml',                         target: 'workflows/rag-feature-sequential.yaml' },
  { source: 'workflows/team-cowork-worktree.yaml',                           target: 'workflows/team-cowork-worktree.yaml' },

  // Project bootstrap templates (installed so the bootstrap skill can locate
  // them at runtime without access to the harness repository working tree)
  { source: 'templates/project/AGENTS.md',                                   target: 'templates/project/AGENTS.md' },
  { source: 'templates/project/.opencode/task-plans/README.md',              target: 'templates/project/.opencode/task-plans/README.md' },
  { source: 'templates/project/openspec/changes/README.md',                  target: 'templates/project/openspec/changes/README.md' },
  { source: 'templates/project/openspec/specs/README.md',                    target: 'templates/project/openspec/specs/README.md' },
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
  const allowed = ['global/', 'templates/', 'workflows/'];
  return allowed.some(prefix => sourcePath.startsWith(prefix));
}
