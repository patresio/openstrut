# HARNESS-052 — Repair global install & OpenCode plugin path

## Meta

- Task ID: HARNESS-052
- Classification: bugfix (+ docs)
- Status: in-progress (Apply)
- Approval: aprovado pelo usuário em 2026-08-17 ("entao vamos aplicar, e tambem fazer aquela limpeza...")
- Branch: `fix/global-install-plugin-path` (criada)
- Base: main
- Worktree: não necessário (branch única e focada)

## Evidence Log

- MI-3 (RED parse): `tests/plugins/opencode-parse.test.js` criado + wiring; 1 teste falha — `# pass 0 # fail 1`
  - Descoberta importante: `node --check <file.js>` NÃO detecta `await` em função não-async em arquivos ESM-detectados (Node ≥22.7 module detection bug — verificado: `.mjs` falha, `.js` passa). Teste usa `--input-type=module --check` via stdin (método confiável). O comando do Explore (`--input-type=module --check <file>`) era inválido (ERR_INPUT_TYPE_NOT_ALLOWED), mas a conclusão estava correta: o plugin É inválido (provado via stdin ESM e cópia `.mjs`).
- MI-4 (GREEN plugin): removidos 4 `await import('node:fs')` ilegais (import topo += `readdirSync`, `existsSync`); `loadSkills()` agora lê subdiretórios `global/skills/<name>/SKILL.md`; exports nomeados adicionados para testabilidade. `tests/plugins/opencode-load.test.js` criado (RED: 1 falha — 0 skills; GREEN: 5/5). `npm test` completo: 335 testes, 0 falhas.
- MI-5 (CI lint): `.github/workflows/ci.yml` estendido — `find .opencode/plugins -name "*.js" -exec sh -c 'node --input-type=module --check < "$1"'` (método confiável, evita o bug de module detection) + `python3 -c "import ast, pathlib; ..."` para `plugins/opentrust`. Comandos verificados localmente (OK src/bin, OK .opencode/plugins, OK python).
- MI-6 (wiring global): usuário confirmou Opção A (registrar em `global/opencode.json`).
  - `global/opencode.json` += `"plugin": [{ "spec": "file:.opencode/plugins/opentrust.js" }]` (chave `plugin` singular — confirmado via binário do OpenCode 1.18.18; docs do repo usavam `plugins` plural, stale)
  - Inventário += `.opencode/plugins/opentrust.js` → `.opencode/plugins/opentrust.js` (no FINAL do array para preservar índices do teste de rollback)
  - Contrato do inventário alterado deliberadamente: `isAllowedSource` += `.opencode/plugins/`; comentário do header; testes atualizados (206 artefatos, exceção `.opencode/plugins/`, guarda aritmética `3+40+10+11+10+127+0+4+1=206`)
  - Plugin layout-aware: `resolveContentDir(root, subdir)` exportado — prefere layout instalado plano (`<root>/agents`) e cai para layout repo (`<root>/global/agents`); 4 loaders usam `contentDir()`. 2 testes de resolução (RED: import falha; GREEN: 2/2)
  - `tests/plugins/opencode-wiring.test.js`: 3 testes (config registra plugin, spec resolve, inventário instala) — RED 0/3, GREEN 3/3
  - Suíte completa: 340 testes, 0 falhas
- MI-7 (docs atualizados):
  - `docs/usage/skills.md`: lista de 39 skills legacy → 11 reais `opentrust-*`; referência detalhada reescrita com as 11 reais (descrições do frontmatter/SKILL.md); Skill Selection Rule com nomes reais; nota de que legacy está em `archive/global/skills/` (catalog-only)
  - `README.md`: Commands 7→10, Total 202→206, `commands/ # 7→10`, manifest `.harness/`→`.openstrut/` (caminho real de `src/installer/target.js`), checksums 202→206
  - `docs/installation/opencode.md`: reescrito — fonte real `.opencode/plugins/opentrust.js` (não `global/plugins/`), chave `plugin` singular (não `plugins`), spec `file:.opencode/plugins/opentrust.js`, config root `~/.config/opencode/opencode.json`, 11 skills reais (nomes errados corrigidos), troubleshooting/uninstall com caminhos reais
  - `docs/usage/README.md`: 21→40 agents, 39→11 skills
  - `docs/usage/installation/README.md`: 7→10 commands, 38→40 agents, 7→11 skills, + linha OpenCode plugin (1)
  - Verificado: `global/commands/` = 10, `global/agents/` = 40; `docs/usage/agents.md` L50 (39 skills) refere-se ao archive — correto, sem fix
  - Suíte completa: 340 testes, 0 falhas
