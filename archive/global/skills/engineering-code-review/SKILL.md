---
name: engineering-code-review
description: Orchestrate an independent read-only review of an approved implementation diff, validation evidence, tests, scope, security, contracts, migrations, and regressions before delivery.
compatibility: opencode
---

## Purpose
Ensure high code quality and strict adherence to requirements by orchestrating an independent, read-only review of the implementation before delivery.

## When to Load
- After implementation and focused validation are complete.
- Before initiating the delivery or commit process.

## Do Not Load When
- The code is still actively being implemented or is known to be failing tests.
- There are no material changes to review.

## Required Inputs
- The approved scope and acceptance criteria.
- The active Task Plan.
- The complete implementation diff.
- Validation evidence (test results).

## Procedure
1. Verify that implementation and focused validation are complete.
2. Collect the approved scope, acceptance criteria, Task Plan, complete diff, and validation evidence.
3. Invoke the `code-reviewer` subagent with this bounded context.
4. Validate the returned findings from the reviewer.
5. Classify the findings as blocking, accepted risk, or non-blocking.
6. If blocking findings exist, apply the approved corrections (the `build` agent edits the files).
7. Rerun only the affected validation and tests.
8. Request another reviewer pass only if material code was changed.
9. Record the review evidence and classifications in the Task Plan.

## Required Evidence
- The raw output from the `code-reviewer` subagent.
- The classification of any findings and actions taken.

## Stop Conditions
- Stop and do not proceed to delivery if unresolved blocking findings remain.
- Stop if the `code-reviewer` subagent attempts to edit files (this violates its read-only constraint).

## Output
- A reviewed, verified, and corrected implementation diff ready for delivery.
- Review evidence in the Task Plan.

## Interactions
- **code-reviewer**: Receives the review delegation and returns findings. It must not edit files or automatically accept its own output.
- Hands off to `engineering-delivery` when review is complete.
