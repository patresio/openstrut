---
name: privacy-review
description: Revisar privacidade — PII, LGPD, GDPR, consentimento, retenção, anonimização e impacto à privacidade.
compatibility: opencode
x-harness:
  skill_id: SK39
  status: active
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology
    contexts: [CTX31, CTX20]
    bundles: []
  usable_by_agents: [AG09]
---

# Skill: privacy-review

## Purpose
Revisar conformidade de privacidade — identificação de PII, consentimento, períodos de retenção, anonimização, direito de exclusão e impacto à privacidade (PIA).

## When to Load
- Feature nova coleta dados pessoais.
- Auditoria de privacidade de sistema existente.
- Release que expõe novos dados de usuário.
- Adequação à LGPD/GDPR.

## Do Not Load When
- Auditoria de segurança (usar SK15 security-review, SK34 compliance-audit).
- Incidente de vazamento ativo (usar SK22 engineering-incident-triage).

## Required Inputs
- fluxo de dados pessoais; categorias de dados coletados; base legal
- política de retenção; processos de consentimento e exclusão

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary.

- collections: `documentation; technology`
- contexts: `CTX31`, `CTX20`
- bundles: `none declared`

Use the smallest relevant context. Do not reference local filesystem library paths.

## Procedure
1. Mapear fluxo de dados pessoais (coleta, armazenamento, processamento, compartilhamento)
2. Identificar e classificar PII por sensibilidade
3. Verificar base legal para cada coleta (consentimento, legítimo interesse, obrigação legal)
4. Verificar período de retenção e política de exclusão
5. Verificar anonimização/pseudonimização onde aplicável
6. Verificar direito do titular (acesso, correção, exclusão, portabilidade)
7. Documentar PIA (Privacy Impact Assessment)
8. Recomendar correções para não-conformidades

## Required Evidence
- fluxo de dados mapeado; classificação de PII; gaps de conformidade
- PIA documentado; recomendações priorizadas

## Quality Criteria
- Toda coleta de PII deve ter base legal documentada
- Dado sem retenção definida é risco de não-conformidade

## Stop Conditions
- Fluxo de dados incompleto ou não documentado
- Base legal não definida pela organização

## Output
Relatório de privacidade: fluxo de dados, PII, gaps, PIA, recomendações.

## Limits
Não substitui assessoria jurídica. Não cobre todas as jurisdições — foco LGPD/GDPR.

## Interactions
Usable by: `AG09`.
Complementa: SK15 (security-review), SK34 (compliance-audit).
