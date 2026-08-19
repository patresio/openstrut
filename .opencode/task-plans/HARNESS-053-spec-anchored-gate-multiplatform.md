# HARNESS-053 — Spec-anchored audit gate + multi-platform adoption (onp-spec-driven)

## Meta

- Task ID: HARNESS-053
- Classification: implementation (+ design)
- Status: in-progress (MI-9 — validação completa + review; correções do review aplicadas; falta commit)
- Approval: direção aprovada pelo usuário em 2026-08-17 ("vamos aproveitar algo do /srv/projects/onp-spec-driven"); MI-2/3 (audit gate) aprovado em 2026-08-19 (implementação + TDD evidenciado); MI-4..MI-8 aprovados no fluxo do task plan
- Branch: `feat/spec-anchored-gate`
- Base: main
- Worktree: não necessário

## Objective

Aproveitar os padrões comprovados do `/srv/projects/onp-spec-driven` (MIT © Vitor Manoel — atribuição registrada) para tornar o OpenStrut funcional para loop engineering (`ot-goal`) no OpenCode e Hermes:

1. **Escrever o spec-driven design**: `docs/design/012-spec-anchored-gate.md` — spec-anchored vs spec-first, rastreabilidade US→AC→T→teste, gate mecânico (exit code), DoD executável, suposições/perguntas como cidadãs de primeira classe, constituição verificável, lições com lastro.
2. **Portar o gate de auditoria mecânica** como command `ot-audit` + skill `opentrust-spec-anchored` (motor zero-dep embarcado, padrão onp-spec: skill autossuficiente, sem CLI global).
3. **Adotar o padrão multi-plataforma** do onp-spec: variantes de skill com marcador `agent:` no frontmatter, instalação por cópia de pasta, variantes cursor/antigravity no registry.
4. **Controle de custo no loop engineering**: modelo/esforço por tarefa com confirmação do usuário antes de executar (padrão onp-spec) no `ot-goal`.

## Acceptance Criteria

- [x] Design doc `docs/design/012-spec-anchored-gate.md` aprovado e versionado
- [x] `ot-audit` command implementado: parseia spec/tasks/testes, reporta AC sem teste/prova, exit code gate (0 = alinhado)
- [x] Skill `opentrust-spec-anchored` criada (SKILL.md + referências), registrada no inventário
- [x] Testes RED→GREEN para ot-audit (parse, rastreabilidade, gate)
- [x] Variantes cursor/antigravity adicionadas ao registry de plugins/setup (padrão onp-spec: marcador `agent:`)
- [x] `ot-goal` atualizado: confirma modelo/esforço por tarefa com o usuário antes de executar
- [x] Hermes: tool `ot_audit` disponível no plugin (registrada em `__init__.py` + `plugin.yaml` + testes)
- [x] `npm test` green; docs atualizados; atribuição MIT do onp-spec-driven registrada

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

1. Design doc `docs/design/012-spec-anchored-gate.md` (proposta; comparar com `docs/design/005-sdd-agent-workflow.md` e ADR-003) — versionado (untracked no branch) — DONE 2026-08-19 (escrito, aprovado como MI-1; alinhado ao motor real no MI-9)
2. RED: testes de parse/rastreabilidade/gate do ot-audit — DONE 2026-08-19 (RED evidenciado: ERR_MODULE_NOT_FOUND em parse.js/trace.js/audit.js; 22/22, 10/10, 7/7 GREEN ao final)
3. GREEN: implementação mínima do ot-audit (`src/audit/parse.js`, `src/audit/trace.js`, `src/audit/audit.js`) + wiring `bin/openstrut.js` (comando `audit`, `--change`, gate exit 0/1/2) + `global/commands/ot-audit.md` + inventário (11 commands, 208 artefatos no total final) + package.json (test/test:all) — DONE 2026-08-19 (`npm test` 382/382; `npm pack --dry-run` ok)
4. Skill `opentrust-spec-anchored` (SKILL.md + referências) + inventário — DONE 2026-08-19 (12 skills, 208 artefatos; metadata.test.js/opencode-load.test.js atualizados factualmente)
5. Registry: cursor/antigravity (padrão onp-spec, marcador `agent:`) — DONE 2026-08-19 (cursor adicionado; antigravity já existia)
6. `ot-goal`: controle de custo (modelo/esforço + confirmação) — DONE 2026-08-19 (`[Gate: Cost]` no pipeline)
7. Hermes: tool `ot_audit` (ou follow-up documentado) — DONE 2026-08-19 (tool registrada em `__init__.py` + `plugin.yaml` no MI-9, após review apontar dead code)
8. Docs + atribuição MIT — DONE 2026-08-19 (README/docs/usage/installation/opencode.md + `docs/attribution.md` + design doc alinhado)
9. Validação completa + review — DONE 2026-08-19 (npm test 382/0; smoke exit 0/1/2; review independente APPROVE após correções; falta commit)

