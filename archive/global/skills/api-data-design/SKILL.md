---
name: api-data-design
description: Projetar APIs e dados coerentes, evolutivos e seguros.
compatibility: opencode
x-harness:
  skill_id: SK11
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX17, CTX18, CTX26]
    bundles: []
  usable_by_agents: [AG06]
---

# Skill: api-data-design

## Purpose
Projetar APIs e dados coerentes, evolutivos e seguros.

## When to Load
Novo endpoint, schema, autenticação, persistência ou revisão de contrato.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
casos de uso; atores; dados; volume; consistência; segurança

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX17`, `CTX18`, `CTX26`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Modelar recurso
2. contrato
3. validação
4. autorização
5. transação
6. índices
7. evolução
8. testes

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Contrato estável, erros previsíveis e invariantes no banco.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
contratos; modelo; erros; transações; índices; migração; testes

## Limits
Não usar NoSQL sem requisito que justifique.

## Interactions
Usable by: `AG06`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
