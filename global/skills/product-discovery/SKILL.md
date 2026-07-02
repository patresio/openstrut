---
name: product-discovery
description: Converter uma ideia em hipótese, experimento, MVP, roadmap e critério de decisão.
compatibility: opencode
x-harness:
  skill_id: SK05
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX08, CTX09, CTX10]
    bundles: []
  usable_by_agents: [AG03, AG10]
---

# Skill: product-discovery

## Purpose
Converter uma ideia em hipótese, experimento, MVP, roadmap e critério de decisão.

## When to Load
Novo produto, escopo, fase, demanda de cliente, piloto ou oportunidade.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
problema; público; contexto; restrições; evidências; recursos

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX08`, `CTX09`, `CTX10`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Definir problema
2. usuário
3. alternativa atual
4. riscos
5. hipótese
6. experimento
7. métrica
8. decisão
9. escopo

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Separar visão de produto, hipótese e compromisso contratual.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
hipóteses; riscos; experimento; MVP; métricas; backlog inicial

## Limits
Não transformar roadmap futuro em escopo imediato.

## Interactions
Usable by: `AG03`, `AG10`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