## Evidence

### MI-2/3 (ot-audit engine + CLI)
- RED parse: `ERR_MODULE_NOT_FOUND: Cannot find module '.../src/audit/parse.js'` (testes escritos antes do módulo)
- RED trace: `ERR_MODULE_NOT_FOUND: .../src/audit/trace.js`
- RED gate: `ERR_MODULE_NOT_FOUND: .../src/audit/audit.js`
- GREEN: `node --test tests/audit/parse.test.js` 22/22; `trace.test.js` 10/10; `gate.test.js` 7/7
- `npm test`: 382 tests, 0 fail
- `node --check` src/bin: OK; `npm pack --dry-run --ignore-scripts`: OK (inclui src/audit/* e global/commands/ot-audit.md)
- CLI smoke: aligned exit 0, findings exit 1 (5 códigos), non-canonical exit 2

### MI-4..MI-8 (skill, registry, ot-goal, Hermes, docs)
- Skill `opentrust-spec-anchored` criada (129 linhas, frontmatter `metadata.agent: opencode`); inventário 208 (3+40+11+12+10+127+0+4+1)
- `tests/package/metadata.test.js` atualizado factualmente (11→12 skills); `tests/plugins/opencode-load.test.js` `>= 11` → `>= 12`
- Registry: cursor adicionado (CLIS 6→7, `tests/setup/setup.test.js` atualizado)
- `ot-goal`: `[Gate: Cost]` adicionado (sub-step antes de mutação; regra "cannot be skipped")
- Hermes: `ot_audit` schema + handler em tools.py; **registro em `__init__.py` + `plugin.yaml`** (11 tools) no MI-9 após review apontar dead code; testes hermes atualizados para cobrir registro (>=11 register_tool, 11 ot_* tools)
- Docs: README (208, 11 commands, 12 skills), docs/usage/skills.md, docs/usage/README.md, docs/usage/installation/README.md, docs/installation/opencode.md, docs/README.md, `docs/attribution.md` (nova)

### MI-9 (validação + review)
- `npm test`: 382 tests, 0 fail (65 suites) — confirmado pelo engineering-lead e pelo reviewer
- CLI smoke (repo canônico temporário): aligned exit 0 ("Audit OK: 1 stories, 2 criteria, 2 tasks, 1 test file(s)"); findings exit 1 (5 códigos: AC_SEM_TESTE, TESTE_ORFAO, TASK_CONCLUIDA_SEM_PROVA, TASK_STATUS_INVALIDO, REF_QUEBRADA)
- Review independente: BLOCK inicial (ot_audit dead code + ledger stale) → correções aplicadas → APPROVE
- Correções do review: registro ot_audit (Hermes), `packageRoot` não usado removido de audit.js/CLI, `--json` com payload JSON em erro operacional, scan de testes exclui `fixtures/`, design doc 012 alinhado (5 códigos emitidos; ASM/Q/SECAO planejados v1.1; selectors do contrato; sem path de máquina), attribution sem path absoluto, docstring plugin OpenCode 11 commands/12 skills
- Review follow-ups registrados: ASM_ABERTA/Q_ABERTA/SECAO_AUSENTE (v1.1), constituição verificável, lições com lastro

## Definition of Done

- [x] Acceptance criteria met (todas as 8 ACs marcadas acima)
- [x] Tests pass (382/382 local; CI lint + test(20) + test(22) verdes)
- [x] Review approved (independente; BLOCK inicial → correções → APPROVE)
- [x] Committed and delivered — commits `4d9d26d` (ledger 052), `290a58f` (feat(audit)), `1820f5d` (eval count) na branch `feat/spec-anchored-gate`; **PR #22 merged** em main via squash (`20f0e27`) em 2026-08-19

## Current State

- **HARNESS-053 COMPLETE** — entregue via PR #22 (merge `20f0e27`).
- **Next action**: reinstalação global (MI-10 do HARNESS-052, adiado até depois do 053) — executar após aprovação do usuário; cobre 052 + 053 + eval fix.