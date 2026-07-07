---
description: Review diff, tests, security, architecture and docs; approve or block
agent: review-lead
---

# Review Command

**Purpose:** Independent review of implementation diff, validation evidence, tests, security, architecture, and docs.

## Instructions

1. Load `docs/opencode/WORKFLOW.md` and `docs/opencode/TASK_CONTRACT.md`.
2. Load `docs/opencode/PERMISSIONS.md`.
3. Read the approved Task Plan and implementation diff.
4. Review for:
   - Acceptance criteria compliance
   - TDD-First evidence (RED-GREEN)
   - Security and privacy issues
   - Architecture and design patterns
   - Documentation completeness
   - Scope creep (unintended changes)
5. Approve or block with findings.
6. Do not modify code during review.

## Input Format

```
ot-review <task-id> [diff-path]
```

## Workflow Step

Phase 4: Review (Read Only)

| Aspect | Rule |
|--------|------|
| Allowed | reading diff, running tests, inspecting evidence |
| Forbidden | editing code during review |
| Retrieval | Must verify selectors were used appropriately |
| Output | Review report with findings or approval |

## Expected Output

Review Report:

```
[REVIEW]
Task: <task-id>
Status: APPROVED | BLOCKED

[FINDINGS]
Security: <pass/fail/findings>
Privacy: <pass/fail/findings>
Architecture: <pass/fail/findings>
Tests: <pass/fail/findings>
Docs: <pass/fail/findings>
Scope: <compliant/violations>

[EVIDENCE]
TDD-RED: <verified/unverified>
TDD-GREEN: <verified/unverified>
Validation: <tests/build/lint status>

[SELELCTOR USAGE]
CTX: <verified/unverified>
SK: <verified/unverified>
B: <verified/unverified>
DOC: <verified/unverified>

[NEXT]
Approve to proceed to Ship phase.
Block to return to Apply phase.
```
