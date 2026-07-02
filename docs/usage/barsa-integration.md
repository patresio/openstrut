# Barsa MCP Integration

Barsa MCP is the canonical retrieval boundary for books, official documentation, and curated operational knowledge used by the harness.

## Current Collections

- `documentation`
- `technology`
- `personal`

## Retrieval Rule

Agents, skills, and project-facing docs must reference retrieval logically, not by local filesystem path.

Use:

- collection;
- context;
- bundle;
- source policy;
- project profile.

Do not use:

- `/srv/docs/biblioteca/...`;
- raw ingestion paths in prompts;
- whole-library injection.

## Routing Model

Recommended order:

1. explicit bundle;
2. context;
3. collection-wide retrieval only if needed.

This keeps prompts smaller and reduces irrelevant context.

## Examples

### Good

```text
Use Barsa MCP collection `documentation` and the smallest relevant context for OpenCode agent configuration.
```

```text
Use Barsa MCP bundle `B21` / rag-agent-core for RAG and agent design questions.
```

### Bad

```text
Read everything under /srv/docs/biblioteca/opencode-docs/...
```

## Relationship with `mapa_operacional.xlsx`

`mapa_operacional.xlsx` is a curation and planning input.

It helps define:

- contexts (`CTX##`)
- skills (`SK##`)
- agents (`AG##`)
- bundles (`B##`)
- projects (`PRJ##`)

It is **not** the runtime API.

## Barsa in Documentation Work

When writing or updating harness docs:

1. use Barsa to confirm current concepts and terminology;
2. record durable conclusions in markdown under `docs/`;
3. avoid leaving important decisions only in spreadsheets or chat.
