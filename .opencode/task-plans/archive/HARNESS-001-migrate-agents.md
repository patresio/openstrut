# Task: Migrar 11 agents leves para `9router/combo-cheap`

## Objective
Alterar o campo `model:` no frontmatter de 11 agent files de seus modelos built-in atuais para `9router/combo-cheap`.

## Acceptance Criteria
- [ ] 11 agents com `model: 9router/combo-cheap`
- [ ] Nenhum outro campo alterado
- [ ] Validação de contagem: 11 arquivos modificados

## Scope
### In Scope
- `global/agents/coordination-facilitator.md`
- `global/agents/meeting-scribe.md`
- `global/agents/decision-logger.md`
- `global/agents/context-historian.md`
- `global/agents/reference-librarian.md`
- `global/agents/documentation-skill-creator.md`
- `global/agents/product-discovery.md`
- `global/agents/requirements-analyzer.md`
- `global/agents/story-slicer.md`
- `global/agents/release-manager.md`
- `global/agents/changelog-writer.md`

### Out of Scope
- Qualquer outro agent file
- Qualquer outro campo no frontmatter
- Qualquer conteúdo fora do frontmatter

## Retrieval Context
Required contexts:
- CTX17 (Engineering)
Required bundles:
- B11 (Engineering Core)
Official docs:
- DOC_OPENCODE_AGENT_TEMPLATE

Policy:
- synthesize-only
- cite source IDs when available

## Teams Involved
| Team | Role |
|------|------|
| Engineering | Implementation |

## Status
- [x] Explore: Arquivos verificados
- [x] Plan: Task plan criado (esta página)
- [x] Apply: Migração concluída
- [x] Review: Validação final

## Microincrements
1. [x] Atualizar `coordination-facilitator.md`
2. [x] Atualizar `meeting-scribe.md`
3. [x] Atualizar `decision-logger.md`
4. [x] Atualizar `context-historian.md`
5. [x] Atualizar `reference-librarian.md`
6. [x] Atualizar `documentation-skill-creator.md`
7. [x] Atualizar `product-discovery.md`
8. [x] Atualizar `requirements-analyzer.md`
9. [x] Atualizar `story-slicer.md`
10. [x] Atualizar `release-manager.md`
11. [x] Atualizar `changelog-writer.md`
12. [x] Validação final e contagem

## Evidence
- Git diff: 11 files changed, 11 insertions, 11 deletions
- Grep: 11 matches for `model: 9router/combo-cheap` in global/agents/
- No other fields modified (verified via diff)

## Definition of Done
- [x] 11 agents com `model: 9router/combo-cheap`
- [x] Nenhum outro campo alterado
- [x] Validação de contagem: 11 arquivos modificados
