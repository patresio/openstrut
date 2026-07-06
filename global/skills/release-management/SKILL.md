---
name: release-management
description: Gerenciar releases, changelog, versionamento semântico, deprecação e notas de release.
compatibility: opencode
x-harness:
  skill_id: SK33
  status: active
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology; personal
    contexts: [CTX27, CTX23, CTX20]
    bundles: []
  usable_by_agents: [AG20]
---

# Skill: release-management

## Purpose
Planejar, documentar e coordenar releases — versionamento semântico, changelog, deprecação de features, notas de release e rollback.

## When to Load
- Preparando uma release para publicação.
- Feature ou breaking change precisa de deprecação planejada.
- Changelog precisa ser gerado ou revisado.
- Rollback precisa ser planejado.

## Do Not Load When
- A tarefa é puramente operacional de CI/CD (usar SK12 devops-sre-diagnostics).
- A tarefa é de documentação geral (usar SK29 engineering-documentation).

## Required Inputs
- commits desde última release; breaking changes; novas features; fixes
- versão atual; política de versionamento (semver, calver)

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary.

- collections: `documentation; technology`
- contexts: `CTX27`, `CTX23`, `CTX20`
- bundles: `none declared`

Use the smallest relevant context. Do not reference local filesystem library paths.

## Procedure
1. Coletar commits desde última tag
2. Classificar por tipo: feature, fix, breaking, chore, docs, refactor
3. Determinar next version (major/minor/patch conforme semver)
4. Gerar changelog entry (seguindo conventional commits)
5. Documentar breaking changes com migração
6. Planejar deprecação com timeline
7. Revisar notas de release e validação de CI
8. Finalizar e publicar release

## Required Evidence
- changelog diff; versão proposta; breaking changes listadas; CI green

## Quality Criteria
- Toda breaking change deve ter migration guide
- Changelog deve ser compreensível por humanos não-técnicos

## Stop Conditions
- Pipeline de CI não está verde
- Breaking change sem migration guide documentada

## Output
Notas de release, changelog atualizado, versão proposta, plano de rollback.

## Limits
Não substitui o pipeline de CI/CD. Não publica releases automaticamente sem aprovação.

## Interactions
Usable by: `AG20`.
Complementa: SK29 (engineering-documentation), SK21 (engineering-delivery).
