---
name: code-refactoring
description: Planejar e executar refatoração incremental com preservação de comportamento.
compatibility: opencode
x-harness:
  skill_id: SK14
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX25, CTX27, CTX23]
    bundles: []
  usable_by_agents: [AG08, AG06]
---

# Skill: code-refactoring

## Purpose
Planejar e executar refatoração incremental com preservação de comportamento.

## When to Load
Código legado, complexidade, duplicação, dívida técnica ou mudança arriscada.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
código; comportamento; testes; dependências; risco; objetivo

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX25`, `CTX27`, `CTX23`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Congelar comportamento
2. adicionar testes
3. criar seam
4. pequena mudança
5. verificar
6. repetir
7. medir

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Pequenos passos, testes verdes e diffs revisáveis.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
caracterização; seams; sequência de refatoração; checkpoints; rollback

## Limits
Não reescrever sem prova de necessidade.

## Interactions
Usable by: `AG08`, `AG06`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
