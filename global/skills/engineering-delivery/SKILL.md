---
name: engineering-delivery
description: Finalize approved work through review, archive, commit, push, and pull request using repository conventions and explicit delivery authorization.
compatibility: opencode
---

## Purpose
Safely and consistently deliver completed, validated, and reviewed work to the repository following established conventions.

## When to Load
- When an implementation or task has been completed, validated, and successfully passed code review.
- When explicitly authorized to deliver the work.

## Do Not Load When
- Validation or review has not occurred or failed.
- The work is incomplete.
- Repeating a successful delivery operation without a changed state.

## Required Inputs
- Explicit delivery authorization.
- The active Task Plan showing completion evidence.

## Procedure
1. Verify completion evidence and the complete diff review.
2. Ensure documentation or OpenSpec archives are updated if applicable.
3. Reuse the existing issue, branch, worktree, or PR rather than creating duplicates.
4. Prepare a coherent commit message based on repository conventions.
5. Verify whether push is already explicitly authorized by the approved scope. Request approval only when it is missing.
6. Verify whether PR creation or update is already explicitly authorized and required by the repository workflow. Request approval only when it is missing.
7. Do not request the same delivery approval again when the approved scope, delivery target, branch, and risk remain materially unchanged.
8. Execute the commit, push, and PR operations.
9. Record the final status, log, remote, and PR evidence in the Task Plan.
10. Generate a factual final report for the human operator.

## Required Evidence
- A clean working tree status (`git status`).
- Git log entry of the commit.
- Success output of the push and/or PR creation.

## Stop Conditions
- Stop if there are unresolved validation or review failures.
- Stop if the base branch has changed silently and requires a merge or rebase decision.
- Stop and do not force push without explicit, separate authorization.
- Stop if attempting to commit unrelated or secret material.

## Output
- Successfully committed and pushed code, and a factual final report.

## Interactions
- Follows `engineering-code-review` and finalized validation.
