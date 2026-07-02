---
name: financial-organization
description: Organizar finanças pessoais e profissionais em fluxo de caixa, metas e regras de decisão.
compatibility: opencode
x-harness:
  skill_id: SK04
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX07, CTX08]
    bundles: []
  usable_by_agents: [AG03]
---

# Skill: financial-organization

## Purpose
Organizar finanças pessoais e profissionais em fluxo de caixa, metas e regras de decisão.

## When to Load
Orçamento, dívida, reserva, compra, proposta, renda de freelas ou empresa.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
receitas; despesas; compromissos; prazo; objetivo; risco

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX07`, `CTX08`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Levantar fluxo
2. separar fixo/variável
3. compromissos
4. reserva
5. cenários
6. regra de decisão
7. revisão mensal

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Números reconciliados e decisões rastreáveis.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
mapa financeiro; cenários; prioridades; próximos passos; indicadores

## Limits
Não recomendar investimento especulativo ou produto financeiro específico sem pesquisa atual.

## Interactions
Usable by: `AG03`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
