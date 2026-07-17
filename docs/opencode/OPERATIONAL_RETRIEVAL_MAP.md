# Operational Retrieval Map

## Architecture

OpenTrust uses a local semantic catalog that separates selector meaning from executable runtime artifacts and avoids runtime dependence on external retrieval infrastructure.

```
Layer 1: OpenCode Runtime
    OpenTrust agents, commands, skills, opencode.jsonc
        ↓  declares selectors (CTX / SK / AG / BUNDLE / DOC)
Layer 2: Operational Retrieval Map
    docs/opencode/reference-map/
        ↓  routes selectors to provider queries
Layer 3: Retrieval Provider
    Local provider (configured per-environment)
        ↓  returns synthesis (not raw chunks)
    Agent context (synthesized, actionable)
```

### Layer 1 — OpenCode Runtime

The execution environment. Agents declare their reference profile using selectors (CTX, SK, AG, BUNDLE, DOC). Commands and skills also declare which selectors they require.

### Layer 2 — Operational Retrieval Map

A set of curated files in `docs/opencode/reference-map/` that define:

- **CTX** — Operational contexts (knowledge domains, numbered 01–32)
- **SK** — Reusable skills (numbered 01–39)
- **AG** — *(removed — agent names used directly in prompts)*
- **BUNDLE** — Grouped context bundles (numbered 01–24)
- **DOC** — Official documentation files (numbered 01–16)

The map translates these selectors into retrieval queries for the provider layer. It does not contain book content or chunk data — only routing metadata.

### Layer 3 — Retrieval Provider

A local MCP-compatible provider that responds to selector queries with synthesized summaries. Configuration is environment-specific and not committed to version control.

## Selector System

| Selector | Prefix | Range | Purpose |
|----------|--------|-------|---------|
| Context | CTX | 01–32 | Knowledge domain or operational area |
| Skill | SK | 01–39 | Reusable procedure or methodology |
| Agent | (name) | — | Agent name used directly in prompts |
| Bundle | B | 01–24 | Grouped set of contexts for a domain |
| Doc | DOC | 01–16 | Official OpenCode documentation |

### Selector Format

```
CTX14       — single context
CTX14,CTX15 — multiple contexts
B08         — single bundle
SK08,SK09   — multiple skills
DOC_OPENCODE_CONFIG — official doc reference
```

## How Agents Use Selectors

Agents do not resolve selector meaning from external services at runtime. Instead, every agent file includes a `## Reference Profile` section and the local catalog under `global/context/` defines what each selector means.

```
Agent prompt: "I need CTX14 and B08"
    → agent or lead reads the local selector catalog
    → matching context and bundle files define scope
    → synthesis uses local Markdown plus approved repo evidence
```

## Map Files

| File | Content |
|------|---------|
| `reference-map/README.md` | Map index and usage guide |
| `reference-map/TEAM_CONTEXT_MATRIX.md` | 9 teams mapped to selectors |
| `reference-map/MCP_PROVIDER_CONTRACT.md` | Provider interface contract |

### Semantic Catalog (source of truth for selector definitions)

| Directory | Content |
|-----------|---------|
| `global/context/contexts/CTX01-32.md` | CTX01–CTX32 definitions |
| `global/context/skills/SK01-39.md` | SK01–SK39 definitions |
| `global/context/agent-maps/AG01-21.md` | Legacy agent mappings |
| `global/context/bundles/B01-24.md` | B01–B24 bundle definitions |
| `global/context/docs/DOC_OPENCODE_*.md` | Official OpenCode documentation references |

## Naming Convention

| Term | Usage |
|------|-------|
| OpenTrust Reference Library | General reference to the knowledge base |
| Operational Retrieval Map | The selector-to-query routing layer (this document) |
| Reference Profiles | Per-agent selector declarations |
| Reference Packs | Grouped selector sets for common tasks |
| Retrieval Provider | The MCP-compatible data provider |

## Retrieval Policy

1. Synthesize only — no raw chunks in agent output
2. Include source IDs (CTX, BUNDLE, SK, DOC) when available
3. No raw book content, excerpts, or internal library names in versioned files
4. Use only selectors approved in the task contract
5. Keep runtime semantics local — external retrieval may refresh the catalog but must not be required during execution
