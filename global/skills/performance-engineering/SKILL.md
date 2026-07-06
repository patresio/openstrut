---
name: performance-engineering
description: Analisar, medir e otimizar performance de sistemas — profiling, load testing, bottlenecks, caching e tuning.
compatibility: opencode
x-harness:
  skill_id: SK32
  status: active
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology
    contexts: [CTX14, CTX23, CTX20]
    bundles: []
  usable_by_agents: [AG19]
---

# Skill: performance-engineering

## Purpose
Identificar e eliminar gargalos de performance através de profiling, load testing, análise de latência, throughput, uso de CPU/memória/I/O e estratégias de caching e tuning.

## When to Load
- Sistema apresenta degradação de performance em produção.
- Feature nova com requisitos de latência ou throughput.
- Planejamento de capacidade antes de deploy.
- Refatoração de código crítico (hot paths, queries, APIs).

## Do Not Load When
- O problema é de confiabilidade (usar SK12 devops-sre-diagnostics).
- O problema é de arquitetura (usar SK08 architecture-decision, SK09 domain-modeling).
- A requisição é sobre segurança (usar SK15 security-review).

## Required Inputs
- sistema ou componente alvo; métricas observadas; arquitetura; carga esperada
- (opcional) ferramentas disponíveis (k6, autocannon, clinic, perf, flamegraph)

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary.

- collections: `documentation; technology`
- contexts: `CTX14`, `CTX23`, `CTX20`
- bundles: `none declared`

Use the smallest relevant context. Do not reference local filesystem library paths.

## Procedure
1. Definir métricas-alvo (latência p50/p95/p99, throughput, erro, CPU, memória)
2. Estabelecer baseline com monitoramento atual
3. Escolher ferramenta de profiling ou carga (k6, autocannon, clinic, perf)
4. Executar medição controlada em ambiente isolado
5. Identificar bottleneck (DB query, rede, CPU-bound, lock, GC, I/O)
6. Propor otimização (cache, índice, algoritmo, paralelismo, conexão)
7. Reexecutar medição para confirmar ganho
8. Documentar baseline, bottleneck, solução e ganho mensurado

## Required Evidence
- Métricas de baseline e pós-otimização
- Ferramenta usada e parâmetros
- Identificação do bottleneck com evidência (flamegraph, trace, log)
- Ganho mensurado em percentual

## Quality Criteria
- Toda otimização deve ser medida antes e depois
- Falso positivo (otimizar lugar errado) é pior que não otimizar

## Stop Conditions
- Ambiente de teste não representa produção
- Ferramenta de medição altera o comportamento medido (efeito sonda)

## Output
Relatório de performance: baseline, bottleneck, solução, ganho mensurado, riscos.

## Limits
Não otimizar sem medir. Não trocar algoritmo sem justificativa mensurável.

## Interactions
Usable by: `AG19`.

Complementa: SK10 (distributed-systems-review) para sistemas distribuídos, SK12 (devops-sre-diagnostics) para diagnóstico de produção.
