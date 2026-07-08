---
name: health-planning
description: Organizar pesquisa, perguntas e planos práticos de exercício, nutrição e meal prep com limites clínicos.
compatibility: opencode
x-harness:
  skill_id: SK18
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX32, CTX04, CTX05]
    bundles: []
  usable_by_agents: [AG12]
---

# Skill: health-planning

## Purpose
Organizar pesquisa, perguntas e planos práticos de exercício, nutrição e meal prep com limites clínicos.

## When to Load
Retorno ao exercício, plano alimentar, rotina de refeições, técnica ou leitura de exames.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
objetivo; restrições médicas; rotina; equipamentos; preferências; validações

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX32`, `CTX04`, `CTX05`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Definir objetivo
2. restrições
3. segurança
4. opções
5. progressão
6. rotina
7. sinais de alerta
8. validação

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Separar referência, aplicação prática e pontos que exigem validação profissional.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
questões para profissional; opções; plano gradual; checklist; monitoramento

## Limits
Não diagnosticar, prescrever tratamento ou substituir médico/nutricionista.

## Interactions
Usable by: `AG12`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
