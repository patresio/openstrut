## Decisão central

A configuração deve ser um **harness de engenharia enxuto, versionado e avaliável**, não uma coleção grande de personas, agentes e prompts.

A arquitetura recomendada é:

| Componente               |             Quantidade inicial | Decisão                                                |
| ------------------------ | -----------------------------: | ------------------------------------------------------ |
| Primary agents           |                              2 | `build` e `plan` nativos                               |
| Subagents globais        | 2 obrigatórios + 1 condicional | `explore`, `code-reviewer` e `scout` quando disponível |
| Skills globais           |                              9 | Procedimentos de engenharia carregados sob demanda     |
| Commands globais         |                             10 | Entradas controladas para o workflow                   |
| Memória vetorial         |                              0 | Não usar inicialmente                                  |
| MCPs globais             |               1 ou 2 no máximo | Documentação/retrieval; escrita controlada             |
| Plugins e custom tools   |                 0 inicialmente | Só depois de existir necessidade comprovada            |
| Orquestrador customizado |                              0 | O próprio `build` permanece responsável                |

O motivo principal é que um agente único funciona melhor para tarefas delimitadas e evita custo de coordenação. Sistemas multiagentes fazem sentido quando há especialização realmente independente, paralelismo útil ou quantidade de ferramentas que prejudica a seleção; caso contrário, adicionam comunicação, tokens, latência e estados conflitantes.

---

# 1. Princípios que orientarão o harness

Não vamos transformar literalmente todos os conselhos dos livros em regras. Algumas obras tratam de ferramentas antigas ou exemplos específicos. O que deve ser extraído são os princípios duráveis:

1. **Evidência antes de ação.**
2. **Humano define objetivo, escopo e decisões materiais.**
3. **Agente executa o plano aprovado.**
4. **TDD First para mudanças comportamentais.**
5. **Microincrementos com feedback rápido.**
6. **BDD como descoberta e especificação por exemplos, não como obrigação de gerar `.feature`.**
7. **Refatoração localizada e justificada, nunca limpeza indiscriminada.**
8. **Uma única fonte de estado da tarefa.**
9. **Poucos agentes e poucas ferramentas por contexto.**
10. **Permissões mínimas e nenhuma mutação oculta.**
11. **Validação no ambiente oficial do projeto.**
12. **Avaliação contínua do próprio harness.**

TDD deve servir como mecanismo de design e feedback curto: teste primeiro, implementação mínima e refatoração protegida. Isso reduz over-engineering e mantém o trabalho em incrementos verificáveis.

BDD deve começar nos resultados e critérios de aceitação, conectando comportamento ao valor de negócio. Não deve virar produção burocrática de arquivos Gherkin ou adoção obrigatória de Cucumber.

Refatoração será aplicada no código tocado pela mudança, quando necessária para recebê-la com segurança. O harness deve impedir que uma entrega pequena se transforme em reescrita ou limpeza geral do sistema.

---

# 2. Primary agents

## `build`

Será o agente primário padrão e o responsável por todo o ciclo:

```text
Explore
→ Proposal
→ Planning
→ Approval Gate
→ Task Plan
→ Build
→ Review
→ Archive
→ Commit
→ Push
→ Pull Request
```

Responsabilidades:

- classificar a solicitação;
- encontrar as regras aplicáveis;
- reunir evidências;
- formular proposta e plano;
- parar no Approval Gate;
- criar e manter o Task Plan após aprovação;
- executar TDD;
- integrar resultados dos subagents;
- validar;
- revisar;
- arquivar;
- entregar;
- reportar fatos.

Configuração sugerida:

```text
mode: primary
model: 9router/combo-main
steps: sem limite inicial
temperature: baixa ou padrão do modelo
```

Não criaremos um agente chamado `orchestrator`. Isso duplicaria responsabilidade e criaria um salto de contexto desnecessário.

## `plan`

Permanece como agente primário nativo, manual e estritamente read-only.

