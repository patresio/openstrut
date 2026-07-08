---
name: testing-strategy
description: Escolher níveis, casos e automação de testes com foco em risco e feedback.
compatibility: opencode
x-harness:
  skill_id: SK16
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX27, CTX23, CTX25]
    bundles: []
  usable_by_agents: [AG08]
---

# Skill: testing-strategy

## Purpose
Escolher níveis, casos e automação de testes com foco em risco e feedback.

## When to Load
Nova feature, refatoração, regressão, TDD, BDD ou plano de qualidade.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
componente; riscos; interfaces; dados; ambiente; tempo

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX27`, `CTX23`, `CTX25`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Mapear risco
2. escolher unidade/integracao/e2e
3. casos críticos
4. fixtures
5. automação
6. CI
7. manutenção

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Cobertura orientada a risco e tempo de feedback.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
matriz de risco; níveis; casos; fixtures; automação; critérios

## Limits
Não perseguir cobertura percentual isolada.

## Interactions
Usable by: `AG08`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
