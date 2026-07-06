# Context Routing Keys

Mapeamento dos CTX IDs para tópicos legíveis, agentes/skills associados.

## CTX14 — Software Architecture & Design
- **Tópico:** Arquitetura de software, design patterns, decisões estruturais
- **Agentes:** `software-architect`, `harness-generator`, `documentation-generator`, `skill-creator`
- **Skills:** `architecture-decision`, `domain-modeling`
- **Bundles associados:** B01, B05

## CTX23 — Code Quality & Testing
- **Tópico:** Qualidade de código, testes automatizados, TDD, refatoração
- **Agentes:** `code-quality-testing-reviewer`, `code-reviewer`, `project-rules-auditor`, `skill-creator`
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

## CTX01 — Knowledge Systems & Personal Knowledge Management
- **Tópico:** Sistemas pessoais de conhecimento, Obsidian, notas, organização, segundo cérebro
- **Agentes:** `knowledge-system-designer`
- **Skills:** `knowledge-system-design`, `learning-plan-design`
- **Bundles associados:** B01

## CTX02 — Learning & Knowledge Capture
- **Tópico:** Aprendizado, captura de conhecimento, zettelkasten, notas atômicas
- **Agentes:** `knowledge-system-designer`
- **Skills:** `learning-plan-design`, `knowledge-system-design`
- **Bundles associados:** B02

## CTX03 — Personal Productivity & Organization
- **Tópico:** Produtividade pessoal, organização, GTD, PARA, hábitos, execução
- **Agentes:** `knowledge-system-designer`
- **Skills:** `personal-execution-system`, `learning-plan-design`
- **Bundles associados:** B03

## CTX09 — Business Strategy & Product
- **Tópico:** Estratégia de negócio, produto, finanças, operação, liderança
- **Agentes:** `business-product-strategist`, `frontend-ux-reviewer`
- **Skills:** `product-discovery`, `financial-organization`, `leadership-feedback`, `frontend-ux-review`
- **Bundles associados:** B09

## CTX15 — Domain Modeling & Design
- **Tópico:** Modelagem de domínio, bounded contexts, agregados, eventos, DDD
- **Agentes:** `software-architect`, `documentation-generator`
- **Skills:** `domain-modeling`, `architecture-decision`
- **Bundles associados:** B05

## CTX20 — DevOps, SRE & Infrastructure
- **Tópico:** Entrega contínua, confiabilidade, observabilidade, infraestrutura, Git workflow
- **Agentes:** `devops-sre-advisor`, `team-cowork-orchestration`, `skill-creator`
- **Skills:** `devops-sre-diagnostics`, `worktree-lifecycle-management`, `team-cowork-orchestration`, `distributed-systems-review`, `architecture-decision`
- **Bundles associados:** B15, B18

## Notas

- Estes mapeamentos são **lógicos** — a ferramenta Barsa atual aceita `collection`, `query`, `top_k`, `subcategories`, não `context_id` explícito. A coluna `context_id` nos prompts serve como chave de roteamento semântico, não filtro obrigatório.
- A rastreabilidade exata via `context_id` requer evolução do MCP (ver HARNESS-SEC-003).
- Prefira bundle antes de busca ampla quando bundle estiver mapeado.
