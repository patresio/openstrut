# Agents

This page documents agents available after installing the OpenTrust runtime.

## OpenTrust Topology

The installed runtime provides 38 agents: 9 leaders + 29 subagents, organized into 9 teams:

| Team | Lead | Subagents |
|------|------|-----------|
| Trust Coordination | trust-lead | coordination-facilitator, meeting-scribe, decision-logger |
| Product / Discovery | product-lead | product-discovery, requirements-analyzer, story-slicer |
| Architecture | architecture-lead | architecture-decision-designer, domain-modeler, api-database-designer, distributed-systems-reviewer |
| Engineering | engineering-lead | feature-implementer, code-refactoring-specialist, performance-engineer, security-reviewer, privacy-reviewer |
| Testing / Quality | quality-lead | tdd-engineer, integration-tester, testing-strategy-designer |
| Review / Governance | review-lead | code-reviewer, compliance-auditor, ux-accessibility-reviewer |
| DevOps / SRE | devops-lead | ci-cd-infrastructure-engineer, observability-designer, incident-triage-specialist |
| Delivery / Release | delivery-lead | release-manager, changelog-writer |
| Knowledge / Context | knowledge-lead | context-historian, reference-librarian, documentation-skill-creator |

## Permission Model

Agent permissions are configured in the installed `opencode.json` — **not** in agent file frontmatter.

- Lead agents (primary mode): `task: allow` — they can delegate work to subagents.
- Subagents: `task: deny` — they execute delegated tasks but do not re-delegate.
- Permission frontmatter was removed from all 9 lead agent files to eliminate conflicts. The config file is the sole permission authority.

## Retrieval / Barsa Policy

- Normal project work starts with **local evidence**: repository inspection, Git state, tests.
- Retrieval/Barsa is **conditional**: used only when the task contract specifies approved selectors (CTX, SK, B, DOC).
- Knowledge team is the **only** team authorized to call the retrieval provider directly.
- All other teams request retrieval by specifying selectors in their task contracts.

## Native OpenCode Agents

OpenCode provides two native primary agents:

### `build`

Default implementation agent with mutation capability. Follows OpenTrust workflow gates when active.

### `plan`

Read-only planning and exploration agent. Ideal for discovery before approval.

## Legacy Agents

Agent files from prior iterations remain on disk in `global/agents/` but are **not installed** into the runtime. They include: `sdd`, `project-rules-auditor`, `documentation-generator`, `harness-generator`, `performance-optimizer`, `skill-creator`, and domain agents AG01–AG12.
