---
name: security-review
description: Modelar ameaças e revisar controles de aplicação e infraestrutura.
compatibility: opencode
x-harness:
  skill_id: SK15
  status: specialized
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX26, CTX28, CTX17]
    bundles: []
  usable_by_agents: [AG09]
---

# Skill: security-review

## Purpose
Modelar ameaças e revisar controles de aplicação e infraestrutura.

## When to Load
Auth, dados sensíveis, LGPD, menores, saúde, OAuth, API ou exposição de serviço.

## Do Not Load When
- The request is outside the stated trigger.
- Required inputs are missing and cannot be inferred safely.
- A smaller harness engineering skill already solves the process need.

## Required Inputs
atores; ativos; fluxo; fronteiras; ameaças; controles atuais

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary before relying on book, official documentation, or curated operational knowledge.

- collections: `documentation; technology; personal`
- contexts: `CTX26`, `CTX28`, `CTX17`
- bundles: `none declared`

Use the smallest relevant context or bundle. Do not reference local filesystem library paths. Do not inject whole-library context.

## Procedure
1. Mapear ativos
2. fronteiras
3. abuso
4. autenticação
5. autorização
6. dados
7. logs
8. operação
9. testes

## Required Evidence
- Inputs used.
- Barsa collection/context/bundle consulted when retrieval was needed.
- Output decisions tied to stated quality criteria.

## Quality Criteria
Priorizar risco real, defesa em profundidade e rastreabilidade.

## Stop Conditions
- Required source evidence is unavailable for a material decision.
- User intent changes scope or risk.
- The task needs clinical, legal, financial, security, or destructive action beyond this skill's limits.

## Output
ameaças; severidade; controles; evidência; plano; testes de segurança

## Limits
Detalhes atuais devem ser confirmados em documentação oficial.

## Interactions
Usable by: `AG09`.

This skill supplies domain procedure. It does not replace harness process skills such as `engineering-task-plan`, `engineering-tdd-first`, or `engineering-delivery`.
