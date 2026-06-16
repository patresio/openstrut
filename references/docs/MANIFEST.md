# 📖 Manifesto de Documentação — OpenCode

> **Caminho base:** `references/docs/`  
> **Fonte original:** `/srv/docs/biblioteca/opencode-docs/packages/web/src/content/docs/`  
> **Idioma:** Inglês (documentação oficial raiz)  
> **Formato:** MDX (Markdown + JSX)  
> **Atualizado em:** 2026-06-16

---

## 🚀 Getting Started

| Arquivo | Título | Descrição |
|---------|--------|-----------|
| [index.mdx](./index.mdx) | Intro | Get started with OpenCode. |
| [tui.mdx](./tui.mdx) | TUI | Using the OpenCode terminal user interface. |
| [web.mdx](./web.mdx) | Web | Using OpenCode in your browser. |
| [ide.mdx](./ide.mdx) | IDE | The OpenCode extension for VS Code, Cursor, and other IDEs. |
| [windows-wsl.mdx](./windows-wsl.mdx) | Windows (WSL) | Run OpenCode on Windows using WSL for the best experience. |
| [troubleshooting.mdx](./troubleshooting.mdx) | Troubleshooting | Common issues and how to resolve them. |

---

## ⚙️ Configuration

| Arquivo | Título | Descrição |
|---------|--------|-----------|
| [config.mdx](./config.mdx) | Config | Using the OpenCode JSON config. |
| [models.mdx](./models.mdx) | Models | Configuring an LLM provider and model. |
| [providers.mdx](./providers.mdx) | Providers | Using any LLM provider in OpenCode. |
| [keybinds.mdx](./keybinds.mdx) | Keybinds | Customize your keybinds. |
| [themes.mdx](./themes.mdx) | Themes | Select a built-in theme or define your own. |
| [network.mdx](./network.mdx) | Network | Configure proxies and custom certificates. |
| [permissions.mdx](./permissions.mdx) | Permissions | Control which actions require approval to run. |
| [policies.mdx](./policies.mdx) | Policies | Control which configured resources OpenCode may use. |

---

## 🤖 Agents & Tools

| Arquivo | Título | Descrição |
|---------|--------|-----------|
| [agents.mdx](./agents.mdx) | Agents | Configure and use specialized agents. |
| [tools.mdx](./tools.mdx) | Tools | Manage the tools an LLM can use. |
| [custom-tools.mdx](./custom-tools.mdx) | Custom Tools | Create tools the LLM can call in opencode. |
| [mcp-servers.mdx](./mcp-servers.mdx) | MCP servers | Add local and remote MCP tools. |
| [skills.mdx](./skills.mdx) | Agent Skills | Define reusable behavior via SKILL.md definitions. |
| [rules.mdx](./rules.mdx) | Rules | Set custom instructions for opencode. |
| [commands.mdx](./commands.mdx) | Commands | Create custom commands for repetitive tasks. |

---

## 🔗 Integrations

| Arquivo | Título | Descrição |
|---------|--------|-----------|
| [github.mdx](./github.mdx) | GitHub | Use OpenCode in GitHub issues and pull-requests. |
| [gitlab.mdx](./gitlab.mdx) | GitLab | Use OpenCode in GitLab issues and merge requests. |
| [acp.mdx](./acp.mdx) | ACP Support | Use OpenCode in any ACP-compatible editor. |
| [lsp.mdx](./lsp.mdx) | LSP Servers | OpenCode integrates with your LSP servers. |
| [formatters.mdx](./formatters.mdx) | Formatters | OpenCode uses language specific formatters. |
| [go.mdx](./go.mdx) | Go | Low cost subscription for open coding models. |

---

## 🏗️ Developer & API

| Arquivo | Título | Descrição |
|---------|--------|-----------|
| [sdk.mdx](./sdk.mdx) | SDK | Type-safe JS client for opencode server. |
| [server.mdx](./server.mdx) | Server | Interact with opencode server over HTTP. |
| [cli.mdx](./cli.mdx) | CLI | OpenCode CLI options and commands. |
| [plugins.mdx](./plugins.mdx) | Plugins | Write your own plugins to extend OpenCode. |
| [references.mdx](./references.mdx) | References | Add local directories and Git repositories as project references. |

---

## 📦 Ecosystem & Enterprise

| Arquivo | Título | Descrição |
|---------|--------|-----------|
| [ecosystem.mdx](./ecosystem.mdx) | Ecosystem | Projects and integrations built with OpenCode. |
| [enterprise.mdx](./enterprise.mdx) | Enterprise | Using OpenCode securely in your organization. |
| [share.mdx](./share.mdx) | Share | Share your OpenCode conversations. |
| [zen.mdx](./zen.mdx) | Zen | Curated list of models provided by OpenCode. |

---

## Resumo

| Categoria | Documentos |
|-----------|-----------|
| Getting Started | 6 |
| Configuration | 8 |
| Agents & Tools | 7 |
| Integrations | 6 |
| Developer & API | 5 |
| Ecosystem & Enterprise | 4 |
| **Total** | **36** |

---

## Como usar este manifesto

Este arquivo serve como índice de navegação rápida para toda a documentação oficial do OpenCode disponível em `references/docs/`.

Exemplo de citação em documentos de design:
```markdown
> Ver: [MCP servers](../references/docs/mcp-servers.mdx) — integração com ferramentas externas via Model Context Protocol
> Ver: [Agents](../references/docs/agents.mdx) — configuração de agentes especializados
```

> **Nota:** Os arquivos `.mdx` usam frontmatter YAML + Markdown + JSX. 
> Para ler apenas o conteúdo textual, ignore os blocos `<` e `>` e o frontmatter entre `---`.
