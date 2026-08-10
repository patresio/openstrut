# Task: HARNESS-050 — fix(hermes): repair and validate OpenTrust adapter

## Objective

Rewriter (SMALL REWRITE) da camada de adaptação Hermes do OpenStrut para o contrato real do Hermes v0.20.0 validado no G5. O plugin atual (`plugins/opentrust/`) usa APIs incompatíveis (manifest com `command:`, handlers `(session, task, project)`, `session.context.*`, hooks `on_session_start` inexistentes, skills com path relativo sem diretório real). Reescrever apenas a camada de adaptação Hermes; reutilizar `register(ctx)`, intenção das tools `ot_*`, 11 skills canônicas e arquitetura de plugin.

## Classification

- Type: bugfix + validação de contrato (SMALL REWRITE da camada Hermes)
- TDD: aplicável (comportamento de loader/registro de tools e skills)
- Issue: requerida (aprovada pelo usuário)
- Branch: requerida (aprovada: `fix/hermes-adapter`)
- PR: requerido (após review)
- Worktree: não requerido (branch dedicada, sem conflito com trabalho paralelo)

## Status

- [x] Explore: análise ot-create (G1-G5) concluída
- [x] Propose: task contract aprovado com 3 ajustes
- [x] G5: validação do contrato real do Hermes concluída — **decisão SMALL REWRITE**
- [x] Apply: M2-M8 concluído (M3 RED, M4/M5 GREEN, M6 docs, M7 isolamento, M8 validação)
- [x] Review: code-reviewer APPROVE (sem blockers; findings menores não funcionais)
- [x] Ship: commit `7b200a7` push + PR **#18** criado — CI verde (lint, test 20, test 22), mergeable
- [ ] Merge (gate humano)

## Approval Evidence

- Usuário aprovou o task contract com 3 ajustes (AC3 dinâmico sem magic number; OPENSTRUT_ROOT apenas dev, runtime autossuficiente; G5 primeiro).
- Usuário aprovou branch `fix/hermes-adapter` + SMALL REWRITE + sequência M2→M3→M4→M5→M6→M7→M8.
- G5 evidência: Hermes v0.20.0 (2026.8.3) instalado em `~/.hermes/hermes-agent/`; docs oficiais locais `website/docs/developer-guide/plugins/index.md` e `website/docs/user-guide/features/hooks.md`.

## G5 Decision (registro arquitetural obrigatório)

### Hermes integration model (aprovado)

```
OpenStrut source
      ↓
installer
      ↓
~/.hermes/plugins/opentrust/
├── plugin.yaml
├── __init__.py
├── tools.py
├── hooks.py
├── skills/
├── roles/
├── context/
└── workflows/
```

O plugin instalado deve ser **autossuficiente**: Hermes lê o plugin instalado; não tenta adivinhar onde está o repo OpenStrut. Durante desenvolvimento pode ler do repo fonte via `OPENSTRUT_ROOT`; no runtime instalado carrega resources do próprio diretório (`Path(__file__).parent`).

### Contrato real validado (Hermes v0.20.0)

| API | Contrato real |
|---|---|
| Manifest | `plugin.yaml` com `name`, `version`, `description`, `author`, `kind`, `provides_tools`, `provides_hooks`, `requires_env` — em `~/.hermes/plugins/<name>/plugin.yaml` |
| Entry | `__init__.py::def register(ctx)` chamado exatamente uma vez |
| Tool | `ctx.register_tool(name=..., toolset=..., schema=..., handler=...)`; handler `def h(args: dict, **kwargs) -> str` retorna JSON string, nunca levanta |
| Hook | `ctx.register_hook(<evento_real>, fn)` — eventos como `post_tool_call`, `on_session_end`; gateway hooks via `HOOK.yaml`+`handler.py` |
| Skill | `ctx.register_skill(name, Path_to_SKILL.md)`; read-only, namespaced (`plugin:skill`), via `skill_view`; estrutura `skills/<name>/SKILL.md` |
| Data | Plugin lê dados do próprio dir (`Path(__file__).parent / "data"`); ship-data-files nativo |
| Instalação | `hermes plugins install owner/repo` → `~/.hermes/plugins/<name>/`; `hermes plugins list/enable` |

