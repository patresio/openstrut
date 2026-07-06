---
name: compliance-audit
description: Auditar conformidade — dependências, licenças, vulnerabilidades, supply chain, regulamentação e políticas internas.
compatibility: opencode
x-harness:
  skill_id: SK34
  status: active
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology
    contexts: [CTX20, CTX23, CTX31]
    bundles: []
  usable_by_agents: [AG21]
---

# Skill: compliance-audit

## Purpose
Auditar dependências, licenças, vulnerabilidades de supply chain, conformidade regulatória (GDPR, SOC2, LGPD) e políticas internas do projeto.

## When to Load
- Auditoria de dependências (npm audit, pip-audit, cargo-audit, trivy).
- Verificação de licenças de terceiros.
- Release que exige gate de compliance.
- Projeto precisa de relatório de conformidade.

## Do Not Load When
- Vulnerabilidade já conhecida e em tratamento (usar SK22 engineering-incident-triage).
- Auditoria de segurança de infraestrutura (usar SK15 security-review).

## Required Inputs
- manifesto de dependências (package.json, Cargo.toml, requirements.txt)
- política de licenças permitidas; baseline de CVEs

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary.

- collections: `documentation; technology`
- contexts: `CTX20`, `CTX23`, `CTX31`
- bundles: `none declared`

Use the smallest relevant context. Do not reference local filesystem library paths.

## Procedure
1. Coletar manifesto de dependências do projeto
2. Executar scanner de vulnerabilidades (npm audit, trivy, osv-scanner, snyk)
3. Auditar licenças de cada dependência contra política permitida
4. Verificar supply chain (assinatura, integrity hash, source)
5. Gerar relatório: críticas, altas, médias, baixas
6. Recomendar ações: atualizar, substituir, mitigar
7. Verificar conformidade regulatória (GDPR, LGPD, SOC2) aplicável

## Required Evidence
- output do scanner; lista de licenças; relatório de conformidade
- ações tomadas para cada finding

## Quality Criteria
- Toda dependência deve ter licença identificada
- CVE crítico sem patch conhecido deve ter mitigação documentada

## Stop Conditions
- Scanner de vulnerabilidades indisponível
- Política de licenças não definida (impossível auditar)

## Output
Relatório de auditoria: dependências, licenças, CVEs, conformidade, ações recomendadas.

## Limits
Não substitui ferramenta de segurança dedicada (depende de scanners externos). Não substitui assessoria jurídica para conformidade regulatória.

## Interactions
Usable by: `AG21`.
Complementa: SK15 (security-review), SK22 (engineering-incident-triage).
