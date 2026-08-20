# HARNESS-054: Fix OpenCode plugin format, merge reconciliation, and plugin API

## Objective

Corrigir na origem a integração OpenTrust ↔ OpenCode para o `opencode.json` global:

1. **Formato inválido de `plugin`** — `global/opencode.json` usa `{"spec": "file:..."}` (objeto), que quebra o OpenCode 1.18.18 com `Configuration is invalid ... Expected string | array, got {"spec":"file:..."} plugin.0`. Corrigir para string relativa `".opencode/plugins/opentrust.js"`.
2. **Merge cego** — `mergeJson` preserva chaves gerenciadas obsoletas para sempre. Adicionar reconciliação: source-wins para chaves gerenciadas + remoção de gerenciadas obsoletas + preservação das não gerenciadas.
3. **API do plugin incompatível** — `.opencode/plugins/opentrust.js` usa `export default { bootstrap }` (API antiga), que falha com `Plugin export is not a function`. Reescrever para a API atual (named export function com hook `tool`).

## Classification

- Type: bugfix + refactoring (behavioral)
- Workflow: issue → branch → TDD → small change → validation → self-review → commit (local)
- Issue: HARNESS-054 (task plan)
- Branch: `fix/opencode-plugin-format`
- PR: não abrir sem aprovação explícita (regra do repo)
- Worktree: não necessário (main limpa, trabalho isolado em branch)

## Approval Evidence

- Usuário aprovou escopo expandido: "Incluir rewrite no mesmo task (Recommended)" — reescrever opentrust.js para API atual junto com config/merge/coerência.
- Usuário aprovou workflow: "Task plan + branch + commits locais (Recommended)" — HARNESS-054, branch `fix/opencode-plugin-format`, commits locais, sem push/PR sem aprovação explícita.

## Scope

### In Scope

- `global/opencode.json`: `plugin` → `[".opencode/plugins/opentrust.js"]` (string relativa)
- `src/installer/merge.js`: `reconcileManagedKeys(source, target, managedKeys)` + `MANAGED_KEYS`
- `src/installer/install.js`: aplicar reconciliação antes do merge em `mergeable-json`
- `.opencode/plugins/opentrust.js`: reescrever para API atual (named export function + hook `tool` com os 10 tools ot-*)
- Testes: `tests/plugins/opencode-wiring.test.js`, `tests/plugins/opencode-load.test.js`, `tests/installer/merge.test.js`, `tests/installer/installer.test.js`
- Docs que citam o formato legado: `docs/installation/opencode.md`, header do plugin, `docs/decisions/ADR-007-multi-platform-plugin-architecture.md`, `docs/design/011-multi-platform-plugin-system.md`

### Out of Scope

- Publicar pacote, criar release tarballs, push, PR (sem aprovação explícita)
- Alterar runtime Hermes
- Refatorações paralelas não relacionadas
- Alterar `~/.config/opencode` sem backup/rollback (delivery final)

## Managed Keys (top-level de opencode.json)

`$schema, model, small_model, provider, mcp, default_agent, instructions, references, watcher, permission, agent, plugin`

## User Keys (preservar)

`share, snapshot, autoupdate, compaction`

## Path Strategy (decisão)

- `plugin[0]` = `".opencode/plugins/opentrust.js"` (string relativa, sem prefixo `file:`)
- Resolve contra o diretório do config file (`~/.config/opencode/`) → `~/.config/opencode/.opencode/plugins/opentrust.js`
- Coincide com o target do inventory: `{ source: '.opencode/plugins/opentrust.js', target: '.opencode/plugins/opentrust.js' }`
- Evidência: binário 1.18.18 carrega string relativa sem erro; source dev (`isPathPluginSpec`) aceita `file://`, `.`, absoluto — `file:` (um colon) NÃO é path spec no dev (seria tratado como npm package)
- **Core fora de `.opencode/plugins/`**: o binário auto-carrega TODO `*.{ts,js}` sob `{plugin,plugins}/` (scan `E1.scan("{plugin,plugins}/*.{ts,js}")`). `opentrust-core.js` em `.opencode/plugins/` era carregado como plugin e `resolveContentDir(input, options)` lançava `ERR_INVALID_ARG_TYPE`. Movido para `.opencode/lib/opentrust-core.js` (fora do scan); plugin importa `../lib/opentrust-core.js`. Inventory: `{ source: '.opencode/lib/opentrust-core.js', target: '.opencode/lib/opentrust-core.js' }`. `package.json` `files` inclui `.opencode/lib`.

## Plugin API (decisão)

- Formato atual: named export function `(input, options?) => Promise<Hooks>`
- Hook `tool`: `{ [name]: { description, args, execute(args, context): Promise<ToolResult> } }`
- `args` pode ser objeto plano (JSON schema) — confirmado no binário (`Wn` converte objeto plano em JSON schema; zod é opcional)
- `ToolResult` = `string | { title?, output, metadata?, attachments? }`
- Exportar SOMENTE funções (getLegacyPlugins itera todos os exports e lança "Plugin export is not a function" se algum não for função)
- Loaders (`loadAgents` etc.) vivem em `opentrust-core.js` em `.opencode/lib/` — FORA de `.opencode/plugins/` (auto-scan do binário carrega todo `*.{ts,js}` de `{plugin,plugins}/` como plugin; empiricamente `resolveContentDir(input, options)` lançava `ERR_INVALID_ARG_TYPE`)

