# OpenTrust Task Contract

## Purpose

A task contract is the formal specification of work between teams. It ensures every task has clear scope, acceptance criteria, retrieval requirements, and delivery rules.

## Template

```markdown
# Task: [Title]

## Objective
[What needs to be done and why]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Scope
### In Scope
- [Item 1]
- [Item 2]

### Out of Scope
- [Item 1]
- [Item 2]

## Retrieval Context

Required contexts:
- CTX...

Required bundles:
- B...

Required skills:
- SK...

Official docs:
- DOC...

Provider:
- none | operational-reference-map | both

Policy:
- synthesize-only
- no raw chunks in commits
- cite source IDs when available
- use only approved selectors

## Teams Involved
| Team | Role |
|------|------|
| [Team] | [Responsibility] |

## Dependencies
- [Dependency 1]
- [Dependency 2]

## Risks
- [Risk 1] → [Mitigation]

## Definition of Done
- [ ] Acceptance criteria met
- [ ] Tests pass
- [ ] Review approved
- [ ] Documentation updated
- [ ] Committed with conventional commit message
```

## Retrieval Context Rules

1. **Primary contexts** must always be specified when domain knowledge is needed
2. **Bundles** group related contexts for complex tasks
3. **Skills** indicate which reusable procedures apply
4. **Official docs** reference OpenCode documentation by DOC ID
5. **Provider** declares which retrieval source to use
6. **Policy** governs how synthesis is delivered and used

## Contract Lifecycle

1. **Draft** — written during Propose phase
2. **Approved** — signed off at Approval Gate
3. **Active** — being executed in Apply phase
4. **Review** — under post-implementation review
5. **Closed** — delivered and accepted

## Selector Naming Convention

| Prefix | Range | Description |
|--------|-------|-------------|
| CTX | 01–32 | Operational contexts (knowledge domains) |
| SK | 01–39 | Reusable skills |
| AG | 01–21 | Legacy agent references |
| B | 01–24 | Reference bundles (grouped contexts) |
| DOC | 01–16 | Official OpenCode documentation files |

Example: `CTX14`, `B08`, `SK08`, `DOC_OPENCODE_CONFIG`
