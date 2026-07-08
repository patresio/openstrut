---
name: career-positioning
description: Construir narrativa profissional, currículo, portfólio e preparação de entrevistas a partir de evidências reais.
compatibility: opencode
x-harness:
  skill_id: SK07
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX11, CTX12, CTX13]
    bundles: []
  usable_by_agents: [AG04]
---

# Skill: career-positioning

## Purpose
Construir narrativa profissional, currículo, portfólio e preparação de entrevistas a partir de evidências reais.

## When to Load
Currículo, LinkedIn, vaga, entrevista, proposta ou posicionamento.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
vaga; histórico; projetos; resultados; stack; limitações

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX11`, `CTX12`, `CTX13`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Extrair evidências
2. mapear à vaga
3. quantificar impacto
4. construir narrativa
5. preparar perguntas
6. simular follow-ups

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Sem inventar experiência; destacar decisões e resultados verificáveis.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
narrativa; bullets; respostas; casos STAR; lacunas de preparação

## Limits
Não apagar a trajetória de infraestrutura/suporte; integrá-la ao posicionamento sênior.

## Interactions
Usable by: `AG04`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
