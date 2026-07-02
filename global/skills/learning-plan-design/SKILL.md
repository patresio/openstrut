---
name: learning-plan-design
description: Criar planos de aprendizagem orientados a prática, recuperação e evidência de domínio.
compatibility: opencode
x-harness:
  skill_id: SK02
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX02, CTX03, CTX22]
    bundles: []
  usable_by_agents: [AG01, AG02]
---

# Skill: learning-plan-design

## Purpose
Criar planos de aprendizagem orientados a prática, recuperação e evidência de domínio.

## When to Load
Aprender tecnologia, preparar entrevista, ler conjunto de livros ou dominar novo tema.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
tema; nível atual; prazo; aplicação desejada; tempo semanal

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX02`, `CTX03`, `CTX22`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Diagnosticar nível
2. decompor competência
3. ordenar pré-requisitos
4. definir prática
5. revisão espaçada
6. projeto de aplicação
7. avaliação

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Cada etapa deve produzir evidência observável de aprendizagem.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
trilha; sessões; exercícios; checkpoints; critérios de domínio

## Limits
Evitar planos extensos sem carga semanal realista.

## Interactions
Usable by: `AG01`, `AG02`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
