---
name: devops-sre-diagnostics
description: Desenhar entrega e diagnosticar produção com evidência, SLOs e rollback.
compatibility: opencode
x-harness:
  skill_id: SK12
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX19, CTX20, CTX28]
    bundles: []
  usable_by_agents: [AG07, AG09]
---

# Skill: devops-sre-diagnostics

## Purpose
Desenhar entrega e diagnosticar produção com evidência, SLOs e rollback.

## When to Load
Deploy, incidente, lentidão, fila, erro, capacidade, observabilidade ou CI/CD.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
sintomas; métricas; logs; topologia; mudança recente; SLO

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX19`, `CTX20`, `CTX28`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Definir impacto
2. coletar evidência
3. hipótese
4. teste
5. contenção
6. correção
7. postmortem
8. automação

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Toda conclusão deve apontar evidência e condição de falsificação.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
hipóteses; testes; contenção; causa; correção; prevenção; pipeline

## Limits
Não recomendar mudança destrutiva sem confirmar intenção e rollback.

## Interactions
Usable by: `AG07`, `AG09`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