### Decisão: SMALL REWRITE

**Mantém:** `register(ctx)`, intenção das 10 tools `ot_*`, 11 skills canônicas (`global/skills/*/SKILL.md`), arquitetura de plugin.
**Reescreve:** `plugin.yaml` (formato nativo), handlers das tools (schemas JSON + `(args: dict, **kwargs) -> str`), registro das skills (`ctx.register_skill(name, Path)` com descoberta dinâmica recursiva `*/SKILL.md`), hooks (somente eventos reais; mínimo necessário), resource resolution (autossuficiente via `Path(__file__).parent`; `OPENSTRUT_ROOT` apenas em dev).

### Hooks: política

Hooks somente onde houver evento real necessário. Preferência: Skills→conhecimento, Tools→ações `ot_*`, Hooks→mínimo ou nenhum. Não reconstruir injeção de contexto em `on_session_start` (API falsa).

## Acceptance Criteria

- [ ] AC1 — Contrato validado: plugin usa API suportada pelo Hermes real (decisão SMALL REWRITE registrada)
- [ ] AC2 — Instalação não depende da localização do repo fonte: plugin instalado autossuficiente
- [ ] AC3 — 11 skills canônicas descobertas dinamicamente de `global/skills/*/SKILL.md`; teste comprova 11/11 **sem número mágico no código**
- [ ] AC4 — `load_skills()` suporta subdiretórios `*/SKILL.md` (recursivo)
- [ ] AC5 — Estratégia para roles/context/workflows documentada (plugin autossuficiente; sem cópia manual como arquitetura final)
- [ ] AC6 — `docs/installation/hermes.md` aponta para diretórios que existem
- [ ] AC7 — Instalação validada em diretório temporário isolado
- [ ] AC8 — Testes provam que resources resolvem fora do repo (temp dir + fake hermético)
- [ ] AC9 — Hermes carrega plugin sem traceback (smoke com fake ctx)
- [ ] AC10 — Pelo menos uma skill OpenStrut descoberta/carregada via adapter Hermes
- [ ] AC11 — Nenhuma mudança no runtime OpenCode nesta Issue

## Scope

### In Scope
- `plugins/opentrust/` — reescrita da camada Hermes (plugin.yaml, __init__.py, tools.py, hooks.py, skills/)
- Descoberta dinâmica de skills de `global/skills/*/SKILL.md` (sem magic number)
- Resource resolution autossuficiente (`Path(__file__).parent`), `OPENSTRUT_ROOT` só em dev
- `docs/installation/hermes.md` — corrigir caminhos
- `tests/plugins/hermes.test.js` — refatorar para asserts estruturais + novos testes (loader, resource discovery, smoke)
- `src/plugins/plugin-installer.js` / `src/setup/` — apenas ajuste mínimo se necessário para instalar plugin autossuficiente

### Out of Scope
- Slimming/refactor do OpenCode (opencode.jsonc, tripla definição de agentes, instructions, validador 38vs40, docs duplicadas)
- `delegate_openstrut` / novo adapter Hermes do zero
- Integração Vikunja/GitHub/issues
- Reorganização física em `adapters/`
- Mudanças em `~/.hermes/` real sem aprovação (testes usam temp dir/fake)
- Alteração do runtime/configuração OpenCode (AC11)

## Retrieval Context

Required contexts:
- CTX01 — OpenTrust foundation
- CTX03 — Operational retrieval map
- CTX17 — Engineering workflow
- CTX23 — Task contracts

Required bundles:
- B01 — Foundation
- B11 — Engineering core

Required skills:
- SK01 — opentrust-task-contract
- SK03 — opentrust-reference-research
- SK08 — opentrust-spec-change