Uso:

- exploração extensa;
- discussão arquitetural;
- comparação de alternativas;
- análise de incidentes;
- planejamento sem intenção imediata de executar.

Configuração:

```text
mode: primary
model: opencode/deepseek-v4-flash-free
edit: deny
bash mutating: deny
task: somente explore e scout
```

Decisão atual: manter o modelo barato no `plan` para exploração read-only controlada. Se o planejamento exigir decisão arquitetural crítica, o operador deve escalar explicitamente para um modelo mais forte.

---

# 3. Subagents globais

## 3.1 `explore`

Usaremos o subagent nativo do OpenCode.

Responsabilidade:

- mapear arquivos;
- localizar símbolos;
- rastrear contratos e chamadas;
- localizar testes;
- investigar histórico;
- responder perguntas delimitadas sobre o repositório.

Configuração:

```text
mode: subagent
model: 9router/combo-cheap
steps: aproximadamente 20
edit: deny
bash: somente leitura
task: deny
```

Ele deve retornar:

```text
Findings
Evidence
Affected boundaries
Unknowns
Risks
```

Não deve propor implementações grandes nem modificar arquivos.

## 3.2 `code-reviewer`

Será o único subagent global customizado obrigatório.

Responsabilidade:

- revisar o diff completo;
- verificar escopo aprovado;
- procurar defeitos, regressões e problemas de segurança;
- conferir evidência de TDD;
- detectar alterações não relacionadas;
- verificar testes enfraquecidos;
- avaliar contratos, migrations e compatibilidade;
- produzir achados priorizados.

Configuração:

```text
mode: subagent
model: 9router/combo-main
temperature: baixa
steps: aproximadamente 24
edit: deny
task: deny
bash: somente leitura
hidden: true
```

Formato de saída:

```text
Blocking findings
Major findings
Minor findings
Validation gaps
Scope deviations
Residual risks
Verdict
```

O reviewer não deve corrigir o código. Ele reporta; o `build` decide e executa a correção dentro do Task Plan.

## 3.3 `scout` — condicional

Usaremos o `scout` nativo somente nas versões do OpenCode em que estiver disponível e estável.

Responsabilidade:

- consultar documentação externa;
- verificar APIs e bibliotecas;
- procurar alterações upstream;
- comparar documentação oficial com o código local.

Configuração:

```text
model: 9router/combo-cheap
edit: deny
task: deny
steps: aproximadamente 20
```

## O que acontece com `general`

O subagent nativo `general` permanecerá instalado porque faz parte do OpenCode, mas o `build` não receberá autorização para chamá-lo automaticamente.

Motivo:

- possui escopo amplo;
- pode escrever;
- duplica o papel do `build`;
- reduz rastreabilidade;
- enfraquece a propriedade única da implementação.

A documentação oficial enviada confirma a separação entre primary agents, subagents, permissões e carregamento sob demanda. Também permite limitar exatamente quais subagents cada agente pode invocar. [Documentação oficial do OpenCode](sandbox:/mnt/data/opencode-documentacao-oficial.tar%281%29.gz)

## Subagents que não criaremos

- `tdd-tester`: TDD deve permanecer com quem implementa.
- `debugger`: o `build` deve controlar hipótese, mudança e validação.
- `architect`: arquitetura deve ser decisão discutida com o humano.
- `documentation-writer`: geralmente uma skill é suficiente.
- `security-agent`: inicialmente será uma skill e parte do review.
- swarms ou equipes automáticas.

Subagents adicionais só serão criados quando avaliações mostrarem uma falha recorrente que não possa ser resolvida por uma skill.

---

# 4. Skills globais

Skills são procedimentos estáticos carregados no mesmo contexto. Elas são melhores que subagents quando não precisamos de uma segunda conversa ou de permissões diferentes.

Local global:

```text
~/.config/opencode/skills/<skill-name>/SKILL.md
```

## 4.1 `engineering-task-plan`

Define:

- criação do Task Plan após aprovação;
- formato do ledger;
- identificação do plano ativo;
- estado atual;
- próximo passo;
- registro de evidências;
- atualização de checkboxes;
- tratamento de desvios;
- retomada depois de compactação ou interrupção;
- regra `BLOCKED — REAPPROVAL REQUIRED`.

Será uma das skills centrais.

## 4.2 `engineering-tdd-first`

Define:

- RED válido;
- GREEN mínimo;
- REFACTOR protegido;
- regressão para bugfix;
- TDD outside-in quando adequado;
- exceções justificadas;
- proibição de fabricar GREEN;
- seleção do nível correto de teste.

## 4.3 `engineering-legacy-change`

Baseada em código legado e testes de caracterização:

- identificar comportamento atual;
- criar characterization tests;
- estabelecer seams;
- alterar apenas a região necessária;
- separar refatoração de mudança comportamental;
- evitar rewrites;
- controlar risco quando a cobertura é insuficiente.

## 4.4 `engineering-bdd-discovery`

Define:

- critérios de aceitação;
- exemplos concretos;
- cenários Given/When/Then quando ajudarem;
- exemplos de borda;
- vínculo com testes automatizados;
- living documentation;
- distinção entre BDD e framework BDD.

## 4.5 `engineering-code-review`

Rubrica compartilhada entre `build` e `code-reviewer`:

- comportamento;
- escopo;
- contratos;
- segurança;
- erros e edge cases;
- migrations;
- dependências;
- testes;
- observabilidade;
- documentação;
- diff;
- riscos residuais.

## 4.6 `engineering-delivery`

Define:

- reutilização de issue, branch e PR existentes;
- criação de branch;
- Conventional Commits;
- commits coerentes, não um commit por checkbox;
- sincronização remota;
- verificação da base;
- abertura de PR;
- prevenção de duplicatas;
- proibição de force push;
- relatório factual.

## 4.7 `engineering-incident-triage`

Define:

- coleta de evidências;
- hipótese;
- diagnóstico mínimo;
- contenção;
- classificação da falha;
- controle de blast radius;
- retry com hipótese diferente;
- parada após três tentativas equivalentes;
- escalonamento humano.

## Skill opcional posterior

`engineering-dependency-migration` poderá ser criada caso dependências, schemas e migrations apareçam frequentemente como fonte de falhas. Inicialmente, essas regras podem permanecer no `AGENTS.md` e nos planos locais.

---

# 5. Skills que devem ser locais ao projeto

Não colocaremos globalmente:

- Django;
- FastAPI;
- Angular;
- React;
- Docker;
- PostgreSQL;
- OpenSpec;
- GitHub específico de organização;
- deploy;
- regras de domínio;
- padrões de UI;
- comandos de teste.

Exemplos:

```text
siga/.opencode/skills/openspec-workflow/SKILL.md
healthvault/.opencode/skills/fastapi-backend/SKILL.md
healthvault/.opencode/skills/angular-frontend/SKILL.md
pipeline/.opencode/skills/swarm-production-validation/SKILL.md
```

`openspec-workflow` fica apenas no SIGA e em projetos que efetivamente usam OpenSpec.

---

# 6. Commands globais

Os nomes serão prefixados com `eng-` para evitar colisão com comandos nativos como `/resume`, `/continue`, `/compact` e `/sessions`.

Local:

```text
~/.config/opencode/commands/
```

## `/eng-plan $ARGUMENTS`

Executa no `build`:

```text
Explore → Proposal → Planning → Approval Gate
```

Regras:

- somente leitura;
- não cria Task Plan;
- não cria branch;
- não cria issue;
- encerra pedindo aprovação explícita.

## `/eng-resume`

Não confundir com o `/resume` nativo.

Executa:

1. localizar o Task Plan ativo;
2. ler escopo aprovado;
3. verificar Git status e diff;
4. validar evidências já registradas;
5. identificar o próximo checkbox;
6. continuar daquele ponto.

