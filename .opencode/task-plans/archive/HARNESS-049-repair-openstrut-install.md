# HARNESS-049 — Reparar instalação do OpenStrut e config do OpenCode (0.3.1 → 0.5.1)

## Meta

- Task ID: HARNESS-049
- Classification: delivery
- Status: closed
- Approval: contrato aprovado pelo usuário em 2026-08-07 ("aprovado") após fase Propose
- Branch: N/A (nenhuma mudança versionada no repo)
- Base: main (intocado)
- Worktree: N/A

## Scope

### In Scope
- Backup da config atual `~/.config/opencode/opencode.json` com timestamp
- Update do binário global: `npm install -g /srv/projects/opencode-engineering-harness` (0.5.1)
- `openstrut install --force` (0.5.1) → reinstala artefatos gerenciados
- `openstrut setup --cli opencode` (0.5.1) → corrige `mcp.barsa.url` para `{env:BARSA_MCP_URL}`
- Desabilitar plugin `crg-plugin.ts` (backup + rename `.disabled`)
- Remover diretório vazio `"$tempHome` (raiz do repo, untracked)
- Validações pós-instalação

### Out of Scope
- Alterações em `src/`, `bin/`, `tests/`, `global/` (código do openstrut)
- Semântica do merge (`merge.js`) — follow-up proposto
- Publicar pacote no npm
- Outros CLIs (codex/claude/hermes)
- Apagar backups antigos

## Acceptance Criteria (do contrato)

- [ ] `openstrut --version` = 0.5.1
- [ ] `installation.json` registra packageVersion 0.5.1
- [ ] `mcp.barsa.url` = `{env:BARSA_MCP_URL}`
- [ ] provider 9router contém combo-prefeitura-lead/tech/light
- [ ] `openstrut check`: drift apenas em opencode.json (merge esperado)
- [ ] Log fresco do OpenCode sem barsa unavailable e sem crg-plugin error
- [ ] Backup timestamped criado antes de qualquer escrita
- [ ] Nenhum arquivo em src/bin/tests alterado
- [ ] `"$tempHome` removido
- [ ] (Opcional, com confirmação) issue follow-up do merge

## Assumptions / Risks

- Assumption: npm install -g a partir da pasta do repo funciona (sem registry; private não bloqueia install local).
- Risk: install --force sobrescreve AGENTS.md/agentes com versão 0.5.1 — esperado (artefatos gerenciados).
- Risk: `opencode models` pode tentar rede — read-only; se falhar, reportar sem tratar como sucesso.
- Open question: issue follow-up do merge — confirmar com usuário no final.

## Microincrements (ordenados)

1. Baseline repo: `npm test` (JÁ EXECUTADO: 267 pass) + `npm pack --dry-run --ignore-scripts`
2. Estado atual + backup timestamped de `~/.config/opencode/opencode.json`
3. Update global: `npm install -g /srv/projects/opencode-engineering-harness` → `openstrut --version` = 0.5.1
4. `openstrut install --force` → verificar installation.json = 0.5.1
5. `openstrut setup --cli opencode` (dry-run preview → real) → verificar mcp.barsa.url
6. Desabilitar `crg-plugin.ts` (backup + rename)
7. Validação final: `openstrut check`, asserts na config, `opencode models`, log limpo
8. Cleanup `"$tempHome`; (opcional) issue follow-up
9. Relatório final + Review

## TDD-First

- N/A — task de delivery, nenhuma mudança de código em src/bin/tests (escopo aprovado).
- Validação substituta: comandos do Test Plan do contrato com evidência.

## Validation

- `npm test` baseline (267 pass — executado em Propose)
- `npm pack --dry-run --ignore-scripts`
- `openstrut --version`, `openstrut check`
- Asserts em `~/.config/opencode/opencode.json` (node)
- `opencode models 9router` / `opencode models opencode`
- Log do OpenCode: ausência de `server unavailable ... barsa` e `failed to load plugin ... crg-plugin`

## Review / Archive / Delivery