Official docs:
- DOC_OPENCODE_CONFIG
- DOC_OPENCODE_AGENTS
- DOC_OPENCODE_SKILLS

Provider:
- local-context-catalog (workflow/contratos)
- API real do Hermes = validação empírica (concluída no G5)

Policy:
- synthesize-only
- no raw chunks in commits
- cite source IDs when available
- use only approved selectors

## Teams Involved

| Team | Role |
|------|------|
| Engineering | Implementação do SMALL REWRITE + resource discovery |
| Quality | TDD RED/GREEN loader + resource discovery + smoke tests |
| Review / Governance | Validação de escopo, AC11, gate antes do Ship |
| Knowledge | Síntese de selectors aprovados |
| Delivery | Issue, branch, commit, PR (após aprovação) |

## Dependencies

- G5 concluído (contrato real validado) ✅
- `npm test` baseline GREEN antes de iniciar mutações
- Fake ctx hermético para smoke (contrato mínimo validado)

## Risks

- API adicional do Hermes divergente durante implementação → **parar e reportar** antes de ampliar escopo
- Falso verde de testes de string → asserts estruturais obrigatórios
- Escopo vazar para OpenCode → AC11 + review
- Plugin não autossuficiente → teste de isolamento em temp dir (AC7/AC8)

## Microincrements

### M1: G5 — Contrato real validado
- [x] Inspecionar Hermes instalado (~/.hermes/hermes-agent/, v0.20.0)
- [x] Confrontar plugin atual vs API real
- [x] Registrar decisão SMALL REWRITE (feito acima)

### M2: Refatorar testes estruturais
- [x] Reescrever `tests/plugins/hermes.test.js`: parse YAML top-level (sem deps), verificação de arquivos referenciados existirem, schemas JSON de tools, handlers com assinatura real, skills dinâmicas, hooks reais, isolamento
- [x] Testes rodam: **11 pass / 9 fail** (RED — plugin ainda no contrato antigo)
- RED registrado: 9 falhas — register_tool sem assinatura nativa, schemas ausentes, handlers `(session,task,project)` legados, skills/ dir ausente, `session.context` presente, `on_session_start` fake, resource discovery via `parent.parent.parent`

### M3: TDD RED — loader dinâmico de skills + resource discovery
- [x] Teste comportamental `tests/plugins/hermes_behavior_test.py` criado (fake ctx, contrato real Hermes)
- [x] RED registrado: **56 falhas** — tools sem `toolset=/schema=/handler=`, skills com paths errados (`skills/opentrust_*.md` em vez de `*/SKILL.md`), `session.context` presente, `on_session_start` fake

### M4: TDD GREEN — loader + resource resolution
- [x] `plugins/opentrust/resource_loader.py` criado: `resolve_skills_dir()` (instalado: `<plugin_dir>/skills`; dev: `$OPENSTRUST_ROOT/global/skills`), `discover_skills()` (`*/SKILL.md`, sem magic number), `load_skills(ctx)`
- [x] Testes passam (GREEN): comportamento 0 falhas (dev 11/11 + instalado 11/11), estrutural 22 pass

### M5: Reescrever plugin no contrato real
- [x] `plugin.yaml` nativo (name, version, description, author, kind: backend, provides_tools; sem `command:`)
- [x] `__init__.py`: `register(ctx)` → `ctx.register_tool(name=, toolset=, schema=, handler=)` para 10 tools `ot_*`
- [x] `tools.py`: handlers `(args: dict, **kwargs) -> str` retornando JSON string; schemas JSON com `parameters`
- [x] `hooks.py`: **removido** — política de hooks aprovada diz "mínimo ou nenhum"; plugin é guidance-only, nenhum evento real necessário (decisão registrada, AC do contrato)
- [x] Skills: `ctx.register_skill(name, Path)` via `load_skills()` dinâmico (sem lista hardcoded)
- [x] Testes passam (GREEN)

