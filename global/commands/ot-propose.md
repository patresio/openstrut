---
description: Produce task contract with test plan and Retrieval Context selectors
agent: trust-lead
---

# Propose Command

**Purpose:** Produce task contract with acceptance criteria, test plan, and Retrieval Context selectors.

## Instructions

1. Read WORKFLOW.md and TASK_CONTRACT.md from installed `opentrust/docs/`.
2. Review Explore phase output or user request.
3. Produce a task contract including:
   - Objective and acceptance criteria
   - Scope (in scope / out of scope)
   - Retrieval Context selectors (CTX, SK, B, DOC) only when domain knowledge is needed
   - Test plan and validation strategy
   - Microincrements and delivery plan
4. Do not implement or mutate anything.
5. Stop at the Approval Gate.
6. Do not call the retrieval provider unless selectors are approved and knowledge is required.

## Input Format

```
ot-propose <objective> [CTX01,CTX02] [B08] [SK08] [DOC_OPENCODE_CONFIG]
```

## Workflow Step

Phase 2: Propose (Read Only)

| Aspect | Rule |
|--------|------|
| Allowed | writing proposal documents, comparing alternatives |
| Forbidden | implementation, file creation outside proposal |
| Retrieval | Must list required retrieval selectors in task contract |
| Output | Approved plan with Acceptance Criteria |

## Expected Output

Task Contract in markdown format:

```markdown
# Task: <Title>

## Objective
<What needs to be done and why>

## Acceptance Criteria
- [ ] <Criterion 1>
- [ ] <Criterion 2>
- [ ] <Criterion 3>

## Scope
### In Scope
- <Item 1>
- <Item 2>

### Out of Scope
- <Item 1>
- <Item 2>

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
- operational-reference-map

Policy:
- synthesize-only
- no raw chunks in commits
- cite source IDs when available
- use only approved selectors

## Test Plan
- <Test strategy>

## Microincrements
1. <Step 1>
2. <Step 2>

## Definition of Done
- [ ] Acceptance criteria met
- [ ] Tests pass
- [ ] Review approved
- [ ] Committed with conventional commit message
```

## Execution Report

```
[TASK]
Title: <generated title>
Classification: implementation | bugfix | refactoring | delivery

[SCOPE]
In: <items>
Out: <items>

[RETRIEVAL]
CTX: <list>
SK: <list>
B: <list>
DOC: <list>

[TESTS]
Strategy: <approach>
Coverage: <expected>

[DELIVERY]
Branch: <proposed>
Commit: <conventional format expected>

[NEXT]
Approve to proceed to Apply phase.
```
