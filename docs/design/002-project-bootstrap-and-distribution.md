As duas ideias são válidas, com uma separação importante:

- **o OpenCode cuida da análise semântica do projeto e da geração do `AGENTS.md` local**;
- **o pacote executado via `npx` instala, atualiza e valida o harness global**.

O instalador não deve tentar compreender arquitetura e domínio. O agente não deve gerenciar arquivos globais da máquina.

# 1. Agente para inicializar o projeto

Sim, devemos criar esse recurso.

A documentação oficial anexada mostra que o OpenCode já possui `/init`, que analisa o projeto e cria ou atualiza o `AGENTS.md`. Porém, o `/init` nativo pode modificar o arquivo diretamente e não conhece nosso Approval Gate, Task Plan, TDD First e separação de responsabilidades. [Documentação oficial anexada](sandbox:/mnt/data/opencode-documentacao-oficial.tar%281%29.gz)

Por isso, não usaremos o `/init` nativo como fluxo principal.

## Arquitetura proposta

### Subagent: `project-rules-auditor`

Será um subagent global, estritamente read-only.

Responsabilidades:

- identificar stack, módulos e fronteiras;
- ler `README`, `CONTRIBUTING`, ADRs, OpenSpec e documentação;
- localizar comandos reais de teste, lint, build e execução;
- analisar CI, Docker e task runners;
- localizar convenções Git;
- identificar regras de domínio e segurança;
- verificar o `AGENTS.md` local existente;
- detectar regras duplicadas com o `AGENTS.md` global;
- detectar contradições e conteúdo obsoleto;
- propor o conteúdo local necessário.

Configuração conceitual:

```yaml
name: project-rules-auditor
mode: subagent
model: 9router/combo-main
temperature: 0.1

permission:
  edit: deny
  bash:
    "*": deny
    "git status*": allow
    "git branch*": allow
    "git log*": allow
    "git ls-files*": allow
    "find *": allow
    "rg *": allow
    "grep *": allow
  task: deny
```

Usaremos o modelo principal porque esse trabalho envolve interpretação de arquitetura, documentação e conflitos. Não é apenas busca de arquivos.

A criação desse subagent é justificada porque a análise pode ser extensa, deve permanecer isolada do contexto principal e precisa de um contrato read-only rígido. Não estamos criando um agente para cada pequeno procedimento.

---

## Skill: `engineering-project-bootstrap`

O subagent encontra as informações. A skill define o método.

Ela ensinará:

- quais fontes devem ser inspecionadas;
- como separar regra global de regra local;
- como estruturar o `AGENTS.md` do projeto;
- como avaliar `CONTRIBUTING.md`;
- como documentar comandos oficiais;
- como detectar OpenSpec;
- como evitar regras de framework inventadas;
- como produzir o relatório de auditoria;
- quando bloquear por falta de evidência.

### Estrutura esperada do `AGENTS.md` local

```markdown
# Project Engineering Rules

## Project Purpose

## Sources of Truth

## Architecture and Boundaries

## Domain Language

## Supported Environments

## Authoritative Commands

## Testing Strategy

## Data and Security Constraints

## Git and Delivery Workflow

## Documentation and Specification Workflow

## Project-Specific Definition of Done

## Prohibited Changes
```

O arquivo local não repetirá:

- Approval Gate global;
- TDD-First global;
- prevenção de loops;
- segurança global;
- Task Plan;
- regras gerais de Git;
- contratos de delegação.

Ele conterá somente aquilo que diferencia o projeto.

---

## Command: `/eng-init-project`

Esse será o comando utilizado no lugar do `/init` nativo.

Fluxo:

```text
/eng-init-project
    ↓
build invokes project-rules-auditor
    ↓
repository audit
    ↓
proposed local rules
    ↓
conflict and gap report
    ↓
Approval Gate
    ↓
Task Plan
    ↓
create or update AGENTS.md
    ↓
review the resulting diff
```

O comando não deverá escrever nada antes da aprovação.

O resultado antes do Approval Gate terá:

```text
Repository evidence
Detected architecture
Authoritative commands
Detected local constraints
Existing instruction conflicts
Proposed AGENTS.md structure
Proposed CONTRIBUTING.md changes
Suggested local skills
Suggested local commands
Files that would be changed
```

## Command adicional: `/eng-refresh-project-rules`

Para projetos que já possuem `AGENTS.md`.

Ele executará:

- auditoria do arquivo existente;
- comparação com o estado real;
- identificação de comandos obsoletos;
- detecção de documentação nova;
- proposta de atualização;
- nenhuma mutação antes da aprovação.

## Não executar automaticamente em todo startup

Não recomendo um agente rodando e consumindo modelo em cada início do OpenCode.

Isso criaria:

- custo;
- latência;
- ruído;
- alterações frequentes;
- risco de reescrever regras estáveis;
- falsa sensação de que toda sessão exige nova configuração.

Posteriormente, podemos criar um plugin mínimo que escuta `session.created` e apenas detecta:

