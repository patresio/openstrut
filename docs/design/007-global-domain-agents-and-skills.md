# Design 007 — Global Domain Agents and Skills Materialization

## Decision

Materialize the `mapa_operacional.xlsx` domain catalog as globally installable OpenCode artifacts, but keep operational separation between:

1. **harness process agents/skills** — govern engineering workflow;
2. **domain specialist agents/skills** — apply curated knowledge through Barsa MCP;
3. **native OpenCode agents** — `build` and `plan`, not duplicated in the spreadsheet.

## Evidence

Barsa research confirms multi-agent systems can improve performance, reliability, and flexibility, but coordination complexity increases and requires explicit orchestration, communication rules, and dependency tracking. Barsa RAG/MCP research confirms retrieval should be routed through structured context and MCP interfaces, with evaluation of context relevance and response accuracy.

## Current Inventory

### Already Runtime

Agents:

- `AG13` `sdd`
- `AG14` `code-reviewer`
- `AG15` `project-rules-auditor`

Skills:

- `SK19` `engineering-bdd-discovery`
- `SK20` `engineering-code-review`
- `SK21` `engineering-delivery`
- `SK22` `engineering-incident-triage`
- `SK23` `engineering-legacy-change`
- `SK24` `engineering-project-bootstrap`
- `SK25` `engineering-sdd-change`
- `SK26` `engineering-task-plan`
- `SK27` `engineering-tdd-first`

### Domain Runtime

Agents:

- `AG01` `knowledge-system-designer`
- `AG02` `personal-operating-system-advisor`
- `AG03` `business-product-strategist`
- `AG04` `career-communication-advisor`
- `AG05` `software-architect`
- `AG06` `backend-data-reviewer`
- `AG07` `devops-sre-advisor`
- `AG08` `code-quality-testing-reviewer`
- `AG09` `security-infrastructure-reviewer`
- `AG10` `frontend-ux-reviewer`
- `AG11` `ai-rag-agent-architect`
- `AG12` `health-exercise-nutrition-researcher`

Skills:

- `SK01`–`SK18` from `03_SKILLS`.

## Deduplication Rule

Domain specialists must not replace harness process agents.

Examples:

| Domain artifact | Similar harness artifact | Resolution |
|---|---|---|
| `SK14 code-refactoring` | `SK23 engineering-legacy-change` | `SK14` provides refactoring domain heuristics; `SK23` governs safe legacy workflow. |
| `SK16 testing-strategy` | `SK27 engineering-tdd-first` | `SK16` designs test strategy; `SK27` enforces RED/GREEN. |
| `AG08 code-quality-testing-reviewer` | `AG14 code-reviewer` | `AG08` is a domain specialist; `AG14` is final independent diff reviewer. |
| `AG05 software-architect` | `AG13 sdd` | `AG05` supplies architecture trade-off advice; `AG13` owns spec generation and Approval Gate. |
| `SK08 architecture-decision` | `SK25 engineering-sdd-change` | `SK08` produces ADR/tradeoffs; `SK25` produces OpenSpec change package. |

## Runtime Status

Every spreadsheet item now has fields:

- `status`
- `runtime_scope`
- `source_type`
- `barsa_collection`
- `barsa_contexts`
- `barsa_bundles`
- `install_global`
- deduplication metadata

Recommended statuses:

- `active`: existing harness runtime artifacts;
- `specialized`: installed domain specialists, not default;
- `pilot`: first domain specialist to evaluate deeply.

`AG11 ai-rag-agent-architect` and `SK17 rag-agent-design` remain the preferred pilot because they align directly with Barsa/MCP/RAG.

## Agent Runtime Contract

Each materialized agent must include:

```yaml
---
description: ...
mode: subagent
model: 9router/combo-main
permission:
  edit: deny
  task: deny
  external_directory: deny
  bash:
    "*": deny
x-harness:
  agent_id: AG##
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: technology
    contexts: [CTX##]
    bundles: [B##]
  primary_skills: []
  support_skills: []
  cowork_agents: []
  workflow_mode: sequential
---
```

Default for domain agents: read-only. Mutating implementation remains with `build` after explicit approval.

## Skill Runtime Contract

Each materialized skill must include:

```yaml
---
name: skill-name
description: ...
compatibility: opencode
x-harness:
  skill_id: SK##
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: technology
    contexts: [CTX##]
    bundles: []
  usable_by_agents: []
---
```

## Barsa Source Policy

Agents and skills must request knowledge through Barsa logical routing:

1. collection;
2. context (`CTX##`);
3. bundle (`B##`);
4. project profile (`PRJ##`);
5. skill ID;
6. agent ID.

They must not reference local filesystem library paths as runtime interface.

## Installation State

Implemented runtime materialization:

1. `global/agents/*.md` exists for `AG01`–`AG12`;
2. `global/skills/*/SKILL.md` exists for `SK01`–`SK18`;
3. `src/installer/inventory.js` installs domain agents, domain skills, and workflow definitions;
4. inventory count tests cover the expanded artifact set;
5. package metadata tests cover agent/skill/workflow counts;
6. validation remains `npm test` and `npm pack --dry-run --ignore-scripts`.

## Non-goals

- no autonomous swarm by default;
- no broad permissions for domain agents;
- no direct library-path retrieval;
- no replacement of `build` as implementation owner;
- no package publish in this phase.
