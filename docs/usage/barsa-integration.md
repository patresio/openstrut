# Catalog and Extraction Guidance

The harness runtime uses the local semantic catalog as its source of truth. External extraction is optional and must be written back into Markdown before it becomes operationally relevant.

## Runtime Rule

Agents, skills, and project-facing docs must use the local selector catalog during execution.

Use:

- `global/context/` Markdown files;
- selector IDs already versioned in the repo;
- repository evidence and installed runtime docs.

Do not use:

- `/srv/docs/biblioteca/...`;
- raw ingestion paths in prompts;
- whole-library injection;
- live provider dependence during normal execution.

## Extraction Rule

If fresh external research is needed:

1. extract only the smallest useful delta;
2. convert it into reviewed Markdown inside the repo;
3. treat the committed Markdown as the new operational source.

## Examples

### Good

```text
Use `context/contexts/CTX14.md` and `context/bundles/B08.md` during runtime.
```

```text
Refresh the local catalog offline, then commit the resulting Markdown before relying on it.
```

### Bad

```text
Read everything under /srv/docs/biblioteca/opencode-docs/...
```

```text
Depend on a live MCP provider to understand selector meaning during runtime.
```

## Relationship with `mapa_operacional.xlsx`

`mapa_operacional.xlsx` is now provenance only.

It may explain where older selector groupings came from, but it is **not** the runtime API and it is **not** the semantic source of truth.

The active semantic source is the Markdown catalog under `global/context/`.

## External Research in Documentation Work

When writing or updating harness docs:

1. extract only what is needed;
2. record durable conclusions in Markdown under the repo;
3. avoid leaving important decisions only in spreadsheets, chats, or external tools.