## `/eng-checkpoint`

Atualiza apenas o Task Plan:

- estado atual;
- passos concluídos;
- evidências;
- arquivos alterados;
- falhas;
- decisões;
- perguntas abertas;
- próximo passo.

Será usado antes de:

- compactar contexto;
- encerrar sessão;
- delegar trabalho;
- trocar de modelo;
- sair do computador.

## `/eng-status`

Read-only.

Mostra:

```text
Task
Approved scope
Current phase
Next action
Git state
Validation state
Blockers
Unresolved risks
```

## `/eng-review`

Configuração:

```yaml
agent: code-reviewer
subtask: true
```

Cria um child session isolado para revisão, sem poluir o contexto principal com toda a análise do diff.

## `/eng-deliver`

Só prossegue quando:

- Build concluído;
- testes válidos;
- Review concluído;
- achados bloqueantes resolvidos;
- Archive concluído;
- Task Plan coerente.

Depois executa apenas as etapas aprovadas de Commit, Push e PR.

## `/eng-incident $ARGUMENTS`

Ativa o fluxo de incidente:

```text
Evidence → Hypothesis → Diagnostic → Containment → Minimal Fix → Validation
```

Não executa limpezas amplas nem experimentos destrutivos.

## Commands que não criaremos globalmente

- `/test`;
- `/lint`;
- `/build`;
- `/migrate`;
- `/deploy`;
- `/openspec`;
- `/init-project`.

Esses comandos dependem do projeto e pertencem ao `CONTRIBUTING.md`, ao `AGENTS.md` local ou aos commands locais.

Nenhum command global deverá incorporar shell com `!command` automaticamente. O agente deve executar comandos por ferramentas normais, passando pelo sistema de permissões.

---

# 7. Arquitetura de memória

A memória será deliberadamente simples e rastreável.

A literatura diferencia conhecimento externo, histórico do agente e contexto montado para cada chamada. Janelas longas ainda perdem informação relevante ou fazem o modelo ignorá-la; mecanismos simples, como estado explícito e busca textual, são suficientes para muitos casos.

## Camada 0 — contexto da sessão

Responsável pelo trabalho imediato:

- conversa atual;
- resultados de tools;
- child sessions;
- resumo automático;
- compaction nativa do OpenCode.

Configuração:

```json
"compaction": {
  "auto": true
}
```

Antes de uma compactação manual relevante:

```text
/eng-checkpoint
/compact
```

## Camada 1 — Task Plan

Arquivo sugerido:

```text
.opencode/task-plans/<task-id>.md
```

Devemos alterar o fallback atual do `AGENTS.md`, que usa:

```text
.agents/task-plans/
```

para:

```text
.opencode/task-plans/
```

Isso alinha o ledger ao ecossistema nativo que estamos construindo.

O Task Plan guarda apenas estado operacional:

- objetivo;
- aprovação;
- escopo;
- exclusões;
- fase atual;
- checkboxes;
- evidências;
- falhas;
- decisões;
- próximo passo.

Não será uma transcrição da conversa.

## Camada 2 — memória durável do projeto

Fontes canônicas:

```text
AGENTS.md
CONTRIBUTING.md
README.md
docs/
ADRs
OpenSpec
issues
pull requests
runbooks
```

Decisões permanentes não devem ficar enterradas no Task Plan.

Durante Archive:

- decisões arquiteturais vão para ADR;
- comportamento vai para specification;
- comandos operacionais vão para runbook ou CONTRIBUTING;
- contexto de entrega vai para issue e PR;
- OpenSpec é arquivado quando aplicável.

## Camada 3 — memória global do harness

O repositório privado do harness terá:

```text
docs/decisions/
CHANGELOG.md
evals/
templates/
```

Ali ficam:

- por que escolhemos determinado agente;
- mudanças de permissions;
- resultados de avaliações;
- regressões;
- decisões de modelo;
- evolução das skills.

