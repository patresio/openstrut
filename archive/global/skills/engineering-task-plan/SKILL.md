---
name: engineering-task-plan
description: Create, resume, and maintain the approved repository-local execution ledger after the Approval Gate and before mutation. Use for implementation, bugfix, refactoring, delivery, or incident work requiring tracked state and evidence.
compatibility: opencode
---

## Purpose
Maintain the explicit, stateful execution ledger for repository modifications, ensuring all changes are tracked, evidenced, and driven by approved microincrements.

## When to Load
- Immediately after human approval of a plan (the Approval Gate), before beginning mutation.
- When resuming an interrupted session or compacted context.
- When beginning any tracked implementation, bugfix, refactoring, delivery, or incident recovery.

## Do Not Load When
- Performing read-only requests or research.
- An Approval Gate decision has not yet been obtained.
- Writing a fictional plan to bypass the Approval Gate.

## Required Inputs
- The human-approved objective, scope, and exclusions.

## Procedure
1. Adopt the existing active plan if one exists; otherwise, create a new one under `.opencode/task-plans/`.
2. Record the exact approved scope and explicit exclusions.
3. Define the immediate microincrements. Do not pre-check future steps.
4. Maintain exactly one current execution state and one next action at any time.
5. Record concrete evidence for completed steps before marking them done.
6. If a deviation from the plan occurs, document it factually.
7. If blocked or unable to proceed safely, record the blocker, state `BLOCKED — REAPPROVAL REQUIRED`, and stop.
8. Resume gracefully if context was compacted or interrupted.
9. Upon completion, note the archival state and closure.

## Required Evidence
- File creation/modification paths.
- Test outputs, command execution results, or log snippets proving step completion.

## Stop Conditions
- Stop when the task is blocked and requires reapproval.
- Stop when the task is fully completed.

## Output
- An accurate, continuously updated Task Plan markdown file that reflects reality.

## Interactions
- Does not inherently delegate tasks. Acts as the central ledger for the `build` agent's state across all other skill executions.