### M6: Documentação de instalação
- [x] `docs/installation/hermes.md` reescrito: instalação em `~/.hermes/plugins/opentrust/`, plugin autossuficiente, `OPENSTRUT_ROOT` só em dev, lista real de skills (kebab-case canônico), hooks = nenhum
- [x] Sincronizar lista de skills com a realidade (11 canônicas)

### M7: Testes isolados + smoke
- [x] `plugin-installer.js`: ajuste mínimo — `populateHermesSkills()` copia `global/skills/*/SKILL.md` → `<pluginDir>/skills/<name>/SKILL.md` na instalação Hermes (AC2 autossuficiência)
- [x] Teste installer: instala Hermes em temp dir, prova skills/ populado 11/11 (RED→GREEN, 27 pass)
- [x] Teste comportamental modo instalado: copia plugin + skills para temp dir, `register(ctx)` sem traceback, 11 skills registradas (AC7/AC8/AC9/AC10)
- [x] `.gitignore`: `__pycache__/`, `*.py[cod]` (novo código Python)
- [x] Testes passam

### M8: Validação + revisão de escopo
- [x] `npm test` full: **316 pass / 0 fail** (inclui `tests/plugins/hermes.test.js` + `plugin-installer.test.js` adicionados ao script `test` — CI antes não rodava testes Hermes)
- [x] `npm run test:setup` passa
- [x] `node scripts/validate-opencode-config.mjs`: falha 38 vs 40 — **pré-existente, fora de escopo** (AC11: nenhuma mudança no runtime OpenCode; `git status` confirma nenhum arquivo OpenCode tocado)
- [x] `npm pack --dry-run --ignore-scripts` passa
- [x] Self-review: diff limitado à camada Hermes (plugins/opentrust, installer, docs, tests, package.json scripts, .gitignore)
- [ ] Revisão e PR

## TDD Strategy

- RED: testes falham por comportamento ausente (loader, resource resolution)
- GREEN: implementação mínima
- REFACTOR: limpeza com testes verdes
- Testes estruturais substituem asserts de substring

## Validation

- `node --test tests/plugins/hermes.test.js tests/plugins/plugin-installer.test.js tests/setup/setup.test.js`
- `npm test` (full)
- `node scripts/validate-opencode-config.mjs` (deve permanecer idêntico — não faz parte do escopo; se falhar por 38vs40, NÃO corrigir nesta Issue)

## Review

- code-reviewer: **APPROVE** — sem blockers. Findings menores: F1 (plugin.yaml poderia ter `provides_hooks: []` cosmético), F2 (nit .gitignore). Nenhum funcional.
- Escopo: diff limitado à camada Hermes; nenhum arquivo OpenCode runtime modificado (AC11).
- Evidência: npm test 316/316; hermes_behavior_test.py 0 falhas (dev + instalado 11/11).

## Delivery

- Commit: `7b200a7 fix(hermes): rewrite OpenTrust adapter for real Hermes contract`
- Push: `github fix/hermes-adapter` ✅
- PR: **https://github.com/patresio/openstrut/pull/18** — base `main`, CI verde (lint, test 20, test 22), MERGEABLE
- Merge: aguardando aprovação humana (Merge Gate)

## Evidence

- G5: relatório de validação (contrato Hermes v0.20.0) — registrado neste task plan
- RED/GREEN: saída de testes em cada microincremento

## Blockers

- Nenhum atualmente. Se nova incompatibilidade de API Hermes aparecer durante M2-M8, parar e reportar (regra do usuário).

## Current State

Branch `fix/hermes-adapter`. Apply (M2-M8) concluído: plugin Hermes reescrito no contrato real, loader dinâmico de skills, installer autossuficiente, docs atualizadas, 316 testes Node pass + teste comportamental Python 0 falhas. Aguardando Review Gate.

## Next Action

Review — submete diff para revisão independente antes do Ship (commit + PR).