```text
No local AGENTS.md found.
Run /eng-init-project to create one.
```

Ele não deverá chamar modelo nem modificar arquivo.

# 2. Prompts atuais de `build` e `plan`

Podemos deixá-los fora desta etapa, mas eles não estão realmente inativos.

Enquanto o `opencode.json` tiver algo como:

```json
"prompt": "{file:.../build.txt}"
```

o conteúdo continua entrando no contexto do agente.

Portanto, vamos registrar isto como dívida conhecida (sem número de tarefa ainda;
o identificador HARNESS-002 foi reservado para o scaffold do CLI mínimo):

```text
[BACKLOG] — Audit and reconcile legacy Build and Plan prompts
```

Ordem correta:

1. terminar os artefatos do harness;
2. instalar em ambiente de teste;
3. auditar os dois prompts;
4. remover regras duplicadas;
5. preservar somente comportamento específico que não esteja no `AGENTS.md`;
6. verificar se os prompts ainda são necessários.

Não vamos alterá-los agora, mas também não faremos a avaliação final do harness enquanto eles puderem introduzir regras conflitantes.

# 3. Instalador via `npx` hospedado no homelab

Sim. Essa é a forma adequada de centralizar a instalação.

O npm permite executar via `npx` ou `npm exec` um pacote obtido do registry, de um repositório Git ou de um tarball remoto. Os package specs aceitam nomes versionados, URLs Git e URLs de arquivos `.tgz`. ([Documentação npm][1])

## Pacote

Nome sugerido:

```text
@patrese/opencode-engineering-harness
```

Binário:

```text
opencode-engineering-harness
```

Exemplo:

```json
{
  "name": "@patrese/opencode-engineering-harness",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "opencode-engineering-harness": "./bin/opencode-engineering-harness.js"
  }
}
```

## Comando final pretendido

Com registry privado:

```bash
npx --yes \
  --registry=https://npm.seu-homelab \
  @patrese/opencode-engineering-harness@0.1.0 \
  install
```

Ou inicialmente, usando um tarball versionado:

```bash
npx --yes \
  https://seu-homelab/releases/opencode-engineering-harness-0.1.0.tgz \
  install
```

A versão deve ser explícita no início. Não usaremos `latest` silenciosamente durante o piloto.

# 4. Estratégia de distribuição

## Primeira versão: tarball versionado

Mais simples:

```text
Homelab
└── releases/
    ├── opencode-engineering-harness-0.1.0.tgz
    ├── opencode-engineering-harness-0.1.1.tgz
    └── checksums.txt
```

Vantagens:

- sem manter um registry;
- fácil de publicar;
- fácil de testar;
- versão explícita;
- rollback simples.

## Segunda versão: Verdaccio

Quando o pacote estiver estável, podemos subir um registry npm privado no homelab:

```text
Verdaccio
Tailscale
@patrese scope
pacotes versionados
tokens separados por máquina
```

Então o comando fica mais limpo:

```bash
npx --yes \
  --registry=https://npm.homelab \
  @patrese/opencode-engineering-harness@stable \
  install
```

Eu não começaria instalando Verdaccio antes de o CLI estar funcional. O pacote deve ser independente do mecanismo de distribuição.

# 5. Responsabilidades do instalador

O CLI implementado nesta fase tem estes comandos:

```text
plan
install
check
generate-manifest
```

Capacidades ainda deferidas:

```text
uninstall
automatic JSON merge for conflicting files
homelab distribution workflow
```

## `install`

Deve:

1. resolver diretório alvo (`--target`, `XDG_CONFIG_HOME`, `HOME`);
2. ler a configuração atual quando existir;
3. mostrar o plano de instalação;
4. criar backup por arquivo antes de mutação;
5. instalar apenas os arquivos gerenciados do inventário;
6. preservar configurações desconhecidas e valores específicos da máquina;
7. bloquear em conflitos não gerenciados;
8. validar o resultado;
9. gravar manifesto de instalação em `.engineering-harness/installation.json`;
10. suportar `--dry-run` e saída `--json`.

## `update` (deferido)

Quando implementado, deve:

- comparar versão instalada e disponível;
- mostrar diff;
- verificar arquivos alterados manualmente;
- atualizar somente arquivos gerenciados;
- bloquear em caso de conflito;
- permitir rollback.

## `diff` (deferido)

Quando implementado, mostra:

```text
managed version
local modifications
new files
removed files
opencode.json changes
permission changes
```

Sem mutação.

## `doctor` (deferido)

Quando implementado, valida:

- JSON ou JSONC;
- schema do OpenCode;
- nomes de agents, commands e skills;
- frontmatter;
- arquivos referenciados;
- variável da base URL;
- arquivo da API key;
- permissões do arquivo secreto;
- endpoint Barsa MCP;
- colisões;
- restos de frameworks antigos;
- referências quebradas;
- versão do harness.

## `uninstall` (deferido)

Quando implementado, remove somente arquivos reconhecidos pelo manifesto.

Nunca deve apagar:

