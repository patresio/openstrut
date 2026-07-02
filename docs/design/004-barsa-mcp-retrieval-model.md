# Design 004 — Barsa MCP Retrieval Model

## Status

Proposed and documented as current harness retrieval direction.

## Problem

Some project-facing docs still reference local library filesystem paths such as `/srv/docs/biblioteca/...`.

Those paths are ingestion provenance, not a stable runtime interface for agents, skills, or prompts.

## Decision

The harness will treat Barsa MCP as the canonical retrieval boundary for:

- books;
- official documentation;
- curated operational knowledge.

Agents and skills must reference logical routing keys instead of filesystem source paths.

## Routing Model

Preferred routing dimensions:

1. collection
2. context_id
3. bundle_id
4. project_id
5. skill_id
6. agent_id
7. source_policy

## Consequences

### Positive

- Removes coupling between prompts and local filesystem layout.
- Allows ingestion, reindexing, or storage changes without rewriting agent-facing instructions.
- Supports smaller, more intentional retrieval units through bundles and contexts.
- Aligns retrieval with MCP tool boundaries instead of ad hoc path knowledge.

### Negative

- Requires curation discipline to keep contexts, bundles, and source policies accurate.
- Requires a reviewed textual catalog so spreadsheets are not the only planning artifact.

## Current Operational Inputs

- `mapa_operacional.xlsx` remains a curation input.
- `docs/barsa/*.md` become the reviewed textual summary layer.
- `references/` manifests may note historical origin, but should not prescribe local path usage.

## Explicit Rule

Do not reference `/srv/docs/biblioteca` in agent, skill, or project-facing runtime instructions.

## Deferred Work

- Materialize selected Barsa-backed domain agents and skills.
- Add eval cases for routing by context and bundle.
- Replace spreadsheet-only planning with reviewed textual catalogs and specs.
