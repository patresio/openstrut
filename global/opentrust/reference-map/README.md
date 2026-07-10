# OpenTrust Reference Map

## Overview

The Reference Map is the routing layer between OpenTrust agents and the local semantic catalog. It defines available selectors (CTX, SK, BUNDLE, DOC) plus legacy AG mappings, and points teams to the catalog files that explain each selector.

## Files

| File | Content |
|------|---------|
| `../context/contexts/*.md` | CTX01–CTX32 definitions — knowledge domain descriptions |
| `../context/skills/*.md` | SK01–SK39 semantic skill maps |
| `../context/agent-maps/*.md` | AG01–AG21 legacy or compatibility agent mappings |
| `../context/bundles/*.md` | B01–B24 bundle definitions (grouped contexts) |
| `../context/docs/*.md` | official documentation references |
| `TEAM_CONTEXT_MATRIX.md` | 9 teams mapped to their primary/secondary selectors |
| `MCP_PROVIDER_CONTRACT.md` | historical provider contract reference |

## How to Use

1. Find your team in `TEAM_CONTEXT_MATRIX.md`
2. Look up the CTX/BUNDLE/SK/DOC selectors for your task
3. Include these selectors in your task contract's `# Retrieval Context` section
4. Use the local catalog entries as the semantic source of truth during execution

## Selector Reference

| Selector | File | Format |
|----------|------|--------|
| CTX01–32 | `../context/contexts/*.md` | `CTXX — Title (brief description)` |
| SK01–39 | `../context/skills/*.md` | `SKXX — Title (brief description)` |
| AG01–21 | `../context/agent-maps/*.md` | `AGXX — Title (legacy/runtime mapping summary)` |
| B01–24 | `../context/bundles/*.md` | `BXX — Title (included CTX list)` |
| DOC_* | `../context/docs/*.md` | `DOC_* — Title (file reference)` |

## Naming Convention

| Term | Usage |
|------|-------|
| OpenTrust Reference Library | General knowledge base |
| Operational Retrieval Map | The selector routing architecture |
| Reference Map | This directory — the selector definitions |
| Reference Profiles | Per-agent selector declarations |
| Reference Packs | Grouped selector sets |
| Retrieval Provider | The MCP data provider |
