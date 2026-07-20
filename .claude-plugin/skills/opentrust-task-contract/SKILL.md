# opentrust-task-contract

Create or refine task contracts using `docs/opencode/TASK_CONTRACT.md`, including Retrieval Context selectors when needed.

## When to Use

- Creating new task contracts
- Refining existing task contracts
- Adding retrieval context to tasks

## Workflow

1. **Understand the task** — Gather requirements and context
2. **Define scope** — In-scope and out-of-scope items
3. **Set acceptance criteria** — Measurable, testable criteria
4. **Add retrieval context** — CTX, B, SK, DOC selectors
5. **Identify teams** — Which teams are involved
6. **List dependencies** — External and internal dependencies
7. **Assess risks** — Mitigation strategies

## Task Contract Template

```markdown
# Task: [Title]

## Objective
[What needs to be done and why]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Scope
### In Scope
- [Item 1]

### Out of Scope
- [Item 1]

## Retrieval Context
Required contexts:
- CTX...

Required bundles:
- B...

Required skills:
- SK...

Official docs:
- DOC...

## Teams Involved
| Team | Role |
|------|------|
| [Team] | [Responsibility] |

## Dependencies
- [Dependency 1]

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

## Examples

### Simple Task Contract

```markdown
# Task: Fix authentication bug

## Objective
Fix login failure when password contains special characters

## Acceptance Criteria
- [ ] Login works with special characters
- [ ] Existing tests pass
- [ ] New test added for special characters

## Scope
### In Scope
- Authentication module
- Password validation

### Out of Scope
- Other authentication methods
- UI changes

## Retrieval Context
Required contexts:
- CTX17 (Engineering workflow)

Required bundles:
- B11 (Engineering)

## Teams Involved
| Team | Role |
|------|------|
| Engineering | Implementation |
| Testing | Test validation |
```

### Complex Task Contract

```markdown
# Task: Implement multi-platform plugin distribution

## Objective
Transform OpenStrut into multi-platform plugin framework

## Acceptance Criteria
- [ ] Plugin manifests for all 4 platforms
- [ ] Bootstrap injection works
- [ ] Tool mapping layer complete
- [ ] Documentation updated

## Scope
### In Scope
- Plugin manifests
- Bootstrap injection
- Tool mapping
- Installer updates

### Out of Scope
- Skill format changes
- Agent topology changes

## Retrieval Context
Required contexts:
- CTX01 (OpenTrust foundation)
- CTX17 (Engineering workflow)

Required bundles:
- B01 (Foundation)
- B11 (Engineering)

Required skills:
- SK01 (opentrust-task-contract)

Official docs:
- DOC_OPENCODE_CONFIG

## Teams Involved
| Team | Role |
|------|------|
| Architecture | Design |
| Engineering | Implementation |
| Testing | Validation |
| Review | Review |
| Delivery | Delivery |
```
