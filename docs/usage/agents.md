# Agents

This page documents agents available after installing the OpenTrust runtime.

## OpenTrust Topology

The installed runtime provides 38 agents: 9 leaders + 29 subagents, organized into 9 teams:

| Team | Lead | Subagents |
|------|------|-----------|
| Trust Coordination | trust-lead — coordinates cross-team communication, decisions, meetings, and process health | coordination-facilitator, meeting-scribe, decision-logger |
| Product / Discovery | product-lead — product strategy, discovery, requirements, and story slicing | product-discovery, requirements-analyzer, story-slicer |
| Architecture | architecture-lead — structural decisions, domain modeling, API/database contracts, ADRs | architecture-decision-designer, domain-modeler, api-database-designer, distributed-systems-reviewer |
| Engineering | engineering-lead — implementation, refactoring, performance, security, and privacy | feature-implementer, code-refactoring-specialist, performance-engineer, security-reviewer, privacy-reviewer |
| Testing / Quality | quality-lead — test strategy, TDD, integration tests, quality gates | tdd-engineer, integration-tester, testing-strategy-designer |
| Review / Governance | review-lead — independent review, compliance, UX/accessibility, delivery gating | code-reviewer, compliance-auditor, ux-accessibility-reviewer |
| DevOps / SRE | devops-lead — CI/CD, infrastructure, observability, incident response | ci-cd-infrastructure-engineer, observability-designer, incident-triage-specialist |
| Delivery / Release | delivery-lead — release management, versioning, changelog, deployment coordination | release-manager, changelog-writer |
| Knowledge / Context | knowledge-lead — context retrieval, reference library, documentation, skills; sole retrieval-provider interface | context-historian, reference-librarian, documentation-skill-creator |

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

Legacy agent, command, and skill files from prior iterations are preserved in `archive/global/` — they are **not installed** into the runtime. These include 18 agents (`sdd`, `project-rules-auditor`, `documentation-generator`, `harness-generator`, `performance-optimizer`, `skill-creator`, and others), 10 commands (`eng-*`), and 39 skills.
