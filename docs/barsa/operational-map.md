# Operational Map Summary

Derived from `mapa_operacional.xlsx`.

## Current Scope

- 236 visible books in the snapshot
- 16 aggregated official documentation sets
- 32 semantic contexts
- 18 specified skills
- 12 specified agents
- 24 MCP bundles
- 12 project profiles

## Canonical Runtime Boundary

This operational map informs Barsa curation, but agents must consume Barsa through logical routing keys instead of filesystem paths.

## Routing Layers

1. Collection (`documentation`, `technology`, `personal`)
2. Context (`CTX##`)
3. Bundle (`B##`)
4. Project profile (`PRJ##`)
5. Skill (`SK##`)
6. Agent (`AG##`)

## Recommended Initial Focus

- `PRJ07` MCP/RAG
- `AG11` ai-rag-agent-architect
- `SK17` rag-agent-design
- `B21` rag-agent-core

## Notes

- Filesystem source IDs in the spreadsheet should be treated as ingestion provenance.
- Runtime prompts should reference contexts, bundles, and source policies instead of local paths.
- Review-oriented and low-trust sources should stay out of default retrieval unless explicitly requested.
