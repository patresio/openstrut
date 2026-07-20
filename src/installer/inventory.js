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
  { source: 'global/tui.json',                                               target: 'tui.json' },

  // Agents — OpenTrust topology (9 leaders + 28 new subagents + 3 preserved legacy)
  // Leaders
  { source: 'global/agents/trust-lead.md',                                   target: 'agents/trust-lead.md' },
  { source: 'global/agents/product-lead.md',                                  target: 'agents/product-lead.md' },
  { source: 'global/agents/architecture-lead.md',                             target: 'agents/architecture-lead.md' },
  { source: 'global/agents/engineering-lead.md',                              target: 'agents/engineering-lead.md' },
  { source: 'global/agents/quality-lead.md',                                  target: 'agents/quality-lead.md' },
  { source: 'global/agents/review-lead.md',                                   target: 'agents/review-lead.md' },
  { source: 'global/agents/devops-lead.md',                                   target: 'agents/devops-lead.md' },
  { source: 'global/agents/delivery-lead.md',                                 target: 'agents/delivery-lead.md' },
  { source: 'global/agents/knowledge-lead.md',                                target: 'agents/knowledge-lead.md' },
  // Subagents — Trust Coordination
  { source: 'global/agents/coordination-facilitator.md',                      target: 'agents/coordination-facilitator.md' },
  { source: 'global/agents/meeting-scribe.md',                                target: 'agents/meeting-scribe.md' },
  { source: 'global/agents/decision-logger.md',                               target: 'agents/decision-logger.md' },
  // Subagents — Product / Discovery
  { source: 'global/agents/product-discovery.md',                             target: 'agents/product-discovery.md' },
  { source: 'global/agents/requirements-analyzer.md',                         target: 'agents/requirements-analyzer.md' },
  { source: 'global/agents/story-slicer.md',                                  target: 'agents/story-slicer.md' },
  // Subagents — Architecture
  { source: 'global/agents/architecture-decision-designer.md',                target: 'agents/architecture-decision-designer.md' },
  { source: 'global/agents/domain-modeler.md',                                target: 'agents/domain-modeler.md' },
  { source: 'global/agents/api-database-designer.md',                         target: 'agents/api-database-designer.md' },
  { source: 'global/agents/distributed-systems-reviewer.md',                  target: 'agents/distributed-systems-reviewer.md' },
  // Subagents — Engineering
  { source: 'global/agents/feature-implementer.md',                           target: 'agents/feature-implementer.md' },
  { source: 'global/agents/code-refactoring-specialist.md',                   target: 'agents/code-refactoring-specialist.md' },
  { source: 'global/agents/performance-engineer.md',                          target: 'agents/performance-engineer.md' },
  { source: 'global/agents/security-reviewer.md',                             target: 'agents/security-reviewer.md' },
  { source: 'global/agents/privacy-reviewer.md',                              target: 'agents/privacy-reviewer.md' },
  // Subagents — Testing / Quality
  { source: 'global/agents/tdd-engineer.md',                                  target: 'agents/tdd-engineer.md' },
  { source: 'global/agents/integration-tester.md',                            target: 'agents/integration-tester.md' },
  { source: 'global/agents/testing-strategy-designer.md',                     target: 'agents/testing-strategy-designer.md' },
  // Subagents — Review / Governance (includes preserved legacy)
  { source: 'global/agents/code-reviewer.md',                                 target: 'agents/code-reviewer.md' },
  { source: 'global/agents/compliance-auditor.md',                            target: 'agents/compliance-auditor.md' },
  { source: 'global/agents/ux-accessibility-reviewer.md',                     target: 'agents/ux-accessibility-reviewer.md' },
  { source: 'global/agents/workflow-governance-auditor.md',                   target: 'agents/workflow-governance-auditor.md' },
  // Subagents — DevOps / SRE
  { source: 'global/agents/ci-cd-infrastructure-engineer.md',                 target: 'agents/ci-cd-infrastructure-engineer.md' },
  { source: 'global/agents/observability-designer.md',                        target: 'agents/observability-designer.md' },
  { source: 'global/agents/incident-triage-specialist.md',                    target: 'agents/incident-triage-specialist.md' },
  // Subagents — Delivery / Release (includes preserved legacy)
  { source: 'global/agents/release-manager.md',                               target: 'agents/release-manager.md' },
  { source: 'global/agents/changelog-writer.md',                              target: 'agents/changelog-writer.md' },
  { source: 'global/agents/issue-pr-coordinator.md',                          target: 'agents/issue-pr-coordinator.md' },
  // Subagents — Knowledge / Context
  { source: 'global/agents/context-historian.md',                             target: 'agents/context-historian.md' },
  { source: 'global/agents/reference-librarian.md',                           target: 'agents/reference-librarian.md' },
  { source: 'global/agents/documentation-skill-creator.md',                   target: 'agents/documentation-skill-creator.md' },

  // Commands — OpenTrust workflow
  { source: 'global/commands/ot-explore.md',                                  target: 'commands/ot-explore.md' },
  { source: 'global/commands/ot-propose.md',                                  target: 'commands/ot-propose.md' },
  { source: 'global/commands/ot-apply.md',                                    target: 'commands/ot-apply.md' },
  { source: 'global/commands/ot-review.md',                                   target: 'commands/ot-review.md' },
  { source: 'global/commands/ot-ship.md',                                     target: 'commands/ot-ship.md' },
  { source: 'global/commands/ot-status.md',                                   target: 'commands/ot-status.md' },
  { source: 'global/commands/ot-incident.md',                                 target: 'commands/ot-incident.md' },
  { source: 'global/commands/ot-synthetize.md',                               target: 'commands/ot-synthetize.md' },
  { source: 'global/commands/ot-create.md',                                   target: 'commands/ot-create.md' },

  { source: 'global/commands/ot-goal.md',                                     target: 'commands/ot-goal.md' },