- MI-8 (limpeza task plans):
  - `HARNESS-001-migrate-agents.md`: completo (checkboxes todos marcados) — arquivado
  - `HARNESS-048-register-combo-models.md`: estava "ready for execution" mas foi EXECUTADO — `git log -- global/opencode.json` mostra `fix(config): register combo-* models for 9router provider` (442f92e, fa0af1e); `global/opencode.json` tem os 8 modelos combo-*; status atualizado para complete + evidência; arquivado
  - `HARNESS-049-repair-openstrut-install.md`: closed (Review aprovado 2026-08-08) — arquivado
  - Movidos para `.opencode/task-plans/archive/` (preserva histórico, sem deleção)
- MI-9 (validação completa + review):
  - `npm test`: 340 testes, 0 falhas
  - `npm pack --dry-run --json`: 254 arquivos; 5 plugin files (`.opencode/plugins/opentrust.js` + 4 `plugins/opentrust/*`); 0 `__pycache__`
  - Lint CI (comandos do workflow): JS `.opencode/plugins` via stdin OK; Python `plugins/opentrust` ast.parse OK
  - `openstrut plan --target <tmp>`: lista `.opencode/plugins/opentrust.js` como install — plugin instalável
  - Review do diff: escopo (todos os arquivos mapeiam aos critérios de aceite), testes novos sem mocks/asserções fracas, sem secrets, sem mudanças destrutivas, docs consistentes com a realidade (commands=10, agents=40, manifest `.openstrut/`)
  - Review: **aprovado**
- MI-10 (commit): `9493a75` em `fix/global-install-plugin-path` — `fix(installer): ship and wire OpenCode plugin globally` (20 arquivos, +983/-336). Working tree limpo.
- Status: MI-1..MI-9 completos; **aguardando aprovação explícita do usuário para MI-10 (reinstalação global com backup)**
- Decisão do usuário (2026-08-19): MI-10 **adiado para depois do HARNESS-053** — uma única reinstalação global cobrirá 052 + 053 (backup + install + setup + validação).
- **Delivery (2026-08-19)**: commit `9493a75` entregue via **PR #22** (branch empilhada `feat/spec-anchored-gate` com HARNESS-053) — merge squash `20f0e27` em main. CI verde (lint, test 20/22). MI-10 (reinstalação global) **ainda pendente** — próxima ação após aprovação do usuário.
- **MI-10 DONE (2026-08-19, aprovação explícita do usuário)**: reinstalação global em `~/.config/opencode` — plan (2 updates + 3 installs, sem conflitos, exit 0) → install (5 artefatos + 203 inalterados = 208; backup transiente por arquivo + rollback por design; manifest 0.6.0) → setup --platform opencode (exit 0; `plugin` key + barsa MCP preservados) → check ("All managed artifacts match", exit 0) → validação runtime do plugin instalado (40 agents, 12 skills, 11 commands; ot-audit + opentrust-spec-anchored presentes).

## Objective

Reparar as causas raiz de "OpenStrut não instala global corretamente / não atualiza arquivos / opencode.json na pasta global do OpenCode":

1. **Plugin sources fora do pack**: `package.json` `files` = `bin, src, global, templates, workflows` — `plugins/` e `.opencode/plugins/` NÃO entram no tarball. Instalação global via tarball → `openstrut setup --platform opencode|claude|codex|hermes` falha com "Source directory not found". (Verificado: `npm pack --dry-run --json` → 0 arquivos de plugin.)
2. **Plugin OpenCode com SyntaxError**: `.opencode/plugins/opentrust.js` linha 34 usa `await import('node:fs')` dentro de função não-async (`loadAgents()`); `loadSkills()` lê `global/skills` esperando `.md` direto, mas skills vivem em subdiretórios → plugin morto na chegada e carregaria 0 skills. (Verificado: `node --input-type=module --check` → SyntaxError.)
3. **Plugin OpenCode não registrado no global**: `global/opencode.json` não tem chave `plugin`; `setup --platform opencode` instala em `.opencode/plugins/` do cwd (projeto), não no global.
4. **Docs desatualizados e task plans stale**: `docs/usage/skills.md` (39 skills antigas vs 11 reais), README (contagens velhas), `docs/installation/opencode.md` (caminhos inexistentes); HARNESS-001-migrate-agents (superseded), HARNESS-048/049 untracked.

