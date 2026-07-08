---
name: frontend-ux-review
description: Revisar experiência, fluxos, formulários e interface com critérios claros.
compatibility: opencode
x-harness:
  skill_id: SK13
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX21, CTX09]
    bundles: []
  usable_by_agents: [AG10]
---

# Skill: frontend-ux-review

## Purpose
Revisar experiência, fluxos, formulários e interface com critérios claros.

## When to Load
Tela, cadastro, dashboard, fluxo de ativação, responsividade ou design system.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
persona; tarefa; fluxo; tela; restrições; dados

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX21`, `CTX09`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Definir tarefa
2. percurso
3. carga cognitiva
4. feedback
5. erro
6. acessibilidade
7. consistência
8. teste

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Recomendação ligada a objetivo e comportamento do usuário.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
problemas; severidade; recomendações; critérios de aceitação; testes

## Limits
Não substituir pesquisa com usuário por opinião estética.

## Interactions
Usable by: `AG10`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