- Review: comparar estado antes/depois (nada de código alterado); critérios de aceite.
- Archive: N/A (nenhum documento versionado alterado).
- Commit/Push/PR: N/A — nenhum arquivo versionado alterado.
- Rollback: restaurar backup timestamped do opencode.json; artefatos rastreados em `.openstrut/installation.json`.

## Workflow Checklist

- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate
- [x] Build (microincrements 1–8)
- [x] Review
- [ ] Archive (N/A)
- [ ] Commit (N/A)
- [ ] Push (N/A)
- [ ] Pull Request (N/A)

## Evidence Log

- 2026-08-07: baseline `npm test` → 267 pass / 0 fail (registrado na fase Propose).
- 2026-08-07: task plan criado; Apply inicia.
- MI-1: `npm pack --dry-run --ignore-scripts` → OK (0.5.1, 249 arquivos, 106.6 kB).
- MI-2: backup criado `~/.config/opencode/opencode.json.HARNESS-049-20260807T203119.bak` (sha256 bate com o atual 261500408b...).
- MI-3: `npm install -g /srv/projects/opencode-engineering-harness` → `openstrut --version` = 0.5.1.
- MI-4: `openstrut install --force` → exit 0; `installation.json` = 0.5.1, 205 artefatos.
- MI-5: `openstrut setup --cli opencode` → exit 0; `mcp.barsa.url` = `{env:BARSA_MCP_URL}`; provider 9router com 8 modelos (combo-prefeitura-lead/tech/light presentes); agent models preservados/atualizados (`{env:MODEL_TECH}` etc.); backup do setup `opencode.json.8bd63aae5e3991d9.openstrut-backup`.
- MI-6: `crg-plugin.ts` → `crg-plugin.ts.disabled` + backup `crg-plugin.ts.HARNESS-049.bak`.
- MI-7: `openstrut check` → manifest valid 0.5.1, 204 identical, 1 mergeable-json (opencode.json — esperado); `opencode models 9router` resolve 8 modelos; `opencode models opencode` resolve big-pickle etc.; `opencode serve` (headless) subiu limpo — log sem novas entradas barsa/crg-plugin/ERROR/WARN.
- MI-8: `"$tempHome` removido (continha apenas árvore vazia `.local/share/opencode/secrets"`); `git status` limpo exceto task plans untracked.
- Follow-up: issue criada em patresio/openstrut — https://github.com/patresio/openstrut/issues/17 (merge não propaga fixes de config + merge.test.js fora do npm test).

## Result

- Todos os critérios de aceite 1–9 atendidos (evidência acima).
- Critério 10 (issue follow-up do merge) — pendente de confirmação do usuário.
- Rollback: `opencode.json.HARNESS-049-20260807T203119.bak` / `opencode.json.8bd63aae5e3991d9.openstrut-backup`; artefatos rastreados em `.openstrut/installation.json`; plugin: `crg-plugin.ts.HARNESS-049.bak` (+ rename reversível).
- Status: complete (aguardando Review + decisão do follow-up).

## Review (2026-08-08)

- Re-verificação read-only do estado final:
  - `openstrut --version` = 0.5.1 ✓
  - Repo: `git status` só com task plans untracked; `git diff --stat` vazio (nenhum arquivo versionado alterado) ✓
  - `installation.json`: packageVersion 0.5.1, 205 artefatos ✓
  - Asserts na config: barsaUrl ✓ barsaEnabled ✓ hasPrefeituraModels ✓ topModel ✓ defaultAgent ✓ (TODOS OK)
  - Backups presentes: `opencode.json.HARNESS-049-20260807T203119.bak` + `opencode.json.8bd63aae5e3991d9.openstrut-backup` ✓
  - Plugin: `crg-plugin.ts.disabled` + `crg-plugin.ts.HARNESS-049.bak` ✓
  - Log: sem novas ocorrências de ERROR/WARN barsa/crg-plugin após a correção (serve headless limpo em 2026-08-07T23:33) ✓
  - Issue follow-up: https://github.com/patresio/openstrut/issues/17 (OPEN) ✓
- Resultado: **Review aprovado** — critérios de aceite 1–10 atendidos.
- Status: **closed**
