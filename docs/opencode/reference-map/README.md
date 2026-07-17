# OpenTrust Reference Map

## Overview

The Reference Map is the routing layer between OpenTrust agents and the local semantic catalog. It defines available selectors (CTX, SK, BUNDLE, DOC) plus legacy AG mappings, and points teams to the catalog files that explain each selector.

The actual selector definitions live in `global/context/` (the semantic catalog). This README provides the routing metadata.

## Files

| File | Content |
|------|---------|
| `TEAM_CONTEXT_MATRIX.md` | 9 teams mapped to their primary/secondary selectors |
| `MCP_PROVIDER_CONTRACT.md` | Retrieval Provider interface and response contract |

### Semantic Catalog (source of truth for selector definitions)

| Directory | Content |
|-----------|---------|
| `global/context/contexts/CTX01-32.md` | CTX01–CTX32 definitions — knowledge domain descriptions |
| `global/context/skills/SK01-39.md` | SK01–SK39 definitions — reusable skill descriptions |
| `global/context/agent-maps/AG01-21.md` | Legacy agent mappings (informational only) |
| `global/context/bundles/B01-24.md` | B01–B24 bundle definitions (grouped contexts) |
| `global/context/docs/DOC_OPENCODE_*.md` | Official OpenCode documentation references |
| `global/context/skills/MAPPING.md` | SK selector → runtime skill mapping |

## How to Use

1. Find your team in `TEAM_CONTEXT_MATRIX.md`
2. Look up the CTX/BUNDLE/SK/DOC selectors for your task
3. Include these selectors in your task contract's `# Retrieval Context` section
4. Use the local catalog entries (`global/context/`) as the semantic source of truth during execution

## Selector Reference

| Selector | Catalog Location | Format |
|----------|-----------------|--------|
| CTX01–32 | `global/context/contexts/CTXX.md` | `CTXX — Title (brief description)` |
| SK01–39 | `global/context/skills/SKXX.md` | `SKXX — Title (brief description)` |
| agent-name | `global/agents/*.md` | `description, role, responsibilities` |
| B01–24 | `global/context/bundles/BXX.md` | `BXX — Title (included CTX list)` |
| DOC_* | `global/context/docs/DOC_OPENCODE_*.md` | `DOC_* — Title (file reference)` |

## Naming Convention

| Term | Usage |
|------|-------|
| OpenTrust Reference Library | General knowledge base |
| Operational Retrieval Map | The selector routing architecture |
| Reference Map | This directory — the routing metadata |
| Semantic Catalog | `global/context/` — the actual selector definitions |
| Reference Profiles | Per-agent selector declarations |
| Reference Packs | Grouped selector sets |
| Retrieval Provider | The MCP data provider (Barsa) |
