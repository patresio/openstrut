---
description: Implement only an approved task contract with TDD when behavior changes
agent: engineering-lead
---

# Apply Command

**Purpose:** Implement only an approved task contract with TDD-First for behavioral changes.

## Branch Verification (MANDATORY)

Before any file edit or bash mutation:

1. Run `git branch --show-current`
2. If result is `main`, `master`, or empty (detached HEAD):
   - **STOP immediately**
   - Report: "Cannot mutate on main branch. Create a task branch first."
   - Do NOT proceed with any edits
3. If on a feature branch, proceed with approved mutations

This gate is mandated by ADR-005: Branch-Per-Task Enforcement.

## Instructions

1. Read WORKFLOW.md and TASK_CONTRACT.md from installed `opentrust/docs/`.
2. Load `AGENTS.md` global rules.
3. Read the approved Task Plan.
4. Validate that this matches the approved scope and contract.
5. Verify issue, branch, PR, and worktree decisions are recorded before mutation.
6. For behavioral changes, verify RED evidence before production code changes.
7. Implement one microincrement at a time:
   - TDD-First for behavioral changes (RED-GREEN-REFACTOR)
   - Run validation after each increment
   - Update Task Plan with evidence
8. Do not implement未经approved items or scope creep.
9. Stop when microincrement is complete.
10. Use the retrieval provider only when selectors are approved in the task contract.

## Input Format

```
ot-apply <task-id> [microincrement-id]
```

## Workflow Step

Phase 3: Apply (Mutation)

| Aspect | Rule |
|--------|------|
| Allowed | implementation within approved scope |
| Required | Task Plan, TDD-First gate for behavioral changes |
| Retrieval | Use only approved selectors from task contract |
| Rule | One microincrement at a time, validate after each |

## Expected Output

- Microincrement implemented
- Tests pass (GREEN)
- Task Plan updated with evidence
- Git diff reviewed for scope compliance

## Execution Report

```
[TASK]
ID: <task-id>
Status: in-progress

[APPROVED SCOPE]
Contract: <link or summary>
Acceptance: <criteria>

[TDD-FIRST]
RED: <test failure recorded>
GREEN: <test pass recorded>
Refactor: <if applicable>

[VALIDATION]
Tests: <pass/fail>
Build: <pass/fail>
Lint: <pass/fail>

[DIFF]
Scope: <approved/overrun>
Files: <changed>

[NEXT]
Approve to proceed to Review phase.
```