## Microincrements

1. **MI-1**: Task plan + branch `fix/opencode-plugin-format`
2. **MI-2 (RED)**: Atualizar `tests/plugins/opencode-wiring.test.js` (plugin[0] é string relativa, resolve para arquivo existente) + adicionar testes de reconciliação em `tests/installer/merge.test.js` + testes de install (remoção de obsoleta, plugin instalado, coerência) em `tests/installer/installer.test.js` + teste de formato do plugin em `tests/plugins/opencode-load.test.js`. Rodar e confirmar RED.
3. **MI-3 (GREEN)**: Corrigir `global/opencode.json` (plugin string relativa)
4. **MI-4 (GREEN)**: Adicionar `reconcileManagedKeys` + `MANAGED_KEYS` em `src/installer/merge.js` e aplicar em `src/installer/install.js`
5. **MI-5 (GREEN)**: Reescrever `.opencode/plugins/opentrust.js` para API atual (named export function + hook tool)
6. **MI-6**: Rodar `npm test` completo; validar JSON contra schema oficial; instalação isolada em temp dir
7. **MI-7**: Atualizar docs (installation/opencode.md, header do plugin, ADR-007, design/011)
8. **MI-8**: Self-review do diff; commit local com Conventional Commits
9. **MI-9**: Delivery em `~/.config/opencode` com backup/rollback (após aprovação); abrir OpenCode 1.18.18 confirmando ausência de erros

## TDD Strategy

- RED antes de qualquer mudança de produção (MI-2)
- GREEN por microincremento (MI-3..MI-5)
- Evidência RED/GREEN registrada

## Validation

- `npm test` completo (reportar passed/failed/skipped)
- Validação do JSON contra schema oficial (`/tmp/opencode-schema.json`)
- Instalação isolada em temp dir: `plugin[0]` string + `fs.existsSync` do arquivo
- Delivery em `~/.config/opencode` com backup/rollback
- Abrir OpenCode 1.18.18: sem `Expected string | array`, sem `Plugin export is not a function`

## Acceptance Criteria

- [ ] `plugin[0]` é string, nunca objeto com `.spec`
- [ ] `fs.existsSync` do `plugin[0]` resolvido contra o config dir
- [ ] Diretório pai criado na instalação
- [ ] Update do plugin funciona (checksum muda → re-copia)
- [ ] Remoção de chave gerenciada obsoleta do target
- [ ] Preservação de chave do usuário
- [ ] Idempotência (2 runs sem diff)
- [ ] Instalação completa coerente (JSON válido + plugin presente + manifest consistente)
- [ ] Plugin carrega com API atual (sem `Plugin export is not a function`)
- [ ] OpenCode inicia sem erro de schema

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Tests pass (`npm test`)
- [ ] Review approved (self-review + diff inspecionado)
- [ ] Documentation updated
- [ ] Committed with conventional commit message (local, sem push/PR sem aprovação)

## Evidence

- RED: saída dos testes falhando (MI-2)
- GREEN: saída dos testes passando (MI-3..MI-5)
- Empírico: binário 1.18.18 carrega string relativa; source dev confirma `isPathPluginSpec`
- Delivery: backup + instalação + verificação em `~/.config/opencode`

## Risks

- ~~Loaders chamados como plugins no startup~~ → **desmentido empiricamente**: auto-scan de `{plugin,plugins}/*.{ts,js}` carregava `opentrust-core.js` como plugin e `resolveContentDir(input, options)` lançava `ERR_INVALID_ARG_TYPE`. Corrigido movendo o core para `.opencode/lib/` (fora do scan). Verificado: e2e no repo sem `failed to load plugin`.
- `file:` (um colon) não é path spec no source dev → decisão de usar string relativa sem prefixo
- Provedor de modelo indisponível no ambiente de teste → hang ambiental, não relacionado ao plugin (confirmado com `plugin: []` e config mínimo `{}`); e2e flaky (provedor up/down)

## Current State

- MI-1..MI-8 concluídos (task plan, branch, RED, GREEN, validação, docs, self-review, commit)
- MI-6 validação: `npm test` 396 pass/0 fail; schema PASS; install isolado em temp dir (209 artifacts, core em `.opencode/lib/`); e2e binário 1.18.18 no repo: bootstrap OK (40 agents/12 skills/32 contexts/24 bundles/11 commands/10 tools), SEM `failed to load plugin`, SEM erros de schema; `npm pack --dry-run` inclui `.opencode/lib/opentrust-core.js` e `.opencode/plugins/opentrust.js`
- MI-8: commit local `bf9d31f` em `fix/opencode-plugin-format` (18 arquivos, +857/−546); sem push/PR

## Next Action

- Aguardar aprovação para delivery em `~/.config/opencode` (MI-9) com backup/rollback e relatório final