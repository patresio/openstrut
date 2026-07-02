---
name: rag-agent-design
description: Projetar RAG, skills, agents, roteamento, ferramentas e avaliação.
compatibility: opencode
x-harness:
  skill_id: SK17
  status: pilot
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX30, CTX01, CTX29, CTX31]
    bundles: [B21]
  usable_by_agents: [AG11]
---

# Skill: rag-agent-design

## Purpose
Projetar RAG, skills, agents, roteamento, ferramentas e avaliação.

## When to Load
MCP, Qdrant, chunking, recuperação, agent, skill, tool ou workflow de IA.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
casos de uso; fontes; metadados; ferramentas; custo; latência; risco

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX30`, `CTX01`, `CTX29`, `CTX31`
- bundles: `B21`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Definir tarefa
2. fonte
3. unidade de recuperação
4. filtros
5. prompt
6. ferramenta
7. estado
8. avaliação
9. fallback

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Cada agent deve ter escopo, fontes e saída verificável.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
arquitetura; roteamento; prompts; contratos; avaliação; observabilidade

## Limits
Não enviar toda a biblioteca para todo agent.

## Interactions
Usable by: `AG11`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