- segredos;
- arquivos locais não gerenciados;
- configurações desconhecidas;
- projetos;
- sessões;
- banco do OpenCode.

# 6. `opencode.json`

O OpenCode aceita JSON e JSONC e combina configurações globais e locais. O instalador atual não faz merge automático de JSON/JSONC.

Comportamento atual:

- `opencode.json` é artefato gerenciado do inventário;
- arquivo idêntico é aceito;
- arquivo já gerenciado e desatualizado é atualizado;
- conflito não gerenciado bloqueia a instalação;
- conflitos devem ser resolvidos manualmente;
- o manifesto registra ownership e hashes, não secrets.

Merge preservando comentários e patch por chave permanece deferido.

# 7. Arquivos gerenciados

```text
~/.config/opencode/
├── AGENTS.md
├── opencode.json
├── agents/
│   ├── code-reviewer.md
│   ├── project-rules-auditor.md
│   └── sdd.md
├── commands/
│   ├── eng-checkpoint.md
│   ├── eng-deliver.md
│   ├── eng-incident.md
│   ├── eng-init-project.md
│   ├── eng-plan.md
│   ├── eng-refresh-project-rules.md
│   ├── eng-resume.md
│   ├── eng-review.md
│   ├── eng-spec-change.md
│   └── eng-status.md
├── skills/
│   ├── engineering-bdd-discovery/
│   ├── engineering-code-review/
│   ├── engineering-delivery/
│   ├── engineering-incident-triage/
│   ├── engineering-legacy-change/
│   ├── engineering-project-bootstrap/
│   ├── engineering-sdd-change/
│   ├── engineering-task-plan/
│   └── engineering-tdd-first/
├── templates/
│   └── project/
└── .engineering-harness/
    └── installation.json
```

# 8. Manifesto de instalação

Arquivo:

```text
~/.config/opencode/.engineering-harness/installation.json
```

Exemplo:

```json
{
  "version": "0.1.0",
  "installedAt": "2026-06-16T13:00:00Z",
  "managedFiles": {
    "AGENTS.md": {
      "sha256": "..."
    },
    "agents/code-reviewer.md": {
      "sha256": "..."
    }
  },
  "unmanagedConfigPaths": ["agent.build.prompt", "agent.plan.prompt"]
}
```

Isso impede que uma atualização sobrescreva uma alteração manual silenciosamente.

# 9. Separação entre instalador e inicializador de projeto

## Instalador npm

Opera na máquina:

```text
global AGENTS
global agents
global skills
global commands
global opencode.json
```

## `/eng-init-project`

Opera dentro de um repositório:

```text
local AGENTS
local CONTRIBUTING recommendations
local commands
local skills
project opencode.json recommendations
```

O instalador não deve gerar regras de domínio.

O agente não deve modificar configurações globais da máquina.

# 10. Fluxo completo

```text
Homelab repository
        ↓
npm pack
        ↓
versioned package
        ↓
npx ... install
        ↓
global harness installed
        ↓
open project
        ↓
/eng-init-project
        ↓
read-only project audit
        ↓
proposal
        ↓
approval
        ↓
Task Plan
        ↓
local AGENTS.md
```

# Plano revisado

## Fase atual

1. fechar o `AGENTS.md` global;
2. definir o formato do Task Plan;
3. criar o repositório do harness no homelab;
4. criar o CLI mínimo;
5. implementar `install`, `diff` e `doctor`;
6. instalar somente no notebook pessoal;
7. criar `engineering-project-bootstrap`;
8. criar `project-rules-auditor`;
9. criar `/eng-init-project`;
10. testar em um repositório descartável;
11. auditar os prompts antigos de `build` e `plan`;
12. iniciar o piloto em um projeto real;
13. instalar na prefeitura depois da estabilização.

## Decisões

| Questão                                  | Decisão                            |
| ---------------------------------------- | ---------------------------------- |
| Agente para melhorar `AGENTS.md` local   | Sim                                |
| Executar automaticamente no startup      | Não                                |
| Subagent especializado                   | `project-rules-auditor`, read-only |
| Comando principal                        | `/eng-init-project`                |
| Usar `/init` nativo como fluxo principal | Não                                |
| Plugin de aviso no startup               | Posterior e sem mutação            |
| Ignorar prompts de Build/Plan agora      | Sim, mas registrar como dívida     |
| Instalar via `npx`                       | Sim                                |
| Hospedar no homelab                      | Sim                                |
| Registry privado imediatamente           | Não obrigatório                    |
| Começar com tarball versionado           | Sim                                |
| Segredos dentro do pacote                | Nunca                              |
| Sobrescrever `opencode.json`             | Nunca                              |
| Fazer merge controlado                   | Sim                                |

O próximo microincremento deve ser **criar o repositório `opencode-engineering-harness` no homelab com o esqueleto do pacote CLI e os diretórios de artefatos, sem instalar nada ainda**.

[1]: https://docs.npmjs.com/cli/v8/using-npm/package-spec/?utm_source=chatgpt.com "package-spec | npm Docs"