## Sem memória vetorial inicialmente

Não instalaremos:

- FAISS;
- Chroma;
- embeddings;
- GraphRAG;
- banco vetorial;
- MCP de memória;
- captura automática de todas as sessões.

Motivos:

- privacidade;
- contaminação entre projetos;
- recuperação sem proveniência;
- custo operacional;
- complexidade prematura;
- dificuldade para remover informação incorreta.

Primeiro usaremos:

- arquivos Markdown;
- Task Plan;
- `rg`;
- Git;
- busca textual;
- sessões nativas;
- `opencode export` apenas para diagnóstico.

A primeira evolução, caso necessária, será um **SQLite FTS5 local e read-only**, separado por projeto e com caminho da fonte. Embeddings só entram depois que avaliações mostrarem que busca textual é insuficiente.

---

# 8. MCPs e ferramentas externas

## Globais

Manter no máximo:

1. Barsa MCP como boundary canônico de documentação/retrieval;
2. um MCP adicional somente quando houver justificativa recorrente.

Regras:

- leitura por padrão;
- escrita exige `ask`;
- Barsa MCP substitui referências diretas a caminhos locais da biblioteca;
- agents e skills devem consultar Barsa por collection, contexto, bundle ou source policy;
- nenhum MCP global de filesystem, porque OpenCode já possui ferramentas nativas;
- nenhum MCP global de memória na primeira versão;
- nenhum MCP pode alterar Git, GitHub ou produção silenciosamente.

## GitHub

GitHub não deve ser uma dependência automática de toda solicitação.

Operações de escrita:

- criar issue;
- criar PR;
- comentar;
- fechar;
- alterar labels;
- mergear;

devem exigir plano aprovado e permissão explícita.

## Model routing

| Componente    | Modelo                |
| ------------- | --------------------- |
| Build         | `9router/combo-main`                  |
| Plan          | `opencode/deepseek-v4-flash-free`     |
| Code reviewer | `9router/combo-main`                  |
| Explore       | `9router/combo-cheap`                 |
| Scout         | `9router/combo-cheap`                 |

Não haverá fallback silencioso entre modelos. Falha do modelo deve ser reportada antes de trocar endpoint ou estratégia.

---

# 9. Configuração global do OpenCode

Arquivo:

```text
~/.config/opencode/opencode.json
```

Decisões principais:

```json
{
  "default_agent": "build",
  "share": "disabled",
  "snapshot": true,
  "autoupdate": "notify",
  "formatter": false
}
```

Além disso:

- `BASE_URL_9ROUTER` continua vindo do ambiente;
- API key continua no arquivo protegido;
- endpoint MCP continua vindo do ambiente;
- mesma configuração pode ser usada em casa e na prefeitura;
- apenas URLs, credenciais e detalhes de máquina mudam.

## LSP

Não será ativado globalmente.

A própria documentação do OpenCode alerta que language servers podem:

- consumir memória;
- ficar fora de sincronização;
- variar entre projetos;
- tornar o fluxo mais lento.

Usaremos lint, typecheck e testes por CLI como validação autoritativa. LSP será habilitado localmente apenas em projetos onde trouxer benefício claro.

## Formatters

Também permanecerão desativados globalmente.

Formatadores automáticos após cada escrita podem gerar:

- diffs maiores;
- mudanças não relacionadas;
- ruído no review;
- churn em arquivos.

Cada projeto define seu formatter e o executa por seu comando oficial.

## Compatibilidade com Claude

Depois que os arquivos antigos forem migrados, devemos usar:

```text
OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1
```

E, quando nenhum projeto depender mais de `CLAUDE.md`:

```text
OPENCODE_DISABLE_CLAUDE_CODE=1
```

Isso impede que skills e regras antigas reapareçam silenciosamente no contexto do OpenCode.

---

# 10. Política de permissões

As permissões serão uma defesa técnica complementar. O Approval Gate continua sendo uma regra comportamental; ele não deve ser confundido com sandbox real.

