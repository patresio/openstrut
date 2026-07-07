# HARNESS-011 — Change Execution Manifest

## 1. Objective

Transformar uma change OpenSpec aprovada em um manifesto determinístico de execução, sem executar nenhuma task.

### Input

```text
openspec/changes/<change>/
├── proposal.md
├── tasks.md
├── specs/
│   └── <capability>/
│       └── spec.md
└── design.md  # opcional
```

O gerador lê `proposal.md` e as specs apenas para validar a estrutura da change.
A definição das unidades executáveis vem exclusivamente de `tasks.md`.

### Output

```text
openspec/changes/<change>/execution-manifest.yaml
```

Nenhum outro arquivo deve ser alterado.

---

## 2. Contrato Explícito de Task

O manifesto exige que o `tasks.md` seja explícito.
O gerador não infere semântica, não cria IDs pela posição, não renumera IDs e não deduz ligações.

Formato obrigatório em `tasks.md`:

```markdown
## T001 — Modelar estado de primeiro acesso

Agent: build
Skills:
- engineering-tdd-first
Depends on: none
Parallel group: none
```

---

### 2.1 Regras de IDs

- IDs devem obedecer ao padrão `^T[0-9]{3,}$`.
- IDs são definidos exclusivamente em `tasks.md`.
- O gerador nunca cria IDs pela posição e nunca renumera IDs.
- Task sem ID bloqueia a geração.
- IDs duplicados bloqueiam a geração.
- Suporte a documentos legados sem IDs está **adiado** e fora deste incremento.

Erros bloqueantes:

```text
BLOCKED — TASK ID REQUIRED
BLOCKED — DUPLICATE TASK ID
BLOCKED — INVALID TASK ID
```

---

### 2.2 Regras de Agents

- Cada task deve declarar um agent explícito.
- Field ausente bloqueia a geração.
- Agents válidos neste incremento: `build`, `code-reviewer`, `project-rules-auditor`.
- O gerador apenas valida o nome declarado contra o inventário.
- Seleção semântica de agent e invenção de nomes são proibidas.

Erros bloqueantes:

```text
BLOCKED — TASK AGENT REQUIRED
BLOCKED — UNKNOWN AGENT
```

---

### 2.3 Regras de Skills

- Cada task deve declarar suas skills explicitamente.
- Quando nenhuma skill for necessária, a declaração obrigatória é `Skills: none`.
- Field ausente bloqueia a geração.
- Validação estrita contra o inventário do harness; inferência por semântica é proibida.
- Duplicatas são normalizadas; a ordem canônica é alfabética.
- Roteamento inteligente de skills fica **adiado** e fora deste incremento.

Erros bloqueantes:

```text
BLOCKED — TASK SKILLS DECLARATION REQUIRED
BLOCKED — UNKNOWN SKILL
```

---

### 2.4 Regras de Dependências

- Dependências devem ser declaradas explicitamente:
  - Lista: `Depends on:\n  - T001\n  - T002`
  - Sem dependências: `Depends on: none`
- Field ausente bloqueia a geração.
- O gerador copia apenas o que for declarado; inferência por texto é proibida.
- A ordem do manifesto deve respeitar o grafo de dependências.
- Dependência em task inexistente bloqueia.
- Dependência circular bloqueia.
- Dependência da própria task bloqueia.
- Inferência assistida de dependências fica **adiada** e fora deste incremento.

Erros bloqueantes:

```text
BLOCKED — DEPENDENCY DECLARATION REQUIRED
BLOCKED — UNKNOWN TASK DEPENDENCY
BLOCKED — CYCLIC DEPENDENCY
BLOCKED — SELF DEPENDENCY
```

---

### 2.5 Regras de Paralelismo

- O campo `Parallel group` é obrigatório em cada task.
- Valores aceitos: nome do grupo (ex.: `auth-read-model`) ou `none`.
- Field ausente bloqueia a geração.
- O gerador apenas preserva os grupos declarados; sugestão automática de paralelismo é proibida.
- Tasks com dependência direta ou transitiva entre si não podem pertencer ao mesmo grupo; conflito bloqueia.
- Sugestão automática de paralelismo fica **adiada** e fora deste incremento.

Erro bloqueante:

```text
BLOCKED — PARALLEL GROUP DECLARATION REQUIRED
BLOCKED — INVALID PARALLEL GROUP
```

---

## 3. Representação de Aprovação

Frontmatter explícito obrigatório em `proposal.md`:

```yaml
---
change_id: force-password-change-first-login
status: approved
approved_by: patrese
approved_at: 2026-06-18T00:00:00Z
---
```

Regras:

- `change_id` obrigatório.
- `status` deve ser exatamente a string `approved`.
- `approved_by` obrigatório e não vazio.
- `approved_at` obrigatório em formato ISO 8601.
- A aprovação deve estar no arquivo versionado. Textos livres como "aprovado" não são aceitos.

Erros bloqueantes:

```text
BLOCKED — CHANGE APPROVAL METADATA REQUIRED
BLOCKED — CHANGE NOT APPROVED
BLOCKED — INVALID APPROVAL METADATA
```

