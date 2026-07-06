# Barsa Agents Map

Derived from `mapa_operacional.xlsx` sheet `04_AGENTS`.

## Current Proposed Domain Agents

- `AG01` knowledge-system-designer
- `AG02` personal-operating-system-advisor
- `AG03` business-product-strategist
- `AG04` career-communication-advisor
- `AG05` software-architect
- `AG06` backend-data-reviewer
- `AG07` devops-sre-advisor
- `AG08` code-quality-testing-reviewer
- `AG09` security-infrastructure-reviewer
- `AG10` frontend-ux-reviewer
- `AG11` ai-rag-agent-architect
- `AG12` health-exercise-nutrition-researcher

## Harness-Global Agents

- `AG13` sdd
- `AG14` code-reviewer
- `AG15` project-rules-auditor
- `AG16` documentation-generator
- `AG17` harness-generator
- `AG18` skill-creator
- `AG19` performance-optimizer
- `AG20` release-manager
- `AG21` compliance-auditor

## Operational Rule

`AG01`–`AG12` are cataloged domain-agent designs, not yet installed harness-global agents. `AG13`–`AG21` are installed harness-global agents and exist under `global/agents/`.

## Next Materialization Rule

A domain agent should only be materialized into `global/agents/` after:

1. approved contract;
2. explicit source policy;
3. eval cases;
4. limits and safety rules;
5. demonstrated need in real project flow.
