# Design 008 — Sequential Multi-Agent Workflows

## Decision

Use sequential workflows as the default coordination model for multiple agents.

Do not use autonomous swarms by default. Barsa research shows multi-agent systems can improve reliability and specialization, but also increase coordination complexity. Therefore, workflow order, handoff contracts, dependency tracking, and validation must be explicit.

## Principles

1. One owner per step.
2. One output contract per step.
3. Sequential handoff by default.
4. Parallelism only when file ownership and dependencies are independent.
5. `build` remains implementation owner.
6. Specialists advise or review; they do not silently mutate.
7. Barsa retrieval must be scoped to the current step.

## Workflow Schema

Recommended YAML shape:

```yaml
name: rag-feature-sequential
description: Design and validate a RAG/MCP feature before implementation.
mode: sequential
inputs:
  objective: string
  repository: string
steps:
  - name: specify-change
    agent: sdd
    skills:
      - engineering-sdd-change
      - engineering-bdd-discovery
    handoff:
      produces:
        - proposal
        - tasks
        - spec
      next: rag-architecture
  - name: rag-architecture
    agent: ai-rag-agent-architect
    skills:
      - rag-agent-design
      - distributed-systems-review
    barsa:
      contexts:
        - CTX29
        - CTX30
        - CTX31
      bundles:
        - B21
    handoff:
      consumes:
        - proposal
        - spec
      produces:
        - retrieval-design
        - evaluation-plan
  - name: architecture-review
    agent: software-architect
    skills:
      - architecture-decision
      - domain-modeling
    handoff:
      produces:
        - tradeoffs
        - ADR recommendation
```

## Validation Rules

A workflow is valid only if:

- every step has a unique name;
- every step declares an agent;
- every agent exists in runtime or planned runtime catalog;
- every skill exists in runtime or planned runtime catalog;
- every handoff consumer has a producer;
- sequential mode has a deterministic order;
- cowork mode declares ownership and conflict rules;
- Barsa source policy uses logical routing keys.

## Core Workflows

### `feature-spec-to-build`

Purpose: convert informal feature into build-ready plan.

1. `sdd`
2. `project-rules-auditor`
3. optional domain specialist (`software-architect`, `backend-data-reviewer`, etc.)
4. `build` after Approval Gate

### `backend-safe-change`

Purpose: backend/API/data change with review before implementation.

1. `sdd`
2. `backend-data-reviewer`
3. `security-infrastructure-reviewer`
4. `code-quality-testing-reviewer`
5. `build`
6. `code-reviewer`

### `rag-feature-sequential`

Purpose: RAG/MCP/agentic feature.

1. `sdd`
2. `ai-rag-agent-architect`
3. `software-architect`
4. `backend-data-reviewer`
5. `devops-sre-advisor`
6. `code-reviewer`

### `product-to-implementation`

Purpose: product idea into technical plan.

1. `business-product-strategist`
2. `sdd`
3. `software-architect`
4. `build`

### `incident-to-fix`

Purpose: urgent diagnosis through safe fix.

1. `build` with `engineering-incident-triage`
2. `devops-sre-advisor`
3. `security-infrastructure-reviewer` if exposure/security risk exists
4. `build`
5. `code-reviewer`

## Agent Role Categories

### Spec owners

- `sdd`

### Domain advisors

- `software-architect`
- `backend-data-reviewer`
- `devops-sre-advisor`
- `frontend-ux-reviewer`
- `ai-rag-agent-architect`
- others from `AG01`–`AG12`

### Reviewers

- `code-reviewer`
- `project-rules-auditor`
- `code-quality-testing-reviewer`
- `security-infrastructure-reviewer`

### Implementer

- `build`

## Handoff Contract

Each agent response in a workflow should include:

```text
Step result
Inputs consumed
Outputs produced
Assumptions
Risks
Open questions
Recommended next agent
Stop/blocker condition
```

## Failure Handling

If a step fails:

1. record failure in task plan;
2. do not continue to next agent if required output is missing;
3. ask for approval if scope/material risk changes;
4. do not replace authoritative validation with weaker checks.

## Workflow Engine Roadmap

Current CLI supports `workflow list`, `workflow validate`, and `workflow run` as a minimal scaffold.

Next increments:

1. enrich workflow parser for `agent`, `skills`, `handoff`, `barsa`, and `mode`;
2. validate declared agents/skills against XLSX/runtime inventory;
3. add sequential dry-run plan output;
4. add handoff artifact recording;
5. add tests for invalid handoffs and duplicate agents;
6. only later consider actual autonomous execution.
