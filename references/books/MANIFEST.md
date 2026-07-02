# 📚 Manifesto de Livros de Referência

> **Caminho base:** `references/books/`
> **Fonte lógica:** Barsa MCP — collections curadas para livros e conhecimento operacional
> **Catálogo operacional:** `mapa_operacional.xlsx`
> **Observação:** caminhos locais da biblioteca são detalhes de ingestão e não devem ser usados como interface do harness
> **Atualizado em:** 2026-06-16

---

## Coleção 1 — NotebookLM_AGENTS: Engenharia de Software

Livros sobre práticas de desenvolvimento, testes, arquitetura e craft de software.

### 🏗️ Núcleo — Fundamentos e Craft

| # | Arquivo | Título |
|---|---------|--------|
| 10 | [10_NUCLEO_O_Programador_Pragmatico.pdf](./10_NUCLEO_O_Programador_Pragmatico.pdf) | O Programador Pragmático |
| 11 | [11_NUCLEO_Extreme_Programming_Explained.pdf](./11_NUCLEO_Extreme_Programming_Explained.pdf) | Extreme Programming Explained |
| 12 | [12_NUCLEO_TDD_By_Example.pdf](./12_NUCLEO_TDD_By_Example.pdf) | TDD By Example |
| 13 | [13_NUCLEO_Refatoracao_Martin_Fowler.pdf](./13_NUCLEO_Refatoracao_Martin_Fowler.pdf) | Refatoração — Martin Fowler |
| 14 | [14_NUCLEO_Trabalho_Eficaz_Com_Codigo_Legado.pdf](./14_NUCLEO_Trabalho_Eficaz_Com_Codigo_Legado.pdf) | Trabalho Eficaz com Código Legado |
| 15 | [15_NUCLEO_Entrega_Continua.pdf](./15_NUCLEO_Entrega_Continua.pdf) | Entrega Contínua |
| 16 | [16_NUCLEO_Domain_Driven_Design_Rapido.pdf](./16_NUCLEO_Domain_Driven_Design_Rapido.pdf) | Domain-Driven Design Rápido |
| 17 | [17_NUCLEO_The_Software_Craftsman.pdf](./17_NUCLEO_The_Software_Craftsman.pdf) | The Software Craftsman |

### 🧪 Testes

| # | Arquivo | Título |
|---|---------|--------|
| 20 | [20_TESTES_BDD_In_Action.pdf](./20_TESTES_BDD_In_Action.pdf) | BDD in Action |
| 21 | [21_TESTES_More_Agile_Testing.pdf](./21_TESTES_More_Agile_Testing.pdf) | More Agile Testing |

### 🏛️ Arquitetura

| # | Arquivo | Título |
|---|---------|--------|
| 30 | [30_ARQUITETURA_Arquitetura_Limpa.pdf](./30_ARQUITETURA_Arquitetura_Limpa.pdf) | Arquitetura Limpa |
| 31 | [31_ARQUITETURA_Principios_Design_Padroes.pdf](./31_ARQUITETURA_Principios_Design_Padroes.pdf) | Princípios, Design e Padrões |

### ⚖️ Contraponto

| # | Arquivo | Título |
|---|---------|--------|
| 90 | [90_CONTRAPONTO_Codigo_Limpo.pdf](./90_CONTRAPONTO_Codigo_Limpo.pdf) | Código Limpo (Contraponto) |

---

## Coleção 2 — NotebookLM_IA_Agentes: IA e LLMs

Livros sobre engenharia de IA, Large Language Models e desenvolvimento de agentes.

### 🤖 Núcleo — IA e Agentes

| # | Arquivo | Título |
|---|---------|--------|
| 10 | [10_NUCLEO_AI_Engineering.pdf](./10_NUCLEO_AI_Engineering.pdf) | AI Engineering |
| 11 | [11_NUCLEO_Hands_On_Large_Language_Models.pdf](./11_NUCLEO_Hands_On_Large_Language_Models.pdf) | Hands-On Large Language Models |
| 12 | [12_NUCLEO_Building_LLMs_For_Production.pdf](./12_NUCLEO_Building_LLMs_For_Production.pdf) | Building LLMs for Production |
| 13 | [13_NUCLEO_Building_Applications_With_AI_Agents.pdf](./13_NUCLEO_Building_Applications_With_AI_Agents.pdf) | Building Applications with AI Agents |

---

## Resumo

| Coleção | Categoria | Livros |
|---------|-----------|--------|
| AGENTS | Núcleo (craft/dev) | 8 |
| AGENTS | Testes | 2 |
| AGENTS | Arquitetura | 2 |
| AGENTS | Contraponto | 1 |
| IA_Agentes | Núcleo (IA/LLM) | 4 |
| **Total** | | **17** |

---

## Como usar este manifesto

Este arquivo serve como índice de consulta rápida para todos os PDFs disponíveis em `references/books/`.  
Ao referenciar um livro em discussões, documentos de design ou decisões arquiteturais, use o link relativo da tabela acima.

Exemplo de citação em documento:
```markdown
> Ver: [Entrega Contínua](../references/books/15_NUCLEO_Entrega_Continua.pdf) — capítulo sobre pipelines de deploy
```
