---
name: opentrust-task-contract
description: Create or refine task contracts using docs/opencode/TASK_CONTRACT.md, including Retrieval Context selectors when needed.
---

## When to Use This Skill

When a task needs formal scope, acceptance criteria, retrieval requirements, and delivery rules before implementation.

## Workflow

1. Read `docs/opencode/TASK_CONTRACT.md`.
2. Assess scope: in/out, risks, dependencies.
3. Write objective and acceptance criteria.
4. Add Retrieval Context (CTX/SK/B/DOC) selectors if domain knowledge is needed.
5. Define teams involved and Definition of Done checklist.

## Output

A completed task contract ready for approval gate.

## Rules

- Use `docs/opencode/TASK_CONTRACT.md` as the canonical template.
- Selectors must reference IDs that exist in the Operational Retrieval Map.
- No raw chunks. No private or book content.
- Include test plan when behavior or rules change.
