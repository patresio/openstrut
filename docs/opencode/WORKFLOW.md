# OpenTrust Workflow

## Principles

1. **Evidence before decision** — every gate requires demonstrable evidence
2. **Approval before mutation** — no code changes without explicit plan approval
3. **Smallest viable increment** — microincrements, not monoliths
4. **Retrieval by contract** — only the Knowledge team calls the Retrieval Provider directly

## Phases

### 1. Explore (Read Only)

| Aspect | Rule |
|--------|------|
| Allowed | reading, searching, git history, diagnostics |
| Forbidden | edits, installations, branch changes, commits |
| Retrieval | May call Knowledge lead to identify relevant CTX/BUNDLE/SK/DOC selectors |

### 2. Propose (Read Only)

| Aspect | Rule |
|--------|------|
| Allowed | writing proposal documents, comparing alternatives |
| Forbidden | implementation, file creation outside proposal |
| Retrieval | Must list required retrieval selectors in task contract |
| Output | Approved plan with Acceptance Criteria |

### 3. Apply (Mutation)

| Aspect | Rule |
|--------|------|
| Allowed | implementation within approved scope |
| Required | Task Plan, TDD-First gate for behavioral changes |
| Retrieval | Use only approved selectors from task contract |
| Rule | One microincrement at a time, validate after each |

### 4. Review (Read Only)

| Aspect | Rule |
|--------|------|
| Allowed | reading diff, running tests, inspecting evidence |
| Forbidden | editing code during review |
| Retrieval | Must verify selectors were used appropriately |
| Output | Review report with findings or approval |

### 5. Ship (Delivery)

| Aspect | Rule |
|--------|------|
| Allowed | archive, commit, push, PR |
| Required | all tests pass, review approved, diff inspected |
| Retrieval | Must not include private retrieval content in commits |

## Workflow Diagram

```
[Request] → Explore → Propose → Approval Gate → Apply → Review → Ship
                ↑          |                        |         |
                +----------+------------------------+---------+
                           |                        |
                      (feedback loop)         (fix findings)
```

## Retrieval Rules by Phase

| Phase | Knowledge Team Role | Selector Requirement |
|-------|-------------------|---------------------|
| Explore | Called on demand to find relevant selectors | Not required |
| Propose | Selectors listed in task contract | Required |
| Apply | Knowledge provides synthesis from approved selectors | Must match contract |
| Review | Verify selector usage | Must match contract |
| Ship | N/A | No retrieval content in artifacts |

## Gate Checklist

Every phase transition must pass:

- [ ] Evidence recorded
- [ ] Previous phase complete
- [ ] No scope creep
- [ ] Approval obtained (when required)
- [ ] Task Plan updated
