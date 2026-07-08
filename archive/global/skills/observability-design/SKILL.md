---
name: observability-design
description: Projetar observabilidade — métricas, traces, logs, dashboards, alertas e SLOs.
compatibility: opencode
x-harness:
  skill_id: SK36
  status: active
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology
    contexts: [CTX20, CTX23]
    bundles: []
  usable_by_agents: [AG07]
---

# Skill: observability-design

## Purpose
Projetar a estratégia de observabilidade de um sistema — definição de métricas, traces distribuídos, logs estruturados, dashboards, alertas e SLOs/SLIs.

## When to Load
- Sistema novo precisa de instrumentação.
- Sistema existente sem observabilidade adequada.
- Incidente frequente sem visibilidade da causa raiz.
- Revisão de dashboards e alertas existentes.

## Do Not Load When
- Incidente ativo precisa de diagnóstico urgente (usar SK22 engineering-incident-triage).
- Performance tuning específico (usar SK32 performance-engineering).
- Infraestrutura de produção (usar SK12 devops-sre-diagnostics).

## Required Inputs
- arquitetura do sistema; componentes; fluxos críticos; SLOs desejados
- stack de observabilidade disponível (Prometheus, Grafana, OpenTelemetry, Datadog)

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary.

- collections: `documentation; technology`
- contexts: `CTX20`, `CTX23`
- bundles: `none declared`

Use the smallest relevant context. Do not reference local filesystem library paths.

## Procedure
1. Mapear componentes, dependências e fluxos críticos
2. Definir SLIs (latência, erro, throughput, saturação) por componente
3. Definir SLOs com budget de erro
4. Projetar instrumentação: métricas RED, traces, logs estruturados
5. Definir alertas (burn rate, absent data, janela de avaliação)
6. Projetar dashboards por persona (dev, ops, negócio)
7. Validar: todo alerta tem runbook, toda métrica tem dono

## Required Evidence
- SLIs/SLOs documentados; instrumentação proposta; alertas com thresholds
- dashboards wireframe; runbooks esboçados

## Quality Criteria
- Toda métrica deve ter unidade e label sem cardinalidade explodida
- Alerta sem ação não é alerta (deve ter runbook ou auto-remediation)

## Stop Conditions
- Stack de observabilidade não definida
- SLOs não podem ser acordados com stakeholders

## Output
Estratégia de observabilidade: SLIs/SLOs, instrumentação, alertas, dashboards, runbooks.

## Limits
Não cobre configuração de ferramentas específicas. Não substitui SRE para operação contínua.

## Interactions
Usable by: `AG07`.
Complementa: SK12 (devops-sre-diagnostics), SK22 (engineering-incident-triage).
