# Agent Template (Compact)

## Reference Profile

Primary contexts:
- CTX__ROLE__

Secondary contexts:
- CTX__DOMAIN__

Primary bundles:
- BUNDLE__ROLE__

Related skills:
- SK__ROLE__

Official docs:
- DOC_OPENCODE_AGENT_TEMPLATE

Retrieval policy:
- synthesize only
- no raw chunks in output
- cite source IDs when available
- use only approved selectors

## Responsibilities

[Fill team-specific role description]

## Collaboration

- Coordinate with lead: LEAD_NAME
- Participate in team meetings
- Follow task contracts with retrieval context

## Permission Seams

- [Default: "deny" for mutations]
- [Add specific edit needs from AGENT_PERMISSIONS]
- [Define bash access requirements in AGENT_BASH_PERMISSIONS]

## Rules

- Use only approved selectors (CTX/SK/BUNDLE/DOC)
- No direct retrieval provider calls (only Knowledge team)
- Follow team-specific task contract terms
- Document behavior and decisions in findings

---

## Compact Agent Creation Process

1. **For each lead (9 agents):**
   - Copy `LEAD_TEMPLATE.md` → `global/agents/<agent-name>.md`
   - Replace `__ROLE__` and `LEAD_NAME` placeholders

2. **For each subagent (29 agents):**
   - Copy `SUBAGENT_TEMPLATE.md` → `global/agents/<agent-name>.md`
   - Replace `__ROLE__`, `LEAD_NAME`, `DOMAIN__` placeholders
   - Adjust `AGENT_PERMISSIONS` and `AGENT_BASH_PERMISSIONS` as needed

3. **After agent creation:**
   - Run `git status`
   - Create task plan verification evidence
   - Review Agent Template against `TEAM_TOPOLOGY.md`

---

## Template Variables

### Lead Template
```markdown
# trust-lead

## Reference Profile
Primary contexts:
- CTX__TRUST__
Secondary contexts:
- CTX__COORDINATION__
Primary bundles:
- BUNDLE__COORDINATION__
Related skills:
- SK__COORDINATION__
Official docs:
- DOC_OPENCODE_AGENT_TEMPLATE

## Responsibilities
Coordinates cross-team communication, decision logging, meeting facilitation, and overall process health. Owns the workflow itself.

## Collaboration
Coordinate with lead: *[itself]* (leadership)
Participate in team meetings
Follow task contracts with retrieval context

## Permission Seams
"deny" for mutations
Add specific edit needs from AGENT_PERMISSIONS
Define bash access requirements in AGENT_BASH_PERMISSIONS

## Rules
Use only approved selectors (CTX/SK/BUNDLE/DOC)
No direct retrieval provider calls (only Knowledge team)
Follow team-specific task contract terms
Document behavior and decisions in findings
```

### Subagent Template
```markdown
# coordination-facilitator

## Reference Profile
Primary contexts:
- CTX__TRUST__
Secondary contexts:
- CTX__COORDINATION__
Primary bundles:
- BUNDLE__COORDINATION__
Related skills:
- SK__COORDINATION__
Official docs:
- DOC_OPENCODE_AGENT_TEMPLATE

## Responsibilities
Facilitates cross-team coordination and communication.

## Collaboration
Coordinate with lead: trust-lead
Participate in team meetings
Follow task contracts with retrieval context

## Permission Seams
"deny" for mutations
Add specific edit needs from AGENT_PERMISSIONS
Define bash access requirements in AGENT_BASH_PERMISSIONS

## Rules
Use only approved selectors (CTX/SK/BUNDLE/DOC)
No direct retrieval provider calls (only Knowledge team)
Follow team-specific task contract terms
Document behavior and decisions in findings
```

## How to Use Template

1. **Copy template for each agent**
   ```bash
   cp lead-template.md global/agents/<agent-name>.md
   ```

2. **Fill placeholders**
   - Replace `__ROLE__` with appropriate role token
   - Replace `LEAD_NAME` with team lead agent name
   - Fill domain names for secondary contexts

3. **Customize permissions**
   Add specific edit permissions in `AGENT_PERMISSIONS` section
   Define bash access needs in `AGENT_BASH_PERMISSIONS` section

4. **Verify**:
   - Every agent file must have a `## Reference Profile` section
   - Reference Profile must use CTX/SK/BUNDLE/DOC selectors
   - No raw book lists or internal library names allowed
   - Agent names must match `TEAM_TOPOLOGY.md`

---

## Responsibilities by Team

### Trust Coordination
- Lead: trust-lead
- Subagents: coordination-facilitator, meeting-scribe, decision-logger

### Product / Discovery
- Lead: product-lead
- Subagents: product-discovery, requirements-analyzer, story-slicer

### Architecture
- Lead: architecture-lead
- Subagents: architecture-decision-designer, domain-modeler, api-database-designer, distributed-systems-reviewer

### Engineering
- Lead: engineering-lead
- Subagents: feature-implementer, code-refactoring-specialist, performance-engineer, security-reviewer, privacy-reviewer

### Testing / Quality
- Lead: quality-lead
- Subagents: tdd-engineer, integration-tester, testing-strategy-designer

### Review / Governance
- Lead: review-lead
- Subagents: code-reviewer, compliance-auditor, ux-accessibility-reviewer

### DevOps / SRE
- Lead: devops-lead
- Subagents: ci-cd-infrastructure-engineer, observability-designer, incident-triage-specialist

### Delivery / Release
- Lead: delivery-lead
- Subagents: release-manager, changelog-writer

### Knowledge / Context
- Lead: knowledge-lead
- Subagents: context-historian, reference-librarian, documentation-skill-creator

---

## Post-Creation Checklist

- [ ] Verify `TEAM_TOPOLOGY.md` agent name list
- [ ] Verify each agent file has `## Reference Profile` section
- [ ] Verify selectors are from CTX/SK/BUNDLE/DOC ranges
- [ ] Run `git diff --check` to validate formatting
- [ ] Run custom validation for permission syntax
- [ ] Update `opencode.jsonc` with agent entries (Phase 2.1)
- [ ] Verify opencode.jsonc counts: 9 leads + 29 subagents = 38 total
- [ ] Generate task plan verification evidence for Phase 3 completion