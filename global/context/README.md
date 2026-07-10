# Local Semantic Context Catalog

Local, versioned selector catalog.

## Purpose
- make CTX/SK/AG/B/DOC meanings explicit
- keep semantic selector docs separate from executable runtime artifacts
- use repo-local sources only

## Structure
- `contexts/` — `CTX01`–`CTX32`
- `skills/` — `SK01`–`SK39`
- `agent-maps/` — `AG01`–`AG21`
- `bundles/` — `B01`–`B24`
- `docs/` — referenced `DOC_*`

## Rules
- AG files are mapping docs only, never executable agents.
- SK files are mapping docs only, never executable skills.
- Missing exact semantics must be marked, not invented.
- Source paths in this catalog are provenance, not runtime retrieval APIs.

See `INDEX.md`, `MIGRATION_POLICY.md`, `RELATIONS.md`, `DEPRECATIONS.md`.
