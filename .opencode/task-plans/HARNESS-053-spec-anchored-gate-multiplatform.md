# HARNESS-053 — Spec-anchored audit gate + multi-platform adoption (onp-spec-driven)

## Meta

- Task ID: HARNESS-053
- Classification: implementation (+ design)
- Status: proposed (aguardando Approval Gate)
- Approval: direção aprovada pelo usuário em 2026-08-17 ("vamos aproveitar algo do /srv/projects/onp-spec-driven"); contrato formal pendente de aprovação
- Branch: `feat/spec-anchored-gate` (proposto)
- Base: main
- Worktree: não necessário

## Objective

Aproveitar os padrões comprovados do `/srv/projects/onp-spec-driven` (MIT © Vitor Manoel — atribuição registrada) para tornar o OpenStrut funcional para loop engineering (`ot-goal`) no OpenCode e Hermes:

1. **Escrever o spec-driven design**: `docs/design/012-spec-anchored-gate.md` — spec-anchored vs spec-first, rastreabilidade US→AC→T→teste, gate mecânico (exit code), DoD executável, suposições/perguntas como cidadãs de primeira classe, constituição verificável, lições com lastro.
2. **Portar o gate de auditoria mecânica** como command `ot-audit` + skill `opentrust-spec-anchored` (motor zero-dep embarcado, padrão onp-spec: skill autossuficiente, sem CLI global).
3. **Adotar o padrão multi-plataforma** do onp-spec: variantes de skill com marcador `agent:` no frontmatter, instalação por cópia de pasta, variantes cursor/antigravity no registry.
4. **Controle de custo no loop engineering**: modelo/esforço por tarefa com confirmação do usuário antes de executar (padrão onp-spec) no `ot-goal`.

## Acceptance Criteria

- [ ] Design doc `docs/design/012-spec-anchored-gate.md` aprovado e versionado
- [ ] `ot-audit` command implementado: parseia spec/tasks/testes, reporta AC sem teste/prova, exit code gate (0 = alinhado)
- [ ] Skill `opentrust-spec-anchored` criada (SKILL.md + referências), registrada no inventário
- [ ] Testes RED→GREEN para ot-audit (parse, rastreabilidade, gate)
- [ ] Variantes cursor/antigravity adicionadas ao registry de plugins/setup (padrão onp-spec: marcador `agent:`)
- [ ] `ot-goal` atualizado: confirma modelo/esforço por tarefa com o usuário antes de executar
- [ ] Hermes: tool `ot_audit` disponível no plugin (ou follow-up documentado)
- [ ] `npm test` green; docs atualizados; atribuição MIT do onp-spec-driven registrada

## Scope

### In Scope

- Design doc (spec-anchored gate)
- `ot-audit` command + skill + testes
- Inventário/instalador: novos artefatos (command + skill)
- Registry multi-plataforma: cursor/antigravity
- `ot-goal`: controle de custo (modelo/esforço + confirmação)
- Hermes plugin: tool `ot_audit` (se viável no escopo)
- Atribuição MIT (onp-spec-driven)

### Out of Scope

- Portar o motor completo do onp-spec (ledger global `~/.onp-spec`, executor paralelo headless, lições com lastro) — avaliar em follow-up
- Mudanças no runtime do Hermes fora do plugin
- Publicar pacote
- Alterações em `~/.config/opencode` sem aprovação

## Retrieval Context

Required contexts:
- CTX01 (Trust Coordination)
- CTX03 (Workflow / Process)
- CTX14 (Architecture Decisions)
- CTX17 (Engineering)
- CTX23 (Delivery)

Required bundles:
- B01 (Foundation)
- B08 (Architecture Core)
- B11 (Engineering Core)

Required skills:
- SK01 (Knowledge System Design)
- SK08 (Architecture Decision)
- SK09 (Domain Modeling)
- SK16 (Testing Strategy)

Official docs:
- DOC_OPENCODE_AGENTS
- DOC_OPENCODE_CONFIG

Provider:
- local-context-catalog

Policy:
- synthesize-only
- no raw chunks in commits
- cite source IDs when available
- use only approved selectors

## Test Plan

- TDD RED→GREEN para ot-audit:
  1. Parse de spec.md (US/AC/ASM/Q) e tasks.md (T-xxx, Refs, Arquivos)
  2. Rastreabilidade: AC sem teste → achado; teste órfão → achado; task concluída sem prova → achado
  3. Gate: exit 0 quando alinhado; exit 1 com achados
- Testes de inventário: novos artefatos (command + skill) presentes no pack
- Validação: `npm test`, `npm run validate:opentrust`, `openstrut plan --dry-run` em target temporário

## Microincrements

1. Design doc `docs/design/012-spec-anchored-gate.md` (proposta; comparar com `docs/design/005-sdd-agent-workflow.md` e ADR-003)
2. RED: testes de parse/rastreabilidade/gate do ot-audit
3. GREEN: implementação mínima do ot-audit (`src/audit/` ou `src/spec/`)
4. Skill `opentrust-spec-anchored` (SKILL.md + referências) + inventário
5. Registry: cursor/antigravity (padrão onp-spec, marcador `agent:`)
6. `ot-goal`: controle de custo (modelo/esforço + confirmação)
7. Hermes: tool `ot_audit` (ou follow-up documentado)
8. Docs + atribuição MIT
9. Validação completa + review

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Tests pass
- [ ] Review approved
- [ ] Committed with conventional commit message (ex.: `feat(audit): add spec-anchored audit gate`)