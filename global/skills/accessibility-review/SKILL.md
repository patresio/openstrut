---
name: accessibility-review
description: Revisar acessibilidade — WCAG, ARIA, contraste, navegação por teclado, leitores de tela e formulários.
compatibility: opencode
x-harness:
  skill_id: SK37
  status: active
  source_type: domain-catalog
  source_policy:
    collection: documentation; technology
    contexts: [CTX23, CTX09]
    bundles: []
  usable_by_agents: [AG10]
---

# Skill: accessibility-review

## Purpose
Revisar acessibilidade de interfaces web e mobile seguindo WCAG 2.2 (níveis A, AA, AAA) — contraste, navegação por teclado, ARIA, leitores de tela, formulários e mobile.

## When to Load
- Feature de UI nova precisa ser acessível.
- Auditoria de acessibilidade de sistema existente.
- Componente de design system precisa de validação de acessibilidade.
- Queixa de usuário com deficiência.

## Do Not Load When
- A revisão é de UX geral (usar SK13 frontend-ux-review).
- O problema é de performance frontend (usar SK32 performance-engineering).

## Required Inputs
- URLs ou componentes; público-alvo; nível WCAG alvo (A/AA/AAA)

## Barsa Retrieval Policy
Use Barsa MCP as the canonical retrieval boundary.

- collections: `documentation; technology`
- contexts: `CTX23`, `CTX09`
- bundles: `none declared`

Use the smallest relevant context. Do not reference local filesystem library paths.

## Procedure
1. Coletar interfaces a serem revisadas
2. Verificar contraste de cor (relação mínima 4.5:1 texto normal)
3. Verificar navegação por teclado (tab order, foco visível, skip links)
4. Verificar ARIA labels e roles (semântica correta)
5. Testar com leitor de tela (NVDA, VoiceOver, TalkBack)
6. Verificar formulários (labels, errors, validação acessível)
7. Verificar zoom e redimensionamento (até 200% sem perda)
8. Gerar relatório com violações por nível WCAG e severidade

## Required Evidence
- lista de violações WCAG com localização e severidade
- evidência de teste (screenshot, gravação, output de axe-core/WAVE)

## Quality Criteria
- Nível AA como mínimo para produção
- Violação crítica (bloqueia tarefa essencial) tem prioridade sobre cosmética

## Stop Conditions
- Ferramentas de teste indisponíveis
- Componente sem possibilidade de correção (terceiro não modificável)

## Output
Relatório de acessibilidade: violações WCAG, severidade, recomendações, prioridade.

## Limits
Não substitui teste com usuários reais com deficiência. Ferramentas automatizadas detectam ~30% dos problemas.

## Interactions
Usable by: `AG10`.
Complementa: SK13 (frontend-ux-review).
