---
name: localization
description: Projetar e revisar internacionalização — i18n, l10n, locale, tradução, formatação cultural e pluralização.
compatibility: opencode
x-harness:
  skill_id: SK38
  status: active
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology
    contexts: [CTX14, CTX15]
    bundles: []
  usable_by_agents: [AG06, AG10]
---

# Skill: localization

## Purpose
Projetar internacionalização (i18n) e localização (l10n) — extração de strings, locale, formatação de data/hora/moeda, pluralização, RTL e suporte a múltiplos idiomas.

## When to Load
- Projeto precisa suportar múltiplos idiomas.
- Revisão de strings hardcoded no código.
- Feature nova precisa de suporte a locale.
- Migração de i18n (framework ou formato).

## Do Not Load When
- A tarefa é puramente de UI (usar SK13 frontend-ux-review).
- A tarefa é de acessibilidade (usar SK37 accessibility-review).

## Required Inputs
- idiomas-alvo; framework de UI atual; formato de strings (JSON, YAML, PO)

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary.

- collections: `documentation; technology`
- contexts: `CTX14`, `CTX15`
- bundles: `none declared`

Use the smallest relevant context. Do not reference local filesystem library paths.

## Procedure
1. Identificar strings de UI hardcoded no código
2. Extrair para arquivos de locale (JSON/YAML/PO por idioma)
3. Definir chaves por namespace (componente, página, erro, label)
4. Implementar formatação cultural (data, hora, moeda, número, plural)
5. Suportar RTL se idioma-alvo incluir (árabe, hebraico)
6. Testar cada locale com conjunto mínimo de páginas/core flows
7. Documentar processo de adição de novo idioma

## Required Evidence
- locale files; diff de extração; testes por locale; screenshots

## Quality Criteria
- Zero strings hardcoded após migração
- Toda chave tem fallback (locale padrão)
- Placeholder e interpolation consistentes entre idiomas

## Stop Conditions
- Framework de UI não suporta i18n (impossível implementar sem troca)
- Time de tradução não disponível (tradução automática não substitui humana)

## Output
Locale files, documentação de i18n, guia de adição de idioma, testes.

## Limits
Não substitui tradutor humano para conteúdo crítico. Não cobre localização de conteúdo gerado por usuário.

## Interactions
Usable by: `AG06`, `AG10`.
Complementa: SK13 (frontend-ux-review), SK14 (api-data-design).