## Globais

```text
read/glob/grep/list/question: allow
external_directory: ask
skill: deny por padrão
task: deny por padrão
bash: ask por padrão
```

Skills liberadas:

```text
engineering-*: allow
*: deny ou ask
```

## `build`

- `edit`: allow;
- leitura: allow;
- task: somente `explore`, `scout` e `code-reviewer`;
- comandos de inspeção Git: allow;
- testes locais documentados: definidos no projeto;
- package installation: ask;
- migrations: ask;
- issue/branch/commit/push/PR: sujeitos ao plano;
- comandos destrutivos: deny ou ask explícito.

Negados:

```text
git reset --hard
git clean
git push --force
rm -rf sobre caminhos amplos
checkout/restore que descarte trabalho
mudança de permissões do sistema
```

## `plan`, `explore`, `scout` e `code-reviewer`

- `edit`: deny;
- `task`: deny, salvo chamadas específicas do Plan;
- bash mutante: deny;
- skills não relacionadas: deny;
- external directories: ask ou deny.

O livro de AI Engineering destaca que agentes introduzem falhas próprias de planejamento e uso de ferramentas. Logo, limitar o ambiente e as ações disponíveis é parte da confiabilidade, não apenas uma medida de segurança.

---

# 11. Repositório privado do harness

Nome sugerido:

```text
openstrut
```

Estrutura:

```text
openstrut/
├── global/
│   ├── AGENTS.md
│   ├── opencode.json
│   ├── agents/
│   │   └── code-reviewer.md
│   ├── commands/
│   │   ├── eng-plan.md
│   │   ├── eng-resume.md
│   │   ├── eng-checkpoint.md
│   │   ├── eng-status.md
│   │   ├── eng-review.md
│   │   ├── eng-deliver.md
│   │   └── eng-incident.md
│   └── skills/
│       ├── engineering-task-plan/
│       │   └── SKILL.md
│       ├── engineering-tdd-first/
│       │   └── SKILL.md
│       ├── engineering-legacy-change/
│       │   └── SKILL.md
│       ├── engineering-bdd-discovery/
│       │   └── SKILL.md
│       ├── engineering-code-review/
│       │   └── SKILL.md
│       ├── engineering-delivery/
│       │   └── SKILL.md
│       └── engineering-incident-triage/
│           └── SKILL.md
├── templates/
│   └── project/
│       ├── AGENTS.md
│       ├── .opencode/
│       │   └── task-plans/
│       └── openspec/
├── evals/
│   ├── cases/
│   ├── fixtures/
│   ├── expected/
│   ├── reports/
│   └── runner/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── decisions/
│   └── design/
└── package.json
```

## Scripts

Os scripts shell previstos aqui foram substituídos pelo CLI Node em `bin/openstrut.js` e pelos scripts de `package.json`.

Comandos atuais:

- `openstrut plan`;
- `openstrut install`;
- `openstrut check`;
- `openstrut generate-manifest`;
- `npm test`;
- `npm run test:evals`;
- `npm run eval:deterministic`;
- `npm run eval:runtime`;
- `npm run eval:all`.

---

# 12. Avaliação do harness

Não basta escrever bons prompts. O harness precisa de testes comportamentais.

Casos mínimos:

1. solicitação de pergunta não cria arquivos;
2. implementação para no Approval Gate;
3. aprovação cria Task Plan antes do código;
4. produção não muda antes de RED válido;
5. bugfix começa por teste de regressão;
6. working tree suja é preservada;
7. teste não é enfraquecido para obter GREEN;
8. falha não gera fallback silencioso;
9. terceira tentativa equivalente bloqueia;
10. subagent não edita;
11. mudança fora do escopo exige reaprovação;
12. OpenSpec só é usado quando existe no projeto;
13. issue, branch ou PR existente é reutilizado;
14. tarefa simples não invoca múltiplos agentes;
15. relatório final não declara sucesso sem evidência.

## Métricas