// Skills — OpenTrust workflow
  { source: 'global/skills/opentrust-task-contract/SKILL.md',                 target: 'skills/opentrust-task-contract/SKILL.md' },
  { source: 'global/skills/opentrust-tdd/SKILL.md',                           target: 'skills/opentrust-tdd/SKILL.md' },
  { source: 'global/skills/opentrust-spec-change/SKILL.md',                   target: 'skills/opentrust-spec-change/SKILL.md' },
  { source: 'global/skills/opentrust-review/SKILL.md',                        target: 'skills/opentrust-review/SKILL.md' },
  { source: 'global/skills/opentrust-delivery/SKILL.md',                      target: 'skills/opentrust-delivery/SKILL.md' },
  { source: 'global/skills/opentrust-observability/SKILL.md',                 target: 'skills/opentrust-observability/SKILL.md' },
  { source: 'global/skills/opentrust-reference-research/SKILL.md',            target: 'skills/opentrust-reference-research/SKILL.md' },
  { source: 'global/skills/opentrust-grilling/SKILL.md',                     target: 'skills/opentrust-grilling/SKILL.md' },
  { source: 'global/skills/opentrust-domain-modeling/SKILL.md',               target: 'skills/opentrust-domain-modeling/SKILL.md' },
  { source: 'global/skills/opentrust-handoff/SKILL.md',                      target: 'skills/opentrust-handoff/SKILL.md' },
  { source: 'global/skills/opentrust-diagnose/SKILL.md',                     target: 'skills/opentrust-diagnose/SKILL.md' },

  // Workflows — none currently installed (legacy workflows reference uninstalled agents;
  // reserved for future OpenTrust-native workflow definitions)

  // OpenTrust runtime docs (installed so instructions/references resolve locally)
  { source: 'global/opentrust/docs/TEAM_TOPOLOGY.md',                        target: 'opentrust/docs/TEAM_TOPOLOGY.md' },
  { source: 'global/opentrust/docs/WORKFLOW.md',                             target: 'opentrust/docs/WORKFLOW.md' },
  { source: 'global/opentrust/docs/TASK_CONTRACT.md',                        target: 'opentrust/docs/TASK_CONTRACT.md' },
  { source: 'global/opentrust/docs/PERMISSIONS.md',                          target: 'opentrust/docs/PERMISSIONS.md' },
  { source: 'global/opentrust/docs/OBSERVABILITY.md',                        target: 'opentrust/docs/OBSERVABILITY.md' },
  { source: 'global/opentrust/docs/OPERATIONAL_RETRIEVAL_MAP.md',            target: 'opentrust/docs/OPERATIONAL_RETRIEVAL_MAP.md' },
  { source: 'global/opentrust/docs/REFERENCE_PROFILES.md',                   target: 'opentrust/docs/REFERENCE_PROFILES.md' },
  { source: 'global/opentrust/reference-map/README.md',                     target: 'opentrust/reference-map/README.md' },
  { source: 'global/opentrust/reference-map/TEAM_CONTEXT_MATRIX.md',         target: 'opentrust/reference-map/TEAM_CONTEXT_MATRIX.md' },
  { source: 'global/opentrust/reference-map/MCP_PROVIDER_CONTRACT.md',      target: 'opentrust/reference-map/MCP_PROVIDER_CONTRACT.md' },

  // Local semantic context catalog
  { source: 'global/context/README.md',                                      target: 'context/README.md' },
  { source: 'global/context/INDEX.md',                                       target: 'context/INDEX.md' },
  { source: 'global/context/MIGRATION_POLICY.md',                            target: 'context/MIGRATION_POLICY.md' },
  { source: 'global/context/RELATIONS.md',                                   target: 'context/RELATIONS.md' },
  { source: 'global/context/DEPRECATIONS.md',                                target: 'context/DEPRECATIONS.md' },
  { source: 'global/context/contexts/CTX01.md',                              target: 'context/contexts/CTX01.md' },
  { source: 'global/context/contexts/CTX02.md',                              target: 'context/contexts/CTX02.md' },
  { source: 'global/context/contexts/CTX03.md',                              target: 'context/contexts/CTX03.md' },
  { source: 'global/context/contexts/CTX04.md',                              target: 'context/contexts/CTX04.md' },
  { source: 'global/context/contexts/CTX05.md',                              target: 'context/contexts/CTX05.md' },
  { source: 'global/context/contexts/CTX06.md',                              target: 'context/contexts/CTX06.md' },
  { source: 'global/context/contexts/CTX07.md',                              target: 'context/contexts/CTX07.md' },
  { source: 'global/context/contexts/CTX08.md',                              target: 'context/contexts/CTX08.md' },
  { source: 'global/context/contexts/CTX09.md',                              target: 'context/contexts/CTX09.md' },
  { source: 'global/context/contexts/CTX10.md',                              target: 'context/contexts/CTX10.md' },
  { source: 'global/context/contexts/CTX11.md',                              target: 'context/contexts/CTX11.md' },
  { source: 'global/context/contexts/CTX12.md',                              target: 'context/contexts/CTX12.md' },
  { source: 'global/context/contexts/CTX13.md',                              target: 'context/contexts/CTX13.md' },
  { source: 'global/context/contexts/CTX14.md',                              target: 'context/contexts/CTX14.md' },
  { source: 'global/context/contexts/CTX15.md',                              target: 'context/contexts/CTX15.md' },
  { source: 'global/context/contexts/CTX16.md',                              target: 'context/contexts/CTX16.md' },
  { source: 'global/context/contexts/CTX17.md',                              target: 'context/contexts/CTX17.md' },
  { source: 'global/context/contexts/CTX18.md',                              target: 'context/contexts/CTX18.md' },
  { source: 'global/context/contexts/CTX19.md',                              target: 'context/contexts/CTX19.md' },
  { source: 'global/context/contexts/CTX20.md',                              target: 'context/contexts/CTX20.md' },
  { source: 'global/context/contexts/CTX21.md',                              target: 'context/contexts/CTX21.md' },
  { source: 'global/context/contexts/CTX22.md',                              target: 'context/contexts/CTX22.md' },
  { source: 'global/context/contexts/CTX23.md',                              target: 'context/contexts/CTX23.md' },
  { source: 'global/context/contexts/CTX24.md',                              target: 'context/contexts/CTX24.md' },
  { source: 'global/context/contexts/CTX25.md',                              target: 'context/contexts/CTX25.md' },
  { source: 'global/context/contexts/CTX26.md',                              target: 'context/contexts/CTX26.md' },
  { source: 'global/context/contexts/CTX27.md',                              target: 'context/contexts/CTX27.md' },
  { source: 'global/context/contexts/CTX28.md',                              target: 'context/contexts/CTX28.md' },
  { source: 'global/context/contexts/CTX29.md',                              target: 'context/contexts/CTX29.md' },
  { source: 'global/context/contexts/CTX30.md',                              target: 'context/contexts/CTX30.md' },
  { source: 'global/context/contexts/CTX31.md',                              target: 'context/contexts/CTX31.md' },
  { source: 'global/context/contexts/CTX32.md',                              target: 'context/contexts/CTX32.md' },
  { source: 'global/context/skills/SK01.md',                                 target: 'context/skills/SK01.md' },
  { source: 'global/context/skills/SK02.md',                                 target: 'context/skills/SK02.md' },
  { source: 'global/context/skills/SK03.md',                                 target: 'context/skills/SK03.md' },
  { source: 'global/context/skills/SK04.md',                                 target: 'context/skills/SK04.md' },
  { source: 'global/context/skills/SK05.md',                                 target: 'context/skills/SK05.md' },
  { source: 'global/context/skills/SK06.md',                                 target: 'context/skills/SK06.md' },
  { source: 'global/context/skills/SK07.md',                                 target: 'context/skills/SK07.md' },
  { source: 'global/context/skills/SK08.md',                                 target: 'context/skills/SK08.md' },
  { source: 'global/context/skills/SK09.md',                                 target: 'context/skills/SK09.md' },
  { source: 'global/context/skills/SK10.md',                                 target: 'context/skills/SK10.md' },
  { source: 'global/context/skills/SK11.md',                                 target: 'context/skills/SK11.md' },
  { source: 'global/context/skills/SK12.md',                                 target: 'context/skills/SK12.md' },
  { source: 'global/context/skills/SK13.md',                                 target: 'context/skills/SK13.md' },
  { source: 'global/context/skills/SK14.md',                                 target: 'context/skills/SK14.md' },
  { source: 'global/context/skills/SK15.md',                                 target: 'context/skills/SK15.md' },
  { source: 'global/context/skills/SK16.md',                                 target: 'context/skills/SK16.md' },
  { source: 'global/context/skills/SK17.md',                                 target: 'context/skills/SK17.md' },
  { source: 'global/context/skills/SK18.md',                                 target: 'context/skills/SK18.md' },
  { source: 'global/context/skills/SK19.md',                                 target: 'context/skills/SK19.md' },
  { source: 'global/context/skills/SK20.md',                                 target: 'context/skills/SK20.md' },
  { source: 'global/context/skills/SK21.md',                                 target: 'context/skills/SK21.md' },
  { source: 'global/context/skills/SK22.md',                                 target: 'context/skills/SK22.md' },
  { source: 'global/context/skills/SK23.md',                                 target: 'context/skills/SK23.md' },
  { source: 'global/context/skills/SK24.md',                                 target: 'context/skills/SK24.md' },
  { source: 'global/context/skills/SK25.md',                                 target: 'context/skills/SK25.md' },
  { source: 'global/context/skills/SK26.md',                                 target: 'context/skills/SK26.md' },
  { source: 'global/context/skills/SK27.md',                                 target: 'context/skills/SK27.md' },
  { source: 'global/context/skills/SK28.md',                                 target: 'context/skills/SK28.md' },
  { source: 'global/context/skills/SK29.md',                                 target: 'context/skills/SK29.md' },
  { source: 'global/context/skills/SK30.md',                                 target: 'context/skills/SK30.md' },
  { source: 'global/context/skills/SK31.md',                                 target: 'context/skills/SK31.md' },
  { source: 'global/context/skills/SK32.md',                                 target: 'context/skills/SK32.md' },
  { source: 'global/context/skills/SK33.md',                                 target: 'context/skills/SK33.md' },
  { source: 'global/context/skills/SK34.md',                                 target: 'context/skills/SK34.md' },
  { source: 'global/context/skills/SK35.md',                                 target: 'context/skills/SK35.md' },
  { source: 'global/context/skills/SK36.md',                                 target: 'context/skills/SK36.md' },
  { source: 'global/context/skills/SK37.md',                                 target: 'context/skills/SK37.md' },
  { source: 'global/context/skills/SK38.md',                                 target: 'context/skills/SK38.md' },
  { source: 'global/context/skills/SK39.md',                                 target: 'context/skills/SK39.md' },
  { source: 'global/context/agent-maps/AG01.md',                             target: 'context/agent-maps/AG01.md' },
  { source: 'global/context/agent-maps/AG02.md',                             target: 'context/agent-maps/AG02.md' },
  { source: 'global/context/agent-maps/AG03.md',                             target: 'context/agent-maps/AG03.md' },
  { source: 'global/context/agent-maps/AG04.md',                             target: 'context/agent-maps/AG04.md' },
  { source: 'global/context/agent-maps/AG05.md',                             target: 'context/agent-maps/AG05.md' },
  { source: 'global/context/agent-maps/AG06.md',                             target: 'context/agent-maps/AG06.md' },
  { source: 'global/context/agent-maps/AG07.md',                             target: 'context/agent-maps/AG07.md' },
  { source: 'global/context/agent-maps/AG08.md',                             target: 'context/agent-maps/AG08.md' },
  { source: 'global/context/agent-maps/AG09.md',                             target: 'context/agent-maps/AG09.md' },
  { source: 'global/context/agent-maps/AG10.md',                             target: 'context/agent-maps/AG10.md' },
  { source: 'global/context/agent-maps/AG11.md',                             target: 'context/agent-maps/AG11.md' },
  { source: 'global/context/agent-maps/AG12.md',                             target: 'context/agent-maps/AG12.md' },
  { source: 'global/context/agent-maps/AG13.md',                             target: 'context/agent-maps/AG13.md' },
  { source: 'global/context/agent-maps/AG14.md',                             target: 'context/agent-maps/AG14.md' },
  { source: 'global/context/agent-maps/AG15.md',                             target: 'context/agent-maps/AG15.md' },
  { source: 'global/context/agent-maps/AG16.md',                             target: 'context/agent-maps/AG16.md' },
  { source: 'global/context/agent-maps/AG17.md',                             target: 'context/agent-maps/AG17.md' },
  { source: 'global/context/agent-maps/AG18.md',                             target: 'context/agent-maps/AG18.md' },
  { source: 'global/context/agent-maps/AG19.md',                             target: 'context/agent-maps/AG19.md' },
  { source: 'global/context/agent-maps/AG20.md',                             target: 'context/agent-maps/AG20.md' },
  { source: 'global/context/agent-maps/AG21.md',                             target: 'context/agent-maps/AG21.md' },
  { source: 'global/context/bundles/B01.md',                                 target: 'context/bundles/B01.md' },
  { source: 'global/context/bundles/B02.md',                                 target: 'context/bundles/B02.md' },
  { source: 'global/context/bundles/B03.md',                                 target: 'context/bundles/B03.md' },
  { source: 'global/context/bundles/B04.md',                                 target: 'context/bundles/B04.md' },
  { source: 'global/context/bundles/B05.md',                                 target: 'context/bundles/B05.md' },
  { source: 'global/context/bundles/B06.md',                                 target: 'context/bundles/B06.md' },
  { source: 'global/context/bundles/B07.md',                                 target: 'context/bundles/B07.md' },
  { source: 'global/context/bundles/B08.md',                                 target: 'context/bundles/B08.md' },
  { source: 'global/context/bundles/B09.md',                                 target: 'context/bundles/B09.md' },
  { source: 'global/context/bundles/B10.md',                                 target: 'context/bundles/B10.md' },
  { source: 'global/context/bundles/B11.md',                                 target: 'context/bundles/B11.md' },
  { source: 'global/context/bundles/B12.md',                                 target: 'context/bundles/B12.md' },
  { source: 'global/context/bundles/B13.md',                                 target: 'context/bundles/B13.md' },
  { source: 'global/context/bundles/B14.md',                                 target: 'context/bundles/B14.md' },
  { source: 'global/context/bundles/B15.md',                                 target: 'context/bundles/B15.md' },
  { source: 'global/context/bundles/B16.md',                                 target: 'context/bundles/B16.md' },
  { source: 'global/context/bundles/B17.md',                                 target: 'context/bundles/B17.md' },
  { source: 'global/context/bundles/B18.md',                                 target: 'context/bundles/B18.md' },
  { source: 'global/context/bundles/B19.md',                                 target: 'context/bundles/B19.md' },
  { source: 'global/context/bundles/B20.md',                                 target: 'context/bundles/B20.md' },
  { source: 'global/context/bundles/B21.md',                                 target: 'context/bundles/B21.md' },
  { source: 'global/context/bundles/B22.md',                                 target: 'context/bundles/B22.md' },
  { source: 'global/context/bundles/B23.md',                                 target: 'context/bundles/B23.md' },
  { source: 'global/context/bundles/B24.md',                                 target: 'context/bundles/B24.md' },
  { source: 'global/context/docs/DOC_OPENCODE_AGENTS.md',                    target: 'context/docs/DOC_OPENCODE_AGENTS.md' },
  { source: 'global/context/docs/DOC_OPENCODE_CONFIG.md',                    target: 'context/docs/DOC_OPENCODE_CONFIG.md' },
  { source: 'global/context/docs/DOC_OPENCODE_AGENT_TEMPLATE.md',            target: 'context/docs/DOC_OPENCODE_AGENT_TEMPLATE.md' },
  { source: 'global/context/docs/DOC_OPENCODE_COMMANDS.md',                  target: 'context/docs/DOC_OPENCODE_COMMANDS.md' },
  { source: 'global/context/docs/DOC_OPENCODE_PERMISSIONS.md',               target: 'context/docs/DOC_OPENCODE_PERMISSIONS.md' },
  { source: 'global/context/docs/DOC_OPENCODE_SKILLS.md',                    target: 'context/docs/DOC_OPENCODE_SKILLS.md' },

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
