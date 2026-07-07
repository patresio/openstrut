---
name: opentrust-review
description: Review diff, tests, security, architecture, and docs — approve or block with evidence.
---

## When to Use This Skill

When a diff is ready for independent review before delivery.

## Workflow

1. Inspect the complete diff: scope, correctness, edge cases, test evidence.
2. Check security: secrets, authorization, input validation.
3. Check architecture: boundaries, contracts, regressions.
4. Check documentation: changelog, specs, runbooks.
5. Approve or block. Report findings with evidence.

## Output

- Review outcome: approved or blocked
- Findings list (must-fix, should-fix, accepted risks)

## Rules

- Read-only: do not edit code during review.
- Block on failed tests, security issues, or scope creep.
- Reference `docs/opencode/WORKFLOW.md` for review phase definition.
