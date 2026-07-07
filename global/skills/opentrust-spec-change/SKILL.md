---
name: opentrust-spec-change
description: Guide structured spec and design changes using Explore -> Propose before Apply.
---

## When to Use This Skill

When a feature or change requires formal specification, business rule analysis, impact assessment, or an approved plan before code.

## Workflow

1. **Explore** — read current state, identify scope, boundaries, and risks.
2. **Propose** — write proposal with acceptance criteria, dependencies, and Retrieval Context selectors.
3. **Approval Gate** — stop and present the plan.
4. **Apply** — implement only the approved proposal.

## Output

- Explore report (state, risks, boundaries)
- Proposal with acceptance criteria and test plan
- Task contract or specification document

## Rules

- Do not implement before approval.
- Use CTX/SK/B/DOC selectors when domain knowledge is needed.
- Reference `docs/opencode/WORKFLOW.md` for phase definitions.
