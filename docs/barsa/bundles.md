# Barsa Bundles Map

Derived from `mapa_operacional.xlsx` sheet `05_BUNDLES`.

## Current Bundle Count

- 24 bundles (`B01` to `B24`)

## Bundle Role

Bundles are small, intentional retrieval sets for real problems. They should be the preferred retrieval unit before broader collection-wide search.

## Examples

- `B01` knowledge-core
- `B08` architecture-core
- `B14` sre-production-core
- `B21` rag-agent-core
- `B23` exercise-health-core
- `B24` nutrition-meal-prep-core

## Runtime Rule

Agents should prefer:

1. explicit bundle;
2. then context;
3. then collection-wide retrieval.

This keeps prompt size smaller and reduces irrelevant context injection.
