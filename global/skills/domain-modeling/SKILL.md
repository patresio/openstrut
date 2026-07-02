---
name: domain-modeling
description: Modelar domínio, linguagem, bounded contexts, agregados e integrações.
compatibility: opencode
x-harness:
  skill_id: SK09
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX15, CTX18]
    bundles: []
  usable_by_agents: [AG05]
---

# Skill: domain-modeling

## Purpose
Modelar domínio, linguagem, bounded contexts, agregados e integrações.

## When to Load
Domínio complexo, regras de negócio, workflows, autorização ou dados evolutivos.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
atores; eventos; regras; termos; casos de uso; integrações

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX15`, `CTX18`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Descobrir linguagem
2. mapear capacidades
3. separar contextos
4. definir invariantes
5. modelar eventos
6. validar com especialista

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Modelo validado por alguém que conhece o processo real.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
glossário; context map; agregados; invariantes; eventos; riscos

## Limits
Não inventar regra de negócio ausente.

## Interactions
Usable by: `AG05`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
