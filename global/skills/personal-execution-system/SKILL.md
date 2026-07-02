---
name: personal-execution-system
description: Transformar objetivos pessoais em sistemas de execução compatíveis com hiperfoco, ansiedade e baixa tolerância a listas longas.
compatibility: opencode
x-harness:
  skill_id: SK03
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX04, CTX05, CTX06]
    bundles: []
  usable_by_agents: [AG02, AG12]
---

# Skill: personal-execution-system

## Purpose
Transformar objetivos pessoais em sistemas de execução compatíveis com hiperfoco, ansiedade e baixa tolerância a listas longas.

## When to Load
Paralisia, retomada, rotina, hábitos, organização semanal ou excesso de frentes.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
objetivo; energia; restrições; fricções; rotina atual

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX04`, `CTX05`, `CTX06`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Definir resultado mínimo
2. identificar fricções
3. reduzir escopo
4. criar gatilho
5. limitar WIP
6. revisar semanalmente

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Plano curto, executável e adaptado ao funcionamento do usuário.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
ação mínima; gatilhos; limites de WIP; revisão; indicadores simples

## Limits
Não oferecer diagnóstico ou substituir acompanhamento clínico.

## Interactions
Usable by: `AG02`, `AG12`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
