# Context Routing Keys

Mapeamento dos CTX IDs para tópicos legíveis, agentes/skills associados.

## CTX14 — Software Architecture & Design
- **Tópico:** Arquitetura de software, design patterns, decisões estruturais
- **Agentes:** `software-architect`, `harness-generator`, `documentation-generator`
- **Skills:** `architecture-decision`, `domain-modeling`
- **Bundles associados:** B01, B05

## CTX23 — Code Quality & Testing
- **Tópico:** Qualidade de código, testes automatizados, TDD, refatoração
- **Agentes:** `code-quality-testing-reviewer`, `code-reviewer`, `project-rules-auditor`
- **Skills:** `testing-strategy`, `code-refactoring`, `engineering-tdd-first`
- **Bundles associados:** B08, B12

## CTX27 — Engineering Workflow & Cowork
- **Tópico:** Workflows de engenharia, trabalho colaborativo, orquestração
- **Agentes:** `team-cowork-orchestration`, `worktree-lifecycle-management`
- **Skills:** `team-cowork-orchestration`, `worktree-lifecycle-management`
- **Bundles associados:** B15, B18

## CTX29 — RAG & AI Agents (Foundations)
- **Tópico:** Fundamentos de RAG, agentes de IA, arquitetura de retrieval
- **Agentes:** `ai-rag-agent-architect`
- **Skills:** `rag-agent-design`
- **Bundles associados:** B21

## CTX30 — RAG & AI Agents (Advanced)
- **Tópico:** RAG avançado, fine-tuning, avaliação de agentes
- **Agentes:** `ai-rag-agent-architect`
- **Skills:** `rag-agent-design`, `distributed-systems-review`
- **Bundles associados:** B22

## CTX31 — RAG & AI Agents (Production)
- **Tópico:** RAG em produção, monitoramento, segurança de agentes
- **Agentes:** `ai-rag-agent-architect`, `security-infrastructure-reviewer`
- **Skills:** `rag-agent-design`, `security-review`
- **Bundles associados:** B23

## Notas

- Estes mapeamentos são **lógicos** — a ferramenta Barsa atual aceita `collection`, `query`, `top_k`, `subcategories`, não `context_id` explícito. A coluna `context_id` nos prompts serve como chave de roteamento semântico, não filtro obrigatório.
- A rastreabilidade exata via `context_id` requer evolução do MCP (ver HARNESS-SEC-003).
- Prefira bundle antes de busca ampla quando bundle estiver mapeado.
