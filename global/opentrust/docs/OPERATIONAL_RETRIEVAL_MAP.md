# Operational Retrieval Map

## Architecture

OpenTrust uses a local semantic catalog so selector meaning stays explicit, versioned, and independent of external retrieval infrastructure.

```
Layer 1: OpenCode Runtime
    OpenTrust agents, commands, skills, opencode.jsonc
        ↓  declares selectors (CTX / SK / B / DOC)
Layer 2: Local Semantic Catalog
    global/context/
        ↓  defines selector meaning and runtime mappings
Layer 3: Optional Enrichment
    manual extraction or offline refresh into Markdown
        ↓  updates the local catalog when needed
```

### Layer 1 — OpenCode Runtime

The execution environment. Agents declare their reference profile using selectors (CTX, SK, B, DOC). Agent names are runtime identities, not selector IDs.

### Layer 2 — Local Semantic Catalog

A curated set of Markdown files in `global/context/` that define:

- **CTX** — Operational contexts (knowledge domains, numbered 01–32)
- **SK** — Semantic skill maps (numbered 01–39)
- **AG** — Legacy or compatibility agent maps (numbered 01–21; not active runtime selectors)
- **BUNDLE** — Grouped context bundles (numbered 01–24)
- **DOC** — Official documentation references used by runtime prompts

The catalog is the runtime semantic source of truth. It contains local summaries, mappings, and policy notes — not raw excerpts.

### Layer 3 — Optional Enrichment

External research may be used only to refresh the local Markdown catalog. Runtime behavior must not depend on a live provider.

## Selector System

| Selector | Prefix | Range | Purpose |
|----------|--------|-------|---------|
| Context | CTX | 01–32 | Knowledge domain or operational area |
| Skill | SK | 01–39 | Semantic procedure map |
| Agent map | AG | 01–21 | Legacy or compatibility capability map |
| Bundle | B | 01–24 | Grouped set of contexts for a domain |
| Doc | DOC | symbolic | Official OpenCode documentation reference |

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
| `global/context/README.md` | Catalog overview and rules |
| `global/context/contexts/*.md` | CTX01–CTX32 definitions |
| `global/context/skills/*.md` | SK01–SK39 semantic skill maps |
| `global/context/agent-maps/*.md` | AG01–AG21 legacy/runtime mapping docs |
| `global/context/bundles/*.md` | B01–B24 bundle definitions |
| `global/context/docs/*.md` | Official documentation references |
| `reference-map/TEAM_CONTEXT_MATRIX.md` | 9 teams mapped to selectors |
| `reference-map/MCP_PROVIDER_CONTRACT.md` | Historical provider contract reference |

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
