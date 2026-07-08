---
name: architecture-decision
description: Comparar alternativas arquiteturais e produzir decisão explícita com trade-offs.
compatibility: opencode
x-harness:
  skill_id: SK08
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX14, CTX15, CTX16, CTX20]
    bundles: []
  usable_by_agents: [AG05]
---

# Skill: architecture-decision

## Purpose
Comparar alternativas arquiteturais e produzir decisão explícita com trade-offs.

## When to Load
Escolha de stack, boundaries, modularização, integração, escalabilidade ou ADR.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
requisitos; restrições; qualidade; alternativas; contexto operacional

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX14`, `CTX15`, `CTX16`, `CTX20`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Clarificar forças
2. identificar alternativas
3. avaliar atributos
4. protótipo/experimento
5. decidir
6. registrar ADR

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Decisão reversível quando possível e ligada a requisitos reais.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
opções; trade-offs; decisão; consequências; ADR; plano de validação

## Limits
Não aplicar microservices, DDD ou padrões por moda.

## Interactions
Usable by: `AG05`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
