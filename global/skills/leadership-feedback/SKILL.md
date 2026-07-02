---
name: leadership-feedback
description: Estruturar feedback, responsabilidades, rituais e acompanhamento de equipe.
compatibility: opencode
x-harness:
  skill_id: SK06
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX10, CTX12, CTX23]
    bundles: []
  usable_by_agents: [AG03, AG04]
---

# Skill: leadership-feedback

## Purpose
Estruturar feedback, responsabilidades, rituais e acompanhamento de equipe.

## When to Load
Baixo desempenho, desalinhamento, contratação, parceria ou equipe pequena.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
situação; expectativa; comportamento observável; impacto; relação

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX10`, `CTX12`, `CTX23`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Separar fato/interpretação
2. definir expectativa
3. preparar mensagem
4. ouvir contexto
5. acordo
6. acompanhamento

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Mensagem clara, específica e ligada a comportamento observável.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
roteiro de conversa; acordo; métrica; follow-up; riscos

## Limits
Não usar modelos de cultura de grandes empresas sem adaptação.

## Interactions
Usable by: `AG03`, `AG04`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
