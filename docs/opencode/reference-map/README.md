# OpenTrust Reference Map

## Overview

The Reference Map is the routing layer between OpenTrust agents and the local semantic catalog. It defines available selectors (CTX, SK, BUNDLE, DOC) plus legacy AG mappings, and points teams to the catalog files that explain each selector.

## Files

| File | Content |
|------|---------|
| `CONTEXTS.md` | CTX01–CTX32 definitions — knowledge domain descriptions |
| `SKILLS.md` | SK01–SK39 definitions — reusable skill descriptions |
| ~~`AGENTS_LEGACY_MAP.md`~~ | *(removed — references replaced with current agent names)* |
| `BUNDLES.md` | B01–B24 bundle definitions (grouped contexts) |
| `OFFICIAL_DOCS.md` | DOC01–DOC16 official OpenCode documentation references |
| `TEAM_CONTEXT_MATRIX.md` | 9 teams mapped to their primary/secondary selectors |
| `MCP_PROVIDER_CONTRACT.md` | Retrieval Provider interface and response contract |

## How to Use

1. Find your team in `TEAM_CONTEXT_MATRIX.md`
2. Look up the CTX/BUNDLE/SK/DOC selectors for your task
3. Include these selectors in your task contract's `# Retrieval Context` section
4. Use the local catalog entries as the semantic source of truth during execution

## Selector Reference

| Selector | File | Format |
|----------|------|--------|
| CTX01–32 | `CONTEXTS.md` | `CTXX — Title (brief description)` |
| SK01–39 | `SKILLS.md` | `SKXX — Title (brief description)` |
| agent-name | per-agent prompt files | `description, role, responsibilities` |
| B01–24 | `BUNDLES.md` | `BXX — Title (included CTX list)` |
| DOC01–16 | `OFFICIAL_DOCS.md` | `DOCXX — Title (file reference)` |

## Naming Convention

| Term | Usage |
|------|-------|
| OpenTrust Reference Library | General knowledge base |
| Operational Retrieval Map | The selector routing architecture |
| Reference Map | This directory — the selector definitions |
| Reference Profiles | Per-agent selector declarations |
| Reference Packs | Grouped selector sets |
| Retrieval Provider | The MCP data provider |
