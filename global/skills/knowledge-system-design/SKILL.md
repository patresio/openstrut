---
name: knowledge-system-design
description: Projetar taxonomias, notas, bundles e regras de recuperação para Obsidian e MCP.
compatibility: opencode
x-harness:
  skill_id: SK01
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX01, CTX02, CTX03]
    bundles: []
  usable_by_agents: [AG01]
---

# Skill: knowledge-system-design

## Purpose
Projetar taxonomias, notas, bundles e regras de recuperação para Obsidian e MCP.

## When to Load
Biblioteca, vault, organização de notas, segundo cérebro, taxonomia ou recuperação.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
objetivo; tipos de informação; frequência de uso; restrições; ferramentas

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX01`, `CTX02`, `CTX03`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Definir casos de uso
2. mapear entradas/saídas
3. escolher estrutura
4. definir metadados
5. testar recuperação
6. criar rotina de manutenção

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
A estrutura deve reduzir fricção e permitir recuperar conhecimento por intenção, não apenas por pasta.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
estrutura; convenções; fluxo de captura; critérios de revisão; consultas MCP

## Limits
Não reorganizar todo o vault sem casos de uso comprovados.

## Interactions
Usable by: `AG01`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