*Nota: assinatura criptográfica e integração com identidade estão **adiadas** e fora deste incremento.*

---

## 4. Schema Mínimo do Manifesto

```yaml
schema_version: 1

change:
  id: force-password-change-first-login
  path: openspec/changes/force-password-change-first-login
  approval:
    status: approved
    approved_by: patrese
    approved_at: "2026-06-18T00:00:00Z"

manifest:
  status: waiting_for_execution_approval

tasks:
  - id: T001
    title: Modelar estado de primeiro acesso
    source:
      file: tasks.md
      heading: "T001 — Modelar estado de primeiro acesso"
    agent: build
    skills:
      - engineering-tdd-first
    depends_on: []
    parallel_group: null
    status: pending
```

*Nota: `generated_at` e quaisquer timestamps operacionais são excluídos do conteúdo principal do manifesto para assegurar comparação semântica byte a byte. Quando operacionalmente necessários, podem ser incluídos em metadata separada, excluída da comparação semântica.*

---

## 5. Serialização Determinística

A mesma árvore de arquivos da change deve produzir exatamente o mesmo manifesto, byte a byte.

O gerador nunca usa saída livre de LLM para construir o manifesto.

Regras fixas de serialização:

- Ordem das chaves conforme o schema.
- Ordem das tasks: respeita o grafo de dependência; tasks no mesmo nível são ordenadas por ID.
- Ordem das skills: alfabética.
- `none` normalizado para lista vazia `[]` ou `null` conforme o campo.
- Line endings: LF.
- Encoding: UTF-8.
- Indentação: dois espaços.
- Arquivo termina com uma única newline.
- Sem comentários gerados.
- Sem timestamps variáveis.
- Sem conteúdo dependente de geração estocástica.

---

## 6. Workflow Final

```text
CHANGE_APPROVED
→ validate OpenSpec structure
→ validate approval frontmatter
→ parse explicit task contract
→ validate stable task IDs
→ validate agents and skills
→ validate dependency graph
→ validate declared parallel groups
→ canonicalize task order and fields
→ generate execution-manifest.yaml
→ WAITING_FOR_EXECUTION_APPROVAL
```

Nenhuma inferência semântica. Nenhum agent iniciado.

---

## 7. Testes do Projeto vs. Testes do Harness

### Durante a geração do manifesto (runtime behavior)

O gerador **não** deve:

- executar testes do projeto da change;
- executar build do repositório da change;
- modificar código do projeto da change.

### Durante a implementação do HARNESS-011 (desenvolvimento do harness)

O harness **deve** conter:

- testes estruturais obrigatórios;
- testes de parsing obrigatórios;
- testes determinísticos obrigatórios;
- testes do installer obrigatórios;
- fixtures válidos e inválidos obrigatórios.

Regras genéricas que proibam testes durante a implementação do harness não se aplicam.

---

## 8. Critérios de Aceitação (Futuros)

O Task Plan exigirá durante a implementação:

- Approval metadata válida (`change_id`, `status: approved`, `approved_by`, `approved_at`);
- IDs explícitos que obedeçam `^T[0-9]{3,}$`;
- Agents explícitos validados contra o inventário;
- Skills explícitas validadas contra o inventário, com ordem canônica;
- Dependências explícitas sem inferência;
- Paralelismo explícito sem sugestão automática;
- Detecção de IDs duplicados;
- Detecção de dependências desconhecidas;
- Detecção de ciclos e auto-dependência;
- Detecção de campos ausentes em qualquer task;
- Saída byte-for-byte determinística;
- Caminho canônico de saída: `execution-manifest.yaml`;
- Schema versionado (`schema_version: 1`);
- Nenhuma mutação externa ao arquivo de manifesto;
- Nenhum agent iniciado;
- Nenhum teste do projeto executado;
- Nenhuma alteração fora de `execution-manifest.yaml`;
- Parada obrigatória no `WAITING_FOR_EXECUTION_APPROVAL` gate;
- Testes estruturais, parsing, determinismo e installer durante a implementação;
- Fixtures válidos e inválidos cobrindo todos os erros bloqueantes.

---

## 9. Follow-ups Adiados

Os seguintes assuntos foram explicitamente removidos do HARNESS-011 e requerem design e aprovação independentes:

- suporte a `tasks.md` legado sem IDs;
- inferência assistida de dependências;
- roteamento inteligente de agents;
- seleção inteligente de skills;
- sugestão automática de paralelismo;
- assinatura criptográfica de aprovação;
- integração MCP (simplechecklist, memory, filesystem, github);
- runner;
- orchestrator.

## 10. Decisões de Implementação (v1)

### Agent Inventory v1
Fixed versioned allowlist containing supported native and harness-managed agents.
A lista é hardcoded na implementação do gerador (`build` é nativo, `code-reviewer` e `project-rules-auditor` são gerenciados).

### CLI v1
Adição do subcomando `generate-manifest --change <path>` no CLI existente (`openstrut`).
