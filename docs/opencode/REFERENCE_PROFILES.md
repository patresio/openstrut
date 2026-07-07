# OpenTrust Reference Profiles

## Purpose

Reference profiles allow agents to declare their knowledge requirements declaratively. Instead of embedding book lists or content in agent prompts, agents use selectors (CTX, SK, AG, BUNDLE, DOC) to specify what knowledge they need.

## Profile Structure

Every agent and subagent file includes a `## Reference Profile` section:

```markdown
## Reference Profile

Primary contexts:
- CTX14  (Architecture decisions)
- CTX15  (Domain modeling)

Secondary contexts:
- CTX16  (Distributed systems)

Primary bundles:
- B08    (architecture-core)
- B09    (domain-modeling-core)

Related skills:
- SK08   (architecture-decision)
- SK09   (domain-modeling)

Official docs:
- DOC_OPENCODE_CONFIG

Retrieval policy:
- synthesize only
- no raw chunks in output
- cite source IDs when available
- use only approved selectors

Use references when:
- making architecture decisions
- evaluating trade-offs
- writing ADRs

Do not use references when:
- trivial code formatting
- routine CRUD operations
```

## Selector Categories

### Contexts (CTX)

Knowledge domains that define the operational area. Examples: architecture decisions, testing strategy, domain modeling.

### Skills (SK)

Reusable procedures that an agent can invoke. Examples: architecture-decision skill, tdd-first skill, code-review skill.

### Agents (AG)

References to legacy agent capabilities that may inform prompt design. These are informational only — not active retrieval.

### Bundles (B)

Grouped sets of contexts for common task types. Examples: engineering-core, architecture-core, review-core.

### Official Docs (DOC)

References to official OpenCode documentation files.

## Profile Types

| Type | When to Use |
|------|-------------|
| Primary | Core domain knowledge — always needed |
| Secondary | Occasional or situational knowledge |
| Bundle | Complex tasks spanning multiple contexts |
| None | Trivial or fully-scoped tasks |

## Profile by Team Role

| Team | Typical Primary Contexts | Typical Bundles |
|------|------------------------|-----------------|
| Trust Coordination | CTX01, CTX03, CTX23 | B01, B13 |
| Product | CTX08, CTX09, CTX10, CTX12 | B04, B05 |
| Architecture | CTX14, CTX15, CTX16, CTX22 | B08, B09, B10 |
| Engineering | CTX17, CTX18, CTX21, CTX24, CTX25 | B11, B12, B15, B16 |
| Testing | CTX27, CTX23, CTX25 | B17, B16 |
| Review | CTX14, CTX17, CTX18, CTX21, CTX26, CTX27 | B08, B11, B12, B15, B18, B17 |
| DevOps | CTX19, CTX20, CTX28, CTX16 | B13, B14, B19, B10 |
| Delivery | CTX19, CTX23, CTX03 | B13, B05 |
| Knowledge | CTX01, CTX02, CTX03, CTX29, CTX30, CTX31 | B01, B02, B20, B21, B22 |

## Guidelines

1. Every agent must have a `## Reference Profile` section
2. Every subagent must have at least one context or explicit `none`
3. Selectors must reference IDs that exist in the Operational Retrieval Map
4. No agent file may contain inline book lists, excerpts, or personal library names
5. Retrieval policy should specify when references are and are not needed