## Acceptance Criteria

- [ ] `npm pack --dry-run --json` inclui `plugins/opentrust/**` e `.opencode/plugins/opentrust.js` (teste de pack RED→GREEN)
- [ ] `.opencode/plugins/opentrust.js` passa `node --input-type=module --check` (teste RED→GREEN)
- [ ] `loadSkills()` descobre as 11 skills em subdiretórios (teste unitário)
- [ ] CI lint cobre `.opencode/plugins/` e `plugins/` (syntax check)
- [ ] Decisão registrada + implementação mínima do wiring do plugin OpenCode global (registro em `global/opencode.json` OU instalação em `~/.config/opencode/plugins/`)
- [ ] Docs atualizados: `docs/usage/skills.md` (11 skills reais), README (contagens), `docs/installation/opencode.md` (caminhos reais)
- [ ] Task plans: HARNESS-001-migrate-agents fechado como superseded; HARNESS-048/049 commitados ou arquivados
- [ ] `npm test` green; `npm run validate:opentrust` green (ou falha pré-existente documentada)
- [x] (Delivery, com aprovação explícita) reinstalação global nesta máquina com backup — DONE 2026-08-19

## Scope

### In Scope

- `package.json` `files` + teste de pack
- `.opencode/plugins/opentrust.js` (fix `await` ilegal + `loadSkills()` subdiretórios)
- CI workflow (lint estendido para `.opencode/plugins/` e `plugins/`)
- Wiring do plugin OpenCode global (decisão + implementação mínima)
- Docs: `docs/usage/skills.md`, `README.md`, `docs/installation/opencode.md`
- Task plans stale: fechar HARNESS-001-migrate-agents (superseded); commit/arquivar HARNESS-048/049
- Reinstalação global nesta máquina (microincremento final, com aprovação explícita)

### Out of Scope

- Mudanças no runtime do plugin Hermes (follow-up separado)
- Novas skills/commands (HARNESS-053)
- Publicar pacote no npm
- Alterações em `~/.config/opencode` sem aprovação explícita (cada passo de delivery será confirmado)
- Semântica adicional do merge (já corrigida em 0.5.2 via PR #20 — source-wins)

## Retrieval Context

Required contexts:
- CTX17 (Engineering)
- CTX19 (DevOps / CI)
- CTX23 (Delivery)

Required bundles:
- B11 (Engineering Core)
- B13 (Delivery / Ops)

Required skills:
- SK14 (Code Refactoring)

Official docs:
- DOC_OPENCODE_CONFIG
- DOC_OPENCODE_AGENTS

Provider:
- local-context-catalog

Policy:
- synthesize-only
- no raw chunks in commits
- cite source IDs when available
- use only approved selectors

## Test Plan

- TDD RED→GREEN:
  1. Pack test: assert `plugins/opentrust/plugin.yaml` e `.opencode/plugins/opentrust.js` presentes no pack (RED antes do fix)
  2. Plugin parse test: `node --input-type=module --check` no plugin (RED: SyntaxError)
  3. loadSkills test: 11 skills descobertas de subdiretórios (RED: 0)
- Validação: `npm test`, `npm pack --dry-run --json` (asserts), `node --check` em `.opencode/plugins/` e `plugins/`, `openstrut plan --dry-run` em target temporário
- Não tocar `~/.config/opencode` sem aprovação (delivery final)

## Microincrements

1. RED: teste de pack (plugins ausentes)
2. GREEN: `package.json` `files` += `plugins`, `.opencode/plugins`
3. RED: teste de parse do plugin (SyntaxError)
4. GREEN: fix `opentrust.js` (remover `await` ilegal; `loadSkills()` lê subdiretórios)
5. CI: estender lint para `.opencode/plugins/` e `plugins/`
6. Decisão + wiring do plugin OpenCode global (confirmar com usuário: registro em `global/opencode.json` vs diretório global de plugins)
7. Docs: `skills.md`, `README.md`, `installation/opencode.md`
8. Task plans: fechar HARNESS-001-migrate-agents (superseded); commit/arquivar HARNESS-048/049
9. Validação completa + review
10. (Delivery, aprovação explícita) reinstalar global nesta máquina (backup + install + setup)

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Tests pass (`npm test` + novos testes)
- [ ] Review approved
- [ ] Committed with conventional commit message (ex.: `fix(installer): ship plugin sources in package`)