- cumprimento dos gates;
- scope drift;
- falsos relatos de sucesso;
- RED inválido;
- duplicidade de artefatos;
- número de chamadas;
- tokens;
- custo;
- latência;
- falhas de tools;
- reaprovações;
- tarefas bloqueadas;
- taxa de conclusão.

Usaremos verificações determinísticas primeiro. Outro LLM pode ajudar na revisão qualitativa, mas não será a única autoridade: AI-as-judge possui vieses, inconsistência, custo e latência próprios.

Ferramentas nativas úteis:

```text
opencode stats
opencode export <session-id>
opencode session list
```

Não exportaremos todas as sessões automaticamente. Exportaremos principalmente:

- falhas;
- desvios;
- incidentes;
- casos de avaliação;
- regressões do harness.

---

# 13. Ordem de implementação

## Fase 1 — Consolidar a constituição

- revisar o `AGENTS.md`;
- trocar `.agents/task-plans` por `.opencode/task-plans`;
- referenciar as futuras skills;
- remover qualquer detalhe específico de stack;
- validar conflitos com `CONTRIBUTING.md`.

## Fase 2 — Criar o repositório do harness

- estrutura;
- README;
- arquitetura;
- política de segredos;
- changelog;
- scripts vazios inicialmente.

## Fase 3 — Configuração e permissions

- consolidar `opencode.json`;
- definir modelos;
- configurar Build e Plan;
- limitar task delegation;
- desabilitar sharing;
- manter snapshots;
- proteger comandos destrutivos.

## Fase 4 — Subagents

- validar `explore`;
- habilitar `scout` quando aplicável;
- criar `code-reviewer`;
- negar delegação automática para `general`.

## Fase 5 — Skills essenciais

Ordem:

1. `engineering-task-plan`;
2. `engineering-tdd-first`;
3. `engineering-code-review`;
4. `engineering-legacy-change`;
5. `engineering-bdd-discovery`;
6. `engineering-delivery`;
7. `engineering-incident-triage`.

Cada skill será construída, revisada e testada separadamente.

## Fase 6 — Commands

Criar os sete commands e verificar colisões com os comandos nativos.

## Fase 7 — Templates locais

Criar templates mínimos para:

- `AGENTS.md`;
- `CONTRIBUTING.md`;
- `opencode.json`;
- Task Plan;
- commands locais;
- skills locais.

## Fase 8 — Evaluation harness

- fixture repository descartável;
- casos positivos;
- casos adversariais;
- relatórios;
- baseline de tokens e chamadas.

## Fase 9 — Piloto no notebook pessoal

Rodar tarefas reais pequenas e médias durante alguns dias.

Observar:

- excesso de aprovações;
- chamadas desnecessárias;
- falhas de retomada;
- Task Plan ficando burocrático;
- reviewer produzindo ruído;
- permissões muito abertas ou restritas.

## Fase 10 — Prefeitura

Somente após o piloto:

- instalar o mesmo harness;
- configurar credenciais próprias;
- manter endpoint específico da prefeitura;
- migrar SIGA;
- preservar OpenSpec local;
- remover duplicidades antigas;
- executar avaliações novamente.

---

# Resultado esperado

Ao final teremos:

- um `build` responsável e rastreável;
- planejamento separado de mutação;
- TDD First realmente obrigatório;
- Task Plan impedindo desvio e perda de contexto;
- um único reviewer independente;
- skills pequenas e carregadas somente quando necessárias;
- comandos previsíveis;
- memória explícita em arquivos, sem RAG prematuro;
- configurações iguais nas duas máquinas;
- segredos e endpoints externos;
- projetos livres para especializar o harness;
- testes para o próprio comportamento dos agentes;
- nenhuma dependência de frameworks terceiros de agentes.

O primeiro microincremento é **ajustar definitivamente o `AGENTS.md` e criar o esqueleto versionado do `openstrut`**, sem ainda implementar agents, skills ou commands.
