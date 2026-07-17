---
name: opentrust-review
description: Two-axis review: Standards + Spec — approve or block with evidence.
---

## When to Use This Skill

When a diff is ready for independent review before delivery.

## Workflow

### Two-Axis Review

Run two independent review axes. When possible, use parallel sub-agents.

**Axis 1: Standards**
- Check repo conventions and code quality
- Apply Fowler code smell baseline (12 named smells):
  - Mysterious Name, Duplicated Code, Feature Envy
  - Data Clumps, Primitive Obsession, Repeated Switches
  - Shotgun Surgery, Divergent Change, Speculative Generality
  - Message Chains, Middle Man, Refused Bequest
- Check security: secrets, authorization, input validation
- Check architecture: boundaries, contracts, regressions

**Axis 2: Spec**
- Is the diff faithful to the task contract / PRD?
- Does it satisfy acceptance criteria?
- Are all in-scope items addressed?
- Are out-of-scope items avoided?

### Review Steps

1. Inspect the complete diff
2. Run Axis 1 (Standards) — independently
3. Run Axis 2 (Spec) — independently
4. Merge findings — deduplicate, prioritize
5. Approve or block. Report findings with evidence.

## Output

- Review outcome: approved or blocked
- Findings list per axis (must-fix, should-fix, accepted risks)
- Spec compliance summary

## Rules

- Read-only: do not edit code during review.
- Block on failed tests, security issues, or scope creep.
- Reference `docs/opencode/WORKFLOW.md` for review phase definition.
- When using sub-agents, each axis gets its own agent.
