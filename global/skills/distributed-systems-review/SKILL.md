---
name: distributed-systems-review
description: Revisar consistência, concorrência, falhas, filas e recuperação em sistemas distribuídos.
compatibility: opencode
x-harness:
  skill_id: SK10
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX16, CTX18, CTX20, CTX28]
    bundles: []
  usable_by_agents: [AG05, AG07, AG11]
---

# Skill: distributed-systems-review

## Purpose
Revisar consistência, concorrência, falhas, filas e recuperação em sistemas distribuídos.

## When to Load
Workers, filas, storage, replicação, transcodificação, coordenação ou processamento em escala.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
topologia; estado; fluxo; falhas; throughput; consistência

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX16`, `CTX18`, `CTX20`, `CTX28`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Mapear estado
2. fronteiras
3. falhas
4. consistência
5. idempotência
6. backpressure
7. observabilidade
8. chaos/testes

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Explicitar perda, duplicação, reordenação e recuperação.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
modelo de falha; riscos; invariantes; estratégia de recuperação; testes

## Limits
Não assumir exatamente uma vez sem mecanismo comprovado.

## Interactions
Usable by: `AG05`, `AG07`, `AG11`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
