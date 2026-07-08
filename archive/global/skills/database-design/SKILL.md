---
name: database-design
description: Modelar, projetar e revisar bancos de dados — schema, migrações, índices, queries e normalização.
compatibility: opencode
x-harness:
  skill_id: SK35
  status: active
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology
    contexts: [CTX14, CTX15]
    bundles: []
  usable_by_agents: [AG06, AG05]
---

# Skill: database-design

## Purpose
Projetar e revisar esquemas de banco de dados — modelagem relacional, migrações, índices, otimização de queries, normalização e escolha de engine.

## When to Load
- Nova feature precisa de tabelas ou coleções.
- Query lenta identificada precisa de índice ou reescrita.
- Migração de schema precisa ser planejada.
- Revisão de modelo de dados existente.

## Do Not Load When
- O problema é de infraestrutura de banco (usar SK12 devops-sre-diagnostics).
- A modelagem é de domínio (usar SK09 domain-modeling).
- A decisão é arquitetural entre SQL/NoSQL (usar SK08 architecture-decision).

## Required Inputs
- requisitos de dados; volume esperado; padrões de acesso; engine atual

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary.

- collections: `documentation; technology`
- contexts: `CTX14`, `CTX15`
- bundles: `none declared`

Use the smallest relevant context. Do not reference local filesystem library paths.

## Procedure
1. Mapear entidades, atributos e relacionamentos
2. Normalizar até 3NF ou justificar desnormalização
3. Definir índices primários e secundários por padrão de acesso
4. Planejar migrações (add column, rename, backfill, zero-downtime)
5. Revisar queries críticas com EXPLAIN
6. Documentar schema, índices e decisões de design
7. Validar contra requisitos de volume e latência

## Required Evidence
- diagrama ou descrição do schema; lista de índices; migrações planejadas
- EXPLAIN de queries críticas; justificativa de desnormalizações

## Quality Criteria
- Toda migração deve ser reversível
- Tabela sem PK é exceção justificada
- Índice sem uso é custo sem benefício

## Stop Conditions
- Requisitos de dados inconsistentes ou incompletos
- Volume esperado não informado (impossível dimensionar)

## Output
Schema proposto, migrações, índices, queries otimizadas, documentação.

## Limits
Não substitui DBA. Não cobre administração de banco (backup, replicação, tuning avançado).

## Interactions
Usable by: `AG06`, `AG05`.
Complementa: SK09 (domain-modeling), SK08 (architecture-decision), SK14 (api-data-design).
