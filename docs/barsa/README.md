# Barsa MCP

Barsa is the canonical retrieval boundary for books, official documentation, and curated operational knowledge used by the harness.

## Collections

- `documentation`
- `technology`
- `personal`

## Routing Dimensions

- `context_id`
- `bundle_id`
- `project_id`
- `skill_id`
- `agent_id`
- `source_policy`

## Retrieval Rules

- Agents and skills should request sources by collection, context, bundle, or source policy.
- Local filesystem paths are ingestion provenance only and must not appear as the runtime retrieval interface.
- `mapa_operacional.xlsx` is an operational curation input; it is not the runtime API.
- Retrieval should prefer the smallest relevant context, not broad library injection.
